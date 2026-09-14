/* ================= 天道打工人 · 数据层 ================= */

/* ---------- 道途 ---------- */
const PATHS = {
  war:        { name:'战',   desc:'攻伐斗战' },
  buddha:     { name:'佛',   desc:'慈悲勘破' },
  revelation: { name:'天启', desc:'圣光神裁' },
  nether:     { name:'幽冥', desc:'拘魂律杀' },
  fire:       { name:'火德', desc:'焚灭风火' },
};
/* 道争：天启 ⟷ 幽冥 不可轻同修 */
const PATH_CLASH = [['revelation','nether']];
/* 同道共鸣：同途两枚及以上 */
const RESONANCE_NEED = 2;

/* ---------- 神明（甲方） ----------
 tier: E见习小神 / D基层正神 / C有名号的神 / B一方大员 / A天庭顶级
 unlock: 解锁条件 {rank:品阶序号} / {chapter:章节} / {by:某神引荐} / null 初始可遇
 aid: 好感 Lv2+ 战斗中可呼叫的神明援助（每场一次）
 gifts: 送礼偏好 loved挚爱+18 / liked喜欢+8 / disliked忌讳+1，其余+4
*/
const GODS = {
  tudi:   { name:'土地公', title:'一方土地·地保', icon:'土', tier:'E', unlock:null,
    img:'Chinese ink wash painting of a kind old earth god with white beard holding a gnarled wooden staff, warm smile, sumi-e style with ochre and moss green accents, rice paper texture, portrait',
    aid:{ name:'土地借道', type:'heal', heal:0.25,
      desc:'唤土地公引地脉灵气，回复 25% 生命。' },
    gifts:{ loved:['wugu'], liked:['xiangzhu','taomu'], disliked:['hulu'] } },
  chenghuang:{ name:'城隍爷', title:'本境城隍', icon:'城', tier:'D', unlock:{rank:1},
    img:'Chinese ink wash painting of a dignified city god magistrate in formal robes holding a jade tablet, sumi-e style with deep indigo and vermilion accents, rice paper texture, portrait',
    aid:{ name:'城隍签押', type:'shield', shield:0.25,
      desc:'城隍朱笔签押，获得 25% 生命上限的护盾。' },
    gifts:{ loved:['xiangzhu'], liked:['wugu','taomu'], disliked:['hulu'] } },
  nezha: { name:'哪吒',   title:'三坛海会大神', icon:'吒', tier:'C', unlock:{rank:2},
    img:'Chinese ink wash painting of child deity Nezha with fire wheels and red armillary sash, sumi-e brush style, vermilion and gold accents, rice paper texture, portrait',
    aid:{ name:'风火轮助', type:'burn', rounds:3, pct:0.4,
      desc:'哪吒借你风火轮一转，点燃敌人 3 回合（每回合受 40% 你攻击的伤害）。' },
    gifts:{ loved:['hulu'], liked:['panta','taomu'], disliked:['mozhen'] } },
  yan:   { name:'阎魔王', title:'地府之主·你的顶头上司', icon:'阎', tier:'B', unlock:null,
    img:'Chinese ink wash painting of King Yama judge of the underworld in dark robes with judge brush and record book, stern, sumi-e style, dark purple and cinnabar accents, portrait',
    aid:{ name:'朱笔勾魂', type:'percent', pct:0.25, stun:1,
      desc:'阎王爷遥遥朱笔一点，勾去敌人 25% 最大生命并震骇 1 回合。' },
    gifts:{ loved:['mozhen'], liked:['xiangzhu','puti'], disliked:['hulu'] } },
  sun:   { name:'孙悟空', title:'斗战胜佛', icon:'佛', tier:'A', unlock:{rank:2},
    img:'Chinese ink wash painting of Sun Wukong the Monkey King holding golden staff, dramatic sumi-e brush strokes, cinnabar red accents, rice paper texture, portrait',
    aid:{ name:'金箍棒影', type:'nuke', mult:2.5,
      desc:'大圣随手一棒压阵，造成 250% 你攻击的伤害。' },
    gifts:{ loved:['panta'], liked:['hulu','puti'], disliked:['mozhen'] } },
  micah: { name:'米迦勒', title:'天使长',     icon:'光', tier:'A', unlock:{rank:3},
    img:'Chinese ink wash painting of archangel Michael with holy wings and flaming sword, sumi-e style with indigo blue and gold color accents, rice paper texture, portrait',
    aid:{ name:'圣光垂照', type:'healShield', heal:0.35, shield:0.2,
      desc:'天使长垂下一缕圣光，回复 35% 生命并获得 20% 护盾。' },
    gifts:{ loved:['puti'], liked:['panta','taomu'], disliked:['hulu'] } },
};

/* 好感等级：favor 阈值 → 称谓 */
const FAVOR_LEVELS = [
  { v:0,  name:'相识' },
  { v:20, name:'相熟' },
  { v:40, name:'信重' },
  { v:60, name:'莫逆' },
  { v:80, name:'生死之交' },
];

