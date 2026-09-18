/* ================= 天道打工人 · 图片资产管线（混合方案） =================
   三层回退：
   1) 本地 img/<key>.jpg —— 你自己抽卡的图，按清单文件名存成 jpg 丢进 img/ 即自动优先
   2) 在线生成图        —— 按 prompt 运行时生成（与神格头像同管线，免费）
   3) 隐藏回退          —— 都失败时露出下层墨字/SVG 兜底
   抽卡清单见《img资产清单.md》（由本清单生成）。 */

const ASSET = {
  /* 统一风格后缀（与 GODS.img 水墨风一致） */
  INK : 'Chinese ink wash painting, sumi-e style, dark ink strokes, rice paper texture',
  ICON: 'centered on plain rice paper background, simple bold ink silhouette, game icon, no text',

  list: {},   /* key -> [prompt, size] */

  /* 本地真图别名：玩家升品立绘复用九品真图（同角色；图床新图需内部认证已无法生成） */
  ALIAS: {},

  /* ---- 在线生成 URL（图床新图需内部认证，浏览器永远拿到占位图；仅保留备用，默认不再调用） ---- */
  url(key){
    const a=this.list[key]; if(!a) return '';
    return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt='
      + encodeURIComponent(a[0]) + '&image_size=' + a[1];
  },
  file(key){ key=this.ALIAS[key]||key; return 'img/'+key+'.jpg'; },
  avatarFile(gid){ return 'img/av_'+gid+'.jpg'; },

  /* ---- 本地图探测（Promise + 缓存） ----
     三种结论：true=有本地图(已下载) / false=坐实缺失(404，永久水墨兜底) / undefined=本次网络失败(不坐实，下次还能再试) */
  _probe:{}, _probeQueue:[], _probeInflight:{}, _missing:{},

  /* 单次取图：区分 成功 / 404永久缺失 / 网络失败（用 HEAD 验明，HEAD 不经 SW 不耗流量）
     带 18 秒硬超时：弱网下 socket 半死（onload/onerror 都不触发）不能无限挂住队列 */
  async _loadOnce(url){
    const done=await Promise.race([
      new Promise(res=>{
        const im=new Image();
        im.onload =()=>res(true);
        im.onerror=()=>res(false);
        im.src=url;
      }),
      new Promise(res=>setTimeout(()=>res('timeout'),18000)),
    ]);
    if(done==='timeout') return 'fail';
    if(done) return 'ok';
    try{
      const hr=await fetch(url,{method:'HEAD',cache:'no-store'});
      if(hr.status===404) return 'missing';
    }catch(e){ /* 断网时 HEAD 也失败 → 视为网络抖动 */ }
    return 'fail';
  },

  hasLocal(key){
    const f=this.file(key);
    if(this._probe[f]===true) return Promise.resolve(true);
    if(this._probe[f]===false || this._missing[f]) return Promise.resolve(false);
    if(this._probeInflight[f]) return this._probeInflight[f];
    const p=(async()=>{
      /* 网络失败自动补一次；仍失败则本次回退 SVG，但不坐实，后续 preload/warm 还能再拉 */
      let st=await this._loadOnce(f);
      if(st==='fail') st=await this._loadOnce(f);
      if(st==='ok'){
        this._probe[f]=true;
      }else if(st==='missing'){
        this._probe[f]=false; this._missing[f]=1;
      }
      this._probeInflight[f]=null;
      this._flush(f);
      return this._probe[f]===true;
    })();
    this._probeInflight[f]=p;
    return p;
  },
  _flush(f){ this._probeQueue.splice(0).forEach(fn=>fn()); },

  /* ---- 最终 src：本地真图优先 → 程序化水墨 SVG 兜底（图床接口已需认证，不再直连） ---- */
  async src(key){
    if(!this.list[key]) return '';
    /* 真实业务请求优先：后台预热主动让路 12 秒，避免占满同域连接 */
    this._warmPauseUntil=Date.now()+12000;
    if(await this.hasLocal(key)) return this.file(key);
    const svg=this.svg(key);
    return svg ? 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg) : '';
  },

  /* ==================================================================
     预加载体系
     - preload(keys)：进门必修，并发拉取 + 坐实本地探测（有/无都缓存结论）
     - warm(keys)   ：进门后空闲预热，低并发、真实请求让路、同 URL 去重
     所有下载都经过浏览器缓存（并被 Service Worker 持久化），消费方零等待
     ================================================================== */
  preload(keys, opt){
    opt=opt||{};
    const conc=opt.conc||8;
    const list=(keys||[]).filter((v,i,a)=>v&&a.indexOf(v)===i);
    let done=0, fail=0, missing=0;
    const tick=()=>{ try{ if(opt.onprogress) opt.onprogress(done+missing, list.length, {done,fail,missing}); }catch(e){} };
    const q=list.slice();
    function worker(){
      const key=q.shift();
      if(key===undefined) return Promise.resolve();
      /* 任何异常都只能计 fail，绝不允许 worker reject ——
         否则 Promise.all 拒绝会让整道门以失败结算、后续动作被跳过（卡在原页面） */
      return ASSET._preloadOne(key).then(st=>{
        if(st==='fail'){ fail++; /* 不标记 warmDone，留给后续重试与预热 */ }
        else{ if(st==='missing') missing++; else done++; ASSET._warmDone[key]=1; }
        tick();
        return worker();
      }).catch(()=>{ fail++; tick(); return worker(); });
    }
    tick();
    return Promise.all(Array.from({length:Math.min(conc,q.length)},worker))
      .then(()=>({done,fail,missing,total:list.length}));
  },
  /* 单键预载，返回 'ok' | 'missing'(永久缺图) | 'fail'(网络失败，已重试2次) */
  async _preloadOne(key, tries){
    tries=tries||0;
    let url;
    if(this.list[key]){
      /* list 内：探测链本身就是下载（经 SW 在途去重+落盘）；成功/缺图都有确定终态 */
      if(await this.hasLocal(key)) return 'ok';
      return this._missing[this.file(key)] ? 'missing' : 'fail';
    }
    if(typeof key==='string' && key.startsWith('data:')) return 'ok';
    if(/^(img\/|https?:\/\/)/.test(key||'')) url=key;
    else url=this.file(key);
    const st=await this._loadOnce(url);
    if(st==='ok') return 'ok';
    if(st==='missing'){ this._missing[url]=1; return 'missing'; }
    /* 网络抖动：退避后重试，最多 2 次 */
    if(tries<2){
      await new Promise(r=>setTimeout(r,600*(tries+1)));
      return this._preloadOne(key,tries+1);
    }
    return 'fail';
  },

  /* ---- 后台预热队列：单并发，绝与玩家抢图；真实请求后让路 12 秒 ---- */
  _warmQ:[], _warmDone:{}, _warmBusy:0, _warmStarted:false, _warmPauseUntil:0,
  warm(keys, front){
    if(!keys) return;
    (Array.isArray(keys)?keys:[keys]).forEach(k=>{
      if(!k||this._warmDone[k]||this._warmQ.includes(k)) return;
      if(front) this._warmQ.unshift(k); else this._warmQ.push(k);
    });
    this._warmStart();
  },
  _warmStart(){
    if(this._warmStarted) return;
    this._warmStarted=true;
    const idle=cb=>{ (window.requestIdleCallback||setTimeout)(cb,{timeout:2000}); };
    const loop=()=>idle(()=>{
      if(Date.now()<this._warmPauseUntil || this._warmBusy>=1){ setTimeout(loop,800); return; }
      const k=this._warmQ.shift();
      if(k===undefined){ setTimeout(loop,1500); return; }
      this._warmBusy++;
      this._preloadOne(k)
        .then(st=>{ if(st!=='fail') this._warmDone[k]=1; else this._warmQ.push(k); /* 网络失败重新排队 */ })
        .catch(()=>{})
        .then(()=>{ this._warmBusy--; setTimeout(loop,500); });
      loop();
    });
    setTimeout(loop, 8000);                               /* 进门 8 秒、首屏稳定后再悄悄开始 */
  },

  /* ---- <img> 标签：html() 出骨架，scan() 挂载回退链 ---- */
  html(key, cls, alt){
    return `<img class="${cls||''}" alt="${alt||''}" data-asset="${key}" src="">`;
  },

  mount(img, key){
    if(!key || !this.list[key]){ img.style.display='none'; return; }
    img.classList.add('asset-fade');
    this.src(key).then(finalUrl=>{
      if(!finalUrl){ img.classList.add('img-failed'); return; }
      img.addEventListener('load',()=>img.classList.add('loaded'),{once:true});
      img.addEventListener('error',()=>img.classList.add('img-failed'),{once:true});
      img.src=finalUrl;
    });
  },
  scan(root){
    (root||document).querySelectorAll('img[data-asset]').forEach(img=>{
      if(img.classList.contains('asseted')) return;
      img.classList.add('asseted');
      this.mount(img, img.dataset.asset);
    });
  },

  /* ---- 背景图：淡入设置 el 的 background-image（本地真图 → 水墨 SVG） ---- */
  bg(el, key, opacity){
    if(!el || !this.list[key]){ if(el) el.style.opacity=0; return; }
    if(el._assetKey===key){ el.style.opacity=(opacity!=null?opacity:1); return; }
    el._assetKey=key;
    el.style.opacity=0;
    const target=(opacity!=null?opacity:1);
    this.src(key).then(finalUrl=>{
      if(el._assetKey!==key || !finalUrl){ if(el._assetKey===key) el.style.opacity=0; return; }
      el.style.backgroundImage=`url("${finalUrl}")`;
      el.style.opacity=target;
    });
  },

  /* ---- 便捷取 key ---- */
  bfKey(ch, night){ return 'bf_c'+Math.min(5,Math.max(1,ch||1))+(night?'n':''); },
  sceneKey(ch){ return 'scene_c'+Math.min(5,Math.max(1,ch||1)); },

  /* ---- 程序化水墨 SVG 兜底（由文件末尾 INKSVG 提供） ---- */
  svg(key){ return INKSVG ? INKSVG.make(key) : ''; },
};

