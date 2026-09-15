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
    return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt='
      + encodeURIComponent(a[0]) + '&image_size=' + a[1];
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
    this.src(key).then(s=>{
      if(!s){ img.style.display='none'; return; }
      img.addEventListener('load', ()=>img.classList.add('loaded'));
      img.src=s;
    });
    img.onerror=()=>{
      if(img.dataset.step!=='api' && this.url(key)){
        img.dataset.step='api'; img.src=this.url(key);
      }else{
        img.style.display='none';
      }
    };
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