/* ---------- 神格 ----------
 stat: 镶嵌即得（无论觉醒）
 passive: 觉醒后持续
 active: 觉醒后可在战斗关键时刻「祭法宝」
*/
const GODHOODS = {
  douzhan:{
    name:'斗战', god:'sun', path:'war', icon:'战',
    desc:'齐天大圣劈开凌霄殿的那一口气。',
    cult:30, stat:{hp:20,atk:6},
    passive:{crit:0.15, label:'暴击率+15%'},
    active:{name:'如意千钧', cost:30, type:'nuke', mult:2.8,
      desc:'金箍棒影砸下，造成 280% 攻击的伤害。'}
  },
  huoyan:{
    name:'火眼金睛', god:'sun', path:'buddha', icon:'睛',
    desc:'八卦炉里熏了四十九天的眼力，妖邪无所遁形。',
    cult:30, stat:{hp:10,def:5},
    passive:{crit:0.1, label:'暴击率+10%'},
    active:{name:'勘破虚实', cost:20, type:'vuln', mult:0.8, vuln:2,
      desc:'看破敌之破绽：造成伤害并令其 2 回合内承伤+50%。'}
  },
  shengzhan:{
    name:'圣战', god:'micah', path:'revelation', icon:'裁',
    desc:'天国军团出征前，天使长分出的一缕战意。',
    cult:35, stat:{hp:25,atk:4},
    passive:{lifesteal:0.1, label:'吸血10%'},
    active:{name:'圣光裁决', cost:35, type:'nukeHeal', mult:2.0, heal:0.25,
      desc:'圣剑贯敌，造成 200% 攻击伤害并回复自身 25% 生命。'}
  },
  shouhu:{
    name:'圣光守护', god:'micah', path:'revelation', icon:'盾',
    desc:'六翼之下，连堕天使的爪牙也要退避。',
    cult:35, stat:{hp:20,def:8},
    passive:{def:8, label:'防御+8'},
    active:{name:'圣盾', cost:25, type:'shield', shield:0.4, rounds:3,
      desc:'展开光盾：3 回合内获得相当于 40% 生命上限的护盾。'}
  },
  fenghuo:{
    name:'风火灵珠', god:'nezha', path:'fire', icon:'火',
    desc:'风火轮溅落的一点本源，落地便要烧穿人间。',
    cult:30, stat:{hp:10,atk:5},
    passive:{atk:5, label:'攻击+5'},
    active:{name:'风火轮', cost:25, type:'burn', mult:1.2, burnRounds:3, burnPct:0.4,
      desc:'风火加身：造成伤害并令敌灼烧 3 回合（每回合受 40% 攻击的伤害）。'}
  },
  juhun:{
    name:'拘魂律', god:'yan', path:'nether', icon:'律',
    desc:'阎王批一笔，神仙也断魂。',
    cult:35, stat:{hp:20,def:6},
    passive:{lifesteal:0.1, label:'吸血10%'},
    active:{name:'拘魂', cost:30, type:'percentStun', pct:0.3,
      desc:'一笔勾销：造成敌人 30% 最大生命的真实伤害并震骇 1 回合。'}
  },
  /* 融合神格 */
  qitian:{
    name:'齐天圣战', god:null, path:'war', icon:'齐', fusion:true,
    desc:'斗战之逆骨与圣战之天火烧作一处，连天规都敢打烂。',
    cult:80, stat:{hp:45,atk:12,def:4},
    passive:{crit:0.2, atk:10, label:'暴击率+20%，攻击+10'},
    active:{name:'大闹天国', cost:50, type:'nukeStun', mult:4.0,
      desc:'一棒掀翻天国门楣：400% 攻击伤害，并震骇敌人 1 回合。'}
  },
  zhongri:{
    name:'末日判官', god:null, path:'nether', icon:'终', fusion:true,
    desc:'地府朱笔与末日号角同时落下，终审已至，诸神噤声。',
    cult:80, stat:{hp:50,atk:8,def:10},
    passive:{lifesteal:0.15, def:6, label:'吸血15%，防御+6'},
    active:{name:'终审日', cost:55, type:'percentHeal', pct:0.4, heal:0.3,
      desc:'终审判词：造成敌人 40% 最大生命的真实伤害，并回复自身 30% 生命。'}
  },
};
const FUSIONS = [
  { out:'qitian',  in:['douzhan','shengzhan'], cost:500, baseRate:0.5 },
  { out:'zhongri', in:['juhun','shouhu'],      cost:500, baseRate:0.5 },
];