/* ================================================================
   资产清单（114 张）
   ================================================================ */

/* ---------- 战场图：5 章 × 昼夜（10） ---------- */
const BF_SCENES = {
  c1:'an abandoned haunted mortuary courtyard in a graveyard at dusk, leaning paper talismans, withered willow trees, scattered old coffins, ghost mist creeping',
  c2:'an ancient Chinese county yamen courtyard beside a city god temple, stone lions, red lanterns, towering old cypress, incense smoke',
  c3:'a mythical dragon palace under a stormy sea merged with the thunder department of heaven, coral pillars, lightning arcs, rolling dark waves',
  c4:'the legendary Flower-Fruit Mountain, a great waterfall pouring from cliffs, twisted pines, weird rocks, distant river mouth',
  c5:'the South Heavenly Gate towering above a sea of golden clouds, celestial gate towers, divine radiance beams',
};
Object.entries(BF_SCENES).forEach(([k,sc])=>{
  ASSET.list['bf_'+k]    = [`${ASSET.INK} of ${sc}, wide battle arena view with empty foreground for combat`, 'landscape_16_9'];
  ASSET.list['bf_'+k+'n']= [`${ASSET.INK} of a night scene with pale moonlight and darker eerie atmosphere, ${sc}, wide battle arena view with empty foreground for combat`, 'landscape_16_9'];
});

/* ---------- 章节情景过场图（5） ---------- */
const SCENE_DESC = {
  c1:'a lonely haunted mortuary under dead trees with ghost fires floating, crows on bare branches, chilling mood',
  c2:'a bustling city god temple festival, strings of red lanterns, incense smoke rising, worshippers silhouettes',
  c3:'the dragon palace throne hall beneath the sea, thunder cracking above the tides, dragon king silhouette on high',
  c4:'sunrise over Flower-Fruit Mountain, monkeys leaping between pines by the great waterfall, golden light on mist',
  c5:'the South Heavenly Gate slowly opening in a sea of clouds, rows of celestial guards silhouettes, solemn grandeur',
};
Object.entries(SCENE_DESC).forEach(([k,d])=>{
  ASSET.list['scene_'+k]=[`${ASSET.INK} of ${d}, cinematic establishing shot, story illustration`, 'landscape_16_9'];
});

/* ---------- 工单专属场景图（48） ---------- */
const TASK_SCENES = {
  /* 章一 · 两界文书房 */
  'c1m1':'a dilapidated district office at dawn, paper talismans pasted on walls, a broken gong hanging crooked, ghostly mist hovering above the roof tiles',
  'c1m2':'an abandoned haunted mortuary courtyard, withered willow trees, scattered old coffins, paper money fluttering in wind, ghost fires floating',
  'c1m3':'a dark document room in the underworld, stacked scrolls reaching the ceiling, ink stains on wooden shelves, a single tallow candle guttering',
  'c1m4':'a small courtroom at night, a stern judge figure behind a high desk, moonlight through lattice window, a thin paper ledger on the desk',
  /* 章二 · 城隍辖区 */
  'c2m1':'a winding country road at dusk, old stone milestones, a lone traveler silhouette, distant village smoke, mist rolling over fields',
  'c2m2':'a small kitchen stove with blackened walls, a clay stove god statue on the mantel, oil lamp flickering, shadows dancing on ceiling',
  'c2m3':'a dilapidated earth god shrine deep in the woods, overgrown weeds, fox paw prints in dust, the shrine door hanging half off',
  'c2m4':'a burnt-out paper shrine in a village square, ash still smoldering, villagers whispering in circles, red lanterns torn and faded',
  'c2m5':'the Meng Po Pavilion by the river of forgetfulness, stone railings, white mist over black water, a lone woman figure with a clay pot',
  /* 章三 · 五殿森罗 */
  'c3m1':'an underworld registrar office, stacks of land deeds and contracts, ink brushes drying in holders, a jade seal on red cord',
  'c3m2':'a poisonous swamp at twilight, black water with purple bubbles, will-o-wisps floating, a skeletal hand reaching from the mire',
  'c3m3':'a massive wooden water clock dripping into a stone basin, paper ledgers stacked beside, a judge sitting motionless in deep thought',
  'c3m4':'a vast hunting ground at night, the sky torn with lightning, a huge shadowy beast with antlers charging, cracked earth beneath',
  'c3m5':'a narrow corridor of underworld bureaucracy, doors on both sides, red lanterns with official seals, a figure slipping through a side door',
  /* 章一 支线 */
  's01':'a small hill temple with a fox spirit silhouette on the roof, cherry blossoms falling, the temple sign crooked and faded',
  's02':'a rice paddy at twilight, a farmer clutching his chest, ghostly figures behind the rice stalks, a torn soul-catching talisman',
  's03':'an ancient stone well glowing faintly orange, fire crackling inside the well mouth, a clay bowl beside it, smoke rising',
  's04':'a judge desk deep in the underworld, brushes scattered, a half-copied ledger page, midnight hour, the ink still wet',
  's05':'the grand hall of the first king of hell, massive bronze columns, a dragon seal on the desk, red carpet extending to the throne',
  /* 章二 支线 */
  's06':'a kitchen stove with a fake report scroll tucked behind it, the stove god statue looking guilty, ink stains on its paper mouth',
  's07':'a grand city god temple during festival, red lanterns everywhere, a fake city god statue among the crowd, incense smoke thick',
  's08':'the Meng Po Pavilion kitchen, vats of soup, a mischievous figure pouring clear water, steam rising, the real Meng Po watching',
  /* 章三 支线 */
  's09':'a small medicine shop, herbs hanging from rafters, a cauldron simmering, a figure in white robe weighing herbs with jade scale',
  's10':'a dreamlike bridge crossing yellow millet fields, a scholar sleeping under a tree, golden light filtering through leaves',
  's11':'the Qin Guang hall, a life and death book open on the desk, ink brush hovering, a ghostly figure fleeing through the side door',
  's14':'a thunder department dispatch room, dark clouds outside, lightning flashes illuminating a ledger, an electric god hurrying to write',
  /* 章四 支线 */
  's12':'the East Sea Dragon Palace, pearl pillars, a broken jewelry box, water ghosts searching, a single glowing pearl on the floor',
  's13':'Zhao Gong Ming treasury, gold ingots stacked, an empty shelf, a ghostly figure counting coins at midnight',
  's15':'a thunder god training camp, flag poles lined up, soldiers drilling, lightning cracking above, a general watching from a hill',
  's16':'Er Lang Shen training grounds at Guan Jiang Kou, stone pillars, wolf dogs circling, a figure with third eye on forehead, misty mountains behind',
  's17':'Flower Fruit Mountain slopes, monkey shadows in pines, an imperial edict scroll unfurled, golden mist, distant waterfall roar',
  's18':'the Wen Chang academic bureau, examination papers spread everywhere, a cheating talisman hidden in a brush, ink stones',
  's19':'a scale with no pan, heart-shaped shadow below, a judge examining the balance, ink wash style, ancient treasury hall',
  's20':'a lighthouse during a storm, waves crashing at the base, red lantern swaying, a goddess silhouette holding a lamp',
  /* 章五 支线 */
  's21':'a black armor forge, hammer striking iron, sparks flying, a dragon silhouette breathing fire, the True Martial deity overseeing',
  's22':'a mercy boat on a sea of clouds, a Buddhist figure in white, lotus flowers floating, golden light from the heavens',
  's23':'a celestial merit-recording hall, glowing plaques on the wall, a figure picking up a fallen tablet, golden aura',
  's24':'a single lamp in the dark, faint glow, an old paper with a name written, ghostly shadows watching from corners, mist rolling',
  /* 天曹外包化系列 支线（s25-s34） */
  's25':'a village stone well at dusk, a thick black iron pipe rammed into the well mouth sucking water upward into the sky, a new printed official notice pasted on the well curb, a tiny barefoot child spirit sitting on the well rim, a clay bowl beside it, bitter dark ripples',
  's26':'the massive bronze-studded gate of the underworld prison ajar at midnight, a crowd of translucent ghosts crowding the gap holding gilded official documents, a bull-headed armored guard bracing a steel trident across the doorway, flickering torches',
  's27':'a desolate yin mountain road through a wild graveyard at night, crooked gravestones and green ghost fires, a horse-faced underworld guard in black robes crouching on a stone milestone with an iron chain coiled on his arm, a fleeing ghost silhouette in the distance, pale moon',
  's28':'a sunlit old chinese town street, a crimson-robed day patrol deity standing rigidly holding an open ledger with faded blank entries, his own cast shadow shaped like a second smiling robed figure, shopfronts, harsh daylight',
  's29':'a ruined general temple outside the city on a moonless night, collapsed roof beams and broken statues, one tiny green spirit lantern floating three feet above the ground, faint huddled silhouettes of forgotten old gods in weak incense glow, tall weeds',
  's30':'the worn wooden threshold of a dilapidated spirit yamen at night, a fierce leopard-headed bearded scholar in a tattered blue robe squatting on the doorsill gnawing a ghost bone, an account room doorway behind him glowing with false official light, scattered paper money',
  's31':'a vast underworld reward-of-virtue tribunal hall, two long queues of souls, ragged ghosts clutching yellowed receipts and a broken half tile, silk-robed ghosts holding gilded certificates, a stern austere chancellor behind a desk piled high with ledgers, cold candlelight',
  's32':'a midnight charity mortuary courtyard, a thin coffin with only half its nails driven in, a green-faced red-whiskered underworld judge squatting on the coffin lid tossing a thin autopsy blade, white paper money drifting, cold moonlight, faint mist',
  's33':'an endless construction yard of identical newly built small deity shrines stretching to the horizon under moonlight, an elderly carpenter crouching before a sample shrine holding an ink line marker, snapped chalk lines all askew, lumber stacks, carts hauling materials skyward',
  's34':'a half-dried village lotus pond with cracked mud and sparse withered pink lotus, a barefoot young female immortal in pale robes seated on a broken stone at pond center holding a lotus petal, a queue of village women along the bank, a giant wooden water wheel in the clouds siphoning water upward',
};
Object.entries(TASK_SCENES).forEach(([id,sc])=>{
  ASSET.list['task_'+id]=[`${ASSET.INK} of ${sc}, story scene illustration, medium-wide composition`, 'landscape_16_9'];
});

