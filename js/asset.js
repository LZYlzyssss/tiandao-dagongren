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

  /* ---- 在线生成 URL ---- */
  url(key){
    const a=this.list[key]; if(!a) return '';
    /* 用 key 自身做缓存戳，保证同一资源 URL 稳定（首次生成后浏览器复用） */
    return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt='
      + encodeURIComponent(a[0]) + '&image_size=' + a[1] + '&_k=' + key;
  },
  file(key){ return 'img/'+key+'.jpg'; },

  /* ---- 本地图探测（Promise + 缓存） ---- */
  hasLocal(key){
    const f=this.file(key);
    if(this._probe[f]!==undefined) return Promise.resolve(this._probe[f]);
    if(this._probe[f]===null) return new Promise(res=>this._probeQueue.push(()=>res(this._probe[f])));
    this._probe[f]=null;
    return new Promise(res=>{
      const im=new Image();
      im.onload =()=>{ this._probe[f]=true;  this._flush(f); res(true);  };
      im.onerror=()=>{ this._probe[f]=false; this._flush(f); res(false); };
      im.src=f;
    });
  },
  _probe:{}, _probeQueue:[],
  _flush(f){ this._probeQueue.splice(0).forEach(fn=>fn()); },

  /* ---- 最终 src：本地优先 → 在线生成 ---- */
  async src(key){
    if(!this.list[key]) return '';
    if(await this.hasLocal(key)) return this.file(key);
    return this.url(key);
  },

  /* ---- <img> 标签：html() 出骨架，scan() 挂载回退链 ---- */
  html(key, cls, alt){
    return `<img class="${cls||''}" alt="${alt||''}" data-asset="${key}" src="">`;
  },
  mount(img, key){
    if(!key || !this.list[key]){ img.style.display='none'; return; }
    img.classList.add('asset-fade');
    let done=false, retryCount=0, maxRetry=2;
    const finish=(ok)=>{
      if(done) return; done=true;
      if(ok) img.classList.add('loaded');
      else img.classList.add('img-failed');
    };
    img.addEventListener('load', ()=>finish(true), {once:true});
    img.addEventListener('error', ()=>{
      if(done) return;
      if(retryCount<maxRetry){ retryCount++; img.src=this.url(key)+'&_r='+retryCount; }
      else finish(false);
    }, {once:true});
    this.src(key).then(s=>{
      if(!s){ img.classList.add('img-failed'); return; }
      img.src=s;
      /* 超时兜底：15 秒还没 load 就算失败 */
      setTimeout(()=>{ if(!done) finish(false); }, 15000);
    });
  },
  scan(root){
    (root||document).querySelectorAll('img[data-asset]').forEach(img=>{
      if(img.classList.contains('asseted')) return;
      img.classList.add('asseted');
      this.mount(img, img.dataset.asset);
    });
  },

  /* ---- 背景图：淡入设置 el 的 background-image（本地优先 → 在线） ---- */
  bg(el, key, opacity){
    if(!el || !this.list[key]){ if(el) el.style.opacity=0; return; }
    if(el._assetKey===key){ el.style.opacity=(opacity!=null?opacity:1); return; }
    el._assetKey=key;
    el.style.opacity=0;
    const target=(opacity!=null?opacity:1);
    this.src(key).then(s=>{
      if(el._assetKey!==key) return;      /* 已被新的覆盖 */
      if(!s) return;
      const pre=new Image();
      pre.onload =()=>{ if(el._assetKey===key){ el.style.backgroundImage=`url("${s}")`; el.style.opacity=target; } };
      pre.onerror=()=>{
        const u=this.url(key);
        if(u && el._assetKey===key){ el.style.backgroundImage=`url("${u}")`; el.style.opacity=target; }
      };
      pre.src=s;
    });
  },

  /* ---- 便捷取 key ---- */
  bfKey(ch, night){ return 'bf_c'+Math.min(5,Math.max(1,ch||1))+(night?'n':''); },
  sceneKey(ch){ return 'scene_c'+Math.min(5,Math.max(1,ch||1)); },
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

/* ---------- 工单专属场景图（38） ---------- */
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

/* ---------- 神明立绘（B/A/S 共 25，复用 GODS.img 提示词） ---------- */
const GOD_ART=['zhao_gongming','wen_chang','ma_zu','guan_yu','wang_lingguan','zeng_zhang','duo_wen','qin_guang','yan_luo','zhuan_lun','ao_guang','zhong_yue','er_lang','ne_zha','zhen_wu','lei_zu','xi_yue','xuan_nv','guan_yin','di_zang','wei_tuo','sun_wukong','feng_du','dong_yue','xi_wangmu'];
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