/* ---------- 敌人模板（hpLabel:血条名称；burnFx:附带灼烧的名目） ---------- */
const ENEMIES = {
  monkeyl: { name:'叛逃小猴', icon:'猴', tint:'#8a6a3a', hp:70,  atk:14, def:4, hpLabel:'妖力', deathFx:'黑烟' },
  monkeyp: { name:'妖猴教头', icon:'猿', tint:'#7a4f28', hp:120, atk:18, def:6, hpLabel:'妖力', deathFx:'黑烟' },
  liuer:   { name:'六耳妖将', icon:'六', tint:'#96301f', hp:150, atk:20, def:8, crit:0.1, hpLabel:'妖力', deathFx:'黑烟' },
  fallen:  { name:'堕天天使', icon:'堕', tint:'#2e4f6f', hp:115, atk:19, def:6, lifesteal:0.15, hpLabel:'邪力', burnFx:'黑焰', burnHit:0.15, deathFx:'黑羽' },
  fallchief:{name:'堕天使长', icon:'闇', tint:'#1d3550', hp:250, atk:30, def:9, hpLabel:'邪力', burnFx:'黑焰', deathFx:'黑羽' },
  ghost:   { name:'游魂',     icon:'魂', tint:'#6f6a7a', hp:80,  atk:15, def:2, hpLabel:'魂力', deathFx:'残烟' },
  ligui:   { name:'厉鬼',     icon:'厉', tint:'#574266', hp:160, atk:25, def:5, hpLabel:'魂力', deathFx:'残烟' },
  guiwang: { name:'鬼王',     icon:'王', tint:'#3d2c4d', hp:250, atk:31, def:8, crit:0.1, hpLabel:'魂力', deathFx:'残烟' },
  fireling:{ name:'火灵童子', icon:'焱', tint:'#d2571c', hp:85,  atk:16, def:3, burnHit:0.3, burnFx:'火星', hpLabel:'妖力', deathFx:'火星' },
  firebeast:{name:'火魔兽',   icon:'焰', tint:'#a83a1c', hp:185, atk:25, def:7, burnHit:0.35, burnFx:'火星', hpLabel:'妖力', deathFx:'火星' },
};

/* ---------- 法宝（slot: weapon兵刃 / armor护身 / trinket奇物；每栏只能穿戴一件）
   grade: 凡品 / 灵品 / 宝品
   stat: 常驻属性；proc: 战斗特效 stun震慑/healStart开战回血/dmgReduce减伤/burnOnHit命中点燃 ---------- */
const SLOT_INFO = {
  weapon:  { name:'兵刃', icon:'刃', desc:'主攻伐，提升攻击与暴击' },
  armor:   { name:'护身', icon:'护', desc:'主守御，提升生命、防御与减伤' },
  trinket: { name:'奇物', icon:'奇', desc:'旁门妙用，回血、锁魂、吸血、点火' },
  gift:    { name:'礼单', icon:'礼', desc:'送与神明结善缘，每位神明每日只受一礼' },
};
/* 旧货回收：老道只按原价的一半收（向下取整） */
const SELL_RATE = 0.5;
const ITEMS = {
  /* 兵刃 */
  pan:    { name:'判官笔', slot:'weapon', grade:'凡品', price:200, icon:'笔', desc:'攻击 +8。朱笔一点，即定生死。', stat:{atk:8} },
  zhan:   { name:'斩妖剑', slot:'weapon', grade:'灵品', price:460, icon:'剑', desc:'攻击 +13，暴击率 +5%。', stat:{atk:13,crit:0.05} },
  chui:   { name:'碎岳锤', slot:'weapon', grade:'宝品', price:780, icon:'锤', desc:'攻击 +20，暴击率 +8%。一锤落下，山灵也要矮三分。', stat:{atk:20,crit:0.08} },
  /* 护身 */
  jia:    { name:'锁子黄金甲', slot:'armor', grade:'凡品', price:380, icon:'甲', desc:'防御 +10。', stat:{def:10} },
  pei:    { name:'龟息玉佩', slot:'armor', grade:'灵品', price:520, icon:'佩', desc:'神躯上限 +45。', stat:{hp:45} },
  yi:     { name:'八卦紫绶仙衣', slot:'armor', grade:'宝品', price:680, icon:'衣', desc:'受到的所有伤害降低 12%。', proc:{dmgReduce:0.12} },
  /* 奇物 */
  chen:   { name:'太乙拂尘', slot:'trinket', grade:'凡品', price:260, icon:'尘', desc:'每场战斗开始时恢复 25% 生命。', proc:{healStart:0.25} },
  suo:    { name:'锁魂链', slot:'trinket', grade:'凡品', price:320, icon:'链', desc:'攻击命中时 18% 概率锁魂，令敌 1 回合不能行动。', proc:{stun:0.18} },
  hu:     { name:'聚魂葫芦', slot:'trinket', grade:'灵品', price:560, icon:'葫', desc:'攻击附带 8% 吸血。', stat:{lifesteal:0.08} },
  yin:    { name:'神火印', slot:'trinket', grade:'宝品', price:900, icon:'印', desc:'命中时 30% 概率以火星点燃敌人，2 回合内每回合受你攻击 30% 的灼烧伤害。', proc:{burnOnHit:0.3} },
  /* 礼物（slot: gift，送与神明增进好感，各神偏好见 GODS.gifts） */
  taomu:   { name:'桃木如意', slot:'gift', grade:'凡品', price:150, icon:'桃', desc:'老桃木雕的小如意，平实讨喜，各路神明都不至于嫌弃。' },
  wugu:    { name:'五谷福袋', slot:'gift', grade:'凡品', price:200, icon:'谷', desc:'新粟新稻缝成的福袋，土地公见了走不动道。' },
  xiangzhu:{ name:'龙涎香烛', slot:'gift', grade:'凡品', price:180, icon:'烛', desc:'一燃便满殿生香，衙门里的神明都吃这一套。' },
  mozhen:  { name:'徽墨「铁斋」', slot:'gift', grade:'灵品', price:300, icon:'墨', desc:'一两徽墨一两银。朱笔判官们案头最缺的就是这个。' },
  panta:   { name:'蟠桃（次品）', slot:'gift', grade:'灵品', price:320, icon:'果', desc:'瑶池挑剩的次品，但猴子才不管品相。' },
  hulu:    { name:'杏仁酒葫芦', slot:'gift', grade:'灵品', price:340, icon:'酒', desc:'装着杏花酿的小葫芦，严肃的神明多半摇头，爱酒的神仙两眼放光。' },
  puti:    { name:'金菩提', slot:'gift', grade:'宝品', price:600, icon:'菩', desc:'菩提树顶摘的金果，佛门至宝，天使长见了也要侧目。' },
};