/* ---------- UI 氛围底图（4） ---------- */
ASSET.list.ui_main=[`${ASSET.INK} of a humble run-down shrine office of a minor god, wooden desk piled with paperwork, one red lantern glowing, moonlight through lattice window, tea cup`, 'landscape_16_9'];
ASSET.list.ui_desk =[`${ASSET.INK} of a top-down view of an old wooden desk surface with open scrolls, inkstone and brush, an abacus and stacked case files, a candle burning`, 'landscape_16_9'];
ASSET.list.ui_yamen=[`${ASSET.INK} of the interior of an underworld tribunal hall, giant pillars fading into mist, a high plaque, cold moonlight shafts, no text`, 'landscape_16_9'];
ASSET.list.ui_hero =[`${ASSET.INK} of a lonely ancient yamen office temple at the misty border between mortal world and underworld, distant mountains, one red lantern glowing, faint cinnabar red and indigo blue accents`, 'landscape_16_9'];

/* ---------- 玩家立绘：按品阶五档（5） ---------- */
const PLAYER_ROBES = {
  r0:'a plain worn grey-black clerical robe with a paper talisman badge, cheap straw sandals',
  r1:'a dark clerical robe with an indigo sash and an iron ruler at the belt',
  r2:'an indigo official robe with silver embroidery and a black gauze cap',
  r3:'a dark robe with crimson trim, jade pendant and a rolled warrant in hand',
  r4:'a formal cinnabar judge robe with gold trim and a judge winged cap',
};
Object.entries(PLAYER_ROBES).forEach(([k,robe])=>{
  ASSET.list['p_'+k]=[`${ASSET.INK} character portrait of a young male underworld clerk deity wearing ${robe}, calm tired expression, holding case files, waist-up character key art`, 'portrait_4_3'];
});

/* ---------- 敌人立绘（23，对齐 ENEMIES） ---------- */
const ENEMY_DESC = {
  youhun:'a pale translucent wandering ghost with hollow eyes and trailing mist',
  zhisha:'a burning paper effigy humanoid with an ink-drawn face, scattered talisman papers around',
  ligui:'a vengeful ghost with long black hair covering the face, long claws, ghost fire at feet',
  guiwang:'a towering ghost king in ancient rotten armor with a horned crown and a ghost-flame halberd',
  changgui:'a hunched sorrowful ghost with tiger stripes on skin, crying and leading the way for a tiger',
  yehu:'a wild snarling fox beast with ragged fur and glowing green eyes',
  dengyou_shu:'a swarm of grey oil-stealing rats with glowing eyes, huddled around a spilt oil lamp',
  qieyou_shu:'a giant fat rat king wearing oil-slicked fur, a tiny oil bottle balanced on its head',
  bifang:'a one-legged crane-like fire bird with white plumage and burning red markings',
  dafeng:'a monstrous storm bird beast with huge wings whipping a gale',
  bashe:'a colossal black serpent swallowing an elephant, green water swirling',
  jiuying:'a nine-headed hydra serpent beast spitting water and fire',
  xiangliu:'a nine-headed giant serpent with human faces dripping green venom',
  wuzhiqi:'a giant ape water demon with an iron chain on its neck, raging by a flooded river',
  jiuweihu:'an elegant eerie nine-tailed fox spirit in flowing robes, alluring and dangerous',
  hundun:'a faceless round chaotic beast with six legs and four wings wrapped in mist',
  qiongqi:'a winged tiger with hedgehog quills and a cruel grin',
  taowu:'a fierce boar-like beast with long tusks and matted dark mane',
  taotie:'a gluttonous bronze-masked beast with giant jaws and small body',
  xingtian:'a headless giant warrior with eyes and mouth on its chest, wielding axe and shield',
  chiyou:'a bronze-armored four-eyed war god with horned helmet and dark battle aura',
  xishenxiaoli:'a hollow-eyed heavenly clerk in faded official robes clutching documents, soul drained',
  kongqipanguan:'an empty suit of judge robes and official hat holding a brush, no body inside, glowing hollow',
  wenyoujie:'a masked heavenly official with a smiling white mask cracking, documents turning into blades',
  xiangye:'a grey-robed ancient chancellor with an unreadable smile, vast shadow looming behind him',
};
Object.keys(ENEMY_DESC).forEach(k=>{
  ASSET.list['e_'+k]=[`${ASSET.INK} character portrait of ${ENEMY_DESC[k]}, menacing aura, ink splashes, full body character key art`, 'portrait_4_3'];
});

/* ---------- 神明立绘（47 位，复用 GODS.img 提示词） ---------- */
const GOD_ART=['zhao_gongming','wen_chang','ma_zu','guan_yu','wang_lingguan','zeng_zhang','duo_wen','qin_guang','yan_luo','zhuan_lun','ao_guang','zhong_yue','er_lang','ne_zha','zhen_wu','lei_zu','xi_yue','xuan_nv','guan_yin','di_zang','wei_tuo','sun_wukong','feng_du','dong_yue','xi_wangmu',
/* 第二批 22 位（本地真图，文件为 PNG 内容沿用 .jpg 命名管线） */
'tudi_gong','zao_jun','men_shen','jing_shen','cheng_huang','bai_wuchang','hei_wuchang','niu_tou','ma_mian','meng_po','ri_youshen','ye_youshen','cui_jue','wei_zheng','zhong_kui','lu_zhidao','bi_gan','sun_simiao','lu_ban','lv_dongbin','he_xiangu','dian_mu'];
if(typeof GODS!=='undefined'){
  GOD_ART.forEach(k=>{
    if(GODS[k] && GODS[k].img) ASSET.list['g_'+k]=[GODS[k].img, 'portrait_4_3'];
  });
}

/* ---------- 物品图标：礼物7 + 丹药6 + 装备10（23） ---------- */
const ITEM_DESC={
  /* 礼物 */
  taomu:'a peachwood ruyi charm', wugu:'a cloth pouch of five grains', xiangzhu:'a burning incense candle',
  mozhen:'a black ink stick', panta:'a heavenly peach fruit', hulu:'a wine gourd with red ribbon', puti:'a golden bodhi fruit',
  /* 丹药 */
  danmo:'a small pouch of elixir dust', dan:'a round demon pill glowing faintly', wang:'a greater demon pill with a crown mark',
  xiong:'a fierce pill wrapped in flames', bingzhu:'a war god remnant pill beside a broken spear', gui:'a ghost pill with wailing wisps',
  /* 装备 */
  pan:'a red-tipped judge brush', zhan:'a demon-slaying straight sword', chui:'a massive war hammer',
  jia:'a golden chain mail armor shirt', pei:'a carved jade turtle pendant', yi:'a purple immortal robe with bagua patterns',
  chen:'a white horsehair whisk', suo:'an iron soul-locking chain with talismans', hu:'a small gourd emitting soul wisps', yin:'a divine fire seal stamp with flames',
};
Object.entries(ITEM_DESC).forEach(([k,d])=>{
  ASSET.list['it_'+k]=[`${ASSET.INK} of ${d}, ${ASSET.ICON}`, 'square_hd'];
});

/* ---------- 技能图标：五系 × 3 档（15） ---------- */
const SKILL_DESC={
  bing:['a crescent blade slash','a golden mace smashing down','a war god descending with a spear'],
  fa:['a lightning talisman crackling','a thunder dragon coiling','a heavenly lightning tribulation'],
  you:['soul wisps drifting','a ghost gate seal pressing down','an underworld verdict scroll unrolling'],
  huo:['a small flame spark leaping','a fire lotus blooming','a burning karma inferno'],
  sheng:['a healing dew leaf','a jade shield of light','a glowing lotus of rebirth'],
};
Object.entries(SKILL_DESC).forEach(([p,arr])=>{
  arr.forEach((d,i)=>{
    ASSET.list['sk_'+p+(i+1)]=[`${ASSET.INK} of ${d}, ${ASSET.ICON}`, 'square_hd'];
  });
});