/* ---------- 阴兵 ---------- */
const SOLDIERS = {
  xiaojiang:{ name:'鬼差',     price:90,  icon:'差', desc:'先制偷袭：第一回合额外打出 50% 攻击的一击。' },
  duwei:    { name:'阴兵小将', price:180, icon:'将', desc:'挡刀：20% 概率替你挡下本回合一半伤害。' },
};

/* ---------- 神衙设施 ---------- */
const FACILITIES = {
  shrine:{ name:'神龛', icon:'龛', desc:'供奉所得神格，提升觉醒概率。',
    levels:[{cost:200, wakeBonus:0.15},{cost:450, wakeBonus:0.30}] },
  desk:  { name:'案几', icon:'案', desc:'拓宽工单架，每日多接状纸。',
    levels:[{cost:250, shelf:1}] },
  incense:{name:'香炉', icon:'香', desc:'神力上限+30。',
    levels:[{cost:180, mana:30},{cost:400, mana:30}] },
  banner:{ name:'招妖幡', icon:'幡', desc:'阴兵编制+1。',
    levels:[{cost:220, cap:1},{cost:420, cap:1}] },
};

/* ---------- 品阶 ---------- */
const RANKS = [
  { name:'九品阴神', slots:3 },
  { name:'从八品阴神', slots:4 },
  { name:'八品阴神', slots:4 },
  { name:'从七品判官', slots:5 },
  { name:'七品判官', slots:5 },
];
/* 各月考核功过目标 */
function monthTarget(month){ return 50 + month*15; }
const MONTH_DAYS = 30;