/* ---------- 五系神格底图（5） ---------- */
const GH_DESC={
  bing:'a crimson blade emblem radiating killing intent',
  fa:'an indigo thunder sigil with storm clouds',
  you:'a purple soul flame with a faint ghost face',
  huo:'an orange fire ring with rising sparks',
  sheng:'a green lotus circle with healing light',
};
Object.entries(GH_DESC).forEach(([k,d])=>{
  ASSET.list['gh_'+k]=[`${ASSET.INK} of ${d}, ${ASSET.ICON}`, 'square_hd'];
});

/* ---------- 神衙营造 + 阴兵（6） ---------- */
const YAMEN_ICONS = {
  fac_shrine:'an ancient small chinese shrine altar with wooden deity tablet and candles',
  fac_desk:'an old chinese magistrate desk with stacked documents and ink stone',
  fac_incense:'a bronze incense burner with curling smoke and red candles',
  fac_banner:'a tall tattered summon banner with dark ink characters fluttering',
  sol_xiaojiang:'a ghost soldier in tattered black uniform holding a rusty dagger',
  sol_duwei:'a ghost general in broken armor with a translucent long spear',
};
Object.entries(YAMEN_ICONS).forEach(([k,d])=>{
  ASSET.list[k]=[`${ASSET.INK} of ${d}, ${ASSET.ICON}`, 'square_hd'];
});
const STAT_ICONS = {
  rank:'a small chinese official seal stamp',
  calendar:'an ancient chinese almanac calendar page with ink brush date',
  cult:'a glowing cultivation core or spiritual energy orb',
  money:'a string of ancient chinese copper coins with square holes',
  favor:'a pair of clasped hands representing friendship and favor',
  erode:'a withering ink lantern or an eroding broken seal',
  merit:'a red merit registry scroll with brush strokes',
  hp:'a red life candle or heart wrapped in talisman paper',
  mp:'a blue spiritual gourd bottle',
};
Object.entries(STAT_ICONS).forEach(([k,d])=>{
  ASSET.list['stat_'+k]=[`${ASSET.INK} of ${d}, ${ASSET.ICON}`, 'square_hd'];
});

/* ================================================================
   INKSVG · 程序化水墨 SVG 生成器（图床无真图时的纯离线兜底）
   宣纸 + 写意墨影，按 key 分类出图：敌人/神立绘、山水战场、工单场景、墨印图标
   ================================================================ */