/* ---------- 工单 ----------
 节点类型：event(抉择) / battle
 event.choice.requires: {path} / {godhood} / 无条件
 r 字段：hp(立即扣血，负数) / heal / atkBuff(本单攻击加成) / shield(开局护盾，占生命上限比)
        enemyAtk(敌方攻击修正) / enemyVuln(敌方易伤) / money / log
 类型标记：
   forced  官遣单，不得驳回，跨日保留
   gh:null 该单无神格可赐（低阶神私活），只有钱/功过/好感
   long    长单：acts[] 多幕跨天推进，shelf 项记 act 进度，全部幕完成才结算
   main    主线章单：chapter 章节门槛，完成后推进 Game.s.chapter 并记 flags
*/
const MISSIONS = [
{
  id:'m1', god:'sun', danger:2, forced:false,
  name:'花果山猴患', gh:'douzhan', merit:12, money:60,
  scroll:'斗战胜佛成佛后不理俗务，六耳旧党占了花果山称王，还偷了瑶池的御酒。佛祖不便动手，诉状用一颗桃核压着，送到了你的案头。',
  nodes:[
    { type:'event', text:'花果山桃叶被晚霞染得像血。一群小猴持着削尖的竹竿拦路，口口声声说要替大圣爷爷“考校考朝廷的本事”。',
      choices:[
        { t:'鸣锣亮明神衙身份', r:{log:'猴群被你的官威镇住三分，悻悻让开一条路。'} },
        { t:'放火烧山，一路烧上去', requires:{path:'fire'}, r:{atkBuff:0.3, log:'火德神格发威，火势卷上山道，猴兵焦头烂额，你气势如虹。'} },
        { t:'走后山小道绕过去', r:{hp:-12, log:'小道荆棘丛生，你刮了满身血痕才摸到前寨。'} },
      ]},
    { type:'battle', enemy:'monkeyl' },
    { type:'event', text:'老猴王捧着一筐仙桃跪在路边求饶，筐底却隐隐露出半截削尖的金箍棒影。',
      choices:[
        { t:'收下仙桃，放他一马', r:{heal:30, enemyAtk:0.25, log:'仙桃鲜甜，你恢复了些气力——可老猴王眼底闪过一丝狡黠。'} },
        { t:'一脚踢翻果筐，厉声申斥', r:{atkBuff:0.2, log:'邪不压正，你心头一股肃杀之气升腾。'} },
      ]},
    { type:'battle', enemy:'liuer' },
  ]
},
{
  id:'m2', god:'sun', danger:3, forced:false,
  name:'旧庙假谕案', gh:'huoyan', merit:18, money:100,
  scroll:'取经旧庙里出了桩怪事：妖猴假冒“六耳真传”，向四方土地收保护费。悟空正陪唐僧讲经，递了张条子：“看着办，别打死，留活口给俺老孙出气。”',
  nodes:[
    { type:'event', text:'破庙香烟缭绕，庙祝把你当香客往里让。供桌上的猴像描金画银，比真佛还阔气。',
      choices:[
        { t:'直入山门，拿神印砸场子', r:{hp:-10, log:'埋伏的猴教头一拥而上，你挨了几下闷棍才稳住阵脚。'} },
        { t:'化作香客，先探虚实', r:{log:'你摸清了三处埋伏，心中有数。'} },
        { t:'登坛讲经，以佛理折服群猴', requires:{path:'buddha'}, r:{enemyAtk:-0.2, log:'佛门神格大放光明，群猴心虚腿软，棍棒都举不直了。'} },
      ]},
    { type:'battle', enemy:'monkeyp' },
    { type:'event', text:'后殿搜出一摞伪造的“大圣法旨”，墨还没干。留着是物证，撕了痛快。',
      choices:[
        { t:'撕毁假谕，先出口恶气', r:{atkBuff:0.2, log:'假谕纷飞如雪，你只觉通体畅快。'} },
        { t:'封存物证，日后呈堂', r:{money:40, log:'阎王赏你办案周全，批了一小笔勘验津贴。'} },
      ]},
    { type:'battle', enemy:'liuer', scale:1.15 },
  ]
},
{
  id:'m3', god:'micah', danger:3, forced:false,
  name:'失光之羽案', gh:'shengzhan', merit:18, money:100,
  scroll:'天使长米迦勒的一根光羽在两界裂隙处失落，据说被堕天使截去熔作兵器。委托文书用金粉写成，附言一行：“费用从神格里扣，光羽务必完好。”',
  nodes:[
    { type:'event', text:'北疆荒原，冻土开裂，裂隙中渗出黑色的光。一串焦黑的羽毛直通地底。',
      choices:[
        { t:'循着光痕疾追', r:{log:'你与夜风赛跑，赶上了堕天使的殿后小队。'} },
        { t:'向天祈祷，借天启之光引路', requires:{path:'revelation'}, r:{heal:20, atkBuff:0.2, log:'暖光垂落，你气力充盈，脚步轻盈如飞。'} },
        { t:'摸黑下到裂隙底部', r:{hp:-12, log:'裂隙边缘的黑焰灼伤了你的神躯。'} },
      ]},
    { type:'battle', enemy:'fallen' },
    { type:'event', text:'裂隙深处蜷着一群被蛊惑的牧民，他们把黑羽当成了神迹在膜拜。',
      choices:[
        { t:'先净化牧民身上的黑气', r:{heal:25, log:'黑气散去，牧民的眼泪落在你手背上，化作点点暖意。'} },
        { t:'正事要紧，绕道前行', r:{atkBuff:0.15, log:'你压下杂念，把全部心神凝在剑上。'} },
      ]},
    { type:'battle', enemy:'fallchief' },
  ]
},
{
  id:'m4', god:'micah', danger:4, forced:false,
  name:'裂隙守门战', gh:'shouhu', merit:26, money:160,
  scroll:'两界裂隙今夜大开，堕天使军团要借道直闯人间。米迦勒的军令只有八个字：“守住关口，直到天亮。”',
  nodes:[
    { type:'event', text:'裂隙如一道竖在天地间的黑色伤口，门闩是三枚生锈的伏魔钉，眼看就要崩断。',
      choices:[
        { t:'以神力强行撑住封印', r:{hp:-20, log:'你用肩膀抵住门闩，黑焰顺着甲缝往里钻。'} },
        { t:'调幽冥律令加固伏魔钉', requires:{path:'nether'}, r:{shield:0.3, log:'律令落处，伏魔钉重新生根，你周身浮起一层幽暗护甲。'} },
        { t:'在门前摆开阵势，以攻代守', r:{atkBuff:0.25, log:'最好的防守是进攻——你横剑当关。'} },
      ]},
    { type:'battle', enemy:'fallen' },
    { type:'event', text:'第一波退去，天边仍无亮色。是就地喘息，还是乘胜压上？',
      choices:[
        { t:'收拢阵形，调息恢复', r:{heal:28, log:'你咽下一口带着光屑的风，伤势渐合。'} },
        { t:'趁敌立足未稳，衔尾追击', r:{atkBuff:0.25, log:'你踏着黑羽杀回裂隙，气势如虹。'} },
      ]},
    { type:'battle', enemy:'fallchief', scale:1.2 },
  ]
},
{
  id:'m5', god:'nezha', danger:2, forced:false,
  name:'风火闹陈塘', gh:'fenghuo', merit:12, money:60,
  scroll:'三坛海会大神巡视东海，风火轮甩出几粒火星，落在陈塘关外化成了火灵童子，把城关的灯笼全点着了。大神嫌丢面子，托你“悄悄收了，别声张”。',
  nodes:[
    { type:'event', text:'陈塘关外，一群扎着冲天辫的火灵孩童举着小灯笼乱跑，所过之处灯笼自燃，百姓却只当是吉兆。',
      choices:[
        { t:'蹲下身，拿糖葫芦哄它们', r:{heal:15, log:'火灵童子舔着糖葫芦，乖乖钻进你的收妖袋——除了最后一只。'} },
        { t:'掐诀强行驱散', r:{hp:-8, log:'火星乱窜，燎焦了你半边眉毛。'} },
      ]},
    { type:'battle', enemy:'fireling' },
    { type:'event', text:'最大的一只火灵捧着半块风火轮残片，歪头看你，似乎认出了旧主的气息。',
      choices:[
        { t:'以火德神格相引，唤它归位', requires:{path:'fire'}, r:{enemyVuln:true, log:'同源之火相吸，火灵浑身酥软，再难凝聚火焰。'} },
        { t:'扔出收妖袋，强行收伏', r:{atkBuff:0.2, log:'袋口大张，你抡圆了膀子压上。'} },
      ]},
    { type:'battle', enemy:'firebeast', scale:0.95 },
  ]
},
{
  id:'m6', god:'nezha', danger:3, forced:false,
  name:'缚妖索断扣案', gh:'fenghuo', merit:18, money:100,
  scroll:'天庭法宝库清点，哪吒发现缚妖索上少了一枚锁扣，几只陈年游魂顺着缺口溜进了库房。大神写来字条：“赔锁扣的钱从我香火里扣，魂你得还我。”',
  nodes:[
    { type:'event', text:'法宝库深处，断口的缚妖索无力地垂着，游魂们披着残破甲胄，正啃噬一杆老火尖枪。',
      choices:[
        { t:'摸黑潜行，先索后魂', r:{hp:-10, log:'游魂的指甲擦过你的后颈，凉得刺骨。'} },
        { t:'掷火照明，亮阵擒拿', requires:{path:'fire'}, r:{atkBuff:0.3, log:'火光满堂，游魂在火德之光下无处遁形。'} },
      ]},
    { type:'battle', enemy:'ghost' },
    { type:'event', text:'缚妖索的断口还在渗着阴气，补牢它能护你一时，追下去则凶险难料。',
      choices:[
        { t:'先将断口重新系牢', r:{shield:0.3, log:'断索如蛇般缠上你手臂，化作一圈护体索影。'} },
        { t:'机不可失，径直追魂', r:{hp:-10, atkBuff:0.15, log:'你压下伤势，越追越近。'} },
      ]},
    { type:'battle', enemy:'ligui' },
  ]
},
{
  id:'m7', god:'yan', danger:3, forced:false,
  name:'枉死城暴动', gh:'juhun', merit:18, money:100,
  scroll:'枉死城的鬼犯趁盂兰盆会闹事，打翻了孟婆的汤锅。阎王爷的朱批只有一行：“着即镇压，魂魄要全。”',
  nodes:[
    { type:'event', text:'枉死城里忘川倒灌，醉了汤的游魂举着破碗当兵器，嘴里念叨着前世的冤屈。',
      choices:[
        { t:'高举阎王敕令，鸣锣弹压', r:{log:'官印在阴天里泛着冷光，游魂退了半步。'} },
        { t:'以幽冥律令号令群魂', requires:{path:'nether'}, r:{atkBuff:0.3, log:'律令如山，群魂本能地跪伏了一地。'} },
        { t:'换身鬼卒衣服混进去', r:{hp:-10, log:'你被认了出来，挨了一顿乱碗。'} },
      ]},
    { type:'battle', enemy:'ghost' },
    { type:'event', text:'一只老鬼捧着满满一褡裢纸钱，硬往你手里塞，求你高抬贵手。',
      choices:[
        { t:'收下买路钱，网开一面', r:{money:60, enemyAtk:0.25, log:'纸钱入手沉甸甸的——老鬼转身就给厉鬼报了信。'} },
        { t:'打翻褡裢，厉声拿人', r:{atkBuff:0.2, log:'纸钱漫天，你出手不留半分情面。'} },
      ]},
    { type:'battle', enemy:'ligui', scale:1.1 },
  ]
},
{
  id:'m8', god:'yan', danger:4, forced:true,
  name:'生死簿异', gh:'juhun', merit:26, money:160,
  scroll:'【官遣·不得驳回】判官发现生死簿上有三页被人擅自改了阳寿，朱批墨痕未干。阎王爷亲自降谕：查。钦此。（末尾另附小字：办砸了，你俩一起投胎。）',
  nodes:[
    { type:'event', text:'簿房的门虚掩着，墨香里混着血腥味。案上的朱批有两种笔迹：一种是判官的，另一种……不像活人写的。',
      choices:[
        { t:'先比对两处朱批的笔法', r:{log:'你看出伪笔锋中带钩，是被涂改过数次的老字。'} },
        { t:'以幽冥感应搜捕残魂', requires:{path:'nether'}, r:{atkBuff:0.25, heal:15, log:'残魂的哭号顺着律令传入你耳中，你心中再无疑虑。'} },
        { t:'一脚踹门，先拿人再说', r:{hp:-15, log:'门后阴风扑面，像被无数只手推了一把。'} },
      ]},
    { type:'battle', enemy:'ligui' },
    { type:'event', text:'黑影伏在梁上，手里还攥着判官笔的笔帽。它似乎也在等你先开口。',
      choices:[
        { t:'欺身先拘它一魂', r:{atkBuff:0.3, log:'先手为强，律令脱手而出。'} },
        { t:'稳住它，问话拖延', r:{heal:15, log:'你与它绕着柱子周旋，趁机调匀了呼吸。'} },
      ]},
    { type:'battle', enemy:'guiwang' },
  ]
},
/* ================= 低阶神短单（无神格，攒钱攒功过攒好感） ================= */
{
  id:'m9', god:'tudi', danger:2, forced:false,
  name:'野狐占庙案', gh:null, merit:10, money:50,
  scroll:'村头土地庙被一只成了精的野狐占了，挂着"胡三太爷"的幌子受香火。土地公被挤在庙外槐树下，捻着胡子直叹气："小神位卑，斗它不过，你替我走一遭？"',
  nodes:[
    { type:'event', text:'土地庙门口挂了新幌，狐狸精端坐供桌之上，尾巴藏都懒得藏。香客们磕头磕得正起劲。',
      choices:[
        { t:'亮出神衙文书，宣读驱邪令', r:{log:'文书一亮，香客哗然，野狐的"神迹"先折了三分。'} },
        { t:'佯装香客上香，近身再拿', r:{hp:-10, log:'离得近了才发现，这狐狸修为不俗，一爪挠得你袖子开线。'} },
        { t:'请土地公断了庙里的香火引', requires:{path:'nether'}, r:{atkBuff:0.25, log:'地脉一断，野狐借不到地气，焦躁地在梁上乱窜。'} },
      ]},
    { type:'battle', enemy:'ghost' },
    { type:'event', text:'野狐现了原形，原来是被庙里最后一位老庙祝的执念拖住，走不了也走不脱。',
      choices:[
        { t:'超度老庙祝的执念', r:{heal:20, log:'执念散作一缕青烟，庙里忽然清净，你的神躯也暖了几分。'} },
        { t:'收了野狐的妖丹抵罚', r:{money:40, log:'妖丹入手温润，土地公在旁边看得直咂嘴，没敢吭声。'} },
      ]},
    { type:'battle', enemy:'ligui', scale:0.9 },
  ]
},
{
  id:'m10', god:'tudi', danger:3, forced:false,
  name:'田埂拘魂令', gh:null, merit:14, money:80,
  scroll:'城郊三十里农田颗粒无收，夜里总有白影蹲在田埂上数稻穗。土地公说那是前朝饿死的佃农魂，没人烧过一顿饱饭纸钱，怨气打了结。"你去劝劝，劝不动……就按规矩办。"',
  nodes:[
    { type:'event', text:'月色下，白影们排成一列数稻穗，数一穗叹一声，声声都往人骨头缝里钻。',
      choices:[
        { t:'烧一车纸钱，先安其心', r:{heal:15, log:'火光里白影们的脊背渐渐直了些，怨气松了一半。'} },
        { t:'开坛讲律，讲明超度章程', requires:{path:'nether'}, r:{atkBuff:0.3, log:'幽冥律令一出，群魂肃然列队，比生人还守规矩。'} },
        { t:'直接摆开拘魂阵', r:{hp:-12, log:'群魂受惊四散，阵里阵外乱作一团，你也挨了几记阴风。'} },
      ]},
    { type:'battle', enemy:'ghost', scale:1.1 },
    { type:'event', text:'领头的老佃农魂攥着一穗秕谷不肯撒手："这是俺佃了三十年才等到的一场好收成。"',
      choices:[
        { t:'把那穗谷亲手替他收进仓', r:{heal:20, log:'谷粒入仓那一刻，老魂咧嘴一笑，散成了满天萤火。'} },
        { t:'依律强行勾魂入册', r:{atkBuff:0.2, log:'律令无情，你出手干脆利落，心头却压了点什么。'} },
      ]},
    { type:'battle', enemy:'ligui' },
  ]
},
{
  id:'m11', god:'chenghuang', danger:2, forced:false,
  name:'庙会丢魂案', gh:null, merit:12, money:60,
  scroll:'三月三庙会人山人海，踩丢、挤丢、吓丢的生魂共七缕，混在人流里找不到回来的路。城隍爷把名录往你怀里一塞："三日为限，找不齐，明年庙会你这外包也别想摆摊。"',
  nodes:[
    { type:'event', text:'庙会上灯棚连着戏台，你在人缝里瞧见一缕生魂正被糖画摊子勾得挪不动步。',
      choices:[
        { t:'化作货郎，以糖人引魂', r:{heal:12, log:'生魂捧着糖人咯咯直笑，乖乖跟你回了名录上。'} },
        { t:'张起招魂幡，就地拘拿', r:{hp:-8, log:'幡一招，生魂是来了，看热闹的活人也围了一大圈。'} },
      ]},
    { type:'battle', enemy:'ghost', scale:1.05 },
    { type:'event', text:'还差一缕。戏台底下阴气最重，有游魂冒充生魂想混出城去投胎。',
      choices:[
        { t:'逐个验看名录印信', r:{log:'你拿着名录一一比对，揪出了三个冒名的，真魂还在戏台底下。'} },
        { t:'以城隍印直召生魂', requires:{path:'revelation'}, r:{atkBuff:0.25, log:'天启之光落下，冒牌货当场现形，真魂循光而归。'} },
      ]},
    { type:'battle', enemy:'ligui', scale:0.95 },
  ]
},
{
  id:'m12', god:'chenghuang', danger:3, forced:false,
  name:'淫祠邪祀案', gh:null, merit:16, money:90,
  scroll:'城西夜里冒出一座没有名字的野祠，香火极旺，祈什么应什么——应的全是邪愿。城隍查了半月，只查出祠里塑的像"不是神"。"是何物装神，你去替我看清楚。"',
  nodes:[
    { type:'event', text:'野祠藏在一片新坟地里，求签的队排到了坟圈子外。签筒里的竹签，全是人指骨磨的。',
      choices:[
        { t:'混进队伍摇一签', r:{hp:-8, log:'签文入手冰凉，一支"上上签"顺着掌心吸你的神力，你甩手才挣脱。'} },
        { t:'夜里放火烧祠，逼它现形', r:{atkBuff:0.25, log:'火起时，祠中黑影尖啸着窜出——装不了神了。'} },
      ]},
    { type:'battle', enemy:'ligui' },
    { type:'event', text:'黑影被逼进坟地深处，坟头全朝着同一个方向磕拜——它在借坟养煞。',
      choices:[
        { t:'踏平坟头，断其香火根', r:{shield:0.25, log:'坟头踏平，煞气反噬被你硬生生扛下，周身浮起一层幽光。'} },
        { t:'将计就计，引它攻击再反杀', r:{atkBuff:0.3, log:'你故意露出破绽，黑影扑来的一瞬，你的兵刃已经等在那里。'} },
      ]},
    { type:'battle', enemy:'ligui', scale:1.1 },
  ]
},
/* ================= 长单（多幕跨天） ================= */
{
  id:'L1', god:'yan', danger:4, forced:false, long:true,
  name:'枉死城整肃令', gh:'juhun', merit:40, money:260,
  scroll:'【长单·三幕】生死簿风波未平，枉死城的名册、狱卒、城墙样样有窟窿。阎王爷拍下一枚令印："三个月，本王要枉死城样样清爽。办得好，这里头有你一份前程。"',
  acts:[
    { title:'第一幕·清点',
      nodes:[
        { type:'event', text:'名册房积灰三尺，册子虫蛀的虫蛀、缺页的缺页。鬼差们抱着胳膊看热闹："新来的，往年没人敢接这活。"',
          choices:[
            { t:'照册逐一唱名，缺一记一', r:{log:'唱名声在名册房回荡了一整日，短了四十七个号，你都记在了朱单上。'} },
            { t:'以幽冥律令唤册中残魂自述', requires:{path:'nether'}, r:{atkBuff:0.2, log:'残魂循律令而回，口述与册页互证，进度快了一倍。'} },
            { t:'抓阄抽查，先糊弄交差', r:{hp:-10, log:'抽到的三册恰好全是问题册，鬼差们憋笑憋出了内伤，你也挨了上峰一顿训。'} },
          ]},
        { type:'battle', enemy:'ghost', scale:1.2 },
      ]},
    { title:'第二幕·整狱',
      nodes:[
        { type:'event', text:'名册短了四十七个号，狱里却多押着一个"活人"。夜审开始，班头们个个喊冤，烛火忽明忽暗。',
          choices:[
            { t:'分开审，先撬最慌的那个', r:{log:'最慌的班头竹筒倒豆子：那"活人"是花了大价钱进来的。'} },
            { t:'提审那个"活人"', r:{hp:-10, log:'押房里阴风扑面，那"活人"抬起头——半张脸是人的，半张脸不是。'} },
          ]},
        { type:'battle', enemy:'ligui', scale:1.1 },
      ]},
    { title:'第三幕·封门',
      nodes:[
        { type:'event', text:'真相大白：有人在做阴间的买卖——交够了钱，阳寿未尽也能"提前入住"枉死城避劫。口子就在城西水门。',
          choices:[
            { t:'封死水门，按律重办', r:{atkBuff:0.25, log:'水门落闸，买卖断绝。城外的"客人们"恼羞成怒。'} },
            { t:'留门作饵，钓出幕后主家', r:{hp:-12, log:'你在水门蹲了两夜，阴风浸骨，总算摸清了来路。'} },
          ]},
        { type:'battle', enemy:'guiwang', scale:1.1 },
      ]},
  ]
},
/* ================= 主线章单（chapter 门槛，完成推进章节） ================= */
{
  id:'c1', god:'yan', danger:3, forced:false, main:true, chapter:1,
  name:'两界文书房试炼', gh:null, merit:20, money:120,
  scroll:'【主线·章一】阎王爷丢给你一沓两界往来文书："从今日起，两界交割的文书都过你的手。先试试手——这批里有三份是伪造的，挑出来。"',
  nodes:[
    { type:'event', text:'文书堆得比你还高。地府的朱印端正凝重，天庭的敕印飞扬潦草，各有各的章法。',
      choices:[
        { t:'先比对印泥的成色年份', r:{log:'两份"天庭敕令"用的印泥是今年新调的，可落款却是三年前。'} },
        { t:'以幽冥感应直辨文书气息', requires:{path:'nether'}, r:{atkBuff:0.25, heal:15, log:'死人生前执念、活人诉讼怨气，一摸便知——三份伪作无所遁形。'} },
      ]},
    { type:'battle', enemy:'ghost', scale:1.1 },
    { type:'event', text:'伪作背后是个伪造文书的小团伙，为首者见事败，竟撕了文书想毁证灭迹。',
      choices:[
        { t:'抢下残页，人证物证俱全', r:{money:40, log:'残页拼回原状，阎王批了勘验津贴。'} },
        { t:'当场拘人再说', r:{atkBuff:0.2, log:'人赃并获，干净利落。'} },
      ]},
  ]
},
];