const INKSVG=(()=>{
  const INK='#2c2620', INK2='#4a4138', INK3='#7a7060', CIN='#a8462f',
        IDG='#3b5577', PUR='#6b5b95', ORG='#c06a30', GRN='#4f7a56',
        GOLD='#b8924a', PAPER='#f2ead6', PAPER2='#e7dcc4';
  const KAI="'Kaiti SC','STKaiti','KaiTi','STSong',serif";

  function seed(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619);} return h>>>0; }
  function R(s){ let x=seed(s); return ()=>{ x=(Math.imul(x,1664525)+1013904223)>>>0; return x/4294967296; }; }

  /* 公共滤镜：纸纹 / 墨洇 / 柔化 */
  const FILTERS=`
  <filter id="p" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" stitchTiles="stitch" result="n"/>
    <feColorMatrix in="n" values="0 0 0 0 0.16  0 0 0 0 0.13  0 0 0 0 0.08  0 0 0 0.045 0"/>
  </filter>
  <filter id="b" x="-25%" y="-25%" width="150%" height="150%">
    <feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="2" seed="7" result="t"/>
    <feDisplacementMap in="SourceGraphic" in2="t" scale="10"/>
  </filter>
  <filter id="b2" x="-25%" y="-25%" width="150%" height="150%">
    <feTurbulence type="fractalNoise" baseFrequency="0.02 0.04" numOctaves="2" seed="13" result="t"/>
    <feDisplacementMap in="SourceGraphic" in2="t" scale="6"/>
  </filter>
  <filter id="sf"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="sf2"><feGaussianBlur stdDeviation="12"/></filter>`;

  function head(w,h,bg){
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">`
      +`<defs>${FILTERS}`
      +`<radialGradient id="vg" cx="50%" cy="42%" r="75%"><stop offset="0%" stop-color="${bg}" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.10"/></radialGradient>`
      +`</defs><rect width="${w}" height="${h}" fill="${bg}"/>`;
  }
  const tail=(w,h)=>`<rect width="${w}" height="${h}" filter="url(#p)"/><rect width="${w}" height="${h}" fill="url(#vg)"/></svg>`;
  const txt=(x,y,s,c,size,wt)=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="${KAI}" font-size="${size}" font-weight="${wt||'bold'}" fill="${c}">${s}</text>`;

  /* 地面墨痕 + 鬼火 */
  const ground=`<ellipse cx="300" cy="735" rx="210" ry="34" fill="${INK}" opacity="0.10" filter="url(#sf2)"/>`;
  const fireDot=(x,y,c,r)=>`<circle cx="${x}" cy="${y}" r="${r||10}" fill="${c||'#7fae8a'}" opacity="0.85" filter="url(#sf)"/>`;

  /* ---------- 鬼/人形基模 ---------- */
  function ghost(k,opt){
    opt=opt||{};
    const r=R(k), s=opt.scale||1;
    const robe=`<path d="M300 250 C235 262 208 332 205 412 C200 524 166 642 138 762 L462 762 C434 642 400 524 395 412 C392 332 365 262 300 250 Z" fill="${INK}" filter="url(#b)"/>`;
    const collar=`<path d="M262 268 L300 340 L338 268" fill="none" stroke="${PAPER}" stroke-width="7" opacity="0.55"/>`;
    const head = opt.headless ? '' : `<circle cx="300" cy="200" r="${58*s}" fill="${INK}" filter="url(#b2)"/>`;
    let extra='';
    /* 散发遮脸 */
    if(opt.hair){
      let h='';
      for(let i=0;i<7;i++){ const x0=250+i*16+(r()-0.5)*14; h+=`<path d="M${x0} ${150+r()*12} C${x0-18-r()*14} ${220+r()*30} ${x0-10-r()*20} ${290+r()*30} ${x0-22-r()*16} ${340+r()*20}" fill="none" stroke="${INK}" stroke-width="${7+r()*7}" stroke-linecap="round" opacity="${0.85}"/>`; }
      extra+=h;
    }
    /* 官帽（官员鬼） */
    if(opt.hat){ extra+=`<path d="M246 164 L354 164 L340 132 L260 132 Z" fill="${INK}"/><rect x="230" y="158" width="140" height="14" rx="4" fill="${INK}"/>`; if(opt.hatWing) extra+=`<path d="M230 162 L180 150 M370 162 L420 150" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`; }
    /* 冠（鬼王/相爷） */
    if(opt.crown){ extra+=`<path d="M262 146 L272 108 L300 132 L328 108 L338 146 Z" fill="${INK}"/>`; }
    /* 腰带 */
    extra+=`<rect x="205" y="486" width="190" height="16" fill="${INK2}" opacity="0.75"/>`;
    /* 特殊 */
    if(opt.kind==='guiwang') extra+=`<path d="M205 380 L150 350 L162 400 Z M395 380 L450 350 L438 400 Z" fill="${INK}"/>`+fireDot(170,690,'#7fae8a',11)+fireDot(430,690,'#b8834a',11)+fireDot(300,660,'#7fae8a',8);
    if(opt.kind==='changgui'){ for(let i=0;i<5;i++) extra+=`<path d="M215 ${560+i*34} Q300 ${548+i*34} 385 ${560+i*34}" stroke="${INK2}" stroke-width="9" fill="none" opacity="0.7"/>`; extra+=`<path d="M420 470 C470 440 490 400 475 360" stroke="${INK}" stroke-width="15" fill="none" stroke-linecap="round" filter="url(#b2)"/>`; }
    if(opt.kind==='xishen'){ extra+=`<rect x="345" y="380" width="52" height="86" rx="6" fill="${PAPER2}" stroke="${INK2}" stroke-width="4" transform="rotate(12 371 423)"/>`; extra=extra.replace('"#2c2620" filter="url(#b)"/>','"#3a342c" filter="url(#b)"/>'); }
    if(opt.kind==='kongqi'){ /* 空袍：头位置用纸色圆挖空 + 飘符 */ }
    if(opt.kind==='wenyou'){ extra+=`<path d="M252 178 Q300 158 348 178 L346 222 Q300 240 254 222 Z" fill="${PAPER}" stroke="${INK2}" stroke-width="3"/><path d="M272 210 Q300 224 328 210" stroke="${CIN}" stroke-width="4" fill="none" stroke-linecap="round"/>`; extra+=[250,350].map(x=>`<path d="M${x} 470 L${x+(x<300?-46:46)} 540 L${x+(x<300?-30:30)} 548 L${x+12} 480 Z" fill="${PAPER2}" stroke="${INK3}" stroke-width="2"/>`).join(''); }
    if(opt.kind==='xiangye'){ extra+=`<ellipse cx="300" cy="470" rx="195" ry="300" fill="${INK}" opacity="0.10" filter="url(#sf2)"/>`; }
    /* 胸眼（刑天特殊，走 war） */
    let fires=opt.fires||[];
    return head(600,800,PAPER)+ground+robe+collar+head+extra+fires.map(f=>fireDot(f[0],f[1],f[2],f[3])).join('')+tail(600,800);
  }

  /* ---------- 狐 ---------- */
  function fox(k,nine){
    const r=R(k);
    let tails='';
    if(nine){
      for(let i=0;i<9;i++){
        const a=-0.9+i*0.22+(r()-0.5)*0.1, y0=560+(r()-0.5)*50;
        tails+=`<path d="M${210} ${y0} C${120-i*2} ${y0-30+a*120} ${150-i*4} ${360+a*160} ${118-i*3} ${300+a*120}" fill="none" stroke="${INK}" stroke-width="${15-i*0.7}" stroke-linecap="round" opacity="${0.9-i*0.03}"/>`;
      }
    }else{
      tails=`<path d="M205 585 C120 570 92 470 138 408 C172 452 212 492 248 516" fill="${INK}" stroke="none" filter="url(#b)"/>`;
    }
    const body=`<path d="M210 572 C238 486 318 452 382 482 C436 508 456 562 424 602 C388 642 250 640 214 610 Z" fill="${INK}" filter="url(#b)"/>`;
    const legs=[238,300,360,408].map(x=>`<path d="M${x} 600 L${x-14} 700 L${x+20} 700 L${x+12} 600 Z" fill="${INK2}"/>`).join('');
    const head=`<ellipse cx="402" cy="438" rx="46" ry="38" fill="${INK}" filter="url(#b2)"/><path d="M372 412 L364 364 L400 396 Z M428 408 L448 362 L442 404 Z" fill="${INK}"/>`
      +`<path d="M440 444 L470 438 L442 456 Z" fill="${INK}"/>`
      +`<circle cx="412" cy="432" r="5.5" fill="${CIN}"/>`;
    return head_(600,800)+ground+tails+body+legs+head+tail(600,800);
  }
  /* head 变量名冲突，纸底入口改别名 */
  function head_(w,h,bg){ return head(w,h,bg||PAPER); }

  /* ---------- 鸟 ---------- */
  function bird(k,fire,oneLeg){
    const wingL=`<path d="M252 392 C150 306 66 300 32 372 C104 386 176 430 252 472 Z" fill="${INK}" filter="url(#b)"/>`;
    const wingR=`<path d="M348 392 C450 306 534 300 568 372 C496 386 424 430 348 472 Z" fill="${INK}" filter="url(#b)"/>`;
    const body=`<ellipse cx="300" cy="452" rx="58" ry="118" fill="${INK2}" filter="url(#b2)"/>`;
    const neck=`<path d="M300 350 C296 310 304 296 300 272" stroke="${INK}" stroke-width="34" stroke-linecap="round"/>`;
    const hd=`<circle cx="300" cy="252" r="34" fill="${INK}"/><path d="M300 246 L346 256 L300 266 Z" fill="${INK2}"/>`;
    const legs=(oneLeg?`<line x1="300" y1="560" x2="300" y2="712" stroke="${INK2}" stroke-width="13" stroke-linecap="round"/>`
      :`<line x1="276" y1="560" x2="270" y2="706" stroke="${INK2}" stroke-width="11" stroke-linecap="round"/><line x1="324" y1="560" x2="330" y2="706" stroke="${INK2}" stroke-width="11" stroke-linecap="round"/>`);
    let sparks='';
    if(fire) sparks=[[110,360],[490,360],[300,180],[180,470]].map(p=>fireDot(p[0],p[1],CIN,9)).join('');
    else sparks=`<path d="M70 520 Q40 500 60 470 M530 520 Q560 500 540 470 M120 600 Q90 600 100 570" stroke="${INK3}" stroke-width="5" fill="none" opacity="0.6"/>`;
    return head_(600,800)+ground+wingL+wingR+body+neck+hd+legs+sparks+tail(600,800);
  }

  /* ---------- 蛇 ---------- */
  function snake(k,opt){
    opt=opt||{};
    const w=opt.wide?96:68;
    let body=`<path d="M118 738 C262 624 132 538 282 430 C404 344 300 262 442 176" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" filter="url(#b)"/>`;
    if(opt.bulge) body=`<path d="M118 738 C262 624 150 560 270 520 C330 500 330 600 300 620 C260 640 200 600 282 430 C404 344 300 262 442 176" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" filter="url(#b)"/>`;
    const heads=[];
    const nHead=opt.heads||1;
    for(let i=0;i<nHead;i++){
      const a=i-(nHead-1)/2, hx=442+a*70, hy=176-a*40;
      heads.push(`<ellipse cx="${hx}" cy="${hy}" rx="30" ry="22" fill="${INK}"/>`
        +`<circle cx="${hx+12}" cy="${hy-6}" r="4" fill="${CIN}"/>`
        +`<path d="M${hx+26} ${hy} L${hx+48} ${hy-8} M${hx+26} ${hy+2} L${hx+48} ${hy+12}" stroke="${CIN}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`);
    }
    const scales=[...Array(7)].map((_,i)=>`<path d="M${190+i*34} ${640-i*52} q16 -14 32 0" stroke="${PAPER}" stroke-width="4" fill="none" opacity="0.28"/>`).join('');
    return head_(600,800)+ground+body+scales+heads.join('')+tail(600,800);
  }

  /* ---------- 猿 ---------- */
  function ape(k){
    const parts=`<ellipse cx="300" cy="520" rx="120" ry="140" fill="${INK}" filter="url(#b)"/>`
      +`<path d="M196 470 C130 540 120 660 168 720 C196 660 220 580 232 510 Z" fill="${INK}"/><path d="M404 470 C470 540 480 660 432 720 C404 660 380 580 368 510 Z" fill="${INK}"/>`
      +`<circle cx="300" cy="318" r="62" fill="${INK}" filter="url(#b2)"/>`
      +`<path d="M262 330 Q300 360 338 330 Q330 300 300 296 Q270 300 262 330 Z" fill="${PAPER2}" opacity="0.85"/>`
      +`<circle cx="280" cy="312" r="6" fill="${INK}"/><circle cx="320" cy="312" r="6" fill="${INK}"/>`
      +`<path d="M240 262 Q300 238 360 262" stroke="${INK2}" stroke-width="10" fill="none"/>`
      +`<path d="M238 330 C210 300 230 250 300 238 C370 250 390 300 362 330" fill="none" stroke="#5a5048" stroke-width="9"/>`
      +fireDot(300,238,'#8a7c5a',8);
    return head_(600,800)+ground+parts+tail(600,800);
  }

  /* ---------- 凶兽 ---------- */
  function beast(k,opt){
    opt=opt||{};
    if(opt.kind==='hundun'){
      let legs='',wings='';
      for(let i=0;i<6;i++){ const x=170+i*52; legs+=`<path d="M${x} 580 L${x-12} 700 L${x+18} 700 L${x+10} 580 Z" fill="${INK2}"/>`; }
      [[160,380,-30],[440,380,30],[150,470,-20],[450,470,20]].forEach(p=>{wings+=`<ellipse cx="${p[0]}" cy="${p[1]}" rx="52" ry="20" fill="${INK2}" transform="rotate(${p[2]} ${p[0]} ${p[1]})"/>`;});
      return head_(600,800)+ground+wings+`<circle cx="300" cy="470" r="160" fill="${INK}" filter="url(#b)"/>`+legs+tail(600,800);
    }
    if(opt.kind==='taotie'){
      const face=`<rect x="130" y="150" width="340" height="340" rx="60" fill="${INK}" filter="url(#b)"/>`
        +`<circle cx="232" cy="300" r="44" fill="${PAPER2}"/><circle cx="232" cy="300" r="18" fill="${INK}"/><circle cx="226" cy="294" r="6" fill="${PAPER2}"/>`
        +`<circle cx="368" cy="300" r="44" fill="${PAPER2}"/><circle cx="368" cy="300" r="18" fill="${INK}"/><circle cx="362" cy="294" r="6" fill="${PAPER2}"/>`
        +`<path d="M300 330 L280 380 L320 380 Z" fill="${PAPER2}"/>`
        +`<ellipse cx="300" cy="430" rx="92" ry="32" fill="${PAPER2}"/>`
        +[260,285,315,340].map((x,i)=>`<path d="M${x} 408 L${x+8} 438 L${x+16} 408 Z" fill="${INK}"/>`).join('')
        +`<path d="M150 210 C90 180 90 120 150 110 M450 210 C510 180 510 120 450 110 M150 400 C80 430 80 480 150 470 M450 400 C520 430 520 480 450 470" fill="none" stroke="${GOLD}" stroke-width="9" opacity="0.8"/>`;
      return head_(600,800)+ground+face+tail(600,800);
    }
    /* 通用四足凶兽 */
    const body=`<path d="M170 520 C196 440 330 424 402 462 C456 492 466 566 422 606 L202 614 C166 590 150 560 170 520 Z" fill="${INK}" filter="url(#b)"/>`;
    let legs='';
    [210,280,350,410].forEach(x=>{legs+=`<path d="M${x} 596 L${x-16} 712 L${x+22} 712 L${x+14} 596 Z" fill="${INK2}"/>`;});
    const head=`<ellipse cx="446" cy="470" rx="56" ry="48" fill="${INK}" filter="url(#b2)"/><path d="M470 432 L500 408 L488 452 Z" fill="${INK}"/>`
      +`<circle cx="452" cy="458" r="6" fill="${CIN}"/>`
      +(opt.tusk?`<path d="M472 492 Q486 530 470 548 M462 494 Q462 534 448 546" fill="none" stroke="${PAPER2}" stroke-width="8" stroke-linecap="round"/>`:'')
      +`<path d="M492 492 Q506 496 500 510" stroke="${INK}" stroke-width="7" fill="none"/>`;
    let mane='';
    for(let i=0;i<9;i++){ const x=200+i*26; mane+=`<path d="M${x} 452 L${x-8} ${396-rand0(i,k)*26} L${x+14} 448 Z" fill="${INK2}"/>`; }
    let extra='';
    if(opt.wing){ extra=`<path d="M280 440 C220 340 130 330 96 380 C160 396 230 430 300 460 Z" fill="${INK2}" filter="url(#b)"/>`; }
    if(opt.quill){ for(let i=0;i<7;i++){extra+=`<path d="M${250+i*22} ${430-i*6} L${250+i*22} ${380-i*14}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;} }
    if(opt.kind==='taowu'){ extra+=`<path d="M430 430 Q470 380 510 390" stroke="${INK}" stroke-width="0" fill="none"/>`; }
    const tail=`<path d="M180 540 C110 520 90 450 120 410 C150 460 180 490 210 510" fill="${INK}"/>`;
    return head_(600,800)+ground+extra+tail+body+mane+legs+head+tailSvg(600,800);
  }
  function rand0(i,k){ const r=R(k+i); return r(); }
  function tailSvg(w,h){ return tail(w,h); }

  /* ---------- 战神（刑天/蚩尤） ---------- */
  function war(k,xingtian,chiyou){
    const torso=`<path d="M238 300 L362 300 L386 560 L214 560 Z" fill="${INK}" filter="url(#b2)"/>`;
    const armor=[340,380,420,460,500].map(y=>`<line x1="222" y1="${y}" x2="378" y2="${y}" stroke="${PAPER2}" stroke-width="5" opacity="0.3"/>`).join('');
    const pads=`<circle cx="226" cy="316" r="34" fill="${INK2}"/><circle cx="374" cy="316" r="34" fill="${INK2}"/>`;
    const cape=`<path d="M214 310 C150 380 140 560 160 700 L230 700 C210 560 226 400 246 330 Z M386 310 C450 380 460 560 440 700 L370 700 C390 560 374 400 354 330 Z" fill="${INK2}" opacity="0.9"/>`;
    const legs=`<path d="M246 560 L238 712 L300 712 L300 560 Z M300 560 L300 712 L362 712 L354 560 Z" fill="${INK}"/>`;
    let headOrFace='';
    if(xingtian){
      headOrFace=`<rect x="250" y="232" width="100" height="26" fill="${INK}"/>`
        +`<circle cx="270" cy="380" r="13" fill="${PAPER2}"/><circle cx="270" cy="380" r="5" fill="${CIN}"/>`
        +`<circle cx="330" cy="380" r="13" fill="${PAPER2}"/><circle cx="330" cy="380" r="5" fill="${CIN}"/>`
        +`<path d="M272 440 Q300 458 328 440" stroke="${PAPER2}" stroke-width="6" fill="none"/>`;
    }else{
      headOrFace=`<circle cx="300" cy="220" r="54" fill="${INK}" filter="url(#b2)"/>`;
      if(chiyou){
        headOrFace+=`<path d="M262 182 L238 120 L282 162 Z M338 182 L362 120 L318 162 Z" fill="${INK}"/>`
          +`<circle cx="300" cy="196" r="6" fill="${CIN}"/>`
          +`<circle cx="282" cy="224" r="5" fill="${PAPER2}"/><circle cx="318" cy="224" r="5" fill="${PAPER2}"/>`;
      }
    }
    /* 斧盾 / 剑 */
    let weapon='';
    if(xingtian){
      weapon=`<line x1="150" y1="320" x2="118" y2="620" stroke="#5a5048" stroke-width="13" stroke-linecap="round"/><path d="M150 300 L210 330 L160 410 L118 380 Z" fill="${INK2}"/>`
        +`<circle cx="452" cy="470" r="58" fill="none" stroke="${INK2}" stroke-width="14"/><circle cx="452" cy="470" r="12" fill="${INK2}"/>`;
    }else{
      weapon=`<line x1="452" y1="250" x2="420" y2="660" stroke="#5a5048" stroke-width="12" stroke-linecap="round"/><path d="M452 250 L478 258 L470 340 L442 330 Z" fill="${INK2}"/>`;
    }
    return head_(600,800)+ground+cape+legs+torso+armor+pads+headOrFace+weapon+tailSvg(600,800);
  }

  /* ---------- 神影立绘 ---------- */
  const BUDDHA=['guan_yin','di_zang'],
        MAIDEN=['xuan_nv','ma_zu','xi_wangmu'],
        WARRIOR=['er_lang','ne_zha','wei_tuo','zhen_wu','guan_yu','sun_wukong','zhong_yue','lei_zu','xi_yue','ao_guang','feng_du','dong_yue'];
  function godArt(k){
    const gid=k.slice(2);
    const robe=`<path d="M300 250 C232 264 206 336 202 420 C196 530 162 648 132 764 L468 764 C438 648 404 530 398 420 C394 336 368 264 300 250 Z" fill="${INK}" filter="url(#b)"/>`;
    const collar=`<path d="M258 270 L300 348 L342 270" fill="none" stroke="${PAPER}" stroke-width="6" opacity="0.5"/>`;
    const head=`<circle cx="300" cy="198" r="54" fill="${INK}" filter="url(#b2)"/>`;
    let halo='', crown='', extra='';
    if(BUDDHA.includes(gid)){
      halo=`<circle cx="300" cy="198" r="86" fill="${GOLD}" opacity="0.22" filter="url(#sf)"/><circle cx="300" cy="198" r="74" fill="none" stroke="${GOLD}" stroke-width="4" opacity="0.7"/>`;
      extra=`<path d="M250 360 Q300 330 350 360" fill="none" stroke="${PAPER2}" stroke-width="7"/>`;
      if(gid==='di_zang') extra+=`<circle cx="386" cy="540" r="26" fill="none" stroke="${GOLD}" stroke-width="7"/><line x1="386" y1="470" x2="386" y2="668" stroke="#5a5048" stroke-width="10"/>`;
    }else if(MAIDEN.includes(gid)){
      crown=`<path d="M264 152 L272 112 L300 134 L328 112 L336 152 Z" fill="${INK}"/>`;
      extra=`<path d="M232 300 C180 420 150 560 130 720 M368 300 C420 420 450 560 470 720" fill="none" stroke="${INK2}" stroke-width="13" stroke-linecap="round" opacity="0.85"/>`;
      if(gid==='xi_wangmu') extra+=fireDot(300,108,GOLD,9);
    }else if(WARRIOR.includes(gid)){
      crown=`<path d="M250 158 L350 158 L336 128 L264 128 Z" fill="${INK}"/>`;
      extra=`<path d="M220 310 C150 400 140 580 162 720 M380 310 C450 400 460 580 438 720" fill="${INK2}" opacity="0.95"/>`
        +[348,392,436].map((y,i)=>`<line x1="226" y1="${y}" x2="374" y2="${y+i*4}" stroke="${PAPER2}" stroke-width="5" opacity="0.28"/>`).join('')
        +`<line x1="452" y1="240" x2="432" y2="690" stroke="#5a5048" stroke-width="11" stroke-linecap="round"/>`;
      if(gid==='er_lang') extra+=`<circle cx="300" cy="186" r="7" fill="${CIN}"/>`;
      if(gid==='sun_wukong'){ extra+=`<ellipse cx="300" cy="150" rx="44" ry="9" fill="${GOLD}"/>`; for(let i=0;i<4;i++)extra+=`<path d="M${210+i*58} 600 Q300 ${586+i*8} ${390-i*58} 600" stroke="${GOLD}" stroke-width="7" fill="none" opacity="0.7"/>`; }
      if(gid==='guan_yu') extra+=`<path d="M160 300 C120 440 120 600 150 720" stroke="${CIN}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.8"/>`;
    }else{
      crown=`<path d="M252 156 L348 156 L336 130 Q300 118 264 130 Z" fill="${INK}"/>`;
      extra=`<rect x="212" y="470" width="176" height="15" fill="${INK2}" opacity="0.7"/>`;
    }
    /* 云座 */
    const cloud=`<path d="M150 740 Q180 690 240 700 Q270 660 320 672 Q380 660 410 700 Q470 690 470 742 Q420 772 300 766 Q190 772 150 740 Z" fill="${INK2}" opacity="0.5" filter="url(#sf)"/>`;
    return head_(600,800)+halo+cloud+robe+collar+head+crown+extra+tailSvg(600,800);
  }

  /* ---------- 敌人分发 ---------- */
  function enemy(k){
    const id=k.slice(2);
    const map={
      ligui:()=>ghost(k,{hair:true,kind:'ligui'}),
      guiwang:()=>ghost(k,{crown:true,kind:'guiwang',scale:1.08}),
      changgui:()=>ghost(k,{hair:true,kind:'changgui'}),
      yehu:()=>fox(k,false),
      dengyou_shu:()=>fox(k,false),
      qieyou_shu:()=>bird(k,true,true),
      jiuweihu:()=>fox(k,true),
      bifang:()=>bird(k,true,true),
      dafeng:()=>bird(k,false,false),
      bashe:()=>snake(k,{wide:true,bulge:true}),
      jiuying:()=>snake(k,{heads:3}),
      xiangliu:()=>snake(k,{wide:true,heads:3}),
      wuzhiqi:()=>ape(k),
      hundun:()=>beast(k,{kind:'hundun'}),
      qiongqi:()=>beast(k,{wing:true,quill:true}),
      taowu:()=>beast(k,{tusk:true,kind:'taowu'}),
      taotie:()=>beast(k,{kind:'taotie'}),
      xingtian:()=>war(k,true,false),
      chiyou:()=>war(k,false,true),
      xishenxiaoli:()=>ghost(k,{hat:true,kind:'xishen'}),
      kongqipanguan:()=>ghost(k,{kind:'kongqi'}),
      wenyoujie:()=>ghost(k,{hat:true,hatWing:true,kind:'wenyou'}),
      xiangye:()=>ghost(k,{crown:true,hatWing:true,kind:'xiangye',scale:1.06}),
    };
    return (map[id]||(()=>ghost(k,{hair:true})))();
  }

  /* ================= 山水 / 场景（1600×900） ================= */
  function ridge(seedStr,baseY,amp,color,op){
    const r=R(seedStr), w=1600; let d=`M0 ${baseY+200}`; let x=-50;
    while(x<w+100){ const nx=x+200+r()*260; const peak=baseY-amp*(0.35+r()*0.85); d+=` Q${(x+nx)/2} ${peak} ${nx} ${baseY-r()*36}`; x=nx; }
    return `<path d="${d} L${w+100} 901 L-50 901 Z" fill="${color}" opacity="${op}"/>`;
  }
  const mist=`<rect x="0" y="430" width="1600" height="60" fill="#f8f2e2" opacity="0.55" filter="url(#sf2)"/><rect x="0" y="560" width="1600" height="70" fill="#f8f2e2" opacity="0.4" filter="url(#sf2)"/>`;

  /* 枯柳/松/灯笼/庙等元素 */
  const EL={
    willow(x,y){ let b=`<path d="M${x} ${y} C${x-10} ${y-120} ${x+16} ${y-200} ${x-6} ${y-300}" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round" filter="url(#b2)"/>`; for(let i=0;i<14;i++){const dx=x-120+i*18+(i%3)*8; b+=`<path d="M${dx} ${y-280+(i%4)*20} C${dx-14} ${y-180} ${dx+8} ${y-100} ${dx-6} ${y-30}" stroke="${INK2}" stroke-width="4" opacity="0.7" fill="none"/>`;} return b; },
    pine(x,y,s=1){ let p=`<path d="M${x} ${y} L${x} ${y-240*s}" stroke="${INK}" stroke-width="${12*s}" stroke-linecap="round"/>`; for(let i=0;i<5;i++){const yy=y-60*s-i*42*s; p+=`<path d="M${x} ${yy} q-${70*s} ${-26*s} -${96*s-i*8*s} ${18*s} M${x} ${yy} q${70*s} ${-26*s} ${96*s-i*8*s} ${18*s}" stroke="${INK2}" stroke-width="${7*s}" fill="none" stroke-linecap="round"/>`;} return p; },
    lantern(x,y,s=1){ return `<line x1="${x}" y1="${y-40*s}" x2="${x}" y2="${y}" stroke="${INK2}" stroke-width="3"/><ellipse cx="${x}" cy="${y+26*s}" rx="${24*s}" ry="${30*s}" fill="${CIN}" opacity="0.92"/><circle cx="${x}" cy="${y+26*s}" r="${30*s}" fill="${CIN}" opacity="0.3" filter="url(#sf)"/><rect x="${x-12*s}" y="${y-6*s}" width="${24*s}" height="${8*s}" fill="${INK2}"/><rect x="${x-12*s}" y="${y+50*s}" width="${24*s}" height="${8*s}" fill="${INK2}"/>`; },
    stele(x,y){ return `<path d="M${x-34} ${y} L${x-30} ${y-150} Q${x} ${y-180} ${x+30} ${y-150} L${x+34} ${y} Z" fill="${INK2}" opacity="0.85" filter="url(#b2)"/><rect x="${x-48}" y="${y}" width="96" height="20" rx="4" fill="${INK2}"/>`; },
    bolt(x,y,s=1){ return `<path d="M${x} ${y} L${x-26*s} ${y+70*s} L${x+4*s} ${y+70*s} L${x-16*s} ${y+150*s} L${x+30*s} ${y+58*s} L${x} ${y+58*s} Z" fill="#d8d4c4" opacity="0.85"/>`; },
    cloudScroll(x,y,s=1){ return `<path d="M${x-70*s} ${y} q${20*s} ${-46*s} ${70*s} ${-16*s} q${40*s} ${-50*s} ${92*s} ${-6*s} q${50*s} ${-20*s} ${58*s} ${28*s} q${-10*s} ${34*s} ${-58*s} ${22*s} q${-70*s} ${30*s} ${-110*s} ${-10*s} q${-52*s} ${20*s} ${-72*s} ${-16*s} Z" fill="none" stroke="${INK2}" stroke-width="${6*s}" opacity="0.6"/>`; },
  };

  function landscape(k,ch,night,seedExtra){
    const sky=night?'#2b3040':'#ece2c8';
    const mc=night?'#3a4256':INK;
    let s=head(1600,900,sky);
    if(night){
      s+=`<circle cx="1280" cy="170" r="62" fill="#e8e4d4" opacity="0.95"/><circle cx="1280" cy="170" r="90" fill="#e8e4d4" opacity="0.12" filter="url(#sf)"/>`;
      for(let i=0;i<26;i++){const r=R(k+'star'+i); s+=`<circle cx="${r()*1600}" cy="${80+r()*330}" r="${1.5+r()*2}" fill="#e8e4d4" opacity="${0.4+r()*0.5}"/>`; }
    }else{
      s+=`<circle cx="1240" cy="160" r="54" fill="${CIN}" opacity="0.8"/><circle cx="1240" cy="160" r="84" fill="${CIN}" opacity="0.12" filter="url(#sf)"/>`;
    }
    s+=ridge(k+'r1'+(seedExtra||''),420,150,mc,night?0.22:0.12);
    s+=ridge(k+'r2'+(seedExtra||''),520,130,mc,night?0.34:0.20);
    s+=mist;
    /* 章节元素 */
    if(ch===1){ s+=EL.willow(300,760)+EL.stele(1180,700)+fireDot(1240,680,'#7fae8a',10)+fireDot(250,700,'#b8834a',8); }
    else if(ch===2){ s+=`<rect x="430" y="420" width="34" height="330" fill="${CIN}" opacity="0.85"/><rect x="1136" y="420" width="34" height="330" fill="${CIN}" opacity="0.85"/><rect x="420" y="404" width="760" height="26" fill="${INK2}"/>`+EL.lantern(500,470,1.1)+EL.lantern(1100,470,1.1)+EL.pine(800,760,1.25)+EL.pine(880,770,1.0); }
    else if(ch===3){ s+=EL.bolt(360,300,1.3)+EL.bolt(1180,250,1.0)+`<path d="M0 720 Q200 690 400 720 T800 720 T1200 720 T1600 720 V900 H0 Z" fill="${night?'#222a3e':'#9aa6b4'}" opacity="0.28"/>`;
      for(let i=0;i<5;i++){const x=200+i*300; s+=`<path d="M${x} 700 q14 -70 0 -110 M${x+26} 700 q14 -60 4 -100" stroke="${ORG}" stroke-width="6" fill="none" opacity="0.7"/>`;} }
    else if(ch===4){ s+=`<path d="M680 380 L760 200 L920 200 L1000 380 Z" fill="#d8d2c0" opacity="0.9"/><path d="M760 200 L840 380 M920 200 L840 380" stroke="#b8b2a0" stroke-width="4"/>`+EL.pine(360,780,1.2)+EL.pine(1240,780,1.3)+EL.pine(1320,800,0.9);
      for(let i=0;i<6;i++){s+=fireDot(420+R(k+'t'+i)()*760,300+R(k+'u'+i)()*120,CIN,7);} }
    else{ s+=EL.cloudScroll(300,700,1.3)+EL.cloudScroll(1150,740,1.1)+EL.cloudScroll(820,640,0.9);
      s+=`<rect x="610" y="380" width="70" height="330" fill="${INK2}"/><rect x="920" y="380" width="70" height="330" fill="${INK2}"/><rect x="580" y="330" width="440" height="64" fill="${INK}" opacity="0.85"/><rect x="640" y="260" width="320" height="80" fill="${INK2}"/>`;
      for(let i=0;i<7;i++){s+=`<path d="M${300+i*160} 800 L${300+i*160} 900" stroke="${GOLD}" stroke-width="3" opacity="0.4"/>`;} }
    s+=ridge(k+'r3'+(seedExtra||''),640,90,mc,night?0.5:0.32);
    s+=`<rect x="0" y="760" width="1600" height="140" fill="${INK}" opacity="${night?0.35:0.12}"/>`;
    if(night) s+=`<rect width="1600" height="900" fill="#10162a" opacity="0.18"/>`;
    return s+tailSvg(1600,900);
  }

  /* 工单场景模板 */
  const TASK_TPL={
    c2m2:'fire',c2m3:'temple',c2m4:'temple',c2m5:'water',
    c3m1:'indoor',c3m2:'water',c3m3:'indoor',c3m4:'night',c3m5:'indoor',
    s04:'indoor',s06:'fire',s08:'fire',s09:'indoor',s10:'water',
    s11:'temple',s12:'water',s13:'indoor',s14:'indoor',s15:'mountain',
    s16:'mountain',s17:'mountain',s18:'indoor',s19:'indoor',s20:'night',
    s21:'fire',s22:'water',s23:'temple',s24:'night',
    /* s25-s34 天曹外包化系列 */
    s25:'mountain',s26:'temple',s27:'night',s28:'mountain',s29:'night',
    s30:'indoor',s31:'indoor',s32:'night',s33:'mountain',s34:'water'
  };
  function task(k){
    const id=k.slice(5);
    const tpl=TASK_TPL[id]||'mountain';
    const ch=id[0]==='c'?+id[1]:(id>='s12'&&id<='s17'?4:(id>='s21'&&id<='s24')?5:(id>='s25'&&id<='s27')?1:(id>='s28'&&id<='s29')?2:3);
    if(tpl==='mountain') return landscape('mt_'+id,ch,false,id);
    if(tpl==='night') return landscape('nt_'+id,ch,true,id);
    let s=head(1600,900,PAPER);
    s+=ridge(id+'a',460,120,INK,0.1)+mist;
    if(tpl==='temple'){
      s+=`<rect x="0" y="720" width="1600" height="180" fill="${INK}" opacity="0.08"/>`;
      s+=EL.stele(250,700);
      /* 正殿 */
      s+=`<path d="M520 470 L800 300 L1080 470 Z" fill="${INK2}" filter="url(#b)"/><path d="M470 470 L1130 470 L1090 510 L510 510 Z" fill="${INK}"/>`
       +`<rect x="560" y="510" width="480" height="230" fill="${PAPER2}" opacity="0.85"/><rect x="600" y="510" width="30" height="230" fill="${CIN}" opacity="0.8"/><rect x="970" y="510" width="30" height="230" fill="${CIN}" opacity="0.8"/>`
       +`<rect x="730" y="560" width="140" height="180" fill="${INK}" opacity="0.78"/><rect x="690" y="540" width="220" height="26" fill="${INK2}"/>`
       +`<path d="M520 740 L1080 740 L1140 800 L460 800 Z" fill="${INK2}" opacity="0.8"/>`
       +EL.pine(1230,800,1.1)+EL.willow(150,800);
    }else if(tpl==='indoor'){
      s+=`<rect x="0" y="0" width="1600" height="120" fill="${INK2}" opacity="0.82"/><rect x="0" y="120" width="1600" height="26" fill="${INK}"/>`
       +`<rect x="120" y="146" width="40" height="600" fill="${INK2}"/><rect x="1440" y="146" width="40" height="600" fill="${INK2}"/>`
       +`<g opacity="0.5">${[0,1,2,3].map(r=>[0,1,2].map(c=>`<rect x="${980+c*110}" y="${240+r*120}" width="80" height="86" fill="none" stroke="${INK2}" stroke-width="5"/>`).join('')).join('')}</g>`
       +`<rect x="360" y="560" width="520" height="40" fill="${INK2}"/><rect x="400" y="600" width="36" height="180" fill="${INK2}"/><rect x="804" y="600" width="36" height="180" fill="${INK2}"/>`
       +`<rect x="900" y="600" width="300" height="40" rx="8" fill="${PAPER2}" stroke="${INK3}" stroke-width="4"/>`
       +EL.lantern(260,260,1.2)+`<circle cx="1130" cy="520" r="20" fill="${ORG}" opacity="0.5" filter="url(#sf)"/>`;
    }else if(tpl==='water'){
      s+=ridge(id+'b',520,140,INK,0.18);
      s+=`<path d="M0 620 Q400 590 800 620 T1600 620 V900 H0 Z" fill="${IDG}" opacity="0.18"/>`;
      for(let i=0;i<8;i++){s+=`<path d="M${100+i*200} ${700+(i%2)*40} q60 -22 120 0 M${60+i*200} ${780+(i%2)*24} q60 -22 120 0" stroke="${IDG}" stroke-width="5" fill="none" opacity="0.4"/>`;}
      s+=`<path d="M420 640 Q600 560 780 640" fill="none" stroke="${INK2}" stroke-width="14"/><line x1="470" y1="628" x2="470" y2="560" stroke="${INK2}" stroke-width="9"/><line x1="730" y1="628" x2="730" y2="560" stroke="${INK2}" stroke-width="9"/>`
       +`<path d="M540 560 L660 560 L640 470 L560 470 Z" fill="${PAPER2}" stroke="${INK2}" stroke-width="6"/>`
       +EL.pine(1180,680,0.9)+fireDot(1300,620,'#b8834a',8);
    }else if(tpl==='fire'){
      s+=`<rect x="0" y="0" width="1600" height="120" fill="${INK2}" opacity="0.8"/><rect x="120" y="120" width="36" height="640" fill="${INK2}"/><rect x="1444" y="120" width="36" height="640" fill="${INK2}"/>`
       +`<path d="M480 760 L480 470 Q480 380 620 380 L980 380 Q1120 380 1120 470 L1120 760 Z" fill="${INK2}" opacity="0.92" filter="url(#b2)"/>`
       +`<path d="M600 760 L600 560 Q600 480 700 480 L900 480 Q1000 480 1000 560 L1000 760 Z" fill="#1a1410"/>`
       +`<path d="M700 700 Q760 600 720 540 Q780 600 800 560 Q830 640 900 700 Z" fill="${ORG}" opacity="0.92" filter="url(#sf)"/>`
       +`<path d="M740 690 Q780 630 770 580 Q810 640 850 690 Z" fill="${CIN}"/>`
       +`<circle cx="800" cy="620" r="90" fill="${ORG}" opacity="0.18" filter="url(#sf2)"/>`
       +`<path d="M640 380 Q600 300 660 240 M960 380 Q1000 300 940 240" stroke="${INK3}" stroke-width="7" fill="none" opacity="0.5"/>`;
    }
    return s+tailSvg(1600,900);
  }

  /* ================= 墨印图标（200×200） ================= */
  const PATH_INFO={bing:{c:CIN,w:'刃'},fa:{c:IDG,w:'雷'},you:{c:PUR,w:'魂'},huo:{c:ORG,w:'火'},sheng:{c:GRN,w:'生'}};
  function iconBase(c){ return head(200,200,PAPER)+`<circle cx="100" cy="100" r="86" fill="none" stroke="${c}" stroke-width="6" opacity="0.85"/>`; }
  function skill(k){
    const p=k.slice(3, -1), tier=+k.slice(-1), info=PATH_INFO[p];
    let s=iconBase(info.c)+`<circle cx="100" cy="100" r="70" fill="${INK}"/>`;
    if(tier===3){ s+=`<circle cx="100" cy="100" r="76" fill="none" stroke="${CIN}" stroke-width="3"/>`+[[34,34],[166,34],[34,166],[166,166]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${CIN}"/>`).join(''); }
    if(tier>=2) s+=`<rect x="72" y="152" width="56" height="7" rx="3" fill="${info.c}" opacity="0.8"/>`;
    s+=txt(100,tier===3?92:96,info.w,PAPER,56);
    return s+tailSvg(200,200);
  }
  function grid(k){
    const p=k.slice(3), info=PATH_INFO[p], w={bing:'兵',fa:'法',you:'幽',huo:'火',sheng:'生'}[p];
    return head(200,200,PAPER)
      +`<rect x="14" y="14" width="172" height="172" rx="10" fill="none" stroke="${info.c}" stroke-width="10"/>`
      +`<rect x="28" y="28" width="144" height="144" rx="6" fill="none" stroke="${INK}" stroke-width="2" opacity="0.5"/>`
      +txt(100,104,w,INK,76)
      +[[40,40],[160,40],[40,160],[160,160]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${info.c}"/>`).join('')
      +tailSvg(200,200);
  }
  const PILL={it_danmo:{c:INK3,w:'尘',glow:false},it_dan:{c:GRN,w:'丹'},it_wang:{c:GOLD,w:'王'},it_xiong:{c:CIN,w:'凶'},it_bingzhu:{c:IDG,w:'兵'},it_gui:{c:PUR,w:'鬼'}};
  function pill(k){
    const d=PILL[k]||{c:INK3,w:'丹'};
    let s=head(200,200,PAPER);
    if(d.glow!==false) s+=`<circle cx="100" cy="100" r="80" fill="${d.c}" opacity="0.18" filter="url(#sf2)"/>`;
    s+=`<circle cx="100" cy="100" r="62" fill="${d.c}"/><circle cx="100" cy="100" r="62" fill="none" stroke="${INK}" stroke-width="3" opacity="0.4"/>`
      +`<ellipse cx="80" cy="78" rx="18" ry="11" fill="#fff" opacity="0.28"/>`;
    if(k==='it_bingzhu') s+=`<line x1="100" y1="52" x2="100" y2="146" stroke="${PAPER}" stroke-width="5" opacity="0.6"/><path d="M100 52 L90 64 L110 64 Z" fill="${PAPER}" opacity="0.8"/>`;
    s+=txt(100,104,d.w,PAPER,46);
    return s+tailSvg(200,200);
  }

  /* ---------- 总入口 ---------- */
  function make(key){
    try{
      if(key.startsWith('e_')) return enemy(key);
      if(key.startsWith('g_')) return godArt(key);
      if(key.startsWith('bf_')){ const m=key.match(/bf_c(\d)(n?)/); return landscape(key,+m[1],!!m[2]); }
      if(key.startsWith('scene_')){ const m=key.match(/scene_c(\d)/); return landscape(key,+m[1],false,'scene'); }
      if(key.startsWith('task_')) return task(key);
      if(key.startsWith('sk_')) return skill(key);
      if(key.startsWith('gh_')) return grid(key);
      if(PILL[key]) return pill(key);
      if(key==='stat_mp') return head(200,200,PAPER)+`<circle cx="100" cy="100" r="70" fill="${IDG}"/>`+txt(100,104,'力',PAPER,52)+tailSvg(200,200);
      return '';
    }catch(e){ return ''; }
  }
  return {make};
})();
