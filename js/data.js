/* ================= 天道打工人 · 数据层 v3 =================
   五系：bing兵 / fa法 / you幽 / huo火 / sheng生
   tier：E灵吏 D正神 C神官 B天君 A帝君 S天尊
   神格品质：凡 / 灵 / 宝 / 仙；神格 53 枚常规 + 14 枚融合产物
   权威设定源：lore/01 神仙谱、02 精怪妖魔谱、03 官阶典制、04 神格图鉴
   ============================================================ */
const PATHS={bing:{name:'兵',color:'#c0392b',desc:'爆发单体震骇'},fa:{name:'法',color:'#2e6f9e',desc:'雷法控制群攻'},you:{name:'幽',color:'#6b3fa0',desc:'真伤拘魂削弱'},huo:{name:'火',color:'#d2691e',desc:'灼烧连击调和'},sheng:{name:'生',color:'#3a8f5a',desc:'治疗护盾超度'}};
const FAVOR_LEVELS=[{v:0,name:'相识'},{v:20,name:'相熟'},{v:50,name:'信重'},{v:90,name:'莫逆'},{v:140,name:'生死之交'}];
const AID_POWER=[0,0.45,0.65,0.85,1.10];
/* 呼神次数按好感档：相熟1/信重2/莫逆2/生死之交3（支援从「每场一次」改为战术资源） */
const AID_CHARGES=[0,1,2,2,3];
/* 全谱总量：首批实装 47 位 + 储备名录 48 位/组（lore/01 第八节）＝ 95；后续实装只加 GODS 不改此值逻辑 */
const GODS_TOTAL=95;
const GODS={
tudi_gong:{name:'土地公',title:'福德正神',icon:'土',tier:'E',camp:'民间',path:'sheng',unlock:null,gh:null,
intro:'管一乡一里之小事：田土收成、鸡鸭走失、乡邻口舌，兼给孤魂指路，乃破神衙本境之主、首位工单发放人，空心化早期受害者却浑然不觉。',
quote:'远客来，好。喝茶，好。',
  sources:'《礼记·郊特牲》社祀；《搜神记》；闽台《福德正神金卷》宝卷',
  story:'最早的土地神是古代的「社」，《礼记》里说「社稷」就是土谷之神。民间给他塑个矮胖老头像，旁边总蹲着一只小狗——传说土地公被妖精欺侮时，是村头黄狗救了他一命，从此他走到哪儿都带只狗。',
img:'Chinese ink wash painting of a kind old earth god with white beard holding a gnarled wooden staff, warm smile, sumi-e style with ochre and moss green accents, rice paper texture, portrait',
aid:{name:'社土为盾',type:'shield',shield:0.32,desc:'相熟薄土盾，信重全队护盾回血，莫逆地脉真伤，本体全场缠绕控制并回血。'},
gifts:{loved:['wugu'],liked:['hulu'],disliked:['panta']}},
zao_jun:{name:'灶君',title:'东厨司命',icon:'灶',tier:'E',camp:'天庭',path:'huo',unlock:null,gh:null,
intro:'守一家灶火，录一家善恶，腊月廿四上天密奏一家所行，岁首回銮赐福，是天庭安在人家里的一双眼睛，被迫密报两头赔笑。',
quote:'糖瓜粘嘴，本君上天，只拣甜的说。',
  sources:'《礼记·月令》；《淮南子·泛论训》；《庄子·达生》；唐《酉阳杂俎》；《抱朴子·微旨》',
  story:'腊月廿四糖瓜粘——这天灶君上天汇报一家善恶。人们给他嘴里抹糖瓜，让他「上天言好事，下界保平安」。有人说灶君本名张单，因为休了贤妻被天帝罚守灶火，永世不得抬头看天。',
img:'Chinese ink wash painting of the kitchen god in red robes beside a stove holding a sugar melon, gentle anxious expression, sumi-e style with vermilion and amber accents, rice paper texture, portrait',
aid:{name:'灶火一星',type:'burn',mult:1.2,burnPct:0.5,burnRounds:3,desc:'相熟单体灼烧，信重持续回血，莫逆群灼混乱，本体全灼驱散增益并回血。'},
gifts:{loved:['wugu'],liked:['xiangzhu'],disliked:['hulu']}},
men_shen:{name:'门神',title:'秦琼敬德',icon:'门',tier:'E',camp:'天庭',path:'bing',unlock:null,gh:null,
intro:'守门庭、拒邪祟、防夜鬼，兼管一切不该进门的东西，秦琼金锏、尉迟钢鞭一岗双人，站成两幅画永镇门庭，空心化开始认错门。',
  sources:'《山海经》（神荼郁垒）；《西游记》第十回；《三教源流搜神大全》',
  story:'最早的门神是神荼、郁垒哥俩，《山海经》说他们专捉恶鬼喂老虎。到了唐朝，李世民梦见秦琼和尉迟恭为他守门吓退鬼魂，次日就把二人画像贴在门上——从此武将门神取代了鬼差门神。',
img:'Chinese ink wash painting of two Tang dynasty door generals Qin Qiong and Yuchi Gong in armor holding golden mace and steel whip, fierce and loyal, sumi-e style, portrait pair',
aid:{name:'门闩落下',type:'shield',shield:0.32,desc:'相熟门闩护盾，信重全队盾加震骇，莫逆破防重击，本体群控2回合加大盾。'},
gifts:{loved:['taomu'],liked:['xiangzhu'],disliked:['panta']}},
jing_shen:{name:'井神',title:'井泉童子',icon:'井',tier:'E',camp:'民间',path:'sheng',unlock:null,gh:null,
intro:'守一井泉脉，司水味甘苦、淘井封井，不许脏东西进井，总角小童坐井栏泡脚丫，识得每一道水纹，神格小得连削藩工单都没法切。',
  sources:'《礼记·月令》五祀；《白虎通义》；《酉阳杂俎》；明清民俗宝卷',
  story:'井神是小孩模样，因为井在古代是全村的命根子。淘井要先祭井神，不然他会把水收走。有传说讲井神爱上人间姑娘，每晚偷偷溜出井去会她，被土地公抓住罚他永远坐在井栏上。',
img:'Chinese ink wash painting of a well spirit child with twin buns and red belly-dress sitting on a well rim splashing feet in clear water, innocent, sumi-e style with blue-green accents, portrait',
aid:{name:'井花水',type:'heal',heal:0.33,desc:'相熟小额治疗，信重净化回血，莫逆减速冻结，本体大疗净化并复活低血队友。'},
gifts:{loved:['panta'],liked:['wugu'],disliked:['xiangzhu']}},
cheng_huang:{name:'城隍爷',title:'一城之主',icon:'隍',tier:'D',camp:'地府',path:'you',unlock:{ch:1},gh:'y_chenghuang',
intro:'守一座城的幽明两界：守城垣、护亡灵、录一城善恶，阴阳两审，阳间知县理阳、城隍爷理阴，面冷心热的顶头上司，亏空大户。',
quote:'本庙香火簿亏着，阴曹的规矩，可不亏。',
  sources:'《礼记·郊特牲》（水庸）；《北齐书·慕容俨传》；《续文献通考》（明初封爵）；明《太上感应篇》',
  story:'城隍爷原型是「水庸」——古代祭水的沟渠神。朱元璋建明朝时下旨每城必建城隍庙，封城隍爷为正一品，和知府平起平坐。从此他既是阴司法官又是一城之主，阳间知县断案也要请他托梦。',
img:'Chinese ink wash painting of a dignified city god magistrate in dark formal robes holding a jade tablet, stern but fair, sumi-e style with deep indigo and cinnabar accents, portrait',
aid:{name:'城隍牒',type:'percent',pct:0.28,desc:'相熟单体真伤，信重护盾破隐，莫逆群真伤，本体鬼类封押2回合并全体易伤。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['panta']}},
bai_wuchang:{name:'白无常',title:'一见生财',icon:'白',tier:'D',camp:'地府',path:'you',unlock:{ch:1},gh:'y_wuchang',
intro:'勾魂引路、催牌提人，见人先笑，专走善魂与阳寿已尽者，笑面迎客的老公差，牌票名字一个不能改，收了好处也只敢对胆小鬼网开半面。',
  sources:'《集说诠真》《道书》；《北平风俗类征》；民间通行成说',
  story:'白无常谢必安、黑无常范无救本是民间义气弟兄。谢必安赴约等范无救，结果范无救醉酒没去，谢必安在桥下被洪水淹死——吊死时吐着长舌头，就是白无常的模样。阎王怜他们义气收为鬼差。',
img:'Chinese ink wash painting of white impermanence spirit tall and thin in white robe with tall hat and long tongue holding a fan, smiling eerily, sumi-e style, portrait',
aid:{name:'一见生财',type:'vuln',mult:1.6,vuln:0.5,rounds:2,desc:'相熟易伤2回合，信重定身拉前，莫逆持续真伤吸血，本体大真伤处决并驱散增益。'},
gifts:{loved:['hulu'],liked:['panta'],disliked:['taomu']}},
hei_wuchang:{name:'黑无常',title:'正在捉你',icon:'黑',tier:'D',camp:'地府',path:'you',unlock:{ch:1},gh:'y_wuchang',
intro:'缉拿恶魂厉鬼、追逃销案，铁锁一出恶者无救，黑脸短躯寡言冷面，却记着谢必安欠的那条命，只认牌票不认签发人。',
  sources:'《集说诠真》及民间通行成说（与白无常同案）',
  story:'范无救醒来得知谢必安死了，悲痛之下一头撞死。阎王让他做黑无常，专管捉拿凶魂恶鬼。他脸黑是因为死前撞墙满脸是血，后来慢慢变成铁青。民间说黑无常最讲规矩，从不抓错人。',
img:'Chinese ink wash painting of black impermanence spirit short and sturdy in black robe with iron chains, fierce face, sumi-e style with dark ink and iron grey accents, portrait',
aid:{name:'锁影',type:'control',mult:1.3,ctrlRounds:1,desc:'相熟定身1回合，信重震骇加真伤，莫逆持续真伤降攻，本体核弹真伤对鬼处决。'},
gifts:{loved:['taomu'],liked:['wugu'],disliked:['panta']}},
niu_tou:{name:'牛头',title:'阿傍狱卒',icon:'牛',tier:'D',camp:'地府',path:'bing',unlock:{ch:1},gh:'b_niutou',
intro:'十八层地狱的狱卒头领，持叉驱囚、守狱门、押重犯，牛头人手脚牛蹄力壮排山，规矩比叉还重，认理不认人的憨直大力士。',
  sources:'《铁城泥犁经》；《楞严经》；《五苦章句经》',
  story:'牛头原名「阿傍」，本是牧羊人。有一次把老羊杀了吃，被天帝罚变牛头人身到地府当差。他手持钢叉，力大无穷，负责把阳间枉死的人拖回地府。牛头最认死理，阎王说东绝不往西。',
img:'Chinese ink wash painting of ox-headed prison guard Niutou with ox horns and hooves holding a steel trident, brute and honest, sumi-e style with dark brown ink, portrait',
aid:{name:'钢叉挑',type:'nuke',mult:2.2,desc:'相熟重击破防，信重震骇1回合，莫逆大伤破防，本体群伤击退并概率眩晕。'},
gifts:{loved:['wugu'],liked:['hulu'],disliked:['mozhen']}},
ma_mian:{name:'马面',title:'马头罗刹',icon:'马',tier:'D',camp:'地府',path:'bing',unlock:{ch:1},gh:'b_mamian',
intro:'阴司的快腿与锁拿手，山川城郭追逃魂，马头人身长臂如猿，是牛头阿傍最老的搭档，急性子毒舌嘴硬心软，把办成二字看得比天大。',
  sources:'《楞严经》；《铁城泥犁经》（马头罗刹）；民间成说',
  story:'马面和牛头是搭档，但腿特别长跑得飞快。传说有次恶鬼逃到人间，马面追了三天三夜在峨眉山脚下追上，一鞭子抽得鬼魂魂飞魄散。从此马面成了地府的「快递小哥」。',
img:'Chinese ink wash painting of horse-faced spirit Mamian with long arms holding a chain, swift and sharp-tongued, sumi-e style with slate grey accents, portrait',
aid:{name:'锁链抽',type:'nuke',mult:2.3,desc:'相熟伤害流血，信重连击加速，莫逆贯穿群伤，本体锁定必中破防核弹。'},
gifts:{loved:['wugu'],liked:['hulu'],disliked:['xiangzhu']}},
meng_po:{name:'孟婆',title:'驱忘台主',icon:'孟',tier:'D',camp:'地府',path:'you',unlock:{ch:2},gh:'y_mengpo',
intro:'守驱忘台熬迷魂汤，令投胎之魂尽忘前尘，慈祥通透装糊涂大师，汤碗底下的账比生死簿还全，地府最知情却从来不说的神。',
quote:'喝吧喝吧，忘了好；记着的那些，老身替你们记着呢。',
  sources:'清《历代神仙通鉴》；《玉历宝钞》；民间成说',
  story:'孟婆本是孟姜女，丈夫范喜良被秦始皇征去修长城累死。孟姜女哭倒长城八百里，天帝感其痴情，让她在地府奈何桥头熬汤——喝了就忘前世。孟婆汤里有忘忧草、绝情丹和三千年的眼泪。',
img:'Chinese ink wash painting of old Lady Meng beside a soup cart on the forgetfulness terrace, kind eyes and slow smile, sumi-e style with muted grey and tea tones, portrait',
aid:{name:'忘尘一呷',type:'dispel',desc:'相熟驱散增益，信重回血混乱，莫逆群混乱，本体清增益群混乱并治疗解负。'},
gifts:{loved:['wugu'],liked:['xiangzhu'],disliked:['puti']},set:'mengpo'},
ri_youshen:{name:'日游神',title:'昼巡之神',icon:'日',tier:'D',camp:'地府',path:'you',unlock:{ch:2},gh:'y_riyou',
intro:'昼行阳间巡行监察，记人小过，牌票日报察查司，绛衣皂带腰牌悬胸，鸡零狗碎皆录在册，只忠于记录本身的体制末梢。',
  sources:'《月令广义》；《集说诠真》；《西游记》（游弈灵官）',
  story:'日游神是天庭派来的「阳光道」——白天在人间巡查，专记哪家行善哪家作恶。他的报告直接送南天门，是天庭考核各地官员的依据。和夜游神是搭档，白天黑夜轮流值班。',
img:'Chinese ink wash painting of the day-roving deity in crimson robe with waist badge writing in a notebook, rigid and diligent, sumi-e style with vermilion accents, portrait',
aid:{name:'昼巡牌',type:'vuln',mult:1.7,vuln:0.5,rounds:2,desc:'相熟易伤2回合，信重真伤加标记，莫逆破隐震骇，本体群易伤加群真伤。'},
gifts:{loved:['taomu'],liked:['xiangzhu'],disliked:['hulu']}},
ye_youshen:{name:'夜游神',title:'夜巡之神',icon:'夜',tier:'D',camp:'地府',path:'you',unlock:{ch:2},gh:'y_yeyou',
intro:'夜巡禁地与破庙野坟，专听不敢见太阳的账，玄冠玄服行于月黑，把夜里看见的一切留着不上交，暗线最重要的沉默证人。',
  sources:'《山海经·海外南经》；《淮南子》；《封神演义》',
  story:'夜游神专管黑夜，是日游神的另一面。只在子时到丑时现身，穿黑袍，手里举着绿灯。传说有人半夜撞见他，问是谁，他只答：「我知道你干了什么。」',
img:'Chinese ink wash painting of the night-roving deity in dark robes under moonlight holding a lantern, silent and watchful, sumi-e style with deep indigo and moon white accents, portrait',
aid:{name:'夜窥',type:'debuff',atk:-0.2,def:-0.2,rounds:2,desc:'相熟降攻2回合，信重恐惧加真伤，莫逆群真伤，本体群沉默震骇并全队隐身。'},
gifts:{loved:['xiangzhu'],liked:['hulu'],disliked:['panta']}},
cui_jue:{name:'崔珏',title:'阴律判官',icon:'判',tier:'C',camp:'地府',path:'you',unlock:{ch:2},gh:'y_cuijue',
intro:'掌阴律司与天下生死簿，朱笔一勾寿夭增减，端方深沉喜怒不形于色，冒风险举荐玩家的关键人物，曾为太宗私添寿二十年。',
quote:'簿上添一笔的事——你没见过本判，本判，也没见过你。',
  sources:'《西游记》第十、十一回；《崔府君祠录》；南宋「泥马渡康王」传说',
  story:'崔珏是阴律司崔判官，唐太宗时的大臣，死后因铁面无私被阎王重用。《西游记》里唐太宗游地府，崔珏偷偷把他阳寿从十三年改三十三年——就是这位。他是帮玩家出头的关键人物。',
img:'Chinese ink wash painting of judge Cui Jue in dark official robes holding a vermilion brush and the book of life and death, dignified and inscrutable, sumi-e style, portrait',
aid:{name:'簿上一点',type:'percent',pct:0.30,desc:'相熟单体真伤，信重大疗免死，莫逆大真伤加易伤，本体累计真伤并复活一人。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['panta']},set:'cui_jue'},
wei_zheng:{name:'魏征',title:'赏善判官',icon:'魏',tier:'C',camp:'地府',path:'you',unlock:{ch:3},gh:'y_weizheng',
intro:'掌赏善司核查生前行善之魂定人天福报，方正冷峻不苟言笑，人曹官梦斩泾河老龙的凌烟名臣，认法不认人也认证据。',
  sources:'《旧唐书·魏征传》；《贞观政要》；《西游记》第九、十回',
  story:'魏征是赏善司判官，和崔珏是同朝旧识。活着时就是李世民的谏臣，敢当面骂皇帝。做了判官更不认人——哪怕是天庭下来的神犯了错，他一样按律发落。体制内「规则派」代表。',
img:'Chinese ink wash painting of Wei Zheng as underworld reward-goodness judge in scholar robes holding a memorial tablet, stern and upright, sumi-e style with ink black accents, portrait',
aid:{name:'赏善录',type:'heal',heal:0.32,desc:'相熟治疗加护，信重真伤破盾，莫逆龙妖巨伤，本体破伪群易伤并反伤盾。'},
gifts:{loved:['mozhen'],liked:['puti'],disliked:['hulu']},set:'wei_zheng'},
zhong_kui:{name:'钟馗',title:'罚恶判官',icon:'钟',tier:'C',camp:'地府',path:'you',unlock:{ch:2},gh:'y_zhongkui',
intro:'掌罚恶司擒天下邪祟虚耗，专吃恶鬼与恶吏，刚烈粗犷嫉恶如仇的终南山进士，恨恶吏如仇，十个恶里九个穿着官衣。',
  sources:'北宋《梦溪笔谈》（唐明皇梦）；《唐逸史》；《钟馗斩鬼传》《钟馗全传》',
  story:'钟馗本是穷秀才，才华横溢却奇丑无比。考状元时皇帝因他丑不录取，钟馗一怒撞柱而死。天帝封他罚恶司判官专捉鬼。他有个习惯——每天画自己的像送街坊：「贴在门上鬼就不敢进」。',
img:'Chinese ink wash painting of Zhong Kui demon-queller with fierce ugly face in blue robe holding a sword, bold and boisterous, sumi-e style with strong ink strokes, portrait',
aid:{name:'啖鬼一口',type:'percent',pct:0.30,desc:'相熟真伤吸血，信重群震骇，莫逆大真伤灼烧斩杀，本体群真伤对鬼处决。'},
gifts:{loved:['hulu'],liked:['taomu'],disliked:['panta']},set:'zhongkui'},
lu_zhidao:{name:'陆之道',title:'察查判官',icon:'陆',tier:'C',camp:'地府',path:'you',unlock:{ch:3},gh:'y_lupan',
intro:'掌察查司核查案情真伪卷宗虚实，阴间法医兼御史，貌狞心热痴气学术狂，剖开看假的真不了，验状能上阎罗殿只替证据说话。',
  sources:'清·蒲松龄《聊斋志异·陆判》',
  story:'陆之道是察查司判官，专查冤案错案。传说他有本「善恶簿」，记着每个人前世今生所有善恶。有人说他就是《聊斋志异》里帮朱尔旦换心的「陆判」。只认案情不认天条。',
img:'Chinese ink wash painting of Lu Pan the inspector judge with green face and red beard holding an autopsy knife, coldly scholarly, sumi-e style with dark green and cinnabar, portrait',
aid:{name:'勘验',type:'vuln',mult:1.8,vuln:0.5,rounds:2,desc:'相熟真伤加易伤，信重暴击回能增益，莫逆明牌加群破防，本体已损血比例核弹。'},
gifts:{loved:['mozhen'],liked:['hulu'],disliked:['puti']},set:'lu_zhidao'},
bi_gan:{name:'比干',title:'文财神',icon:'干',tier:'C',camp:'民间',path:'sheng',unlock:{ch:3},gh:'s_bigan',
intro:'文财神之一，无心故无私，主公正之财与科甲文衡，商少师强谏三日被纣剖七窍玲珑心，清癯温和，最懂被挖空的滋味。',
quote:'人无心，便无偏私；这秤上的财，才配叫公道。',
  sources:'《史记·殷本纪》《宋微子世家》；《封神演义》第二十六、二十七回、九十九回',
  story:'比干是商朝王叔，劝纣王不要宠妲己被挖心。他走出宫门碰见卖空心菜的老妇人，问「人无心能活吗」，老妇人说「菜无心能活，人为何不能」——比干顿悟倒地，被封文财神。游戏里他最懂「空心」滋味。',
img:'Chinese ink wash painting of Bi Gan the civil wealth god with hollow chest in court robes, serene and sorrowful, sumi-e style with jade green and gold accents, portrait',
aid:{name:'无心秤',type:'shield',shield:0.35,desc:'相熟公正护盾，信重命中暴击增益，莫逆持续回血，本体清增益转全队大护盾反弹。'},
gifts:{loved:['mozhen'],liked:['puti'],disliked:['hulu']},set:'bi_gan'},
sun_simiao:{name:'孙思邈',title:'药王爷',icon:'药',tier:'C',camp:'民间',path:'sheng',unlock:{ch:2},gh:'s_yaowang',
intro:'药王爷主医药疗疾走方施诊，兼治神的空心之症，著千金方的仁厚医者，唯一敢给神看病的人，诊出空心化不可逆。',
quote:'人间的病要治；神仙的病，也总得有人敢号这个脉。',
  sources:'《旧唐书·方伎传》；《新唐书》；《千金要方》《千金翼方》；《酉阳杂俎》医龙医虎传说',
  story:'药王孙思邈活了一百四十二岁，写了《千金方》。传说隐居时曾给老虎治伤——老虎叼金钗谢他，后来出门总带这只钗。民间药王庙会的主神，医者祖师爷。',
img:'Chinese ink wash painting of Sun Simiao the medicine king with white beard holding a gourd and tiger-ring, kindly and composed, sumi-e style with sage green accents, portrait',
aid:{name:'千金方',type:'heal',heal:0.38,desc:'相熟中等治疗，信重净化回血，莫逆濒死复活，本体大疗全净化持续回血。'},
gifts:{loved:['puti'],liked:['wugu'],disliked:['xiangzhu']},set:'sun_simiao'},
lu_ban:{name:'鲁班',title:'巧圣先师',icon:'班',tier:'C',camp:'民间',path:'bing',unlock:{ch:3},gh:'b_luban',
intro:'工匠祖师主营造机巧绳墨尺寸，护天下手艺人，公输般削竹木为鹊三日不下，认尺寸不认神佛，一眼看出神瓤不吃劲了。',
  sources:'《孟子·离娄》；《墨子·公输》《鲁问》；《礼记·檀弓》；《事物绀珠》',
  story:'鲁班本名公输班，春秋鲁国人。造过攻城云梯、木鸢飞车，被墨子怼过。民间说他发明了锯（被草割手灵感来的）、刨子、墨斗、榫卯。他有本《鲁班书》分上下卷，上卷盖房子，下卷「整人」——学下卷要绝后。',
img:'Chinese ink wash painting of Lu Ban the master carpenter holding a ink marker and try square, focused artisan, sumi-e style with wood brown ink, portrait',
aid:{name:'墨斗放线',type:'vuln',mult:1.9,vuln:0.5,rounds:2,desc:'相熟易伤2回合，信重大伤破甲，莫逆机关群伤，本体破防核弹眩晕并全队减伤。'},
gifts:{loved:['taomu'],liked:['mozhen'],disliked:['panta']},set:'lu_ban'},
lv_dongbin:{name:'吕洞宾',title:'纯阳帝君',icon:'吕',tier:'C',camp:'天庭',path:'bing',unlock:{ch:3},gh:'b_lvchunyang',
intro:'全真北五祖之一，酒仙剑胆度人无数的游方散仙，黄粱一梦大悟，编外散仙烦工单，江淮斩蛟岳阳弄鹤，只度人不度天。',
quote:'天庭的工单催不进酒壶里——来，先干了这碗再说。',
  sources:'《续仙传》；《钟吕传道集》；元《纯阳帝君神化妙通纪》；《岳阳风土记》',
  story:'吕洞宾是八仙之一，有「狗咬吕洞宾」的故事。传说他有个朋友叫苟杳，被人欺负吕洞宾帮他出头。后来苟杳发达了，吕洞宾装穷去试探，苟杳不收留，吕洞宾叹「苟杳狗咬吕洞宾」——后来传成「狗咬吕洞宾」。',
img:'Chinese ink wash painting of Lyu Dongbin the immortal swordsman with wine gourd and sword, free-spirited and witty, sumi-e style with flowing brush lines, portrait',
aid:{name:'天遁剑诀',type:'nuke',mult:2.5,desc:'相熟两连击，信重沉睡控制加伤害，莫逆大伤灼烧，本体多段核弹灼烧震骇。'},
gifts:{loved:['hulu'],liked:['taomu'],disliked:['xiangzhu']},set:'lv_dongbin'},
he_xiangu:{name:'何仙姑',title:'荷仙姑',icon:'荷',tier:'C',camp:'民间',path:'sheng',unlock:{ch:3},gh:'s_hexiang',
intro:'八仙中唯一女仙，持荷行世，主清净疗愈与女子采桑织之愿，清净温软偶带机锋，以竹罩投水渡海，荷花池近年被天庭征水。',
  sources:'宋《集仙传》（已佚，见《续通考》转引）；《太平广记》引《广异记》；明《东游记》',
  story:'何仙姑是八仙里唯一的女性。传说本是湖南零陵姑娘，十三岁在溪边碰见道士给她桃吃，吃了就成仙。常提装有蟠桃的花篮在人间行善，专治难产和妇女病。民间有「何仙姑送子」的说法。',
img:'Chinese ink wash painting of He Xiangu the lotus immortal holding a lotus petal, pure and gentle, sumi-e style with pink lotus and ink wash, portrait',
aid:{name:'荷露',type:'heal',heal:0.35,desc:'相熟治疗，信重净化持续回血，莫逆全队盾加闪避，本体大疗大盾反弹护罩。'},
gifts:{loved:['puti'],liked:['panta'],disliked:['hulu']},set:'he_xiangu'},
dian_mu:{name:'电母',title:'秀天君',icon:'电',tier:'C',camp:'天庭',path:'fa',unlock:{ch:3},gh:'f_dianmu',
intro:'雷部掌电之神，双镜放光为雷公雷祖司掌前引，端方利落精确到刻板，镜不留情也不撒谎，照见一座座被切空的庙。',
quote:'先照，后劈——这是规矩。镜中照见什么，本君不替谁遮掩。',
  sources:'《元史·舆服志》（电母旗）；《道法会元》；《西游记》第四十五回',
  story:'电母是雷公老婆，负责打闪电。传说本是瞎子的女儿，雷公打雷时不小心劈了她爹，后来上天做电母专门提醒——「先闪电再打雷，免得劈错好人」。所以现在都是先闪电后打雷。',
img:'Chinese ink wash painting of the Lightning Goddess holding two mirrors radiating light, poised and precise, sumi-e style with electric blue and silver accents, portrait',
aid:{name:'镜光一闪',type:'vuln',mult:1.8,vuln:0.5,rounds:2,desc:'相熟雷伤加易伤，信重震骇打断加雷伤，莫逆群雷伤眩晕，本体群雷核弹眩晕灼烧。'},
gifts:{loved:['xiangzhu'],liked:['panta'],disliked:['hulu']},set:'dian_mu'},
zhao_gongming:{name:'赵公明',title:'武财神',icon:'赵',tier:'B',camp:'天庭',path:'bing',unlock:{ch:3},gh:'b_zhaogong',
intro:'武财神玄坛元帅，率招宝纳珍招财利市四神主公平之财与驱雷驭役，旧瘟神出身，最懂被天庭定义再被香火改写的价码。',
quote:'钱财的事好说——本帅早年管的，可是要命的买卖。',
  sources:'晋·干宝《搜神记》；《太上洞渊神咒经》；《真诰》；《封神演义》第四十七、五十一、九十九回',
  story:'赵公明本是瘟神，后来被道教收编变成武财神。他手拿黑鞭，骑黑虎。有四个手下：招宝、纳珍、招财、利市——合起来叫「五路财神」。过年贴的财神画，武财神是他，文财神是比干。',
img:'Chinese ink wash painting of Zhao Gongming the military wealth god on a black tiger with iron whip, opulent and shrewd, sumi-e style with gold and black accents, portrait',
aid:{name:'铁鞭扫',type:'nuke',mult:2.6,desc:'相熟重击破甲，信重流血连击，莫逆群伤群易伤，本体核弹缴械并战后掉宝提升。'},
gifts:{loved:['puti'],liked:['panta'],disliked:['taomu']},set:'zhao_gongming'},
wen_chang:{name:'文昌帝君',title:'文昌帝君',icon:'昌',tier:'B',camp:'天庭',path:'fa',unlock:{ch:3},gh:'f_wenchang',
intro:'掌天下文运功名禄籍桂籍榜册，读书人的头顶上司，梓潼神与文昌六星合流，骑白特侍天聋地哑，天庭亲信掌禄籍。',
quote:'禄籍榜册都在本君案头；只是身边这两位，一个听不见，一个说不出。',
  sources:'《华阳国志》；《北梦琐言》；《明史·礼志》；《文昌帝君阴骘文》',
  story:'文昌帝君本是文昌星，后来人格化成张亚子。传说东晋时四川人，战死沙场后被封为文昌帝君，专管科举。旁边总跟着「天聋」「地哑」两个童子——天机不可泄露，所以一个聋一个哑。',
img:'Chinese ink wash painting of Wenchang the literature god riding a white mule with brush and scroll, elegant and scholarly, sumi-e style with indigo and gold, portrait',
aid:{name:'朱笔点斗',type:'vuln',mult:1.9,vuln:0.5,rounds:2,desc:'相熟易伤加命中，信重群沉默，莫逆全队暴击回能，本体群易伤并禁用援助法术。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['hulu']},set:'wen_chang'},
ma_zu:{name:'妈祖',title:'天上圣母',icon:'妈',tier:'B',camp:'民间',path:'sheng',unlock:{ch:3},gh:'s_mazu',
intro:'海神主海上救难护航济溺，闽海舟船与漕运的命，林默娘乘席渡海专济海难，民命海难为上，削藩动她先动民心。',
quote:'海上风再大，灯亮着，人，便要回来。',
  sources:'《敕封天后志》；《圣墩祖庙重建顺济庙记》（宋·廖鹏飞）；《元史·祭祀志》；历朝封诰',
  story:'妈祖本名林默娘，福建莆田人。她能「神游」海上预知风暴。有次听说父亲出海遇风暴，神游去救，可惜救不了父亲自己也去了。死后湄洲岛建庙祭祀，从宋朝一路封到「天妃」「天后」「天上圣母」。',
img:'Chinese ink wash painting of Mazu the sea goddess in flowing robes by a lantern tower over stormy waves, compassionate and calm, sumi-e style with sea blue accents, portrait',
aid:{name:'神灯引',type:'heal',heal:0.40,desc:'相熟治疗夜间加成，信重全队护盾减伤，莫逆群显形易伤，本体大盾免死持续回血。'},
gifts:{loved:['wugu'],liked:['xiangzhu'],disliked:['panta']},set:'ma_zu'},
guan_yu:{name:'关羽',title:'关圣帝君',icon:'关',tier:'B',camp:'民间',path:'bing',unlock:{ch:3},gh:'b_wusheng',
intro:'武圣主忠义伏魔武运与江湖商贾信义，三教共尊，傲上而不忍下，青龙偃月水淹七军威震华夏，头枕洛阳身卧当阳唯义是从。',
  sources:'《三国志·蜀书·关羽传》；《佛祖统纪》（智者大师玉泉显圣）；《三国演义》；历朝封号',
  story:'关羽三国名将，死后被佛教、道教、民间同时供奉。佛教尊他伽蓝菩萨，道教尊关圣帝君，民间尊武圣。核心精神是「义」——千里走单骑护嫂嫂、华容道义释曹操。黑白两道都拜他。',
img:'Chinese ink wash painting of Guan Yu the martial saint with red face and long beard holding the Green Dragon Crescent Blade, proud and righteous, sumi-e style with cinnabar accents, portrait',
aid:{name:'偃月一刀',type:'nuke',mult:2.7,desc:'相熟强攻重击，信重暴击增益，莫逆群伤减速，本体核弹群震骇并处决低血。'},
gifts:{loved:['hulu'],liked:['mozhen'],disliked:['panta']},set:'guanyu'},
wang_lingguan:{name:'王灵官',title:'三五火车',icon:'灵',tier:'B',camp:'天庭',path:'fa',unlock:{ch:3},gh:'f_lingguan',
intro:'道教五百灵官之首，镇天下名山山门第一进，主纠劾天上地下一切邪伪，刚正暴烈疾恶如仇，天庭纪律化身，相爷一切绕开他。',
quote:'本王这三只眼里，神仙和妖邪，走的是同一道闸。',
  sources:'明《三教搜神大全》；《列仙全传》（萨守坚、王善）；《西游记》第七回；《明史·礼志》',
  story:'王灵官本名王恶，北宋长沙人。死后被道教收编成天庭「纠察御史」——专管众神有没有犯错。手拿金鞭脚踏风火轮，额头有第三只眼。送他「桃木如意」他会很高兴——他最讨厌邪祟。',
img:'Chinese ink wash painting of Marshal Wang Lingguan with red face and third eye holding a golden whip, fierce and just, sumi-e style with fire red and gold, portrait',
aid:{name:'金鞭一指',type:'nuke',mult:2.6,desc:'相熟雷伤打断，信重群灼冲锋震骇，莫逆群打断加反伤盾，本体群雷核弹定身反伤。'},
gifts:{loved:['taomu'],liked:['xiangzhu'],disliked:['hulu']},set:'wang_lingguan'},
zeng_zhang:{name:'增长天王',title:'增长天王',icon:'增',tier:'B',camp:'释门',path:'fa',unlock:{ch:3},gh:'f_tianwang',
intro:'四大天王之一护南赡部洲令善根增长掌风，魔礼青执青云剑剑锋无鞘，令行禁止的天庭受调护法，忠于合同与排班。',
  sources:'《长阿含经》《金光明经》；《陀罗尼集经》；《封神演义》第四十、九十九回',
  story:'增长天王是四大天王之一，佛教护法神也被道教收编。名字叫「毗楼勒叉」，汉译「增长」——令众生增长善根。手拿宝剑守护南方。四大天王寓意「风调雨顺」，持剑增长代表「风」。',
img:'Chinese ink wash painting of the Growth Heavenly King Virudhaka with blue body holding a sword, majestic and martial, sumi-e style with azure and gold armor, portrait',
aid:{name:'青云剑·风',type:'vuln',mult:1.8,vuln:0.5,rounds:2,desc:'相熟群伤加易伤，信重全队攻防增益，莫逆群灼风刃，本体风火群核弹击退震骇。'},
gifts:{loved:['taomu'],liked:['xiangzhu'],disliked:['hulu']},set:'zeng_zhang'},
duo_wen:{name:'多闻天王',title:'多闻天王',icon:'闻',tier:'B',camp:'释门',path:'fa',unlock:{ch:3},gh:'f_tianwang',
intro:'四大天王之一护北俱芦洲以福德名闻四方，掌雨伞财施，魔礼红持混元珠伞，四天王里最懂代价的护法，管过边塞见过弃子。',
  sources:'《长阿含经》《毗沙门天王经》；《大唐西域记》（于阗护国）；《封神演义》',
  story:'多闻天王是四大天王之首，佛教叫「毗沙门」。手拿伞（或幢幡），怀里抱着「吐宝鼠」能吐金银。本是印度神，传到中国成财神之一，又演变成托塔李天王。',
img:'Chinese ink wash painting of the Vaishravana Heavenly King with green body holding a precious umbrella and jewel-spitting mongoose, composed and worldly, sumi-e style, portrait',
aid:{name:'伞盖轻旋',type:'shield',shield:0.38,desc:'相熟全队小盾，信重驱散增益缴械，莫逆群伤致盲，本体群控2回合并吸增益转大盾。'},
gifts:{loved:['puti'],liked:['mozhen'],disliked:['hulu']},set:'duo_wen'},
qin_guang:{name:'秦广王',title:'一殿秦广',icon:'秦',tier:'B',camp:'地府',path:'you',unlock:{ch:3},gh:'y_qinguang',
intro:'十殿第一殿接引亡魂初判善恶，善人超升恶者照孽镜后分发诸狱，精明客气程式化疲劳的幽冥前台，批送十殿的笔很快。',
quote:'初到是吧？善恶单在那边填，笔自取——莫急，都得排。',
  sources:'《玉历宝钞》（清传本）；《集说诠真》；《阎王经》系统',
img:'Chinese ink wash painting of King Qin Guang first hall of the underworld holding a brush and ledger, shrewd and tired, sumi-e style with dark robes, portrait',
aid:{name:'销牒朱笔',type:'percent',pct:0.32,desc:'相熟单体真伤，信重显形加易伤，莫逆群定身，本体群显形群易伤加大真伤。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['panta']},set:'qin_guang'},
yan_luo:{name:'阎罗王',title:'五殿阎罗',icon:'阎',tier:'B',camp:'地府',path:'you',unlock:{ch:3},gh:'y_yanluo',
intro:'五殿阎罗王掌叫唤大地狱与十六诛心小狱审喊冤之鬼，因哀怜屈死屡放亡魂还阳被降调，玩家顶头上司，自身难保。',
quote:'喊冤的先领号——本王自己，也还在队里排着呢。',
  sources:'《洛阳伽蓝记》；《隋书·韩擒虎传》；《玉历宝钞》；元杂剧、《三侠五义》（包拯）',
img:'Chinese ink wash painting of King Yama fifth hall with black face and crescent mark holding a scepter,威严 and weary, sumi-e style with deep purple and black, portrait',
aid:{name:'狱火惊堂',type:'percent',pct:0.33,desc:'相熟真伤，信重大真伤禁疗，莫逆群震骇加真伤，本体核弹真伤加禁疗场域2回合。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['panta']},set:'yan_luo'},
zhuan_lun:{name:'转轮王',title:'十殿转轮',icon:'轮',tier:'B',camp:'地府',path:'you',unlock:{ch:3},gh:'y_zhuanlun',
intro:'十殿之末核定胎卵湿化男女贵贱发六道投生，给每个灵魂留最后一程体面的送站老人，十万游魂堵在轮回门前不是他的错。',
  sources:'《玉历宝钞》；《集说诠真》；敦煌写本《十王经》',
img:'Chinese ink wash painting of the Wheel-Turning King tenth hall turning the six-realm wheel, gentle and patient, sumi-e style with muted gold and grey, portrait',
aid:{name:'轮回簿翻',type:'debuff',atk:-0.2,def:-0.2,rounds:2,desc:'相熟降攻防2回合，信重治疗净化，莫逆随机控制，本体清增益清CD并复活一人。'},
gifts:{loved:['puti'],liked:['wugu'],disliked:['taomu']},set:'zhuan_lun'},
ao_guang:{name:'敖广',title:'东海龙王',icon:'敖',tier:'B',camp:'天庭',path:'fa',unlock:{ch:3},gh:'f_aoguang',
intro:'四海水族之长领巡海夜叉虾兵蟹将司兴云布雨，招安派老狐狸，想给东海洋下一场不必请旨的雨，三太子被哪吒抽了筋。',
quote:'下雨，得请旨；你这桩小事嘛——寡王先「研究研究」。',
  sources:'《西游记》第三、十、四十一回等；《封神演义》（敖光）；《酉阳杂俎》；唐《祠令》封四海龙王',
img:'Chinese ink wash painting of the Dragon King Ao Guang in dragon robes with coral crown, aged and diplomatic, sumi-e style with sea blue and jade green, portrait',
aid:{name:'雨簿一点',type:'burn',mult:1.3,burnPct:0.5,burnRounds:3,desc:'相熟群水伤减速，信重缠绕控制加水伤，莫逆重击加群水伤，本体水雷群核弹缠绕破防。'},
gifts:{loved:['puti'],liked:['panta'],disliked:['taomu']},set:'ao_guang'},
zhong_yue:{name:'中岳大帝',title:'中天崇圣',icon:'嵩',tier:'B',camp:'天庭',path:'sheng',unlock:{ch:3},gh:'s_zhongyue',
intro:'中岳嵩山之神居天下之中主土地山川陵台与地脉消长，五岳分权削藩受害者，地脉空心化被动中枢，教井神假装自己还满着。',
  sources:'《礼记·王制》五岳祀；《山海经·中次七经》；《旧唐书·礼仪志》；《宋史·礼志》；《五岳真形图》',
img:'Chinese ink wash painting of the Central Sacred Mountain Emperor on Mount Song with flowing robes, heavy and ancient, sumi-e style with earthy green and stone grey, portrait',
aid:{name:'岳影为屏',type:'shield',shield:0.40,desc:'相熟减伤护盾，信重群真伤减速，莫逆大减伤反伤，本体群真伤眩晕加地脉回血。'},
gifts:{loved:['xiangzhu'],liked:['wugu'],disliked:['hulu']},set:'zhong_yue'},
er_lang:{name:'二郎神',title:'清源真君',icon:'戬',tier:'A',camp:'天庭',path:'bing',unlock:{ch:3},gh:'b_qingyuan',
intro:'昭惠灵显王领梅山七圣一千二百草头神，听调不听宣的灌江口割据强神，斧劈桃山救母担山逐日，削藩首要对象。',
quote:'调令，本君接了；宣么？灌江口的庙门，从不朝那个方向开。',
  sources:'《西游记》第六回；《二郎宝卷》（明）；《封神演义》第四十回起；李冰次子、隋赵昱诸说并存',
img:'Chinese ink wash painting of Erlang Shen Yang Jian with third eye holding a three-pointed double-edged blade, proud and cold-humored, sumi-e style with silver and cinnabar, portrait',
aid:{name:'三尖两刃',type:'nuke',mult:3.3,desc:'相熟三连击，信重流血锁足，莫逆闪避化巨像反击，本体多段核弹破防无视假身。'},
gifts:{loved:['hulu'],liked:['taomu'],disliked:['panta']},set:'erlang'},
ne_zha:{name:'哪吒',title:'三坛海会',icon:'吒',tier:'A',camp:'天庭',path:'bing',unlock:{ch:3},gh:'b_santan',
intro:'中坛元帅三坛海会大神领天将降妖，莲花化身的天庭旧逆，剔骨还父割肉还母后，对神格被切有生理性共情，最共情玩家。',
  sources:'《三教源流搜神大全》；《西游记》第三、四、八十三回；《封神演义》第十二回起',
img:'Chinese ink wash painting of Nezha the lotus child deity with fire wheels and red armillary sash holding fire-tipped spear, fierce and youthful, sumi-e style with vermilion and gold, portrait',
aid:{name:'乾坤圈·砸',type:'burn',mult:1.4,burnPct:0.55,burnRounds:3,desc:'相熟重击灼烧，信重群连击灼烧，莫逆莲花复活一次，本体六段核弹群灼烧震骇。'},
gifts:{loved:['taomu'],liked:['panta'],disliked:['xiangzhu']},set:'nezha'},
zhen_wu:{name:'真武大帝',title:'玄天上帝',icon:'武',tier:'A',camp:'天庭',path:'fa',unlock:{ch:3},gh:'f_zhenwu',
intro:'北极镇天真武玄天上帝披发跣足踏龟蛇，统北方收天下妖魔的荡魔天尊，不争香火不抗调令，三方都想请而不敢硬请的砝码。',
quote:'魔，本帝来荡。其余的话——龟蛇不会说，本帝也不说。',
  sources:'《三教源流搜神大全》；《玄天上帝启圣录》；《明史·礼志》；宋赵彦卫《云麓漫钞》',
img:'Chinese ink wash painting of the True Martial Emperor with loose hair and bare feet stepping on turtle and snake, holding the Big Dipper sword, silent and majestic, sumi-e style, portrait',
aid:{name:'七星剑影',type:'nuke',mult:3.0,desc:'相熟雷水重击，信重缠绕减速2回合，莫逆群雷水震骇，本体群核弹对妖魔追加真伤。'},
gifts:{loved:['taomu'],liked:['xiangzhu'],disliked:['hulu']},set:'zhen_wu'},
lei_zu:{name:'雷祖',title:'普化天尊',icon:'雷',tier:'A',camp:'天庭',path:'fa',unlock:{ch:3},gh:'f_leizu',
intro:'雷部至尊统三十六雷主天之祸福物之权衡，掌物掌人司生司杀，闻仲绝龙岭封神，雷部被工单淹没，要劈的是发令的人。',
  sources:'《九天应元雷声普化天尊玉枢宝经》；《明史·礼志》；《道法会元》；《封神演义》第九十九回（闻仲）',
img:'Chinese ink wash painting of the Thunder Ancestor Wen Zhong with third eye and twin whips riding a qilin, dignified old minister, sumi-e style with purple lightning and gold, portrait',
aid:{name:'五雷正法',type:'nuke',mult:3.4,desc:'相熟大雷伤打断，信重群雷伤灼烧，莫逆残血处决，本体全屏雷核弹眩晕禁疗核验罪名。'},
gifts:{loved:['xiangzhu'],liked:['taomu'],disliked:['wugu']},set:'lei_zu'},
xi_yue:{name:'西岳大帝',title:'金天顺圣',icon:'华',tier:'A',camp:'天庭',path:'sheng',unlock:{ch:3},gh:'s_xiyue',
intro:'西岳华山之神西方属金主五金矿藏飞禽走兽陶铸坑冶之利，守着满山不能换香火自保的金子，三圣母被压华山西峰的旧账。',
  sources:'《礼记·王制》；《龙鱼河图》；《旧唐书·礼仪志》；《宋史·礼志》；《五岳真形图》；《沉香宝卷》（劈山救母附会）',
img:'Chinese ink wash painting of the Western Sacred Mountain Emperor of Mount Hua in golden robes, aloof and noble-weary, sumi-e style with gold and stone grey, portrait',
aid:{name:'金锋一线',type:'nuke',mult:2.9,desc:'相熟破防重击，信重全队厚盾，莫逆群伤群易伤，本体真伤核弹加易伤禁疗2回合。'},
gifts:{loved:['puti'],liked:['xiangzhu'],disliked:['hulu']},set:'xi_yue'},
xuan_nv:{name:'九天玄女',title:'九天玄女',icon:'玄',tier:'A',camp:'上古',path:'fa',unlock:{ch:3},gh:'f_xuannv',
intro:'上古兵主与术数之祖，传奇门遁甲六壬兵符，于天命将倾时只授破局者的西王母座前传法人，授黄帝破蚩尤、宋江三卷天书。',
  sources:'《诗经·商颂·玄鸟》；《黄帝内经》（传本）；《云笈七签·九天玄女传》；《广黄帝本行记》；《水浒传》第四十二回',
img:'Chinese ink wash painting of the Mysterious Lady of the Ninth Heaven on a phoenix holding scrolls and talismans, cold and transcendent, sumi-e style with dark teal and silver, portrait',
aid:{name:'六壬课',type:'vuln',mult:2.0,vuln:0.5,rounds:2,desc:'相熟易伤看破意图，信重全队闪避先手，莫逆剑阵群伤，本体打断群易伤并全队CD归零。'},
gifts:{loved:['mozhen'],liked:['puti'],disliked:['wugu']},set:'xuan_nv'},
guan_yin:{name:'观音菩萨',title:'大慈大悲',icon:'观',tier:'A',camp:'释门',path:'sheng',unlock:{ch:3},gh:'s_guanyin',
intro:'寻声救苦随类化现的大悲菩萨三十三身，手持净瓶杨柳，落伽山潮音洞听三界哭号，净瓶甘露能起死回生，慈悲不站队。',
quote:'哪一处有哭声，哪一处，便是南海。',
  sources:'《妙法莲华经·观世音菩萨普门品》《大悲心陀罗尼经》；《华严经》；《香山宝卷》（妙善公主）；《西游记》',
img:'Chinese ink wash painting of Guanyin the compassionate bodhisattva holding a willow branch and pure vase, serene and merciful, sumi-e style with soft jade white and gold, portrait',
aid:{name:'杨枝甘露',type:'heal',heal:0.42,desc:'相熟大额治疗，信重复活一人，莫逆全队大盾全净化，本体满疗复活全员免控免灼。'},
gifts:{loved:['puti'],liked:['xiangzhu'],disliked:['hulu']},set:'guanyin'},
di_zang:{name:'地藏王菩萨',title:'大愿地藏',icon:'藏',tier:'A',camp:'释门',path:'sheng',unlock:{ch:3},gh:'s_dizang',
intro:'幽冥教主地狱未空誓不成佛度尽六道罪苦众生的大愿菩萨，章5给玩家关键提示的九华山法主，问要救神还是救造狱的机器。',
  sources:'《地藏菩萨本愿经》；《大乘大集地藏十轮经》；唐《九华山化成寺记》（金乔觉）；《西游记》第三回、五十八回（谛听）',
img:'Chinese ink wash painting of Ksitigarbha bodhisattva with monk staff and wish-fulfilling pearl, gentle and vow-deep, sumi-e style with gold and muted red, portrait',
aid:{name:'谛听伏地',type:'vuln',mult:1.9,vuln:0.5,rounds:2,desc:'相熟看破群显形易伤，信重治疗对鬼真伤，莫逆全队盾阵亡反弹，本体鬼类持续真伤禁疗。'},
gifts:{loved:['puti'],liked:['xiangzhu'],disliked:['taomu']},set:'di_zang'},
wei_tuo:{name:'韦驮',title:'护法韦驮',icon:'韦',tier:'A',camp:'释门',path:'bing',unlock:{ch:3},gh:'b_weituo',
intro:'四大天王部下三十二将之首，护持僧伽佛法守护佛舍利的护法总神，山门内最后一个动手的神，一杵一个准，只奉法旨。',
  sources:'《长阿含经》；《大藏经·护法篇》（韦驮天/Skanda）；《金光明经》；《封神演义》韦护',
img:'Chinese ink wash painting of Skanda the protector deity in youthful armor holding a vajra pestle upright, disciplined and solemn, sumi-e style with gold and saffron, portrait',
aid:{name:'降魔杵影',type:'nuke',mult:3.1,desc:'相熟重击对魔加成，信重全队嘲讽大盾，莫逆贯穿连击打断，本体核弹对魔处决加免控盾。'},
gifts:{loved:['taomu'],liked:['puti'],disliked:['hulu']},set:'wei_tuo'},
sun_wukong:{name:'孙悟空',title:'斗战胜佛',icon:'猴',tier:'S',camp:'妖仙',path:'bing',unlock:{ch:3},gh:'b_douzhan',
intro:'花果山美猴王齐天大圣斗战胜佛，前半生反了两次天取了一趟经的石猴，削藩受害者花果山余部线，成佛后头上金箍没人收走过。',
  sources:'《西游记》（全书，第一、四、七回为主）；《大唐三藏取经诗话》；元杂剧《二郎神锁齐天大圣》',
img:'Chinese ink wash painting of Sun Wukong the Monkey King with golden headband and staff, irreverent and sharp-eyed, sumi-e style with dynamic cinnabar strokes, portrait',
aid:{name:'如意金箍棒',type:'nuke',mult:4.2,desc:'相熟三段重击，信重看破群易伤，莫逆分身群攻，本体全屏多段核弹灼烧震骇。'},
gifts:{loved:['panta'],liked:['hulu'],disliked:['xiangzhu']},set:'sunwukong'},
feng_du:{name:'酆都大帝',title:'北阴大帝',icon:'酆',tier:'S',camp:'地府',path:'you',unlock:{ch:3},gh:'y_fengdu',
intro:'天下鬼神之宗治罗酆山统北阴六天宫三千年一替的幽冥旧主，被外包总署征作账房的被架空旧神，决定三千年一替还算不算数。',
  sources:'南朝·陶弘景《真灵位业图》第七中位；《枕中书》；《真诰》；葛洪《神仙传》（王方平、阴长生）',
img:'Chinese ink wash painting of the Great Emperor of Fengdu in ancient dark robes before six ghost palaces, aged and tired of power, sumi-e style with black and bronze, portrait',
aid:{name:'罗酆令',type:'percent',pct:0.40,desc:'相熟真伤对神加成，信重群减攻减速，莫逆群真伤削弱，本体全屏核弹封印援助并满复活。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['panta']},set:'feng_du'},
dong_yue:{name:'东岳大帝',title:'天齐仁圣',icon:'泰',tier:'S',camp:'地府',path:'you',unlock:{ch:3},gh:null,
intro:'五岳之首天帝之孙主召人魂魄定人生死贵贱，幽冥地府十八重地狱总领，被相爷借名架空的生死总领，用朕的名收天下人的命。',
  sources:'《风俗通义》；《博物志》；《旧唐书·礼仪志》；《宋史·礼志》；《封神演义》第九十九回；《五岳真形图》',
img:'Chinese ink wash painting of the Eastern Sacred Mountain Emperor of Mount Tai in imperial robes holding the book of life and death,沉重 and regal-weary, sumi-e style with jade and imperial gold, portrait',
aid:{name:'天齐符',type:'percent',pct:0.38,desc:'相熟真伤加易伤，信重减伤领域，莫逆血线越低越锁定，本体全屏真伤核弹封复活治疗。'},
gifts:{loved:['xiangzhu'],liked:['wugu'],disliked:['panta']},set:'dong_yue'},
xi_wangmu:{name:'西王母',title:'瑶池金母',icon:'母',tier:'S',camp:'上古',path:'sheng',unlock:{ch:3},gh:null,
intro:'女仙之首居昆仑玉山瑶池掌不死药与蟠桃，司天之厉及五残的上古大神，终章瑶池叙功宴立场戏的旧贵之首，见过穆天子与汉武帝。',
  sources:'《山海经·西山经·大荒西经》；《穆天子传》；《汉武帝内传》《汉武故事》；《枕中书》；《西游记》',
img:'Chinese ink wash painting of the Queen Mother of the West in noble robes beside jade lake with peaches, poised and看透一切, sumi-e style with jade green and mother-of-pearl, portrait',
aid:{name:'三青传信',type:'vuln',mult:2.1,vuln:0.5,rounds:2,desc:'相熟看破易伤，信重回血微盾，莫逆群沉默减速，本体复活群定身或真伤核弹禁疗。'},
gifts:{loved:['panta'],liked:['puti'],disliked:['taomu']},set:'xi_wangmu'}
};

const SHARD_NEED=5;
const CONDENSE_POOL={bing:['b_juli'],fa:['f_leigong'],huo:['h_huoling']};
const AWAKE_RATE={'凡':{rate:0.30,cost:200},'灵':{rate:0.20,cost:400},'宝':{rate:0.12,cost:800},'仙':{rate:0.05,cost:1600}};
const PONDER_INSIGHT=0.03;
const SHRINE_BONUS=[0.15,0.30];
const AWAKE_CAP=0.70;
const PATH_CLASH=[['bing','fa'],['you','sheng']];
const RESONANCE={bing:{two:{crit:0.10,label:'暴击+10%'},four:{critDmg:0.25,label:'暴伤+25%'}},fa:{two:{mpCost:0.85,label:'主动耗神-15%'},four:{ctrlBonus:1,label:'控制+1回合'}},you:{two:{lifesteal:0.08,label:'吸血+8%'},four:{trueDmg:0.15,label:'真伤+15%'}},huo:{two:{burnDot:0.20,label:'灼烧+20%'},four:{burnRound:1,label:'灼烧+1回合'}},sheng:{two:{healShield:0.15,label:'治疗护盾+15%'},four:{cleanseHeal:0.10,label:'净化回10%'}}};
const GODHOODS={
b_juli:{name:'巨力格',path:'bing',q:'凡',icon:'💪',god:'巨灵神',desc:'山都扛得动，何况你这瘦鬼。',stat:{hp:12,atk:3},passive:{strongAtk:0.08,labels:['强攻伤害+8%']},active:{name:'巨灵开山',type:'nuke',cost:20,cd:3,mult:1.60,desc:'160%攻击单体伤害'}},
b_wusheng:{name:'武圣格',path:'bing',q:'宝',icon:'⚔️',god:'关羽',desc:'酒尚温，汝头且寄项上。',stat:{hp:32,atk:10},passive:{crit:0.10,labels:['暴击率+10%']},active:{name:'青龙偃月',type:'nuke',cost:32,cd:4,mult:2.40,desc:'240%攻击；易伤目标额外+60%'}},
b_santan:{name:'三坛格',path:'bing',q:'仙',icon:'🔱',god:'哪吒',desc:'莲花做的身子，不怕死。',stat:{hp:44,atk:11},passive:{atk:7,extra:'攻击震骇目标伤害+15%',labels:['ATK+7','趁震骇伤害+15%']},active:{name:'火尖断魂枪',type:'nukeStun',cost:36,cd:4,mult:2.30,desc:'230%攻击并震骇1回合'}},
b_ganqi:{name:'干戚格',path:'bing',q:'宝',icon:'🪓',god:'刑天',desc:'头可以没有，舞不能停。',stat:{hp:40,atk:8,def:4},passive:{extra:'HP低于50%时ATK+20%',labels:['猛志常在：残血ATK+20%']},active:{name:'干戚之舞',type:'nuke',cost:36,cd:4,mult:2.60,desc:'260%攻击；每损10%HP系数+8%'}},
b_qingyuan:{name:'清源格',path:'bing',q:'仙',icon:'👁️',god:'二郎神',desc:'我这只眼，专看天衣上的缝。',stat:{hp:48,atk:11,def:6},passive:{crit:0.12,labels:['暴击率+12%']},active:{name:'天眼勘破',type:'vuln',cost:34,cd:4,mult:1.50,vuln:2,desc:'150%攻击+易伤2回合'}},
b_douzhan:{name:'斗战格',path:'bing',q:'仙',icon:'🐒',god:'孙悟空',desc:'皇帝轮流做——这话不让说了。',stat:{hp:52,atk:13},passive:{crit:0.15,labels:['暴击率+15%']},active:{name:'如意千钧',type:'nuke',cost:30,cd:4,mult:2.80,desc:'280%攻击单体伤害'}},
b_bingzhu:{name:'兵主格',path:'bing',q:'仙',icon:'🛡️',god:'蚩尤',desc:'输给刀可以，别输给契。',stat:{hp:55,atk:14,def:6},passive:{strongAtk:0.12,critDmg:0.12,labels:['强攻+12%','暴伤+12%']},active:{name:'兵主伐天',type:'nukeStun',cost:50,cd:5,mult:3.60,desc:'360%攻击+震骇1；神/壳神再+10%'}},
b_niutou:{name:'铁角格',path:'bing',q:'灵',icon:'🐂',god:'牛头阿傍',desc:'讲理讲不通的门，用角。',stat:{hp:20,atk:5},passive:{dmgReduce:0.10,labels:['强攻对撞受伤-10%']},active:{name:'铁角冲城',type:'nuke',cost:22,cd:3,mult:1.70,desc:'170%攻击；守势目标无视减伤'}},
b_mamian:{name:'追风格',path:'bing',q:'灵',icon:'🐴',god:'马面',desc:'跑？你跑不过一道调令。',stat:{hp:18,atk:5,def:2},passive:{extra:'速度判定+15%',labels:['速度+15%']},active:{name:'追风索命',type:'nuke',cost:22,cd:3,mult:1.50,desc:'150%攻击；魂鬼类额外+40%'}},
b_luban:{name:'巧圣格',path:'bing',q:'宝',icon:'🪚',god:'鲁班',desc:'木头不会抱怨加班。',stat:{hp:30,atk:8,def:5},passive:{atk:6,extra:'神衙设施支援伤害+15%',labels:['ATK+6','设施支援+15%']},active:{name:'木鸢机括',type:'nuke',cost:32,cd:4,mult:2.30,desc:'230%攻击；击杀则冷却减半'}},
b_lvchunyang:{name:'纯阳格',path:'bing',q:'宝',icon:'🍶',god:'吕洞宾',desc:'剑要利，人要醒；酒另说。',stat:{hp:32,atk:9},passive:{extra:'攻击命中15%概率附灼烧1回合',labels:['15%概率灼烧1回合']},active:{name:'天遁剑诀',type:'nuke',cost:34,cd:4,mult:2.20,burnPct:0.30,burnRounds:2,desc:'220%攻击+灼烧2回合(30%)'}},
b_zhaogong:{name:'玄坛格',path:'bing',q:'宝',icon:'💰',god:'赵公明',desc:'贫道只讲两件事：缘，和元。',stat:{hp:36,atk:10,def:4},passive:{critDmg:0.15,extra:'战斗胜利香火钱+6%',labels:['暴伤+15%','胜利香火+6%']},active:{name:'铁鞭镇财',type:'nuke',cost:34,cd:4,mult:2.60,desc:'260%攻击；易伤目标搜刮香火'}},
b_weituo:{name:'护法格',path:'bing',q:'仙',icon:'🪄',god:'韦驮',desc:'你护你的众生，我护你。',stat:{hp:48,atk:10,def:10},passive:{dmgReduce:0.20,labels:['每回合首伤-20%']},active:{name:'降魔宝杵',type:'nuke',cost:44,cd:5,mult:3.00,desc:'300%攻击；持盾时系数+60%'}},
f_leigong:{name:'五雷格',path:'fa',q:'凡',icon:'⚡',god:'雷公',desc:'轰隆隆——这是批了的。',stat:{hp:10,atk:4},passive:{extra:'对鬼类伤害+8%',labels:['对鬼+8%']},active:{name:'五雷诀',type:'control',cost:22,cd:3,mult:1.00,ctrlRounds:1,desc:'100%攻击+雷控1回合并附导电'}},
f_lingguan:{name:'灵官格',path:'fa',q:'宝',icon:'👁️‍🗨️',god:'王灵官',desc:'三眼查过，金鞭不讲人情。',stat:{hp:30,atk:7,def:5},passive:{extra:'对妖类伤害+10%',labels:['对妖+10%']},active:{name:'金鞭纠察',type:'nuke',cost:30,cd:3,mult:2.10,vuln:1,desc:'210%攻击+易伤1回合'}},
f_tianwang:{name:'天王格',path:'fa',q:'宝',icon:'🗡️',god:'四大天王',desc:'风调雨顺，一字一道雷。',stat:{hp:36,def:9},passive:{def:8,labels:['DEF+8']},active:{name:'青云剑阵',type:'control',cost:34,cd:4,mult:1.60,ctrlRounds:2,desc:'160%攻击+雷控2回合'}},
f_zutianshi:{name:'正一格',path:'fa',q:'宝',icon:'📜',god:'张道陵',desc:'太上老君授的符，妖魔自己摘。',stat:{hp:34,atk:8,def:5},passive:{mpCost:0.06,labels:['主动耗神-6%']},active:{name:'正一盟威',type:'nuke',cost:35,cd:4,mult:2.40,desc:'240%攻击；击杀返还50%神力'}},
f_xuannv:{name:'玄女格',path:'fa',q:'仙',icon:'🪶',god:'九天玄女',desc:'胜败在开打前就排好了。',stat:{hp:46,atk:10,def:8},passive:{extra:'施加的易伤效果+10%承伤',labels:['易伤+10%承伤']},active:{name:'六甲奇门',type:'vuln',cost:36,cd:4,mult:1.20,vuln:3,desc:'120%攻击+易伤3回合'}},
f_zhenwu:{name:'真武格',path:'fa',q:'仙',icon:'🐢',god:'真武大帝',desc:'妖魔二字，在我殿前是斩。',stat:{hp:50,atk:12,def:8},passive:{extra:'对妖、鬼两类伤害均+8%',labels:['对妖鬼+8%']},active:{name:'玄天黑帝符',type:'nukeStun',cost:45,cd:5,mult:3.20,desc:'320%攻击+震骇1回合'}},
f_leizu:{name:'雷尊格',path:'fa',q:'仙',icon:'🌩️',god:'雷声普化天尊',desc:'代天刑罚——雷部，开工。',stat:{hp:58,atk:14,def:6},passive:{ctrlBonus:0.25,labels:['雷控命中时长+25%']},active:{name:'九霄神雷',type:'nuke',cost:55,cd:5,mult:3.80,ctrlRounds:1,desc:'380%攻击+雷控1；蓄力必暴'}},
f_dianmu:{name:'金光格',path:'fa',q:'宝',icon:'🪞',god:'电母',desc:'雷公打雷前，得先照我的镜子。',stat:{hp:28,atk:7,def:4},passive:{ctrlBonus:0.20,labels:['雷控命中+20%']},active:{name:'金光掌镜',type:'control',cost:28,cd:3,mult:1.50,ctrlRounds:1,desc:'150%攻击+震骇1回合并附导电'}},
f_wenchang:{name:'文星格',path:'fa',q:'宝',icon:'🖌️',god:'文昌帝君',desc:'这笔下去，点中的是名也是命。',stat:{hp:32,atk:7,def:6},passive:{mpCost:0.08,labels:['主动耗神-8%']},active:{name:'魁星点斗',type:'nuke',cost:32,cd:4,mult:1.70,vuln:2,desc:'170%攻击+易伤2；蓄力必中必暴'}},
f_aoguang:{name:'沧波格',path:'fa',q:'宝',icon:'🐉',god:'东海龙王',desc:'雨是请了旨的，浪是我自己的。',stat:{hp:38,atk:6,def:8},passive:{extra:'对灼烧/火系目标+12%，对妖+8%',labels:['克火+12%','对妖+8%']},active:{name:'沧海龙吟',type:'control',cost:34,cd:4,mult:1.75,ctrlRounds:1,desc:'175%攻击+震骇1并清除灼烧'}},
y_wuchang:{name:'无常格',path:'you',q:'灵',icon:'⚖️',god:'黑白无常',desc:'白：你也来了。黑：正在捉你。',stat:{hp:20,atk:5},passive:{lifesteal:0.06,labels:['吸血+6%']},active:{name:'一见生财',type:'percentStun',cost:26,cd:4,pct:0.12,desc:'敌12%最大生命真伤+震骇1'}},
y_mengpo:{name:'忘川格',path:'you',q:'灵',icon:'🍲',god:'孟婆',desc:'恩怨一碗汤，忘了好赶路。',stat:{hp:24,def:5},passive:{extra:'攻击命中20%概率驱散目标1增益',labels:['20%概率驱散1增益']},active:{name:'忘情一汤',type:'vuln',cost:24,cd:3,mult:0.80,vuln:2,desc:'80%攻击+驱散全部增益+易伤2'}},
y_zhongkui:{name:'罚恶格',path:'you',q:'宝',icon:'👹',god:'钟馗',desc:'鬼这东西，和蒜一个味，下饭。',stat:{hp:38,atk:7},passive:{lifesteal:0.10,extra:'对鬼类伤害+10%',labels:['吸血+10%','对鬼+10%']},active:{name:'啖鬼三千',type:'percentHeal',cost:38,cd:4,pct:0.20,heal:0.20,desc:'敌20%真伤，回自身20%生命'}},
y_cuijue:{name:'阴律格',path:'you',q:'宝',icon:'🖋️',god:'崔珏',desc:'贞观一纪是我添的，还在还。',stat:{hp:36,def:8},passive:{lifesteal:0.08,labels:['吸血+8%']},active:{name:'判官添寿',type:'percentHeal',cost:35,cd:4,pct:0.22,heal:0.25,desc:'敌22%真伤，回自身25%生命'}},
y_yanluo:{name:'森罗格',path:'you',q:'宝',icon:'⚖️',god:'阎罗王包拯',desc:'阎王叫你三更死，不留五更。',stat:{hp:40,atk:8,def:5},passive:{lifesteal:0.10,labels:['吸血+10%']},active:{name:'朱笔勾魂',type:'percentStun',cost:40,cd:5,pct:0.30,desc:'敌30%最大生命真伤+震骇1'}},
y_fengdu:{name:'酆都格',path:'you',q:'仙',icon:'🏯',god:'酆都大帝',desc:'进了罗酆山，生死簿翻到末页。',stat:{hp:56,atk:10,def:10},passive:{trueDmg:0.12,labels:['真实伤害+12%']},active:{name:'罗酆诏狱',type:'percentHeal',cost:50,cd:5,pct:0.35,heal:0.20,desc:'敌35%真伤，回自身20%生命'}},
y_houtu:{name:'后土格',path:'you',q:'仙',icon:'🌏',god:'后土皇地祇',desc:'万物归于土。神，也不例外。',stat:{hp:68,atk:12,def:12},passive:{trueDmg:0.15,lifesteal:0.06,labels:['真伤+15%','吸血+6%']},active:{name:'六道同悲',type:'percentHeal',cost:55,cd:6,pct:0.40,heal:0.35,desc:'敌40%真伤+回血35%+净化'}},
y_chenghuang:{name:'阴牒格',path:'you',q:'灵',icon:'📜',god:'城隍爷',desc:'本城孤魂，见牒即归。',stat:{hp:22,def:4},passive:{extra:'对魂类伤害+8%',labels:['对魂+8%']},active:{name:'阴牒照胆',type:'percentStun',cost:20,cd:3,pct:0.08,desc:'敌8%真伤；魂类+4%并震骇1'}},
y_riyou:{name:'举发格',path:'you',q:'灵',icon:'☀️',god:'日游神',desc:'善恶录上，你那一笔我记下了。',stat:{hp:16,atk:4},passive:{extra:'攻击命中20%概率附易伤1回合',labels:['20%概率易伤1回合']},active:{name:'白日举发',type:'vuln',cost:20,cd:3,mult:0.90,vuln:2,desc:'90%攻击+易伤2回合'}},
y_yeyou:{name:'缉形格',path:'you',q:'灵',icon:'🌙',god:'夜游神',desc:'天黑了。——该我上班了。',stat:{hp:18,atk:4,def:2},passive:{extra:'对易伤中目标伤害+10%',labels:['易伤目标+10%']},active:{name:'暗夜缉形',type:'percentStun',cost:24,cd:3,pct:0.09,desc:'敌9%真伤；易伤目标追加震骇1'}},
y_weizheng:{name:'赏善格',path:'you',q:'宝',icon:'📖',god:'魏征',desc:'我梦里斩过龙，赏罚分明。',stat:{hp:34,def:8},passive:{healShield:0.08,labels:['治疗护盾+8%']},active:{name:'赏善罚恶簿',type:'percentHeal',cost:32,cd:4,pct:0.16,heal:0.14,desc:'敌16%真伤，回自身14%生命'}},
y_lupan:{name:'剖验格',path:'you',q:'宝',icon:'🔍',god:'陆之道',desc:'人心鬼心神心，剖开都差不多。',stat:{hp:32,atk:7,def:5},passive:{antiShell:0.12,labels:['对神/壳神+12%']},active:{name:'换心剖验',type:'vuln',cost:30,cd:4,mult:1.50,vuln:2,desc:'150%攻击+易伤2；壳神易伤3并破一层'}},
y_qinguang:{name:'孽镜格',path:'you',q:'宝',icon:'🪞',god:'秦广王',desc:'抬头。看看你自己。',stat:{hp:38,atk:7,def:6},passive:{trueDmg:0.10,labels:['真实伤害+10%']},active:{name:'孽镜台前',type:'percentStun',cost:38,cd:5,pct:0.20,desc:'敌20%真伤并驱散全部增益'}},
y_zhuanlun:{name:'轮回格',path:'you',q:'宝',icon:'♻️',god:'转轮王',desc:'过不去这一关，就回炉。',stat:{hp:40,atk:6,def:8},passive:{firstSave:{heal:0.15},labels:['首次致命伤免死+回15%HP']},active:{name:'六道轮转',type:'percentHeal',cost:38,cd:5,pct:0.18,heal:0.20,desc:'敌18%真伤，回自身20%生命'}},
h_huoling:{name:'火灵格',path:'huo',q:'凡',icon:'🔥',god:'火灵童子',desc:'别跑呀，我就想抱抱你。',stat:{hp:10,atk:4},passive:{extra:'攻击命中15%概率附灼烧1(20%)',labels:['15%概率灼烧1(20%)']},active:{name:'点个火星',type:'burn',cost:20,cd:3,mult:1.00,burnPct:0.30,burnRounds:2,desc:'100%攻击+灼烧2回合(30%)'}},
h_chijing:{name:'阴阳格',path:'huo',q:'宝',icon:'🪞',god:'赤精子',desc:'镜这一面生，那一面死。',stat:{hp:34,atk:7,def:5},passive:{extra:'灼烧目标受到所有伤害+8%',labels:['灼烧目标承伤+8%']},active:{name:'阴阳镜转',type:'nuke',cost:34,cd:4,mult:2.20,burnPct:0.40,burnRounds:2,desc:'220%攻击+灼烧2回合(40%)'}},
h_luoxuan:{name:'火德格',path:'huo',q:'宝',icon:'🔥',god:'罗宣',desc:'该烧的一样不剩。',stat:{hp:36,atk:9},passive:{burnDot:0.12,labels:['灼烧伤害+12%']},active:{name:'万鸦焚天',type:'burn',cost:38,cd:5,mult:1.40,burnPct:0.45,burnRounds:4,desc:'140%攻击+灼烧4回合(45%)'}},
h_huaguang:{name:'华光格',path:'huo',q:'宝',icon:'🛞',god:'华光大帝',desc:'我反过天宫三次，凭轮子烫。',stat:{hp:38,atk:9,def:4},passive:{atk:8,labels:['ATK+8']},active:{name:'三昧火轮',type:'nuke',cost:40,cd:4,mult:2.40,burnPct:0.40,burnRounds:3,desc:'240%攻击+灼烧3回合(40%)'}},
h_zhuque:{name:'朱雀格',path:'huo',q:'宝',icon:'🦅',god:'南方朱雀',desc:'灰烬里出来的，一定是。',stat:{hp:42,def:8},passive:{regen:0.03,labels:['每回合回3%HP']},active:{name:'南明离火',type:'burn',cost:38,cd:5,mult:1.80,burnPct:0.40,burnRounds:3,shield:0.25,rounds:2,desc:'180%攻击+灼烧3回合+25%护盾2'}},
h_zhurong:{name:'祝融格',path:'huo',q:'仙',icon:'🌋',god:'祝融',desc:'人间第一次吃熟食那天，我在。',stat:{hp:54,atk:14,def:6},passive:{burnDot:0.15,labels:['灼烧伤害+15%']},active:{name:'天火燎原',type:'nuke',cost:52,cd:5,mult:3.40,burnPct:0.60,burnRounds:3,desc:'340%攻击+灼烧3回合(60%)'}},
s_magu:{name:'麻姑格',path:'sheng',q:'灵',icon:'🍑',god:'麻姑',desc:'东海又浅了一半，你急什么。',stat:{hp:26,def:4},passive:{extra:'战斗结束多回5%生命',labels:['战后回血+5%']},active:{name:'麻姑献寿',type:'heal',cost:22,cd:3,heal:0.30,desc:'回复30%最大生命'}},
s_hexiang:{name:'荷仙格',path:'sheng',q:'灵',icon:'🪷',god:'何仙姑',desc:'荷上的雨，一滴砸不到你。',stat:{hp:24,def:5},passive:{dmgReduce:0.08,labels:['持盾受伤-8%']},active:{name:'荷叶成屏',type:'shield',cost:24,cd:3,shield:0.35,rounds:3,desc:'获得35%生命护盾3回合'}},
s_yaowang:{name:'世良格',path:'sheng',q:'宝',icon:'⚗️',god:'孙思邈',desc:'人命至重，有贵千金。',stat:{hp:36,def:7},passive:{extra:'灼烧/中毒伤害-20%',labels:['灼烧中毒-20%']},active:{name:'千金一方',type:'cleanse',cost:26,cd:3,heal:0.25,desc:'净化全部异常并回25%生命'}},
s_bixia:{name:'碧霞格',path:'sheng',q:'宝',icon:'☁️',god:'碧霞元君',desc:'泰山的云压下来，我顶着。',stat:{hp:40,def:9},passive:{healShield:0.15,labels:['护盾值+15%']},active:{name:'元君慈帔',type:'shield',cost:34,cd:4,shield:0.45,rounds:3,desc:'净化异常+45%生命护盾3回合'}},
s_mazu:{name:'天妃格',path:'sheng',q:'宝',icon:'⛵',god:'妈祖',desc:'海上红灯亮着，就有人接你。',stat:{hp:40,def:9},passive:{healShield:0.12,labels:['治疗护盾+12%']},active:{name:'天妃救苦',type:'shield',cost:40,cd:4,shield:0.35,rounds:3,heal:0.25,desc:'35%护盾3回合+回25%生命'}},
s_dizang:{name:'地藏格',path:'sheng',q:'仙',icon:'🙏',god:'地藏王菩萨',desc:'地狱不空，誓不成佛。',stat:{hp:58,def:10},passive:{extra:'对鬼类伤害+18%',labels:['对鬼+18%（超度）']},active:{name:'地狱度空',type:'percentHeal',cost:45,cd:5,pct:0.25,heal:0.25,desc:'敌25%真伤(鬼类+10%)+回血25%'}},
s_guanyin:{name:'慈航格',path:'sheng',q:'仙',icon:'🍶',god:'观世音菩萨',desc:'若尽求尽应，我这瓶水早见底。',stat:{hp:60,atk:6,def:8},passive:{healShield:0.15,labels:['治疗效果+15%']},active:{name:'杨枝甘露',type:'nukeHeal',cost:50,cd:5,mult:2.00,heal:0.35,desc:'净化+200%攻击+回35%生命'}},
s_bigan:{name:'无心格',path:'sheng',q:'宝',icon:'❤️',god:'比干',desc:'我没有心——所以不偏。',stat:{hp:34,def:8},passive:{extra:'易伤持续-1回合，灼烧中毒-15%',labels:['易伤-1回合','灼烧中毒-15%']},active:{name:'七窍玲珑',type:'shield',cost:30,cd:4,shield:0.38,rounds:3,desc:'净化异常+38%生命护盾3回合'}},
s_zhongyue:{name:'嵩高地脉格',path:'sheng',q:'宝',icon:'⛰️',god:'中岳大帝',desc:'地要是塌了，账算我的。',stat:{hp:42,def:9},passive:{def:8,healShield:0.10,labels:['DEF+8','护盾值+10%']},active:{name:'嵩高镇地',type:'shield',cost:34,cd:4,shield:0.45,rounds:3,desc:'45%生命护盾3回合并每回合回4%'}},
s_xiyue:{name:'金天格',path:'sheng',q:'仙',icon:'🪨',god:'西岳大帝',desc:'华山一条路，上得来下不去。',stat:{hp:46,atk:8,def:10},passive:{def:10,extra:'受近战15%反弹30%伤害',labels:['DEF+10','15%反弹30%伤害']},active:{name:'金天正煞',type:'nuke',cost:44,cd:5,mult:2.10,shield:0.30,rounds:2,desc:'210%攻击+30%生命护盾2回合'}},
fz_qitian:{name:'战魂齐天',path:'bing',q:'仙',icon:'🐒',god:'斗战+兵主',desc:'大闹一场，神也得让道。',stat:{hp:60,atk:15,def:7},passive:{crit:0.20,strongAtk:0.12,labels:['暴击+20%','强攻+12%']},active:{name:'大闹一场',type:'nukeStun',cost:50,cd:5,mult:4.20,desc:'420%攻击+震骇1；神/壳神再+10%'},fusion:true,harmony:true},
fz_xianfeng:{name:'劈山先锋',path:'bing',q:'宝',icon:'🔱',god:'三坛+武圣',desc:'先锋陷阵，斩将夺旗。',stat:{hp:46,atk:12},passive:{atk:10,labels:['ATK+10']},active:{name:'先锋陷阵',type:'nuke',cost:36,cd:4,mult:3.20,desc:'320%攻击；击杀后暴击+15%(叠3层)'},fusion:true,harmony:true},
fz_fumo:{name:'九天伏魔',path:'fa',q:'仙',icon:'⚡',god:'雷尊+真武',desc:'伏魔天雷，妖魔无处遁。',stat:{hp:56,atk:14,def:8},passive:{ctrlBonus:0.25,labels:['控制时长+25%']},active:{name:'伏魔天雷',type:'nuke',cost:55,cd:5,mult:3.60,ctrlRounds:1,desc:'360%攻击+雷控1；蓄力必暴'},fusion:true,harmony:true},
fz_liujia:{name:'六甲天阵',path:'fa',q:'宝',icon:'🛡️',god:'天王+玄女',desc:'六丁六甲，雷网护身。',stat:{hp:44,def:10},passive:{def:10,labels:['DEF+10']},active:{name:'六丁六甲',type:'control',cost:36,cd:4,mult:1.80,ctrlRounds:2,shield:0.30,rounds:2,desc:'180%攻击+雷控2；自身30%护盾2'},fusion:true,harmony:true},
fz_zhuihun:{name:'黑白追魂',path:'you',q:'宝',icon:'⚖️',god:'无常+钟馗',desc:'追魂索命，鬼类难逃。',stat:{hp:42,atk:8},passive:{lifesteal:0.12,labels:['吸血+12%']},active:{name:'追魂索命',type:'percentStun',cost:38,cd:4,pct:0.30,desc:'敌30%真伤+震骇1；鬼兵斩杀25%'},fusion:true,harmony:true},
fz_zhongshen:{name:'地府终审',path:'you',q:'仙',icon:'⚖️',god:'森罗+酆都',desc:'终审定谳，一锤定生死。',stat:{hp:58,atk:11,def:10},passive:{trueDmg:0.15,labels:['真实伤害+15%']},active:{name:'终审定谳',type:'percentHeal',cost:50,cd:5,pct:0.45,heal:0.30,desc:'敌45%真伤+回血30%'},fusion:true,harmony:true},
fz_wanya:{name:'万鸦焚天',path:'huo',q:'仙',icon:'🔥',god:'祝融+火德',desc:'万鸦燎原，万物成灰。',stat:{hp:56,atk:15,def:6},passive:{burnDot:0.20,labels:['灼烧伤害+20%']},active:{name:'万鸦燎原',type:'burn',cost:52,cd:5,mult:2.00,burnPct:0.70,burnRounds:4,desc:'200%攻击+灼烧4回合(70%)'},fusion:true,harmony:true},
fz_niepan:{name:'离火涅槃',path:'huo',q:'宝',icon:'🦅',god:'华光+朱雀',desc:'涅槃轮转，浴火重生。',stat:{hp:46,def:9},passive:{regen:0.04,labels:['每回合回4%HP']},active:{name:'涅槃轮转',type:'burn',cost:40,cd:5,mult:2.60,burnPct:0.50,burnRounds:3,shield:0.30,desc:'260%攻击+灼烧3回合+30%护盾'},fusion:true,harmony:true},
fz_suopo:{name:'娑婆度尽',path:'sheng',q:'仙',icon:'🙏',god:'慈航+地藏',desc:'同体大悲，度尽娑婆。',stat:{hp:62,atk:7,def:10},passive:{healShield:0.18,labels:['治疗效果+18%']},active:{name:'同体大悲',type:'nukeHeal',cost:50,cd:5,mult:2.60,heal:0.40,desc:'净化+260%攻击+回血40%；鬼类超度+15%'},fusion:true,harmony:true},
fz_cihangduhai:{name:'四海慈航',path:'sheng',q:'宝',icon:'⛵',god:'天妃+碧霞',desc:'慈航普度，四海皆安。',stat:{hp:46,def:10},passive:{healShield:0.18,labels:['护盾值+18%']},active:{name:'慈航普度',type:'shield',cost:40,cd:4,shield:0.50,rounds:3,heal:0.20,desc:'50%护盾3回合+回血20%'},fusion:true,harmony:true},
fz_lianyu:{name:'炼狱业火',path:'you',q:'宝',icon:'🔥',god:'阴律+火德',desc:'业火照律，焚魂勾名。',stat:{hp:44,atk:9,def:7},passive:{lifesteal:0.08,burnDot:0.10,labels:['吸血+8%','灼烧+10%']},active:{name:'业火照律',type:'percentStun',cost:38,cd:5,pct:0.25,burnPct:0.50,burnRounds:3,desc:'敌25%真伤+震骇1+灼烧3回合(50%)'},fusion:true,harmony:true,paths:['you','huo']},
fz_tianbing:{name:'天兵破阵',path:'bing',q:'宝',icon:'⚔️',god:'斗战+正一',desc:'天兵破阵，守势皆摧。',stat:{hp:50,atk:13,def:6},passive:{crit:0.12,labels:['暴击+12%']},active:{name:'天兵破阵',type:'nuke',cost:35,cd:4,mult:3.40,vuln:2,desc:'340%攻击+易伤2；守势目标系数翻倍'},fusion:true,harmony:true,paths:['bing','fa']},
fz_sheshen:{name:'舍身劫',path:'sheng',q:'宝',icon:'💀',god:'地藏+忘川',desc:'舍身饲劫，生死逆流。',stat:{hp:52,def:9},passive:{extra:'HP<50%时真实伤害+20%',labels:['残血真伤+20%']},active:{name:'舍身饲劫',type:'percentHeal',cost:45,cd:5,pct:0.40,heal:0.25,desc:'献祭30%当前HP，真伤40%已损+回血25%'},fusion:true,harmony:true,paths:['sheng','you']},
fz_danlu:{name:'三昧丹炉',path:'huo',q:'宝',icon:'⚗️',god:'火灵+世良',desc:'一炉三昧，是药七分火。',stat:{hp:30,atk:6,def:6},passive:{healShield:0.10,labels:['药水治疗额外+10%']},active:{name:'一炉三昧',type:'nukeHeal',cost:26,cd:3,mult:2.20,heal:0.25,burnPct:0.40,burnRounds:2,desc:'220%攻击+回血25%+灼烧2回合(40%)'},fusion:true,harmony:true,paths:['huo','sheng']}
};
/* 融合配方：ch=配方可见章节（主线现三章，全部落在 1~3）；src=quest 的可由支线奖励提前解锁（grantRecipe）
   材料获取通路：任务直给 / 神明好感升档相赠 / 凶丹·妖丹炼化随机出宝/仙品格 */
const FUSIONS=[
{out:'fz_xianfeng',in:['b_santan','b_wusheng'],cost:1200,rate:0.60,src:'shop',ch:1},
{out:'fz_zhuihun',in:['y_wuchang','y_zhongkui'],cost:1000,rate:0.55,src:'shop',ch:1},
{out:'fz_danlu',in:['h_huoling','s_yaowang'],cost:900,rate:0.45,src:'quest',ch:1},
{out:'fz_liujia',in:['f_tianwang','f_xuannv'],cost:1200,rate:0.55,src:'shop',ch:2},
{out:'fz_wanya',in:['h_zhurong','h_luoxuan'],cost:1600,rate:0.55,src:'shop',ch:2},
{out:'fz_niepan',in:['h_huaguang','h_zhuque'],cost:1200,rate:0.55,src:'quest',ch:2},
{out:'fz_lianyu',in:['y_cuijue','h_luoxuan'],cost:1500,rate:0.40,src:'quest',ch:2},
{out:'fz_cihangduhai',in:['s_mazu','s_bixia'],cost:1000,rate:0.60,src:'shop',ch:2},
{out:'fz_qitian',in:['b_douzhan','b_bingzhu'],cost:1800,rate:0.50,src:'quest',ch:3},
{out:'fz_fumo',in:['f_leizu','f_zhenwu'],cost:1800,rate:0.50,src:'quest',ch:3},
{out:'fz_zhongshen',in:['y_yanluo','y_fengdu'],cost:1800,rate:0.50,src:'quest',ch:3},
{out:'fz_suopo',in:['s_guanyin','s_dizang'],cost:1800,rate:0.50,src:'quest',ch:3},
{out:'fz_tianbing',in:['b_douzhan','f_zutianshi'],cost:1500,rate:0.40,src:'quest',ch:3},
{out:'fz_sheshen',in:['s_dizang','y_mengpo'],cost:800,rate:0.25,src:'quest',ch:3}
];

const ENEMIES = {
  youhun: {
    name: '游魂',
    icon: 'youhun',
    tint: '#cbd5e1',
    kind: 'hun',
    tier: 1,
    hp: 70,
    atk: 14,
    def: 2,
    weak: ['you', 'huo'],
    resist: { bing: 0.3 },
    intent: 'qiang',
    traits: {
      tags: ['教学杂兵'],
      special: '死亡播残烟；三只成群时10%概率呜咽使玩家当回合攻击MISS'
    },
    pill: null,
    hpLabel: '魂力',
    deathFx: '残烟消散',
    shell: false
  },
  zhisha: {
    name: '纸煞',
    icon: 'zhisha',
    tint: '#e5e7eb',
    kind: 'hun',
    tier: 1,
    hp: 85,
    atk: 16,
    def: 3,
    weak: ['you', 'huo'],
    resist: { bing: 0.3 },
    intent: 'shou',
    traits: {
      tags: ['易燃', '壳神余灰'],
      burnHit: 1,
      burnPct: 0.3,
      special: '易燃：受灼烧即蔓延，持续+1回合；死亡散成纸灰，对同场敌人附加易伤1回合'
    },
    pill: null,
    hpLabel: '魂力',
    deathFx: '散成纸灰',
    shell: false
  },
  ligui: {
    name: '厉鬼',
    icon: 'ligui',
    tint: '#22d3ee',
    kind: 'gui',
    tier: 2,
    hp: 170,
    atk: 26,
    def: 5,
    weak: ['fa', 'sheng'],
    resist: { you: 0.2 },
    intent: 'qiang',
    traits: {
      tags: ['残血狂暴', '超度可解'],
      enrage: { below: 0.4, atkMul: 1.3, clearBy: 'sheng' }
    },
    pill: 'gui',
    hpLabel: '魂力',
    deathFx: '怨气散去',
    shell: false
  },
  guiwang: {
    name: '鬼王',
    icon: 'guiwang',
    tint: '#0891b2',
    kind: 'gui',
    tier: 3,
    hp: 620,
    atk: 58,
    def: 14,
    weak: ['fa', 'sheng'],
    resist: { you: 0.2 },
    intent: 'mixed',
    traits: {
      tags: ['两阶段', '号令打断', '枉死城账册'],
      phases: 2,
      crit: 0.1,
      special: 'HP60%进入鬼王升座，唤小鬼两只(同游魂，替死一次)，本回合守势；号令蓄力两回合成则全体强攻+震骇玩家1回合，须雷控打断'
    },
    pill: 'gui',
    hpLabel: '魂力',
    deathFx: '鬼座崩塌',
    shell: false
  },
  changgui: {
    name: '伥鬼',
    icon: 'changgui',
    tint: '#67e8f9',
    kind: 'gui',
    tier: 1,
    hp: 95,
    atk: 15,
    def: 4,
    weak: ['fa', 'sheng'],
    resist: { you: 0.2 },
    intent: 'shou',
    traits: {
      tags: ['辅助妖类', '超度反转'],
      special: '引途：本回合不攻击，给同场妖类标强攻并使其下次强攻+25%；被虎类/妖类吞噬可为主怪回复8%最大生命；生息净化后反戈一回合'
    },
    pill: 'gui',
    hpLabel: '魂力',
    deathFx: '醒悟消散',
    shell: false
  },
  yehu: {
    name: '野狐',
    icon: 'yehu',
    tint: '#22c55e',
    kind: 'yao',
    tier: 1,
    hp: 105,
    atk: 18,
    def: 4,
    weak: ['bing', 'fa'],
    resist: { you: 0.2 },
    intent: 'shou',
    traits: {
      tags: ['闪避', '借香'],
      dodge: 0.3,
      regen: { pct: 0.05 }
    },
    pill: 'danmo',
    hpLabel: '妖力',
    deathFx: '狐影遁散',
    shell: false
  },
  bifang: {
    name: '毕方',
    icon: 'bifang',
    tint: '#f97316',
    kind: 'yao',
    tier: 2,
    hp: 260,
    atk: 34,
    def: 8,
    weak: ['bing', 'fa'],
    resist: { you: 0.2 },
    intent: 'xu',
    traits: {
      tags: ['灼烧', '蓄力打断'],
      burnHit: 0.35,
      burnPct: 0.3,
      stunImmune: '一足立地，震骇跳过不超过1回合；被兵系重击破防时DEF归零一回合',
      special: '讹火：攻击35%附带灼烧3回合；蓄力满放一城讹火群伤，须雷法打断蓄力'
    },
    pill: 'dan',
    hpLabel: '妖力',
    deathFx: '青羽坠地',
    shell: false
  },
  dengyou_shu: {
    name: '灯油鼠群',
    icon: 'dengyou_shu',
    tint: '#a3a380',
    kind: 'yao',
    tier: 1,
    hp: 105,
    atk: 18,
    def: 4,
    weak: ['bing', 'fa'],
    resist: { you: 0.2 },
    intent: 'shou',
    traits: {
      tags: ['闪避', '群涌'],
      dodge: 0.3,
      regen: { pct: 0.05 }
    },
    pill: 'danmo',
    hpLabel: '妖力',
    deathFx: '鼠窜四散',
    shell: false
  },
  qieyou_shu: {
    name: '窃油鼠君',
    icon: 'qieyou_shu',
    tint: '#d97706',
    kind: 'yao',
    tier: 2,
    hp: 260,
    atk: 34,
    def: 8,
    weak: ['bing', 'fa'],
    resist: { you: 0.2 },
    intent: 'xu',
    traits: {
      tags: ['油滑', '蓄力打断'],
      burnHit: 0.35,
      burnPct: 0.3,
      stunImmune: '油身滑溜，震骇跳过不超过1回合；被兵系重击破防时DEF归零一回合',
      special: '油火：攻击35%附带灼烧3回合；蓄力满喷一城油火群伤，须雷法打断蓄力'
    },
    pill: 'dan',
    hpLabel: '妖力',
    deathFx: '油鼠瘫倒',
    shell: false
  },
  dafeng: {
    name: '大风',
    icon: 'dafeng',
    tint: '#38bdf8',
    kind: 'yao',
    tier: 2,
    hp: 240,
    atk: 38,
    def: 6,
    weak: ['bing', 'fa'],
    resist: { you: 0.2 },
    intent: 'qiang',
    traits: {
      tags: ['吹飞增益', '高闪'],
      dodge: 0.2,
      special: '罡风：强攻30%概率吹飞玩家增益(护盾/强攻标记)；非蓄力回合闪避+20%，被雷法命中坠羽清零两回合；火德对其伤害+25%'
    },
    pill: 'dan',
    hpLabel: '妖力',
    deathFx: '风羽碎裂',
    shell: false
  },
  bashe: {
    name: '巴蛇',
    icon: 'bashe',
    tint: '#15803d',
    kind: 'yao',
    tier: 3,
    hp: 720,
    atk: 60,
    def: 22,
    weak: ['bing', 'fa'],
    resist: { you: 0.2 },
    intent: 'shou',
    traits: {
      tags: ['吞噬', '毒', '破腹'],
      poison: 0.25,
      special: '吞象之腹：玩家HP首次低于30%触发吞噬，1回合不能行动且持续中毒，腹内重击/易伤可破腹；三年骨：蓄力重击'
    },
    pill: 'wang',
    hpLabel: '妖力',
    deathFx: '蛇蜕腐解',
    shell: false
  },
  jiuying: {
    name: '九婴',
    icon: 'jiuying',
    tint: '#dc2626',
    kind: 'yao',
    tier: 3,
    hp: 680,
    atk: 66,
    def: 16,
    weak: ['bing', 'fa'],
    resist: { you: 0.2 },
    intent: 'xu',
    traits: {
      tags: ['九头水火', '雷导电'],
      phases: 9,
      burnHit: 0.4,
      poison: 0.4,
      special: '九首轮替：四水头(毒)、四火头(灼烧)、一主首；每掉20%HP斩一首，对应异常手段少一种；主首存活时每三回合水火相激(灼烧+中毒叠加)；雷法打水头可连电相邻两首'
    },
    pill: 'wang',
    hpLabel: '妖力',
    deathFx: '九首焚散',
    shell: false
  },
  xiangliu: {
    name: '相柳',
    icon: 'xiangliu',
    tint: '#166534',
    kind: 'yao',
    tier: 3,
    hp: 740,
    atk: 62,
    def: 18,
    weak: ['bing', 'fa'],
    resist: { you: 0.2 },
    intent: 'qiang',
    traits: {
      tags: ['毒沼叠层', '削藩犁'],
      poison: 0.03,
      special: '九丘血：场地毒泽，玩家每回合开始受最大生命3%毒伤，层数随回合叠加，生息净化清一层；不毛之血：死亡留三回合毒沼；主首被控时其余八首有概率代承受'
    },
    pill: 'wang',
    hpLabel: '妖力',
    deathFx: '毒血溃地',
    shell: false
  },
  wuzhiqi: {
    name: '无支祁',
    icon: 'wuzhiqi',
    tint: '#a16207',
    kind: 'yao',
    tier: 3,
    hp: 700,
    atk: 70,
    def: 16,
    weak: ['bing', 'fa'],
    resist: { you: 0.2 },
    intent: 'qiang',
    traits: {
      tags: ['高强攻', '可和解'],
      dodge: 0.3,
      special: '九象之力：强攻命中击退玩家节奏(主动技冷却+1回合)；辨水：守势回合闪避+30%，雷法蓄力时预判闪避需先易伤/震骇锁；HP50%触发锁铃自困一回合换DEF翻倍(破防窗口)'
    },
    pill: 'wang',
    hpLabel: '妖力',
    deathFx: '金铃坠响',
    shell: false
  },
  jiuweihu: {
    name: '九尾狐',
    icon: 'jiuweihu',
    tint: '#eab308',
    kind: 'yao',
    tier: 3,
    hp: 560,
    atk: 52,
    def: 12,
    weak: ['bing', 'fa'],
    resist: { you: 0.2 },
    intent: 'shou',
    traits: {
      tags: ['幻术三问', '妲己残魂'],
      special: '青丘幻术：开战造三条残影，仅一条本体，打错受反噬，火德照影/玄法勘破/三问可识破；摄心蓄力成则玩家操作目标错乱，震骇可打断；HP30%触发妲己残魂对话'
    },
    pill: 'wang',
    hpLabel: '妖力',
    deathFx: '九尾化烟',
    shell: false
  },
  hundun: {
    name: '混沌',
    icon: 'hundun',
    tint: '#fbbf24',
    kind: 'xiong',
    tier: 4,
    hp: 1050,
    atk: 75,
    def: 30,
    weak: ['bing', 'fa'],
    resist: {},
    intent: 'mixed',
    traits: {
      tags: ['意图延迟', '学技反弹'],
      stunImmune: '六足四翼，震骇只持续半效(减伤行动，不跳过)',
      special: '无面目：读招提示延迟一回合显示，玄法勘破可提前揭示意图；识歌舞：玩家主动技命中后下一回同类技能被反弹30%，技能需轮换'
    },
    pill: 'xiong',
    hpLabel: '妖力',
    deathFx: '无窍自解',
    shell: false
  },
  qiongqi: {
    name: '穷奇',
    icon: 'qiongqi',
    tint: '#b91c1c',
    kind: 'xiong',
    tier: 4,
    hp: 1000,
    atk: 82,
    def: 26,
    weak: ['bing', 'fa'],
    resist: {},
    intent: 'mixed',
    traits: {
      tags: ['提示反转', '赏恶罚善'],
      special: '颠倒善恶：周期性反转玩家增益/减益体感提示(显示强攻实为守势等)，玄法清心/生息净化可解除一次；噬忠信：玩家用护盾/治疗/援护时它下次攻击+40%，攻击它反而讨喜；猬毛/虎翼两形态'
    },
    pill: 'xiong',
    hpLabel: '妖力',
    deathFx: '毛翼倒伏',
    shell: false
  },
  taowu: {
    name: '梼杌',
    icon: 'taowu',
    tint: '#7f1d1d',
    kind: 'xiong',
    tier: 4,
    hp: 1150,
    atk: 70,
    def: 34,
    weak: ['bing', 'fa'],
    resist: {},
    intent: 'shou',
    traits: {
      tags: ['控制递减', '防御累进'],
      trueOnly: true,
      special: '难训：所有控制(震骇/雷控/易伤)持续时间减半，绝不受第二次同类异常；傲狠：HP越低DEF越高(70%/40%/20%三档+10%/+25%/+45%)，唯固定值真实伤害与妖丹之力破防；一丈八尺尾蓄力附带击退清空玩家神力'
    },
    pill: 'xiong',
    hpLabel: '妖力',
    deathFx: '傲尾垂地',
    shell: false
  },
  taotie: {
    name: '饕餮',
    icon: 'taotie',
    tint: '#991b1b',
    kind: 'xiong',
    tier: 4,
    hp: 950,
    atk: 80,
    def: 24,
    weak: ['bing', 'fa'],
    resist: {},
    intent: 'qiang',
    traits: {
      tags: ['吞万物', '终吞己身'],
      phases: 3,
      special: '贪于饮食：吞噬玩家召唤物/护盾(吞盾回血)/灼烧中毒等异常(按强度回血)，不能吞震骇；有首无身：吞噬满三层后吞己，HP上限-15%但ATK+35%全场强攻，最多三次后虚弱(易伤常驻)；目在腋下：常规暴击效率-20%'
    },
    pill: 'xiong',
    hpLabel: '妖力',
    deathFx: '鼎纹崩解',
    shell: false
  },
  xingtian: {
    name: '刑天',
    icon: 'xingtian',
    tint: '#f59e0b',
    kind: 'zhan',
    tier: 4,
    hp: 1100,
    atk: 95,
    def: 22,
    weak: ['bing', 'you'],
    resist: {},
    intent: 'qiang',
    traits: {
      tags: ['免震骇', '干戚追击'],
      phases: 2,
      stunImmune: '无首，震骇类效果完全无效；易伤有效',
      special: '干戚之舞：玩家每用一次主动技，它立即追加60%攻击的追击；HP40%进入舞干戚，攻+25%防-20%，纯强攻模式，DPS检测'
    },
    pill: 'xiong',
    hpLabel: '战魂',
    deathFx: '干戚落地',
    shell: false
  },
  chiyou: {
    name: '蚩尤',
    icon: 'chiyou',
    tint: '#fbbf24',
    kind: 'zhan',
    tier: 5,
    hp: 1800,
    atk: 112,
    def: 38,
    weak: ['bing', 'you'],
    resist: {},
    intent: 'qiang',
    traits: {
      tags: ['兵主', '大雾', '两阶段'],
      phases: 2,
      stunImmune: '战神心胆，震骇不超过1回合',
      special: '兵主：全场兵伐系效果(强攻/暴击)伤害+20%；铜头铁额：阶段一DEF极高需易伤+破防，HP60%卸甲阶段二DEF减半ATK+40%；五兵之雾蓄力成则三回合内玩家看不到它的意图，勘破可破'
    },
    pill: 'bingzhu',
    hpLabel: '战魂',
    deathFx: '兵主散雾',
    shell: false
  },
  xishenxiaoli: {
    name: '失神小吏',
    icon: 'xishenxiaoli',
    tint: '#fde68a',
    kind: 'ke',
    tier: 1,
    hp: 150,
    atk: 15,
    def: 20,
    weak: ['you'],
    resist: {},
    intent: 'shou',
    traits: {
      tags: ['神位减伤教学'],
      divineReduce: 0.5,
      special: '神位减伤：所有常规伤害-50%，真实伤害/妖丹斩神/percent技不受影响；空：攻击间隙僵住一回合喃喃报神职，该回合守势；无掉落或仅神格碎末1'
    },
    pill: null,
    hpLabel: '魂力',
    deathFx: '木牌坠地',
    shell: true
  },
  kongqipanguan: {
    name: '空壳判官',
    icon: 'kongqipanguan',
    tint: '#fcd34d',
    kind: 'ke',
    tier: 3,
    hp: 640,
    atk: 68,
    def: 26,
    weak: ['you'],
    resist: {},
    intent: 'xu',
    traits: {
      tags: ['远程朱批', '断线窗口'],
      phases: 2,
      divineReduce: 0.4,
      special: '神位减伤常规-40%；代笔：所有攻击由天庭远程执笔，朱批凌空蓄力后笔落为真实伤害(无视玩家护盾)，只能闪避或震骇执笔的线；HP50%朱线断裂，瘫软两回合易伤+无神位减伤(唯一全力输出窗口)，随后重连ATK+20%'
    },
    pill: null,
    hpLabel: '魂力',
    deathFx: '朱线断裂',
    shell: true
  },
  wenyoujie: {
    name: '假面天君·温有节',
    icon: 'wenyoujie',
    tint: '#fbbf24',
    kind: 'ke',
    tier: 4,
    hp: 850,
    atk: 70,
    def: 30,
    weak: ['you'],
    resist: {},
    intent: 'mixed',
    traits: {
      tags: ['两阶段', '公文战法'],
      phases: 2,
      divineReduce: 0.5,
      special: '阶段一天曹主事：HP850/ATK70/DEF30，公文战法以工单形式提前一回合送达——驳回(封印主动技2回合)、记过(三次本场攻-20%)、发还原籍(清空神力)，守势偏好；阶段二假面撕脸：满状态复活HP650/ATK88/DEF18，神位减伤消失，普攻连击，免疫震骇一次/三回合，召唤失神小吏两只，强攻偏好'
    },
    pill: null,
    hpLabel: '魂力',
    deathFx: '假面撕落',
    shell: true
  },
  xiangye: {
    name: '相爷',
    icon: 'xiangye',
    tint: '#a3a3a3',
    kind: 'ke',
    tier: 5,
    hp: 2200,
    atk: 105,
    def: 36,
    weak: ['you'],
    resist: {},
    intent: 'mixed',
    traits: {
      tags: ['S级剧情战', '留接口'],
      boss: true,
      interfaceOnly: true,
      divineReduce: 0.5,
      special: '本体不交手，剧情战接口'
    },
    pill: null,
    hpLabel: '魂力',
    deathFx: '文书散尽',
    shell: true
  }
};

/* ---- 借名小怪独立化：任务树 43 个具名怪（属性克隆自通用 id，立绘各自独立） ----
   [新id, 源id, 显示名]；战斗数值沿用源模板，icon 指向自有立绘 key */
const ENEMY_CLONES = [
  ['wuyeyehun','youhun','无业野魂'],
  ['tiangengzhinianhun','youhun','田埂执念魂'],
  ['maopaijiachai','youhun','冒牌假差'],
  ['guanzhongnihun','youhun','管中溺魂'],
  ['chidietaohun','youhun','持牒逃魂'],
  ['taoyiheichai','zhisha','逃役黑差'],
  ['huolingtongzi','zhisha','火灵童子'],
  ['moguigui','zhisha','墨柜鬼'],
  ['keshenkuilei','kongqipanguan','壳神傀儡'],
  ['guanshen','kongqipanguan','冠神'],
  ['huanzhongzhuyi','kongqipanguan','幻中朱衣'],
  ['tiancaitiefang','kongqipanguan','天曹贴房'],
  ['bixingqiaoshou','kongqipanguan','赑屃形壳兽'],
  ['fengtiaohegui','kongqipanguan','封条化形·合规'],
  ['kongmaogongcao','kongqipanguan','空卯功曹'],
  ['daibanpuzhanggui','kongqipanguan','点卯代办铺掌柜'],
  ['bianzhishou','kongqipanguan','编制兽'],
  ['juanxiansheng','kongqipanguan','卷先生'],
  ['huishoushi','kongqipanguan','天曹回收使'],
  ['zhouxuntiying','kongqipanguan','昼巡替影'],
  ['renzhengkeli','kongqipanguan','认证壳吏'],
  ['heguimoshou','kongqipanguan','合规模兽'],
  ['fanshiyinchai','changgui','反噬阴差'],
  ['yigui','changgui','疫鬼'],
  ['jianhanhanqiu','changgui','减函悍囚'],
  ['shengyouxiaocheli','xishenxiaoli','省油小车吏'],
  ['tiankukugui','xishenxiaoli','天库库鬼'],
  ['gongdaotianchai','xishenxiaoli','贡道天差'],
  ['zhaoansuiyuan','xishenxiaoli','招安随员'],
  ['gongyunxingli','xishenxiaoli','公允星吏'],
  ['qiwei','xishenxiaoli','契卫'],
  ['huishouxiaoli','xishenxiaoli','回收小吏'],
  ['xunyeqiwei','xishenxiaoli','巡夜契卫'],
  ['chizhengxuhao','xishenxiaoli','持证虚耗'],
  ['lipeiqichai','xishenxiaoli','理赔契差'],
  ['zhengshuichaiding','xishenxiaoli','征水差丁'],
  ['kuzhankuzu','xishenxiaoli','库栈库卒'],
  ['yujingshao','dafeng','鱼精哨'],
  ['xunfengguai','dafeng','巽风怪'],
  ['bailangjiaojiang','bashe','白浪蛟将'],
  ['jiaowang','jiuying','蛟王'],
  ['guishexuanjiajiang','hundun','龟蛇玄甲将'],
  ['wangsiguiwang','guiwang','枉死鬼王']
];
ENEMY_CLONES.forEach(([id,base,name])=>{
  ENEMIES[id]=Object.assign({},ENEMIES[base],{name,icon:id});
});

/* 敌人登场判语：id -> 一句杀机黑话（登场卷专用，贴合空心化志怪与黑色幽默） */
const ENEMY_DREAD = {
  youhun:        '死了没人祭，连自己怎么死的都忘了——可它还记得，活人是热的。',
  zhisha:        '烧给死人的纸扎，烧了一半。剩下那半张脸，不知怎么长成了你的模样。',
  ligui:         '怨气沤了几十年，牙比记性长。血味一近，它就不哭了。',
  guiwang:       '枉死城的账，从不找死人算。它今日升了座，要拿你平这一笔。',
  changgui:      '被虎吃了的，便替虎引路。它笑着给你指方向时，你已经在虎嘴里了。',
  yehu:          '偷过半截供香，修出一条尾巴。索命的本事不大，逃命的道行不浅。',
  bifang:        '一足之鸟，行处有讹火。它不落树——只落在将要烧起来的城上。',
  dengyou_shu:   '灯油见底，窸窣声就响了。一盏灯的油，够这群耗子过个好年。',
  qieyou_shu:    '顶着偷来的油瓶，满身滑腻。火都点不着的东西，偏最爱玩火。',
  dafeng:        '风过去，人还站着，魂已被吹到了邻县。',
  bashe:         '吞象三年，才吐得出骨。你这一把，不够它垫腹。',
  jiuying:       '九张脸同哭同笑，一边吐水一边喷火。它哭百日，赤地千里。',
  xiangliu:      '九首过处，土黑谷枯。它的血渗进地里，青草都要烂上三年。',
  wuzhiqi:       '禹王锁过它一回。铁链磨细了，它的力气还没老。',
  jiuweihu:      '几道残影里只一条是真的。等你认出真身，心已经不是你自己的了。',
  hundun:        '无眼无耳，也无七窍。所以你下一步要做什么，它倒先学会了。',
  qiongqi:       '闻人斗则食直者，闻人忠信则啮其鼻。你越是个好人，它越欢喜。',
  taowu:         '受过训的都死了。它蹲在那里，像一座长了獠牙的山。',
  taotie:        '有首无身，食人未咽，害及其身——它连自己都吞，何况是你。',
  xingtian:      '帝断其首，葬之常羊之野。它以乳为目、以脐为口，干戚还在舞。',
  chiyou:        '铜头铁额，兵主之君。大雾一起，你连自己的手都看不清。',
  xishenxiaoli:  '神早走了，班还得上。它念着没人接的职衔，一笔一划来索命。',
  kongqipanguan: '里头的人早走了，袍子还在照常办公——朱线凌空，一笔落判。',
  wenyoujie:     '驳回、记过、发还原籍。笑脸底下那张脸，神衙的老差都不敢认。',
  xiangye:       '满朝朱紫，半出其门。他不亲自动手——一纸文书，够人死三回。',
};
/* 43 个独立化具名怪的登场判语 */
Object.assign(ENEMY_DREAD,{
  wuyeyehun:       '死了还在找活儿干。它拦你不为索命，只想问问——阴间还招不招临时工。',
  tiangengzhinianhun:'脚陷进田埂几十年，拔不出来的不是脚，是那口没咽的气。',
  maopaijiachai:   '一身借来的差服，锁链是真的，腰牌是假的——它自己都快信了。',
  guanzhongnihun:  '从井管里往上看，天就铜钱那么大。它想把你也拖进来，一起看那么大的天。',
  chidietaohun:    '牒文攥得稀烂也不肯撒手。跑了半辈子，没跑出那道朱批。',
  taoyiheichai:    '黑衣皂帽，专逃苦役。它拿链子锁人，是怕有人逃得比它还远。',
  huolingtongzi:   '纸扎的童子沾了香火，活了。它一笑，脚下莲火就窜起三尺高。',
  moguigui:        '长年泡在公文案牍的墨里，脸黑得只剩两只眼，开口一股陈墨味。',
  keshenkuilei:    '提线早断了，它还在磕头。壳里没人，是规矩替它动着。',
  guanshen:        '金冠悬空，下头无人。冠一旦戴上，就再也摘不下来。',
  huanzhongzhuyi:  '一袭朱衣在雾里自行走动，穿它的人，三百年前就化了灰。',
  tiancaitiefang:  '满墙卷宗贴成了窝。它不咬人，只把你的名字也往上贴。',
  bixingqiaoshou:  '驮碑驮成了碑的模样，壳上刻的，全是别人的功过。',
  fengtiaohegui:   '封条层层裹出的人形，张口闭口"合规"，动一下先盖三个章。',
  kongmaogongcao:  '卯时点了个空名，功曹就此空着。它最恨把名字填得满满当当的人。',
  daibanpuzhanggui:'代点卯、代画押、代受过——代价是，连你这个人也一并代办了。',
  bianzhishou:     '为一个编制长出了獠牙。谁动它的名额，它咬谁。',
  juanxiansheng:   '一卷会走路的文牍，自称先生。讲规矩能讲三天，讲到你断气。',
  huishoushi:      '手持天曹回收令，连人带魂带旧账，一并打包收回。',
  zhouxuntiying:   '白天巡街的是它，影子替它巡。你看见它时，影已到了你身后。',
  renzhengkeli:    '浑身挂满认证牌，少一个章，它就不认你是个人。',
  heguimoshou:     '规矩养大的兽，每道坎都卡得方方正正，连吃人都要先走完流程。',
  fanshiyinchai:   '被上头反咬过的差役，如今专咬差役，锁链上还挂着半块腰牌。',
  yigui:           '一身时疫黑气，走到哪儿瘟到哪儿，自己却瘦得像把枯柴。',
  jianhanhanqiu:   '卷宗被减掉三页，它就越三回狱。悍不畏死，只求一个全尸的说法。',
  shengyouxiaocheli:'推着省油小车，账算到一滴灯油。它收的不是油，是你的命数。',
  tiankukugui:     '守着天库的穷鬼，库里金山银海，它连根灯草都摸不着。',
  gongdaotianchai: '押贡上天的差官，脸比贡箱还沉，过手的东西都要刮下三层。',
  zhaoansuiyuan:   '受了招安的妖来当随员，妖气未散，官威倒先学了个十成。',
  gongyunxingli:   '自称公允的星边小吏，秤是歪的、星是斜的，偏还一脸正经。',
  qiwei:           '契文化成的卫卒，刀就是那支笔，劈下来先叫你画个押。',
  huishouxiaoli:   '专管回收旧物旧魂。在它眼里，你也不过是一件到了期的东西。',
  xunyeqiwei:      '夜里巡更的契卫，梆子一响，魂得自己排好队等它点。',
  chizhengxuhao:   '虚耗成精偏考了个证，偷你东西前先亮证，好叫你心服口服。',
  lipeiqichai:     '管理赔的差，单子填得越快你赔得越多，末了反倒欠它一笔。',
  zhengshuichaiding:'连孟婆的汤都要征个水钱。它一到，井里的水都自认倒霉。',
  kuzhankuzu:      '库栈搬货的老卒，背压弯了还在搬——搬的全是别人的寿数。',
  yujingshao:      '鱼精里的探哨，鳃上挂着风干的盐，换气比报信还快。',
  xunfengguai:     '巽位生的风怪，来无影去无踪，卷走东西时还留个旋儿笑你。',
  bailangjiaojiang:'白浪里杀出的蛟将，鳞甲未全、杀心已盛，一浪掀翻半条船。',
  jiaowang:        '九头之尊，蛟里称王。它不吐水火时，一江的水都是倒着流的。',
  guishexuanjiajiang:'龟蛇相缠化成的玄甲将军，刀砍一道白印，水淹不进它的甲缝。',
  wangsiguiwang:   '枉死城王座上的那位，一城的枉死都堵在它胸口，只等一个公道。'
});

/* ================= 妖鬼收集录·档案故事 =================
   id -> 一段志怪小传（登场判语讲杀机，此处讲来历）；分组取 ENEMIES.kind */
const ENEMY_LORE = {
  /* —— 妖部原型：野妖 / 凶兽 / 战魂 —— */
  yehu:      '坟窟里炼成半道的野狐，一袭旧衫、两撇假笑，最会扮过路的书生、迷路的娘子。你若贪它那点温存，醒来怀里只剩一捧白毛。',
  bifang:    '独脚青身的火鸟，所到之处城邑失火、赤地千里。它倒不是成心作恶，只是这世道太冷，它想给自己寻个暖处落脚——一落脚，便是一场大火。',
  dengyou_shu:'义庄长明灯下啃灯油的鼠群，吃油吃成了精，黑压压一片。长明灯一灭，尸首就要变，所以它们比谁都盼着天黑。',
  qieyou_shu:'鼠群里修出气候的那只，披一件偷来的油布马甲，自封"窃油鼠君"。它单枪匹马也敢上供桌，盗的是油，卖的是给死人点灯的差事。',
  dafeng:    '行如一道卷人的狂飙，过处村寨掀顶、人畜腾空。风里那阵呜呜的响，是被它卷上天的人，还在云里头喊救命。',
  bashe:     '能吞象的巨蟒，三年才吐出骨头。它盘在云梦泽深处，腹中小山似的，全是过往的舟客与象群——它不挑嘴，它只是太饿。',
  jiuying:   '九头蛇身的水火凶怪，九张嘴同时喷火吐水，半城焦土半城泽国。九个头各有各的脾气，吵起架来，先淹先烧的，往往是自己脚下。',
  xiangliu:  '九首蛇身、共工之臣，所过之处尽成腥臭泽国，沾土即毒。它一颗头被斩，又长出两颗；禹王镇它的台，至今还压着，不敢松一口气。',
  wuzhiqi:   '淮水水怪，形如猿猴、金目雪牙，兴风作浪锁尽镇水神兽。大禹拿铁索穿了它的锁骨压在龟山下——它不闹了，只是每逢打雷，那山都要晃三晃。',
  jiuweihu:  '青丘九尾的大妖，一尾一条命、一尾一副心肠。它笑起来能倾一座国，可你永远数不清，那九条尾巴里，究竟哪一条是真心。',
  hundun:    '四凶之一，无面无目、六足四翼，通歌舞、识人情，却专把善意喂狗、把恶人捧上天。它最见不得"规矩"二字，谁讲道理，它先吞了谁。',
  qiongqi:   '四凶之一，胁生双翼、能通人言，专在人争斗时扑下去，一口吃了有理的那个，再叼块肉去喂行凶的。在它那儿，黑心的，才是香的。',
  taowu:     '四凶之一，状如猛虎、獠牙长尾，油盐不进、软硬不吃，认准的死理九头牛都拉不回。它最大的乐子，是把好端端的局搅烂，还赖你活该。',
  taotie:    '四凶之一，羊身人面、目在腋下、有首无身，贪吃到把自己的身子都咽了，只剩一张大嘴。天下没它不敢下口的，到末了，它连自己都没饶过。',
  xingtian:  '与帝争神、被斩去头颅的战魂，以乳为目、以脐为口，操干戚而舞，至死不休。头可断、志不可夺——它舞给老天爷看，也舞给每一个不认命的人看。',
  chiyou:    '铜头铁额、食沙石子的兵主，驱应龙、召大雾，与轩辕战于涿鹿之野。他败了，可他锻的刀兵、那口不服的气，从此留在了人间每一场造反里。',
  /* —— 鬼部原型：游魂 / 阴鬼 / 空壳神僚 —— */
  youhun:    '阳寿未尽便横死的生魂，无人超度、无人祭扫，只在荒坟破庙间漂着。它记不得自己怎么死的，只记得活人身上那点热气，想凑过来暖一暖。',
  zhisha:    '纸扎铺烧给死人的童男童女、轿马仆从，沾了香火执念便成煞。它一身纸糊的命，怕火怕水，最怕的却是被人记起——原来自己只是个替身。',
  ligui:     '含冤而死、怨气冲开喉锁的鬼，锁链上结满它讨过的命，寻常差役近不得身。它要的从来不是偿命，是一句迟到的"你本无错"。',
  guiwang:   '阴司在册、统御一方残魂的鬼王，头戴残冠、麾下小鬼如潮。它生前也是个当差的，死了还在当差——只是这一回，再没人敢欠它的俸。',
  changgui:  '被猛虎凶兽吃掉的人，魂被拘在兽口边，反过来替虎引路诱人。它哭着把你往林子里让，自己也不想，可那条舌头，早不归它管了。',
  xishenxiaoli:'神早走了，班还得上。一个忘了自己死了多少年的小吏，抱着没人接的职衔，夜夜点卯、月月催缴，连索命，都索得一丝不苟。',
  kongqipanguan:'判官连人带魂一起被调走了，只剩这身袍子、这支笔还在照常办公。朱线凌空、一笔落判，它判你有罪，你都找不着那个能听你喊冤的人。',
  wenyoujie: '头顶一张裂了缝的笑脸，专管驳回、记过、发还原籍。笑得多温和，那把刀子就有多稳；神衙的老差见了它，都得把脖子往领子里缩三寸。',
  xiangye:   '满朝朱紫、半出其门的那位。它从不动手，只在卷宗后头轻轻落下一笔——这一笔，够一个人家破人亡三回，末了你还得替它谢主隆恩。',
  /* —— 妖部具名（克隆自野妖 / 凶兽） —— */
  yujingshao:'鱼群里放出来的探哨，鳃上挂着风干的盐花，滑得像条泥鳅。它换气的功夫比报信还快，等你捞起一张空网，大水精的队伍已到了脚后跟。',
  xunfengguai:'生于巽位风口的小精怪，没个正形，来去都是一股旋儿。它卷你帽子、掀你摊子，卷完留个风旋儿在原地打转出你的洋相，自己早笑着跑没影。',
  bailangjiaojiang:'白浪滩头杀出来的蛟将，鳞甲还没长全，杀心却比老蛟还盛。它一抖长枪能掀翻半条渔船，挂在嘴边的就一句："这条河，改收鱼税了。"',
  jiaowang:  '万蛟之王、水府正主，江水见了它都得倒着流。它不兴风作浪时最吓人——江面平得像面镜子，那是它在水底下，睁着眼，一条一条数船。',
  guishexuanjiajiang:'龟蛇相缠、怨气凝出的玄甲将军，一身黑甲，刀砍一道白印、水淹不进甲缝。它本是镇水的镇物，镇着镇着翻了脸：既没人来祭，便都别走了。',
  /* —— 鬼部具名：游魂 —— */
  wuyeyehun: '死后没处挂差、连轮回司都嫌它"无业游魂"不给排队的可怜鬼。它拦路不为索命，只想拦下一个活人，问问阴间那张招工告示，今年还作不作数。',
  tiangengzhinianhun:'累死在自家田埂上的老农，魂就陷进那道泥埂里拔不出来。逢人便问"租子交齐了吗"，你说交齐了，它愣半晌，又问"那明年的呢"。',
  maopaijiachai:'捡了身横死差役的袍子就出来当差的游魂，腰牌是木雕的，锁链是真的。起初只想混口香火，装着装着，连它自己都信了自己真是个爷。',
  guanzhongnihun:'溺在义庄水井管道里的弃魂，从管口往上看，天就铜钱那么大。它想把人也拖进来，不为吃人——一个人看那么大的天，实在看了太多年。',
  chidietaohun:'揣着一纸拘魂牒半路逃了的魂，牒文被攥得稀烂也不肯撒手。它跑了半辈子没敢投胎，怕的不是追它的差役，是牒文末尾那个，它不敢认的名字。',
  /* —— 纸煞 —— */
  taoyiheichai:'生前受不得苦役逃了，死后补进阴司还是逃。它拿链子锁人时手最狠——它锁的哪里是别人，分明是每一个，还敢逃的自己。',
  huolingtongzi:'纸扎铺烧给早夭孩童的莲花童子，沾了三年香火，活了。它赤着脚踩在一盏莲火上，见人就笑；它一笑，铺子后头的纸马纸轿，全跟着一盏盏亮起。',
  moguigui:  '在衙门卷洞窟房的墨缸里泡成精的鬼，一身陈墨、通体乌黑，只剩两只白眼。它翻你卷宗时不吭声，等你凑近了，才闻见一股几百年没散的墨臭。',
  /* —— 空壳神僚 —— */
  keshenkuilei:'供奉的香火一断，提线的神便走了，傀儡还留在原地，日复一日地磕头。壳里空空荡荡，是那些没人接的规矩，替它一下，又一下地动着。',
  guanshen:  '祠堂里那顶最金贵的冠，受了世代跪拜，自己成了神。冠下空空，无人配戴——可只要有人敢把它摘下来，满屋的牌位，都会齐齐睁眼。',
  huanzhongzhuyi:'一件曾裹过三品大员的朱色官袍，主人化了灰，袍子还在雾里自行走动。谁披上它，谁就得替它坐堂，坐到连自己姓什么，都一并忘了。',
  tiancaitiefang:'专管往墙上贴告示的小神僚，贴成了精，满墙卷宗层层叠叠糊成了窝。它不咬人，只是趁你不备，把你的名字，也往那张催命的墙上贴。',
  bixingqiaoshou:'驮了千年碑的赑屃，驮到最后自己也成了一块碑。壳上刻满别人的功过，压得它挪不动步；可它不敢卸——卸了，那些功过，就没处放了。',
  fengtiaohegui:'千百张"不合规"的封条层层裹出来的人形，张口一个流程、闭口一个盖章。它要办你，先让你在自己的逮捕令上，工工整整签三个"已知晓"。',
  kongmaogongcao:'卯时册上被人点了个空名，占了功曹的缺，这位置从此空着成了精。它最恨把名字填得满实的人——你填了，不就显出，它是空的了么。',
  daibanpuzhanggui:'凡界"代办一切"铺子的掌柜，代点卯、代画押、代受过，童叟无欺。等你回过味来，班它上了、日子它过了，连你这个人，都快被它代办干净。',
  bianzhishou:'为争一个天庭编制，硬生生长出獠牙的兽。名额就一个，谁伸手它咬谁；你跟它讲道理，它把编制表拍你脸上——看清楚，这是印。',
  juanxiansheng:'一卷自己会走路的公文，束着腰带、自称先生。它讲起规矩来三天三夜不停，讲到你认罪画押，还贴心地，替你把那个死字都描得工工整整。',
  huishoushi:'持天曹回收令的差官，奉旨回收一切"过期之物"——旧物、旧魂、旧承诺。在它的册子上，你也不过是一件到了期、该打包上缴的东西。',
  zhouxuntiying:'白天替神巡街的影子，巡着巡着，和本体分了家。你当街冲它作揖时，那道本影早贴着墙根，悄没声地，绕到了你身后。',
  renzhengkeli:'浑身上下挂满认证牌、合格章的空壳吏，牌比人还重。你想过它这道门，得先证明你是你；等你证明完了，它又开口："此证，需再认证。"',
  heguimoshou:'规矩一条条喂大的方头巨兽，每道坎都卡得方方正正。它吃人都要先走流程、再报备案，等批文下来你早凉透了——它管这个，叫程序正义。',
  /* —— 阴司鬼类 —— */
  fanshiyinchai:'被上司推出去顶罪、又反咬回来的阴差，锁链上还挂着半块腰牌。如今它专办当差的，一链子一个准，说是"替当年的自己，收点利息"。',
  yigui:     '背负时疫的病鬼，走到哪儿瘟到哪儿，自己却病得只剩一把枯骨。它也不想害人，可它只要一喘气，半个村子的人，就得跟着躺下。',
  jianhanhanqiu:'卷宗被上头"精简"掉三页、凭空多出三条罪的囚魂，于是越了三回狱。它悍不畏死，只求一个全尸的说法——和那三页，被人烧掉的真话。',
  wangsiguiwang:'枉死城王座上那位，一城枉死、满胸块垒，都堵在它一身残破龙袍里。它不滥杀，只要一个公道；可这公道一等几百年，等到它自己，都快忘了公道长什么样。',
  /* —— 空壳神僚·库差胥吏 —— */
  shengyouxiaocheli:'推着一辆吱呀小车专收灯油的小吏，账算到一滴都不肯漏。它收的哪里是油——长明灯里熬着的，明明是点灯人，剩下的那点命数。',
  tiankukugui:'守着天库的穷鬼，身后金山银海、夜明珠当砖，它却连根照明的灯草都摸不着。守了一辈子，最大的愿望，是临死前能正大光明，拿颗珠子压口。',
  gongdaotianchai:'押运贡品上天的差官，脸比贡箱还沉。过手的东西都要刮下三层油，刮完还夸你"识大体"；你敢掉一滴泪，那就是对天庭不敬。',
  zhaoansuiyuan:'受了招安、脱下妖皮换官皮的随员。妖气还没褪净，官威倒学了个十成十，拿着鸡毛当令箭，专挑当年一起落草的兄弟下手。',
  gongyunxingli:'自称最公允的星边小吏，手里一杆秤、心里一本账。可那秤星是斜的、秤砣是偏的，它判你输的时候，偏是一脸的青天白日。',
  qiwei:     '一张夺命契文修成的卫卒，手里的刀就是当年那支笔。它劈你之前先递上契书，你只要一哆嗦按了手印，这一刀，就成了你自己请的。',
  huishouxiaoli:'挨家挨户回收旧物旧魂的小吏，肩上麻袋叮当乱响。在它眼里没什么不能回收，你舍不得给，它便开导你：人嘛，到头来，不也是件旧物。',
  xunyeqiwei:'夜里敲梆巡更的契卫，梆子一响，满街的魂都得自己排好队等它点。你想躲进巷子，一回头——巷口那盏灯底下，它早站那儿，冲你乐了。',
  chizhengxuhao:'虚耗本是偷人财物、耗人喜乐的小妖，它偏考下了"准偷证"。从此偷你东西先亮证、再开票，偷得光明正大，你报案都没处报——人家，合规。',
  lipeiqichai:'管理赔的差人，单子填得比谁都快。你丢了命，它说条款不符；你残了腿，它说证据不足。到末了一算，你一文没拿着，还倒欠它一笔"受理钱"。',
  zhengshuichaiding:'奉旨征水钱的差丁，井水、河水、孟婆汤里的水，样样都要上税。它一来，连井底的蛤蟆都得自认倒霉，乖乖吐出隔夜的那口水钱。',
  kuzhankuzu:'在库栈搬了一辈子货的老卒，背压成了虾还在搬。它搬的那些贴着封条的箱子里，装的全是别人存进来、再没取走过的——寿数。'
};


/* ================= 法宝与礼物 =================
   slot: weapon兵刃 / armor护身 / trinket奇物 / gift礼单（每栏一件，礼单不穿戴）
   grade: 凡品 / 灵品 / 宝品；stat 常驻；proc 战斗特效 */
const SLOT_INFO = {
  weapon:  { name:'兵刃', icon:'刃', desc:'主攻伐，提升攻击与暴击' },
  armor:   { name:'护身', icon:'护', desc:'主守御，提升生命、防御与减伤' },
  trinket: { name:'奇物', icon:'奇', desc:'旁门妙用，回血、锁魂、吸血、点火' },
  gift:    { name:'礼单', icon:'礼', desc:'送与神明结善缘，每位神明每日只受一礼' },
};
const SELL_RATE = 0.5;
const ITEMS = {
  /* 兵刃 */
  pan:    { name:'判官笔', slot:'weapon', grade:'凡品', price:200, icon:'笔', desc:'攻击 +8。朱笔一点，即定生死。', stat:{atk:8} },
  zhan:   { name:'斩妖剑', slot:'weapon', grade:'灵品', price:460, icon:'剑', desc:'攻击 +13，暴击率 +5%。', stat:{atk:13,crit:0.05} },
  fuosuo: { name:'缚妖索', slot:'weapon', grade:'凡品', price:300, icon:'索', desc:'攻击 +9，命中时 12% 概率缚魂，令敌 1 回合不能行动。', stat:{atk:9}, proc:{stun:0.12} },
  xiangmo:{ name:'降魔杵', slot:'weapon', grade:'灵品', price:560, icon:'杵', desc:'攻击 +14，暴击伤害 +25%。雷音寺淘汰下来的旧物，专敲妖魔天灵盖。', stat:{atk:14,critDmg:0.25} },
  chui:   { name:'碎岳锤', slot:'weapon', grade:'宝品', price:780, icon:'锤', desc:'攻击 +20，暴击率 +8%。一锤落下，山灵也要矮三分。', stat:{atk:20,crit:0.08} },
  duannian:{ name:'断念妖刀', slot:'weapon', grade:'宝品', price:840, icon:'刀', desc:'攻击 +19，攻击附带 6% 吸血。刀身低语，劝人放下执念——连同性命一起。', stat:{atk:19,lifesteal:0.06} },
  zhuxian:{ name:'诛仙剑残锋', slot:'weapon', grade:'仙品', price:1500, icon:'锋', desc:'攻击 +28，暴击率 +10%，暴击伤害 +20%。昔年诛仙阵上崩落的一截剑锋，锋刃所指，神魔辟易。（主线第四章后开售）', stat:{atk:28,crit:0.10,critDmg:0.20}, reqChapter:4 },
  /* 护身 */
  jia:    { name:'锁子黄金甲', slot:'armor', grade:'凡品', price:380, icon:'甲', desc:'防御 +10。', stat:{def:10} },
  xuangui:{ name:'玄龟盾佩', slot:'armor', grade:'凡品', price:320, icon:'龟', desc:'防御 +8，神躯上限 +30。玄龟甲磨成的旧佩，厚实可靠。', stat:{def:8,hp:30} },
  pei:    { name:'龟息玉佩', slot:'armor', grade:'灵品', price:520, icon:'佩', desc:'神躯上限 +45。', stat:{hp:45} },
  hanyu:  { name:'寒玉冰绡', slot:'armor', grade:'灵品', price:580, icon:'绡', desc:'神躯上限 +65，防御 +7。鲛人冰蚕丝织就，寒气护体。', stat:{hp:65,def:7} },
  yi:     { name:'八卦紫绶仙衣', slot:'armor', grade:'宝品', price:680, icon:'衣', desc:'受到的所有伤害降低 12%。', proc:{dmgReduce:0.12} },
  longlin:{ name:'龙鳞软甲', slot:'armor', grade:'宝品', price:800, icon:'鳞', desc:'防御 +16，神躯上限 +45。东海龙宫淘汰的护身甲，鳞片还会自己呼吸。', stat:{def:16,hp:45} },
  hechang:{ name:'鹤氅仙裳', slot:'armor', grade:'仙品', price:1400, icon:'氅', desc:'神躯上限 +90，防御 +10，受到的所有伤害降低 14%。云中鹤羽织成，行走间自带仙风。（主线第四章后开售）', stat:{hp:90,def:10}, proc:{dmgReduce:0.14}, reqChapter:4 },
  /* 奇物 */
  tongling:{ name:'阴阳铜铃', slot:'trinket', grade:'凡品', price:260, icon:'铃', desc:'神力上限 +45。铃舌分阴阳两面，摇一摇，神清气爽。', stat:{maxMp:45} },
  chen:   { name:'太乙拂尘', slot:'trinket', grade:'凡品', price:260, icon:'尘', desc:'每场战斗开始时恢复 25% 生命。', proc:{healStart:0.25} },
  suo:    { name:'锁魂链', slot:'trinket', grade:'凡品', price:320, icon:'链', desc:'攻击命中时 18% 概率锁魂，令敌 1 回合不能行动。', proc:{stun:0.18} },
  shihun: { name:'噬魂灯', slot:'trinket', grade:'灵品', price:540, icon:'灯', desc:'勾魂类真实伤害 +12%。灯芯里供着一只不肯投胎的老魂，见谁咬谁。', stat:{trueDmg:0.12} },
  hu:     { name:'聚魂葫芦', slot:'trinket', grade:'灵品', price:560, icon:'葫', desc:'攻击附带 8% 吸血。', stat:{lifesteal:0.08} },
  yin:    { name:'神火印', slot:'trinket', grade:'宝品', price:900, icon:'印', desc:'命中时 30% 概率以火星点燃敌人，2 回合内每回合受你攻击 30% 的灼烧伤害。', proc:{burnOnHit:0.3} },
  kunlun: { name:'昆仑镜', slot:'trinket', grade:'仙品', price:1350, icon:'镜', desc:'神躯上限 +40；每场战斗首次濒死时，镜中仙影替你挡下致命一击并回复 30% 神躯。（主线第四章后开售）', stat:{hp:40}, proc:{firstSave:{heal:0.3}}, reqChapter:4 },
  /* 神明专属套装（非卖品：两件走剧情工单、一件走好感升档相赠；集齐两/三件触发套装特效） */
  gy_dao: { name:'青龙偃月', slot:'weapon', grade:'宝品', price:0, icon:'偃', set:'guanyu', noShop:true, noSell:true,
    desc:'攻击 +20，暴击率 +6%。关帝祠失窃的佩刀模型，刀背錾着一行小字：刀是义气打出来的，钱买不走。' , stat:{atk:20,crit:0.06} },
  gy_pao: { name:'绿锦战袍', slot:'armor', grade:'宝品', price:0, icon:'袍', set:'guanyu', noShop:true, noSell:true,
    desc:'防御 +14，神躯上限 +50。旧年某位将军赠庙的锦袍拆改而成，针脚里还留着一句「替我看着人间」。', stat:{def:14,hp:50} },
  gy_yin: { name:'汉寿亭侯印', slot:'trinket', grade:'宝品', price:0, icon:'印', set:'guanyu', noShop:true, noSell:true,
    desc:'暴击率 +5%，暴击伤害 +15%。印是死的，义是活的——佩它的人，得配得上这两个字。', stat:{crit:0.05,critDmg:0.15} },
  mp_shao:{ name:'忘川汤杓', slot:'weapon', grade:'灵品', price:0, icon:'杓', set:'mengpo', noShop:true, noSell:true,
    desc:'攻击 +13，神力上限 +25。孟婆舀了三千年汤的老杓，柄上包浆比奈何桥的石栏还滑。', stat:{atk:13,maxMp:25} },
  mp_sha: { name:'雾縠汤衣', slot:'armor', grade:'灵品', price:0, icon:'纱', set:'mengpo', noShop:true, noSell:true,
    desc:'神躯上限 +60，防御 +6。驱忘台上的雾气织的，穿上它，别人的闲话记不住，恩情忘不了。', stat:{hp:60,def:6} },
  mp_ling:{ name:'奈桥铃', slot:'trinket', grade:'灵品', price:0, icon:'铃', set:'mengpo', noShop:true, noSell:true,
    desc:'神力上限 +30；每场战斗开始时恢复 20% 生命。桥头挂了三千年的引魂铃，摇一摇，魂就认得回家的路。', stat:{maxMp:30}, proc:{healStart:0.20} },
  zk_jian:{ name:'罚恶剑', slot:'weapon', grade:'宝品', price:0, icon:'罚', set:'zhongkui', noShop:true, noSell:true,
    desc:'攻击 +19，攻击附带 6% 吸血。剑格上刻着半行咬痕——钟判官着急的时候，是真用牙开路的。', stat:{atk:19,lifesteal:0.06} },
  zk_mao:{ name:'罚恶袍', slot:'armor', grade:'灵品', price:0, icon:'皂', set:'zhongkui', noShop:true, noSell:true,
    desc:'防御 +12，神躯上限 +40。罚恶司的皂色官袍改的，袖口还沾着洗不掉的鬼油——钟馗说那是勋章。', stat:{def:12,hp:40} },
  zk_deng:{ name:'噬鬼灯', slot:'trinket', grade:'灵品', price:0, icon:'灯', set:'zhongkui', noShop:true, noSell:true,
    desc:'攻击 +6，暴击率 +4%。灯罩里那只老魂打了三千年的饱嗝，见着恶鬼，比你还先亮。', stat:{atk:6,crit:0.04} },
  /* 第一批高人气神明套装（孙悟空/哪吒/二郎神/观音） */
  sw_gun: { name:'如意金箍棒', slot:'weapon', grade:'仙品', price:0, icon:'箍', set:'sunwukong', noShop:true, noSell:true,
    desc:'攻击 +23，暴击率 +7%。定海神针的原身，重一万三千五百斤——到他手里，不过一根趁手的棍。', stat:{atk:23,crit:0.07} },
  sw_jin: { name:'锁子黄金甲', slot:'armor', grade:'宝品', price:0, icon:'甲', set:'sunwukong', noShop:true, noSell:true,
    desc:'防御 +14，神躯上限 +55。大闹天宫那日穿的旧甲，金线里还嵌着南天门瓦上的灰。', stat:{def:14,hp:55} },
  sw_yu:  { name:'凤翅紫金冠', slot:'trinket', grade:'仙品', price:0, icon:'冠', set:'sunwukong', noShop:true, noSell:true,
    desc:'暴击率 +6%，暴击伤害 +18%。冠上凤翅是老孙自己掰弯的——戴正了，不像他。', stat:{crit:0.06,critDmg:0.18} },
  nz_qiang:{ name:'火尖枪', slot:'weapon', grade:'宝品', price:0, icon:'尖', set:'nezha', noShop:true, noSell:true,
    desc:'攻击 +18，暴击率 +5%。枪尖的火不是烧敌人的，是照路的——三坛海会，路要自己照。', stat:{atk:18,crit:0.05} },
  nz_quan:{ name:'乾坤圈', slot:'armor', grade:'宝品', price:0, icon:'圈', set:'nezha', noShop:true, noSell:true,
    desc:'防御 +13，神躯上限 +45。扔出去能砸山，戴身上是个念想：旧骨还了父，这圈还留着。', stat:{def:13,hp:45} },
  nz_gou: { name:'混天绫', slot:'trinket', grade:'宝品', price:0, icon:'绫', set:'nezha', noShop:true, noSell:true,
    desc:'攻击 +5，神力上限 +20。七尺红绫能搅动东海，也能安安静静系在一个莲花身子的腰上。', stat:{atk:5,maxMp:20} },
  el_jian:{ name:'三尖两刃枪', slot:'weapon', grade:'宝品', price:0, icon:'刃', set:'erlang', noShop:true, noSell:true,
    desc:'攻击 +19，暴击率 +6%。三尖两刃，一尖挑妖，一尖挑怪，还有一尖——挑那些装看不见的。', stat:{atk:19,crit:0.06} },
  el_yin: { name:'银鳞锁甲', slot:'armor', grade:'宝品', price:0, icon:'鳞', set:'erlang', noShop:true, noSell:true,
    desc:'防御 +14，神躯上限 +40。灌江口的水银浸过三年，刀劈不进，宣调不动。', stat:{def:14,hp:40} },
  el_mu:  { name:'天眼符', slot:'trinket', grade:'宝品', price:0, icon:'眸', set:'erlang', noShop:true, noSell:true,
    desc:'暴击率 +5%，暴击伤害 +12%。额上竖眼描下来的符——贴在身上，看什么都比别人多一层。', stat:{crit:0.05,critDmg:0.12} },
  gw_ping:{ name:'净玉瓶', slot:'weapon', grade:'宝品', price:0, icon:'瓶', set:'guanyin', noShop:true, noSell:true,
    desc:'攻击 +14，神力上限 +30。瓶里装的是南海的水，三界谁哭了，瓶面就起一层雾。', stat:{atk:14,maxMp:30} },
  gw_shan:{ name:'月白袈裟', slot:'armor', grade:'宝品', price:0, icon:'裟', set:'guanyin', noShop:true, noSell:true,
    desc:'防御 +12，神躯上限 +60。慈悲不是软——这袭袈裟挡过的刀，比甲胄多。', stat:{def:12,hp:60} },
  gw_liu: { name:'杨柳枝', slot:'trinket', grade:'宝品', price:0, icon:'柳', set:'guanyin', noShop:true, noSell:true,
    desc:'神力上限 +35；每场战斗开始时恢复 15% 生命。蘸一瓶甘露，点在哪儿，哪儿就活。', stat:{maxMp:35}, proc:{healStart:0.15} },
  /* 第三批神明套装：地府判官与民间诸神（C级） */
  cj_bi:  { name:'朱勾判笔', slot:'weapon', grade:'宝品', price:0, icon:'勾', set:'cui_jue', noShop:true, noSell:true,
    desc:'攻击 +20，暴击率 +5%。笔尖的朱砂掺过忘川水，勾下去的名字，抹不掉。', stat:{atk:20,crit:0.05} },
  cj_pao: { name:'阴律皂袍', slot:'armor', grade:'灵品', price:0, icon:'皂', set:'cui_jue', noShop:true, noSell:true,
    desc:'防御 +14，神躯上限 +45。阴律司值夜的老袍，袖口磨薄了，规矩没磨薄。', stat:{def:14,hp:45} },
  cj_ye:  { name:'生死簿页', slot:'trinket', grade:'宝品', price:0, icon:'页', set:'cui_jue', noShop:true, noSell:true,
    desc:'神力上限 +20，暴击伤害 +12%。从簿上揭下的一页空白——留着，比写着值钱。', stat:{maxMp:20,critDmg:0.12} },
  wz_jian:{ name:'梦斩剑', slot:'weapon', grade:'宝品', price:0, icon:'斩', set:'wei_zheng', noShop:true, noSell:true,
    desc:'攻击 +19，暴击率 +6%。梦里斩过泾河老龙的那一柄，醒来还在响。', stat:{atk:19,crit:0.06} },
  wz_fu:  { name:'谏臣朝服', slot:'armor', grade:'灵品', price:0, icon:'谏', set:'wei_zheng', noShop:true, noSell:true,
    desc:'防御 +13，神躯上限 +50。补子上的獬豸被摸得发亮，摸它的人，先摸着自己的良心。', stat:{def:13,hp:50} },
  wz_bu:  { name:'赏善簿', slot:'trinket', grade:'宝品', price:0, icon:'簿', set:'wei_zheng', noShop:true, noSell:true,
    desc:'神力上限 +25，暴击伤害 +10%。簿上一笔善，抵人间一炉香；笔锋向下，从不含糊。', stat:{maxMp:25,critDmg:0.10} },
  lz_dao: { name:'剖心薄刃', slot:'weapon', grade:'宝品', price:0, icon:'刃', set:'lu_zhidao', noShop:true, noSell:true,
    desc:'攻击 +18，暴击率 +7%。薄得能照见骨头——陆判说，心若没病，刀就割不着。', stat:{atk:18,crit:0.07} },
  lz_pao: { name:'验状皂衣', slot:'armor', grade:'灵品', price:0, icon:'验', set:'lu_zhidao', noShop:true, noSell:true,
    desc:'防御 +12，神躯上限 +55。衣襟上洗不掉的墨点，每一处都验过一个人。', stat:{def:12,hp:55} },
  lz_jing:{ name:'勘验镜', slot:'trinket', grade:'宝品', price:0, icon:'鉴', set:'lu_zhidao', noShop:true, noSell:true,
    desc:'暴击率 +5%，暴击伤害 +12%。照卷宗照不出真伪，照人心一照一个准。', stat:{crit:0.05,critDmg:0.12} },
  bg_cheng:{ name:'无心秤', slot:'weapon', grade:'宝品', price:0, icon:'秤', set:'bi_gan', noShop:true, noSell:true,
    desc:'攻击 +17，神力上限 +20。秤杆上没有准星——不称人心，只称良心。', stat:{atk:17,maxMp:20} },
  bg_pao: { name:'文财锦袍', slot:'armor', grade:'灵品', price:0, icon:'财', set:'bi_gan', noShop:true, noSell:true,
    desc:'防御 +12，神躯上限 +55。面子绣的是铜钱纹，里子是粗布：钱穿在外，命垫在里。', stat:{def:12,hp:55} },
  bg_xin: { name:'七窍玲珑心佩', slot:'trinket', grade:'宝品', price:0, icon:'窍', set:'bi_gan', noShop:true, noSell:true,
    desc:'神力上限 +35，暴击率 +4%。七窍都通，偏不通人情——所以他算得清账。', stat:{maxMp:35,crit:0.04} },
  ssm_chu:{ name:'千金药杵', slot:'weapon', grade:'宝品', price:0, icon:'杵', set:'sun_simiao', noShop:true, noSell:true,
    desc:'攻击 +16，神力上限 +20。捣过三千张方子，杵底那层药垢，比金子沉。', stat:{atk:16,maxMp:20} },
  ssm_pao:{ name:'药王布袍', slot:'armor', grade:'灵品', price:0, icon:'药', set:'sun_simiao', noShop:true, noSell:true,
    desc:'防御 +12，神躯上限 +60。洗得发白的旧布袍，病人家属抓着它哭过太多回。', stat:{def:12,hp:60} },
  ssm_fang:{ name:'龙宫药方', slot:'trinket', grade:'宝品', price:0, icon:'方', set:'sun_simiao', noShop:true, noSell:true,
    desc:'神力上限 +20；每场战斗开始时恢复 15% 生命。龙宫抄来的方子，字是湿的，药性是真的。', stat:{maxMp:20}, proc:{healStart:0.15} },
  lb_mo:  { name:'公输墨斗', slot:'weapon', grade:'宝品', price:0, icon:'墨', set:'lu_ban', noShop:true, noSell:true,
    desc:'攻击 +18，防御 +4。一根墨线弹下去，歪一寸都赖不过去。', stat:{atk:18,def:4} },
  lb_he:  { name:'公输短褐', slot:'armor', grade:'灵品', price:0, icon:'褐', set:'lu_ban', noShop:true, noSell:true,
    desc:'防御 +15，神躯上限 +45。袖口卷到肘上——干活的人穿的衣服，从不讲究。', stat:{def:15,hp:45} },
  lb_chi: { name:'鲁班曲尺', slot:'trinket', grade:'灵品', price:0, icon:'尺', set:'lu_ban', noShop:true, noSell:true,
    desc:'防御 +8，神躯上限 +30。量过天庭的梁，也量过人家的门；尺子是直的，人是弯的。', stat:{def:8,hp:30} },
  /* 第四批神明套装：八仙、雷部、财神、文昌、海神（C~B级） */
  lv_jian:{ name:'纯阳剑', slot:'weapon', grade:'宝品', price:0, icon:'纯', set:'lv_dongbin', noShop:true, noSell:true,
    desc:'攻击 +19，暴击率 +6%。剑鞘上没刻名字——他说名字刻上去，剑就只斩一个人了。', stat:{atk:19,crit:0.06} },
  lv_pao: { name:'纯阳道袍', slot:'armor', grade:'灵品', price:0, icon:'袍', set:'lv_dongbin', noShop:true, noSell:true,
    desc:'防御 +13，神躯上限 +50。袖口沾着酒渍和鹤羽，洗了三百年也洗不干净。', stat:{def:13,hp:50} },
  lv_hu:  { name:'纯阳酒葫芦', slot:'trinket', grade:'宝品', price:0, icon:'葫', set:'lv_dongbin', noShop:true, noSell:true,
    desc:'神力上限 +25，暴击伤害 +10%。摇了摇，里头还有半壶——他说留着，等个合适的人一起喝。', stat:{maxMp:25,critDmg:0.10} },
  hx_zan: { name:'荷露玉簪', slot:'weapon', grade:'宝品', price:0, icon:'簪', set:'he_xiangu', noShop:true, noSell:true,
    desc:'攻击 +16，神力上限 +18。簪头一点露水，天亮了也不干——她说这是给赶路的人留的。', stat:{atk:16,maxMp:18} },
  hx_yi:  { name:'藕丝仙衣', slot:'armor', grade:'灵品', price:0, icon:'藕', set:'he_xiangu', noShop:true, noSell:true,
    desc:'防御 +12，神躯上限 +55。藕丝抽出来织的，断了还连着，扯不断。', stat:{def:12,hp:55} },
  hx_ye:  { name:'仙姑荷叶', slot:'trinket', grade:'宝品', price:0, icon:'荷', set:'he_xiangu', noShop:true, noSell:true,
    desc:'神力上限 +20；每场战斗开始时恢复 12% 生命。一片荷叶能挡雨，也能挡刀子。', stat:{maxMp:20}, proc:{healStart:0.12} },
  dm_jing:{ name:'电光镜', slot:'weapon', grade:'宝品', price:0, icon:'电', set:'dian_mu', noShop:true, noSell:true,
    desc:'攻击 +18，暴击率 +6%。两面镜子一照，天上的云就裂开一道白。', stat:{atk:18,crit:0.06} },
  dm_yi:  { name:'云雷衣', slot:'armor', grade:'灵品', price:0, icon:'雷', set:'dian_mu', noShop:true, noSell:true,
    desc:'防御 +12，神躯上限 +50。雷雨夜赶工补的，针脚歪歪扭扭，雷却劈不透。', stat:{def:12,hp:50} },
  dm_cha: { name:'分雷钗', slot:'trinket', grade:'宝品', price:0, icon:'钗', set:'dian_mu', noShop:true, noSell:true,
    desc:'暴击率 +4%，暴击伤害 +12%。钗尖分雷，雷公劈偏的那一道，全从这儿补上。', stat:{crit:0.04,critDmg:0.12} },
  zg_bian:{ name:'玄坛铁鞭', slot:'weapon', grade:'宝品', price:0, icon:'鞭', set:'zhao_gongming', noShop:true, noSell:true,
    desc:'攻击 +22，暴击率 +6%。鞭身缠着一条褪色的红绳——那是黑虎的缰绳，也顺手抽人。', stat:{atk:22,crit:0.06} },
  zg_jia: { name:'玄坛金甲', slot:'armor', grade:'宝品', price:0, icon:'坛', set:'zhao_gongming', noShop:true, noSell:true,
    desc:'防御 +16，神躯上限 +60。甲片上刻满小字，不是符文，是一笔笔欠账的还款日。', stat:{def:16,hp:60} },
  zg_zhu: { name:'定海珠', slot:'trinket', grade:'仙品', price:0, icon:'珠', set:'zhao_gongming', noShop:true, noSell:true,
    desc:'神力上限 +30，暴击伤害 +14%。二十四颗里丢了一颗——他说丢在人间，比搁在库房踏实。', stat:{maxMp:30,critDmg:0.14} },
  wc_bi:  { name:'点斗朱笔', slot:'weapon', grade:'宝品', price:0, icon:'斗', set:'wen_chang', noShop:true, noSell:true,
    desc:'攻击 +20，神力上限 +15。笔尖只点三下：一点天，二点地，三点人心里那口气。', stat:{atk:20,maxMp:15} },
  wc_pao: { name:'文昌锦袍', slot:'armor', grade:'宝品', price:0, icon:'昌', set:'wen_chang', noShop:true, noSell:true,
    desc:'防御 +15，神躯上限 +55。袍上暗绣星图，穿久了，连写字都带着星子气。', stat:{def:15,hp:55} },
  wc_dou: { name:'魁星斗', slot:'trinket', grade:'宝品', price:0, icon:'魁', set:'wen_chang', noShop:true, noSell:true,
    desc:'神力上限 +35，暴击伤害 +12%。斗里盛的不是谷，是天下读书人压在案头的灯灰。', stat:{maxMp:35,critDmg:0.12} },
  mz_fan: { name:'顺风帆', slot:'weapon', grade:'宝品', price:0, icon:'帆', set:'ma_zu', noShop:true, noSell:true,
    desc:'攻击 +19，神躯上限 +20。帆上补丁摞着补丁，每一块都是被救回来的船留下的。', stat:{atk:19,hp:20} },
  mz_yi:  { name:'妈祖霞帔', slot:'armor', grade:'宝品', price:0, icon:'帔', set:'ma_zu', noShop:true, noSell:true,
    desc:'防御 +15，神躯上限 +65。海风里披了三百年，颜色淡了，压风浪的势头一点没淡。', stat:{def:15,hp:65} },
  mz_deng:{ name:'湄洲引航灯', slot:'trinket', grade:'宝品', price:0, icon:'灯', set:'ma_zu', noShop:true, noSell:true,
    desc:'神力上限 +25；每场战斗开始时恢复 12% 生命。雾里最先亮起来的那一盏，从来不在岸上。', stat:{maxMp:25}, proc:{healStart:0.12} },
  /* 第五批神明套装：天庭纠察、四大天王、十殿阎罗、岳神（B级） */
  wl_bian:{ name:'纠察金鞭', slot:'weapon', grade:'宝品', price:0, icon:'鞭', set:'wang_lingguan', noShop:true, noSell:true,
    desc:'攻击 +23，暴击率 +6%。鞭梢有火，抽过的地方三百年还烫手。', stat:{atk:23,crit:0.06} },
  wl_jia: { name:'火轮甲', slot:'armor', grade:'宝品', price:0, icon:'轮', set:'wang_lingguan', noShop:true, noSell:true,
    desc:'防御 +16，神躯上限 +60。甲下踩着两只风火轮，站岗三百年，没坐下过。', stat:{def:16,hp:60} },
  wl_yin: { name:'纠察印', slot:'trinket', grade:'宝品', price:0, icon:'纠', set:'wang_lingguan', noShop:true, noSell:true,
    desc:'神力上限 +30，暴击伤害 +12%。印上刻着四个字：先查自己。', stat:{maxMp:30,critDmg:0.12} },
  zz_jian:{ name:'青云剑', slot:'weapon', grade:'宝品', price:0, icon:'青', set:'zeng_zhang', noShop:true, noSell:true,
    desc:'攻击 +24，暴击率 +6%。剑锋无鞘——他说剑一入鞘，风就停了。', stat:{atk:24,crit:0.06} },
  zz_kai: { name:'增长明光铠', slot:'armor', grade:'宝品', price:0, icon:'增', set:'zeng_zhang', noShop:true, noSell:true,
    desc:'防御 +16，神躯上限 +60。铠上每一道划痕，都是替别人挡的。', stat:{def:16,hp:60} },
  zz_ling:{ name:'善根风铃', slot:'trinket', grade:'宝品', price:0, icon:'铃', set:'zeng_zhang', noShop:true, noSell:true,
    desc:'神力上限 +30，暴击伤害 +12%。铃响了，就是有人的善根长了一寸。', stat:{maxMp:30,critDmg:0.12} },
  dw_san: { name:'混元珠伞', slot:'weapon', grade:'宝品', price:0, icon:'伞', set:'duo_wen', noShop:true, noSell:true,
    desc:'攻击 +22，神力上限 +15。伞面一旋，风是风，雨是雨，账是账。', stat:{atk:22,maxMp:15} },
  dw_jia: { name:'毗沙门甲', slot:'armor', grade:'宝品', price:0, icon:'闻', set:'duo_wen', noShop:true, noSell:true,
    desc:'防御 +16，神躯上限 +62。甲里缝着一只小布袋，装着边塞孩子的乳牙。', stat:{def:16,hp:62} },
  dw_shu: { name:'吐宝鼠', slot:'trinket', grade:'宝品', price:0, icon:'宝', set:'duo_wen', noShop:true, noSell:true,
    desc:'神力上限 +30，暴击伤害 +12%。它只吐它觉得该吐的，从不听人使唤。', stat:{maxMp:30,critDmg:0.12} },
  qg_bi:  { name:'销牒朱笔', slot:'weapon', grade:'宝品', price:0, icon:'牒', set:'qin_guang', noShop:true, noSell:true,
    desc:'攻击 +20，神力上限 +15。笔杆磨得发亮，是三十年排号排出来的。', stat:{atk:20,maxMp:15} },
  qg_pao: { name:'一殿皂袍', slot:'armor', grade:'宝品', price:0, icon:'殿', set:'qin_guang', noShop:true, noSell:true,
    desc:'防御 +15，神躯上限 +55。袖口沾着墨，也沾着别人的眼泪。', stat:{def:15,hp:55} },
  qg_jing:{ name:'孽镜', slot:'trinket', grade:'宝品', price:0, icon:'镜', set:'qin_guang', noShop:true, noSell:true,
    desc:'神力上限 +30，暴击伤害 +12%。照人先照亮处，再照亮处背后那点暗。', stat:{maxMp:30,critDmg:0.12} },
  yl_mu:  { name:'惊堂木', slot:'weapon', grade:'宝品', price:0, icon:'堂', set:'yan_luo', noShop:true, noSell:true,
    desc:'攻击 +24，暴击率 +6%。一拍，堂下就静了；可他自己那桩冤，从没拍响过。', stat:{atk:24,crit:0.06} },
  yl_pao: { name:'五殿玄袍', slot:'armor', grade:'宝品', price:0, icon:'阎', set:'yan_luo', noShop:true, noSell:true,
    desc:'防御 +17，神躯上限 +65。袍角被地狱火烧焦过一回，补丁是黑的。', stat:{def:17,hp:65} },
  yl_ling:{ name:'喊冤铃', slot:'trinket', grade:'宝品', price:0, icon:'冤', set:'yan_luo', noShop:true, noSell:true,
    desc:'神力上限 +30，暴击伤害 +12%。铃有三千个，能响的不到三十个。', stat:{maxMp:30,critDmg:0.12} },
  zl_lun: { name:'转轮盘', slot:'weapon', grade:'宝品', price:0, icon:'轮', set:'zhuan_lun', noShop:true, noSell:true,
    desc:'攻击 +21，神力上限 +18。盘转一格，就有一个魂忘掉来路。', stat:{atk:21,maxMp:18} },
  zl_pao: { name:'十殿素袍', slot:'armor', grade:'宝品', price:0, icon:'素', set:'zhuan_lun', noShop:true, noSell:true,
    desc:'防御 +15，神躯上限 +58。素得像送站老人穿的，袖口磨得起了毛。', stat:{def:15,hp:58} },
  zl_ce:  { name:'轮回簿', slot:'trinket', grade:'宝品', price:0, icon:'簿', set:'zhuan_lun', noShop:true, noSell:true,
    desc:'神力上限 +32，暴击伤害 +12%。簿上不留名字，只留去向。', stat:{maxMp:32,critDmg:0.12} },
  ag_jian:{ name:'龙渊剑', slot:'weapon', grade:'宝品', price:0, icon:'渊', set:'ao_guang', noShop:true, noSell:true,
    desc:'攻击 +23，暴击率 +6%。剑沉在东海三千年，出鞘时海水跟着上来。', stat:{atk:23,crit:0.06} },
  ag_pao: { name:'龙王衮服', slot:'armor', grade:'宝品', price:0, icon:'龙', set:'ao_guang', noShop:true, noSell:true,
    desc:'防御 +16，神躯上限 +62。龙鳞缀的，每一片都记着一场没请旨的雨。', stat:{def:16,hp:62} },
  ag_zhu: { name:'定雨珠', slot:'trinket', grade:'宝品', price:0, icon:'雨', set:'ao_guang', noShop:true, noSell:true,
    desc:'神力上限 +30，暴击伤害 +12%。珠里有一场雨，下了三百年，还没落地。', stat:{maxMp:30,critDmg:0.12} },
  zy_yin: { name:'中岳玉印', slot:'weapon', grade:'宝品', price:0, icon:'嵩', set:'zhong_yue', noShop:true, noSell:true,
    desc:'攻击 +22，防御 +8。印压的是地脉，抬起来，山就喘一口气。', stat:{atk:22,def:8} },
  zy_pao: { name:'嵩岳法袍', slot:'armor', grade:'宝品', price:0, icon:'岳', set:'zhong_yue', noShop:true, noSell:true,
    desc:'防御 +17，神躯上限 +68。袍上绣的不是云，是地底下的水脉。', stat:{def:17,hp:68} },
  zy_shu: { name:'地脉玉简', slot:'trinket', grade:'宝品', price:0, icon:'简', set:'zhong_yue', noShop:true, noSell:true,
    desc:'神力上限 +30，暴击伤害 +12%。简上记着每一口井的深浅，也记着哪口井被抽空了。', stat:{maxMp:30,critDmg:0.12} },
  /* 第六批神明套装：真武、雷祖、西岳、玄女、地藏、韦驮（A级） */
  zw_jian:{ name:'七星剑', slot:'weapon', grade:'仙品', price:0, icon:'罡', set:'zhen_wu', noShop:true, noSell:true,
    desc:'攻击 +27，暴击率 +6%。剑脊上凿着七个孔，夜里各亮一颗星。', stat:{atk:27,crit:0.06} },
  zw_jia: { name:'玄天玄甲', slot:'armor', grade:'仙品', price:0, icon:'玄', set:'zhen_wu', noShop:true, noSell:true,
    desc:'防御 +18，神躯上限 +75。甲片是黑的，黑得像北方的夜。', stat:{def:18,hp:75} },
  zw_ling:{ name:'龟蛇符', slot:'trinket', grade:'仙品', price:0, icon:'龟', set:'zhen_wu', noShop:true, noSell:true,
    desc:'神力上限 +32，暴击伤害 +12%。符上龟蛇相缠，缠了三千年没松开。', stat:{maxMp:32,critDmg:0.12} },
  lz_bian:{ name:'雌雄双鞭', slot:'weapon', grade:'仙品', price:0, icon:'鞭', set:'lei_zu', noShop:true, noSell:true,
    desc:'攻击 +28，暴击率 +6%。一雌一雄，落雷时两声，先响的那声是给人听的。', stat:{atk:28,crit:0.06} },
  lz_jia: { name:'雷祖金甲', slot:'armor', grade:'仙品', price:0, icon:'雷', set:'lei_zu', noShop:true, noSell:true,
    desc:'防御 +18，神躯上限 +78。甲上雷纹是烧出来的，不是刻的。', stat:{def:18,hp:78} },
  lz_yin: { name:'玉枢雷印', slot:'trinket', grade:'仙品', price:0, icon:'枢', set:'lei_zu', noShop:true, noSell:true,
    desc:'神力上限 +35，暴击伤害 +13%。印一落，雷才敢落。', stat:{maxMp:35,critDmg:0.13} },
  xy_feng:{ name:'金锋剑', slot:'weapon', grade:'仙品', price:0, icon:'锋', set:'xi_yue', noShop:true, noSell:true,
    desc:'攻击 +27，暴击率 +6%。剑出华山金气，切石如切纸。', stat:{atk:27,crit:0.06} },
  xy_pao: { name:'华岳金袍', slot:'armor', grade:'仙品', price:0, icon:'华', set:'xi_yue', noShop:true, noSell:true,
    desc:'防御 +18，神躯上限 +76。袍色是金的，金底下压着一座山的影子。', stat:{def:18,hp:76} },
  xy_yin: { name:'金天印', slot:'trinket', grade:'仙品', price:0, icon:'金', set:'xi_yue', noShop:true, noSell:true,
    desc:'神力上限 +32，暴击伤害 +13%。印文「金天顺圣」，边角磕掉过一块——磕的是山。', stat:{maxMp:32,critDmg:0.13} },
  xn_juan:{ name:'六壬天书', slot:'weapon', grade:'仙品', price:0, icon:'壬', set:'xuan_nv', noShop:true, noSell:true,
    desc:'攻击 +26，神力上限 +18。书页没有字，翻开时字才浮上来，合上就忘。', stat:{atk:26,maxMp:18} },
  xn_yi:  { name:'玄女羽衣', slot:'armor', grade:'仙品', price:0, icon:'羽', set:'xuan_nv', noShop:true, noSell:true,
    desc:'防御 +17，神躯上限 +70。羽是青的，风过时整件衣裳都在响。', stat:{def:17,hp:70} },
  xn_fu:  { name:'兵符', slot:'trinket', grade:'仙品', price:0, icon:'符', set:'xuan_nv', noShop:true, noSell:true,
    desc:'神力上限 +35，暴击伤害 +13%。符分两半，一半在将，一半在君。', stat:{maxMp:35,critDmg:0.13} },
  dz_zhang:{name:'九环锡杖', slot:'weapon', grade:'仙品', price:0, icon:'锡', set:'di_zang', noShop:true, noSell:true,
    desc:'攻击 +26，神力上限 +16。走一步，九环响一次；响一次，地狱里就少一个人。', stat:{atk:26,maxMp:16} },
  dz_yi:  { name:'九华僧衣', slot:'armor', grade:'仙品', price:0, icon:'华', set:'di_zang', noShop:true, noSell:true,
    desc:'防御 +17，神躯上限 +72。衣上补丁二十七块，每一块都替一个人挡过。', stat:{def:17,hp:72} },
  dz_zhu: { name:'如意宝珠', slot:'trinket', grade:'仙品', price:0, icon:'珠', set:'di_zang', noShop:true, noSell:true,
    desc:'神力上限 +35，暴击伤害 +12%。珠光照到的地方，连鬼都不那么冷了。', stat:{maxMp:35,critDmg:0.12} },
  wt_chu: { name:'降魔杵', slot:'weapon', grade:'仙品', price:0, icon:'杵', set:'wei_tuo', noShop:true, noSell:true,
    desc:'攻击 +29，暴击率 +5%。杵重八十一斤，落地时山门都要抖一下。', stat:{atk:29,crit:0.05} },
  wt_jia: { name:'护法明光甲', slot:'armor', grade:'仙品', price:0, icon:'护', set:'wei_tuo', noShop:true, noSell:true,
    desc:'防御 +18，神躯上限 +74。甲片擦得能照见人——他说护法的人，先得让人看清。', stat:{def:18,hp:74} },
  wt_li:  { name:'舍利匣', slot:'trinket', grade:'仙品', price:0, icon:'舍', set:'wei_tuo', noShop:true, noSell:true,
    desc:'神力上限 +32，暴击伤害 +12%。匣子不重，可押它的人，一辈子不敢跑。', stat:{maxMp:32,critDmg:0.12} },
  /* 第七批神明套装：酆都、东岳、西王母（S级） */
  fd_ling:{ name:'罗酆令', slot:'weapon', grade:'仙品', price:0, icon:'酆', set:'feng_du', noShop:true, noSell:true,
    desc:'攻击 +30，神力上限 +20。令出罗酆，六天宫的鬼都得低头——低的是令，不是人。', stat:{atk:30,maxMp:20} },
  fd_pao: { name:'北阴玄袍', slot:'armor', grade:'仙品', price:0, icon:'阴', set:'feng_du', noShop:true, noSell:true,
    desc:'防御 +20，神躯上限 +90。袍是黑的，黑了三千年，黑得连影子都不肯沾。', stat:{def:20,hp:90} },
  fd_yin: { name:'六天宫印', slot:'trinket', grade:'仙品', price:0, icon:'宫', set:'feng_du', noShop:true, noSell:true,
    desc:'神力上限 +40，暴击伤害 +14%。六宫六印，如今只剩这一方还在自己手里。', stat:{maxMp:40,critDmg:0.14} },
  dy_fu:  { name:'天齐玉符', slot:'weapon', grade:'仙品', price:0, icon:'齐', set:'dong_yue', noShop:true, noSell:true,
    desc:'攻击 +30，神力上限 +20。符上刻「天齐」，落笔那一划，压着泰山。', stat:{atk:30,maxMp:20} },
  dy_pao: { name:'泰山衮服', slot:'armor', grade:'仙品', price:0, icon:'泰', set:'dong_yue', noShop:true, noSell:true,
    desc:'防御 +20，神躯上限 +92。衮服十二纹，最后一道是山，绣得比龙还沉。', stat:{def:20,hp:92} },
  dy_ce:  { name:'生死簿影', slot:'trinket', grade:'仙品', price:0, icon:'簿', set:'dong_yue', noShop:true, noSell:true,
    desc:'神力上限 +40，暴击伤害 +14%。簿影没有字，可翻到哪一页，哪一页的人就心里一紧。', stat:{maxMp:40,critDmg:0.14} },
  xw_tao: { name:'蟠桃', slot:'weapon', grade:'仙品', price:0, icon:'桃', set:'xi_wangmu', noShop:true, noSell:true,
    desc:'攻击 +28，神力上限 +22。桃三千年一熟，熟一次，瑶池的宴就开一次。', stat:{atk:28,maxMp:22} },
  xw_pao: { name:'瑶池金母袍', slot:'armor', grade:'仙品', price:0, icon:'瑶', set:'xi_wangmu', noShop:true, noSell:true,
    desc:'防御 +20，神躯上限 +95。袍上云纹是活的，走一步，云就挪一步。', stat:{def:20,hp:95} },
  xw_jing:{ name:'昆仑玉镜', slot:'trinket', grade:'仙品', price:0, icon:'镜', set:'xi_wangmu', noShop:true, noSell:true,
    desc:'神力上限 +40，暴击伤害 +15%。镜里照的不是脸，是这个人还能活多久。', stat:{maxMp:40,critDmg:0.15} },
  /* 礼物（七样白名单，诸神偏好见 GODS[g].gifts；loved+18 / liked+8 / 忌讳+1 / 其余+4） */
  taomu:   { name:'桃木如意', slot:'gift', grade:'凡品', price:150, icon:'桃', desc:'老桃木雕的小如意，平实讨喜，各路神明都不至于嫌弃。' },
  wugu:    { name:'五谷福袋', slot:'gift', grade:'凡品', price:200, icon:'谷', desc:'新粟新稻缝成的福袋，盛满人间烟火气。' },
  xiangzhu:{ name:'龙涎香烛', slot:'gift', grade:'凡品', price:180, icon:'烛', desc:'一燃便满殿生香，衙门里的神明都吃这一套。' },
  mozhen:  { name:'徽墨「铁斋」', slot:'gift', grade:'灵品', price:300, icon:'墨', desc:'一两徽墨一两银。判官们案头最缺的就是这个。' },
  panta:   { name:'蟠桃（次品）', slot:'gift', grade:'灵品', price:320, icon:'果', desc:'瑶池挑剩的次品，但猴子才不管品相。' },
  hulu:    { name:'杏仁酒葫芦', slot:'gift', grade:'灵品', price:340, icon:'酒', desc:'装着杏花酿的小葫芦，严肃的神明多半摇头，爱酒的神仙两眼放光。' },
  puti:   { name:'金菩提', slot:'gift', grade:'宝品', price:600, icon:'菩', desc:'菩提树顶摘的金果，佛门至宝。' },
};

/* ================= 神明套装特效（≥2件两档 / 3件三档；stat/proc 在 Stats.recalc 结算，hook 在战斗引擎结算） ================= */
const SET_BONUS = {
  guanyu: { name:'武圣行头', god:'guan_yu', quest:'s35', gift:'gy_yin',
    two: { label:'温酒', desc:'两件套「温酒」：暴击伤害 +30%', stat:{critDmg:0.30} },
    three:{ label:'拖刀计', desc:'三件套「拖刀计」：暴击后 40% 概率追加一记 60% 攻击的追斩', hook:'guanyuCritFollow' } },
  mengpo: { name:'忘川三味', god:'meng_po', quest:'s36', gift:'mp_ling',
    two: { label:'忘忧', desc:'两件套「忘忧」：神力上限 +50，神通神力消耗 −10%', stat:{maxMp:50}, proc:{mpCost:0.90} },
    three:{ label:'回魂', desc:'三件套「回魂」：每回合开始时回复 10% 神力', hook:'mengpoMpRegen' } },
  zhongkui:{ name:'啖鬼行头', god:'zhong_kui', quest:'s37', gift:'zk_deng',
    two: { label:'辨鬼', desc:'两件套「辨鬼」：对鬼类敌人攻击 +15%', hook:'zkGui15' },
    three:{ label:'啖鬼', desc:'三件套「啖鬼」：对鬼类敌人攻击 +30%（覆盖两件套）', hook:'zkGui30' } },
  sunwukong:{ name:'齐天行头', god:'sun_wukong', quest:'s38', gift:'sw_yu',
    two: { label:'火眼金睛', desc:'两件套「火眼金睛」：暴击率 +10%', stat:{crit:0.10} },
    three:{ label:'法天象地', desc:'三件套「法天象地」：普攻后 30% 概率追加两连击（各 45% 攻击）', hook:'swCombo' } },
  nezha: { name:'莲华化身', god:'ne_zha', quest:'s39', gift:'nz_gou',
    two: { label:'三头六臂', desc:'两件套「三头六臂」：暴击伤害 +25%', stat:{critDmg:0.25} },
    three:{ label:'莲花化身', desc:'三件套「莲花化身」：每场战斗首次濒死时免死并回复 30% 生命', proc:{firstSave:{heal:0.30}} } },
  erlang:{ name:'清源天眼', god:'er_lang', quest:'s40', gift:'el_mu',
    two: { label:'天眼', desc:'两件套「天眼」：对易伤中的敌人攻击 +18%', hook:'elVuln18' },
    three:{ label:'细犬搜山', desc:'三件套「细犬搜山」：对妖类敌人攻击 +30%', hook:'elYao30' } },
  guanyin:{ name:'莲台甘露', god:'guan_yin', quest:'s41', gift:'gw_liu',
    two: { label:'杨枝甘露', desc:'两件套「杨枝甘露」：每场战斗开始时恢复 25% 生命', proc:{healStart:0.25} },
    three:{ label:'慈航普度', desc:'三件套「慈航普度」：受到的伤害减少 15%', proc:{dmgReduce:0.15} } },
  cui_jue:{ name:'阴律朱笔', god:'cui_jue', quest:'s42', gift:'cj_ye',
    two: { label:'一线生机', desc:'两件套「一线生机」：每场战斗开始时恢复 20% 生命', proc:{healStart:0.20} },
    three:{ label:'朱笔勾魂', desc:'三件套「朱笔勾魂」：对魂类敌人攻击 +30%', hook:'vsHun30' } },
  wei_zheng:{ name:'赏善铁面', god:'wei_zheng', quest:'s43', gift:'wz_bu',
    two: { label:'铁面', desc:'两件套「铁面」：受到的伤害减少 10%', proc:{dmgReduce:0.10} },
    three:{ label:'梦斩泾河', desc:'三件套「梦斩泾河」：对妖类敌人攻击 +30%', hook:'vsYao30' } },
  lu_zhidao:{ name:'察查明镜', god:'lu_zhidao', quest:'s44', gift:'lz_jing',
    two: { label:'明镜', desc:'两件套「明镜」：暴击率 +8%', stat:{crit:0.08} },
    three:{ label:'照胆', desc:'三件套「照胆」：暴击后 40% 概率追加一记 60% 攻击的追斩', hook:'critFollow' } },
  bi_gan: { name:'七窍文心', god:'bi_gan', quest:'s45', gift:'bg_xin',
    two: { label:'玲珑', desc:'两件套「玲珑」：神力上限 +50', stat:{maxMp:50} },
    three:{ label:'无心', desc:'三件套「无心」：每回合开始时回复 10% 神力', hook:'mpRegen' } },
  sun_simiao:{ name:'千金药王', god:'sun_simiao', quest:'s46', gift:'ssm_fang',
    two: { label:'悬丝', desc:'两件套「悬丝」：每场战斗开始时恢复 20% 生命', proc:{healStart:0.20} },
    three:{ label:'续命', desc:'三件套「续命」：每场战斗首次濒死时免死并回复 30% 生命', proc:{firstSave:{heal:0.30}} } },
  lu_ban: { name:'公输规矩', god:'lu_ban', quest:'s47', gift:'lb_chi',
    two: { label:'规矩', desc:'两件套「规矩」：防御 +14，神躯上限 +40', stat:{def:14,hp:40} },
    three:{ label:'机关百出', desc:'三件套「机关百出」：普攻后 30% 概率追加两连击（各 45% 攻击）', hook:'combo' } },
  lv_dongbin:{ name:'纯阳剑胆', god:'lv_dongbin', quest:'s48', gift:'lv_hu',
    two: { label:'酒中剑', desc:'两件套「酒中剑」：暴击率 +7%', stat:{crit:0.07} },
    three:{ label:'江淮斩蛟', desc:'三件套「江淮斩蛟」：对妖类敌人攻击 +30%', hook:'vsYao30' } },
  he_xiangu:{ name:'荷风甘露', god:'he_xiangu', quest:'s49', gift:'hx_ye',
    two: { label:'荷风', desc:'两件套「荷风」：神通神力消耗 −10%', proc:{mpCost:0.90} },
    three:{ label:'八仙过海', desc:'三件套「八仙过海」：受到的伤害减少 12%', proc:{dmgReduce:0.12} } },
  dian_mu:{ name:'电光雷母', god:'dian_mu', quest:'s50', gift:'dm_cha',
    two: { label:'照妖', desc:'两件套「照妖」：暴击率 +8%', stat:{crit:0.08} },
    three:{ label:'补雷', desc:'三件套「补雷」：对鬼类敌人攻击 +30%', hook:'vsGui30' } },
  zhao_gongming:{ name:'玄坛黑虎', god:'zhao_gongming', quest:'s51', gift:'zg_zhu',
    two: { label:'铁鞭', desc:'两件套「铁鞭」：暴击伤害 +25%', stat:{critDmg:0.25} },
    three:{ label:'黑虎连扑', desc:'三件套「黑虎连扑」：普攻后 30% 概率追加两连击（各 45% 攻击）', hook:'combo' } },
  wen_chang:{ name:'魁星点斗', god:'wen_chang', quest:'s52', gift:'wc_dou',
    two: { label:'文昌', desc:'两件套「文昌」：神力上限 +50', stat:{maxMp:50} },
    three:{ label:'点斗', desc:'三件套「点斗」：每回合开始时回复 10% 神力', hook:'mpRegen' } },
  ma_zu:{ name:'湄洲慈航', god:'ma_zu', quest:'s53', gift:'mz_deng',
    two: { label:'慈航', desc:'两件套「慈航」：每场战斗开始时恢复 20% 生命', proc:{healStart:0.20} },
    three:{ label:'压风', desc:'三件套「压风」：受到的伤害减少 12%', proc:{dmgReduce:0.12} } },
  wang_lingguan:{ name:'都天纠察', god:'wang_lingguan', quest:'s54', gift:'wl_yin',
    two: { label:'三眼', desc:'两件套「三眼」：暴击率 +6%，攻击 +6', stat:{crit:0.06,atk:6} },
    three:{ label:'金鞭', desc:'三件套「金鞭」：对鬼类敌人攻击 +30%', hook:'vsGui30' } },
  zeng_zhang:{ name:'青云护法', god:'zeng_zhang', quest:'s55', gift:'zz_ling',
    two: { label:'风起', desc:'两件套「风起」：暴击率 +7%', stat:{crit:0.07} },
    three:{ label:'剑风', desc:'三件套「剑风」：暴击后 40% 概率回锋追斩（60% 攻击）', hook:'critFollow' } },
  duo_wen:{ name:'毗沙门福德', god:'duo_wen', quest:'s56', gift:'dw_shu',
    two: { label:'宝伞', desc:'两件套「宝伞」：每场战斗开始时恢复 20% 生命', proc:{healStart:0.20} },
    three:{ label:'护北', desc:'三件套「护北」：对鬼类敌人攻击 +30%', hook:'vsGui30' } },
  qin_guang:{ name:'孽镜初判', god:'qin_guang', quest:'s57', gift:'qg_jing',
    two: { label:'孽镜', desc:'两件套「孽镜」：暴击率 +7%', stat:{crit:0.07} },
    three:{ label:'初判', desc:'三件套「初判」：对魂类敌人攻击 +30%', hook:'vsHun30' } },
  yan_luo:{ name:'五殿惊堂', god:'yan_luo', quest:'s58', gift:'yl_ling',
    two: { label:'惊堂', desc:'两件套「惊堂」：攻击 +9，防御 +9', stat:{atk:9,def:9} },
    three:{ label:'狱火', desc:'三件套「狱火」：对鬼类敌人攻击 +30%', hook:'vsGui30' } },
  zhuan_lun:{ name:'六道转轮', god:'zhuan_lun', quest:'s59', gift:'zl_ce',
    two: { label:'轮回', desc:'两件套「轮回」：神力上限 +45', stat:{maxMp:45} },
    three:{ label:'转轮', desc:'三件套「转轮」：每回合开始时回复 10% 神力', hook:'mpRegen' } },
  ao_guang:{ name:'东海行雨', god:'ao_guang', quest:'s60', gift:'ag_zhu',
    two: { label:'龙鳞', desc:'两件套「龙鳞」：防御 +12，神躯上限 +50', stat:{def:12,hp:50} },
    three:{ label:'行雨', desc:'三件套「行雨」：对妖类敌人攻击 +30%', hook:'vsYao30' } },
  zhong_yue:{ name:'中天镇岳', god:'zhong_yue', quest:'s61', gift:'zy_shu',
    two: { label:'地脉', desc:'两件套「地脉」：防御 +16，神躯上限 +70', stat:{def:16,hp:70} },
    three:{ label:'镇岳', desc:'三件套「镇岳」：受到的伤害减少 12%', proc:{dmgReduce:0.12} } },
  zhen_wu:{ name:'玄天荡魔', god:'zhen_wu', quest:'s62', gift:'zw_ling',
    two: { label:'龟蛇', desc:'两件套「龟蛇」：防御 +18，神躯上限 +80', stat:{def:18,hp:80} },
    three:{ label:'荡魔', desc:'三件套「荡魔」：对妖类敌人攻击 +30%', hook:'vsYao30' } },
  lei_zu:{ name:'九天应元', god:'lei_zu', quest:'s63', gift:'lz_yin',
    two: { label:'应元', desc:'两件套「应元」：神力上限 +40，暴击伤害 +10%', stat:{maxMp:40,critDmg:0.10} },
    three:{ label:'五雷', desc:'三件套「五雷」：暴击后 40% 概率追加一记 60% 攻击的追斩', hook:'critFollow' } },
  xi_yue:{ name:'金天顺圣', god:'xi_yue', quest:'s64', gift:'xy_yin',
    two: { label:'金气', desc:'两件套「金气」：暴击伤害 +20%', stat:{critDmg:0.20} },
    three:{ label:'西岳', desc:'三件套「西岳」：对鬼类敌人攻击 +30%', hook:'vsGui30' } },
  xuan_nv:{ name:'玄女天书', god:'xuan_nv', quest:'s65', gift:'xn_fu',
    two: { label:'六壬', desc:'两件套「六壬」：暴击率 +8%', stat:{crit:0.08} },
    three:{ label:'天书', desc:'三件套「天书」：每回合开始时回复 10% 神力', hook:'mpRegen' } },
  di_zang:{ name:'大愿谛听', god:'di_zang', quest:'s66', gift:'dz_zhu',
    two: { label:'谛听', desc:'两件套「谛听」：每场战斗开始时恢复 22% 生命', proc:{healStart:0.22} },
    three:{ label:'大愿', desc:'三件套「大愿」：每场战斗首次濒死时免死并回复 30% 生命', proc:{firstSave:{heal:0.30}} } },
  wei_tuo:{ name:'护法金刚', god:'wei_tuo', quest:'s67', gift:'wt_li',
    two: { label:'金刚', desc:'两件套「金刚」：攻击 +12', stat:{atk:12} },
    three:{ label:'护法', desc:'三件套「护法」：暴击后 40% 概率追加一记 60% 攻击的追斩', hook:'critFollow' } },
  feng_du:{ name:'罗酆北阴', god:'feng_du', quest:'s68', gift:'fd_yin',
    two: { label:'北阴', desc:'两件套「北阴」：防御 +20，神躯上限 +90', stat:{def:20,hp:90} },
    three:{ label:'罗酆', desc:'三件套「罗酆」：对魂类敌人攻击 +30%', hook:'vsHun30' } },
  dong_yue:{ name:'天齐仁圣', god:'dong_yue', quest:'s69', gift:'dy_ce',
    two: { label:'天齐', desc:'两件套「天齐」：暴击伤害 +25%', stat:{critDmg:0.25} },
    three:{ label:'仁圣', desc:'三件套「仁圣」：对鬼类敌人攻击 +30%', hook:'vsGui30' } },
  xi_wangmu:{ name:'瑶池金母', god:'xi_wangmu', quest:'s70', gift:'xw_jing',
    two: { label:'瑶池', desc:'两件套「瑶池」：每场战斗开始时恢复 25% 生命', proc:{healStart:0.25} },
    three:{ label:'金母', desc:'三件套「金母」：每场战斗首次濒死时免死并回复 40% 生命', proc:{firstSave:{heal:0.40}} } },
};

/* ================= 阴兵 ================= */
const SOLDIERS = {
  xiaojiang:{ name:'鬼差',     price:90,  icon:'差', desc:'先制偷袭：第一回合额外打出 50% 攻击的一击。' },
  duwei:    { name:'阴兵小将', price:180, icon:'将', desc:'挡刀：20% 概率替你挡下本回合一半伤害。' },
};

/* ================= 神衙设施（总级数受 RANKS.facCap 限制） ================= */
const FACILITIES = {
  shrine:{ name:'神龛', icon:'龛', desc:'供奉神格：凝格、提升觉醒率。',
    levels:[{cost:200, wakeBonus:0.15},{cost:450, wakeBonus:0.30}] },
  desk:  { name:'案几', icon:'案', desc:'拓宽工单架，每日多接状纸。',
    levels:[{cost:250, shelf:1}] },
  incense:{name:'香炉', icon:'香', desc:'神力上限+30。',
    levels:[{cost:180, mana:30},{cost:400, mana:30}] },
  banner:{ name:'招妖幡', icon:'幡', desc:'阴兵编制+1。',
    levels:[{cost:220, cap:1},{cost:420, cap:1}] },
};

/* ================= 9 阶官阶（03册权威） ================= */
const RANKS = [
  { name:'九品阴神（外包）',        slots:3, shelf:3, soldiers:1, facCap:4,  tierCap:'E' },
  { name:'从八品·阴阳差役',        slots:4, shelf:4, soldiers:2, facCap:6,  tierCap:'D', grow:{hp:30,atk:6,def:3} },
  { name:'八品·两界巡按',          slots:4, shelf:5, soldiers:2, facCap:8,  tierCap:'C', grow:{hp:35,atk:7,def:3} },
  { name:'从七品·主簿',            slots:5, shelf:5, soldiers:3, facCap:10, tierCap:'B', grow:{hp:40,atk:8,def:4} },
  { name:'七品·判官',              slots:5, shelf:6, soldiers:4, facCap:13, tierCap:'B', grow:{hp:45,atk:9,def:4} },
  { name:'从六品·推官',            slots:6, shelf:7, soldiers:5, facCap:16, tierCap:'A', grow:{hp:55,atk:11,def:5} },
  { name:'六品·刑曹',              slots:6, shelf:8, soldiers:6, facCap:19, tierCap:'A', grow:{hp:65,atk:13,def:5} },
  { name:'从五品·酆都判官中丞',    slots:7, shelf:9, soldiers:8, facCap:22, tierCap:'A', grow:{hp:75,atk:15,def:6} },
  { name:'五品·阴司少卿',          slots:8, shelf:10,soldiers:10,facCap:25, tierCap:'S', grow:{hp:90,atk:18,def:7} },
];
const TIER_ORDER = { E:0, D:1, C:2, B:3, A:4, S:5 };

/* ================= 敕封诏书（按「新阶」索引，章末晋升仪式用） =================
   seal：御印印文 ｜ hao：四字封号 ｜ edict：敕词（天庭官腔，黑色幽默） */
const RANK_EDICT = {
  1:{ seal:'敕命', hao:'两界听差',
      edict:'着即补授从八品·阴阳差役，凡两界跑腿、昼夜勾魂，皆归你差遣。切记：差事办得好，是上峰的功；办砸了，是你的罪。' },
  2:{ seal:'敕命', hao:'行路考稽',
      edict:'授八品·两界巡按，地界所至，皆可查访。庙小妖风大，池浅王八多——睁大眼睛看着，别让哪尊神，在你眼皮子底下空了庙。' },
  3:{ seal:'酆都之印', hao:'掌簿佐刑',
      edict:'授从七品·主簿，执掌文案，佐理刑名。簿上一滴墨，人间一条命；朱笔批下去时稳着些——墨点溅起来，脏的是你的顶戴。' },
  4:{ seal:'酆都之印', hao:'笔落赏罚',
      edict:'授七品·判官，自此笔下判生死、定赏罚。世人都说判官铁面无私，只有你知道：铁面之前，也得先看清阎君的脸色。' },
  5:{ seal:'酆都之印', hao:'推勘幽冥',
      edict:'授从六品·推官，专理疑狱。旧案翻成新雪，新案堆作旧山。推官推的不只是案情，更是人情——推得开，青云有路；推不开，万劫缠身。' },
  6:{ seal:'酆都之印', hao:'执律刑曹',
      edict:'授六品·刑曹，幽冥律例三千条，条条如刀。刀握在你手里，刃悬在别人颈上；只是别忘了，握刀的手，长在天庭的胳膊上。' },
  7:{ seal:'天子行玺', hao:'酆都副宪',
      edict:'授从五品·酆都判官中丞，佐理酆都，距那把黑椅子只差半步。古来位极人臣的都懂一个道理：椅子可以想，断不能坐得太早。' },
  8:{ seal:'天子行玺', hao:'少卿理阴',
      edict:'授五品·阴司少卿，列九卿之副，摄一司之事。到了这一步，你看谁都像案卷，谁看你都像靠山——慎之，慎之。' },
};
const MONTH_DAYS = 30;
function monthTarget(month){ return 50 + month*15; }

/* ================= 妖丹（04册第七节） ================= */
const PILLS = {
  danmo:  { name:'丹末',     icon:'末', refineCost:100,  days:1, band:['凡'],
    devour:{ hp:8,  atk:2,  def:0, erode:4  } },
  dan:    { name:'妖丹',     icon:'丹', refineCost:250,  days:1, band:['凡','灵'],
    devour:{ hp:18, atk:4,  def:2, erode:8  } },
  wang:   { name:'妖丹·王',  icon:'王', refineCost:600,  days:2, band:['灵','宝'],
    devour:{ hp:32, atk:7,  def:4, erode:12 } },
  xiong:  { name:'凶丹',     icon:'凶', refineCost:1200, days:3, band:['宝','仙'],
    devour:{ hp:50, atk:11, def:7, erode:18 } },
  bingzhu:{ name:'兵主残丹', icon:'主', refineCost:1500, days:3, band:['仙'], pathWeight:'bing',
    devour:{ hp:60, atk:14, def:8, erode:25 }, special:'zhanshen',
    specialDesc:'另得「斩神」特效：对壳神/神位目标常规伤害无视其神位减伤。' },
  gui:    { name:'鬼丹',     icon:'鬼', refineCost:200,  days:1, band:['凡','灵'], pathWeight:'you',
    devour:{ hp:15, atk:3,  def:2, erode:10 } },
};

/* ================= 侵蚀值五档（0~100，暗线甲/D结局挂钩） ================= */
const ERODE_BANDS = [
  { max:19,  name:'清净',     halluc:0,    mpPenalty:0,    desc:'神明清明，不染尘垢。' },
  { max:39,  name:'偶发幻觉', halluc:0.08, mpPenalty:0,    desc:'战时偶有失误，夜里似闻幻听。' },
  { max:59,  name:'道争加剧', halluc:0.15, mpPenalty:0.10, desc:'神格道争的神力折损扩大。' },
  { max:79,  name:'神思不属', halluc:0.22, mpPenalty:0.10, desc:'善神援助或降一档；终章抉择权重倾斜。' },
  { max:100, name:'灯火将改', halluc:0.30, mpPenalty:0.20, desc:'坏结局轨道锁定——除非另有担保。' },
];

/* ================= 工单（10册主线章1-3 / 11册支线 s01-s24） =================
   字段：id/name/god/scroll/danger(1-5)/money/merit/chapter(门槛)
        forced(官遣朱签必到) / yamen(阎君殿转批，免品阶限制但可驳回)
        main(主线幕flag,reqMain串行,chapterEnd章末敕封) / side(支线flag)
        long+acts(长单分幕) / reward(v3: gh/shards/dshards/pill/merit/money/favor/erode/flags)
   节点：{type:'event',text,choices:[{t,requires:{path},r:{...}}]}
        {type:'battle',enemy,scale,name?(剧情别名)}
   r 支持：hp/heal/atkBuff/shield/enemyAtk/enemyVuln/money/merit/renqing
          erode/cleanse/favor{god:n}/flags{k:v}/skip(免战跳节点)/log
   ============================================================================ */
const MISSIONS = [

/* ============ 章一 · 两界文书房（rank0→1） ============ */
{id:'c1m1',name:'破神衙点卯',god:'tudi_gong',chapter:1,forced:true,main:'c1m1',danger:1,money:20,merit:5,
 scroll:'红灯笼无火自明，土地公从地里冒出半截身子——新人，先把契按了。',
 reward:{shards:{sheng:1}},
 nodes:[
  {type:'event',text:'你捏着一纸《阴阳两界劳务契》站在破神衙门口。契书背面小字密如蚁：「工伤自理，魂飞魄散与甲方无涉」。土地公拄杖冒出，塞来半块供糕：「工单上让你管的，你管；没让你问的，别问。」',
   choices:[
    {t:'仔细读完劳务契再按手印',r:{flags:{flag_know_truth:1},favor:{tudi_gong:3},log:'你看清了「工伤自理」四个字——制度第一课：合同是坑。'}},
    {t:'痛快按印，问怎么挣香火钱',r:{renqing:1,log:'土地公乐得塞你一张旧符纸：好好干，香火钱少不了。'}},
    {t:'问「能不能不签」',r:{flags:{flag_stance:1},log:'土地公指夹壁外游荡的野魂：签了，你是差；不签，你是口粮。'}}
   ]},
  {type:'quiz',who:'土地公',text:'手印按完，土地公却把工单往怀里一揣：「慢着。破神衙也不是什么阿猫阿狗都能点卯的——答得上老夫三问，这张工单才算你的。答不上，就站在门口再看看契书。」',
   qs:[
    {q:'第一问，就问你刚按了手印的那张契：《阴阳两界劳务契》背面那行蚁头小楷，写的是什么？',
     opts:['工伤自理，魂飞魄散与甲方无涉','包吃包住，三年转正','神格保底，逢年加薪','阴阳两界，一律平等'],a:0,
     why:'外包第一课：合同是坑。画押之前，先看那行最小的字。'},
    {q:'第二问：你在神衙当差行走两界，处处使得、神仙也肯弯腰收的硬通货，是哪一样？',
     opts:['香火钱','人情','功过','阴德'],a:0,
     why:'香火钱是两界硬通货；人情可加价、功过定考核，唯香火钱处处使得。'},
    {q:'第三问：神格按品级分作四等，下列排序正确的是？',
     opts:['凡 · 灵 · 宝 · 仙','铁 · 铜 · 银 · 金','下 · 中 · 上 · 极','素 · 青 · 朱 · 金'],a:0,
     why:'神格四品：凡、灵、宝、仙。仙格极罕——寻常人攒一辈子香火也未必摸得到边。'}
   ],
   pass:{money:10,merit:3,favor:{tudi_gong:5},log:'土地公捻须大笑：行，是个能在破神衙活过三天的。这张工单，归你了。'}}
 ]},

{id:'c1m2',name:'游魂三缕',god:'yan_luo',chapter:1,forced:true,main:'c1m2',reqMain:'c1m1',danger:1,money:30,merit:8,
 scroll:'阎君殿朱签：巡收夹壁游魂三缕，误一魂扣当月香火三成。朱字旁添注：朱砂快没了，勾魂笔自带。',
 reward:{shards:{bing:1,huo:1}},
 nodes:[
  {type:'event',text:'灰雾里三缕游魂抱着生前执念打转——一个攥着半张考榜，一个端着冷药碗，一个还在念叨「再让我看一眼放榜」。土地公在旁喊招，喊到一半忘词：「它抬手你就躲！它缩脖子你就——就什么来着？」',
   choices:[{t:'凝神戒备，按意图见招拆招',r:{log:'三缕游魂呜咽着围了上来。'}}]},
  {type:'quiz',who:'阎罗王殿·朱签',text:'朱签背面蝇头小楷，是收魂差役当场必答的两道阴律——答不上，连勾魂的门径都摸不着，三缕游魂只会越散越远。',
   qs:[
    {q:'三缕游魂抱着同一张考榜在灰雾里打转，阴律上横死之魂久滞阳世，根由是哪一桩？',
     opts:['执念未了，阳籍销不了、轮回路也认不得','阴间客满暂不收魂','他仨阳寿还未尽数','土地庙香火太盛留住了魂'],a:0,
     why:'横死魂为执念所缚，幽冥簿上销不了阳籍；须先解执念、指以轮回路，强拘只会激成厉鬼。'},
    {q:'朱签又问：收伏这类抱念游魂，办差的正途该先做什么？',
     opts:['念其执念所系，善言超度、指给轮回路','锁魂链当头就砸','三魂打散，永绝后患','先奏雷部劈了再说'],a:0,
     why:'游魂多是苦人。超度为先、指以轮回路，魂自己肯走；逞强用强，反造杀业。'}
   ],
   pass:{shield:0.2,enemyVuln:true,merit:3,log:'朱签小字在雾里微微一亮——阴律记熟于心，你出手的分寸先稳了三分。'}},
  {type:'battle',enemy:'youhun',scale:1},
  {type:'event',text:'三缕游魂被你制住，雾里它们还望着同一个方向。',
   choices:[
    {t:'好生超度，指给它们轮回路',r:{merit:8,favor:{tudi_gong:5},flags:{flag_mercy_cut:1},log:'三魂叩谢散去，你给它们指了轮回路。'}},
    {t:'按工单「收魂入袋」，交差要紧',r:{money:30,flags:{flag_ruthless:1},log:'你收魂入袋，土地公欲言又止。'}},
    {t:'问它们为何滞留此地',r:{flags:{flag_know_truth:1},log:'它们都在等「同一张放榜文书」，都被同一个黑差引来此处。'}}
   ]}
 ]},

{id:'c1m3',name:'伪造文书案',god:'yan_luo',chapter:1,forced:true,main:'c1m3',reqMain:'c1m2',danger:2,money:50,merit:12,
 scroll:'驿馆档房，一名腰牌崭新的黑差正给野魂发「阴间落户告身」，每张收供香三炷。',
 reward:{shards:{you:1}},
 nodes:[
  {type:'event',text:'告身印泥是阳间冥铺的假货，朱砂里掺了公鸡血——按律这是伪造天庭文书的重罪。黑差见事败，抽刀化为黑雾，拆了一整架卷宗砸来。',
   choices:[{t:'追入档房深处',r:{log:'黑雾尽头，黑差提刀回身。'}}]},
  {type:'quiz',who:'阎罗王殿·验文',text:'动手前，你先在假告身上复验两道辨伪功课——勘验天庭文书是破神衙差役的看家本事，看走了眼，罪名就安不到他头上。',
   qs:[
    {q:'你捏起那张「阴间落户告身」，辨天庭任官文书的真伪，头一眼该看什么？',
     opts:['公文用纸与接缝处的骑缝印信','差役的字写得周不周正','供香烧得旺不旺','腰牌是新是旧'],a:0,
     why:'天庭告身用桑皮公文纸，接缝处钤骑缝印；纸质油腥、印信不全，一眼便知是仿造。'},
    {q:'印泥朱砂里掺了公鸡血，这一手在冥司文书上为何立刻露馅？',
     opts:['雄鸡血至阳，冲克阴文印气，钤在冥纸上浮而不沉','鸡血比朱砂颜色更红','公鸡血写的字会引来鸡叫','冥司文书一律不许用红色'],a:0,
     why:'冥司公文取水飞辰砂，性合幽冥；生鸡血至阳，印气浮泛，案牍老手一嗅一照便破。'}
   ],
   pass:{enemyVuln:true,merit:4,log:'两处破绽当堂点破，黑差脸上的凶横先虚了一半——他的刀，也慢了半拍。'}},
  {type:'battle',enemy:'taoyiheichai',name:'逃役黑差',scale:1.05},
  {type:'event',text:'黑差被你人赃并获，怀里还揣着半包供香与一张天庭回执。',
   choices:[
    {t:'连人带假文书押往阎罗殿',r:{money:60,merit:8,log:'正道流程。阎罗王朱批两个字：「尚可」。'}},
    {t:'收他供香，放他往阳间逃',r:{money:120,erode:3,flags:{flag_ruthless:1,flag_know_truth:1},log:'黑差丢下一句：假文书不值钱——真的文书才值钱。'}},
    {t:'扣下假印，逼他供出上家',r:{merit:10,flags:{flag_know_truth:1},log:'假告身竟能在天庭档房「挂得上号」。阎罗王嫌你多事，赏钱减半。'}}
   ]}
 ]},

{id:'c1m4',name:'崔珏初照面·真的回执',god:'cui_jue',chapter:1,forced:true,main:'c1m4',reqMain:'c1m3',chapterEnd:true,danger:1,money:40,merit:10,
 scroll:'阎罗殿外回廊，青袍判官崔珏就着昏灯自磨朱砂。假告身他一眼断伪，那张天庭回执，他却沉默了。',
 reward:{shards:{you:2}},
 nodes:[
  {type:'event',text:'回执的天曹骑缝印是真的，档房挂的号也是真的。假文书在天庭那台机器里，走完了一遍真流程。崔珏把回执推回，声音压得极低：「假印盖真文，是有人贪墨；真印盖假文，是整套规矩在作假。前者是案，后者——你办不动。」',
   choices:[{t:'问这回执该怎么归档',r:{log:'崔珏盯着你，等你自己选。'}}]},
  {type:'quiz',who:'崔珏',text:'崔珏并不急着听你的回话，指尖蘸着自磨朱砂，在灯影里先考你两问——这两问答得明白，你才有资格碰那张烫手的回执。',
   qs:[
    {q:'他指尖点着回执粘连处那半枚残印：「这叫什么印？防的又是什么手脚？」',
     opts:['骑缝印，防人抽换其中页张','压角印，防文书受潮','启封印，证明本官看过','骑年印，压住年份不乱'],a:0,
     why:'多页文书接缝钤骑缝印，抽换一页则印文断作两截——故假文书再真，也难过骑缝这一关。'},
    {q:'崔珏声音压得更低：「假印盖真文，是有人贪墨；真印盖假文——你说，后者算什么？」',
     opts:['整套规矩都在作假，办的不是案，是局','办案差役一时失手','印章年久失修','刻章匠人的罪过'],a:0,
     why:'真印走完整套真流程盖出假文，说明被换掉的不是一枚印，而是从用印到归档的每一道关口。'}
   ],
   pass:{favor:{cui_jue:5},merit:4,log:'崔珏磨朱砂的手顿了半息，淡淡道：「还算可教。」——那锭自磨朱砂，已悄悄往你这边推了一分。'}},
  {type:'event',text:'崔珏的指尖在回执上轻轻一点。',
   choices:[
    {t:'听他的，写「查无实据」',r:{favor:{cui_jue:8},flags:{flag_stance:-1,flag_cui_trust:15},log:'崔珏赠你一锭自磨朱砂：这是本官教你的第一课，也是救你的第一课。'}},
    {t:'如实写明「印真文假」',r:{flags:{flag_know_truth:2,flag_refuse_count:1,flag_cui_trust:5},favor:{cui_jue:3},log:'「你这种的，在这地方活不长——或者，活得比谁都长。」'}},
    {t:'多抄一份回执底稿藏进神龛',r:{flags:{flag_know_truth:2,flag_cui_trust:8},log:'你将抄底悄悄藏好，骑缝印在灯下红得刺眼。'}}
   ]}
 ]},

/* ============ 章二 · 野庙空心录（rank1→2） ============ */
{id:'c2m1',name:'巡按走方',god:'tudi_gong',chapter:2,forced:true,main:'c2m1',reqMain:'c1m4',danger:1,money:40,merit:8,
 scroll:'晋升后辖境扩大。第一站是土地公的庙——庙小得像个狗窝，香炉里只有半根皱巴巴的香。',
 reward:{shards:{sheng:1}},
 nodes:[
  {type:'event',text:'土地公这回连你的姓都记错了，却记得让你喝热茶。他诉苦：最近使不出劲，夜里像有什么东西顺着签筒往外抽，抽得心里发空。说罢又笑：「也没什么！天庭体恤，给老夫减了三成差事呢。」',
   choices:[
    {t:'把自己的香火分他两炷',r:{money:-40,favor:{tudi_gong:15},flags:{flag_mercy_cut:1,flag_stance:1},log:'你分他两炷香，他眼眶忽然红了。'}},
    {t:'公事公办问「减了什么差事」',r:{flags:{flag_know_truth:1},log:'他从前管地脉，如今只签「知情同意」回执。'}},
    {t:'劝他告病歇着',r:{flags:{flag_tudi_memory:2},log:'「神可没有病假。神一歇，庙一冷，连壳都剩不下。」'}}
   ]},
  {type:'game',game:'pairs',difficulty:1,
   text:'巡按走方第一课，是替记性越来越差的土地公核对辖境户籍：当方门牌名籍背置案上，同名者成对。每翻两枚：同里同名则配住留案，不同则覆回。全案配齐，才知道这一阵到底少了哪几户、空了哪几庙——配不齐，这趟巡按就交不了差。',
   pass:{merit:4,favor:{tudi_gong:5},log:'名籍两两归位，你配出三户「人还在、庙已空」的缺额——土地公捧着热茶，愣了许久。'}}
 ]},

{id:'c2m2',name:'被抽灯油的神',god:'zao_jun',chapter:2,forced:true,main:'c2m2',reqMain:'c2m1',danger:2,money:50,merit:10,
 scroll:'腊月将尽，灶君的奏报匣点不着火，门神两位夜班站着都能睡着，都说「像被谁抽了灯油」。',
 reward:{shards:{huo:2}},
 nodes:[
  {type:'event',text:'灶君对着奏报匣子吹气，火苗冒半寸就灭。门上神荼郁垒抱着兵刃打哈欠，谁都不记得昨夜是谁先睡的。是夜你替二位门神站岗，半夜竟有无业野魂趁隙摸上庙墙。',
   choices:[{t:'提灯守夜',r:{log:'灰影翻墙而入！'}}]},
  {type:'quiz',who:'门上神荼郁垒',text:'你替二位门神值这半宿岗，神荼郁垒强撑困意，在门轴阴影里考你两桩门庭旧事——守夜人不懂门神的来历，镇不住翻墙的野魂。',
   qs:[
    {q:'神荼打了个哈欠：「在上古沧海度朔山，我哥儿俩拿住恶鬼之后，是怎么发落的？」',
     opts:['以苇索缚住，投去喂桃枝下的老虎','金锏当场打死','捆了上奏天帝','锁进阴山永不再放'],a:0,
     why:'度朔山桃枝下，神荼郁垒以苇索执鬼、投与虎食；后世桃符、门神皆由此来。'},
    {q:'郁垒努努嘴示意灶房：「腊月将尽，老灶君一年里最要紧的那趟差事，你可知是去哪、做什么？」',
     opts:['廿四上天，向玉帝密奏这一家一年善恶','去天庭领全年灶糖','跟咱们门神换年班','下凡给家家户户煮粥'],a:0,
     why:'灶君东厨司命，腊月廿四上天言好事，岁首回銮降福——所以他的奏报匣万万熄不得。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:4,log:'两位门神听得连连点头，困意散了大半，把守门的煞气借了你三分。'}},
  {type:'battle',enemy:'wuyeyehun',name:'无业野魂',scale:1.1},
  {type:'event',text:'天将明，你顺着昨夜动静盘问三神。',
   choices:[
    {t:'以火德帮灶君修奏报匣',requires:{path:'huo'},r:{favor:{zao_jun:10},merit:10,flags:{flag_know_truth:1},log:'「不是火没了，是准你生火的那道许可薄了。」'}},
    {t:'说起夜半的「天曹小车」',r:{favor:{men_shen:10},flags:{flag_know_truth:2,flag_ash_warehouse:1},log:'小车挨庙抽东西，车帘上绣着一个「库」字。'}},
    {t:'建议三位去天庭告状',r:{flags:{flag_stance:1},log:'三神一齐看你，像看刚死的新人：减差文书盖的是天曹的印。'}}
   ]}
 ]},

{id:'c2m3',name:'野庙·彻底空掉的土地',god:'cheng_huang',chapter:2,forced:true,main:'c2m3',reqMain:'c2m2',danger:3,money:60,merit:12,
 scroll:'山坳野庙，一位老土地端坐在神龛上，姿态完好、眉眼慈祥——眼睛里没有底。神龛后，灰毛老鼠成群惊出。',
 reward:{pill:'danmo',shards:{fa:1}},
 nodes:[
  {type:'event',text:'你问他尊姓、管哪方地界、今日几号，他一概答「好，好，都好」。他还活着，还会倒茶，可「他」已经不在了。灯油鼠被人气惊出，直扑面门。',
   choices:[{t:'护住神龛，先除鼠患',r:{log:'鼠群之后，还有一只硕大的鼠君。'}}]},
  {type:'quiz',who:'城隍',text:'随行录事的城隍牒在袖中微微发烫——城隍爷有两道勘验旧例须你先答，免得除了一窝鼠，却报回一笔糊涂案。',
   qs:[
    {q:'城隍牒浮字第一问：神依何物而灵？庙冷香断，又当如何？',
     opts:['依人间香火而灵；香断则神格日空','依金身大小而灵；金褪则神弱','依庙宇新旧而灵；庙塌即神灭','依名号多少而灵；无人唤便睡'],a:0,
     why:'神在香在，神格如灯油；老土地眼中没底，正是神格被抽、香火难以为继的症候。'},
    {q:'第二问：灯油只少一成，神却空了九成——这一笔勘验该怎么断？',
     opts:['鼠患只是表象，另有抽格之手，须深查','老鼠胃口大，全赖老鼠便是','老土地自己洒了灯油','灯油被野狗舔了'],a:0,
     why:'灯油耗损与神格流失对不上账，老鼠背不动这么大的锅；城隍要的，是你看得见明面之外的数。'}
   ],
   pass:{enemyVuln:true,merit:5,favor:{cheng_huang:3},log:'城隍牒上浮起一个淡淡的「准」字——你心里先有了账，再动手灭鼠，招招都奔着要害。'}},
  {type:'battle',enemy:'dengyou_shu',name:'灯油鼠群',scale:1.15},
  {type:'battle',enemy:'qieyou_shu',name:'窃油鼠君',scale:0.8},
  {type:'event',text:'老鼠除尽，老土地依旧微笑着给你倒茶，茶满了也不停手。',
   choices:[
    {t:'如实上报「鼠患窃油，致神失格」',r:{log:'城隍起初认可。你采纳了摆在明面上的答案。'}},
    {t:'先检查灯油存量',r:{flags:{flag_know_truth:2},log:'灯油只少一成，神却空了九成——老鼠背不动这么大的锅。'}},
    {t:'分一缕自身神格给他',r:{hp:-15,erode:5,flags:{flag_mercy_cut:1,flag_know_truth:1},log:'老土地眼神亮了半息又灭，反震得你呕血：别……给。'}}
   ]}
 ]},

{id:'c2m4',name:'一纸收回·散作纸灰',god:'cheng_huang',chapter:2,forced:true,main:'c2m4',reqMain:'c2m3',danger:2,money:50,merit:15,
 scroll:'次日再临野庙。无面差吏捧明黄文书到场，四字：「收回神格」。黑白无常陪审，差吏把残灰装进绣「库」字锦囊。',
 reward:{dshards:{cheng_huang:2}},
 nodes:[
  {type:'event',text:'文书贴上老土地眉心，他像一盏被一口气吹灭的灯。最后那一眼里什么都回来了：「替老夫……看看春……」差吏平板无波：「神格一具，验讫入库。下一庙，催。」白无常的手在抖，被黑无常死死按住。',
   choices:[
    {t:'跪接文书，谢天曹执法',r:{flags:{flag_stance:-2,flag_wen_compliance:1},log:'差吏难得点头：懂事，名字记下了。'}},
    {t:'当众质问「失德何据」',r:{flags:{flag_refuse_count:1,flag_stance:1,flag_know_truth:1},favor:{cheng_huang:5},log:'「据在文书上。文书即据。」城隍事后暗赠你一壶壮行酒。'}},
    {t:'当场点破「油量对不上」',r:{erode:3,flags:{flag_know_truth:2},log:'差吏第一次停顿：巡按好眼力。可惜，眼太好，费神。'}},
    {t:'求黑白无常留点老人残念',r:{favor:{bai_wuchang:15,hei_wuchang:5},flags:{flag_mercy_cut:1},log:'白无常冒险从索尾抖落一星残火塞进你手心。'}}
   ]},
  {type:'quiz',who:'白无常',text:'差吏的小车远去，白无常借拢索的工夫，压着嗓子考你两问阴司旧事——懂行的外包，才值得他冒险留下那星残火。',
   qs:[
    {q:'白无常晃晃高帽：「我这『一见生财』四字，专走哪一路魂，你可分得清？」',
     opts:['善魂；恶魂归老黑的锁魂链','恶魂；善魂归黑无常','枉死城里的都归我','烧了纸钱的都归我'],a:0,
     why:'白无常谢必安牌书「一见生财」，接引善魂；黑无常范无救牌书「天下太平」，持锁魂链拿凶悍恶魂。'},
    {q:'他又瞥一眼那只绣「库」字锦囊：「灰装进去，册子上可不止一格——你晓得都怎么分？」',
     opts:['分「可重封」与销毁等格，灰是存货不是废物','一律撒进忘川','全埋在庙基底下','原样还给烧香的信徒'],a:0,
     why:'回收神格入《回收神格·暂存》册，「可重封」的来日还要再装上新神——这才是最寒心的一格。'}
   ],
   pass:{favor:{bai_wuchang:8,cheng_huang:3},merit:5,log:'白无常听罢微微颔首，又从索尾悄悄多抖落半星残火：「留给肯记得他的人。」'}}
 ]},

{id:'c2m5',name:'孟婆亭·神也会忘自己是谁',god:'meng_po',chapter:2,forced:true,main:'c2m5',reqMain:'c2m4',chapterEnd:true,danger:1,money:50,merit:15,
 scroll:'奈何桥边孟婆「顺错一碗汤」让你坐锅边。她偶尔远远认出，某位身着神袍的客站在轮回队尾。',
 reward:{shards:{you:2},dshards:{meng_po:2}},
 nodes:[
  {type:'event',text:'孟婆舀一勺清汤让你照影，汤面映出你的脸，脸的边缘比三日前淡了一点。「人喝汤忘人，鬼喝汤忘鬼。你说要是有一天神也排着队来讨——他是想忘谁？」',
   choices:[
    {t:'问「神为什么会忘」',r:{flags:{flag_know_truth:2},log:'「灯里有油，神里有格。油尽灯灭，格尽——你白天不是刚见过么。」'}},
    {t:'问那位神袍客长什么样',r:{flags:{flag_know_truth:1},log:'「笑得周全，滴水不漏，身上香得像一整间公文房。」'}},
    {t:'把老土地残火洒进汤锅超度',r:{favor:{meng_po:15},flags:{flag_mercy_cut:1,flag_tudi_memory:3},log:'汤锅开出一瞬灯花。孟婆肃然：他喝上热茶了。'}}
   ]},
  {type:'quiz',who:'孟婆',text:'孟婆就着锅边腾起的热气，眯眼考你两问——奈何桥上的差事，她从不肯托付给不懂「忘」字的人。',
   qs:[
    {q:'她舀起一勺清汤：「老婆子守这锅汤，管的究竟是哪一桩事？」',
     opts:['令过桥亡魂饮汤，忘却前生再入轮回','称量亡魂一生善恶','分发轮回的号牌','引渡枉死的冤魂'],a:0,
     why:'人喝汤忘人，鬼喝汤忘鬼；前生不忘，轮回便乱——这是奈何桥第一桩规矩。'},
    {q:'「人喝汤忘人，鬼喝汤忘鬼。」孟婆盯着汤里你那淡了一线的脸缘，「要是神也排着队来讨这碗汤，意味着什么？」',
     opts:['神格将尽，连神自己都要忘了自己是谁','神想尝尝汤的咸淡','神犯了天条被罚喝汤','神要重新投胎做皇帝'],a:0,
     why:'灯里有油、神里有格；格尽则空，汤照出的脸一天淡过一天——神也会排到轮回队尾。'}
   ],
   pass:{favor:{meng_po:8},merit:5,log:'孟婆满意地搅开一锅清汤，悄悄把你汤面上的影子搅得又凝实了几分：「记着的人，多留两口热的。」'}},
  {type:'event',text:'当夜你循「库」字线索潜至天曹转运栈：无数锦囊过秤登簿，册名《回收神格·暂存》。野庙老土地那只，被扔进标着「可重封」的格子。崔珏字条落在工单架上：「看见了？先活着。你管的，现在叫证据。」',
   choices:[{t:'收好字条，回衙',r:{log:'灰不是废物，是存货。'}}]}
 ]},

/* ============ 章三 · 枉死城迷局（rank2→3） ============ */
{id:'c3m1',name:'整肃令·避劫房契',god:'yan_luo',chapter:3,forced:true,main:'c3m1',reqMain:'c2m5',danger:2,money:60,merit:12,
 scroll:'长单「枉死城整肃令」。城门口黄牛明码叫卖《提前入住避劫房契》，满城香火养着有名无实的「员外神」神位。',
 reward:{shards:{bing:1}},
 nodes:[
  {type:'event',text:'「领导说有劫，那就有呗。」黄牛鬼压低声音。你查到：住城的魂交出全部供奉避劫，而香火养着一批随时可被一纸文书收回神格的「员外神」——每个神位里都压着一枚格。',
   choices:[
    {t:'当场撕契、驱散魂队',r:{merit:15,flags:{flag_stance:1,flag_refuse_count:1},log:'魂散一半、恶战提前，产业账本却没能到手。'}},
    {t:'化名买房，卧底取证',r:{money:-80,flags:{flag_know_truth:2},log:'你花八十文买得阴德贷契书与一枚员外神位牌。'}},
    {t:'按整肃令封摊押人',r:{flags:{flag_wen_compliance:1},log:'上差温有节首次注意到你：办差利落。'}}
   ]},
  {type:'quiz',who:'黄牛鬼',text:'黄牛鬼被你按住肩膀，脸上却还挂着生意人的笑：「长官拿我之前，可先答小人两道题？这枉死城里的门道，您拎不清，封了我的摊，明日还有十个摊。」',
   qs:[
    {q:'黄牛鬼拍着房契：「魂魄凭什么进枉死城久住、还能『避劫』？长官以为是这张纸？」',
     opts:['凭阴司勘合文牒与所积阴德，契纸只是个名头','凭阳间宅子大小','凭交的香火钱多不多','认不认得城门口的差役'],a:0,
     why:'阴司居留讲勘合、论阴德；「避劫房契」卖的是一纸空名，真正被掏空的是魂魄交尽的供奉。'},
    {q:'他又凑近：「满城香火供着的『员外神』，长官可知蹊跷在何处？」',
     opts:['有仙名无仙实，每具神位里都压着一枚真神格','员外神都是金身很大的正神','员外神只管员外不管百姓','那是活人给死人立的牌位'],a:0,
     why:'「员外神」是随时可被一纸文书收回的编外神位，神位中压着的真格，才是这盘生意的本钱。'}
   ],
   pass:{merit:6,money:8,log:'黄牛鬼脸上的笑僵住了：「……长官是真懂行。」他袖中的账册，被你顺手摸了个正着。'}}
 ]},

{id:'c3m2',name:'毒沼与厉鬼·账房在死人堆',god:'cui_jue',chapter:3,forced:true,main:'c3m2',reqMain:'c3m1',danger:4,money:100,merit:20,
 scroll:'枉死城最底层，相柳毒沼渗进城墙。欠债的魂被扔进沼边「工偿」化成厉鬼，总账簿藏在沼心账台。',
 reward:{pill:'wang',shards:{you:2}},
 nodes:[
  {type:'event',text:'雾里九首残影若隐若现，厉鬼在沼边徘徊，被扔进沼前它们也都是还债的苦魂。',
   choices:[{t:'涉沼前行',r:{log:'厉鬼闻见生人气，扑了上来。'}}]},
  {type:'game',game:'lights',difficulty:2,
   text:'毒沼下陷足成泽，唯有人工打下的九根灯桩可落足。踏一桩，此桩与上下左右四桩磷火齐翻——旧例「磷灯引路阵」：令九桩尽数通明，沼面才浮出通往账台的干路；灯阵不开，你便要在没膝毒沼里迎击四面围来的厉鬼。',
   pass:{enemyVuln:true,merit:6,log:'九桩磷火齐明，毒沼上浮起一条干硬的磷光路。围来的厉鬼被灯火映出原形，反倒畏光退了半步。'}},
  {type:'battle',enemy:'ligui',scale:1},
  {type:'event',text:'沼中一方残台，毒气蒸腾，你神躯已带伤。账台就在前方黑雾之后。',
   choices:[
    {t:'吞随身丹药，调息片刻',r:{heal:35,log:'你就着毒雾咽下丹药，神躯稍复。'}},
    {t:'带伤猛进，抢一个先手',r:{hp:-10,atkBuff:0.15,log:'你把痛楚压进下一击。'}}
   ]},
  {type:'battle',enemy:'wangsiguiwang',name:'枉死鬼王',scale:0.85},
  {type:'event',text:'鬼王伏诛，沼心账台上那本总账还滴着水。',
   choices:[
    {t:'原账交给崔珏',r:{favor:{cui_jue:8},flags:{flag_cui_trust:15,flag_know_truth:2},log:'入册员外神里有三位，正是近年「失德被削」、不肯纳供奉的旧神。'}},
    {t:'抄一份副本，原件上缴',r:{favor:{cui_jue:4},flags:{flag_cui_trust:8,flag_know_truth:2},log:'两头下注。温有节稍后会点破，并「欣赏」你。'}},
    {t:'用账单向链条鬼差索贿',r:{money:200,erode:8,flags:{flag_ruthless:1},log:'你中饱私囊，被温有节的人暗中录下凭证。'}}
   ]}
 ]},

{id:'c3m3',name:'温有节·滴水不漏',god:'cui_jue',chapter:3,forced:true,main:'c3m3',reqMain:'c3m2',danger:3,money:80,merit:15,
 scroll:'天曹驻城办事处窗明几净，柏木香袅袅。主事温有节亲自斟茶，把你的证据一张张夸完，再一张张归档「查无实据」。',
 reward:{shards:{bing:1,fa:1}},
 nodes:[
  {type:'event',text:'产业链他全认：「是本主事体恤孤魂的预付式安置，略有瑕疵。」茶不凉，笑不减。「真的账为什么不怕人查？因为每一页都合规。吃人的不是账，是准它记账的那套规矩。」',
   choices:[
    {t:'把真回执抄底拍在桌上',r:{flags:{flag_know_truth:2,flag_wen_compliance:-1},log:'温有节瞳孔微缩、笑意不变：留底的人，稀缺。'}},
    {t:'收下「协办」名帖，暂与周旋',r:{flags:{flag_wen_compliance:1,flag_stance:-1},log:'你收下名帖。此帖可调动一次天曹差役。'}},
    {t:'直言「我会查到相爷头上」',r:{flags:{flag_refuse_count:1,flag_know_truth:1},log:'他大笑续茶：那本主事等着用你的字。'}},
    {t:'问他「你自己还是神么」',r:{erode:2,flags:{flag_know_truth:2},log:'他摩挲袖口，腕骨处一圈极淡的格纹：本主事是用得久的人。'}}
   ]},
  {type:'quiz',who:'温有节',text:'证据一张张被他归进「查无实据」，温有节却忽然替你斟满茶，笑得滴水不漏：「别急着走。本主事这儿也有两问——答得上来，才配跟我这间屋子里的规矩说话。」',
   qs:[
    {q:'「你也看见了，产业链本主事全认。」他推过茶盏，「那你说——真的账，为什么不怕人查？」',
     opts:['因为每一页都合规，查不出错处','因为账本上从不算钱','因为查账的都不识字','因为账本会自己变字'],a:0,
     why:'账面上的每一笔都在规矩之内，错的不是某一页账，而是准许它这样记账的整套成例。'},
    {q:'他盯着你的眼睛：「都说本主事这屋吃人。那你倒说说——吃人的，到底是什么？」',
     opts:['是准它记账的那套规矩','是账房里的鬼','是算盘成了精','是借钱不还的人'],a:0,
     why:'「吃人的不是账，是准它记账的那套规矩」——合规之恶最难驳，因为它从不违例。'}
   ],
   pass:{shield:0.3,merit:6,log:'温有节笑意不变，眼底却冷了一分：「有意思。」满室柏木香里，你周身先凝起一层防备他的气场。'}},
  {type:'event',text:'你不肯领协办穷奇案的人情。温有节便「请」你试试新收的护印傀儡——一尊穿旧神袍、动作整齐划一的无脸神。面具里一缕残识轻声：「我……签过字的……」',
   choices:[{t:'拔刀',r:{log:'傀儡提印，踏前一步。'}}]},
  {type:'battle',enemy:'keshenkuilei',name:'壳神傀儡',scale:0.8}
 ]},

{id:'c3m4',name:'放兽与收兽·穷奇',god:'yan_luo',chapter:3,forced:true,main:'c3m4',reqMain:'c3m3',danger:5,money:120,merit:25,
 scroll:'天曹「不慎」遗失一道封印，四凶之一穷奇破封。你被安排正面拦截，收网队却已在云端待命。',
 reward:{pill:'xiong',shards:{fa:2}},
 nodes:[
  {type:'event',text:'穷奇冲庙食人，铜铃大眼里全是讥诮。它认得开锁的人：「又是你放的咱家……」',
   choices:[{t:'正面截住凶兽',r:{log:'穷奇伏低身躯，狂暴的杀意在毒雾里炸开。'}}]},
  {type:'game',game:'memory',difficulty:3,
   text:'天曹「遗失」的那道封印，本是一套连环镇兽符：符记依序亮起，序位一丝不差，封口才镇得住四凶。封既破，你只能就地补位——法坛三转、符序渐长，照原序逐一复按，先替断封续上镇力，才换得正面截下穷奇的一线先机；记错一环，封印反噬、本轮重转。',
   pass:{shield:0.3,enemyVuln:true,merit:8,log:'三转符序不差，断封的镇兽之力重新流转，在穷奇扑出的路径上亮起一张残网——它冲庙的那一扑，被生生拖慢。'}},
  {type:'battle',enemy:'qiongqi',scale:0.85},
  {type:'event',text:'你九死一生截住穷奇，天曹收网队却齐齐落下神索，功劳簿写「温有节率众平凶」。被毁祠堂的三位旧神同日被削，神位三日内「重封」给了新神。',
   choices:[
    {t:'出力争回凶兽与功劳',r:{merit:5,flags:{flag_know_truth:2,flag_stance:1,flag_refuse_count:1},log:'冲突中你抢下一碎片与穷奇半句：「相……」三位旧神仍晚了一步。'}},
    {t:'冷眼看完全程，记下全链',r:{flags:{flag_know_truth:3,flag_neutral_pact:1},log:'放—收—削—封—收钱，一条龙，严丝合缝。'}},
    {t:'按安排领「协剿」功',r:{money:150,merit:20,erode:5,flags:{flag_wen_compliance:1},log:'被毁祠堂的小神在你背后哭，你听得见。'}},
    {t:'拼受伤救下一名旧神残识',r:{erode:4,flags:{flag_mercy_cut:1,flag_know_truth:2},log:'残识告诉你：新神上任首日就被「预签」了回收同意书。'}}
   ]}
 ]},

{id:'c3m5',name:'崔珏篡簿·主簿的保举',god:'cui_jue',chapter:3,forced:true,main:'c3m5',reqMain:'c3m4',chapterEnd:true,danger:1,money:80,merit:20,
 scroll:'判官值房灯火如豆。你名字旁，天曹早已朱批「可用至章末，另注」——另注之下是空白的《回收同意书》编号。',
 reward:{shards:{you:3}},
 nodes:[
  {type:'event',text:'崔珏提笔在生死簿上为你改注一行实缺履历，把「外包阴神」篡成「阴阳两界实授主簿候补」。外包随时可削，实授需三堂会审。他落笔时手腕极稳，墨却洇开一点：「本官掌簿四百年，没改过一个字。今天为你改第一个。」',
   choices:[{t:'门外脚步声响，钟馗与陆之道已到',r:{log:'崔珏瞬间合簿，换上官腔：该员办事勤谨，本官保举主簿，诸位可有异议？'}}]},
  {type:'quiz',who:'崔珏',text:'合簿之前，崔珏到底没忍住，用判官笔杆点着你名字旁那行空白朱批：「本官要保举的人，临考不能露怯。最后两问，答给我听。」',
   qs:[
    {q:'「你如今是『外包阴神』，天曹一纸文书便可削。」他笔尖一挑，「本官若把你改成『实授』，中间隔着哪道关口？」',
     opts:['三堂会审，非一处可定生死','本官一句话即可','灶王爷上天说一声','过了奈何桥就算数'],a:0,
     why:'外包随时可被一纸收回；实授需三堂会审、录于正册，故崔珏篡这一行，是拿四百年清名给你上保险。'},
    {q:'他又问：「本官掌的这卷生死簿，朱笔落下，最能定的是何物？」',
     opts:['寿数履历、生死勾销与轮回去向','俸禄几石','庙产几何','香火肥瘦'],a:0,
     why:'生死簿录世人寿数履历、勾生死、定轮回；崔珏朱笔四百年不改一字，改的这一行才重逾泰山。'}
   ],
   pass:{favor:{cui_jue:8},merit:8,log:'崔珏嘴角几不可察地一动：「明日公堂，别给本官丢人。」他袖中那锭朱砂，已作了给你的私赏。'}},
  {type:'event',text:'保举前夜，崔珏屏退左右，等你一句话。',
   choices:[
    {t:'立誓「查清到底」',r:{favor:{cui_jue:10},flags:{flag_cui_trust:15,flag_know_truth:1},log:'「别谢。你给我活着爬到能改规矩的位子——这是本官押的注。」'}},
    {t:'劝他别冒这个险',r:{favor:{cui_jue:6},flags:{flag_cui_trust:10},log:'「四百年没做过一件不该做的事，手痒。」'}},
    {t:'转身把篡簿之事密报温有节',r:{money:300,erode:10,flags:{flag_wen_compliance:2,flag_cui_trust:-40},favor:{cui_jue:-20},log:'崔珏不发一言，把你名字旁新改的墨又亲手刮掉。'}}
   ]}
 ]},

/* ============ 支线 s01～s05（章一） ============ */
{id:'s01',name:'野狐占庙案',god:'tudi_gong',chapter:1,side:'s01',danger:1,money:50,merit:10,
 scroll:'土地公辖下一座小土庙被野狐占了，狐精自称「新任土地，天庭御封」，掏出一张皱巴巴的《山神协理帖》。',
 reward:{shards:{sheng:1}},
 nodes:[
  {type:'event',text:'帖子的纸质油汪汪的，还带着烤红薯的香气。土地公嘟囔：「老夫怎么不记得……近来不记得的事也多了。」',
   choices:[
    {t:'当场拆穿帖子是烤红薯纸仿的',r:{log:'野狐恼羞成怒，耳后腾起狐火。'}},
    {t:'先问庙中原土地的去向',r:{flags:{flag_know_truth:1},log:'原土地三个月前「被减了差」，此后再没显过灵。'}},
    {t:'收野狐两炷香，睁只眼闭只眼',r:{money:20,flags:{flag_ruthless:1},log:'你掂了掂两炷香，把到了嘴边的话咽了回去。'}}
   ]},
  {type:'quiz',who:'野狐',text:'野狐见你盯着帖子不放，往供桌上一盘，尾巴尖儿扫过烛台，眯眼笑成一团：「欸——天庭办事，先过嘴关。你家神仙祖祖辈辈都爱跟咱们狐类斗机锋。你若问得住我，我任你拆庙；问不住——这庙的红薯，咱俩分着吃。」',
   qs:[
    {q:'野狐把那张《山神协理帖》举到你鼻尖：「我这帖子上盖的可是天庭御印，你凭什么说它是假的？」',
     opts:['纸质油汪汪，还带着烤红薯气','字写得歪歪扭扭','帖子比正经文书小了一圈','御印哪有红色的'],a:0,
     why:'辨伪看凭据：纸、墨、印、绶逐处核验。天庭文书用桑皮公文纸，这张——分明是包烤红薯的草纸。'},
    {q:'野狐又眯眼逼问：「神仙不怕刀兵、不怕天劫，你倒说说，神仙最怕少了哪一样？」',
     opts:['香火','金身','庙宇','名号'],a:0,
     why:'神依人间香火而灵——庙冷香断，神格便一天天空下去。野狐占庙，占的就是那口香。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:3,log:'两问两答，野狐的耳朵先耷拉了，耳后狐火弱了三分——它的气焰，被你问灭了。'}},
  {type:'battle',enemy:'yehu',scale:1},
  {type:'event',text:'野狐被你打服，夹着尾巴等你发落。',
   choices:[
    {t:'打跑了事',r:{merit:8,log:'野狐化作一道青烟逃出庙门。'}},
    {t:'收它做庙祝看庙',r:{renqing:1,favor:{tudi_gong:5},flags:{flag_mercy_cut:1},log:'野狐大喜，从此做了你在乡野间的小耳目。'}},
    {t:'以生息地脉帮它在荒坟另开小祠',requires:{path:'sheng'},r:{favor:{tudi_gong:10},flags:{flag_mercy_cut:1},log:'你引一缕地脉，荒坟旁多了个巴掌大的狐仙小祠。'}}
   ]}
 ]},

{id:'s02',name:'田埂拘魂令',god:'tudi_gong',chapter:1,side:'s02',danger:2,money:60,merit:12,
 scroll:'阎罗王殿转批：一个老农魂蹲在自家田埂不肯走，差役拘不动。他说秧苗刚插，「人误地一时，地误人一年」。',
 reward:{shards:{you:1}},
 nodes:[
  {type:'event',text:'老农抱着一把没烧完的稻谷，鞋上还沾着阳间的泥。他的执念在田埂上绕成死结，黑灯瞎火，连轮回路都寻不见。',
   choices:[
    {t:'出示拘票，强行拘拿',r:{log:'老农攥紧了秧苗，执念骤然化作黑气——可田埂上没有灯，他不知道该往哪条路退。'}},
    {t:'回村替他给儿子托梦「夏至前灌水」',r:{renqing:1,skip:2,log:'你跑完这趟人情，老农含泪把稻谷塞进你手里。心结一解，灯不必点、魂不必拘，他自己就望得见轮回路。'}},
    {t:'嫌费事，喊阴兵直接锁拿',r:{flags:{flag_ruthless:1},log:'你祭出锁魂链，老农的执念被激得暴涨。'}}
   ]},
  {type:'game',game:'lights',difficulty:2,
   text:'田埂尽头一片漆黑，引魂灯九盏明灭不定。踏亮一盏，相邻四盏明暗齐翻——这是引魂灯的老阵式。令九灯尽数通明，给老农的执念照出一条能走的路，他才肯跟你走；灯阵不开，拘票递到眼前也是白搭。',
   pass:{enemyVuln:true,merit:4,log:'九灯齐明，田埂尽头浮起一条淡金色的轮回路。老农的执念松了，黑气却还剩最后一口，不肯散。'}},
  {type:'battle',enemy:'tiangengzhinianhun',name:'田埂执念魂',scale:1.05},
  {type:'event',text:'事了，老农走前往你兜里塞了把没烧完的稻谷——暖得像刚从阳间田里摘下来。',
   choices:[{t:'收好稻谷，继续办差',r:{log:'横死魂多是苦人，你记下了。'}}]}
 ]},

{id:'s03',name:'火灵归位',god:'tudi_gong',chapter:1,side:'s03',danger:2,money:50,merit:10,
 scroll:'村窑火三天三夜压不下去，火里坐着个哇哇大哭的火灵童子——他是长明灯的灯神余烬，主灯「被调去天上省火油」了。',
 reward:{shards:{huo:2}},
 nodes:[
  {type:'event',text:'火灵哭得窑火一窜三尺高，脸上还挂着两道烟灰泪。',
   choices:[
    {t:'以火德神格相引，哄它归位',requires:{path:'huo'},r:{favor:{tudi_gong:5},flags:{flag_know_truth:1},skip:2,log:'你放出一缕温和火光，火灵破涕为笑，乖乖归位长明灯。'}},
    {t:'拿水硬浇',r:{flags:{flag_ruthless:1},log:'冷水激上窑火，火灵当场暴怒，焰色发青！'}},
    {t:'问它「长明灯为何调走」',r:{flags:{flag_know_truth:1},log:'它奶声奶气：「上头说……省油，灯火统一管。」'}}
   ]},
  {type:'game',game:'pairs',difficulty:1,
   text:'长明灯被调走后，窑神庙三十六盏灯位乱了套。灯神牌背置案上，同灯位者成对：每翻两牌，同位则配住留案、异位则覆回。全案配齐，灯位才依序重燃，哭得发昏的火灵童子方肯听你说话——配不齐，窑火便一直这么窜着。',
   pass:{enemyVuln:true,merit:4,log:'灯牌两两归位，窑火随之矮成温和的橘黄。火灵童子抽噎着抬起头，看你的眼神少了三分戒备。'}},
  {type:'battle',enemy:'huolingtongzi',name:'火灵童子',scale:0.95},
  {type:'event',text:'火灵认你做了临时灯主，缩在你掌心像一簇暖融融的小火苗。',
   choices:[{t:'把它安顿回长明灯',r:{log:'灯火重新亮起，恰好够照亮一户夜归的人。'}}]}
 ]},

{id:'s04',name:'判官夜抄手',god:'cui_jue',chapter:3,side:'s04',danger:1,money:40,merit:8,
 scroll:'崔府君朱砂与抄手都缺，扔来三页副簿让你照抄亡人名册：「抄错一个字，明天阳间就多一口空棺材。」',
 reward:{shards:{you:1}},
 nodes:[
  {type:'event',text:'三页名册里夹着一处被人改过的花押，墨色比别处新，印泥却对不上冥司的制式。',
   choices:[
    {t:'照抄，多一事不如少一事',r:{favor:{cui_jue:3},flags:{flag_cui_trust:5},log:'崔珏翻到那一页，叹气：手稳。可惜。'}},
    {t:'圈出花押，如实呈报',r:{favor:{cui_jue:8},flags:{flag_cui_trust:12,flag_know_truth:1},log:'崔珏另眼相看。值夜小吏却心虚，偷偷放进一只墨柜鬼。'}},
    {t:'私抄一份花押留底',r:{flags:{flag_know_truth:1},log:'你把那枚异样花押摹在袖中纸上。'}}
   ]},
  {type:'quiz',who:'崔珏',text:'你提笔待抄，崔府君却把三页副簿按住：「慢。替本官抄簿前，两问须答——抄错一个字，阳间便多一口空棺材，这差事不是识字就能干的。」',
   qs:[
    {q:'崔珏问你：「亡人名册上，这一处本人亲画、代代笔体不同、最难仿冒的草体签记，叫作什么？」',
     opts:['花押','骑缝','朱批','勘合'],a:0,
     why:'花押是本人亲笔画押，墨色新旧一对、笔锋一校，改没改过名册便藏不住。'},
    {q:'「名册抄错一个字，干系几何？」他盯着你的笔。',
     opts:['寿数履历错位，阳间多一口空棺、阴间多一缕错魂','顶多罚抄一遍','只扣当月香火钱','错了擦掉重写即可'],a:0,
     why:'冥簿勾人以名籍为凭，一字之差，三魂错位、投录皆错——抄簿人的笔，与判官的朱笔一样重。'}
   ],
   pass:{enemyVuln:true,merit:5,favor:{cui_jue:3},log:'崔珏松开按簿的手：「下笔吧，手要稳。」你腕底不乱，连墨柜鬼扑出时都比平日快了半招。'}},
  {type:'battle',enemy:'moguigui',name:'墨柜鬼',scale:1},
  {type:'event',text:'崔珏袖手看完你收拾墨柜鬼，破天荒地给你斟了半盏冷茶。',
   choices:[{t:'谢过府君',r:{favor:{cui_jue:2},log:'他点了点头，没说话。'}}]}
 ]},

{id:'s05',name:'阎君殿错投录',god:'yan_luo',chapter:1,yamen:true,side:'s05',danger:2,money:70,merit:14,
 scroll:'善人投了畜生道、屠夫投了富贵家、一个秀才投去了忘川——三封判词全错。朱笔没错，是装判词的筒子被换了。',
 reward:{shards:{you:2}},
 nodes:[
  {type:'event',text:'三魂堵门，阎王爷脸黑得像锅底。牛头等的筒写「善」里面却是恶签；马面赌咒没离岗；夜值小鬼说看见「朱衣吏」来过——可当夜根本没有朱衣吏当值。',
   choices:[{t:'调取三套签筒，当堂验个真伪',r:{log:'三只签筒一字排在殿上——粗看一模一样。'}}]},
  {type:'game',game:'spot',difficulty:2,
   text:'冥司签筒出自同一副模子，唯有经制房之手的真筒留着暗记：第一轮辨印角、第二轮辨墨色、第三轮辨筒框边线。三轮辨认皆中，才算「验明正身」，你才有资格开口定罪；辨错或超时，便是当堂失态，重来。',
   pass:{merit:6,log:'三处暗记连中，围观的鬼差嗡的一声议论开——那名外包老差役额角，见了汗。'}},
  {type:'event',text:'真筒既出，三条线索在你脑中过了一遍，你要当场指认。',
   choices:[
    {t:'指认小鬼偷懒看错',r:{merit:-7,flags:{flag_ruthless:1},log:'你冤枉了好人，真犯就此脱身，赏钱减半。'}},
    {t:'点破「筒被整组调换」，锁定外包老差役',r:{flags:{flag_know_truth:1},skip:1,log:'能进出值房、整组调筒的，只有当值外包老差役——他在偷卖「好胎」名额。暗记当堂比对，他抵赖不得，俯首认罪，不必动刑。'}},
    {t:'不听分辩，直接定罪马面',r:{flags:{flag_ruthless:1},log:'马面又惊又怒，被逼得反噬出手！'}}
   ]},
  {type:'battle',enemy:'fanshiyinchai',name:'反噬阴差',scale:1.1},
  {type:'event',text:'拿获老差役，搜出一小袋「调换回执费」。钱上的制式印，赫然是天曹库记。',
   choices:[{t:'把钱袋封作证物',r:{log:'一桩普通舞弊案，轻轻挂上了天曹的边。'}}]}
 ]},

/* ============ 支线 s06～s10（章二） ============ */
{id:'s06',name:'灶君腊月奏报造假案',god:'zao_jun',chapter:2,side:'s06',danger:3,money:80,merit:18,
 scroll:'灶君年底《腊月奏报》被天庭打回，罚俸三月。老灶君喊冤：有人替他奏了一本假的。',
 reward:{shards:{huo:2},pill:'dan'},
 nodes:[
  {type:'event',text:'「张家儿子孝不孝，老夫在灶台蹲了一年还能说错？」灶君把烧焦的奏报匣子拍得山响。',
   choices:[{t:'连夜取证',r:{log:'你从灶膛灰、门神、许愿簿三处下手。'}}]},
  {type:'event',text:'三处证词，先查哪一桩？',
   choices:[
    {t:'取灶膛灰烬验神火',requires:{path:'huo'},r:{favor:{zao_jun:8},flags:{flag_know_truth:1},log:'灰里有两份神火，一份灶君的，一份陌生的冷火。'}},
    {t:'问门神当夜可有人登灶',r:{flags:{flag_know_truth:1},log:'你拿「黄狗叫了半宿」戳破神荼睡岗，换来半句：来的是递「省油帖」的天曹小车吏。'}},
    {t:'查张家腊月许愿簿',r:{flags:{flag_know_truth:1},log:'真奏报被换成「户户该减灶君香火、改纳天曹供奉」的模板假报。'}}
   ]},
  {type:'event',text:'铁证在手，如何结案？',
   choices:[
    {t:'按回访吏暗示，定灶君年老昏聩',r:{money:120,erode:4,flags:{flag_wen_compliance:1,flag_ruthless:1},favor:{zao_jun:-10},log:'灶君被罚，神格当场再被切去一格，失神半瞬。'}},
    {t:'以双份神火灰+模板假报反告车吏',r:{favor:{zao_jun:15},flags:{flag_refuse_count:1},log:'小车吏见事败，竟放壳行凶！'}},
    {t:'只救灶君，烧掉假报不追车吏',r:{favor:{zao_jun:10},flags:{flag_mercy_cut:1},log:'你把假报烧了当没发生，小车吏记下你一个「好」。'}}
   ]},
  {type:'game',game:'spot',difficulty:2,
   text:'当堂对质，三份《腊月奏报》摆作一排——真本出自灶君灶膛神火，假本出自天曹模板，肉眼几不可辨。按制房旧例三轮辨认：辨印角朱缺、辨墨色深浅、辨边框单线双线。三轮皆指认真本，灶君的冤才洗得脱；认错一轮，便是当堂翻案失败，重来。',
   pass:{enemyVuln:true,merit:6,favor:{zao_jun:5},log:'三处暗记连中，假奏报被当堂挑出。灶君一拍灶台，小车吏脸色煞白，见事败便放壳行凶——早被你看破了路数。'}},
  {type:'battle',enemy:'shengyouxiaocheli',name:'省油小车吏',scale:1.1}
 ]},

{id:'s07',name:'冒牌阴神案',god:'cheng_huang',chapter:2,side:'s07',danger:3,money:90,merit:20,
 scroll:'庙会丢魂、淫祠索祭、路口卖路引——三起十年前就结过的旧案同时复发，作案者报的全是在籍阴神的名号。',
 reward:{dshards:{cheng_huang:3},shards:{you:1}},
 nodes:[
  {type:'event',text:'你在夜路口设伏，两道冒牌身影果然现身，签文格式竟分毫不差。',
   choices:[{t:'拿下假差',r:{log:'两道黑影分头逃窜。'}}]},
  {type:'quiz',who:'城隍',text:'黑影将遁，城隍牒在你袖中亮起——老爷当夜传你两问辨伪心法：假阴神签文背得再熟，过不了这一关。',
   qs:[
    {q:'城隍牒浮字：阴神巡夜，签文格式、巡路时辰皆可仿，唯独哪一样冒充不来？',
     opts:['城隍亲定、逐夜更换的暗口令','腰间木牌的新漆色','走路时脚步轻重','说话嗓门大小'],a:0,
     why:'签式时辰皆能打探，唯有城隍亲授、当夜才知的暗口令，非案下自己人无从得悉——一问便知内鬼。'},
    {q:'假差在路口卖「路引」、向野庙索祭，这类不在朝廷祀典之内、私自立受祭的祠庙，称作什么？',
     opts:['淫祠','城隍庙','土地庙','家庙'],a:0,
     why:'不在祀典而私自立祠受祭者为「淫祠」，正神不享其祭，索祭的多半是邪祟或冒牌阴神。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:6,log:'两道黑影逃窜的方位、暗哨的空隙，都在你心里——你先一步封住了他们的去路。'}},
  {type:'battle',enemy:'maopaijiachai',name:'冒牌假差',scale:1.15},
  {type:'event',text:'三证并勘：假阴神知道巡路时辰、签文格式，唯独背不出城隍亲定的暗口令——内鬼就在城隍案下。',
   choices:[
    {t:'当堂指认书吏',r:{flags:{flag_know_truth:1},log:'书吏被天曹许了「转正神格」，被逼入绝路，放出一具试用壳神！'}},
    {t:'打草惊蛇，先拿外围',r:{flags:{flag_ruthless:1},log:'书吏携册逃入枉死城，你没能拦住。'}},
    {t:'收下书吏的买路钱',r:{money:150,erode:5,flags:{flag_ruthless:1},log:'真神蒙冤，城隍辖区又丢了六个魂。'}}
   ]},
  {type:'battle',enemy:'guanshen',name:'冠神',scale:0.7},
  {type:'event',text:'案破，城隍屏退左右，取出半张私藏旧回执——和你章一那张一模一样。「十年了，第一道印是假的，第二道回执，从来都是真的。」',
   choices:[{t:'收好这半张回执',r:{favor:{cheng_huang:5},flags:{flag_cui_trust:5,flag_know_truth:1},log:'城隍拍了拍你的肩，没再多说。'}}]}
 ]},

{id:'s08',name:'孟婆汤被掺水案',god:'meng_po',chapter:2,side:'s08',danger:3,money:70,merit:18,
 scroll:'近日过桥亡魂喝完汤还记得前生，轮回大乱。孟婆舀一勺给你照影：汤里掺了忘川生水，还有一撮纸灰——灰是神格灰。',
 reward:{shards:{sheng:2},dshards:{meng_po:1}},
 nodes:[
  {type:'event',text:'汤锅翻涌，灰末在沸水里浮沉。',
   choices:[
    {t:'溯一个没忘干净的魂',requires:{path:'you'},r:{favor:{meng_po:5},flags:{flag_know_truth:1},log:'他记得排队时身后有「神袍客」，自己被舀了两勺。'}},
    {t:'以生息净化析出汤中灰',requires:{path:'sheng'},r:{favor:{meng_po:5},flags:{flag_know_truth:1},log:'汤面浮起七八枚泡胀了的神格签，编号被忘川水浸得发花——须得两两配回同号，才看得清来处。'}},
    {t:'查送水的担水鬼',r:{flags:{flag_know_truth:1},log:'他赌咒只从固定泉眼挑水，泉眼边却尽是天曹小车的辙印。'}}
   ]},
  {type:'game',game:'pairs',difficulty:2,
   text:'孟婆把汤锅搅开，神格签背置案上，同号者成对。每翻两签：同号则配住留案，异号则覆回。全案配齐，编号便显——这些灰签出自哪一格锦囊，瞒不过你。配不齐，孟婆亭的案子就开不了封。',
   pass:{enemyVuln:true,merit:6,favor:{meng_po:5},log:'神格签两两归一，编号拼出三个小字：「可重封」——灰签的来路，直指天库。'}},
  {type:'event',text:'线索指向天库。',
   choices:[
    {t:'顺着编号硬闯天库',r:{flags:{flag_know_truth:2},log:'库吏以「涉密」相拒，放出库鬼拦你。'}},
    {t:'只帮孟婆洗锅换净水',r:{favor:{meng_po:15},flags:{flag_mercy_cut:1},log:'「孩子，有些锅盖着，才能继续给人一条干净路。」'}},
    {t:'把灰证卖给天曹库吏换钱',r:{money:130,erode:6,flags:{flag_ruthless:1},favor:{meng_po:-15},log:'孟婆从此不再给你照影汤。'}}
   ]},
  {type:'battle',enemy:'tiankukugui',name:'天库库鬼',scale:1.1},
  {type:'event',text:'库鬼身后散出一页《磨灰回掺定额》：故意让神格灰微量回掺孟婆汤，是为了让亡魂忘不干净、还认得旧神牌位——好收割来世香火，输送给「重封」的新神。',
   choices:[{t:'灰是废料、是库存，还是香火的原料',r:{log:'你只觉得后颈一阵发凉。'}}]}
 ]},

{id:'s09',name:'药师壶中春',god:'sun_simiao',chapter:3,side:'s09',danger:2,money:60,merit:14,
 scroll:'城隍辖下疫气流行，大夫们的药集体失效。药王临凡开馆，馆前却冷清——百姓供不起高价「天曹药引」。',
 reward:{shards:{sheng:2},pill:'dan'},
 nodes:[
  {type:'event',text:'药王请你抓三味阴间才有的药引。枉死墙根的返魂芽旁，疫鬼正团团打转。',
   choices:[{t:'采药',r:{log:'疫鬼闻见生人气，一拥而上。'}}]},
  {type:'quiz',who:'孙思邈',text:'药王将药锄横在墙根，先不教你采药：「返魂芽旁疫鬼环伺，不懂医理的人过去，是送命，不是救人。答老朽两问，再动手不迟。」',
   qs:[
    {q:'孙思邈抚须问：「老朽那部方书，为何以『千金』二字为名？」',
     opts:['人命至重，有贵千金；一方济之，德逾于此','一方药须售千金之价','千金之家才请得动药王','千金方只用千金难求的药材'],a:0,
     why:'《千金方》之名，取「人命至重，有贵千金」之意——药为救人而立，不为天曹的高价药引而立。'},
    {q:'「疫鬼缠身之地，药引之外，最要紧的一桩是什么？」他看向冷清的馆门。',
     opts:['药须让寻常百姓也用得起、抓得到','药引越贵越显灵','只给供得起香火的人家施药','先画符驱鬼，药可不吃'],a:0,
     why:'疫气流行，药若成了天价「天曹药引」，纵有千金方也救不得满城人——义诊与告示，才是破疫的引子。'}
   ],
   pass:{enemyVuln:true,merit:6,favor:{sun_simiao:5},log:'药王含笑点头，往你掌心塞了一包「辟瘟散」：「带着。」疫鬼扑来，你鼻端先有一缕清神药香。'}},
  {type:'battle',enemy:'yigui',name:'疫鬼',scale:1.05},
  {type:'event',text:'药煎好了，药王问你该怎么开价。',
   choices:[
    {t:'按天曹「药引价」卖，所得捐回药馆',r:{money:80,log:'你入账不菲又尽数捐回，民心却只是一般。'}},
    {t:'分文不取，义诊三日',r:{favor:{sun_simiao:15},flags:{flag_mercy_cut:1},log:'药王大喜，连称「人命至重，有贵千金」。'}},
    {t:'把药方抄成告示满城贴',r:{favor:{sun_simiao:10},flags:{flag_refuse_count:1,flag_stance:1},log:'你断了天曹药引的财路，小吏放话记下了你。'}}
   ]}
 ]},

{id:'s10',name:'吕祖黄粱熟',god:'lv_dongbin',chapter:3,side:'s10',danger:3,money:60,merit:12,
 scroll:'野店一位背剑的邋遢道人煮黄粱，让你「趁饭没熟，陪我做场梦」。',
 reward:{shards:{bing:2}},
 nodes:[
  {type:'event',text:'你梦见自己三十年顺风顺水：考入编制、一路升到判官、朱笔在握——梦里每升一次官，镜中人的眼神就空一分。第三幕，镜中人竟伸手替你接旨。',
   choices:[{t:'在梦里拔刀',r:{log:'镜中朱衣转过身来，长着你的脸。'}}]},
  {type:'quiz',who:'邋遢道人',text:'锅盖半掀未掀，黄粱香气里那邋遢道人懒懒开口：「入梦容易出梦难。你若连是谁点的这场梦都答不上，镜里那位，可就替你把旨接了。」',
   qs:[
    {q:'「一锅黄粱未熟，三十年功名已尽。」道人拿筷子敲锅沿，「这典故，说的是哪位祖师的点化？」',
     opts:['钟离权点化吕洞宾（黄粱一梦）','太上老君点化尹喜','东华帝君王玄甫','张果老倒骑毛驴'],a:0,
     why:'吕洞宾（纯阳子）于邯郸旅舍遇钟离权，黄粱未熟而历一世荣枯，醒后彻悟入道——此刻锅里的黄粱，正是同一个局。'},
    {q:'「你可知贫道是哪一宗、道号什么？」道人斜你一眼。',
     opts:['全真纯阳，吕洞宾，号纯阳子','正一道张道陵','茅山陶弘景','全真丘处机'],a:0,
     why:'背剑邋遢、黄粱点梦者，正是八仙之一、全真道尊为祖师的吕洞宾，道号纯阳子。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:6,favor:{lv_dongbin:5},log:'「算你还有些道缘。」道人指尖一缕纯阳剑气弹在你眉心——再入梦境时，镜中朱衣的动作在你眼里慢了三分。'}},
  {type:'battle',enemy:'huanzhongzhuyi',name:'幻中朱衣',scale:0.7},
  {type:'event',text:'黄粱饭香扑鼻，你猛地睁眼。邋遢道人正往你碗里夹菜。',
   choices:[
    {t:'拜谢求剑',r:{favor:{lv_dongbin:12},log:'吕祖大笑，授你两道纯阳剑意，又塞一张旧货半价回收券。'}},
    {t:'问「梦尽头位子上的，是不是我」',r:{flags:{flag_know_truth:1},favor:{lv_dongbin:8},log:'「是每一个肯一路签字的你。」'}},
    {t:'嘴硬说是妖法',r:{money:30,log:'吕祖把锅盖扣你头上：黄粱熟了，吃饭。'}}
   ]}
 ]},

/* ============ 支线 s11～s15（章三，s15 为跨章长单） ============ */
{id:'s11',name:'秦广王生死簿涂改案',god:'qin_guang',chapter:3,side:'s11',danger:4,money:100,merit:35,
 scroll:'十七处寿数涂改：该善终的富户暴毙、该死的恶绅添寿。能碰秦广殿副簿的，满幽冥不超过五人。',
 reward:{gh:'y_qinguang',shards:{you:2}},
 nodes:[
  {type:'event',text:'秦广王震怒又讳言。四条查证的路子摆在你面前。',
   choices:[
    {t:'墨痕比对',requires:{path:'you'},r:{favor:{qin_guang:5},flags:{flag_know_truth:1},log:'改墨是天曹「行文柏香墨」，不是冥司墨。'}},
    {t:'调十七处当夜的当值签押',r:{flags:{flag_know_truth:1},log:'值守名单里都有同一个名字：一名专司两界送簿的外包文吏。'}},
    {t:'暗中接触那名文吏',r:{flags:{flag_mercy_cut:1},log:'他跪地坦白：有人拿他妻儿的轮回票要挟，每次只添一笔。'}}
   ]},
  {type:'event',text:'顺符信追上线人——温有节手下的贴房，当面就要灭文吏的口。',
   choices:[{t:'护住文吏，拿下贴房',r:{log:'贴房撕下文书化作壳神法相。'}}]},
  {type:'game',game:'pairs',difficulty:3,
   text:'贴房动手前，一把卷宗被风扬满殿：十七处涂改，散作三十四片墨痕——每处涂改的「原墨」与「天曹柏香墨」各成一片，须凭墨色、笔锋、洇痕两两配回同一处，才凑得齐钉死贴房的完整证物。每翻两片：同处则配住，异处覆回。三十四片不齐，贴房抵死不认。',
   pass:{shield:0.25,enemyVuln:true,merit:8,favor:{qin_guang:5},log:'十七对墨痕在殿上列成一排，柏香墨的气味连成一线——涂改者的来路，再无可抵赖。贴房化壳的瞬间，破绽已被你钉死。'}},
  {type:'battle',enemy:'tiancaitiefang',name:'天曹贴房',scale:0.85},
  {type:'event',text:'贴房就擒，结案的尺度在你一念之间。',
   choices:[
    {t:'文吏与线人一并正法',r:{merit:15,flags:{flag_ruthless:1},log:'线人临死撕毁文吏妻儿的轮回票——你无法两全。'}},
    {t:'先请崔珏补出真票，再戴罪发落',r:{favor:{qin_guang:10,cui_jue:5},flags:{flag_cui_trust:10,flag_know_truth:2,flag_mercy_cut:1},log:'唯一两全：文吏戍边、妻儿入善道，证词咬出「试点」二字。'}},
    {t:'接温有节递来的台阶「内部处理」',r:{money:200,erode:6,flags:{flag_wen_compliance:1},favor:{qin_guang:-10},log:'秦广王当面冷笑：你跟那个姓温的，越来越像。'}}
   ]}
 ]},

{id:'s12',name:'东海龙宫宝珠失窃案',god:'ao_guang',chapter:4,side:'s12',danger:4,money:100,merit:30,
 scroll:'镇海潮汐珠被盗，龙宫潮汐失序。敖广一口咬定巡海夜叉监守自盗，可宝库水痕指着给天庭上贡的「走水贡道」。',
 reward:{gh:'f_aoguang',shards:{fa:2}},
 nodes:[
  {type:'event',text:'被绑在剥皮凳上的夜叉连声喊冤。三处疑点等你查证。',
   choices:[
    {t:'验宝库水痕',r:{flags:{flag_know_truth:1},log:'盗者走的是走水贡道，夜叉没有贡道牌。'}},
    {t:'问当夜值守的侍女',r:{flags:{flag_know_truth:1},log:'亥时宝库还亮、子时已黑，中间一个时辰无人承认在岗。'}},
    {t:'查潮汐珠近三月的借验文书',r:{flags:{flag_know_truth:2},log:'天曹以「年检」借调六次，最后还回来的，已是一枚空有珠光、不镇海潮的壳珠。'}}
   ]},
  {type:'event',text:'你闯进贡道截住灭口的差官，一头重甲赑屃拦在水道中央。',
   choices:[{t:'破水迎战',r:{log:'贡道浪头如山压下。'}}]},
  {type:'quiz',who:'敖广',text:'老龙王隔着水屏传来一道急讯，声音又急又端着架子：「那拦路的重甲畜生是赑屃，贡道水纹也有讲究——你既替寡人拿贼，先答对这两问，莫在水底下丢了龙宫的人！」',
   qs:[
    {q:'水屏里敖广沉声考你：「赑屃那厮，龙生九子中排行第几、平生所好何物？」',
     opts:['长子，好负重，碑下驮碑便是它','次子，好刑杀，刀环上的兽吞是它','六子，好水，桥洞拱兽是它','九子，好吞，殿脊吞脊兽是它'],a:0,
     why:'赑屃（霸下）为龙生九子之长，形似龟、好负重，天下碑碣石趺多是它驮着——重甲拦路，正是它的看家本事。'},
    {q:'「潮汐珠年年『年检』，寡人为何一直被蒙在鼓里？」敖广咬着牙问。',
     opts:['借调时以壳珠掉包，珠光宛然而镇海之力已空','珠子被夜叉偷去把玩','珠子自己滚进了海沟','珠子年久失修自行风化'],a:0,
     why:'六次年检，真珠早被壳珠掉包——珠光依旧照得宝库透亮，却再镇不住海潮，账面上还次次「验讫归还」。'}
   ],
   pass:{shield:0.3,enemyVuln:true,merit:8,favor:{ao_guang:5},log:'水屏里龙颜稍霁，一道避水龙气裹上你周身：浪头压来时，你脚下竟稳如实地。'}},
  {type:'battle',enemy:'gongdaotianchai',name:'贡道天差',scale:1.2},
  {type:'battle',enemy:'bixingqiaoshou',name:'赑屃形壳兽',scale:0.8},
  {type:'event',text:'真相是「年检掉包」，老龙王又怒又怕，怕的是得罪天庭。',
   choices:[
    {t:'帮他写「自查失珠、自行补铸」的含糊奏章',r:{favor:{ao_guang:20},flags:{flag_neutral_pact:1},log:'你保全了老龙王的面子，他欠你一份情。'}},
    {t:'逼老龙王联名实奏',r:{favor:{ao_guang:10},flags:{flag_refuse_count:1,flag_stance:1},log:'敖广战战兢兢落了印，龙宫死人情记下了。'}},
    {t:'收下「大潮赈灾协办费」压案',r:{money:300,erode:8,flags:{flag_ruthless:1},merit:-20,favor:{ao_guang:-15},log:'三日后大潮淹了两县。'}}
   ]}
 ]},

{id:'s13',name:'赵公明财库短少案',god:'zhao_gongming',chapter:4,side:'s13',danger:4,money:150,merit:28,
 scroll:'下界财库三月短少纹银三十万两，账实相符、封条完好、四位库神签押齐全——钱就是少了。武财神的黑虎都喂瘦了。',
 reward:{shards:{bing:1,fa:1,you:1,huo:1,sheng:1}},
 nodes:[
  {type:'event',text:'赵公明请你查「内鬼」。三条线索。',
   choices:[
    {t:'复盘点库流程',r:{flags:{flag_know_truth:1},log:'封条是天曹新换的「云纹火漆」。'}},
    {t:'私下问最老的库神',r:{flags:{flag_know_truth:1},log:'「新规矩要求每月熔银一次重铸，说是统一成色。」'}},
    {t:'蹲守熔银之夜',r:{flags:{flag_know_truth:2},log:'火漆封条在熔银时自行「吸」走一成银气，顺纹路升上天曹！'}}
   ]},
  {type:'event',text:'封条察觉被窥，火漆从箱上剥落凝成一个名叫「合规」的壳神。',
   choices:[{t:'揭封取证',r:{log:'「合规」叠起层层厚盾。'}}]},
  {type:'quiz',who:'赵公明',text:'赵公明把黑虎按在身侧，铁鞭往银箱上一横：「伢子，敢揭这道封，先接财神爷两问。答不上，本帅这鞭不护外行。」',
   qs:[
    {q:'黑虎低吼，赵公明问：「本帅玄坛之上，骑黑虎、执的是何物？」',
     opts:['铁鞭','金锏','玉如意','青龙偃月刀'],a:0,
     why:'武财神赵公明黑面浓须、骑黑虎、持铁鞭，统帅「招宝、纳珍、招财、利市」四位仙官，掌天下财库。'},
    {q:'他又用鞭梢点那云纹火漆：「封条完好、账实相符，钱却少了——这桩案子，蹊跷出在哪一层？」',
     opts:['封印本身在熔银时按纹路抽走银气','四位库神监守自盗','黑虎半夜偷吃了银锭','账房算盘打错了数'],a:0,
     why:'内贼不是人，是「统一熔铸」新规下的云纹火漆——封条合规、流程合规，抽成便也合规，这才叫「合规」壳神。'}
   ],
   pass:{shield:0.3,enemyVuln:true,merit:8,favor:{zhao_gongming:5},log:'「伢子懂行！」赵公明铁鞭一抖，借给你三分玄坛煞气——「合规」那层层厚盾，在你眼里先薄了一层。'}},
  {type:'battle',enemy:'fengtiaohegui',name:'封条化形·合规',scale:0.85},
  {type:'event',text:'不是人偷，是封印本身在抽成，而四库神都在自己没细看的《统一熔铸同意书》上签了押。',
   choices:[
    {t:'强行揭封，证据在手',r:{merit:20,flags:{flag_refuse_count:1},log:'赵公明却被天曹反告「损毁御封」。'}},
    {t:'教他以合规对合规，旧印平行记明账',r:{favor:{zhao_gongming:20},flags:{flag_neutral_pact:1,flag_know_truth:1},log:'抽成被摊成天下皆知的「火耗」明账。财神赞：你这伢子懂行规。'}},
    {t:'收下财神一笔钱，平账要紧',r:{money:250,erode:5,flags:{flag_ruthless:1},favor:{zhao_gongming:-5},log:'这是最容易心动的一单，你收下了。'}}
   ]}
 ]},

{id:'s14',name:'电母补录天雷簿',god:'dian_mu',chapter:3,side:'s14',danger:3,money:80,merit:16,
 scroll:'电母独自核录人间天雷账，发现十七道雷「行过却无旨」。她要一个还没被天曹记满黑账的外包跑现场。',
 reward:{shards:{fa:2}},
 nodes:[
  {type:'event',text:'私雷落点：瞒报灾银的义庄、强占庙产的举人、还有一座天曹自己的库栈。你在库栈被值守壳神发现。',
   choices:[{t:'护住雷痕记录',r:{log:'库卒拍掌召来同伴。'}}]},
  {type:'quiz',who:'电母',text:'电母双镜在怀，镜光一闪拦住你去路：「跑现场之前，先答本神两问。镜拿不稳的人，分不出哪道雷有旨、哪道雷是私行——去了也是送死。」',
   qs:[
    {q:'电母举起手中双镜：「雷公执锤钻行雷，本神掌镜——可知这两面镜子，照的是什么？」',
     opts:['照电光、辨雷路，明人间善恶以为雷令之凭','照妖镜，专照妖怪原形','风月宝鉴，照红粉骷髅','四海镜，照龙宫动静'],a:0,
     why:'电母（闪电娘娘）双手执电光镜，闪电先行、雷声随之，镜光照处辨明善恶雷路，方好补录天雷簿。'},
    {q:'「十七道雷『行过却无旨』。」她翻开雷簿，「簿上一笔雷账，凭什么才算数？」',
     opts:['须有雷旨文号、落点雷痕与当值签押三者相合','雷公打过就算数','劈中了坏人就算数','天上响过一声就算数'],a:0,
     why:'天雷簿讲究旨、痕、押三者对勘：无旨之雷，纵是劈恶，也得在簿上单独说清来龙去脉，否则便是私雷。'}
   ],
   pass:{enemyVuln:true,merit:6,favor:{dian_mu:5},log:'电母将一面小镜塞入你袖中：「雷痕不会说假话。」库卒扑来时，镜光先晃花了它的眼。'}},
  {type:'battle',enemy:'kuzhankuzu',name:'库栈库卒',scale:1},
  {type:'event',text:'核对雷痕：十六道是雷公部旧人「忍不住」劈的坏人，一道劈库栈的被改记成「天火走水」。该怎么记？',
   choices:[
    {t:'如实补录，连「天火走水」一起翻',r:{favor:{dian_mu:15},flags:{flag_refuse_count:1,flag_leizu_trust:5},log:'电母解气又忧心，雷祖线提前记下了你。'}},
    {t:'十六道记成「例行演武」，库栈那笔照原样',r:{favor:{dian_mu:8},log:'电母过意不去，多赠你一道惊电符。'}},
    {t:'把雷账抄底卖给库栈主事',r:{money:120,erode:5,flags:{flag_ruthless:1},favor:{dian_mu:-15},log:'电母当场翻脸，镜光碎了一地。'}}
   ]}
 ]},

{id:'s15',name:'雷部点卯',god:'wang_lingguan',chapter:4,side:'s15',long:true,danger:4,money:200,merit:40,
 scroll:'王灵官一道雷符劈进工单架：雷部三百功曹里混着「不会打雷的东西」。用外包点外包，不算天曹内讧。',
 reward:{gh:'f_lingguan',shards:{fa:3}},
 acts:[
  {title:'接符·初点三十卯',nodes:[
   {type:'event',text:'你随雷部小吏连点三十卯，其中三道应卯声发空——雷响到一半，像人打了个嗝。',
    choices:[{t:'请王灵官示下：雷部点卯，以何为凭',r:{log:'王灵官抛来六道雷符：雷部点卯不靠喊名，靠符序。'}}]},
   {type:'game',game:'memory',difficulty:3,
    text:'雷部点卯，以符为凭：功曹各持一道雷符，应卯时须照卯册上的符序，在法坛上连环复按。真功曹符序烂熟于心，混进来的空卯只学了个响，序列一长便接不上。法坛三转、符序渐长——你替王灵官当堂复序，三道空卯自然藏不住。记错一环，本轮重转。',
    pass:{shield:0.3,enemyVuln:true,merit:8,log:'三转法坛符序不差，六道雷符的余光里，三道「功曹」的面具同时裂开——壳下空空如也。它们退无可退，扑上法坛！'}},
   {type:'battle',enemy:'kongmaogongcao',name:'空卯功曹',scale:0.75},
   {type:'event',text:'三名空卯功曹被你一一戳破，王灵官的雷符在工单架上烧出两个字：深查。',
    choices:[{t:'明日再查考功法名册',r:{log:'这一夜你先歇下。'}}]}
  ]},
  {title:'深查·考功法名册',nodes:[
   {type:'event',text:'按《考功法》反查：被「异地提拔」的功曹共二十七名，替换路径都通向同一家「点卯代办铺」。',
    choices:[{t:'按图索骥，再点一名',r:{log:'又一道空卯在你面前炸成纸灰。'}}]},
   {type:'battle',enemy:'kongmaogongcao',name:'空卯功曹',scale:0.85},
   {type:'event',text:'代办铺的幌子在雷云下晃着，掌柜的戴着半张功曹面具。',
    choices:[{t:'直闯代办铺',r:{log:'明日便是收网之时。'}}]}
  ]},
  {title:'代办铺·扳到哪一层',nodes:[
   {type:'battle',enemy:'daibanpuzhanggui',name:'点卯代办铺掌柜',scale:0.95},
   {type:'event',text:'铺中用印记录直通三省九司经承房。扳到哪一层，你自己选。',
    choices:[
     {t:'只拿代办铺结案交差',r:{favor:{wang_lingguan:10},log:'雷祖与王灵官认可，却都有些遗憾。'}},
     {t:'顺用印记录摸到三省九司',r:{favor:{wang_lingguan:20,lei_zu:15},erode:4,flags:{flag_xiangye_id:1,flag_know_truth:2,flag_leizu_trust:15},log:'你拿到相爷用印链上的一环，随即被契卫「护送」出门。'}},
     {t:'把名单卖给温有节换前程',r:{money:400,erode:10,flags:{flag_wen_compliance:2},favor:{wang_lingguan:-20},log:'王灵官当着你的面，一鞭打断了自己架上一柄兵刃。'}}
    ]}
  ]}
 ]},

/* ============ 支线 s16～s20（章四，s16/s17 为长单） ============ */
{id:'s16',name:'灌江口练兵',god:'er_lang',chapter:4,side:'s16',long:true,danger:5,money:260,merit:45,
 scroll:'二郎神不点天兵，要你带草头神与梅山残部打一场真的：三汛联防。他不出手，只在最高处磨刀看着。',
 reward:{gh:'b_qingyuan',shards:{bing:4}},
 acts:[
  {title:'头汛·江雾夜哨',nodes:[
   {type:'event',text:'江雾里鱼精哨三连来犯，专练你的闪避与读招。',
    choices:[{t:'迎头哨',r:{log:'第一道浪里全是鳍影。'}}]},
   {type:'quiz',who:'杨戬',text:'高处磨刀声忽然一顿，二郎神的声音顺着江风落下来，清冷得像三尖两刃刀的刃：「替我练兵，先过我这一关。答得出我灌江口的底细，鱼精哨才配交给你。」',
    qs:[
     {q:'「我手中这柄兵刃，你认得出么？」江风里他横刀而立。',
      opts:['三尖两刃刀（三尖两刃戟）','方天画戟','青龙偃月刀','丈八蛇矛'],a:0,
      why:'二郎神持三尖两刃刀（三尖两刃戟），额生天眼、架下鹰犬——刀名一出，才算进过灌江口的营门。'},
     {q:'「鱼精哨三连来犯，专练闪避读招。」他刀刃微抬，「我随身那条咬仙咬魔的白毛细犬，叫作什么？」',
      opts:['哮天犬','地吼','白泽','谛听'],a:0,
      why:'哮天犬（白毛细犬）随二郎猎妖拿怪，撕咬仙魔无算；读招之法，先学它伏低时那一瞬的动静。'}
    ],
    pass:{shield:0.25,enemyVuln:true,merit:8,favor:{er_lang:5},log:'磨刀声重新响起，却比方才多了一分节奏。你循着那节拍侧身——鱼精哨的第一下扑击，果然落了空。'}},
   {type:'battle',enemy:'yujingshao',name:'鱼精哨',scale:0.9}
  ]},
  {title:'二汛·溃堤抢修',nodes:[
   {type:'event',text:'江堤溃口，白浪蛟将裹着藤甲水压而来，兵系重击与火德烧甲是破防关键。',
    choices:[{t:'抢堵决口，迎战蛟将',r:{log:'蛟将立起半身，浪比庙高。'}}]},
   {type:'game',game:'lights',difficulty:2,
    text:'溃口处原布着灌江口「九桩锁浪灯」：踏一桩，此桩与上下左右四桩明灭齐翻，九桩全明，灯阵便能在决口前临时束起一道水栅，好叫你腾出手与蛟将放对。灯阵不亮，人浪两线便要一起压上来。',
    pass:{shield:0.3,enemyVuln:true,merit:8,log:'九灯连成一线，水栅在溃口处绷起半人高。白浪被拦在栅外，蛟将的藤甲水压先泄了三成。'}},
   {type:'battle',enemy:'bailangjiaojiang',name:'白浪蛟将',scale:0.55}
  ]},
  {title:'三汛·主浪翻江',nodes:[
   {type:'event',text:'蛟王亲至，翻江三连，必须在三次读招里打断它两次。磨刀声在最高处停了。',
    choices:[{t:'迎击蛟王',r:{log:'主浪拍上云天。'}}]},
   {type:'game',game:'memory',difficulty:3,
    text:'蛟王翻江三连，每连浪头都不同：第一连看鳍、第二连看潮眼、第三连看回水。灌江口读招牌三转渐长，须照浪序逐张复按，牌序不差，才算是在三次读招里咬住了蛟王的节拍、抢下两次打断的先手；错一张，主浪重卷、本轮重读。',
    pass:{shield:0.3,enemyVuln:true,merit:10,favor:{er_lang:8},log:'三转读招全中，你在第二、第三连各抢出一个空当，一脚踏在潮眼上。蛟王翻江之势为之一滞，高处的磨刀声，停了。'}},
   {type:'battle',enemy:'jiaowang',name:'蛟王',scale:0.7},
   {type:'event',text:'三汛皆平，该写报功文书了。',
    choices:[
     {t:'功劳全写草头神与梅山旧部',r:{favor:{er_lang:20},flags:{flag_erlang_respect:25,flag_mercy_cut:1},log:'二郎神第一次正眼看你。'}},
     {t:'按天曹模板写「外包阴神独立平患」',r:{money:200,flags:{flag_ruthless:1,flag_erlang_respect:-10},log:'你拿满 KPI，旧部无赏，磨刀声又冷了几分。'}}
    ]}
  ]}
 ]},

{id:'s17',name:'花果山旧部招安',god:'er_lang',chapter:4,side:'s17',long:true,danger:4,money:150,merit:40,
 scroll:'梅山转来花果山的工单：《妖仙文明共建》压山，余部要么入编做编号，要么被定「野妖」再剿一次。崩芭二将请你做「军师」，谈第三条路。',
 reward:{gh:'b_douzhan',shards:{bing:2}},
 acts:[
  {title:'点齐山寨家当',nodes:[
   {type:'event',text:'清点名册，三分之一小猴已经忘了本名，只报得出编号。天曹招安使的先头却已上山催逼。',
    choices:[{t:'护住名册，挡住随员',r:{log:'招安随员撕下面子，唤出壳神。'}}]},
   {type:'quiz',who:'崩将军',text:'崩芭二将把一本卷了毛边的名册塞给你，芭将军抓耳挠腮：「军师要替我们挡天曹的人，先得晓得这山的来历！答得上，弟兄们才信你。」',
    qs:[
     {q:'崩将军指着山门外的旧旗：「这山叫什么名、我家大圣在何处起家，军师总不会也只晓得编号吧？」',
      opts:['花果山，水帘洞；齐天大圣自此起家','五行山；唐三藏揭符处','灵台方寸山；菩提祖师讲经处','灌江口；二郎真君的地界'],a:0,
      why:'傲来国花果山、水帘洞，是美猴王出世聚义、自封齐天大圣的根本之地——招安使要抹掉的，正是这些名字。'},
     {q:'「天曹张口一个『编册』，闭口一个『入编』。」芭将军压低声音，「你可知册子一录编号，先丢的是什么？」',
      opts:['本名；三分之一小猴已只报得出编号','一身猴毛','爬树的本事','桃林的收成'],a:0,
      why:'名册里三分之一小猴忘了本名、只报得出编号——编册先收名字，名字一没，猴也就成了可点可销的数目字。'}
    ],
    pass:{enemyVuln:true,merit:8,favor:{er_lang:5},log:'二将听得眼眶发红，齐齐把胸膛一挺。随员的壳神扑来时，漫山小猴替你看清了它每一个空门。'}},
   {type:'battle',enemy:'zhaoansuiyuan',name:'招安随员',scale:1.1}
  ]},
  {title:'三轮谈判',nodes:[
   {type:'event',text:'温有节派来的协办文吏法条陈，三轮措辞，每一步都是坑。',
    choices:[
     {t:'引「山籍自治」旧例，辅以明账思路',r:{flags:{flag_neutral_pact:1},log:'文吏一时语塞，第三条路被你谈出了一道缝。'}},
     {t:'强硬顶回',r:{flags:{flag_stance:1},log:'文吏冷笑，谈判濒临破裂。'}},
     {t:'太软，答应编册',r:{flags:{flag_ruthless:1},log:'小猴们默默排队报数，你听见山在叹气。'}}
    ]},
   {type:'quiz',who:'协办文吏',text:'文吏收起法条陈，皮笑肉不笑地拦住话头：「慢着。军师引的旧例、说的明账，本协办这里也有两问。答得圆，咱们才有第三轮；答不圆，今日这山，便按『野妖』立卷。」',
    qs:[
     {q:'文吏抖开一轴《妖仙文明共建》：「旧例要引，先得说清——本朝治妖之政，凡不入册者，依例当何论？」',
      opts:['例定「野妖」，可再剿一次；故第三条路须落在纸面上','不入册者各回洞府、两不相干','不入册者自动晋封正神','不入册者罚桃林劳役三日'],a:0,
      why:'这正是招安的刀口：入编做编号，不编便是「野妖」、再剿一次。第三条路必须像自治契一样，落在一份压得过法条的纸面上。'},
     {q:'「你说『山籍自治』——」文吏眯眼，「自治二字，凭什么让天曹认？」',
      opts:['以旧例为据、以明账为凭，权责香火自己承担','凭大圣名头吓唬','凭猴多势众硬顶','凭多塞几两银子'],a:0,
      why:'旧例给名分、明账给把柄：自治不是脱管，而是权责香火自担、滴水不漏地合规——文吏的坑，要用他自己的规矩填平。'}
    ],
    pass:{favor:{er_lang:5},merit:8,log:'文吏法条陈翻了一页又一页，竟找不出下嘴处，额角先见了汗——第三条路的缝，被你撬成了一道门。'}}
  ]},
  {title:'契成·编制兽',nodes:[
   {type:'event',text:'谈判决裂的最后一刻，协办文吏放出一具「编制兽」强行点卯——打退它，自治契才落得了印。',
    choices:[{t:'护住桃林旧旗',r:{log:'编制兽扛着一口巨大的印玺踏来。'}}]},
   {type:'game',game:'pairs',difficulty:2,
    text:'编制兽点卯，全凭编号锁人：它每念一号，名册上便有一只小猴被拽去排队。破法只有一个——趁印玺未落下，把名册翻过来背置案上，猴名牌与编号牌两两配回：每翻两牌，名号相符则配住、失序则覆回。全案配齐，猴名便各归本主，点卯的锁链先断了一半。',
    pass:{shield:0.3,enemyVuln:true,merit:10,favor:{er_lang:8},log:'名号牌一对对合拢，小猴们陆续想起自己的名字。编制兽的卯册断了线，巨印举在半空，空门尽露。'}},
   {type:'battle',enemy:'bianzhishou',name:'编制兽',scale:0.95},
   {type:'event',text:'自治契铺在石桌上，该署谁的名？',
    choices:[
     {t:'署你名，做花果山客卿军师',r:{favor:{er_lang:10},flags:{flag_monkey_debt:30},log:'崩芭二将把半根如意毫毛塞进你手里。'}},
     {t:'把主位让给崩芭二将自己按爪印',r:{flags:{flag_monkey_debt:20,flag_neutral_pact:1,flag_mercy_cut:1},log:'猴部真正自主，满山猿啼里有了点活气。'}},
     {t:'反水，把整山编册卖给天曹',r:{money:350,erode:10,flags:{flag_wen_compliance:2},log:'你把朋友卖了个好价钱。桃林一夜落叶。'}}
    ]}
  ]}
 ]},

{id:'s18',name:'文昌帝君科举舞弊案',god:'wen_chang',chapter:4,side:'s18',danger:4,money:120,merit:35,
 scroll:'一科秋闱，文运与中榜名单对不上：三甲尽是商贾子弟，寒门面馆全落。帝君断定——文运榜被人在两界之间换了页。',
 reward:{gh:'f_wenchang',shards:{fa:2}},
 nodes:[
  {type:'event',text:'贡院房牍墨卷有两副笔迹，三名高中者阴德栏盖的是天曹「特推」印，印泥掺了金银灰。卖关节的「卷先生」被你堵在贡院梁上，甩墨封你技能。',
   choices:[{t:'以雷法净墨，拿下卷先生',r:{log:'卷先生化作一名壳神文吏。'}}]},
  {type:'quiz',who:'文昌帝君',text:'帝君并不急着动手，先将一柄朱笔横在墨卷之上：「功名之地，动武之前先讲理。你既替本帝君清这贡院，两问答来——答不出，本帝君怕你连文运榜被换了哪一页都看不懂。」',
   qs:[
    {q:'帝君问：「文运榜前那位赤发蓝面、独占鳌头、执笔点斗的星君，叫作什么？」',
     opts:['魁星（奎星）','文曲星官','朱衣使者','梓潼神'],a:0,
     why:'魁星（奎星）主文运，赤发蓝面、立于鳌头之上、朱笔点斗——「魁星点斗，独占鳌头」，中与不中，笔下分明。'},
    {q:'「三名高中者阴德栏，盖的是天曹『特推』印。」帝君指尖一叩卷子，「本帝君掌的文运榜，取人究竟凭什么？」',
     opts:['凭文才、阴德与朱衣暗点头，非金银可买','凭谁家香火供奉厚','凭考官私下批条','凭字号起得吉不吉利'],a:0,
     why:'文运凭文章才学、阴德厚薄，朱衣使者暗点头方定取舍；「特推」印掺了金银灰，正是坏了这条取士的根本。'}
   ],
   pass:{enemyVuln:true,merit:8,favor:{wen_chang:5},log:'帝君朱笔往卷先生面门遥遥一圈，墨封上先裂出一道缝：「他封你的技能，本帝君替你先破了。」'}},
  {type:'battle',enemy:'juanxiansheng',name:'卷先生',scale:0.8},
  {type:'event',text:'供词上达：天曹新设「文运统筹捐」，功名明码标价，美其名曰「科举产能优化」。帝君翻出你生前那一科的旧卷——你本在榜上，被人顶替了。',
   choices:[
    {t:'帮帝君把铁证做扎实，联名实奏',r:{favor:{wen_chang:15},flags:{flag_stance:1,flag_refuse_count:1,flag_know_truth:1},log:'多名落榜寒士之魂远远叩谢。连你的落榜，都是这套机器的产物。'}},
    {t:'劝帝君换一科补回来，奏本别写太直',r:{favor:{wen_chang:8},flags:{flag_neutral_pact:1},log:'帝君赠物相谢，却摇了摇头。'}},
    {t:'收「特推」方五千两压案',r:{money:300,erode:12,flags:{flag_ruthless:1},favor:{wen_chang:-10},log:'你本是落榜书生。这一笔收下，连自己那科也一并卖了。'}}
   ]}
 ]},

{id:'s19',name:'比干丞相无心秤',god:'bi_gan',chapter:4,side:'s19',danger:3,money:70,merit:16,
 scroll:'文财神比干无心，故买卖公道。近日他的秤却偏了：善商的货过秤轻三分，奸商的反而重。他请你查「他自己」。',
 reward:{gh:'s_bigan',shards:{sheng:2}},
 nodes:[
  {type:'event',text:'秤星里嵌了一粒天曹新颁的「公允星」。颁星的星吏见你查问，当场翻脸。',
   choices:[{t:'摘下假星之前，先过他这一关',r:{log:'星吏摇身化作壳神。'}}]},
  {type:'quiz',who:'比干',text:'比干丞相抬手止住你摘星的动作，哑声道：「他颁的是本相的星。你摘星之前，须先答本相两问——答得出公道二字怎么写，这粒星才摘得名正言顺。」',
   qs:[
    {q:'比干按着胸口旧伤问你：「世人奉本相为文财神，可知本相凭什么称神、掌的又是哪一桩买卖？」',
     opts:['剖心谏纣而亡，无心故不偏私，掌公道买卖','因富可敌国而封财神','因商纣封他为财神','因教人囤积居奇成神'],a:0,
     why:'比干因直谏被纣王剖心，民间以其「无心」立为文财神：无心则无偏私，买卖过他秤，童叟皆无欺。'},
    {q:'「秤本公道，善商货却轻三分、奸商反重。」他盯着秤星，「你说，偏的是秤，还是什么？」',
     opts:['是秤星里那粒『公允星』配重被调了包','是善商的货真的变轻了','是奸商偷偷加了秤砣','是本相的心又长回来了'],a:0,
     why:'秤与神皆无错，错在天曹新颁的那粒「公允星」——连「公允」都能统一发配重头，偏的便是定星的那只手。'}
   ],
   pass:{enemyVuln:true,merit:8,favor:{bi_gan:5},log:'比干微微颔首，秤杆在他掌中自己调平。星吏壳神扑来时，那粒假星先在秤上现了原形。'}},
  {type:'battle',enemy:'gongyunxingli',name:'公允星吏',scale:1.05},
  {type:'event',text:'比干捏着那粒调偏配重的壳星问你：无心之神靠公道成神，如今连「公允」都发配重头，神还凭什么神？',
   choices:[
    {t:'「凭规矩里那句还没烂完的话」',r:{favor:{bi_gan:15},log:'比干笑了，挖出壳星，秤重新平了。'}},
    {t:'「凭您挖心前那一念」',r:{favor:{bi_gan:15},flags:{flag_mercy_cut:1},log:'比干默然，削下一枚无心铜权给你防身。'}},
    {t:'替他换上新的天曹配重星',r:{money:100,erode:4,flags:{flag_wen_compliance:1},favor:{bi_gan:-10},log:'秤看似修好了，实则继续按天曹的心意偏。'}}
   ]}
 ]},

{id:'s20',name:'妈祖娘娘风暴灯',god:'ma_zu',chapter:4,side:'s20',danger:4,money:90,merit:18,
 scroll:'东海连报海难、护航失灵，妈祖的红灯标在风暴里一盏盏灭。她带病出海，请你做一次人间灯标。',
 reward:{gh:'s_mazu',shards:{sheng:2}},
 nodes:[
  {type:'event',text:'风暴眼里，一头巽风怪卷着浪墙撞向民船船阵。',
   choices:[{t:'破浪迎怪',r:{log:'风墙层层叠叠，高闪难捉。'}}]},
  {type:'game',game:'lights',difficulty:3,
   text:'民船船阵在风暴眼里失了灯向。娘娘将九盏备用红灯标交到你手里：旧例「九转连灯」——每点一盏，此灯与上下左右四盏明灭齐翻，九灯尽数通红，灯阵才在浪墙上连成一条引民船避开暗礁的光道，你也才有余力腾身迎怪。风急浪高，灯位一乱便须重点。',
   pass:{shield:0.3,enemyVuln:true,merit:10,favor:{ma_zu:5},log:'九盏红灯在浪墙上连成一串温暖的光，民船船阵循着光掉头驶出暗礁。巽风怪卷着的风墙，被灯光切出一道缝隙。'}},
  {type:'battle',enemy:'xunfengguai',name:'巽风怪',scale:1.1},
  {type:'event',text:'你发现熄灭的灯全被换成了天曹制式「贡道航灯」——灯还亮，却只给挂贡旗的船指路，民船等于被引去暗礁。',
   choices:[
    {t:'一盏盏换回民灯，连熬两夜',r:{favor:{ma_zu:18},flags:{flag_mercy_cut:1},log:'妈祖在风浪里冲你合十一礼。'}},
    {t:'逼贡道官当面改灯',r:{favor:{ma_zu:12},flags:{flag_refuse_count:1},log:'你按着刀逼他把航灯一盏盏拨回旧向。'}},
    {t:'收下「贡道护航协办」的灯油钱',r:{money:150,erode:6,flags:{flag_ruthless:1},favor:{ma_zu:-15},log:'当夜三艘民船触礁，孟婆处多了三碗汤。'}}
   ]}
 ]},

/* ============ 支线 s21～s24（章五） ============ */
{id:'s21',name:'真武玄甲炼心',god:'zhen_wu',chapter:5,side:'s21',danger:5,money:120,merit:20,
 scroll:'真武殿闭门炼魔，闻你要上天，命龟蛇二将摆阵——他要试试一个揣着满身别人神格的人，还配不配荡魔。',
 reward:{gh:'f_zhenwu',shards:{fa:2,bing:1}},
 nodes:[
  {type:'event',text:'玄甲将前半蛇影高速毒攻、后半龟甲重守，意图在两相间轮转。',
   choices:[{t:'入阵',r:{log:'龟蛇合体的虚影压满整座大殿。'}}]},
  {type:'quiz',who:'真武大帝',text:'玄甲将将动未动，真武披发跣足、按剑于高台，声如寒铁：「本帝此阵，先考心、后考力。两问答得上来，入阵；答不上，龟蛇自有分寸。」',
   qs:[
    {q:'真武俯瞰阵中：「拦你的玄甲将，前蛇后龟——你可知本帝足下、旗上，龟蛇二物是什么来头？」',
     opts:['北方七宿形如龟蛇，玄武合体，主北方水德','东海龙宫逃出来的两只小妖','龟蛇是本帝豢养的坐骑凡兽','一为火神一为风神'],a:0,
     why:'北方七宿（斗牛女虚危室壁）其象龟蛇合体，称「玄武」，后尊为真武大帝；龟蛇二将即此星宿精气所化，主北方、镇水火。'},
    {q:'「本帝荡魔，剑下从无留情。」他目光如电，「那你倒说说——荡魔要荡的最后一魔，在何处？」',
     opts:['在己心；贪嗔执取不除，斩尽天下妖亦是魔','在三十三天之上','在枉死城最深处','在四海龙宫之内'],a:0,
     why:'真武曾入山修道、磨尽自家脏腑之妖方得荡魔——「荡魔的最后一魔，是自己」；揣着满身别人神格的人，先得过这一问。'}
   ],
   pass:{shield:0.3,enemyVuln:true,merit:10,favor:{zhen_wu:5},log:'真武目光稍缓，剑未出鞘，一缕玄天真武之炁先覆上你周身。龟蛇合体的虚影压下时，你脚下竟纹丝不动。'}},
  {type:'battle',enemy:'guishexuanjiajiang',name:'龟蛇玄甲将',scale:0.8},
  {type:'event',text:'真武收阵，只问一句：「你身上的格，是你的，还是他们的？」',
   choices:[
    {t:'「是债，我打算还。」',r:{favor:{zhen_wu:15},flags:{flag_mercy_cut:1},log:'真武久久看你，亲手解下玄甲。'}},
    {t:'「是我的，赢来的就是我的。」',r:{erode:4,flags:{flag_ruthless:1},log:'真武不赠甲，只留一句：荡魔的最后一魔，是自己。'}},
    {t:'答不上来',r:{flags:{flag_stance:1},log:'你张了张口，终究没出声，只得了几缕碎片。'}}
   ]}
 ]},

{id:'s22',name:'观音大士慈悲航',god:'guan_yin',chapter:5,side:'s22',danger:4,money:80,merit:18,
 scroll:'莲花洋漂来一船自枉死城出逃的残识小神，观音以净瓶水暂缓其消散。水只够渡一半，追兵已至。',
 reward:{gh:'s_guanyin',shards:{sheng:2}},
 nodes:[
  {type:'event',text:'净瓶水光里，满船残识静静看着你。天曹回收使踏水而来，要把它们重新装回「库」里。',
   choices:[{t:'挡在船前',r:{log:'回收使举起了封魂的索套。'}}]},
  {type:'quiz',who:'观音大士',text:'菩萨立于莲台，净瓶柳枝斜斜一指，柔声道：「善哉。你既挡在船前，先答贫僧两问。慈悲不是逞一时血气——答得明白，这瓶中水，才值得为你倾一分。」',
   qs:[
    {q:'菩萨问：「贫僧手中净瓶，瓶中所盛、所主，你可晓得？」',
     opts:['盛甘露（杨枝净水），能起死回生、普济苦海','盛的是东海潮信之水','盛的是冥府忘川之水','盛的是天河酿酒的仙泉'],a:0,
     why:'观音净瓶贮甘露（杨枝净水），洒一滴可润枯木、救残识、息风火——莲花洋上暂缓小神消散的，正是这一瓶甘露。'},
    {q:'「此水只够渡一半，追兵已至。」菩萨看着你，「贫僧道场在哪里，你又知不知？」',
     opts:['南海普陀山，紫竹林中说法','五台山清凉寺','峨眉山报国寺','九华山肉身殿'],a:0,
     why:'观音道场在南海普陀山紫竹林（普陀洛迦山）——紫竹林的慈悲，从来不是不挑人的滥施，而是明知只渡一半，仍要先渡眼前这一船。'}
   ],
   pass:{enemyVuln:true,merit:10,favor:{guan_yin:5},log:'观音微微颔首，柳枝轻挥，半滴甘露弹在回收使索套上——索套寸寸发软，满船残识得这一瞬喘息。'}},
  {type:'battle',enemy:'huishoushi',name:'天曹回收使',scale:0.95},
  {type:'event',text:'追兵退去，菩萨问你：「慈悲，要不要算成本？」',
   choices:[
    {t:'「要算，算了仍然渡。」',r:{favor:{guan_yin:18},flags:{flag_mercy_cut:1},log:'观音颔首，净瓶里抽出一枝柳枝给你。'}},
    {t:'「我把自己那份神格也化进水」',r:{cleanse:8,hp:-20,favor:{guan_yin:10},flags:{flag_mercy_cut:2},log:'你自损一格多渡十魂——这是终局前最大的一次净化。'}},
    {t:'把残识交给追换取天曹赏',r:{money:300,erode:12,flags:{flag_ruthless:2},favor:{guan_yin:-20},log:'观音不言，净瓶水在你面前结成了冰。'}}
   ]}
 ]},

{id:'s23',name:'叙功殿外拾遗',god:'cui_jue',chapter:5,side:'s23',danger:3,money:60,merit:20,
 scroll:'崔珏飞符：温有节在叙功殿西厢备了间「换格房」，历年上天叙功的外包，进去前与出来后不是同一个。赴宴前，摸出名册。',
 reward:{shards:{you:4}},
 nodes:[
  {type:'event',text:'你避开巡卫摸到西厢，契卫却在最后一道门前睁眼。',
   choices:[{t:'硬闯',r:{log:'契卫拖着重戟拦在门前。'}}]},
  {type:'quiz',who:'崔珏',text:'崔府君的飞符就贴在门柱背阴处，字迹急而不乱：「契卫守的是门，门后是册。闯门之前，先答本官两问——看不懂名册的人，进去也是白进去。」',
   qs:[
    {q:'飞符浮字：「西厢那间屋子，叙功的外包进去前与出来后不是同一个——你可知他们出来的去处，册子上记作哪几样？」',
     opts:['『已任』与『已重封』两条流水线分流','一律记『荣升天庭』','一律记『暴病身亡』','一律销号、不留一字'],a:0,
     why:'《叙功叙用录》上七任外包红批各半：「已任」的养作肥羊继续用，「已重封」的抽格装新神——换格房就是两条流水线的岔口。'},
    {q:'「契卫拖重戟守门，重戟不伤你性命，只认一样东西。」符上朱字一明一灭。',
     opts:['认你身上神格的编号；有编号便可拖走重封','认你腰牌的新旧','认你说不说黑话','认你交不交香火钱'],a:0,
     why:'契卫的戟不按善恶出手，只认神格编号——一旦你名字旁那行《回收同意书》被填上编号，守规矩的它拖你便「合理合法」。'}
   ],
   pass:{shield:0.3,enemyVuln:true,merit:10,favor:{cui_jue:5},log:'符纸燃尽，一点崔判官的朱砂印落在你腕上。契卫重戟扫来，你贴着它编号认取的空隙，堪堪让过。'}},
  {type:'battle',enemy:'qiwei',name:'契卫',scale:1.2},
  {type:'event',text:'名册《叙功叙用录》上，你名字前已有七任外包：红批分别为「已重封」「已任」「已任」「已重封」——任用与重封各半，正是肥羊与新刀两条流水线。',
   choices:[
    {t:'名册原件带走',r:{favor:{cui_jue:8},flags:{flag_know_truth:2,flag_refuse_count:1},log:'你把册子收进怀里，留待日后焚契。'}},
    {t:'只默背，原件归位',r:{favor:{cui_jue:5},flags:{flag_neutral_pact:1,flag_know_truth:1},log:'你合上名册放回原处，不惊动相爷。'}},
    {t:'把名册交给温有节当投名状',r:{money:200,erode:8,flags:{flag_wen_compliance:2},favor:{cui_jue:-15},log:'你用七个同事的下落，换了一张上桌的请帖。'}}
   ]}
 ]},

{id:'s24',name:'一盏灯的名字',god:'tudi_gong',chapter:5,side:'s24',danger:2,money:0,merit:10,
 scroll:'上天前最后一夜。土地公已彻底想不起你是谁，却执拗地坐在衙门口等：「有个小友今天要出远门，老夫得等等。」',
 reward:{shards:{sheng:2},flags:{flag_mercy_cut:2}},
 nodes:[
  {type:'event',text:'他怀里揣着半块供糕，和第一章那块一模一样。你给他看这一路替他攒下的东西，他一件也认不出，却一件一件都觉得暖。',
   choices:[{t:'陪他坐到半夜',r:{log:'子时，巷口推来一辆装灰袋的小车。'}}]},
  {type:'event',text:'回收小吏路过破神衙——土地公的名字已在预削名册上。',
   choices:[
    {t:'亮判官身份，正面赶走他',r:{flags:{flag_refuse_count:1,flag_mercy_cut:1},log:'小吏见躲不过，索性亮出锁魂链动手。'}},
    {t:'不动声色，把标签换给一块石头',r:{flags:{flag_neutral_pact:1},skip:2,log:'你趁他点数，悄悄把标签换给了路边一块石头。'}},
    {t:'塞钱让他今夜先去别处',r:{money:-100,flags:{flag_mercy_cut:1},skip:2,log:'小吏掂了掂钱袋，嘟囔着推车走了。'}}
   ]},
  {type:'quiz',who:'土地公',text:'土地公坐在你搬来的小板凳上，拐杖横在膝头，忽然像记起了什么要紧差事，竖起一根手指：「小友，出远门前，老夫也考考你。答得上来，才好放心让你走。」',
   qs:[
    {q:'他眯眼笑问：「老夫这等管一方地皮的小神，官名叫作什么？」',
     opts:['福德正神','城隍爷','山神','五道将军'],a:0,
     why:'土地公本名「福德正神」，管一方乡土、保阖境平安，庙小香薄，却是百姓抬头便见的那位神。'},
    {q:'「村里春祈秋报、给老夫和社母摆的那场祭，叫什么日子来着？」他拍拍脑袋。',
     opts:['社日（春社、秋社）','除夕','元宵','中元'],a:0,
     why:'社日祭土地（社神），春社祈谷、秋报社稷——他记不清自己是谁了，却还惦记着那场全村分肉吃酒、热热闹闹的社饭。'}
   ],
   pass:{enemyVuln:true,merit:10,favor:{tudi_gong:10},log:'土地公笑得像个孩子，把怀里半块供糕全塞进你手里。回收小吏扑来时，你握着那块糕，一步也没有退。'}},
  {type:'battle',enemy:'huishouxiaoli',name:'回收小吏',scale:1},
  {type:'event',text:'天快亮时，土地公忽然短暂地什么都想起来了一瞬。「小……小友啊。老夫想起来了。第一章那天，老夫要嘱咐你的那句话是——别学我们。要回来。」灯影一晃，他又忘了，只慈祥地笑：「远客来，好。喝茶，好。」',
   choices:[{t:'攥紧半块供糕，踏上云阶',r:{log:'你没有回头，怕一回头就走不动了。'}}]}
 ]},

/* ============ 支线 s25～s34：补足无委托神的出场（井/牛/马/日夜巡/钟/魏/陆/班/荷） ============ */
{id:'s25',name:'井泉童子封井案',god:'jing_shen',chapter:1,side:'s25',danger:1,money:50,merit:10,
 scroll:'井泉童子辖下老井被「天曹趵突水务」插了铁管，凭牌汲水、每桶两文，井水一夜发苦。井神太小，拽不住管子，只能拽住你。',
 reward:{shards:{sheng:1}},
 nodes:[
  {type:'event',text:'井口贴了张簇新的《两界水务统一管护告示》：即日起一井一牌，凭牌汲水，每桶两文，角上盖着「天曹·趵突水务」的朱印。井泉童子光着脚丫坐在井栏上，眼眶红红的，见你来，扑棱一下拽住你袖子。',
   choices:[
    {t:'下井，看看是什么在嘬水脉',r:{log:'你扒着井壁滑下去，泉眼深处插着一根胳膊粗的铁管，管壁温热，正咕嘟咕嘟把水往天上嘬。'}},
    {t:'问童子那铁管是什么时候来的',r:{flags:{flag_know_truth:1},log:'他抽噎着扳手指：初三来量的井口，初五就把管子接进了泉眼，水味一夜就苦了。村里老人喝了，直喊想起上辈子喝苦药的事。'}},
    {t:'替他交了「护管费」，劝他莫要声张',r:{money:20,erode:2,flags:{flag_ruthless:1},log:'你替孩子把钱拍在告示下。铁管里传来一声满足的水嗝，泉眼又矮了一寸。'}}
   ]},
  {type:'game',game:'lights',difficulty:1,
   text:'井口往下，泉眼九窍明灭不定。踏亮一窍，相邻四窍明暗齐翻——这是井泉童子守了百年的引泉老阵。令九窍尽通，被铁管嘬走的水脉才肯回头；阵不通，井里的水就得继续顺着管子，往天上流。',
   pass:{enemyVuln:true,merit:3,favor:{jing_shen:5},log:'九窍泉眼连珠亮起，井底闷雷似的响了一声，铁管尽头传来气急败坏的呛水声——嘬着水脉不放的东西，被你照见了。'}},
  {type:'battle',enemy:'guanzhongnihun',name:'管中溺魂',scale:1},
  {type:'event',text:'铁管松动，井水在身后一寸寸涨回来。井泉童子扒着井栏看你，等你拿最后一个主意。',
   choices:[
    {t:'生拔铁管，还泉于井',r:{favor:{jing_shen:10},flags:{flag_refuse_count:1},log:'你一把薅出铁管，井水「咚」地涌回井口，溅了告示一身。童子破涕为笑，脚丫子拍得水花乱溅。天曹水务的车铃，在巷口恨恨拐去了别处。'}},
    {t:'留管立牌：「趵突水务·明码汲水」，抽成改明账',r:{favor:{jing_shen:5},merit:4,flags:{flag_neutral_pact:1},log:'抽水改了明账，一担水两文钱，告示重写一遍，倒也没人为难孩子。井神坐在栏上嘟嘴，还是认了。'}},
    {t:'收下「护管费」，劝童子去别家井玩',r:{money:40,erode:4,flags:{flag_ruthless:1},favor:{jing_shen:-8},log:'钱袋压手。童子抱着膝盖看你走，没哭——他只是把那口井的水味，记成了苦的。'}}
   ]}
 ]},

{id:'s26',name:'牛头狱门·减刑函',god:'niu_tou',chapter:1,yamen:true,side:'s26',danger:2,money:60,merit:12,
 scroll:'阎君殿转批：上百魂持天曹《减刑核准函》叩狱门，函印皆真，牛头阿傍只觉「不对」，横叉从子时撑到天明。',
 reward:{shards:{bing:1},dshards:{niu_tou:1}},
 nodes:[
  {type:'event',text:'十八层狱门洞开一条缝，黑压压一片魂举着烫金文书，群情激昂：「天曹核准，减刑出狱！」牛头阿傍横着钢叉把住门缝，牛蹄在地上刨出两道深沟，脸憋得通红——函是真函，印是真印，他一个粗人，竟找不出半个不放人的由头，只剩一句「俺觉得不对」。',
   choices:[
    {t:'接过一封减函，就着狱门火把细看',r:{flags:{flag_know_truth:1},log:'函上条条合规：编号、花押、骑缝朱印俱全，唯独「核准司衙」五个字，烫金烫得有些心虚。'}},
    {t:'问阿旁：阴司放人，老规矩走哪几道',r:{flags:{flag_know_truth:1},log:'他掰着蹄子数：案卷呈阎君殿，朱笔勾生死簿，狱卒当面验牌放人——三关，这一封函连一关都没过。'}},
    {t:'劝牛头：印是真的，不如做个顺水人情',r:{money:25,erode:2,flags:{flag_ruthless:1},log:'阿傍瞪圆了牛眼，钢叉往地上一戳：印真就放人？那俺明天也刻一个去！'}}
   ]},
  {type:'quiz',who:'牛头',text:'阿旁把钢叉横在你面前，喘着粗气先不放行：「这位差官，你既来帮俺守门，先答俺两问——俺守了三百年狱门，答不上来，俺这叉可不认外包不外包。」',
   qs:[
    {q:'牛头把叉往地上一戳：「俺阿旁本不是牛头人身，你可知俺前世是干什么的，因何到这地府当差？」',
     opts:['牧羊人，因杀食老羊受罚，变牛头人身入地狱为卒','打铁匠人，被炉火烧毁面容','含冤战死的将军，首级经年不化','山中野牛成精，被阎王降伏收编'],a:0,
     why:'《铁城泥犁经》载：牛头阿傍前世为牧羊人，因杀生受罚，牛头人身、手持钢叉，在地狱为狱卒之头——他认的死理，是从受罚那天起就认下的。'},
    {q:'「这批减函印也真、格式也真。」他盯着门缝里那群魂，「俺为何到底不能开门？」',
     opts:['减刑大赦必经阎君殿勾销生死簿，天曹直发便是越权私放','印函朱红鲜亮，看着喜庆，断无驳回之理','来的魂太多，法不责众，开门便是','函上香火气重，显是上界恩典，该开'],a:0,
     why:'狱卒守的是流程的根：赦权在阴律司阎君殿，案卷、勾簿、验牌三关不缺；越权的文书印得再真，门也不能开。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:3,favor:{niu_tou:5},log:'阿旁听得牛眼发亮，把钢叉往你手里一塞：有学问！你替俺叉门，俺去后头把最能闹的几个捆结实些。'}},
  {type:'battle',enemy:'jianhanhanqiu',name:'减函悍囚',scale:1.05},
  {type:'event',text:'悍囚被叉翻在地，怀里掉出半本《假释天函》存根——每封减函，都收了家属一笔「赦罪香火钱」。',
   choices:[
    {t:'把减函全叉在狱门上，原样发回阎君殿等勾簿',r:{favor:{niu_tou:12},flags:{flag_know_truth:1,flag_refuse_count:1},log:'阿傍把钢叉横过来当签条，几十封函一字排开叉在门上：没勾簿，谁来也不开。函上的天界邮戳，一路抖回了天上去。'}},
    {t:'只挡回函件，不查是谁收的钱',r:{favor:{niu_tou:6},flags:{flag_neutral_pact:1},log:'门关了，魂收监，卖函的那只手藏在袖子里没动。阿旁冲你憨厚一乐：今天的理，讲圆了。'}},
    {t:'收为首魂的买命钱，放一排出去',r:{money:90,erode:5,flags:{flag_ruthless:1},favor:{niu_tou:-12},log:'狱门吱呀开了一条缝。阿旁没拦你——他只是把钢叉往地上重重一戳，半个时辰没跟你说一句话。'}}
   ]}
 ]},

{id:'s27',name:'马面追魂·通关牒',god:'ma_mian',chapter:1,yamen:true,side:'s27',danger:2,money:60,merit:12,
 scroll:'阎君殿转批：逃魂持天曹《通关度牒》连闯七关，马面追了三昼夜没追上——牒不认人，人认牒。',
 reward:{shards:{bing:1},dshards:{ma_mian:1}},
 nodes:[
  {type:'event',text:'阴山道的路碑上，马面大马金刀蹲着，脸拉得比他那张马脸还长。锁链在臂上缠了三圈：一个逃魂揣着天曹发的《通关度牒》闯出枉死城，连过七道关卡，关关见牒放行。他追了三天三夜，腿都快跑细了，那魂还在乱坟岗子上冲他做鬼脸。',
   choices:[
    {t:'接过锁链，替他去乱坟岗截路',r:{log:'马面一跃而下，把锁链塞进你手里：它走之字，你先把它的步子背下来！'}},
    {t:'问他：一纸度牒为何这么灵验',r:{flags:{flag_know_truth:1},log:'他啐了一口：牒不认人，人认牒——真要是阎君殿发的，轮得到它在老子锁链底下跑？'}},
    {t:'塞给马面一袋钱，劝他就当没看见',r:{money:20,erode:2,flags:{flag_ruthless:1},log:'马面把钱袋掼回你怀里：办成二字比天大，这单俺丢不起这张脸。'}}
   ]},
  {type:'game',game:'memory',difficulty:1,
   text:'乱坟岗子磷火幽幽，逃魂专走「之」字，每一步虚晃都在磷火里留个亮儿。马面的规矩：读招先读落脚——他把逃魂一连串虚晃的磷火序指给你看，法坛三转、序列渐长，你照序连环复按，把它的假步子背下来，真往哪个方向逃便瞒不过你。记错一环，本轮重转。',
   pass:{enemyVuln:true,merit:4,favor:{ma_mian:5},log:'三转磷火序你一记不差。马面长臂一振，锁链在坟头间绕成个活扣：它再虚晃，也撞进扣眼里。'}},
  {type:'battle',enemy:'chidietaohun',name:'持牒逃魂',scale:1.15},
  {type:'event',text:'逃魂被锁链缠了个结实，度牒飘落在地，夹层里抖出一张小票：「赎罪度牒·天曹良心价·不记名」。',
   choices:[
    {t:'销牒锁魂，牒纸封证',r:{favor:{ma_mian:10},flags:{flag_know_truth:1,flag_refuse_count:1},log:'你一把扯碎度牒，马面锁链顺势缠上逃魂脚踝。那张小票被他两指夹起，对着月光看了半天，脸色比平日更黑。'}},
    {t:'放魂走，只把牒的来路追到底',r:{favor:{ma_mian:6},flags:{flag_know_truth:2,flag_mercy_cut:1},log:'逃魂一步三回头地跑了。马面骂骂咧咧说晦气，锁链却收得很慢——小票上的天曹库记，他比谁都先看清楚了。'}},
    {t:'收下逃魂的买路财，连人带牒一起放',r:{money:80,erode:5,flags:{flag_ruthless:1},favor:{ma_mian:-10},log:'马面蹲回路碑上，拉长了脸看天：俺追了三天三夜，合着就输给一张纸、一袋钱。'}}
   ]}
 ]},

{id:'s28',name:'日巡小过录缺笔',god:'ri_youshen',chapter:2,side:'s28',danger:2,money:70,merit:14,
 scroll:'日游神的《日行小过录》昨日三十七笔，今晨只剩九笔；他怀疑昨日申时在街上巡行的，不是自己。',
 reward:{shards:{you:1},dshards:{ri_youshen:1}},
 nodes:[
  {type:'event',text:'日游神当街把你拦下，绛衣笔挺，皂带紧绷，胸前腰牌晃都不晃一下。他翻开《日行小过录》，指节因用力而发白：昨日亲笔录了三十七件，今晨册子发还，只剩九件，墨迹平整得像那二十八件从未存在——更可怕的是，他总觉得昨日在街上巡行的那个「自己」，回衙门时朝他客气地笑了一下。',
   choices:[
    {t:'调昨日当值签押与时辰来看',r:{flags:{flag_know_truth:1},log:'签押都在，时辰对得上，唯独申时到酉时的录册墨色发浮——那一个时辰，日头还在，「日游神」却换了个执笔的影子。'}},
    {t:'少的都是什么人的小过',r:{flags:{flag_know_truth:1},log:'他逐笔背：米行东家少秤、当铺朝奉掉包、善堂董事侵吞……少的二十八笔，笔笔记的是同一批人。'}},
    {t:'劝他：不如就当是自己记错了',r:{money:15,erode:2,flags:{flag_wen_compliance:1},log:'他嘴唇动了动，腰牌却垂下去半寸。一个只忠于记录的神，被要求承认自己的记录不算数。'}}
   ]},
  {type:'quiz',who:'日游神',text:'日游神把册子横在胸前，腰牌一晃，先拦住你翻页的手：「本神这行当，鸡零狗碎皆是凭据。你既替本神查那一个时辰，先答两问——答不上来，你也看不懂本神的录册。」',
   qs:[
    {q:'「本神昼行阳间，腰间这块牌子是干什么的，你可知道？」',
     opts:['昼巡阳间、记人善恶小过，每日录报察查司','夜巡坟地、专捉孤魂野鬼','司人间风雨雷电的时辰','守南天门、查验通关度牒'],a:0,
     why:'《月令广义》载日游神昼行人间，纤毫小过皆录在册、当日报察查司，是天庭考核各地善恶的末梢耳目——牌子在，记录就在。'},
    {q:'「册上凭空少了二十八笔，纸页却平整如新。」他盯着那片浮墨，「本神第一步，该查什么？」',
     opts:['查当值签押与时辰，对勘是谁在替班时动了录册','查今日黄历，宜不宜查账','问哪家香火烧得旺，必是那家人捣鬼','把缺的二十八笔一律补记成善行，皆大欢喜'],a:0,
     why:'记录不会自己消失——签押定人、时辰定空，两对勘合，哪个时辰换了人执笔，一查便知；替班的影子，就藏在申时那片浮墨里。'}
   ],
   pass:{enemyVuln:true,merit:5,favor:{ri_youshen:5},log:'日游神把腰牌摘下来递给你，难得说了句不那么公事公办的话：替我照着那影子，它怕人看。'}},
  {type:'battle',enemy:'zhouxuntiying',name:'昼巡替影',scale:0.65},
  {type:'event',text:'替影在日光下碎成一沓空白录帖——二十八笔小过，全被「合并优化」进了一个墨团。补与不补，笔在你手里。',
   choices:[
    {t:'连夜补回二十八笔，原册直送察查司',r:{favor:{ri_youshen:12},merit:6,flags:{flag_know_truth:1,flag_refuse_count:1},log:'日游神腰牌挺得笔直，一笔一划把二十八件小过补回原处——其中三件，记的是发壳替班的人自己。'}},
    {t:'接受「合并口径」，只在备注里留一行小字',r:{favor:{ri_youshen:4},erode:2,flags:{flag_wen_compliance:1},log:'册子光鲜平整地交了差。那行小字小得像没有，但他每天路过档房，都要多看一眼。'}},
    {t:'把删笔的事卖给被记的富户',r:{money:120,erode:6,flags:{flag_ruthless:1},favor:{ri_youshen:-10},log:'富户的银车连夜出了城。日游神把自己那块腰牌擦了又擦，最终没有摘下来。'}}
   ]}
 ]},

{id:'s29',name:'夜巡绿灯照残庙',god:'ye_youshen',chapter:2,side:'s29',danger:2,money:70,merit:14,
 scroll:'夜游神托你把一盏绿灯送到城西废将军庙：送到就放下，别照第二眼。',
 reward:{shards:{you:1},dshards:{ye_youshen:1}},
 nodes:[
  {type:'event',text:'月黑风高，一盏绿豆大的灯在你面前三尺悬停，灯后是玄冠玄服的夜游神。他不报名号，只把灯往你手里一塞，声音像井底浸过的石头：替本神把这盏灯送到城西破庙。送到就放下，别照第二眼——今夜巡夜的，有些不是本神的同僚。',
   choices:[
    {t:'接过绿灯，问庙里到底是什么',r:{flags:{flag_know_truth:1},log:'他沉默良久：销了籍、没死透、白天不敢出来的东西。它们在那儿躲了三年了。'}},
    {t:'问他：为何自己不去',r:{log:'「本神今夜要替它们引开另一批人。」绿灯在他指间纹丝不动，像捏着一颗心。'}},
    {t:'接过灯，转手要一笔「夜巡护送费」',r:{money:20,erode:2,flags:{flag_ruthless:1},log:'他没还价，也没生气，只把灯放在你脚边，自己退后了三步。'}}
   ]},
  {type:'game',game:'lights',difficulty:2,
   text:'通往残庙的夜路上，夜游神留下九盏绿灯。巡夜契丁一过，灯便被打翻一半——踏亮一盏，相邻四盏明暗齐翻。九灯尽绿，才照得出那条它们闻不见的路；灯阵不开，你与那一庙不敢见太阳的东西，谁也走不到天亮。',
   pass:{enemyVuln:true,merit:5,favor:{ye_youshen:5},log:'九盏绿灯幽幽连成一线，夜雾里浮出一条窄路。巡夜契丁循着灯响扑来——你早立在它看不见的光里。'}},
  {type:'battle',enemy:'xunyeqiwei',name:'巡夜契卫',scale:1.05},
  {type:'event',text:'庙门推开半扇，微弱香火里坐着十数道模糊身影——被销了籍的旧神残念，一齐抬头看你手里的灯。',
   choices:[
    {t:'替它们抹去灯痕，让庙在夜里继续「不存在」',r:{favor:{ye_youshen:12},flags:{flag_mercy_cut:1},log:'绿灯在庙墙上轻轻一抹，连今夜有人来过的影子都没了。那些不敢见太阳的呼吸，在黑暗里又安稳了一夜。'}},
    {t:'绿灯留下，把这座庙照给察查司看',r:{favor:{ye_youshen:6},flags:{flag_know_truth:2,flag_refuse_count:1},log:'灯亮到天明。庙被记了档，也被记进了另一本册子——救它的光，有时候也是照它的光。'}},
    {t:'收下残念凑的香火钱，指路让它们自谋生路',r:{money:60,erode:5,flags:{flag_ruthless:1},favor:{ye_youshen:-10},log:'几枚凉透的铜钱。绿灯在原地明了半夜，终于一寸一寸矮了下去。'}}
   ]}
 ]},

{id:'s30',name:'钟馗·持证虚耗',god:'zhong_kui',chapter:3,side:'s30',danger:3,money:80,merit:16,
 scroll:'持证「捉鬼师」反捉平民小鬼充业绩，罚恶司的剑劈不动文件。钟馗蹲在神衙门槛上，要借你这身外包的皮。',
 reward:{shards:{you:2},dshards:{zhong_kui:1}},
 nodes:[
  {type:'event',text:'破神衙门槛上蹲着个豹首环眼的蓝衣大汉，正抱着半截鬼腿啃，汁水淋漓。见你进门，他拿鬼骨一指：新来的，借你这身官皮一用。俺钟馗奉旨捉鬼，账房那地方有道气墙，罚恶司的人进不去；可你是外包——外包，哪儿都进得去。',
   choices:[
    {t:'问钟判官：账房里藏的是什么鬼',r:{flags:{flag_know_truth:1},log:'他咧开嘴：虚耗。专耗人喜事、偷人钱财的那个。如今人家穿官衣、持证件，坐在账房里合法地耗。'}},
    {t:'正色问他：罚恶司怎会捉不了鬼',r:{log:'钟馗把鬼骨往地上一摔：鬼拿着《捉鬼业务许可证》，证上盖着「降魔效率司」——俺这剑，劈得开鬼，劈不开文件。'}},
    {t:'跟他谈个跑腿价：没香火不办事',r:{money:20,flags:{flag_ruthless:1},log:'钟馗瞪你半晌，从怀里摸出一把压碎的纸钱塞过来：就这些。鬼都比你痛快。'}}
   ]},
  {type:'quiz',who:'钟馗',text:'钟判官也不起身，鬼骨敲着门槛先考你两问，声若洪钟：「莫看俺吃相难看，捉鬼这行的学问，全在肚子里。答不上来，你这身皮，俺不借。」',
   qs:[
    {q:'「俺钟馗生前也是读书人。」他抹了把嘴上的鬼油，「你可知俺一个状元，怎么就成了吃鬼的判官？」',
     opts:['终南山进士，因貌丑遭当场黜落，触阶而死，天帝命掌罚恶司','玄帝麾下披甲天将，因嗜酒被贬下凡','终南山里食鬼成精的老馗木成了人形','唐太宗族弟，奉旨专司捉鬼'],a:0,
     why:'唐明皇梦钟馗捉鬼（《梦溪笔谈》《唐逸史》）：钟馗才华盖世，却因貌丑在琼林宴上被黜，一怒触阶而死；天帝怜其刚烈，封罚恶司判官，专啖天下邪祟。'},
    {q:'「账房里那只，俺隔着三道墙都闻见味儿了。」他鼻翼一掀，「可知俺老钟当年替明皇捉的头一只有名有姓的鬼，叫什么？」',
     opts:['虚耗——专耗人吉庆喜事、偷盗财物的邪祟','催人入眠的睡梦小鬼','管添丁送子的报喜喜神','掌粮仓丰歉的谷精'],a:0,
     why:'钟判官成名一战，便是梦中为唐明皇捉「虚耗」——此鬼专在喜事里作祟、耗人吉庆、窃人财物。如今坐在账房里合法耗人的，和它一路。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:6,favor:{zhong_kui:5},log:'钟馗大笑，鬼骨往你怀里一抛：痛快！拿着，权当本判官借你的胆。那持证的东西若敢亮证，你连证带鬼一起揍。'}},
  {type:'battle',enemy:'chizhengxuhao',name:'持证虚耗',scale:1.1},
  {type:'event',text:'虚耗被踩在地上，怀里掉出一本烫金证件——《捉鬼业务许可证》，盖着新成立的「降魔效率司」大印，附一页本月业绩指标。',
   choices:[
    {t:'连证带鬼，一路打去「降魔效率司」',r:{favor:{zhong_kui:15},merit:8,flags:{flag_know_truth:1,flag_refuse_count:1},log:'钟判官把鬼腿骨一扔，拔剑就走：好！俺这身官皮进不去的门，你这身外包的皮，正好替俺踹开！'}},
    {t:'只吃了虚耗，许可证烧了不追人',r:{favor:{zhong_kui:8},flags:{flag_mercy_cut:1},log:'证在火里蜷成一团黑。钟馗咂咂嘴，说便宜了那帮穿官衣的，剑倒是还了鞘。'}},
    {t:'收下虚耗的孝敬，换条街让它开张',r:{money:150,erode:6,flags:{flag_ruthless:1},favor:{zhong_kui:-12},log:'钟馗盯着你看了很久，那眼神像在辨认一种新鬼。最后他吐掉嘴里的鬼骨头：这种，俺也吃。'}}
   ]}
 ]},

{id:'s31',name:'魏征·赏善司核档',god:'wei_zheng',chapter:3,side:'s31',danger:3,money:80,merit:16,
 scroll:'赏善司善簿疑云：富魂持箱装《善举认证书》，真善魂只有半块瓦片。魏征三日不眠，把善簿推给你核。',
 reward:{shards:{you:2},dshards:{wei_zheng:1}},
 nodes:[
  {type:'event',text:'赏善司堂前两列长队：一队衣衫褴褛，捧着发黄的施粥、埋骨、还账凭据；一队绫罗满身，手里捏着烫金的《善举认证书》。魏征高坐堂上，冷峻如一块旧砚，把摞到房梁高的善簿推下案：本官核了三日，眼已花。你是生脸，你来核——记住，本官宣过的旨，龙都斩得，况几个伪证。',
   choices:[
    {t:'先核绫罗队的《善举认证书》',r:{flags:{flag_know_truth:1},log:'册册施粥千石、修桥百座，受惠人证词却众口一词，像一个模子里拓的——连「感恩涕零」的涕字，都错成了同一个别字。'}},
    {t:'先核褴褛队的旧凭据',r:{flags:{flag_mercy_cut:1},log:'一个老妪的凭据是半块瓦片：她埋过十八具路倒。瓦片背面，是十八个死者各自的记号。'}},
    {t:'问魏公：核错了会如何',r:{log:'他盯着你：伪善入了人天道，真善投了牛马胎——你核错一笔，来世就错一家人。'}}
   ]},
  {type:'quiz',who:'魏征',text:'魏征提笔悬在善簿上，未落，先问你两问。堂前两列魂都屏住了声——人曹官考校，比他手里那支笔还冷。',
   qs:[
    {q:'「世人只知本官能谏。」他目光不离簿面，「可还有一桩事，是本官梦魂里领的天旨——你读史，可知是什么？」',
     opts:['梦授天旨，斩了私改雨点数的泾河老龙','替汉高祖芒砀山开路斩白蛇','在蟠桃会上斩了作乱的龙三太子','于南天门草拟雷霆雨诏'],a:0,
     why:'《西游记》第九、十回：魏征为唐太宗臣子，白日梦魂中受天旨，斩了私改雨点数的泾河老龙——人曹官的剑，龙也躲不过，何况一纸伪证。'},
    {q:'「本官这赏善司，掌的到底是什么？」笔尖抬起，正对着那两列长队。',
     opts:['核查生前行善真伪，据以核定来生人天福报','缉拿恶鬼，投入十八层地狱','核定生死寿数，朱笔勾魂','勘验尸首伤痕，平反冤假错案'],a:0,
     why:'阴司四司各有分工：罚恶钟馗、察查陆判、阴律崔珏；魏征的赏善司专核善行真赝、定福报高下——善档一注水，轮回的公道就坏了。'}
   ],
   pass:{enemyVuln:true,merit:7,favor:{wei_zheng:5},log:'魏公难得地微微颔首，把笔交入你手中：字要正，心更要正。持着它去拆那些烫金册子，册子后头的东西自然会扑出来。'}},
  {type:'battle',enemy:'renzhengkeli',name:'认证壳吏',scale:0.85},
  {type:'event',text:'伪证扯碎，碎纸里滚出一枚「福报摇号代办」的铜戳——好胎名额，明码标价。怎么了这桩案，魏征在堂上等你回话。',
   choices:[
    {t:'当堂剔除伪档，穷魂善举逐一补录',r:{favor:{wei_zheng:15},merit:8,flags:{flag_know_truth:1,flag_refuse_count:1},log:'魏征一言不发，提笔在每份伪档上画了个硕大的「伪」字。人曹官的笔落下去，堂上浮金的「福报摇号代办」招牌无风自落。'}},
    {t:'只剔伪档，代办司的事另册移交',r:{favor:{wei_zheng:6},flags:{flag_neutral_pact:1},log:'档正了，账也结了——至于谁开的铺子，魏公说：律有专条，各归各司。'}},
    {t:'收下「复核辛苦费」，让伪档过关',r:{money:160,erode:6,flags:{flag_ruthless:1},favor:{wei_zheng:-12},log:'魏征看你的眼神，和当年看斩龙台上的泾河龙王一模一样：冷，且已经举起了笔。'}}
   ]}
 ]},

{id:'s32',name:'陆判开棺·烧埋银',god:'lu_zhidao',chapter:3,side:'s32',danger:3,money:70,merit:16,
 scroll:'尸主「自尽」三日不腐，家属已收天曹三倍烧埋银，明早火化灭迹。陆判三更抛刀：察查司公文要等半月，你不用。',
 reward:{shards:{you:2},dshards:{lu_zhidao:1}},
 nodes:[
  {type:'event',text:'三更义庄，一口薄皮棺材停在院中，盖钉只钉了一半。绿面赤须的陆判蹲在棺头上，手里抛着一把薄刃验尸刀，见你翻墙进来咧嘴一笑：《聊斋》读过没？本判最善开棺。尸主「自尽」三日不腐、冤魂喊冤；家属已收天曹《避劫险》三倍烧埋银，明早一到便火化——剖不剖，你给句痛快话。',
   choices:[
    {t:'接过刀，开棺',r:{flags:{flag_know_truth:1},log:'刀入领口，他在旁指点：自缢的索沟斜着提空、耳后分叉；你看这一道——平绕一整圈，是死后被人挂上去的。'}},
    {t:'问他：察查司的公文为何下不来',r:{flags:{flag_know_truth:1},log:'陆判冷笑：理赔单走的是「天曹速裁」，本判的勘验签排到半月后。人家要的就是尸身赶在本判签字前，成灰。'}},
    {t:'劝他：钱都赔了，家属都认了，何必',r:{money:20,erode:2,flags:{flag_ruthless:1},log:'他把验尸刀钉进棺木，直没至柄：家属认钱，死人可没认。'}}
   ]},
  {type:'quiz',who:'陆之道',text:'陆判把薄刀往你掌心一拍，绿脸上赤须一翘：「拿本判的刀，先懂本判的规矩。两问答得上来，这棺你开；答不上来，刀放下，墙怎么翻进来的怎么翻出去。」',
   qs:[
    {q:'「世人怕本判这张脸，却没读过本判的来历。」他用刀背敲了敲棺材，「《聊斋》里那个替朋友换心开智、又替人妻子换首雪冤的判官，是谁？」',
     opts:['察查司判官陆之道（陆判）','大名府押狱蔡福','茅山派专赶尸的术士','阎罗殿后厨剔骨出身的庖人'],a:0,
     why:'蒲松龄《聊斋志异·陆判》：陆之道官居察查司，貌恶心热，为友朱尔旦换心开智、为其妻换首雪冤——剖得开皮肉，才剖得开案情。'},
    {q:'「尸主报的是自缢。」刀尖虚虚点过颈侧，「本判凭什么一眼说不是？」',
     opts:['自缢索沟斜上提空、耳后有分叉，被勒则平绕一整圈，验状只认实证','家属哭得最大声的便是冤，按哭声定案','谁出的烧埋银多，伤痕便向着谁的理','暴尸三日不腐即属自尽，不必再验'],a:0,
     why:'陆判验尸只替证据说话：缢痕走向、索沟深浅、骨中毒色都有定法。自缢提空分叉、勒毙平绕满圈——银钱和哭声，改不了刀下的伤痕。'}
   ],
   pass:{enemyVuln:true,merit:7,favor:{lu_zhidao:5},log:'陆判咧嘴一笑，赤须乱颤：行家！骨缝里那点东西，就交给你这双眼——本判倒要看看，谁敢半夜来抢尸。'}},
  {type:'battle',enemy:'lipeiqichai',name:'理赔契差',scale:1.1},
  {type:'event',text:'契差倒地，陆判从骨缝里刮出一点泛青的残色，凑近鼻端：柏香墨的毒——天曹行文的墨。火化的时辰，只剩半夜。',
   choices:[
    {t:'顶住火化令，保全天尸翻案',r:{favor:{lu_zhidao:15},flags:{flag_know_truth:2,flag_refuse_count:1},log:'陆判把验状往堂中一拍，骨缝里的柏香墨毒色还泛着青：天曹的火化工一个时辰也没敢点火。这案子，从「自尽」改成了「他杀」。'}},
    {t:'暗录一份验状，连夜送入崔珏值房',r:{favor:{lu_zhidao:8,cui_jue:6},flags:{flag_know_truth:1},log:'活人面前先按下不表，死人的话已先到了阴律司。陆判咧嘴一笑：刀下留的话，迟早说得出口。'}},
    {t:'签了火化同意书，收下三倍烧埋银',r:{money:140,erode:6,flags:{flag_ruthless:1},favor:{lu_zhidao:-12},log:'火起时陆之道站在义庄外没说话，只是把那把验尸刀慢慢擦了七遍，刀光一直跟着你。'}}
   ]}
 ]},

{id:'s33',name:'鲁班·缩尺神龛',god:'lu_ban',chapter:3,side:'s33',danger:3,money:70,merit:16,
 scroll:'鲁班验工「合规神龛」，墨斗七线齐歪半厘——不是线歪，是百万座神龛自己在缩。空瓤供的是谁，量出来是要得罪神仙的。',
 reward:{shards:{bing:2},dshards:{lu_ban:1}},
 nodes:[
  {type:'event',text:'天曹「合规神龛」营造工地，千万件新神龛码得望不到头。一个老木匠蹲在样龛前，墨斗在手里反复弹了七道线，七道线齐刷刷朝同一方向歪了半厘。他抬起头，眼神比墨还沉：娃，莫怪俺手艺潮——公输班的墨斗用了八百年，头一回，是房子在缩。',
   choices:[
    {t:'问他：房子怎么会自己缩',r:{flags:{flag_know_truth:1},log:'他从梁上摸出一把七分的新尺：按这尺打的样，每座神龛长宽各短一厘。百万座一厘一厘地省，省下来的料，夜里有车往天库拉。'}},
    {t:'接过墨斗，亲手弹一道线试试',r:{log:'线痕清清楚楚歪着。你盯着那道墨线看久了，竟觉得是自己的眼睛歪了。'}},
    {t:'压低声音：少管闲事，工钱又不少你的',r:{money:25,erode:2,flags:{flag_ruthless:1},log:'鲁班把墨斗往腰后一别：尺寸歪了，神住进去，脊梁也得歪。俺祖师爷丢不起这人。'}}
   ]},
  {type:'game',game:'pairs',difficulty:2,
   text:'工地上万千榫卯构件背置成海，同模同卯者成对。鲁班把墨斗往构件堆上一弹：每翻两件，同模则配住留案、异模则覆回。满案配齐，剩下那几件配不上对家的，就是不吃劲的空瓤——空瓤找不出，神龛塌下来，正好砸在「验收合格」的签子上。',
   pass:{enemyVuln:true,merit:7,favor:{lu_ban:5},log:'满案构件两两归卯，最后孤零零剩出七件空瓤，在月色里对不出半点木纹。鲁班墨斗线一绷：空的自己凑成一堆——会动了。'}},
  {type:'battle',enemy:'heguimoshou',name:'合规模兽',scale:0.85},
  {type:'event',text:'模兽散成一地七分短料。鲁班蹲在梁上，把一张缩尺图样卷成筒递给你：报与不报，你是在籍的，俺是请来的匠人，这话该你说。',
   choices:[
    {t:'墨斗直线弹到底，缩尺图样直奏营造司存档',r:{favor:{lu_ban:15},merit:8,flags:{flag_know_truth:1,flag_refuse_count:1},log:'鲁班把墨线拉得笔直，一松手，黑线从这头的神龛一直弹到天库那本账上——百万座神龛省下的料，全在这一条线里。'}},
    {t:'教匠人各在梁榫里暗留半寸，把亏空吃回手艺里',r:{favor:{lu_ban:10},flags:{flag_neutral_pact:1,flag_mercy_cut:1},log:'老木匠们心领神会，半寸半寸地把神龛撑回原样。账上缩着，屋里立着，神仙住进去，居然不晃。'}},
    {t:'收下总管的上料，在验收单上签「分毫不差」',r:{money:120,erode:5,flags:{flag_ruthless:1},favor:{lu_ban:-10},log:'鲁班接过那根上等桃木端详半天，忽然折成两截扔进墨斗：俺这线，给歪房子弹，不给歪心眼弹。'}}
   ]}
 ]},

{id:'s34',name:'何仙姑·荷池征水',god:'he_xiangu',chapter:3,side:'s34',danger:3,money:70,merit:16,
 scroll:'天曹水车把何仙姑的荷塘抽往瑶池补「景观水」，半池将枯，求子妇人仍排长队。仙姑：水的事，软着来。',
 reward:{shards:{sheng:2},dshards:{he_xiangu:1}},
 nodes:[
  {type:'event',text:'何家荷塘只剩半池浅水，粉荷稀了大半，泥裂得像老人手纹。池边仍排着长队——都是村妇，有的捧干荷叶求治腹痛，有的挺着肚子来求顺产。何仙姑赤足坐在池心残石上，见你来，轻轻把一片荷瓣放进你掌心，声音软得像水：硬堵那架水车要惊了胎气。水的事，咱们软着来。',
   choices:[
    {t:'问她：池泉被引去了哪里',r:{flags:{flag_know_truth:1},log:'她抬眼望向云深处：瑶池「景观补水」，一池活水供上头开三天宴。水车日夜不歇，公文叫「人间水域统一调配」。'}},
    {t:'先替排队的妇人施一轮荷叶露',r:{favor:{he_xiangu:3},flags:{flag_mercy_cut:1},log:'最后一片带露的荷叶分完了。仙姑看着仍在排长队的人，把自己坐着的那块残石都让了出来。'}},
    {t:'劝她：一池水换天庭欢心，不亏',r:{money:20,erode:2,flags:{flag_wen_compliance:1},log:'荷瓣在你掌心轻轻卷了边。她没怪你，只说：你看这队里站着的，也是「人间」两个字。'}}
   ]},
  {type:'quiz',who:'何仙姑',text:'仙姑自残石上起身，荷瓣在指尖一转，轻声拦住要去拔水车的你：「硬来之前，先答我两句。护人的法子若不懂，护着护着，就成了害人。」',
   qs:[
    {q:'「零陵的姐妹们供我，供的是什么，你可知道？」她望一眼长队。',
     opts:['八仙中唯一女仙，零陵女子食仙果得道，持荷行世，主女子疗愈生产之愿','南海观音座下捧珠的龙女','西王母蟠桃园里的织衣女官','东海龙宫司潮汐的龙女'],a:0,
     why:'《东游记》列八仙，何仙姑为唯一女仙，手持荷花，民间求子、求治妇人疾苦皆向她祈愿——这队村妇捧着的，正是她的香火。'},
    {q:'「水车就在头上，你说，为何不能一把火烧了？」她按住你的手腕。',
     opts:['强堵水车会惊了村中待产妇人的胎气，须以生息之法另引活泉','水车属金，火克不了金，烧也白烧','该先把求子妇人都劝回家，池子枯不干神仙的事','池既枯了，填平改种桑麻便是政绩'],a:0,
     why:'仙姑主女子生产之愿，引水先护两条命；硬来伤胎，唯有以荷露生息另开一脉暗泉回池，池子与人才两不妨——这就是「软着来」。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:7,favor:{he_xiangu:5},log:'仙姑将一捧荷露弹在你眉心，你周身像被清晨的荷叶包住。水车边扑来的差丁，只闻得见一池清香，摸不准你在哪片叶下。'}},
  {type:'battle',enemy:'zhengshuichaiding',name:'征水差丁',scale:1.05},
  {type:'event',text:'差丁退去，头顶水车还在哗哗地转。何仙姑看着半池枯荷，等你替她拿最后的主意。',
   choices:[
    {t:'以荷露为引，暗开一脉活泉回池，明池暗泉双活',r:{favor:{he_xiangu:15},flags:{flag_mercy_cut:1,flag_refuse_count:1},log:'仙姑指尖荷瓣漂入淤泥，清泉无声无息漫回半枯的荷塘。水车照旧在天上哗哗地抽，池面却一日日圆了回来——抽得走明水，抽不走生根的脉。'}},
    {t:'请村妇们按下手印，联名陈情求留一池',r:{favor:{he_xiangu:8},flags:{flag_know_truth:1,flag_stance:1},log:'几百个红手印按在状纸上，最上头那个手印旁，还歪歪扭扭印了个小脚丫。天曹的水车，破天荒停了半日。'}},
    {t:'收下「迁池补偿款」，签字让池改田',r:{money:120,erode:6,flags:{flag_ruthless:1},favor:{he_xiangu:-12},log:'仙姑没有争辩，只把最后一片干荷瓣收进袖中。从那以后，那一带妇人生产时，再也没人梦见过荷花。'}}
   ]}
 ]},

{id:'s35',name:'武圣祠·香火断供案',god:'guan_yu',chapter:4,side:'s35',danger:4,money:120,merit:28,
 scroll:'城南老关帝祠香火断供三月，隔壁「新武圣祈福中心」日进斗金。关平托梦：祠里那口刀，夜里在哭。',
 reward:{items:['gy_dao','gy_pao']},
 nodes:[
  {type:'event',text:'城南老关帝祠的门槛被磨得发亮，如今却结了蛛网。神案上那柄供了百年的青龙偃月木样，刀身裂了一道细缝。夜风穿堂，你听见极轻的一声——像刀在叹气。一位赤面长髯的身影立在殿角阴影里，声如闷雷：某家祠堂穷，养不起刀了。隔壁那座金碧辉煌的「新武圣祈福中心」，某去看看是谁在替某家收香火。',
   choices:[
    {t:'问关帝：香火断供，为何不显圣自证',r:{flags:{flag_know_truth:1},log:'关羽冷笑：显圣？若显灵能断案，要你这道外包的差做什么。某家只管义不义——敛财的账，归你们阴司管。'}},
    {t:'先去「新武圣祈福中心」踩点',r:{log:'隔着三条街就望见鎏金大牌楼，香客排到巷口。门口横幅：开光武圣刀坠，限量九百九十九柄，扫码开光。'}},
    {t:'问他：办这案，有什么好处',r:{money:0,flags:{flag_ruthless:1},log:'关羽丹凤眼微睁，看你的眼神像看一根没长直的枪杆：好处。你若也讲这个，这案让某自己来——顺便把你也办了。'}}
   ]},
  {type:'quiz',who:'关羽',text:'关羽横刀立在祠门前，月色把他的影子拉成一道刀痕：「替某家办事，先得懂某家的规矩。义字怎么写，答上来再进门。」',
   qs:[
    {q:'「某家这口『汉寿亭侯』的印，」他以刀背轻叩神案，「你可知道，是谁给某封的侯？」',
     opts:['曹操表奏汉献帝所封——白马阵前斩颜良、解白马之围的军功侯','汉献帝私下笼络所封','刘备自立汉中王后追封','孙权为修好荆州所赠'],a:0,
     why:'《三国志·蜀书·关羽传》：建安五年，关羽策马刺颜良于万众之中，解白马之围，曹操表封其为汉寿亭侯。军功是真的，俸禄某收了——人，某是要走的。'},
    {q:'「金某收了，印某挂了。」刀背又是一叩，「某挂印封金之后，走的是哪条路？」',
     opts:['挂汉寿亭侯印于堂梁，封曹操所赠金银于库，护二位嫂嫂千里寻兄，过五关斩六将','带着金银连夜投奔东吴','留在曹营官拜先锋，官渡立功后再归刘备','假意南下，实则屯兵荆州'],a:0,
     why:'《三国演义》第二十六、二十七回：关羽封金挂印、留书辞曹，千里走单骑护嫂寻兄，过五关斩六将。「义」字，就是这么一步一步走成神位的。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:8,favor:{guan_yu:5},log:'关羽抚髯，殿角那柄木刀的裂缝竟合拢了半分：讲义的人，某家的刀认得。去罢——那伙假武圣，某随你身后。'}},
  {type:'battle',enemy:'chizhengxuhao',name:'假圣香会执事',scale:1.1},
  {type:'event',text:'「新武圣祈福中心」的鎏金牌楼塌了半边。假执事的「开光刀坠」滚了一地——全是锡皮灌铅。关羽的刀尖挑着那面「武圣授权」的锦旗，回头看你，等你收尾。',
   choices:[
    {t:'把锡坠充公、账册封存，香火七成还愿老祠',r:{favor:{guan_yu:15},merit:10,flags:{flag_refuse_count:1},log:'关羽难得笑了一声，把青龙偃月木样从神案上取下，连同案头那件旧锦袍一并推给你：祠穷，刀不能穷。这两件替某家带着——替某家看着人间。'}},
    {t:'只拆牌楼不追账，给香会小卒留条活路',r:{favor:{guan_yu:8},flags:{flag_mercy_cut:1},log:'关羽收刀入鞘：冤有头。那几个扫地的杂役确实不知情——你比某家年轻时，多三分饶人的雅量。锦袍你还是得收下，刀也是。'}},
    {t:'悄悄收下香会孝敬的一箱「香火分成」',r:{money:150,erode:8,flags:{flag_ruthless:1},favor:{guan_yu:-15},log:'箱盖合上的瞬间，你听见身后一声刀鸣，冷得像二月的河水。关羽没有回头，只留下一句话：义字倒着写，也认得出来。'}}
   ]}
 ]},

{id:'s36',name:'忘川·渡资滞纳案',god:'meng_po',chapter:4,side:'s36',danger:3,money:100,merit:24,
 scroll:'奈何桥头渡资凭空涨了三倍，穷魂攒不齐钱，桥头积压万人。孟婆搅着汤锅轻声说：涨价的令牌，是老身看着长大的一个孩子递出去的。',
 reward:{items:['mp_shao','mp_sha']},
 nodes:[
  {type:'event',text:'奈何桥头，长队从桥这头排到望乡台。汤锅腾起的雾气里，孟婆慢慢搅着勺，火光映着她眉间的皱纹：以前渡资三文，如今九文，还是「活动价」。递牌子收钱的那位，生前是老身看着长大的娃——如今官袍加身，管着「忘川渡务提举司」。老身这双手，熬汤行，掰手腕，不行了。',
   choices:[
    {t:'问她：渡资涨了，钱进了谁的口袋',r:{flags:{flag_know_truth:1},log:'孟婆舀起一勺汤又缓缓倒回：三文入公账，六文入私囊。桥头那杆秤，早就不称魂，只称钱了。'}},
    {t:'先替排队的穷魂垫一轮渡资',r:{money:-30,flags:{flag_mercy_cut:1},favor:{meng_po:6},log:'三十文换九个魂过了桥。第九个回头看你，还没喝汤，先把你的名字记住了——孟婆说，这就是她送你的利钱。'}},
    {t:'劝她：明哲保身，少管闲事',r:{erode:3,log:'孟婆搅汤的手没停：老身熬了三千年，把「记着」熬成了「忘了」。就这一桩，老身忘不掉。'}}
   ]},
  {type:'game',game:'lights',difficulty:2,
   text:'渡务司在桥面布了「引魂灯阵」：九盏渡灯被差役拨乱大半，灯灭处魂不认路，长队便永远排不到汤锅。孟婆把汤杓往你手里一塞：踏亮一盏，相邻四盏明暗齐翻——九灯尽明，魂自己认得桥；灯阵不开，你连提举司的门都摸不着。',
   pass:{enemyVuln:true,merit:6,favor:{meng_po:5},log:'九盏渡灯次第亮起，长队缓缓向前挪动。守灯差丁摸黑扑来——却一头撞进灯影里，魂看得见他，他看不见魂。'}},
  {type:'battle',enemy:'zhengshuichaiding',name:'囤渡资鬼吏',scale:1.0},
  {type:'event',text:'鬼吏被按在桥板上，怀里滚出一摞「渡资滞纳金催缴单」——落款盖着提举司大印。孟婆拖着老步子走近，汤勺在手里转了半圈，像一柄提了三千年的刀。她看看你，又看看那个她看着长大的孩子。',
   choices:[
    {t:'依律办：私囊六文一体追缴，牌子缴销',r:{favor:{meng_po:15},merit:8,flags:{flag_refuse_count:1},log:'孟婆把汤勺轻轻搁回锅沿，解下腰间那柄用了三千年的老杓，又从雾里抽出一件雾縠织的衣：账清了，心就轻了。这两件老身用惯的家什，你带着——汤凉了记得热，人凉了记得捞。'}},
    {t:'只追公账三文，私账当众烧了，留他一条改过的路',r:{favor:{meng_po:10},flags:{flag_mercy_cut:1},log:'催缴单在桥头烧成一蓬纸灰，混进汤锅的雾气。孟婆长长叹了口气，像卸下三千年里最重的一勺：老身替桥头十万个魂，谢你这一烧。家什你还是拿着——念想，得有人替老身带下去。'}},
    {t:'收下鬼吏塞的「渡务干股」，催缴单烧个干净',r:{money:130,erode:7,flags:{flag_ruthless:1},favor:{meng_po:-12},log:'纸灰飘进汤锅的那一刻，整锅汤泛起一层浑浊的油花。孟婆盯着那层油花看了很久，缓缓把汤杓收了回去：这锅汤，今天不舀了。'}}
   ]}
 ]},

{id:'s37',name:'罚恶司·空饷鬼吏案',god:'zhong_kui',chapter:4,side:'s37',danger:4,money:120,merit:28,
 scroll:'罚恶司「捉鬼业绩册」月月满额，人间恶鬼却越捉越多。钟馗嚼着一根鬼骨：册上三百个鬼差，俺点了名——二百七十个是空的。',
 reward:{items:['zk_jian','zk_mao']},
 nodes:[
  {type:'event',text:'罚恶司大堂，业绩册堆得比房梁高，页页「满额」「嘉奖」「先进司局」。钟馗一屁股坐在案上，把一册摔到你脚边：你自己看。三百个在编鬼差，俸禄月月领足；俺昨夜吹灯点名，到的只有三十个——剩下二百七十个名字底下，连个鬼影都没有。空饷吃到俺罚恶司头上来了，俺这口牙，都气痒了。',
   choices:[
    {t:'问他：空饷的名额，钱流去了哪里',r:{flags:{flag_know_truth:1},log:'钟馗咬碎那根鬼骨：每个空名额月俸四十文，二百七十个名额，一年十三万文——够俺给终南山老家的娃们，修十座桥。'}},
    {t:'翻册验对：空名额的笔迹出自谁手',r:{log:'三百个名字，二百七十个的墨色一模一样——同一支笔、同一夜写就。落笔的那只手，连装都懒得装。'}},
    {t:'劝他：空饷是衙门积弊，睁只眼闭只眼',r:{erode:4,log:'钟馗眼一瞪，环眼圆睁如两口铜钟：俺生前撞柱，撞的就是这个「睁只眼闭只眼」。你要劝俺这个，趁早走，别脏了俺的门槛。'}}
   ]},
  {type:'quiz',who:'钟馗',text:'钟馗从案上跳下来，鬼骨往掌心一敲：「跟俺办案，先考你两问。俺的事你知道得越真，俺心里越踏实——鬼容易认，人难认，你先让俺认认你。」',
   qs:[
    {q:'「后人说俺『钟馗嫁妹』。」他咧嘴一笑，难得有些腼腆，「你可知道，俺嫁的是谁？」',
     opts:['生前以小妹许配同乡好友杜平；俺死后为践前诺，率鬼众连夜还乡，风风光光把妹妹嫁给了他','阎罗之女下嫁罚恶司','俺闺女嫁给了判官崔珏','玉帝赐婚，嫁与二郎神'],a:0,
     why:'民间「钟馗嫁妹」传说：书生杜平昔年助葬含冤触阶而死的钟馗（一说掩其遗骨）。钟馗感其恩，践生前婚约，率小鬼笙箫灯烛、连夜还乡送妹完婚——鬼嫁妹，嫁的是一个「信」字。'},
    {q:'「画像上的俺，前头总有个小东西开路。」他用鬼骨点了点自己的画像，「是什么？」',
     opts:['一只蝙蝠——专嗅鬼气所在，「蝠」谐「福」，名为先行官','一只白泽——通万物之情','黑无常的锁链','一盏引魂幡'],a:0,
     why:'传统钟馗画中，前方常绘蝙蝠引路：蝠替钟馗嗅出藏鬼之处，「蝠」又谐「福」——福到之前，鬼先现形。俺的先行官，翅膀比官印好使。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:8,favor:{zhong_kui:5},log:'钟馗仰头大笑，笑声震得房梁上的业绩册簌簌落灰：中！这两问答得地道，俺这案子，你就不是外人。走——陪俺去会会那支一夜写出二百七十个名字的笔。'}},
  {type:'battle',enemy:'renzhengkeli',name:'空饷鬼吏',scale:0.95},
  {type:'event',text:'空饷鬼吏瘫坐在账册堆里，怀里还死死抱着那枚「业绩审核司」的铜印。钟馗的剑尖抵着他的官帽，回头看你——这案子怎么收尾，他让你说。',
   choices:[
    {t:'空饷全数追缴，名录直报酆都，一查到底',r:{favor:{zhong_kui:15},merit:10,flags:{flag_refuse_count:1},log:'钟馗把剑往地上一杵，从腰后解下佩剑、又扯下自己那件皂色官袍，一并拍在你怀里：痛快！这两件俺用惯的家伙什给你——剑替俺多斩几个恶的，袍替俺多挡几阵阴的。查到底这三个字，俺记下了。'}},
    {t:'追缴空饷，但给三十个真当差的鬼差补足欠俸',r:{favor:{zhong_kui:10},flags:{flag_mercy_cut:1},log:'钟馗盯着你看了半晌，忽然咧嘴：查恶还惦记着善的——中，比俺年轻时想得周全。剑和袍你拿着。俺去给那三十个真干活的，一人补一碗热汤。'}},
    {t:'收下鬼吏的「封口香火」，名录就地烧了',r:{money:150,erode:8,flags:{flag_ruthless:1},favor:{zhong_kui:-15},log:'火光映在钟馗脸上，那双环眼里第一次没有怒，只有冷：俺吃鬼三千，今日算开了眼——鬼里头，还数你最像人。他收剑入鞘，转身走进了罚恶司的浓雾里。'}}
   ]}
 ]},

{id:'s38',name:'花果山·猴口普查案',god:'sun_wukong',chapter:4,side:'s38',danger:5,money:150,merit:32,
 scroll:'外包总署要给花果山群猴办「妖籍编制」，不办编的按黑户妖收押。斗战胜佛蹲在山门口啃桃：俺的猴子猴孙，几时轮到别人来点名。',
 reward:{items:['sw_gun','sw_jin']},
 nodes:[
  {type:'event',text:'花果山水帘洞前，一群小猴抱成一团。山门口立着崭新的木牌：「妖口普查登记处——不登记者视同黑户妖，收押待遣」。一只穿黄马甲的编制兽正在点名，点一个，烙一个铁牌。孙悟空蹲在旁边石崖上啃桃，桃核一颗颗吐在登记处的公文上：五百年前他们给俺一顶弼马温的帽，五百年后他们给俺的猴孙一个铁牌——天庭办外包，真是越办越有心得。',
   choices:[
    {t:'问他：当年招安两次都没成，这次为何不走砸的路子',r:{flags:{flag_know_truth:1},log:'孙悟空把桃核一吐：砸？俺砸过一次天，砸出来个五行山。这次俺想看看——你这道外包的差，敢不敢按你们自己写的规矩，办你们自己的人。'}},
    {t:'先替被烙牌的小猴解下铁牌',r:{flags:{flag_mercy_cut:1},favor:{sun_wukong:6},log:'铁牌还没烙进肉里，你解开一枚，小猴眼泪吧嗒吧嗒掉。石崖上的大圣把啃了一半的桃扔给你：甜的。替俺谢谢你的手。'}},
    {t:'劝他：编制好歹是个身份，让猴群先登了再说',r:{erode:4,log:'孙悟空眼皮一抬，那双眼在桃叶影里亮得吓人：身份？俺的老猴子们在这山上住了十万年——山，才是他们的身份。你这话，像五百年前劝俺的那批。'}}
   ]},
  {type:'quiz',who:'孙悟空',text:'孙悟空从石崖上一跃而下，金箍棒往地上一杵，山门口的石板裂出蛛网纹：「跟俺办事不用考试——但俺得知道，你懂不懂俺当年为什么反。答不上来的，俺不怪你，但这案子你别碰。」',
   qs:[
    {q:'「俺第一次上天做官，」他屈起一根手指，「玉帝给俺封了个什么？」',
     opts:['弼马温——御马监养马的末流小官，俺知道官小后打出南天门','齐天大圣——有官无禄的虚衔','天蓬元帅——水军统领','卷帘大将——贴身护卫'],a:0,
     why:'《西游记》第四回：玉帝封孙悟空为弼马温。悟空得知这是个「未入流」的养马小官后大怒，反下天去。后来玉帝封「齐天大圣」，却是「有官无禄」的空衔——招安两次，两次都不是真给位子。'},
    {q:'「第二次招安，齐天大圣听着风光。」他又屈一根手指，「俺后来为什么又反了？」',
     opts:['蟠桃会没请俺——俺管着蟠桃园，请柬名单上却没俺的名字','嫌俸禄太少','俺想娶妻，天庭不许','俺偷懒误了差事，怕受罚'],a:0,
     why:'《西游记》第五回：孙悟空受封齐天大圣、代管蟠桃园，王母设蟠桃会，请了各路神仙，独独没请他。一句「没请俺」翻了整个天——要的从来不是桃，是那个「名分」。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:10,favor:{sun_wukong:5},log:'孙悟空咧嘴一笑，火眼金睛在暮色里亮成两盏灯：中！你懂俺——名分不是桃，是脸面。走，陪俺会会那个给俺猴孙点名的东西。'}},
  {type:'battle',enemy:'bianzhishou',name:'妖籍编制兽',scale:1.2},
  {type:'event',text:'编制兽瘫在碎石里，黄马甲裂开，里面掉出半页「妖口普查KPI考核表」——登记数、烙牌率、收押转化，样样算绩效。编制兽的上线，是外包总署的一位挂牌专员。孙悟空用金箍棒挑起那张考核表，转头看你，龇牙一笑，笑意没到眼底。',
   choices:[
    {t:'依律办：普查令撤销，已烙铁牌全数取缔，专员立案',r:{favor:{sun_wukong:15},merit:12,flags:{flag_refuse_count:1},log:'孙悟空仰天大笑三声，从耳后掣出金箍棒晃一晃，缩小成一根绣花针大小，又从怀里摸出锁子黄金甲与一顶凤翅冠，一并抛给你：痛快！这些是俺当年闹天的行头，压箱底五百年了——你这样的人，配穿。替俺看着他们，别让他们再给活物烙牌。'}},
    {t:'只撤普查令，黄马甲们留职察看，给他们条改的路',r:{favor:{sun_wukong:10},flags:{flag_mercy_cut:1},log:'孙悟空挑眉看了你半晌，忽然乐了：嘿，你这猴子……不对，你这人，比俺当年多一样东西——耐性。行头你拿着。俺去后山看看那些烙了牌的，伤，得一个一个上药。'}},
    {t:'悄悄收下挂牌专员的「普查代办承包费」',r:{money:180,erode:9,flags:{flag_ruthless:1},favor:{sun_wukong:-18},log:'银钱入袖的瞬间，一股大力把你掀出三丈远。孙悟空收棒而立，声音冷得像五行山的雪：承包费。好啊——五百年前他们承包了俺，今日你承包了俺的猴孙。这行头你碰都不配碰，滚。'}}
   ]}
 ]},

{id:'s39',name:'陈塘关·藕身仿制案',god:'ne_zha',chapter:4,side:'s39',danger:4,money:130,merit:28,
 scroll:'陈塘关外黑作坊仿制「莲花化身」工艺，藕身论斤卖。劣质藕身泡了水会烂，买身的孩童魂魄困在烂藕里出不来。哪吒踩着风火轮堵在作坊门口。',
 reward:{items:['nz_qiang','nz_quan']},
 nodes:[
  {type:'event',text:'陈塘关外的河滩上支着一片窝棚，木牌上写着「莲花化身·平价速成——三炷香出壳，童叟无欺」。窝棚里码着成排的藕身，白胖水嫩，泡在浑水里。哪吒踩着风火轮悬在半空，火尖枪指着作坊主，声音还是少年音，字却冷：莲花化身是太乙真人拿三年莲藕、九天甘露一节一节给俺塑的命。你们拿烂泥塘的藕、死水、还有魂不全的孩子——三天速成一个？那不是身，是棺材。',
   choices:[
    {t:'问他：既然是仿品，为什么孩子还会被困进去',r:{flags:{flag_know_truth:1},log:'哪吒枪尖一挑，挑起一只泡烂的藕身：正货是先有身、后渡魂。他们倒过来——先把孩子的魂按进去，再灌烂泥。魂跟烂藕长在一起，藕烂，魂跟着烂。俺当年剔骨还父，好歹是俺自己剔的。'}},
    {t:'先潜入窝棚，解救泡在浑水里的孩子魂',r:{flags:{flag_mercy_cut:1},favor:{ne_zha:6},log:'你趁夜解开三只烂藕，把困在里面的小魂捧出来。哪吒在棚顶接应，风火轮的火光暖得不烫手：慢点，轻点——他们被吓了很久了。'}},
    {t:'劝他：烧了作坊就行，别把事情闹大',r:{erode:4,log:'哪吒回头看你，眼里的火尖枪比手里那杆还亮：烧？烧了他们换个滩再开。俺烧过一次龙宫才知道——根子不烧，灰都会再长。这案子，得连根拔。'}}
   ]},
  {type:'quiz',who:'哪吒',text:'哪吒把火尖枪往河滩上一插，抱臂看你：「跟俺查这个案子，先弄明白俺自己是怎么回事。懂了俺的身，你才懂那些烂藕里的孩子亏在哪。」',
   qs:[
    {q:'「俺这副身子，」他跺跺脚，莲瓣纹在脚踝上泛光，「是怎么来的？」',
     opts:['剔骨还父、割肉还母之后，太乙真人以莲花荷叶为骨、莲藕为身，复活了俺','俺生来就是莲花做的','俺娘怀胎三年生出来的','龙宫赔偿给俺的'],a:0,
     why:'《封神演义》第十三、十四回：哪吒剔骨还父、割肉还母报父母养育之恩，魂魄无依。太乙真人以两枝莲花、三片荷叶、一粒金丹为媒，唤哪吒莲花化身重生——身是真人一节一节塑的，魂是自己回来的。所以山寨的「速成藕身」，缺的就是这份功夫和这份心。'},
    {q:'「作坊主说，莲花化身能『平价速成』。」他冷笑，「你猜俺师父塑这副身，用了多久？」',
     opts:['整整三年——采莲、炼藕、渡魂，一节都不能急','三天，本来就是速成的','一个时辰，法力到位就行','三十年'],a:0,
     why:'莲花化身的传说里，太乙真人取金丹度魂、莲花塑体，程仪郑重，非一日之功。民间演绎中更以「三年莲藕」喻其诚——身子是壳，魂是命， shortcuts 出来的只能是棺材。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:8,favor:{ne_zha:5},log:'哪吒咧嘴一笑，露出一点少年气：行啊，你懂。那些孩子亏就亏在——没人肯为他们花三年。走，掀了这窝棚。'}},
  {type:'battle',enemy:'keshenkuilei',name:'量产藕身·伪莲',scale:1.0},
  {type:'event',text:'伪莲傀儡碎成一滩烂泥，浑水里的藕身全部现出原形——大半是空壳，只有几个还困着微弱的魂。作坊主跪在滩上，供出上游的「莲艺公司」：供料、供模、供「速成符」。哪吒的枪尖抵着作坊主的后颈，回头看你的那一眼里，有火，也有克制。',
   choices:[
    {t:'依律办：作坊查封，孩子魂全数解救，公司线索直报天曹',r:{favor:{ne_zha:15},merit:10,flags:{flag_refuse_count:1},log:'最后一只烂藕解开，小魂们乘着风火轮的暖气升上天去。哪吒把火尖枪和乾坤圈解下来，抛给你：俺的两件旧家伙，跟俺从龙宫杀到天庭——你拿去。替俺盯着那个「莲艺公司」，魂的生意，一步都不能让。'}},
    {t:'解救孩子后，给作坊主留一条改过谋生的路',r:{favor:{ne_zha:10},flags:{flag_mercy_cut:1},log:'哪吒盯着作坊主看了很久，忽然收了枪：俺爹当年也想给俺一条路，没来得及。这条，算俺替他给的。枪和圈你拿着——俺去把河滩的浑水引活。死水养不出真莲，人也一样。'}},
    {t:'收下作坊主的「销赃分成」，查封的事缓一缓',r:{money:160,erode:8,flags:{flag_ruthless:1},favor:{ne_zha:-16},log:'风火轮的火光「腾」地大了一圈。哪吒没有说话，只是抬手把浑水里最后一只烂藕劈开、放出小魂，然后头也不回地走了。河滩上只剩一句话飘回来：俺最恨的，就是把命当生意的人。'}}
   ]}
 ]},

{id:'s40',name:'灌江口·天眼外包案',god:'er_lang',chapter:4,side:'s40',danger:4,money:130,merit:28,
 scroll:'二郎神的天眼被外包给「监测公司」，看什么、不看什么全由 KPI 决定。草头神裁了一半，梅山兄弟只剩三个还在点名册上。清源真君提枪立在灌江口：本君的眼，几时轮到别人眨。',
 reward:{items:['el_jian','el_yin']},
 nodes:[
  {type:'event',text:'灌江口旧庙，二郎神杨戬负手立在殿前，额上竖眼半睁半闭。他身后立着两块新碑：左边「天眼监测·灌江口服务站」，右边「草头神精简名单」——一千二百草头神，在册的只剩三百。服务站牌匾下的执行吏正拿着「巡查KPI表」逐项打钩：凡香火、违建、越级上访必看；水患、渔船失事、山民求救——「不在监测范围」。杨戬开口，声音不高：本君这只眼，生来是看妖的。他们拿去，专挑不敢还手的看。',
   choices:[
    {t:'问他：天眼是怎么被外包出去的',r:{flags:{flag_know_truth:1},log:'杨戬额上竖眼睁开一线：文书写的「技术托管，提高效率」。签发的是外包总署，盖印的是本君自己的旧印——印在别人手里放了半年，本君今日才知道。调令可以不听，印……防不住。'}},
    {t:'先去码头拦下「不在监测范围」的渔船求救',r:{flags:{flag_mercy_cut:1},favor:{er_lang:6},log:'你借了哨船出港，把翻覆渔船上的三个渔民拖了回来。回港时杨戬立在栈桥尽头，微微颔首：眼外包了，手脚还没外包。这救人的功夫，比监测 KPI 强。'}},
    {t:'劝他：天眼既然能托管，不如顺势把巡查也外包省心',r:{erode:4,log:'杨戬缓缓转头，竖眼彻底睁开——那一眼里有山崩前的静：省心？本君担山逐日那只眼，看的从来不是省心，是民心。你这话说出口之前，本君当你没想过。'}}
   ]},
  {type:'quiz',who:'二郎神',text:'杨戬以枪杵地，额上竖眼映着江水微光：「替本君办案，先答两问。答对了，本君的眼睛——借你看一段本君的来历。懂了本君的眼，你才知道那只眼该看什么、不该看什么。」',
   qs:[
    {q:'「本君额上这只眼，」他抬手虚点眉心，「来历与一桩旧案有关。是什么？」',
     opts:['劈山救母——本君斧劈桃山，救出被压的母亲，竖眼是那一场孝与逆之间开的','生来就有，无特殊来历','玉帝赐的监察之眼','斗战胜佛打出来的伤'],a:0,
     why:'《二郎宝卷》等民间传说：杨戬之母（云华仙女）思凡下嫁被压桃山，杨戬长大後持斧劈山救母。额上竖眼，民间多解为劈山时天地感应所开——一只看破天规的眼睛，源自一桩天规压出来的冤。'},
    {q:'「『听调不听宣』。」他淡淡道，「八个字，本君挂了千年。它是什么意思？」',
     opts:['调令可以接——出兵平乱照办；宣召不去——不进朝、不站班、不见驾','完全听命于天庭','完全不服从天庭','只在灌江口办公，别的一概不问'],a:0,
     why:'《西游记》第六回：玉帝调二郎神擒孙悟空，他「听调不听宣」——接调令出兵，但不受宣召入朝、不领天庭恩赏班列。割据一方的自治底线：事可以办，膝不能软。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:8,favor:{er_lang:5},log:'杨戬收枪而立，竖眼里第一次有了点温度：答得好。调与宣都分得清的人，看得清什么该看、什么不该看。走——本君的眼今日借你，去会会那只按 KPI 眨的眼。'}},
  {type:'battle',enemy:'bailangjiaojiang',name:'监测哨·墨鳞蛟役',scale:1.0},
  {type:'event',text:'墨鳞蛟役沉入江底，服务站牌匾塌了半边。「监测公司」的管线图露出来：天眼的每一次「违规记录」都在下游标价——记录越多，罚款提成越高；至于渔船与山民，不在 KPI 里，便不在眼里。杨戬捏着那份管线图，指节发白，回头看你。',
   choices:[
    {t:'依律办：托管文书作废，旧印追回，标价记录全数移交天曹彻查',r:{favor:{er_lang:15},merit:10,flags:{flag_refuse_count:1},log:'杨戬把三尖两刃枪与银甲一并递到你面前，罕见地拱了拱手：枪随本君挑过灌江口每一丈水，甲替本君挡过天条三道雷——今日起，它们随你。本君的眼还在本君额上，但你这样的人，值得本君多看一眼。'}},
    {t:'收回天眼即可，被裁的草头神先复职，公司的人既往暂不深究',r:{favor:{er_lang:10},flags:{flag_mercy_cut:1},log:'杨戬看着三百草头神重新列队点名，沉默半晌：兵是本君的骨。你先替本君把骨接上了——枪和甲你拿着。至于那家公司……本君记下了。账，慢慢算。'}},
    {t:'收下监测公司的「数据服务年费」，管线图就地烧毁',r:{money:170,erode:8,flags:{flag_ruthless:1},favor:{er_lang:-16},log:'管线图烧起来的时候，江面起了三尺高的浪。杨戬立在浪头上，竖眼看着你，一字一句：本君这只眼看过妖、看过鬼、看过天条——今日头一回，看错一个人。枪与甲，你没资格碰。'}}
   ]}
 ]},

{id:'s41',name:'南海·功德回扣案',god:'guan_yin',chapter:4,side:'s41',danger:3,money:110,merit:26,
 scroll:'普陀山功德箱接入「功德金融」：香客捐的善款被做成理财产品滚动生息，救助名单却越批越慢。潮音洞外，菩萨将杨柳枝轻轻一蘸：甘露不能生利息。',
 reward:{items:['gw_ping','gw_shan']},
 nodes:[
  {type:'event',text:'普陀山步道，香客如织。功德箱换了新的——鎏金镶嵌，正面一块小牌：「功德金融·善款增值计划：您的每一文功德都在生息」。箱侧贴着一行小字：「救助申请审批周期 45-180 天」。潮音洞外，观音菩萨立在紫竹林边，净瓶抱在臂弯，声音像退潮后的沙滩，平静，却压着整片海：善款生息，利息去了哪里，他们答「滚动再投资」。可山下疫病的人等不了四十五天，饿的人连四五天都等不了。',
   choices:[
    {t:'问菩萨：既然账目可疑，为何不直接查封',r:{flags:{flag_know_truth:1},log:'菩萨望向功德箱，目光悲而不怒：直接查封，箱里现银一断，山下今冬的粥棚明日就开不了火。慈悲要救人，也要顾粥——所以这案子，要一根线一根线地抽，不能一刀断。'}},
    {t:'先去粥棚看看等救助的人，再决定怎么办',r:{flags:{flag_mercy_cut:1},favor:{guan_yin:6},log:'粥棚里，老妇人把半碗粥推给孙子，自己喝米汤。管事的尼姑红着眼：申请递了三个月，批文说「还在走流程」。你记下了流程的每一站。菩萨的声音在你身后响起：看见了，就不算白来。'}},
    {t:'劝菩萨：理财生息若真能做大善款，未必是坏事',r:{erode:4,log:'菩萨轻轻摇头，杨柳枝在瓶口一点：甘露一滴可活一人，酿成酒再分给万人，醉的不是人，是账。善款是哭声换来的——哭声，不能生利息。'}}
   ]},
  {type:'quiz',who:'观音菩萨',text:'菩萨于紫竹林中暂坐，指尖绕着杨柳枝：「此案要抽线，先得懂两件事：观音为何要听，又为何要救。答得上，此案你来办，我与你甘露为凭。」',
   qs:[
    {q:'「世人唤我『观世音』。」菩萨道，「这名字里的『音』，指什么？」',
     opts:['世间的哭声与呼救声——寻声救苦，谁在苦难中称名，我便观其音声前往解脱','观世间的音乐','听天庭的旨音','佛祖的说法之音'],a:0,
     why:'《妙法莲华经·观世音菩萨普门品》：「若有无量百千万亿众生受诸苦恼，闻是观世音菩萨，一心称名，观世音菩萨即时观其音声，皆得解脱。」观的是苦音——所以功德箱里每一文钱背后，都该有一个被听见的哭声。'},
    {q:'「那日佛祖问众菩萨谁肯去人间应劫。」菩萨望着山下香客，「我是怎么应的？」',
     opts:['「我来。」只两个字，没有条件，没有期限','要求先拨三千揭谛听用','要求免去自身轮回之苦','推荐文殊菩萨前往'],a:0,
     why:'民间佛经变文与《西游记》第十二回观音长安寻取经人的化现里，观音应诺皆是简洁如一：不问难易，不谈条件。慈悲的门槛从来不在能力，在「肯不肯先应一声」。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:8,favor:{guan_yin:5},log:'菩萨微微颔首，杨柳枝在净瓶中轻轻一搅，瓶面雾气散开：你听得见。听得见的人，办这案子，我放心。去吧——那只功德箱背后的库吏，已经等这声「查」很久了。'}},
  {type:'battle',enemy:'tiankukugui',name:'功德库鬼·息差使者',scale:1.0},
  {type:'event',text:'息差使者散作一缕灰雾，账册哗啦啦落了一地：「功德金融」的钱，四成进了「渠道费」，三成进了「管理费」，真正下山到粥棚药铺的，不足一成半。菩萨拾起账册，一页页翻过，翻得很慢——她把每一笔被挪用的善款，都念出了一位申请人的名字。念完，她看向你。',
   choices:[
    {t:'依律办：本金全数追回直拨粥棚药铺，息差链一查到底',r:{favor:{guan_yin:15},merit:10,flags:{flag_refuse_count:1},log:'菩萨自臂弯取下净瓶，又解下身上那袭月白袈裟，叠好，放进你手里：瓶里的水，三日一换，记得让它听一听山下的声音；袈裟挡过刀，也挡过冷——往后替我，多走几趟山下。此案的利息，就用在每一个名字上。'}},
    {t:'先冻结账户保本金，渠道费既往暂免追，保粥棚不断炊为第一',r:{favor:{guan_yin:10},flags:{flag_mercy_cut:1},log:'菩萨望着你，眼中有几乎看不见的笑意：先保粥，再算账——你懂了慈悲的次序。瓶与袈裟你带着。账我记着，一笔不会少，但一口粥，也不会晚。'}},
    {t:'收下「渠道总代理」的干股，账册代为「妥善保管」',r:{money:160,erode:8,flags:{flag_ruthless:1},favor:{guan_yin:-16},log:'菩萨没有看你，只是把那本账册从你手边轻轻抽回，抱进臂弯，转身面向大海。潮声很大，她的声音很小，你却字字听得清：苦海无边。回头，是岸——我在岸上，等你自己走回来。'}}
   ]}
 ]},

{id:'s42',name:'阴律司·借寿回执案',god:'cui_jue',chapter:4,side:'s42',danger:4,money:120,merit:28,
 scroll:'阴律司一夜少了三千张「借寿回执」。凡间有富户拿它提前支取阳寿，被支取的，全是些没人替他们说话的穷魂。',
 reward:{items:['cj_bi','cj_pao']},
 nodes:[
  {type:'event',text:'阴律司的库房没有门，只有一道朱砂封条——封条完好，回执却少了三千张。崔珏把朱笔搁在砚上，笔尖悬着一滴不肯落的朱砂：本判昨日核对，簿上死了的还活着，活着的已经死了。有人在替本判勾人，勾得比本判还熟。',
   choices:[
    {t:'问他：回执上的印，是谁盖的',r:{flags:{flag_know_truth:1},log:'崔珏从袖里取出一张回执，印色鲜红，边角却洇了水：印是真的，纸也是真的。只是这印，三年前就该缴销——如今盖它的人，在人间开着「延寿代办」的铺子。'}},
    {t:'先去人间，看看被「借寿」的都是些什么人家',r:{favor:{cui_jue:6},flags:{flag_mercy_cut:1},log:'三户人家：一户是替人抬棺的挑夫，一户是守寡的绣娘，一户是还不识字的孩子。他们都「自愿」签了字——画押的红泥，是别人按着他们的手按下去的。'}},
    {t:'劝他：生死簿上的事，不必查得太细',r:{erode:3,log:'崔珏把笔搁回去，朱砂终于落下，在案上洇成一个极小的红点：簿上少一撇，人间多一座坟。本判若也嫌细，那三千张回执，就该有三千个冤魂替你记着。'}}
   ]},
  {type:'quiz',who:'崔珏',text:'崔珏把生死簿推到案角，朱笔横在簿上：要替本判去人间勾这一笔，先答本判两问。答不上，这案本判自己跑一趟。',
   qs:[
    {q:'「本判替唐太宗在生死簿上添过寿。」崔珏道，「添了多少年？」',opts:['二十年——把「贞观一十三年」改成了「三十三年」','十年','三十年','五十年'],a:0,why:'《西游记》第十、十一回：崔珏私改生死簿，将「贞观一十三年」改为「三十三年」，即添寿二十年。他敢改一次，也只敢改这一次——改的是皇帝的寿，赔的是自己的名。'},
    {q:'「那你说，」崔珏抬眼，「本判掌的阴律司，管的是哪一桩？」',opts:['天下生死簿与阴律刑名——勾注寿夭，按律定罚','人间赏善记功','恶鬼缉拿刑罚','六道投胎轮转'],a:0,why:'地府四判官分司：赏善司魏征、罚恶司钟馗、察查司陆之道、阴律司崔珏。阴律司掌生死簿与刑律勾注——所以「借寿」这种事，动的正是他的笔。'}
   ],
   pass:{shield:0.25,enemyVuln:true,merit:8,favor:{cui_jue:5},log:'崔珏点头，把朱笔在砚边磕了两下，笔尖那滴朱砂终于落回墨海：懂簿的人，才配动笔。去罢——那间「延寿代办」的铺子，本判替你封了门，剩下的路，你自己走。'}},
  {type:'battle',enemy:'maopaijiachai',name:'私刻回执·代办掌柜',scale:1.1},
  {type:'event',text:'铺子后堂挂满「延寿成功」的锦旗，旗下一排玻璃罐，罐里泡着从回执上剥下来的名字。掌柜跪在地上，还在算这笔账能赔多少。',
   choices:[
    {t:'依律办：回执尽数缴销，名字逐个还魂，私印当堂熔了',r:{favor:{cui_jue:15},merit:10,flags:{flag_refuse_count:1},log:'崔珏从袖中取出那支朱笔，又解下身上皂袍，一并放进你手里：笔给你，勾得准；袍给你，站得住。私印熔了之后，那三千个名字自己走回簿上——没有一个回头看这间铺子。'}},
    {t:'只追回已支取的阳寿，未用的回执留个自首台阶',r:{favor:{cui_jue:10},flags:{flag_mercy_cut:1},log:'崔珏沉默半晌，把笔收了回去，只把袍子递给你：律是死的，人是活的。本判替你担这一笔——但你要替本判记住，宽一次是仁，宽两次就是账。'}},
    {t:'收下「延寿代办」三成干股，回执改成「已核销」',r:{money:150,erode:8,flags:{flag_ruthless:1},favor:{cui_jue:-15},log:'崔珏看着你，眼里那点温度一点点退干净：本判见过太多这样的手。朱笔在簿上一划，你的名字后面，从此多了一个墨点。'}}
   ]}
 ]},

{id:'s43',name:'赏善司·龙鳞抵押案',god:'wei_zheng',chapter:4,side:'s43',danger:4,money:120,merit:28,
 scroll:'泾河龙王的旧案卷宗被人从赏善司借走，一借不还；市面上的钱庄，开始拿「龙王旧案一页」作抵押放贷。',
 reward:{items:['wz_jian','wz_fu']},
 nodes:[
  {type:'event',text:'赏善司的灯点到后半夜。魏征立在长案后，衣冠一丝不乱：泾河龙王那一案，本官生前梦中所斩，卷宗封了三百年。如今它被人一页一页借出去，做成了钱庄的抵押品。借据上盖的，是本司的章。',
   choices:[
    {t:'查借阅簿：卷宗是从哪个「合规流程」出去的',r:{flags:{flag_know_truth:1},log:'借阅簿上只有一行字：「业务需要，长期借用」。签字的名字是一团墨，像被人反复涂过。魏征盯着那团墨看了很久：本官认字，认了三十年，涂了的也认得出。'}},
    {t:'先去钱庄，看那些拿旧案抵押的穷户',r:{favor:{wei_zheng:6},flags:{flag_mercy_cut:1},log:'钱庄后堂压着一叠借据，抵押物全是「一页旧案」。借钱的有渔户、有船工、有丢了儿子的老妇。他们不知道那页纸上写着什么，只知道押上去，才借得到救命钱。'}},
    {t:'劝他：旧案既已封存，借出去也无妨',r:{erode:3,log:'魏征把卷宗合上，声音不高：本官斩龙那夜，也是在梦里。梦里的刀落下去，河就干了。这案若借出去，落下去的就不是刀了。'}}
   ]},
  {type:'game',game:'memory',difficulty:2,
   text:'钱庄的抵押库里堆着三百页散卷，页页字迹相似。魏征把赏善簿摊在案上：翻开的页，看一遍就得记住；三百年旧案，一页都不能错配。配错的，就是让钱庄把「斩龙」二字，写成了「保龙」。',
   pass:{enemyVuln:true,merit:7,favor:{wei_zheng:5},log:'三百页旧案一页页归位，最后压在案底的，是泾河龙王亲笔的诉状。魏征用朱笔在边角点了一点：这一页，本官记得。它写的不是冤，是一句「龙王行雨，误了时辰，该斩」。'}},
  {type:'battle',enemy:'chidietaohun',name:'持牒借卷·钱庄判官',scale:1.1},
  {type:'event',text:'钱庄判官倒下时，怀里掉出一叠借据，最上面那张押的是「一页旧案」，落款是个渔户的名字。',
   choices:[
    {t:'依律办：借据尽焚，卷宗归还，私章当众销去',r:{favor:{wei_zheng:15},merit:10,flags:{flag_refuse_count:1},log:'魏征解下腰间的梦斩剑，又脱下朝服，一并递给你：剑无锋，斩的是心里的偏；服很旧，站的是该站的地方。借据一页页烧起来，火光映着他半边冷脸，像极了当年梦里那一刀。'}},
    {t:'先销穷户的借据，钱庄的账留待秋后算',r:{favor:{wei_zheng:10},flags:{flag_mercy_cut:1},log:'魏征点头：先救人，再算账——这是本官做谏臣时才学会的次序。剑与服你带去。钱庄的账，本官一笔一笔，慢慢同他们算。'}},
    {t:'收下钱庄的「顾问」聘书，把借阅簿改成「内部存档」',r:{money:150,erode:8,flags:{flag_ruthless:1},favor:{wei_zheng:-16},log:'魏征没有发怒，只是把那本借阅簿合上，压回案角：本官生前骂过皇帝，死后还骂得动判官。你这样的，本官见得多——簿上不缺你一个名字。'}}
   ]}
 ]},

{id:'s44',name:'察查司·代死替身案',god:'lu_zhidao',chapter:4,side:'s44',danger:4,money:120,merit:28,
 scroll:'察查司的验状上，一年里死了三回同一个人。三具尸首，三张脸，验状上的名字，却只有那一个。',
 reward:{items:['lz_dao','lz_pao']},
 nodes:[
  {type:'event',text:'察查司的停尸房比别处冷。陆之道蹲在第三具尸首旁，薄刃挑开验状：这具是溺死的，上一具是病死的，最早那具是摔死的。三具尸首，指纹不同，牙口不同，可验状上写的是同一个名字。他抬眼：有一种生意，能让该死的人不死。叫「替死」。',
   choices:[
    {t:'查那三具尸首的来处，是谁把他们「送」来的',r:{flags:{flag_know_truth:1},log:'三具尸首来处不同，收尸的却是同一个「善堂」。善堂账上写着「无主孤魂，代为安葬」，安葬费一笔一笔，全由一个姓钱的富户出。陆之道把验状折起来：出钱的人，命最金贵。'}},
    {t:'先去看看那个本该死了三回的人，如今怎样',r:{favor:{lu_zhidao:6},flags:{flag_mercy_cut:1},log:'那人躺在锦被里，气色好得很，只是不敢照镜子。他说每换一个替身，梦里就多一个人站在床前，不说话，只看着他。陆之道听完，只说了一句：验状能换，梦换不了。'}},
    {t:'劝他：验状既已签押，翻案恐伤察查司颜面',r:{erode:3,log:'陆之道把薄刃在袖上擦了擦：本判验尸，验的是尸，不是颜面。颜面能盖棺，尸首盖不住。'}}
   ]},
  {type:'game',game:'spot',difficulty:2,
   text:'停尸房的长案上摊开九张验状，印色、纸色、墨色几乎一样。陆之道把勘验镜推到你手边：真验状的朱印压在「致命伤」三个字上，假的那几张，印压的是名字。找出来——找错一张，就多一个人白死。',
   pass:{enemyVuln:true,merit:7,favor:{lu_zhidao:5},log:'九张验状，四张是假的。假状上的朱印都压着名字，压得端端正正——像是生怕别人看不见那个人是谁。陆之道用刀尖挑了挑：真验状从不急着认人，它先认伤。'}},
  {type:'battle',enemy:'maopaijiachai',name:'善堂收尸·代死掮客',scale:1.1},
  {type:'event',text:'掮客的包袱里滚出一叠「替死协议」，每张都按着血手印，最底下压着一块刻好的新验状印。',
   choices:[
    {t:'依律办：三案并查，替死链一挖到底，假印当堂销毁',r:{favor:{lu_zhidao:15},merit:10,flags:{flag_refuse_count:1},log:'陆之道把剖心薄刃横在掌心，又解下皂衣，一起交到你手上：刀薄，割得开谎；衣旧，遮得住冷。三具尸首各自归了名，最后那一个躺在锦被里的人，第一次敢照镜子——镜子里只有他自己。'}},
    {t:'只把三具尸首归名安葬，替死钱庄的事报上去慢慢查',r:{favor:{lu_zhidao:10},flags:{flag_mercy_cut:1},log:'陆之道点头：先让死人有个名字，再让活人有个说法。刀与衣你带着。剩下的账，本判一页一页翻，翻到翻不动为止。'}},
    {t:'收下富户的「善堂捐输」，把三份验状并作一份「意外」',r:{money:150,erode:8,flags:{flag_ruthless:1},favor:{lu_zhidao:-16},log:'陆之道把三张验状一张张铺平，压上镇纸，没有看你：本判验过三千具尸，最难看的一具，是活人。你走罢，这间屋子，你不必再来了。'}}
   ]}
 ]},

{id:'s45',name:'财帛司·香火期货案',god:'bi_gan',chapter:4,side:'s45',danger:4,money:130,merit:28,
 scroll:'财帛司的香火账上，多了一批「未到账的香火」——有人把明年、后年的香火提前卖了，一层层加价，卖到了第三手。',
 reward:{items:['bg_cheng','bg_pao']},
 nodes:[
  {type:'event',text:'财帛司的算盘声一夜没停。比干坐在案后，衣襟敞着——胸口那里空着，什么也没有。他把账册推过来：本官没有心，所以不看人，只看数。这批香火，今年一文没进，账上却记了三年。三年之后若进不来呢？进不来，那些买了「期货」的人，就得拿自己的香火填。',
   choices:[
    {t:'查这批「期货」是谁发的，凭证又是什么',r:{flags:{flag_know_truth:1},log:'凭证是一张黄纸，印着「财帛司预收」，底下盖的是个「代」字章。比干用指甲刮了刮那个字：本官的印，从来不刻「代」字。代谁？代天？天没让他代。'}},
    {t:'先去人间，看买了期货的都是些什么人',r:{favor:{bi_gan:6},flags:{flag_mercy_cut:1},log:'买主多是些小庙的庙祝、卖香烛的摊贩，还有把养老钱换成黄纸的老人。他们不识字，只听人说「财神爷的香火，稳赚不赔」。比干听完，胸口那处空荡荡的衣襟，忽然像被风吹了一下。'}},
    {t:'劝他：香火账上的虚数，来年补上就行',r:{erode:3,log:'比干把算盘一推，珠子撞出一串冷响：账可以补，香火补不了。香火是人家跪着烧的，不是算盘上拨出来的。'}}
   ]},
  {type:'game',game:'pairs',difficulty:2,
   text:'财帛司的库房里堆着两摞凭证：一摞是「已入库」的香火单，一摞是「预收」的黄纸。比干把无心秤往案上一搁：单子配单子，数量对得上才是真香火；配不上的，就是拿明年的纸，烧今年的账。',
   pass:{enemyVuln:true,merit:7,favor:{bi_gan:5},log:'满案凭证配到最后，剩下一叠黄纸，怎么配都配不出对应的入库单。比干用秤杆轻轻一挑，黄纸飞起来，底下压着一行小字：「本券最终解释权归财帛司所有」。他笑了一下，没有心的人笑起来，比哭还冷。'}},
  {type:'battle',enemy:'moguigui',name:'平账墨柜鬼',scale:1.1},
  {type:'event',text:'墨柜鬼化成一摊墨，墨里浮出一枚私刻的「代」字章。比干把它捞起来，在指间掂了掂。',
   choices:[
    {t:'依律办：期货尽废，预收凭证全额清退，私章入炉',r:{favor:{bi_gan:15},merit:10,flags:{flag_refuse_count:1},log:'比干把无心秤与锦袍一并给你：秤没有准星，因为良心不该有准星；袍子面子是钱、里子是布，因为命总在里层。清退那日，小庙的庙祝抱着黄纸哭，比干站在殿角，胸口空着，却像比谁都有心。'}},
    {t:'先清退小户的凭证，大户的按年折价慢慢还',r:{favor:{bi_gan:10},flags:{flag_mercy_cut:1},log:'比干点头：先让烧得起香的人有香烧，再让卖香的人有账算。秤与袍你拿去。这笔虚数本官认下——反正本官没有心，赔得起。'}},
    {t:'收下「财帛司顾问」的干股，把黄纸改成「合规理财」',r:{money:160,erode:8,flags:{flag_ruthless:1},favor:{bi_gan:-16},log:'比干把算盘归零，抬眼看你：本官被挖心那日，才知道没有心也能活。今日看你，才知道没有心，也能做神。你走罢——这算盘，本官要重打一遍。'}}
   ]}
 ]},

{id:'s46',name:'药王庙·延命订阅案',god:'sun_simiao',chapter:4,side:'s46',danger:3,money:110,merit:26,
 scroll:'凡间新起一门生意：「按月订阅，续命不断」。断供一日，病即复发；断供一月，人就没了。',
 reward:{items:['ssm_chu','ssm_pao']},
 nodes:[
  {type:'event',text:'药王庙后院的药圃荒了半边。孙思邈蹲在畦边，捻起一撮土：这土三年没换过，种什么死什么。前殿的「延命订阅」，药是从这儿出去的——本王的方子被人改了三味，添了一味。添的那味，叫「断不得」。',
   choices:[
    {t:'查订阅契书：药里到底添了什么',r:{flags:{flag_know_truth:1},log:'契书上一行小字：「本方含依赖性佐药，停药需遵医嘱」。可这城里，没有第二个大夫敢签这个医嘱。孙思邈把契书翻过来，背面印着药铺的号——正是他当年施药的那间铺子。'}},
    {t:'先去病家，看断供的人是什么下场',r:{favor:{sun_simiao:6},flags:{flag_mercy_cut:1},log:'一户人家把房契、田契、女儿的嫁妆全换成了药。最后一剂药喝完，男人坐在门槛上喘，女人抱着空药包哭。孙思邈站在门外看了很久，才低声说了一句：医者治病，不治穷。可这病，是穷治出来的。'}},
    {t:'劝他：药既有效，何必管人怎么买',r:{erode:3,log:'孙思邈把药锄插回土里：有效？虎狼之药也有效。本王行医一生，只开过治病的方，没开过拴人的绳。'}}
   ]},
  {type:'game',game:'memory',difficulty:2,
   text:'药王庙的丹房里摆着十二味药，孙思邈把药方一张张摊开又收起：看一遍，记住哪几味被换过。换过的药，颜色差一线，气味差一分——差这一线，就是一条命。',
   pass:{enemyVuln:true,merit:7,favor:{sun_simiao:5},log:'十二味药归位，三味被换过的露了出来：一味减了效，一味添了瘾，还有一味，是拿陈年药渣充的。孙思邈把药渣捻在指间，搓了搓：这味药，本王年轻时也用过——用来喂牲口。'}},
  {type:'battle',enemy:'yigui',name:'断供化形·药疫鬼',scale:1.05},
  {type:'event',text:'药疫鬼散成一团苦雾，雾里落下厚厚一叠订阅契书，每一张末尾都按着病家的手印。',
   choices:[
    {t:'依律办：契书尽废，停药改方，药铺收回公办',r:{favor:{sun_simiao:15},merit:10,flags:{flag_refuse_count:1},log:'孙思邈把千金药杵与布袍交到你手上：杵捣的是药，不是价；袍洗得再白，也白不过病人眼里那点盼头。改方那日，他亲自守了三天三夜，断药的人一个一个缓过来——没有一个再回去买那副「断不得」。'}},
    {t:'先免费施药三个月，让病家缓过来再谈契书',r:{favor:{sun_simiao:10},flags:{flag_mercy_cut:1},log:'孙思邈点头，把药杵递给你：治病如救火，先泼水，再查是谁点的火。杵与袍你带着。三个月后，本王亲自去收那些契书——一页都不留。'}},
    {t:'收下药铺三成干股，把「依赖佐药」写成「调理辅药」',r:{money:140,erode:8,flags:{flag_ruthless:1},favor:{sun_simiao:-16},log:'孙思邈没有骂你，只是把药圃里最后一株活着的药苗连根拔了，扔在你脚边：药王庙里，从此不供本王。你走罢，别带着这身药气回去。'}}
   ]}
 ]},

{id:'s47',name:'匠作监·傀儡替工案',god:'lu_ban',chapter:4,side:'s47',danger:3,money:110,merit:26,
 scroll:'匠作监的工匠名册上有一千二百人，工地上却只见三百张脸。其余九百人的工钱，月月照发，活儿也照干——只是干活的东西，不是人。',
 reward:{items:['lb_mo','lb_he']},
 nodes:[
  {type:'event',text:'匠作监的工棚里堆着刨花，香得很。鲁班把曲尺往梁上一卡，又俯身听了听地底：底下有响动，不是人走路的声音。他直起身：一千二百个工匠，三百张脸。剩下的九百个，是机关傀儡——照着匠人的手刻的，刻得比人还齐整。工钱呢？工钱进的是活人的口袋。',
   choices:[
    {t:'查名册：九百个「工匠」是谁替他们签的到',r:{flags:{flag_know_truth:1},log:'名册上九百个名字，笔迹全一样。签到用的是朱笔，一天一天，签得工工整整。鲁班摸了摸那笔迹：刻板。跟傀儡一个模子。'}},
    {t:'先去工棚，看那三百个真工匠过得如何',r:{favor:{lu_ban:6},flags:{flag_mercy_cut:1},log:'三百个真工匠挤在一间通铺上，工钱被扣了「工具磨损费」「傀儡维护费」。他们不敢说话——说了，就得换成傀儡。鲁班蹲在通铺边，半天没起来，只说了一句：俺这行，最忌讳拿假手替真手。'}},
    {t:'劝他：傀儡干活比人快，也算替天庭省了钱',r:{erode:3,log:'鲁班把曲尺往地上一插，尺影笔直：省的是钱，赔的是手艺。手艺一断，往后天庭塌了梁，谁来修？傀儡自己会修自己么？'}}
   ]},
  {type:'game',game:'pairs',difficulty:2,
   text:'工地上的构件摆了一地，鲁班把墨斗线一弹：真匠人打的榫卯，松紧差半丝，能咬得住；傀儡打的，尺寸分毫不差，却咬不住。两两配对，把傀儡件挑出来。',
   pass:{enemyVuln:true,merit:7,favor:{lu_ban:5},log:'配到最后，九百件「完美」的构件孤零零剩在一边，尺寸齐整得像用尺子画出来的。鲁班拿起一件，用拇指一按，咔的一声裂了：太齐整，反而没咬合。人做的东西，总得有点不齐整，才咬得住。'}},
  {type:'battle',enemy:'heguimoshou',name:'九百替工·傀儡总匠',scale:1.05},
  {type:'event',text:'傀儡总匠散成一地木屑，木屑里滚出一枚刻着「代工」的铜牌，牌后刻着一个名字——正是那位总监工。',
   choices:[
    {t:'依律办：傀儡尽毁，九百个名字销籍，工钱退赔工匠',r:{favor:{lu_ban:15},merit:10,flags:{flag_refuse_count:1},log:'鲁班把墨斗与短褐一并塞给你：墨线弹下去，歪的直的都在明面上；短褐卷着袖口，是干活的人才穿的。九百个名字销籍那日，三百个真工匠自己动手，把傀儡一件件拆了——拆到最后一件，谁也没舍得烧，留在了工棚门口，当个教训。'}},
    {t:'傀儡留着修堤坝，工钱折半补给真工匠',r:{favor:{lu_ban:10},flags:{flag_mercy_cut:1},log:'鲁班想了想，点头：东西是好东西，用歪了。留着干粗活，让活人干细活。墨斗与短褐你带去——记得，尺量得出长短，量不出良心。'}},
    {t:'收下总监工的「技术顾问」俸，把名册改成「人机协作」',r:{money:140,erode:8,flags:{flag_ruthless:1},favor:{lu_ban:-16},log:'鲁班把曲尺折成两截，扔在铜牌上，转身就走，走了两步又回头：俺祖师爷的规矩，只传手，不传印。你这印，俺不认。'}}
   ]}
 ]},

{id:'s48',name:'岳阳楼·度牒黄牛案',god:'lv_dongbin',chapter:4,side:'s48',danger:3,money:120,merit:27,
 scroll:'度牒是度人成仙的凭证，如今在岳阳楼下一手交钱、一手交牒。可这牒度出来的「仙人」，连御剑都飞不稳。',
 reward:{items:['lv_jian','lv_pao']},
 nodes:[
  {type:'event',text:'岳阳楼下的酒肆里，吕洞宾把酒壶倒扣在桌上，酒液一滴不剩：有人在卖本仙的度牒。三百两一张，说是本仙亲手度的。本仙这双手，一年也度不了三个。他抬眼笑了笑：更妙的是——买的人里头，有一半明知是假的。他们不买仙，买的是「我已经是仙了」这句话。',
   choices:[
    {t:'查度牒的来路：谁在刻印，谁在放盘',r:{flags:{flag_know_truth:1},log:'牒上的云纹刻得极工整，工整得不像人手，倒像同一块版翻出来的。吕洞宾用指甲刮下一层朱砂：官牒的朱砂掺金粉，这个掺的是铁锈。三百两一张，成本不到二十文。'}},
    {t:'先去买牒的人家，看他们如今怎样了',r:{favor:{lv_dongbin:6},flags:{flag_mercy_cut:1},log:'一个老秀才把度牒供在堂屋正中，每日焚香。他儿子说，爹把祖屋卖了换这张纸，如今一家六口挤在柴房。吕洞宾站在堂前看了半晌，一句话没说，把酒壶递给了那个儿子。'}},
    {t:'劝他：人家愿买愿卖，何必扫人兴致',r:{erode:3,log:'吕洞宾摇了摇空壶：度人不是卖货。本仙度的是人心里的那点明白，不是一张能挂在墙上的纸。你把明白卖了，他买到的就只有纸。'}}
   ]},
  {type:'quiz',who:'吕洞宾',text:'酒肆请来的说书人拍响醒木：「要说纯阳祖师，先问客官两句——」',
   qs:[
    {q:'点化吕洞宾、让他在黄粱一梦中大悟的是哪位神仙？',opts:['钟离权（汉钟离）','铁拐李','张果老'],a:0,why:'《钟吕传道集》记吕洞宾于长安酒肆遇钟离权，一枕黄粱未熟而悟道。'},
    {q:'吕洞宾在江淮一带最出名的除害事迹是？',opts:['斩蛟','射日','锁龙'],a:0,why:'传说江淮有蛟为害，吕洞宾以纯阳剑斩之，故有「江淮斩蛟」之说。'}
   ],
   pass:{enemyVuln:true,merit:7,favor:{lv_dongbin:5},log:'满堂喝彩里，吕洞宾靠在柱子上笑：讲得比本仙还真。不过——斩蛟那回，本仙其实是喝多了才去的。'}},
  {type:'battle',enemy:'juanxiansheng',name:'假度牒·卷仙生',scale:1.0},
  {type:'event',text:'卷仙生散成一地纸屑，纸屑里翻出一块雕版，版上刻着「纯阳亲度」四个反字。',
   choices:[
    {t:'依律办：雕版入炉，赃银退赔，买牒者销籍',r:{favor:{lv_dongbin:15},merit:10,flags:{flag_refuse_count:1},log:'吕洞宾把纯阳剑与道袍交给你：剑不刻名，是因为它只认该斩的东西；袍上酒渍洗不掉，是因为走过的地方都留着。退赔那日，老秀才抱着祖屋的契书哭，吕洞宾在楼头喝酒，喝到一半，把壶里剩下的一口，泼进了江里。'}},
    {t:'退银不退牒，让买牒的人自己撕了那张纸',r:{favor:{lv_dongbin:10},flags:{flag_mercy_cut:1},log:'吕洞宾点头：自己撕，比本仙去撕有用。剑与袍你拿着。那天岳阳楼下排了很长的队，人人手里一张黄纸，撕得哗哗响，像下了场纸雪。'}},
    {t:'收下雕版，改刻「天官赐福」继续卖',r:{money:150,erode:8,flags:{flag_ruthless:1},favor:{lv_dongbin:-16},log:'吕洞宾把酒壶抛起来又接住，壶里已经空了：本仙卖酒，从不卖名。你连本仙的名都敢拿去典当，往后谁的名不敢？他背过身去，江风把他的道袍吹得作响。'}}
   ]}
 ]},

{id:'s49',name:'荷池·仙露灌装案',god:'he_xiangu',chapter:4,side:'s49',danger:3,money:115,merit:26,
 scroll:'城里各家药铺都卖起了「荷仙姑亲制仙露」，一瓶难求。可喝了仙露的人，病没好，反倒咳出一股荷腥气。',
 reward:{items:['hx_zan','hx_yi']},
 nodes:[
  {type:'event',text:'何仙姑蹲在池边，指尖拨开一片荷叶，叶下浮着一层油花：本仙的露，是子时从荷叶上收的，一夜收不满半盏。他们的露，是从这池子里直接抽的——抽完还往里头倒东西，好叫它看着清。她把湿手在衣上按了按：这池水，本仙养了三百年。',
   choices:[
    {t:'查药铺的进货账与灌装作坊',r:{flags:{flag_know_truth:1},log:'账上写着「仙露」，进价三文一斤。作坊在后巷，一口大缸，一根竹管，一桶井水加两把明矾。墙上贴着张字条：照此配，色白、味淡、放三天不起沫。'}},
    {t:'先去看喝过仙露的病人',r:{favor:{he_xiangu:6},flags:{flag_mercy_cut:1},log:'城南一间小院里躺着七个人，都是舍不得请大夫、只想省钱的。最小的孩子才四岁，咳得说不出话。何仙姑在床边坐了很久，把带来的真露一勺一勺喂下去，喂到最后，手一直在抖。'}},
    {t:'劝她：井水明矾喝不死人，何必较真',r:{erode:3,log:'何仙姑把荷叶轻轻合上：喝不死人，可也治不好人。病人把命交给一瓶水，这瓶水就该担得起那条命。本仙担不起的，不敢卖。'}}
   ]},
  {type:'game',game:'pairs',difficulty:2,
   text:'药铺后堂摆着两排瓶子：一排是从池里收的真露，一排是灌装的假露。何仙姑把真露滴在指尖：真的粘手，假的滑手。依次配对，把假的挑出来。',
   pass:{enemyVuln:true,merit:7,favor:{he_xiangu:5},log:'配到最后，假露剩下整整三十六瓶，瓶底都沉着一层白。何仙姑拿起来摇了摇：明矾沉底，摇一摇就看不见了。可喝下去，它还是沉在那儿。'}},
  {type:'battle',enemy:'yigui',name:'荷腥化疫·装瓶鬼',scale:1.05},
  {type:'event',text:'装瓶鬼碎成一地玻璃，玻璃碴里泡着半张标签，印着「荷仙姑亲制」五个字，字是描红的。',
   choices:[
    {t:'依律办：假露尽毁，药铺封门，病家免费施真露',r:{favor:{he_xiangu:15},merit:10,flags:{flag_refuse_count:1},log:'何仙姑把玉簪与仙衣递给你：簪上那点露，天亮不干，是留给赶路的人的；这衣裳抽的是藕丝，断了还连着，是叫人别断了念想。施露那七日，池边排着长队，她一夜一夜地收露，收满了就分，分完了再收。'}},
    {t:'封作坊留铺子，让掌柜的用真露赔三年',r:{favor:{he_xiangu:10},flags:{flag_mercy_cut:1},log:'何仙姑沉吟了一下：三年够他把欠的还上，也够他记住。玉簪与仙衣你带着。本仙只有一个要求——赔的露，不许掺一滴井水。'}},
    {t:'收下作坊三成利，把假露改名「荷香饮」照卖',r:{money:145,erode:8,flags:{flag_ruthless:1},favor:{he_xiangu:-15},log:'何仙姑把手里那片荷叶放回水里，看它慢慢沉下去：本仙的池子，从今往后不照你了。她转身走进荷丛，荷叶一片片合拢，把她的背影收得干干净净。'}}
   ]}
 ]},

{id:'s50',name:'雷部·错劈赔付案',god:'dian_mu',chapter:4,side:'s50',danger:4,money:125,merit:28,
 scroll:'雷部新设「代劈」一职：谁出得起香火，雷就往谁指的头上落。三个月里，劈错了七个人。',
 reward:{items:['dm_jing','dm_yi']},
 nodes:[
  {type:'event',text:'电母把两面镜子立在案上，镜中映出七道焦痕：七个人，七个名字，七份「该劈」的批文。她指着其中一份：这人是个货郎，走夜路被雷追了三里地。批文上写他「忤逆」。本君照了三遍——他这辈子忤逆的，只有他那个赌钱的爹。她合上镜：先照后劈，是雷部的规矩。如今是先收钱，后照。',
   choices:[
    {t:'查批文是谁签的，代劈的价码怎么定',r:{flags:{flag_know_truth:1},log:'批文底下一行小字：「代办费，视香火厚薄，上不封顶」。电母用镜光一照，纸上浮出另一层字迹——原本写的是「查无实据」，「忤逆」二字是后描上去的，墨色还新。'}},
    {t:'先去七户人家，看他们如今怎样',r:{favor:{dian_mu:6},flags:{flag_mercy_cut:1},log:'货郎的媳妇把烧焦的扁担挂在门后，说留着给娃看：你爹不是坏人，是雷劈错了。电母在门外站着，镜子里映出她自己的脸，她看了很久，把镜子翻了过去。'}},
    {t:'劝她：雷部事忙，偶有错漏也是常情',r:{erode:3,log:'电母把镜子一转，光直直照在你脸上：雷劈错的，赔不回来。本君这面镜子，照得出妖，照不出「常情」二字。'}}
   ]},
  {type:'game',game:'spot',difficulty:2,
   text:'电母把七道雷痕并排照在镜上：真雷的痕迹是斜的，落地会炸开三道裂纹；代劈的雷，痕是直的，裂纹只有一道。找出那几道不对的。',
   pass:{enemyVuln:true,merit:7,favor:{dian_mu:5},log:'镜光扫过，三道假雷痕露了出来，直得像用尺子划的。电母冷笑：雷是从云里挣出来的，哪有这么听话。'}},
  {type:'battle',enemy:'huanzhongzhuyi',name:'代劈幻形·朱衣假雷',scale:1.05},
  {type:'event',text:'朱衣假雷在镜光里化了，化成一件空荡荡的朱袍，袍里掉出一串铜钱，钱孔里穿着七根头发。',
   choices:[
    {t:'依律办：代劈尽废，七户抚恤，私批文入炉',r:{favor:{dian_mu:15},merit:10,flags:{flag_refuse_count:1},log:'电母把电光镜与云雷衣给你：镜照的是妖，也照的是自己；这衣裳补丁歪歪扭扭，可雷劈不透。抚恤那日，她亲自去货郎家，把烧焦的扁担换成了新的，一句话没说，转身时镜光闪了一下。'}},
    {t:'留代劈一职，改由雷部直批、不收费',r:{favor:{dian_mu:10},flags:{flag_mercy_cut:1},log:'电母想了想：代劈本身没错，错在收钱。她提笔把「代办费」三字划掉，改成「直批」。镜与衣你拿去——记住，镜子里的人，也得照。'}},
    {t:'收下代劈的干股，把七桩改成「雷劫误伤」',r:{money:155,erode:8,flags:{flag_ruthless:1},favor:{dian_mu:-16},log:'电母把两面镜子背对背扣在案上，殿里一下子暗了：镜不对着你，是怕照出什么来。她没再看你：走吧。雷部往后劈谁，本君都先照三遍——包括你。'}}
   ]}
 ]},

{id:'s51',name:'玄坛·财符转租案',god:'zhao_gongming',chapter:4,side:'s51',danger:4,money:145,merit:30,
 scroll:'玄坛的财符本是保佑正经营生，如今被整沓租给赌坊。一夜之间，整条街的铺子都关了门。',
 reward:{items:['zg_bian','zg_jia']},
 nodes:[
  {type:'event',text:'赵公明踩着黑虎走进空街，靴底碾过一张黄符：本帅的符，一张保一间铺子一年。如今有人把符收上来，整沓租给赌坊，一张符押三家。他弯腰捡起符纸，对着光看了看：符是死的，人是活的。可这符要是被人当成了活物，就有人要拿命去填。',
   choices:[
    {t:'查符是从哪条线收上来的，租金又归谁',r:{flags:{flag_know_truth:1},log:'收符的是几个游方道士，穿得像，念得也像，就是不会画。符上的朱砂纹是印的，边角还有裁切的白茬。赵公明把符在指间一搓：本帅画符，从不裁边。'}},
    {t:'先去关门的铺子，问掌柜为何不做了',r:{favor:{zhao_gongming:6},flags:{flag_mercy_cut:1},log:'绸缎庄的掌柜坐在空铺子里理账，说赌坊的人来收过三回符，不给就砸。他指指柜台：货都在，客人没了。赌坊把整条街的香火都揽过去，谁还来买布？赵公明听完，把铁鞭往地上一顿，青石板裂了道缝。'}},
    {t:'劝他：符既租出去了，钱货两清',r:{erode:3,log:'赵公明冷笑：钱货两清？本帅这符，保的是营生，不是赌本。你收了赌坊的钱，就等于替本帅认了这个价。本帅早年管瘟，最知道拿人命换银子是什么滋味。'}}
   ]},
  {type:'game',game:'lights',difficulty:2,
   text:'玄坛库房里挂着一排灯，每盏灯对应一间铺子的香火：亮着的是还有人气的营生，灭的是被押给赌坊的。赵公明把灯芯递给你：把该留的留下。',
   pass:{enemyVuln:true,merit:7,favor:{zhao_gongming:5},log:'灯一盏盏点回去，最后剩下三盏怎么点都不亮——那三间铺子，早被赌坊的地契吞了。赵公明盯着那三盏黑灯看了半晌：灯灭了的，本帅赔。'}},
  {type:'battle',enemy:'qiwei',name:'转租契卫·财符业主',scale:1.1},
  {type:'event',text:'契卫碎成一地契纸，最上头一张写着「财符租赁，年息七分」，落款处按着赌坊的手印。',
   choices:[
    {t:'依律办：租赁契尽废，赌坊退符，铺子复业',r:{favor:{zhao_gongming:15},merit:10,flags:{flag_refuse_count:1},log:'赵公明把玄坛铁鞭与金甲交到你手上：鞭上那条红绳，是黑虎的缰绳——勒得住畜生，也勒得住贪心；甲片上刻的是还款日，不是欠账日。复业那日，整条街的灯一盏盏亮起来，黑虎趴在街口，谁也不敢再进来收符。'}},
    {t:'让赌坊补缴租金，铺子的符照旧发',r:{favor:{zhao_gongming:10},flags:{flag_mercy_cut:1},log:'赵公明点头：钱要退，路要留。铁鞭与金甲你拿着。他补了一句：本帅不怕人赌，怕的是有人拿本帅的名去赌。'}},
    {t:'收下赌坊的「香火分红」，把符改成「可转让」',r:{money:170,erode:8,flags:{flag_ruthless:1},favor:{zhao_gongming:-16},log:'赵公明把铁鞭横在门前，黑虎低吼了一声：本帅这符，一符一铺，一铺一家。你把它变成能转手的纸，就成了催命的状。他跨上虎背，走了很远才回头：钱是好东西——可不是这么挣的。'}}
   ]}
 ]},

{id:'s52',name:'文昌阁·点斗外包案',god:'wen_chang',chapter:4,side:'s52',danger:4,money:150,merit:31,
 scroll:'今年秋闱，上榜的名字和文章对不上——有人在文昌阁外接单：代点魁斗，价高者得。',
 reward:{items:['wc_bi','wc_pao']},
 nodes:[
  {type:'event',text:'文昌阁的廊下堆着一摞落卷，文昌帝君一份份翻过，翻到最后停下：这篇该是第一，落榜了；那篇连韵都押不上，中了。他把两份卷子并排铺开：本君的朱笔，点在谁头上，是看文章。如今有人替本君点——点的不是文章，是银子。天聋地哑立在阶下，一个听不见，一个说不出。',
   choices:[
    {t:'查落卷与中卷的差别，摸清接单的门路',r:{flags:{flag_know_truth:1},log:'落卷的卷面干净，中卷的卷角有个极小的墨点——像是被人掐过。文昌帝君把两卷对着光一照：墨点是暗记。记号对上了，文章好坏就不必看了。'}},
    {t:'先去落榜的人家，看他们怎么过这个秋天',r:{favor:{wen_chang:6},flags:{flag_mercy_cut:1},log:'一间柴屋里，书生把落卷一张张裱起来，说留着给自己看：我写得不好，我认。他娘在灶前抹眼泪，锅里煮的是草根。文昌帝君在门外站了很久，回身对天聋地哑说：这话，本君听见了。'}},
    {t:'劝他：榜已经放了，改也改不回来',r:{erode:3,log:'文昌帝君把朱笔搁下：榜能改。本君案头的禄籍，一日未定，一日可改。难的不是改榜，是改了之后，谁还信这支笔。'}}
   ]},
  {type:'game',game:'memory',difficulty:2,
   text:'文昌阁里摆着十二份卷子，暗记只有一个字大小。帝君把卷子一份份展开：看清楚哪几份的卷角有墨点。记住它，再挑出来。',
   pass:{enemyVuln:true,merit:7,favor:{wen_chang:5},log:'十二份卷子摊开，四份卷角有墨点，点法一模一样。文昌帝君用朱笔在每一点上添了一横：本君的笔是好笔，可惜被人拿去当了印。'}},
  {type:'battle',enemy:'moguigui',name:'代点墨柜鬼',scale:1.1},
  {type:'event',text:'墨柜鬼化成一摊浓墨，墨里沉着四份卷子，卷上名字各不同，字迹却是同一只手写的。',
   choices:[
    {t:'依律办：四卷作废，榜次重排，接单者销籍',r:{favor:{wen_chang:15},merit:10,flags:{flag_refuse_count:1},log:'文昌帝君把点斗朱笔与锦袍给你：这笔只点三下，点天、点地、点人心里那口气；袍上绣的星图，是给寒门子弟照路的。重排那日，落榜的书生被叫回阁中，他捧着卷子手直抖，一句话也说不出来。帝君背过身：不必谢，这是你自己写出来的。'}},
    {t:'只废四卷，其余不究，给落榜者补一次机会',r:{favor:{wen_chang:10},flags:{flag_mercy_cut:1},log:'文昌帝君沉吟良久：榜可以只改四处，人心得慢慢补。朱笔与锦袍你带去。他补了一句：补考那日，本君亲自看着。'}},
    {t:'收下接单者的分成，把四卷改成「特招」',r:{money:175,erode:8,flags:{flag_ruthless:1},favor:{wen_chang:-16},log:'文昌帝君把朱笔一折两段，扔在墨里：天聋地哑跟了本君三千年，今日才算明白——他们不是听不见、说不出，是不想听、不想说。你走罢。这支笔，本君要重新磨。'}}
   ]}
 ]},

{id:'s53',name:'湄洲·护航转包案',god:'ma_zu',chapter:4,side:'s53',danger:5,money:155,merit:32,
 scroll:'漕运衙门把「护航」包给了外头的「顺风堂」：交了钱，旗子插上，风雨照来，船照翻。',
 reward:{items:['mz_fan','mz_yi']},
 nodes:[
  {type:'event',text:'妈祖站在湄洲的礁石上，手里那盏引航灯忽明忽暗：本宫的灯，只在雾里亮，因为雾里的人才看得见。如今漕船挂的是一面「顺风旗」，交了银子就发。她抬手指向海面：昨夜翻了三条船，旗子都还在桅杆上飘着。风不认旗，只认灯。',
   choices:[
    {t:'查顺风堂是什么来路，旗子谁发的',r:{flags:{flag_know_truth:1},log:'顺风堂的旗，布是旧的，字是新描的，旗角还留着原来的半截纹样——是本宫庙里撤下来的旧幡。妈祖把旗子抖开看了看，忽然笑了：拿本宫的旧幡，收人家的买命钱。'}},
    {t:'先去码头，看翻船的家人怎么过',r:{favor:{ma_zu:6},flags:{flag_mercy_cut:1},log:'码头上摆着七副湿透的铺盖，几个妇人跪在潮线边上烧纸，纸灰被风一卷就散。妈祖蹲下去，把一盏小灯放在她们脚边：本宫来晚了。这句话她说得很轻，海风却一下子静了。'}},
    {t:'劝她：海上风险自古如此，怪不得人',r:{erode:3,log:'妈祖把灯举高，光照在海面上：风险是天给的，收钱不办事是人给的。本宫管不了天，管得了人——收钱的那只手，本宫记得住。'}}
   ]},
  {type:'game',game:'spot',difficulty:2,
   text:'妈祖把七面顺风旗并排铺在礁石上：真旗的针脚是双线，遇水不散；假旗是单线，泡一夜就开。找出那几面开线的。',
   pass:{enemyVuln:true,merit:7,favor:{ma_zu:5},log:'海水一泼，五面旗的边角齐齐散开，线头像水草一样浮着。妈祖把散了的旗子一片片收进袖里：线都舍不得用双股，还敢保人平安。'}},
  {type:'battle',enemy:'bailangjiaojiang',name:'顺风堂·白浪蛟将',scale:1.15},
  {type:'event',text:'白浪蛟将沉进海里，海面浮起一块木牌，牌上刻着「顺风堂护航，概不负责」，牌背钉着漕运衙门的官印。',
   choices:[
    {t:'依律办：顺风堂查封，旗子尽收，抚恤七家',r:{favor:{ma_zu:15},merit:10,flags:{flag_refuse_count:1},log:'妈祖把顺风帆与霞帔交给你：帆上每一块补丁，都是被救回来的船留下的；霞帔挡的不是风，是风里那口气。抚恤那日，她把七盏小灯一盏盏放到海里，灯顺着潮水漂远，一盏也没灭。'}},
    {t:'留顺风堂，改为官办，旗子一律免费',r:{favor:{ma_zu:10},flags:{flag_mercy_cut:1},log:'妈祖点头：旗子本身没错，错在拿它当买卖。帆与霞帔你拿着。她只说一句：往后发旗，先来本宫灯下照一照。'}},
    {t:'收下漕运衙门的分成，把「概不负责」改成「尽力而为」',r:{money:180,erode:8,flags:{flag_ruthless:1},favor:{ma_zu:-16},log:'妈祖把那盏引航灯吹灭了，海上顿时暗了一截：本宫的灯，从不替人免责。她转身走向海边，脚下浪头自己分开：你回去罢——下次出海，别挂本宫的名。'}}
   ]}
 ]},

{id:'s54',name:'纠察司·罚单代缴案',god:'wang_lingguan',chapter:4,side:'s54',danger:4,money:130,merit:28,
 scroll:'天庭纠察司的罚单，如今可以找人代缴：出银子，自有「替身」去雷台上站着。三个月里，挨雷的全不是该挨的那个。',
 reward:{items:['wl_bian','wl_jia']},
 nodes:[
  {type:'event',text:'王灵官额上第三只眼一直睁着，眼白泛红：本官这双眼，看的是谁犯了错。如今看的是谁出了钱。他把一沓罚单拍在案上：单子上的名字没错，站着挨雷的人错了。本官抽了三十年，头一回抽错人。',
   choices:[
    {t:'查代缴的门路：谁在牵线，替身从哪来',r:{flags:{flag_know_truth:1},log:'代缴的中间人是个还俗的道士，专找走投无路的游魂：替人挨一道雷，换三年阳寿。罚单底下的编号是连号的——同一批印，同一批卖。王灵官把单子捏出了褶：连号，就是说他们在批量卖雷。'}},
    {t:'先去雷台，看那些替身如今怎样了',r:{favor:{wang_lingguan:6},flags:{flag_mercy_cut:1},log:'雷台边的石头上坐着三个游魂，魂体焦黑，见人来只摆手：别看了，我们是自愿的。王灵官站在台下，额头那只眼慢慢闭上：自愿两个字，最会替人挡罪。'}},
    {t:'劝他：一个愿打一个愿挨，纠察何必管',r:{erode:3,log:'王灵官把金鞭往地上一顿，火星溅起三尺：本官不管谁愿挨，本官管谁该挨。该挨的躲了，不该挨的顶了，这叫乱了套。'}}
   ]},
  {type:'quiz',who:'王灵官',text:'纠察司的旧吏抱来一本《灵官职司考》，翻到第一页：大人，先考您自己一句——',
   qs:[
    {q:'王灵官在天庭的职司，最准确的说法是？',opts:['纠察众神过失的护法御史','掌管人间财库','专司行云布雨'],a:0,why:'道教尊其为「都天纠察大灵官」，职在纠察天上人间过失，故塑像额生三目、手持金鞭。'},
    {q:'王灵官塑像最显眼的特征是哪一处？',opts:['额头上的第三只眼','背后的双翼','脚下的莲台'],a:0,why:'三目象征纠察善恶、明察秋毫；金鞭与风火轮则象征执法迅疾。'}
   ],
   pass:{enemyVuln:true,merit:7,favor:{wang_lingguan:5},log:'旧吏合上书，躬身退下。王灵官哼了一声：考本官，倒比考别人难。'}},
  {type:'battle',enemy:'chizhengxuhao',name:'代罚·持证虚耗',scale:1.1},
  {type:'event',text:'持证虚耗散成一地烧焦的凭据，凭据背面印着「代缴已讫」四个字，油墨还是新的。',
   choices:[
    {t:'依律办：代缴尽废，罚单重审，替身销籍',r:{favor:{wang_lingguan:15},merit:10,flags:{flag_refuse_count:1},log:'王灵官把金鞭与火轮甲交给你：鞭上的火，专烧「有人替我」这四个字；甲下的轮，是站岗站出来的。重审那日，雷台上站着的人一个个换回该站的位置，他抽了三十鞭，一鞭没抽错。'}},
    {t:'废代缴不追旧账，给替身三年安身',r:{favor:{wang_lingguan:10},flags:{flag_mercy_cut:1},log:'王灵官把鞭子收回来，火苗一寸寸熄了：本官不追，是可怜他们；可这三年，得他们自己挣。鞭与甲你拿着——记住，先查自己。'}},
    {t:'收下代缴的抽成，把替身改成「自愿协办」',r:{money:160,erode:8,flags:{flag_ruthless:1},favor:{wang_lingguan:-16},log:'王灵官额上那只眼睁开又闭上，第三次闭上时，眼皮上渗出血来：本官这只眼，看不下去了。他转身走进纠察司，门从里头插上了。'}}
   ]}
 ]},

{id:'s55',name:'南天门·善根KPI案',god:'zeng_zhang',chapter:4,side:'s55',danger:4,money:135,merit:29,
 scroll:'南天门的护法按「善根增长指标」放行：本季善根涨得多，就多放几个。可指标是可以用钱填的。',
 reward:{items:['zz_jian','zz_kai']},
 nodes:[
  {type:'event',text:'增长天王把青云剑横在膝上，剑锋擦着门框：本天王守南天门，看的是来人的善根。如今看的是「本季指标完成了几成」。他抬眼看你：指标是谁定的？定了以后，谁在填？填的人，又是拿什么填的？',
   choices:[
    {t:'查指标是谁定、谁在填、拿什么填',r:{flags:{flag_know_truth:1},log:'指标册上写着「善根增长，季增三成」。底下的填报栏里，同一笔迹一天填了四百条，条目内容一模一样：「施粥一碗」。增长天王看了半晌：一碗粥，怎么一天施四百回？'}},
    {t:'先去南天门下，看被卡住的是些什么人',r:{favor:{zeng_zhang:6},flags:{flag_mercy_cut:1},log:'天门外的队伍排了三里，排在最后的都是些没名没姓的：给邻居挑过水的、把最后半块饼分出去的。他们没有「可填报」的善事。增长天王站在门楼上看了很久：本天王守的是门，不是账。'}},
    {t:'劝他：指标也是为了激励善行，别太较真',r:{erode:3,log:'增长天王把剑锋一转，风把案上的指标册吹得哗哗响：激励？本天王只看见有人拿它换过门的条子。善根要是能填，就不是善根了。'}}
   ]},
  {type:'game',game:'pairs',difficulty:2,
   text:'增长天王把填报册摊开：真善事有来处、有去处，假善事只有日期和数量。两两配对，把凑数的挑出来。',
   pass:{enemyVuln:true,merit:7,favor:{zeng_zhang:5},log:'配到最后，凑数的条目摞了厚厚一沓，全是同一天、同一句、同一个数目。增长天王用剑尖一挑，纸页散了一地，风一吹就没了。'}},
  {type:'battle',enemy:'kongmaogongcao',name:'凑数·空帽功曹',scale:1.1},
  {type:'event',text:'空帽功曹的帽子落地，帽里空空的，只有一本填满的指标册，最后一页写着「下季目标：翻倍」。',
   choices:[
    {t:'依律办：指标作废，改核来处去处，凑数者销籍',r:{favor:{zeng_zhang:15},merit:10,flags:{flag_refuse_count:1},log:'增长天王把青云剑与明光铠递给你：剑无鞘，是因为风一停，人心就死了；铠上的划痕，都是替人挡的。新规贴出来那日，天门下的长队动了，动得很慢，却没有人再被拦下。'}},
    {t:'废指标不销籍，让填报者去天门下站一季',r:{favor:{zeng_zhang:10},flags:{flag_mercy_cut:1},log:'增长天王笑了一下：站一季，比销籍管用。剑与铠你带着。他补了一句：让他们自己看看，那些没法填报的人，是怎么过日子的。'}},
    {t:'收下「指标代办」的孝敬，把册子照原样往上递',r:{money:165,erode:8,flags:{flag_ruthless:1},favor:{zeng_zhang:-16},log:'增长天王把剑收回鞘里——三百年没收过鞘，这一回收了。风停了。他背对着你：这扇门，本天王守到今天，头一回觉得它太宽了。'}}
   ]}
 ]},

{id:'s56',name:'北俱芦洲·福德税案',god:'duo_wen',chapter:4,side:'s56',danger:4,money:140,merit:30,
 scroll:'北俱芦洲的福德，本是天王赐下的，如今被人抽了三成「福德税」——交不上税的，连吐宝鼠都不认他。',
 reward:{items:['dw_san','dw_jia']},
 nodes:[
  {type:'event',text:'多闻天王的混元珠伞缓缓转着，伞面上浮着无数细小的光点：这些是北洲的福德，一家一点。他指着一处发暗的光：这家抽了三成，快灭了。又指另一处：这家抽了七成，已经灭了。伞停住：本天王赐福，从来没收过回扣。',
   choices:[
    {t:'查福德税是谁在收、凭的什么名目',r:{flags:{flag_know_truth:1},log:'收税的名目是「护北军需」，凭的是一纸盖了毗沙门印的文书。多闻天王把文书接到手里，对着光看了很久：这印是旧的，本天王二十年前就换了新印。有人拿旧印，收新钱。'}},
    {t:'先去北洲边塞，看断税的人家怎样',r:{favor:{duo_wen:6},flags:{flag_mercy_cut:1},log:'边塞的土屋里，一个妇人把最后一把粟米倒进锅里，说福德税交不上，去年冬天没有炭。她的孩子把一颗乳牙放在窗台上，说等爹回来换钱。多闻天王站在门外，从甲里摸出一只小布袋，里面的乳牙叮当作响。'}},
    {t:'劝他：收税也是为了护北，情有可原',r:{erode:3,log:'多闻天王把伞往下一压，光点暗了一片：护北是本天王的差事，不是向百姓收钱的理由。拿军需当名目，最先饿死的就是军需护着的人。'}}
   ]},
  {type:'game',game:'pairs',difficulty:2,
   text:'多闻天王把福德簿摊开：真福德有来处，税目有明账；假的有进无出。两两配对，把抽过头的挑出来。',
   pass:{enemyVuln:true,merit:7,favor:{duo_wen:5},log:'挑到最后，七户的税目对不上，收走的福德不知去向。多闻天王把吐宝鼠放上桌：它闻得出银子在谁手里。小鼠一溜烟跑了，跑向的正是北洲的军需库。'}},
  {type:'battle',enemy:'zhengshuichaiding',name:'抽成·征税差丁',scale:1.1},
  {type:'event',text:'征税差丁的税袋破了，洒出来的不是福德，是一把把生锈的铜钱，钱上铸着「护北」二字。',
   choices:[
    {t:'依律办：福德税尽废，已收退还，旧印销缴',r:{favor:{duo_wen:15},merit:10,flags:{flag_refuse_count:1},log:'多闻天王把混元珠伞与毗沙门甲交给你：伞一旋，风是风、雨是雨、账是账；甲里那只布袋，装的是边塞孩子的乳牙——本天王护北，护的是这些。退福那天，北洲的光点一颗颗亮回来，亮得很慢，像雪化。'}},
    {t:'废税不追缴，让军需另开明账',r:{favor:{duo_wen:10},flags:{flag_mercy_cut:1},log:'多闻天王点头：钱已经花了，追不回来；账得重新记。伞与甲你拿着。他添了一句：明账，是给活人看的，也是给死人看的。'}},
    {t:'收下军需库的分成，把福德税改成「乐输」',r:{money:170,erode:8,flags:{flag_ruthless:1},favor:{duo_wen:-16},log:'多闻天王把伞收拢，北洲一下子暗了：乐输？逼到没炭过冬，还叫乐。他把吐宝鼠放回怀里，转身走进暗处：本天王这伞，往后只遮雨，不遮账。'}}
   ]}
 ]},

{id:'s57',name:'一殿·排号插队案',god:'qin_guang',chapter:4,side:'s57',danger:4,money:140,merit:30,
 scroll:'一殿的孽镜台前排着长队，如今有人倒卖号牌：加钱，可以从后门先进镜。先进镜的，往往先「过关」。',
 reward:{items:['qg_bi','qg_pao']},
 nodes:[
  {type:'event',text:'秦广王把号牌在指间转了一圈：本殿的规矩，是先来后到。如今是先钱后到。他指了指镜台后头那扇小门：加钱进去的，孽镜照出来的都是「善」。他把号牌搁下：孽镜不会说谎，会说谎的是让它先照谁。',
   choices:[
    {t:'查号牌怎么流出去、后门谁在看',r:{flags:{flag_know_truth:1},log:'号牌是同一批竹签，签尾刻着极小的一个「叁」字——三号柜的。三号柜的柜吏今年刚补上，是他舅舅举荐的。秦广王把竹签折断：本殿的号，是从柜上流出去的，不是从门上。'}},
    {t:'先去队尾，看排了几天的都是些什么魂',r:{favor:{qin_guang:6},flags:{flag_mercy_cut:1},log:'队尾有个老妇，排了十一天，怀里抱着一只空碗。她说想先进镜，好早些知道自己这辈子错在哪。秦广王蹲下来看了看那只碗，起身时脸上的客套一点不剩：本官这就去把号牌的事办了。'}},
    {t:'劝他：插队而已，镜台总会照到',r:{erode:3,log:'秦广王把笔往案上一搁：照到是照到，可早照晚照，中间隔着十一天。十一天里，有人冻着、饿着、怕着。本官这声「莫急」，说得太顺口了。'}}
   ]},
  {type:'game',game:'lights',difficulty:2,
   text:'一殿的回廊上挂着一排号灯，灯亮着表示号还在队里，灭了表示被人领走。秦广王把灯芯递给你：把从后门走掉的号，一盏盏点回来。',
   pass:{enemyVuln:true,merit:7,favor:{qin_guang:5},log:'灯点回来四十七盏，每一盏底下都刻着号数。秦广王把号数抄下：四十七个号，四十七笔钱。他抄到最后一个，笔尖顿了顿：这个号，是本官的外甥。'}},
  {type:'battle',enemy:'lipeiqichai',name:'倒号·立牌契差',scale:1.1},
  {type:'event',text:'立牌契差散成一堆竹签，签上号数从「壹」排到「肆柒」，中间缺了两个号——那是留给他自己的。',
   choices:[
    {t:'依律办：倒号尽废，柜吏革职，亲眷同罪',r:{favor:{qin_guang:15},merit:10,flags:{flag_refuse_count:1},log:'秦广王把销牒朱笔与一殿皂袍交给你：笔杆磨亮了，是三十年排号排出来的；袍袖沾着墨，也沾着别人的眼泪。革职那日，他把外甥的号牌亲手投进炉里，投完才说了一句：本官对不住排队的。'}},
    {t:'只革柜吏，亲属从轻，补一个公平号队',r:{favor:{qin_guang:10},flags:{flag_mercy_cut:1},log:'秦广王沉吟半晌：从轻，是本官的私心；补队，是本官的差事。笔与袍你拿着。他添了一句：从今往后，号牌用木，不用竹——木头上刻不出小字。'}},
    {t:'收下倒号的抽成，把后门改成「加急通道」',r:{money:175,erode:8,flags:{flag_ruthless:1},favor:{qin_guang:-16},log:'秦广王把笔搁下，笔尖在案上洇出一小团红：加急通道——本官在前台站了三百年，头一回听见有人把后门说得这么体面。他抬手一指：你从后门进，本官当没看见；可孽镜看着。'}}
   ]}
 ]},

{id:'s58',name:'五殿·冤单外包案',god:'yan_luo',chapter:4,side:'s58',danger:4,money:145,merit:31,
 scroll:'五殿的喊冤状子，如今有人代写：一份三百文，包「上达天听」。可代写的状子，写的不是冤，是套路。',
 reward:{items:['yl_mu','yl_pao']},
 nodes:[
  {type:'event',text:'阎罗王把一摞状子翻开，每一份开头都是同一句：「小魂冤深似海」。他翻到第十份，停住了：这十个人的冤，是真的；可这十份状子，是一只手写的。他抬眼看你：本王审的是冤，不是文章。如今倒好，文章写得好的，冤先审。',
   choices:[
    {t:'查代写的是谁、状子递到哪一层',r:{flags:{flag_know_truth:1},log:'代写的铺子开在鬼市东头，招牌写「代书冤状，上达天听」。铺里的纸是同一批，墨是同一批，连按手印的位置都用炭粉画好了。阎罗王把状子翻过来，背面有一行小字：加五两，可指定审官。'}},
    {t:'先去喊冤的鬼中间，听他们自己怎么说',r:{favor:{yan_luo:6},flags:{flag_mercy_cut:1},log:'一个老鬼说了半个时辰，说得颠三倒四，可句句都是自己的话。他说完，抹了抹脸：我自己写的没人看，代写的倒审得快。阎罗王在本子上记了很久，记完把笔一放：这才是状子。'}},
    {t:'劝他：有人代写也省事，何必自找麻烦',r:{erode:3,log:'阎罗王冷笑一声：省事？本王这殿上，最怕的就是省事。省的是审官的事，多的是冤枉的人。他一拍惊堂木：本王自己那桩冤，就是被「省事」省掉的。'}}
   ]},
  {type:'quiz',who:'阎罗王',text:'堂下的书吏捧着旧典，声音发虚：王爷，这状子审之前，先问您一句——',
   qs:[
    {q:'「阎罗」二字来自梵语，本来的意思是？',opts:['平等','审判','黑夜'],a:0,why:'阎罗（Yama）意译「平等」，谓治狱公平、不徇私情，故又称平等王。'},
    {q:'民间最常把哪位清官附会成阎罗王？',opts:['包拯','海瑞','狄仁杰'],a:0,why:'民间有「包公日断阳、夜断阴」之说，故常以包拯附会阎罗。'}
   ],
   pass:{enemyVuln:true,merit:7,favor:{yan_luo:5},log:'书吏退下。阎罗王哼了一声：平等二字，本王审了三百年，还没审明白。'}},
  {type:'battle',enemy:'bianzhishou',name:'代书·编纸手',scale:1.1},
  {type:'event',text:'编纸手散成一地状纸，最底下那份没有套路，只有歪歪扭扭六个字：我想回家看看。',
   choices:[
    {t:'依律办：代书铺查封，状子退回自写，冤者重审',r:{favor:{yan_luo:15},merit:10,flags:{flag_refuse_count:1},log:'阎罗王把惊堂木与五殿玄袍递给你：这一拍，堂下就静了；可本王自己那桩冤，得靠别人来拍。袍角那块焦，是替他挡过的火。重审那日，堂上没了成套的辞藻，只有一句句结结巴巴的话，他一份一份听完，听到了后半夜。'}},
    {t:'查封铺子，收下的状子仍照审，只是不再指定审官',r:{favor:{yan_luo:10},flags:{flag_mercy_cut:1},log:'阎罗王点头：状子是假的，冤是真的。惊堂木与玄袍你拿着。他把「指定审官」那行字用朱笔涂了：这四个字一涂，铺子就没什么可卖的了。'}},
    {t:'收下代书铺的孝敬，把「指定审官」改成「优先审」',r:{money:180,erode:8,flags:{flag_ruthless:1},favor:{yan_luo:-16},log:'阎罗王把惊堂木往案上一拍，拍完自己也愣住了：这声音，跟三百年前本王被押上堂时听见的一模一样。他慢慢坐下：你走吧。本王的号，还在你手里排着呢。'}}
   ]}
 ]},

{id:'s59',name:'轮回门·投胎加急案',god:'zhuan_lun',chapter:4,side:'s59',danger:4,money:145,merit:31,
 scroll:'轮回门前排着十万游魂，如今有人卖「加急」：加钱可插队，再加钱可挑胎。挑剩下的，才轮到你。',
 reward:{items:['zl_lun','zl_pao']},
 nodes:[
  {type:'event',text:'转轮王坐在轮回盘旁，盘上的光一格一格转着：本殿的规矩，是排到谁就是谁。他指了指针盘边缘一处乱掉的光：如今有人替本殿排——排在前头的，都是出过钱的。他叹了口气：本殿送了三千年魂，头一回觉得自己像个看门的。',
   choices:[
    {t:'查加急的摊位、挑胎的价目、谁在抽成',r:{flags:{flag_know_truth:1},log:'加急摊摆在轮回门外的桥头，价目写在木牌上：插队五十两，挑富贵胎三百两，挑男胎一百两。转轮王听完，手指在膝上敲了敲：挑胎？胎是六道轮出来的，不是柜上挑出来的。他们把本殿的盘子，当成了柜子。'}},
    {t:'先去队里，看排得最久的魂怎样',r:{favor:{zhuan_lun:6},flags:{flag_mercy_cut:1},log:'一个游魂排了四十年，魂体都淡了。他说他不敢投，投了就忘了，忘了就找不着媳妇了。转轮王蹲下来，把轮回盘的一格光照在他手上：记不住，也能过得好。这话他说得很轻，像送人出远门。'}},
    {t:'劝他：加急也是给人方便，何必堵死',r:{erode:3,log:'转轮王摇摇头：方便是有余力的人的事。排在后头的，连饭都没有，哪来的钱买方便？本殿这道门，谁都能过；现在倒成了谁都能买。'}}
   ]},
  {type:'game',game:'spot',difficulty:2,
   text:'转轮王把六道的往生凭证并排铺开：真凭证的印是轮纹，假的印是刻死的直线。找出那几张不对的。',
   pass:{enemyVuln:true,merit:7,favor:{zhuan_lun:5},log:'光一照，五张凭证的印纹是直的，像用尺子划的。转轮王把假凭证一张张撕了：盘子上转出来的印，边是毛的。他们连毛边都懒得仿。'}},
  {type:'battle',enemy:'daibanpuzhanggui',name:'加急·代办铺掌柜',scale:1.1},
  {type:'event',text:'代办铺的柜台塌了，柜下压着一本账：插队多少、挑胎多少、退单多少。最后一页写着「本年净利」。',
   choices:[
    {t:'依律办：加急全废，已收退还，挑胎者重入六道',r:{favor:{zhuan_lun:15},merit:10,flags:{flag_refuse_count:1},log:'转轮王把转轮盘与十殿素袍交给你：盘转一格，就有一个魂忘掉来路；这袍素得像送站老人穿的，袖口磨起了毛。退钱那日，桥头的队伍散了一半——那些人本来就不该在队里。'}},
    {t:'废挑胎留插队，只准老弱病残用「加急」',r:{favor:{zhuan_lun:10},flags:{flag_mercy_cut:1},log:'转轮王想了想：加急本身不是坏事，坏在拿它卖钱。盘与袍你拿着。他提笔在木牌上加了一行：老弱病残，免费。'}},
    {t:'收下代办铺的干股，把「挑胎」改成「择善而投」',r:{money:185,erode:8,flags:{flag_ruthless:1},favor:{zhuan_lun:-16},log:'转轮王把轮回盘往下一按，盘停了。他低头看着停住的那一格：本殿转了三千年，头一回停。停了也好——本殿正好看看，这些年的魂，都投到哪儿去了。'}}
   ]}
 ]},

{id:'s60',name:'东海·雨票倒卖案',god:'ao_guang',chapter:4,side:'s60',danger:4,money:150,merit:31,
 scroll:'东海的雨，要请旨才下。如今有人卖「雨票」：买了票的地方下雨，没买的，旱着。',
 reward:{items:['ag_jian','ag_pao']},
 nodes:[
  {type:'event',text:'敖广把雨簿翻得哗响：本王的雨，一场一场请旨下来的。他指着簿上一处：这一场，旨上写的是「润三县」，可雨只落了半个县。他抬眼看你：另两个半县，有人替本王「调度」了。雨票，你听过没有？',
   choices:[
    {t:'查雨票是谁印的、怎么调度',r:{flags:{flag_know_truth:1},log:'雨票是黄纸印的，票面写着「东海行雨，凭票即落」。敖广把票对着光看，忽然笑了：这纸是本王府里包贡品的。他笑意一收：他们连纸都懒得换。'}},
    {t:'先去旱着的县，看地里什么样',r:{favor:{ao_guang:6},flags:{flag_mercy_cut:1},log:'田地裂成一块块，井底能看见底。老农蹲在田埂上，把一捧干土从指缝里漏下去，说：听说有雨票，一张够我们村吃半年。敖广站在田边，龙袍下摆沾了土，他没拍。'}},
    {t:'劝他：雨落哪儿都是落，何必计较',r:{erode:3,log:'敖广把雨簿一合：雨落哪儿都是落，可旨上写的是三县。本王朝廷里混了三千年，最不敢改的就是旨上的字。一改，就有人说：反正龙王也不会计较。'}}
   ]},
  {type:'game',game:'memory',difficulty:2,
   text:'敖广把旨意与雨簿摊开：旨上写几个县，簿上就该落几处。记住旨上的县名，再在簿上挑出来。',
   pass:{enemyVuln:true,merit:7,favor:{ao_guang:5},log:'簿上对不上三处。敖广用笔圈了圈：这三处，旨上都有；这三处的雨，都没落。他圈完把笔一扔：本王这龙椅，坐得越来越像账房了。'}},
  {type:'battle',enemy:'jiaowang',name:'倒票·私雨蛟王',scale:1.15},
  {type:'event',text:'私雨蛟王沉进海沟，海面浮起一叠雨票，票角都盖着东海的印——印是假的，可假得连敖广自己都多看了一眼。',
   choices:[
    {t:'依律办：雨票尽毁，私雨者锁海眼，旱县补雨',r:{favor:{ao_guang:15},merit:10,flags:{flag_refuse_count:1},log:'敖广把龙渊剑与龙王衮服交给你：剑沉在东海三千年，出鞘时海水跟着上来；衮服上的每一片鳞，都记着一场没请旨的雨。补雨那日，他亲自请旨，旨上仍写三县，一个不少。雨落下来的时候，老农蹲在田埂上哭，他在云头上站着，没敢下去。'}},
    {t:'毁票锁人，旱县补雨改由本地自请',r:{favor:{ao_guang:10},flags:{flag_mercy_cut:1},log:'敖广点头：自己请的雨，落下来才踏实。剑与衮服你拿着。他添了一句：往后谁再说「反正龙王不会计较」，你替本王回一句——本王计较。'}},
    {t:'收下雨票的三成利，把私雨改成「特许行雨」',r:{money:190,erode:8,flags:{flag_ruthless:1},favor:{ao_guang:-16},log:'敖广把雨簿推到一边，慢慢靠回椅背：本王研究研究。这四个字他说了三千年，头一回说得这么冷。他闭上眼：你走吧，雨的事，本王不管了——反正，也能卖。'}}
   ]}
 ]},

{id:'s61',name:'嵩山·地脉租约案',god:'zhong_yue',chapter:4,side:'s61',danger:4,money:150,merit:32,
 scroll:'地脉被人租去开矿，租约一签百年，嵩山底下被掏空了三成。岳神收着租，却不知道山下塌了。',
 reward:{items:['zy_yin','zy_pao']},
 nodes:[
  {type:'event',text:'中岳大帝把玉印按在案上，印下压着一沓租约：本帝的规矩，地脉是借，不是卖。他把租约翻开：百年为期，一年一租。可你看这一条——「承租方可自行开凿」。他抬头：地是活的，凿穿了，是要塌的。',
   choices:[
    {t:'查承租的是谁、凿到哪一层、租银去哪了',r:{flags:{flag_know_truth:1},log:'承租方是一家「嵩岳矿务」，租银每年照付，一分不少。可矿道图比报上来的深了两层，最深处已经摸到地脉主支。中岳大帝的手按在地图上，指节发白：他们付的是租银，挖的是本帝的骨头。'}},
    {t:'先去山下村子，看塌了没有',r:{favor:{zhong_yue:6},flags:{flag_mercy_cut:1},log:'山脚下三个村子，两口井干了，一户人家的院墙裂了一道缝，缝里往外冒凉气。老人说夜里能听见地下有响动，像有人一直在走。中岳大帝蹲下去摸了摸那道缝，半晌才说：本帝听见了，是本帝一直没听。'}},
    {t:'劝他：租约白纸黑字，按约办事就行',r:{erode:3,log:'中岳大帝把玉印拿起来又放下：白纸黑字，写的是租地，不是租命。本帝守着这座山，守的不是银子，是山底下睡着的东西。'}}
   ]},
  {type:'game',game:'lights',difficulty:2,
   text:'中岳大帝把地脉图挂起来，图上每个光点是一口井：井水还有的亮着，干了的灭着。他把灯芯递给你：把该亮的位置记住。',
   pass:{enemyVuln:true,merit:7,favor:{zhong_yue:5},log:'图上有十九个光点灭了，全在矿道两侧。中岳大帝把灭掉的位置一个个标出来，连成一条线：这条线，就是他们凿穿的地方。'}},
  {type:'battle',enemy:'keshenkuilei',name:'凿脉·科神傀儡',scale:1.15},
  {type:'event',text:'科神傀儡散成一堆木榫，木榫上刻着尺度，每一根都比报上来的短一寸——短的那一寸，就是多挖的。',
   choices:[
    {t:'依律办：租约作废，矿道回填，塌村赔偿',r:{favor:{zhong_yue:15},merit:10,flags:{flag_refuse_count:1},log:'中岳大帝把中岳玉印与嵩岳法袍交给你：印压的是地脉，抬起来，山就喘一口气；袍上绣的不是云，是地底下的水脉。回填那日，他站在井口听了很久，听到水声一点点回来，才转身：本帝这山，还能再站三千年。'}},
    {t:'废开凿条款留租约，改由岳府监工',r:{favor:{zhong_yue:10},flags:{flag_mercy_cut:1},log:'中岳大帝把租约上的「自行开凿」划了，改成「岳府监工」：租可以租，凿不行。印与袍你拿着。他添了一句：监工的人，得下井看，不能只看图。'}},
    {t:'收下矿务的干股，把租约续成两百年',r:{money:195,erode:8,flags:{flag_ruthless:1},favor:{zhong_yue:-16},log:'中岳大帝把玉印收回袖里，山风忽然停了：两百年。他轻声重复了一遍，像在数什么。数完他说：本帝守这座山，守了三千年；两百年后，本帝再来看看，还剩下什么。'}}
   ]}
 ]},

{id:'s62',name:'北宫·荡魔外包案',god:'zhen_wu',chapter:4,side:'s62',danger:5,money:170,merit:34,
 scroll:'北宫荡魔的差事，如今分包给了外头的「镇魔行」：按头收费，收了钱才荡魔。不交钱的人家，魔就堵在门口，等着。',
 reward:{items:['zw_jian','zw_jia']},
 nodes:[
  {type:'event',text:'真武大帝披发跣足坐在北宫，龟蛇盘在脚边，一动不动。他指了指案上一沓契约：本帝荡魔，从不收钱。如今有人打着本帝的旗号收钱，收完还派人来问，本帝要不要抽三成。他抬起眼：本帝要的不是三成，是那些被「程序」放进门的魔。',
   choices:[
    {t:'查镇魔行的底细、荡魔名册、抽成流向',r:{flags:{flag_know_truth:1},log:'镇魔行的名册上，每一头魔都编了号，旁边写着「已受理」「待受理」「不受理」。真武大帝一页页翻过去，翻到「不受理」那一叠，停住了：这些魔，本帝荡过。它们本该在三年前就没了。'}},
    {t:'先去没交钱的人家，看门口堵着什么',r:{favor:{zhen_wu:6},flags:{flag_mercy_cut:1},log:'一户人家的门被一块黑石顶着，石上贴着「待缴费」的黄条。石缝里有东西在呼吸。真武大帝蹲下去，伸手按了按那块石，石裂了，里头是一头瘦得只剩骨架的小魔。他说：本帝荡魔，荡的是这个；不是这张条。'}},
    {t:'劝他：外包也是办事，何必较真',r:{erode:3,log:'真武大帝把契约合上：办事。他重复了一遍，声音没什么起伏：本帝办了三十年的事，头一回听说，事还能包出去。包出去的事，出了岔子，算谁的？'}}
   ]},
  {type:'quiz',who:'真武大帝',text:'龟蛇在他脚边动了动，他抬手示意：问吧，问完本帝还要去北边。',
   qs:[
    {q:'真武大帝脚下所踏的是哪两样？',opts:['龟与蛇','麒麟与凤','虎与豹'],a:0,why:'真武（玄武）为北方水神，形象为披发跣足、踏龟蛇，龟蛇即玄武之象。'},
    {q:'明代哪位皇帝特别尊奉真武大帝？',opts:['朱棣','赵匡胤','李世民'],a:0,why:'朱棣以「靖难」起兵，托言真武护佑，即位后大修武当山，真武信仰遂盛。'}
   ],
   pass:{enemyVuln:true,merit:7,favor:{zhen_wu:5},log:'真武大帝听完，只说了两个字：尚可。龟蛇却把头转向你，看了很久。'}},
  {type:'battle',enemy:'heguimoshou',name:'镇魔行·规鬼魔手',scale:1.15},
  {type:'event',text:'规鬼魔手散了，契约一页页飘下来，最底下压着一张没编号的收据：「已荡，未收费」。',
   choices:[
    {t:'依律办：镇魔行查封，名册重审，不收费者补荡',r:{favor:{zhen_wu:15},merit:10,flags:{flag_refuse_count:1},log:'真武大帝把七星剑与玄甲交给你：剑上的七个孔，是本帝自己凿的，凿一个，记一头没荡完的魔。甲你穿上——甲是黑的，黑得看不见伤。补荡那日，他没让任何人跟着，一个人在北边走了三天。'}},
    {t:'查封镇魔行，留下的「待受理」由北宫接手',r:{favor:{zhen_wu:10},flags:{flag_mercy_cut:1},log:'真武大帝点头：本该如此。剑与甲你拿着。他顿了顿，补了一句：本帝不抽成。这四个字他说得很慢，像怕人听漏。'}},
    {t:'收下镇魔行的三成，改名叫「荡魔代捐」',r:{money:210,erode:8,flags:{flag_ruthless:1},favor:{zhen_wu:-16},log:'真武大帝站起来，龟蛇跟着抬头。他没看你，只看着北边的天：本帝荡了三千年魔，头一回知道，魔还能分成。说完他往北走了，背影很直，一步没停。'}}
   ]}
 ]},

{id:'s63',name:'雷部·雷票超发案',god:'lei_zu',chapter:4,side:'s63',danger:5,money:172,merit:34,
 scroll:'雷部的雷票超发了三倍：一张票许一道雷，如今同一道雷，卖给了三个人。劈下来的时候，三个人一起抬头。',
 reward:{items:['lz_bian','lz_jia']},
 nodes:[
  {type:'event',text:'雷祖坐在雷城正中，双鞭横在膝上，鞭梢还冒着细烟。他把一沓雷票摊开：本尊这雷，一道是一道。他拈起三张票，票号不同，批的是同一个时辰、同一处地方：这三个人，都以为那道雷是自己的。他抬眼看你：雷只有一道。你说，该劈谁？',
   choices:[
    {t:'查雷票的号、超发的量、谁在盖章',r:{flags:{flag_know_truth:1},log:'雷票的号是连着的，连到第三千张就断了，断处有人用另一批号接上。雷祖把两批票并排一比，票纸的纹不一样：这批是雷部库里的，那批不是。他笑了一下，笑得很短：本尊的库，进人了。'}},
    {t:'先去被劈的人家，看他们信的是哪张票',r:{favor:{lei_zu:6},flags:{flag_mercy_cut:1},log:'三家都供着雷票，都说是花了大价钱求的。最穷那家把票压在枕头下，说劈下来的时候，他正跪着谢雷。雷祖站在那家的院子里，看了很久，才说：本尊的雷，从来不收钱。'}},
    {t:'劝他：多卖几张也无妨，反正雷够用',r:{erode:3,log:'雷祖双鞭往地上一顿，雷城晃了一下：够用？他指着城外：本尊劈的是该劈的地方、该劈的时辰。多卖一张，就有一处该劈的，没人管。'}}
   ]},
  {type:'quiz',who:'雷祖',text:'雷部的书吏捧着玉枢宝经上前，雷祖抬手止住他：不必念，问他。',
   qs:[
    {q:'雷祖的完整尊号是？',opts:['九天应元雷声普化天尊','九天玄女元君','北极玄天上帝'],a:0,why:'雷祖即九天应元雷声普化天尊，居九天应元府，统摄雷部诸神。'},
    {q:'《封神演义》中，雷部正神的主帅是？',opts:['闻仲','黄飞虎','杨戬'],a:0,why:'闻仲绝龙岭战死后封为「九天应元雷声普化天尊」，掌雷部。'}
   ],
   pass:{enemyVuln:true,merit:7,favor:{lei_zu:5},log:'雷祖听完，鞭梢的烟忽然直了：本尊这名号，如今满街的雷票上都印着。印得比本尊自己还熟。'}},
  {type:'battle',enemy:'gongdaotianchai',name:'押票·贡道天差',scale:1.15},
  {type:'event',text:'贡道天差的箱子里全是雷票，箱底压着一本账，账上写着「本年雷量：三万道」。雷部一年，只劈三百道。',
   choices:[
    {t:'依律办：超发雷票尽毁，私印者押雷城，误劈者补祭',r:{favor:{lei_zu:15},merit:10,flags:{flag_refuse_count:1},log:'雷祖把雌雄双鞭与金甲交给你：一雌一雄，落雷时两声——先响的那声是给人听的，后响的那声，才是劈的。金甲上的雷纹是烧出来的，你穿上它，天上看你就当自己人。补祭那日，他亲自劈了三道空雷，三道都落在荒地。他说：这三道，是替他们出的气。'}},
    {t:'毁票押人，把多出来的雷量改成「备雷」',r:{favor:{lei_zu:10},flags:{flag_mercy_cut:1},log:'雷祖点头：备雷是留给该劈、没劈到的。双鞭与甲你拿着。他提笔在雷簿上添了一行：备雷三百，不得挪作他用。添完把笔一扔：这句话，本尊隔三百年得添一回。'}},
    {t:'收下多卖的三成，把私雷记作「特许行雷」',r:{money:215,erode:8,flags:{flag_ruthless:1},favor:{lei_zu:-16},log:'雷祖把双鞭收进袖里，雷城的雷声一下子低了下去：特许。他说得不重，可每个字都像落在你脚边。行雷还有特许的？他站起来往城外走：本尊去看看，这天底下，还有哪一处，是本尊没劈到的。'}}
   ]}
 ]},

{id:'s64',name:'华山·矿脉私采案',god:'xi_yue',chapter:4,side:'s64',danger:5,money:170,merit:34,
 scroll:'华山的矿脉被人私采，采出来的金子，铸成了一尊西岳大帝像，又卖回给西岳庙。金子绕了一圈，回到山上，山却空了。',
 reward:{items:['xy_feng','xy_pao']},
 nodes:[
  {type:'event',text:'西岳大帝把一尊小金像摆在案上，像铸得很像他，眉眼都在，就是轻。他把像推到你面前：这像，是拿本帝山里的金子铸的；铸好了，卖回本帝的庙里，卖了三倍价。他手指按在像座上：金子绕了一圈，回到山上——可山，空了。',
   choices:[
    {t:'查矿从哪开、金子铸成什么、卖给了谁',r:{flags:{flag_know_truth:1},log:'矿口在半山腰，用松枝遮着。铸坊在山下，铸的不只是神像，还有香炉、金牌、护身符，样样都刻着「西岳」。西岳大帝拿起一枚金牌对着光看：本帝的印，是这么用的？他把金牌放下，金牌在案上磕出一声脆响。'}},
    {t:'先去矿口附近，看山塌了没有',r:{favor:{xi_yue:6},flags:{flag_mercy_cut:1},log:'矿口外的松树黄了半边，山溪断流。一个挑水的老人说，从前这水甜，如今涩。西岳大帝蹲在溪边，掬了一捧，尝了尝，把水泼回溪里：本帝守这山，守的是这口水。金子是死的。'}},
    {t:'劝他：山里的东西，挖出来才算数',r:{erode:3,log:'西岳大帝把小金像转了个面，背面刻着一行小字「捐造」。他读了一遍，笑了一声：挖出来才算数。他说：挖出来，本帝这山就只剩个数了。数完了，谁还记得山长什么样。'}}
   ]},
  {type:'quiz',who:'西岳大帝',text:'金殿外的松风一阵一阵。西岳大帝抬手，让侍立的山神退下。',
   qs:[
    {q:'五岳之中的「西岳」是？',opts:['华山','泰山','嵩山'],a:0,why:'东岳泰山、西岳华山、南岳衡山、北岳恒山、中岳嵩山。'},
    {q:'西岳在五行中属？',opts:['金','木','水'],a:0,why:'西方属金，故西岳大帝号「金天顺圣」，主五金矿藏之利。'}
   ],
   pass:{enemyVuln:true,merit:7,favor:{xi_yue:5},log:'西岳大帝听完，点点头：本帝这名号，如今刻在金牌上，一枚卖十两。他顿了顿：名号是这么用的么？'}},
  {type:'battle',enemy:'kuzhankuzu',name:'私矿·库栈库卒',scale:1.15},
  {type:'event',text:'库栈库卒倒下，库门开着，里面码着还没铸的金锭，每一锭上都印着「西岳」二字。',
   choices:[
    {t:'依律办：矿口全封，金锭归山，私刻印者论罪',r:{favor:{xi_yue:15},merit:10,flags:{flag_refuse_count:1},log:'西岳大帝把金锋剑与华岳金袍交给你：剑出华山金气，切石如纸；这袍是金的，金底下压着一座山的影子。封矿那日，他把刻印的模子砸了，砸完把碎块一块块捡起来，埋回矿口。他说：本帝的东西，还给本帝的山。'}},
    {t:'封矿，已采的金留作山神庙产，不再私铸',r:{favor:{xi_yue:10},flags:{flag_mercy_cut:1},log:'西岳大帝点头：金子挖出来了，扔回去也是块石头；拿它修山路、补石阶，倒还算它有条出路。剑与袍你拿着。他添了一句：可印，不能再刻。'}},
    {t:'收下私矿的干股，把「西岳」印租给铸坊',r:{money:215,erode:8,flags:{flag_ruthless:1},favor:{xi_yue:-16},log:'西岳大帝把金像拿起来，掂了掂，放回案上：租印。他说：本帝这方印，压的是山；租出去，压的就成了人。山风进来，把案上的金像吹倒了，没人去扶。'}}
   ]}
 ]},

{id:'s65',name:'天书·兵符租赁案',god:'xuan_nv',chapter:4,side:'s65',danger:5,money:168,merit:34,
 scroll:'兵符被人租了出去：一符一军，租的人拿它去打仗，打完把符还回来，符上还带着别人家的血。',
 reward:{items:['xn_juan','xn_yi']},
 nodes:[
  {type:'event',text:'九天玄女立在云台上，六壬天书摊在面前，书页无字，风一过才浮出几行。她合上书：本座授符，一符授一人，一生授一次。她抬眼看你：如今有人来租，租期三年，租金按军计。租来的兵，打的是别人的仗——死的是租来的人。',
   choices:[
    {t:'查符从哪流出、租给了谁、打的什么仗',r:{flags:{flag_know_truth:1},log:'流出的符有十七枚，都是从一处旧祠里「请」出来的。租符的人各有名目：有山寨，有盐帮，有替人出头的地方豪强。玄女一本本翻完，合上：本座授符，为的是天命将倾时有个破局的人；不是给有钱人，雇人替他去死。'}},
    {t:'先去替人打仗的兵家里，看剩下什么',r:{favor:{xuan_nv:6},flags:{flag_mercy_cut:1},log:'一户人家的门框上还贴着「凯旋」的红纸，纸底下是白纸。母亲说儿子回来过一次，坐了一夜，天没亮就走了。玄女站在门口，没有进去，只把天书翻到一页空白，站了很久。'}},
    {t:'劝她：符租出去也是用，何必问谁用',r:{erode:3,log:'玄女把天书合上，书页间漏出一线光：用？她说：本座这符，一用，就有人死。不问谁用，就是不问谁死。你这句话，本座记下了。'}}
   ]},
  {type:'quiz',who:'九天玄女',text:'云台下风停了一瞬。玄女把天书往前推了推，示意你先答。',
   qs:[
    {q:'传说中九天玄女授黄帝何物，助其破蚩尤？',opts:['兵符与兵法','不死药','九州鼎'],a:0,why:'《云笈七签》载玄女授黄帝六甲六壬兵信之符、灵宝五帝策等，助其战蚩尤。'},
    {q:'《水浒传》中，九天玄女授宋江三卷天书的地点是？',opts:['还道村玄女庙','梁山忠义堂','东京大相国寺'],a:0,why:'宋江避难还道村，梦入玄女庙，得玄女授三卷天书。'}
   ],
   pass:{enemyVuln:true,merit:7,favor:{xuan_nv:5},log:'玄女听完，书页上的字慢慢淡下去：本座授的书，从没有一本，是这么用的。'}},
  {type:'battle',enemy:'taoyiheichai',name:'租符·逃役黑差',scale:1.15},
  {type:'event',text:'逃役黑差散了，十七枚兵符落在云台上，每一枚都沾着血，血已经发黑。',
   choices:[
    {t:'依律办：符尽收回，租约作废，租符者各担其罪',r:{favor:{xuan_nv:15},merit:10,flags:{flag_refuse_count:1},log:'玄女把六壬天书与羽衣交给你：书页无字，翻开时字才浮上来——你心里想什么，它就写什么；羽衣是青的，风过时整件都在响。收符那日，她把十七枚符一一擦干净，擦完投进云海：符认的是人，不认钱。这句话她说了两遍。'}},
    {t:'收回兵符，已立的战功不追，只废租约',r:{favor:{xuan_nv:10},flags:{flag_mercy_cut:1},log:'玄女点头：仗打完了，人回不来；可符不能再租。书与羽衣你拿着。她把天书翻到最后一页，那页上只有一行字：授人，不授势。'}},
    {t:'收下租金的三成，把租符改成「代授」',r:{money:210,erode:8,flags:{flag_ruthless:1},favor:{xuan_nv:-16},log:'玄女把天书合上，云台上的光暗了一层：代授。她重复着这两个字，声音很平：本座授的是破局的人。代授，授的是谁？说完她转身，羽衣一响，人已经在云外了。'}}
   ]}
 ]},

{id:'s66',name:'九华·地狱KPI案',god:'di_zang',chapter:4,side:'s66',danger:5,money:168,merit:35,
 scroll:'地狱开始考核：每个狱卒每月须「度化」够数，度不够的扣香火。于是没人愿意度难度的魂——难度的，度不动，就不度了。',
 reward:{items:['dz_zhang','dz_yi']},
 nodes:[
  {type:'event',text:'地藏王菩萨坐在九华山下，锡杖横在膝上，谛听伏在脚边，耳朵贴着地。他把一张考核表递给你：这个月，十八层地狱的度化数，都够了。他指着表上最下面一行：只有这一层，数还是零。他抬眼看你：这一层的魂，最难。',
   choices:[
    {t:'查考核怎么定的、数字怎么报的、谁在核',r:{flags:{flag_know_truth:1},log:'考核表是三层衙门联签的，签得整整齐齐。可每一层的「度化」栏底下都有一行小字：「不含疑难」。地藏菩萨用指腹摩过那四个字：不含疑难。他说：本愿度的，就是疑难。'}},
    {t:'先下最底那一层，看那些魂什么样',r:{favor:{di_zang:6},flags:{flag_mercy_cut:1},log:'最底层的魂不说话，也不抬头。有个魂的手一直往上看，像在够什么。地藏菩萨蹲下来，把锡杖上的环轻轻一摇，那魂的手动了动。他说：不是度不动，是没人肯在这儿多站一会儿。'}},
    {t:'劝他：考核也是为督促，何必认真',r:{erode:3,log:'地藏菩萨把考核表折起来：督促。他说：督促的是数，还是人？他把表收进袖里：本愿说地狱未空誓不成佛——如今地狱没空，数先满了。'}}
   ]},
  {type:'quiz',who:'地藏王菩萨',text:'谛听抬起头，耳朵转了转。菩萨温声道：先答，答完再下去。',
   qs:[
    {q:'地藏菩萨的道场在？',opts:['九华山','五台山','普陀山'],a:0,why:'唐时新罗僧金乔觉居九华山修行，后世尊为地藏菩萨应化，九华山遂为地藏道场。'},
    {q:'「地狱未空」的下一句是？',opts:['誓不成佛','不为诸佛','不证菩提'],a:0,why:'地藏菩萨大愿：「地狱未空，誓不成佛；众生度尽，方证菩提。」'}
   ],
   pass:{enemyVuln:true,merit:7,favor:{di_zang:5},log:'菩萨听完，低头看了看谛听：你听，这山下的声音，数得清么？谛听没有动。'}},
  {type:'battle',enemy:'renzhengkeli',name:'核数·认证科吏',scale:1.15},
  {type:'event',text:'认证科吏的牌子散了一地，每块牌上都盖着「合格」，最底下那块，盖的是「免核」。',
   choices:[
    {t:'依律办：考核作废，疑难层重开，度化不计数',r:{favor:{di_zang:15},merit:11,flags:{flag_refuse_count:1},log:'地藏菩萨把九环锡杖与九华僧衣交给你：走一步，九环响一次；响一次，底下就少一个人。僧衣上二十七块补丁，每一块都替一个人挡过。重开那日，他没看数，只一层一层地走，走到最底，坐了下来。'}},
    {t:'废「不含疑难」一条，其余考核照旧',r:{favor:{di_zang:10},flags:{flag_mercy_cut:1},log:'菩萨点头：数可以有，疑难不能不算。杖与衣你拿着。他提笔在考核表上添了一行：疑难层，一魂顶百魂。添完把笔放下：这行字，本愿自己添。'}},
    {t:'收下核数衙门的孝敬，把「免核」改成「特批」',r:{money:210,erode:8,flags:{flag_ruthless:1},favor:{di_zang:-16},log:'地藏菩萨把锡杖立起来，九环一齐响了一声，又都静了：特批。他说：本愿度的是最难的那个。特批，批的是最容易的。他没再看你，只对谛听说：下去吧，底下还有人等着。'}}
   ]}
 ]},

{id:'s67',name:'山门·舍利押运案',god:'wei_tuo',chapter:4,side:'s67',danger:5,money:170,merit:34,
 scroll:'舍利押运的差事外包给了镖行：镖行押一半，另一半在半道上「丢」了。丢的那一半，过几日出现在别家的供桌上。',
 reward:{items:['wt_chu','wt_jia']},
 nodes:[
  {type:'event',text:'韦驮立在山门内，降魔杵拄地，杵底压着一份押运单。他把单子推给你：本将押舍利，从山门到塔院，三步一停，五步一望，从不假手于人。他指着单子上的「外包」二字：如今这差事，包给镖行了。丢了七颗。他抬眼看你：七颗舍利，七户人家的供桌。',
   choices:[
    {t:'查镖行的底、押运的路、丢失的时辰',r:{flags:{flag_know_truth:1},log:'镖行的押运图上有三处「歇脚」，都在荒僻处。韦驮把图折了一折，对上路：这三处，都不在官道上。他说：本将押了三百年，从没在半道上歇过脚。歇脚的地方，就是丢东西的地方。'}},
    {t:'先去得了舍利的人家，看他们怎么供',r:{favor:{wei_tuo:6},flags:{flag_mercy_cut:1},log:'七户人家都把舍利供在正堂，香火不断。有个老太太说，这是她攒了半辈子钱请的，请回来那夜，家里头一回没听见怪声。韦驮站在门槛外，看了很久，才说：她供的是真的信，不是假的利。'}},
    {t:'劝他：镖行押运也是押，何必亲力亲为',r:{erode:3,log:'韦驮把降魔杵往地上一顿，山门抖了一下：押运也是押。他盯着你：本将押的是舍利，丢一颗，就有一处香火断。你说这也是押？'}}
   ]},
  {type:'quiz',who:'韦驮',text:'山门外的风把经幡吹得直响。韦驮把杵立正，站得笔直：问吧。',
   qs:[
    {q:'韦驮像通常供奉在寺院的什么位置？',opts:['天王殿内，弥勒背后','大雄宝殿正中','藏经楼顶层'],a:0,why:'韦驮立于天王殿弥勒佛背后，面朝大雄宝殿，护持道场。'},
    {q:'韦驮所持的法器是？',opts:['降魔杵','金刚铃','如意'],a:0,why:'韦驮手持降魔杵（金刚杵），为护法之象征。'}
   ],
   pass:{enemyVuln:true,merit:7,favor:{wei_tuo:5},log:'韦驮听完，把杵换个手拄着：本将只奉法旨。他说：可法旨没说过，舍利可以外包。'}},
  {type:'battle',enemy:'zhouxuntiying',name:'押镖·昼巡替影',scale:1.15},
  {type:'event',text:'替影散了，镖行的押运箱开着，箱里垫着的黄绸还是热的，舍利却一颗不剩。',
   choices:[
    {t:'依律办：镖行查抄，七颗舍利追回，押运复归山门',r:{favor:{wei_tuo:15},merit:10,flags:{flag_refuse_count:1},log:'韦驮把降魔杵与护法明光甲交给你：杵重八十一斤，落地山门都要抖；甲擦得能照见人——他说护法的人，先得让人看清。追舍利那日，他一颗一颗从供桌上请回来，每一颗都先合十，再放进匣子。最后一颗请回来时，天已经亮了。'}},
    {t:'查抄镖行，已供出的舍利留于原处，只追未供的',r:{favor:{wei_tuo:10},flags:{flag_mercy_cut:1},log:'韦驮想了想：供着的人心是真的，硬夺回来，断的是那份信。杵与甲你拿着。他补了一句：可从今往后，押运得本将亲自走。'}},
    {t:'收下镖行的分成，把押运改成「特许代押」',r:{money:212,erode:8,flags:{flag_ruthless:1},favor:{wei_tuo:-16},log:'韦驮把杵横过来，挡在山门口：代押。他说：本将这门，只进不出。他让开路，声音很平：你要出去，本将不拦；可这山门里的东西，往后你别碰。'}}
   ]}
 ]},

{id:'s68',name:'罗酆·六天宫租约案',god:'feng_du',chapter:4,side:'s68',danger:5,money:180,merit:36,
 scroll:'罗酆山的六天宫，被人拿去签了租约：租给外头的「幽冥置业」，六宫改作仓房，鬼魂按间收租。',
 reward:{items:['fd_ling','fd_pao']},
 nodes:[
  {type:'event',text:'酆都大帝坐在罗酆山下，六天宫空了五宫，只有他这一宫还点着灯。他把一份租约推到案边：本帝统北阴六天宫，三千年一替。他指着租约上的「承租方」一栏：如今这六宫，租出去了。他抬眼看你：租的人不是鬼，是衙门。鬼按间收租。',
   choices:[
    {t:'查租约怎么签的、六宫改成什么、租金进了谁的账',r:{flags:{flag_know_truth:1},log:'六宫的仓门上钉着铜牌，牌上写「一号仓」「二号仓」，编号一直排到第九百间。仓里堆的不是货，是魂。酆都大帝站在一号仓门口，看了很久：本帝这六宫，住的是不该再出来的东西；如今它们住的地方，租给了会算账的。'}},
    {t:'先去按间收租的魂里，问一句',r:{favor:{feng_du:6},flags:{flag_mercy_cut:1},log:'一个魂掏出一张收据，说他住第七百三十一间，每月交三文，交不起就挪到更小的间。酆都大帝把收据捏在手里，捏得纸都透了：本帝管的是鬼，不管房。他说：如今鬼都成房客了。'}},
    {t:'劝他：租出去也是用，总比空着强',r:{erode:3,log:'酆都大帝抬眼：空着。他重复了一遍，声音很低：本帝这六宫空了三千年，是因为里头的东西不该满。他指了指租约：满了，就有人来收租了。'}}
   ]},
  {type:'quiz',who:'酆都大帝',text:'六天宫的灯忽明忽暗。酆都大帝抬手，让殿下的鬼差退到门外。',
   qs:[
    {q:'酆都大帝所治的幽冥山是？',opts:['罗酆山','九华山','昆仑山'],a:0,why:'《真诰》载罗酆山为北阴之府，酆都大帝治于此，统六天宫鬼神。'},
    {q:'酆都大帝所统的六宫，称为？',opts:['北阴六天宫','瑶池六宫','玄都六院'],a:0,why:'北阴六天宫为酆都治所，分宫治鬼，宫各有主。'}
   ],
   pass:{enemyVuln:true,merit:8,favor:{feng_du:5},log:'酆都大帝听完，把租约折起来：本帝这六宫，三千年一替；如今有人想一签三千年。'}},
  {type:'battle',enemy:'guishexuanjiajiang',name:'置业·鬼蛇玄甲将',scale:1.2},
  {type:'event',text:'鬼蛇玄甲将倒下，六宫的仓门一扇扇开着，九百间仓里，魂都站着，没有一间有床。',
   choices:[
    {t:'依律办：租约作废，六宫复归，收租者押酆都',r:{favor:{feng_du:18},merit:12,flags:{flag_refuse_count:1},log:'酆都大帝把罗酆令与北阴玄袍交给你：令出罗酆，鬼低头——低的是令，不是人。玄袍你穿上，这是本帝三千年的黑，穿久了，人就不怕黑了。复归那日，他亲自一间间开了仓门，开到第九百间，停下来：本帝这宫，本就是空着的。空着，才对。'}},
    {t:'废租约，六宫不再改仓，已收的租退还',r:{favor:{feng_du:12},flags:{flag_mercy_cut:1},log:'酆都大帝点头：租退回去，魂就不欠了。令与袍你拿着。他把租约烧了，灰落在案上，他用手指抹开：本帝管鬼三千年，头一回管到房钱。'}},
    {t:'续租约，把收租改成「六宫物业」归自己管',r:{money:235,erode:9,flags:{flag_ruthless:1},favor:{feng_du:-20},log:'酆都大帝把灯盏吹灭了。殿里一下子黑透，只有他的声音：物业。他说得很慢：本帝这六宫，是给不该出来的东西留着的；不是给会算账的留着的。灯再亮起来时，殿上已经没有人了。'}}
   ]}
 ]},

{id:'s69',name:'泰山·生死簿影印案',god:'dong_yue',chapter:4,side:'s69',danger:5,money:182,merit:36,
 scroll:'生死簿被人影印了：影印本流到人间，命可以买，寿可以改——改的，还不是自己的命。',
 reward:{items:['dy_fu','dy_pao']},
 nodes:[
  {type:'event',text:'东岳大帝坐在泰山之巅，生死簿摊在膝上，纸页被山风吹得直响。他把一册薄薄的本子递给你：这是影印的。他翻到其中一页：上头的人还活着，可这页写着「已改」，改的日期，比他的死期早三年。他抬眼看你：朕的名，是这么用的？',
   choices:[
    {t:'查影印从哪出、谁改的页、改的是谁的寿',r:{flags:{flag_know_truth:1},log:'影印本的纸边有暗纹，暗纹连着第几页，页就归哪一司管。改过的页有六十三页，六十三页分属三司——三司的印都是真的，笔不是。东岳大帝把册子合上：印是朕的，笔不是。'}},
    {t:'先去被改了命的人家，看他们知不知道',r:{favor:{dong_yue:6},flags:{flag_mercy_cut:1},log:'一户人家正办喜事，新郎的寿被添了二十年，他自己不知道。东岳大帝站在院外，没有进去：他活得好。他说：朕改了，他这二十年就是借的；借的，总要还。'}},
    {t:'劝他：多二十年也好，何必追究',r:{erode:3,log:'东岳大帝把生死簿合上，山风停了一瞬：多二十年。他说：朕掌的是生死贵贱——多二十年，是谁的二十年？他把册子放回膝上：簿上少一页，人间就多一个人哭着问，为什么是他。'}}
   ]},
  {type:'quiz',who:'东岳大帝',text:'泰山顶上的云压得很低。东岳大帝把玉符放在膝头，示意你答。',
   qs:[
    {q:'东岳大帝在民间信仰中主掌？',opts:['人之生死贵贱','五谷丰歉','海上风浪'],a:0,why:'《风俗通义》载泰山为「天帝之孙」，主召人魂魄，知人生命之长短。'},
    {q:'「五岳之首」是？',opts:['东岳泰山','西岳华山','中岳嵩山'],a:0,why:'泰山为五岳之首，历代帝王封禅于此，东岳大帝居之。'}
   ],
   pass:{enemyVuln:true,merit:8,favor:{dong_yue:5},log:'东岳大帝听完，把玉符翻了个面：朕这名，写在簿上是生死，写在符上是信。'}},
  {type:'battle',enemy:'chidietaohun',name:'改簿·持牒套魂',scale:1.2},
  {type:'event',text:'持牒套魂倒下，六十三册影印本摞在案上，最上面那本沾着朱砂，朱砂还是湿的。',
   choices:[
    {t:'依律办：影印本尽毁，改页回正，私印者交有司',r:{favor:{dong_yue:18},merit:12,flags:{flag_refuse_count:1},log:'东岳大帝把天齐玉符与泰山衮服交给你：符上刻「天齐」，落笔那一划压着泰山；衮服十二纹，最后一道是山，绣得比龙沉。回正那日，他一页页翻，翻到改过的六十三页，逐页抹去朱砂，抹完把笔洗了：朕这笔，只写该写的。'}},
    {t:'毁影印本，改过的寿不追，只正薄上之误',r:{favor:{dong_yue:12},flags:{flag_mercy_cut:1},log:'东岳大帝想了想：借的寿，追回来，人就没了；可这笔不能再动。符与衮服你拿着。他把影印本投进香炉：假的烧了，真的才像真的。'}},
    {t:'留下影印本，把改寿做成「续命捐」',r:{money:238,erode:9,flags:{flag_ruthless:1},favor:{dong_yue:-20},log:'东岳大帝把生死簿合上，压住整座泰山的云一下子沉下来：续命捐。他说：朕的簿上，从来没有捐这个字。他站起来，山风把他的衮服吹得笔直：你走吧。朕这山上，不留卖命的。'}}
   ]}
 ]},

{id:'s70',name:'瑶池·蟠桃预售案',god:'xi_wangmu',chapter:4,side:'s70',danger:5,money:185,merit:36,
 scroll:'蟠桃还没熟，就被预售了：交定金的先拿桃。桃没熟，就先摘；摘下来的，是青的。',
 reward:{items:['xw_tao','xw_pao']},
 nodes:[
  {type:'event',text:'西王母倚在瑶池边的玉栏上，手里托着一枚青桃，桃皮上还带着未褪的绒毛。她把桃递给你：这是今年的。她指了指远处的桃林：熟要三千年。如今有人交了定金，就先摘。她看着你：摘下来的桃，是青的；可定金，是真金。',
   choices:[
    {t:'查预售的契、摘桃的人、定金进了谁的账',r:{flags:{flag_know_truth:1},log:'预售契上写着「先付定金，桃熟补尾」，可契尾又添一行小字：「可提前支取」。提前支取的桃有四百枚，四百枚里，没有一枚是熟的。西王母拿起一枚青桃，闻了闻，放下：本宫的桃，是要等的。'}},
    {t:'先去交了定金的人家，看他们拿桃做什么',r:{favor:{xi_wangmu:6},flags:{flag_mercy_cut:1},log:'有人把青桃供在堂上，日日上香，说等它熟。青桃在香火里放了三个月，还是青的。西王母站在那堂前，看了很久：他们等的不是桃。她说：是本宫这三个字。'}},
    {t:'劝她：预售也是卖，早晚要卖',r:{erode:3,log:'西王母把青桃放回玉盘：早晚要卖。她说：本宫这桃，三千年一熟，熟一次，宴一次。她抬眼看你：你说早晚——早晚之间，那三千年，谁来等？'}}
   ]},
  {type:'quiz',who:'西王母',text:'瑶池的水面很静，倒影里桃林一片青。西王母示意你先答。',
   qs:[
    {q:'西王母所居之地是？',opts:['昆仑玉山瑶池','蓬莱仙岛','方丈山'],a:0,why:'《山海经》载西王母居昆仑之丘，《穆天子传》记其宴于瑶池。'},
    {q:'神话中蟠桃的成熟周期是？',opts:['三千年','五百年','一万年'],a:0,why:'《西游记》载蟠桃「三千年一熟」，前后园各有不同，最晚九千年。'}
   ],
   pass:{enemyVuln:true,merit:8,favor:{xi_wangmu:5},log:'西王母听完，把青桃放回盘中：本宫这桃，等的不是钱，是时候。'}},
  {type:'battle',enemy:'xunfengguai',name:'抢青·巡风怪',scale:1.2},
  {type:'event',text:'巡风怪倒了，桃林里落了一地青桃。摘桃的梯子还架在树上，梯脚压着预售契。',
   choices:[
    {t:'依律办：预售契作废，青桃归林，摘桃者论罪',r:{favor:{xi_wangmu:18},merit:12,flags:{flag_refuse_count:1},log:'西王母把蟠桃与瑶池金母袍交给你：桃三千年一熟，熟了，本宫请你吃一枚；这袍上的云是活的，走一步，云挪一步。收契那日，她把落地的青桃一枚枚拾起来，埋回树下：青的，埋回去，还有下一个三千年。'}},
    {t:'废预售契，定金退还，已摘青桃不再追',r:{favor:{xi_wangmu:12},flags:{flag_mercy_cut:1},log:'西王母点头：定金退了，人就不欠本宫了；青桃摘了，也长不回去。桃与袍你拿着。她添了一句：下回，等熟了再来。'}},
    {t:'续预售契，把定金抽三成，青桃照发',r:{money:242,erode:9,flags:{flag_ruthless:1},favor:{xi_wangmu:-20},log:'西王母把玉盘推到池边，青桃滚进水里，沉了。她没看你：本宫这桃，三千年一熟，熟给等得起的人。她转身往桃林深处走：定金你留着。本宫这儿，没有青的桃。'}}
   ]}
 ]}
];

/* ================= 下凡过场·任务故事背景 =================
   接案下凡后：先浮现场景图，点击后才浮现此故事，再点击进入任务。
   普通单：字符串数组（每元素一段，渐次显现）。
   长单：{all:[总故事，act=0 接单时], acts:{1:[第二幕故事], 2:[第三幕故事]…}}
   文风：水墨志怪 + 天庭官僚黑色幽默，每段带悬念钩子。
   ============================================================ */
const MISSION_INTRO = {

/* ---------- 章一主线 ---------- */
c1m1:[
'两界交界处有座破神衙，匾上金漆早被香火熏成灰黑，灯笼里没有火，却夜夜自明——老差们说，那是历代没熬到转正的阴神，把魂点在了里头。',
'你在地府考公落榜，正在夹壁间被野魂追得无处可逃，一纸《阴阳两界劳务契》飘到面前。正面朱笔写着光鲜话，背面小字密如蚁：「工伤自理，魂飞魄散与甲方无涉」。',
'画押的红泥已经摆好。今夜子时前，破神衙必须来个活人点卯——土地公拄着拐杖，正从地里冒出半截身子，等你这句话。'],
c1m2:[
'朱签在天光前落进工单架，阎罗王亲笔：夹壁游魂三缕，限今夜巡收，误一魂，扣当月香火三成。签角还添了行小字——朱砂快没了，勾魂笔自带。',
'灰雾深处，三缕游魂抱着生前执念打转：一个攥着半张考榜，一个端着冷透的药碗，一个还在念叨「再让我看一眼放榜」。它们本该各赴轮回，却像被同一根线牵到了此处。',
'土地公自告奋勇在旁喊招，喊到一半便忘了词。夜雾正浓，这是你画押之后头一趟正式公差。'],
c1m3:[
'驿馆档房连日亮着不该亮的灯。野魂们口耳相传：只要三炷供香，就能从一位腰牌崭新的黑差手里，买到一张「阴间落户告身」——从此再不怕夹壁里的东西追。',
'买了告身的魂捧纸如获至宝，可那印泥是阳间冥铺的假货，朱砂里掺了公鸡血。按天条，这是伪造天庭文书的重罪；更蹊跷的是，这些假告身摆上档房架子，竟真能「挂得上号」。',
'阎罗殿的第二道朱签，点的就是你。'],
c1m4:[
'阎罗殿外回廊终年不见天日，青袍判官崔珏就着一盏昏灯自磨朱砂，磨了四百年，笔笔都像要在黑暗里刻出字来。',
'假告身案人赃并获，他一眼断伪；可你从黑差怀里搜出的那张天庭回执，却让他沉默良久——骑缝印是真的，档房挂的号也是真的。一张假文书，竟在天庭那台大机器里，走完了一遍真流程。',
'「假印盖真文，是有人贪墨；真印盖假文，是整套规矩在作假。」他把回执推回给你，灯花爆了一下，「前者是案。后者——你办不动。」'],

/* ---------- 章二主线 ---------- */
c2m1:[
'晋升之后，辖境扩了一圈，第一站便是土地公那座小庙——庙小得像个狗窝，香炉里只剩半根皱巴巴的香，在风里抖。',
'老土地这回连你的姓都记错了，却还记得给你倒热茶。他说近来使不出劲，夜里像有什么东西顺着签筒往外抽，抽得心里发空。说完又乐呵呵补一句：「也没什么！天庭体恤，给老夫减了三成差事呢。」',
'你捧着茶，却看见他供桌底下的地脉，比上回淡了一线。'],
c2m2:[
'腊月将尽，诸神却都蔫了。灶君的奏报匣点不着火，吹半天火苗冒半寸就灭；门上神荼郁垒抱着兵刃值夜，站着站着就能睡着，谁也不记得昨夜是谁先打的盹。',
'他们挠头说不出缘由，只笼统觉得「像被谁抽了灯油」。你替两位门神守了半夜岗，子时刚过，墙头果真摸上来几道无业野魂——庙防空了，闻着味儿来的东西可不少。',
'更深的疑影还在后头：有门神恍惚记得，夜半有辆小车挨庙而过，车帘上绣着一个字。'],
c2m3:[
'山坳里有座野庙，香火稀薄，却收拾得干干净净。一位老土地端坐在神龛上，姿态完好，眉眼慈祥，见人进来便要起身倒茶。',
'可你问他尊姓大名、管哪方地界、今日几号，他一概笑着答「好，好，都好」。他还活着，还会倒茶，茶满了手也不停——只是那双眼睛里，已经没有底了。',
'神龛后头，灰毛老鼠成群惊出，窸窣响动里，夹着极轻的、灯油被啜饮的声音。'],
c2m4:[
'次日再临野庙，天没亮，山雾里就来了人。无面差吏捧着一卷明黄文书到场，黑白无常陪审，文书展开，只有冷冰冰四个字：「收回神格」。',
'文书贴上老土地眉心的刹那，他像一盏被一口气吹灭的灯。最后那一眼里什么都回来了，他攥住你袖子，气若游丝：「替老夫……看看春……」',
'差吏把残灰装进一只绣「库」字的锦囊，在簿上记了一笔，平板无波：「神格一具，验讫入库。下一庙，催。」白无常的手在袖中发抖，被黑无常死死按住。'],
c2m5:[
'奈何桥边孟婆亭，汤锅千年不歇。人喝汤忘人，鬼喝汤忘鬼，过桥的魂排着长队，把前生事一勺勺留在锅里。',
'这一回孟婆「顺错了一碗汤」，让你坐锅边顶缸。她舀勺清汤让你照影——汤面映出你的脸，脸的边缘竟比三日前淡了一点。她望着轮回队尾：那里偶尔站着一两位身着神袍的客，安静排队，安静讨汤。',
'「你说，神要是有一天也来讨汤喝——」她搅着锅，「他是想忘谁呢？」'],

/* ---------- 章三主线 ---------- */
c3m1:[
'枉死城要「整肃」了。长单朱印鲜红，城门底下却早有黄牛明码叫卖，挥舞着《提前入住避劫房契》：「领导说有劫，那就有呗。买了契，劫来了也不殃及您家！」',
'住城孤魂信了，交出全部供奉换一处栖身。你顺着香火查下去，那些供银并没有变成城防，而是养着一批有名无实的「员外神」神位——每一个神位里，都实打实地压着一枚神格。',
'整肃令在手，拆，还是不拆？城门口排队买房的魂，已经排到了你脚尖前。'],
c3m2:[
'枉死城最底层，相柳毒沼渗进城墙根，黑雾终年不散。还不起阴债的魂被扔进沼边「工偿」，一个一个，都化成徘徊不去的厉鬼。',
'天曹要的总账簿，就供在沼心一方残台上，四周是毒，是债，是无数个被账压死的苦魂。雾深处九首残影若隐若现；守台的枉死鬼王，正是当年欠债最多的那一个。',
'崔珏只要那本账。至于你怎么穿过一沼子厉鬼把它取回来——外包的命，工单上没写抚恤。'],
c3m3:[
'天曹驻枉死城办事处，窗明几净，柏木香袅袅，与门外毒雾像两个世界。主事温有节亲自迎你，亲自斟茶，又亲自把你九死一生取来的证据一张张夸完，再一张张归入卷宗，朱批四个字：「查无实据」。',
'茶始终热着，笑始终没减。「产业链？本主事认。是体恤孤魂的预付式安置，略有瑕疵罢了。」他把茶推到你面前，「真的账为何不怕人查？因为每一页都合规。吃人的从来不是账——」',
'他替你吹了吹茶沫：「是准它记账的那套规矩。」'],
c3m4:[
'天曹「不慎」遗失一道封印。四凶之一穷奇破封而出，冲入枉死城，铜铃大眼里满是讥诮，见庙就拆，见神就噬。它认得开锁的人，冲你咆哮的头一句话是：「又是你放的咱家……」',
'你被安排正面拦截，以一身外包神躯去填凶兽的牙缝；云端之上，天曹收网队早已列阵待命，神索盘得整整齐齐，连功劳簿上的名字都预先写好了。',
'放兽的，收兽的，送死的，领功的——人人都拿到了自己的工单。只有你那一张，写着「生死勿论」。'],
c3m5:[
'判官值房灯火如豆。崔珏把生死簿摊在你面前，翻到写着你名字的那一页——名字旁天曹朱批早已落下：「可用至章末，另注」。另注之下，压着一张空白《回收同意书》的编号。',
'外包随时可削，实授需三堂会审。崔珏提笔蘸满自磨朱砂，要把「外包阴神」篡成「阴阳两界实授主簿候补」。掌簿四百年，他没为任何人改过一个字。',
'落笔那一刻他手腕极稳，墨却洇开一点：「本官教过你，不合规的字一个都不能写。」他头也不抬，「今天，本官陪你写第一个。」'],

/* ---------- 支线 ---------- */
s01:[
'城西三十里，有座香火本就稀薄的小土庙。三个月前，庙祝夜里听见供桌下有磨爪之声，次日醒来，匾上「土地」二字旁，多了条毛茸茸的尾巴。',
'野狐端坐神案，自称「新任土地，天庭御封」，还掏出一张皱巴巴、油汪汪、带着烤红薯香气的《山神协理帖》。香客半信半疑，庙里香火却真旺了三分——毕竟会说话的狐狸，比泥胎有意思。',
'真土地公气得胡须直抖，可他翻遍天条，竟找不出一条能治「编外占编」的律令。这条绳子，天庭只好甩给同为编外的你去解。'],
s02:[
'阎罗王殿转批急单：一个老农的魂蹲在自家田埂上，谁来拘都不走。差役亮锁链，他就抱住田头老槐树；好言相劝，他就翻来覆去念一句：「秧苗刚插，人误地一时，地误人一年。」',
'他怀里抱着半把没烧完的稻谷，鞋上还沾着阳间的泥，魂都离了身，心还泡在水田里。村里儿子还不知老爹已经没了，夏至前若没人灌水，这一茬秧就全完了。',
'工单上写着「拘魂」。可田里的事，有时候比天条急。'],
s03:[
'村窑的火已烧了三天三夜，任凭窑工怎么封炉都压不下去，火苗一窜三尺高，还夹杂着哇哇的哭声。',
'火里坐着个火灵童子，脸上挂着两道烟灰泪。他本是村口长明灯的灯神余烬，主灯前些日子「被调去天上省火油」了，他无灯可归，只好一头扎进窑火。问起缘由，他奶声奶气地抽噎：「上头说……省油，灯火统一管。」',
'灯被收走了，火总得有个去处。再烧下去，窑就要炸了。'],
s04:[
'崔府君今夜当值，朱砂告罄，抄手也告罄，便从值房扔出三页副簿，点名让你照抄亡人名册。「字写稳些。」他在门里磨墨，「抄错一个字，明天阳间就多一口空棺材。」',
'三页名册你抄到后半夜，指尖忽然一顿——册中夹着一处被人改过的花押，墨色比别处新，印泥却对不上冥司制式。是谁的手，在生死簿的副页上动过笔？',
'门内崔珏不发一言，似乎就等着你把这一处，圈给他看。'],
s05:[
'阎君殿炸了锅。三封判词全错：善人投了畜生道，屠夫投去富贵家，一个苦读一辈子的秀才，竟被投进忘川。三魂堵在殿口喊冤，阎王爷脸黑得像锅底。',
'怪的是朱笔没错，错的是装判词的签筒——牛头手里的筒写着「善」，里面装的却是恶签。马面赌咒没离岗，夜值小鬼发誓看见「朱衣吏」来过，可当夜根本没有朱衣吏当值。',
'一封错判是疏忽，三封连错，就是生意。阎罗王惊堂木一拍：查。'],
s06:[
'腊月二十四，灶君上天言好事的日子。老灶君的《腊月奏报》却被天庭原样打回，朱批「奏报不实」，罚俸三月。他在灶台前把烧焦的奏报匣子拍得山响：「张家儿子孝不孝，老夫蹲他家灶台一整年，还能说错？」',
'他喊冤：有人替他奏了一本假的。你连夜从灶膛灰、门神、许愿簿三处取证，灰烬里扒出两份神火——一份灶君的，一份陌生的冷火；真奏报则被换成了「户户该减灶君香火、改纳天曹供奉」的模板。',
'天曹小车吏闻风而来，脸上挂着天衣无缝的笑。'],
s07:[
'城隍辖下近来不太平：庙会夜有人丢魂，野路口有人兜售路引，荒庙冒出淫祠索祭——三起案子同时复发，卷宗翻开，全是十年前就结过的旧案，作案者报的名号，也全是在籍阴神的名字。',
'你在夜路口设伏，两道冒牌身影果然现身，签文格式分毫不差，却在城隍亲定的暗口令上露了马脚。外人怎会知道巡路时辰？答案让城隍半晌没说话——内鬼就在他案下。',
'更深处，还有一具被许诺「转正神格」、专为灭口备下的壳神，正在试用。'],
s08:[
'奈何桥近日乱了套：过完桥的亡魂喝完汤，竟还记得前生——有人抱着转世的儿子喊爹，有人死活不肯喝第二碗，轮回队伍堵成了长蛇。',
'孟婆舀勺汤让你照影：汤里掺了忘川生水，还沉着一撮纸灰。她捻起一点闻了闻，脸色变了——灰是神格灰。',
'线索一路指向上界天库：库鬼身后散出的《磨灰回掺定额》写得明白——让亡魂忘不干净、还认得旧神牌位，来世的香火，才能顺着牌位流进「重封」的新神炉里。'],
s09:[
'城隍辖下疫气流行，大夫们的药却集体失效，满城咳声。药王孙思邈临凡开馆，馆前反倒冷清——天曹新发的「药引」价高，百姓抓不起药，只在门外磕头。',
'药王不争这个，他要你去阴间抓三味阳间没有的药引：枉死墙根的返魂芽旁，疫鬼正团团打转。药抓好了，一锅汤咕嘟咕嘟煎上，满城的命都在这锅汤里。',
'煎好之后怎么开价，药王把这个问题，留给了你。'],
s10:[
'官道野店，一位背剑的邋遢道人占着灶台煮黄粱，见你进来，抬抬下巴：「饭还没熟。趁这工夫，陪我做场梦？」',
'你一合眼，竟梦见自己三十年顺风顺水：考入编制，步步高升，朱笔在握，受人跪拜。只是梦里每升一次官，镜中人的眼神就空一分；到第三幕，镜中人忽然伸出手，替你接过了圣旨——他长着你的脸。',
'锅边道人笑意深长。饭香渐浓，梦里那身朱衣，已经转过了身来。'],
s11:[
'秦广殿副簿查出十七处寿数涂改：该善终的富户莫名暴毙，该死的恶绅反倒添了阳寿。生死簿乃阴司头等重器，满幽冥能碰副簿的，不超过五个人。',
'墨痕是天曹「行文柏香墨」；十七处涂改的当值签押里，都有同一个名字——一个专司两界送簿的外包文吏。你找到他时，他瘫在地上直说：有人拿他妻儿的轮回票要挟，每次只敢添一笔。',
'符信尽头，温有节手下的贴房撕下文书，当场就要灭文吏的口。'],
s12:[
'东海龙宫丢了镇海潮汐珠，潮汐失序，沿海风雨全乱。老龙王敖广一口咬定巡海夜叉监守自盗，已把人绑上剥皮凳；可你低头一看，宝库水痕指向的是给天庭上贡的「走水贡道」——夜叉没有贡道牌。',
'近三月借验文书更蹊跷：天曹以「年检」为名把潮汐珠借调六次，最后还回来的，是一枚空有珠光、不镇海潮的壳珠。',
'你闯进贡道截人，重甲赑屃拦在水道中央；而老龙王站在宝库门口，又怒，又怕——他怕的，从来不是贼。'],
s13:[
'下界财库三个月短少纹银三十万两。怪的是账实相符、封条完好、四位库神签押齐全，谁都没拿，钱就是少了。武财神赵公明喂得油光水滑的黑虎，都跟着瘦了一圈。',
'你蹲守熔银之夜，终于看见那一幕：天曹新换的「云纹火漆」封条，在银锭重铸时自行「吸」走一成银气，顺纹路升上天曹。封条被窥破，竟从箱上层层剥落，凝成一尊名叫「合规」的厚甲壳神。',
'没有人偷钱。是封印本身在抽成——而四位库神，都在自己没细看的《统一熔铸同意书》上，签了押。'],
s14:[
'电母独自核录人间天雷账，发现十七道雷「行过却无旨」——雷公部老人私下劈了坏人，天曹账上却一片空白。她要一个还没被记满黑账的外包，替她跑现场补录。',
'雷痕落点遍布人间：瞒报灾银的义庄、强占庙产的举人……还有一座，赫然是天曹自己的库栈。劈库栈那道雷，已被改记成「天火走水」。',
'守栈库卒发现你在拓雷痕，掌印一拍，喊来了同伙。'],
s15:{
all:[
'一道雷符劈进工单架，王灵官的字像鞭梢一样直：雷部三百功曹里，混进了「不会打雷的东西」。',
'天曹与雷部互相猜忌，谁点破谁就是「内讧」。王灵官不认这个账——用外包点外包，查出来是外包的眼力，查不出是外包的责任，横竖不算天曹的人打了雷部的脸。',
'你攥着雷符上雷云，随小吏连点三十卯。卯鼓一声声响过三百遍，其中三道雷，响到一半，像人打了个嗝。'],
acts:{
1:['三名空卯功曹炸成纸灰。你按《考功法》反查名册，发现近年「异地提拔」的功曹共二十七名，调来调去，替换路径都通向同一家铺子——「点卯代办铺」。','雷云压得极低，铺子幌子在电光里晃。掌柜戴着半张功曹面具，见你进门，笑得像见了同行。'],
2:['铺中的用印记录一路直通三省九司经承房——这已不是一间代办铺的案子，是一条往天顶上去的链子。','王灵官的金鞭在你背后，雷声不响。扳到哪一层收手，工单上没写，只有你自己选。']}},
s16:{
all:[
'灌江口水情近来不对，鱼精结哨、蛟将溃堤，梅山旧部却老的老、散的散。二郎神不要天兵，他点了你——带草头神与梅山残部，打一场真的：三汛联防。',
'他不出手，只坐在最高处礁石上磨刀，三尖两刃刀的寒光一下下，映着满江的雾。「打赢了，是他们的功。」他说，「打输了，是你带的兵。」',
'头汛号角已在雾里响了。江雾大得对面看不见帆，浪里全是鳍影——看不清敌人，就先读懂水。'],
acts:{
1:['江堤被撞开一道决口，白浪滔天。白浪蛟将裹着藤甲水压立起身来，浪头比庙还高。','兵系重击与火德烧甲是这一汛的题眼。决口在身后，退无可退。'],
2:['蛟王亲至，翻江三连，每一击都必须在出手前读懂、打断。最高处礁石上，磨刀声忽然停了。','三汛皆平之后，报功文书怎么写，比蛟王的獠牙更考验人。']}},
s17:{
all:[
'梅山转来一张花果山的工单：天曹《妖仙文明共建》压山而下，余部只有两条路——要么入编，领个编号做良民；要么被定为「野妖」，再剿一次。',
'崩芭二将不认命，托人请你上山做「军师」，想谈出第三条路。你到时满山猴崽列队操练，三分之一的小猴已忘了本名，报数时只报得出编号。招安使的先头随员已上山催逼，护名册的官袍底下，透出壳神的气息。',
'桃林深处，旧旗还插在石上，旗面褪了色，风一吹，像整座山都在叹气。'],
acts:{
1:['温有节派来的协办文吏法条娴熟，三轮措辞，每一轮都是坑：引旧例、抠字眼、谈补偿，谈着谈着，就把「自治」谈成了「整编」。','第三条路，得一个字一个字地从法条缝里抠出来。'],
2:['谈判濒临决裂的最后一刻，协办文吏放出一具「编制兽」强行点卯——巨兽扛着一口巨大印玺踏过桃林，要给满山妖仙挨个盖章。','打退它，自治契才落得了印。石桌上，墨迹未干。']}},
s18:[
'一科秋闱放榜，文运与中榜名单对不上：三甲尽是商贾子弟，寒窗苦读的面馆之子全数落第。文昌帝君翻遍墨卷，断言——文运榜在两界之间，被人换了页。',
'贡院房牍里有两副笔迹，三名高中者阴德栏盖的是天曹「特推」印，印泥里掺了金银灰。卖关节的「卷先生」被你堵在贡院梁上，供词上达：天曹新设「文运统筹捐」，功名明码标价，美其名曰「科举产能优化」。',
'帝君翻出你生前那一科的旧卷，默然推到你面前——你的名字，本在榜上。'],
s19:[
'文财神比干无心，故天下买卖公道，他那杆秤称了千年，分毫不差。近日秤却偏了：善商的货过秤轻三分，奸商的反倒重了三分，问心有愧的人，反多占了便宜。',
'他查遍秤杆秤砣，最后在秤星里发现一粒天曹新颁的「公允星」——星是好星，配重心术却歪。颁星星吏见他要摘，当场翻脸。',
'无心之神靠公道成神。比干捏着那粒壳星问你：如今连「公允」都能发配重头，神还凭什么，做神？'],
s20:[
'东海连报海难，妈祖护航屡屡失灵，她的红灯标在风暴里一盏盏熄灭。娘娘带病出海，在浪尖上请你做一次人间灯标——她照远处，你照民船。',
'风暴眼里巽风怪卷着浪墙撞向船阵；而你拼力破浪之后才发现，熄灭的灯全被换成了天曹制式「贡道航灯」：灯还亮着，却只给挂贡旗的官船指路，民船循光走，正好被引上暗礁。',
'灯没有灭。灯只是，不再为穷人亮了。'],
s21:[
'真武殿闭门炼魔，殿前龟蛇二将环甲而立。听闻你要上天叙功，真武大帝传你入殿，不考神通，只考一桩——你揣着满身别人的神格走到今天，可还配称一声「荡魔」？',
'玄甲阵起，前半蛇影高速毒攻，后半龟甲重守如山，杀意在两相间轮转不休，殿中烛火被压得只剩一点。',
'阵收之时，他只问一句话：「你身上的格，是你的，还是他们的？」'],
s22:[
'莲花洋上漂来一船残识——都是从枉死城出逃的小神，神格已被剥去大半，随时会散。观音大士以净瓶水暂缓其消散，可一瓶之水，只够渡一半过洋。',
'满船残识在水光里静静看着你。天曹回收使踏浪而来，索套垂在身后，要把它们重新装回「库」里，重新排队，重封，再卖一次。',
'追兵船帆已压上洋面。菩萨回头看你，没有问打不打，只问：「慈悲，要不要算成本？」'],
s23:[
'崔珏一封飞符比风还急：温有节在叙功殿西厢备了间「换格房」，历年上天叙功的外包，走进去之前与走出来之后，不是同一个。',
'你今夜赴的是宴，要摸的是名册。避开巡卫摸到西厢，最后一道门前，契卫拖着重戟睁开了眼。',
'名册《叙功叙用录》上，你名字之前已有七任外包：红批一半「已重封」，一半「已任」——肥羊与新刀，两条流水线，严丝合缝。而你的名字，就排在第八行。'],
s24:[
'上天叙功前最后一夜。土地公已彻底想不起你是谁，却执拗地搬着小马扎坐在破神衙门口，逢人就说：「有个小友今天要出远门，老夫得等等。」',
'他怀里揣着半块供糕，和你画押那夜他塞给你的那块，一模一样。你给他看这一路替他攒下的东西，他一件也认不出，却一件一件都觉得暖。',
'子时，巷口吱呀吱呀，推来一辆装灰袋的小车——土地公的名字，已经在预削名册上了。'],

/* ---------- 支线 s25～s34：井/牛/马/日夜巡/钟/魏/陆/班/荷 ---------- */
s25:[
'村口老井是全村的命根子，井泉童子在井栏上坐了不知多少年——总角双丫，红肚兜，一双脚丫泡在井水里，识得每一道水纹。淘井要先祭他，谁家往井里吐口水，第二天水就带酸。',
'这月初三，井口忽然贴了张《两界水务统一管护告示》，一根铁管插进泉眼，从此凭牌汲水、每桶两文，盖章的是听都没听过的「天曹趵突水务」。井水一夜变苦，村里老人喝了，直说想起上辈子喝苦药汤的滋味。',
'童子太小，神格薄得像片水藻，连削藩的工单都懒得切他——可那根管子，嘬走的恰恰是他全部的水脉。他拽不住铁管，只好拽住路过神衙的你。'],
s26:[
'阎君殿转批的急单：十八层地狱门前，上百个魂举着天曹《减刑核准函》要求出狱，函件烫金、骑缝朱印、编号花押样样齐全。牛头阿傍横叉拦门，从子时撑到天明。',
'阿傍是地府最认死理的狱卒头——阎王说东绝不往西，钢叉不点头，谁也别想从狱门迈出去半步。可这一回，他翻来覆去只剩一句理亏似的话：函是真的，俺就是觉得不对。',
'工单背面添了行小字：此单不走天曹签派，阎君殿直发。你赶到时，狱门上的铜环正被拍得山响。'],
s27:[
'马面的锁链三天三夜没合眼。一个逃魂揣着一纸天曹《通关度牒》闯出枉死城，连过七道关卡，关关见牒放行——牒不认人，人认牒，地府追逃的老规矩被一张轻飘飘的纸按在地上摩擦。',
'马头罗刹是阴司头一号快腿，长臂如猿，一鞭能把逃魂从峨眉山脚下抽回阴山。这回他追得马鬃都散了，那魂还在乱坟岗子上冲他做鬼脸，边跑边晃牒：你跑得过我，跑得过这个？',
'毒舌归毒舌，他把「办成」二字看得比天大。工单塞进你手里时就一句话：俺读牒，你读步。'],
s28:[
'日游神是天庭安在白天里的一双眼睛：绛衣皂带，腰牌悬胸，谁家行善、谁家作恶，哪怕鸡零狗碎，都一笔一笔记进《日行小过录》，当日报送察查司。死板，勤奋，只忠于记录本身。',
'怪事就出在册子上：他昨日亲笔录了三十七件，今早册子发还，只剩九件，纸页平整如新，少的那二十八件像从来不曾被写下。更让他脊背发凉的是——他模模糊糊觉得，昨日申时在街上巡行的那个「自己」，回衙门时冲自己客气地笑了一下。',
'他不敢声张，只在你路过时把腰牌一亮：本神不抓人，只求你帮本神把那一个时辰，找回来。'],
s29:[
'子时到丑时，是夜游神的时辰。玄冠玄服，一盏绿灯，专走破庙野坟、禁地荒宅——那些不敢见太阳的账，都归他听。他和日游神一个白天一个黑夜，却谁也不进谁的册子。',
'这几夜，城西那座塌了一半的将军庙悄悄「活」了：夜半有微弱香火，天明再去，香灰全凉、殿门反锁，像什么都没发生过。夜游神在庙外站了三夜，没进去，也没上报。',
'月黑头，他把你截在巷口，绿灯塞进你手里：替本神送一盏灯。送到就放下——别照第二眼。'],
s30:[
'罚恶司判官钟馗，终南山的进士，捉鬼的祖宗。豹头环眼，铁面虬髯，活着时因貌丑被当场黜落状元，一怒触柱而死；死后天帝怜其刚烈，命他专吃天下恶鬼——十个恶鬼里，他说九个穿着官衣。',
'这一两月他一只鬼也没捉着。不是天下太平，是鬼都学乖了：腰间别着《捉鬼业务许可证》，反拿批文去捉平民小鬼充业绩，罚恶司的剑劈到文件上，跟劈进棉花里一样。',
'他蹲在你神衙门槛上啃鬼腿，油手往门板上擦了擦：俺这身官皮进的门，鬼都不进了。借你这身外包的皮，用用。'],
s31:[
'魏征的赏善司，是阴司里最像考场的地方：生前行善之魂在此核验真伪，据以核定来生人天福报——投善胎、入富贵，还是再入轮回，全看善簿上的字。人曹官梦斩泾河龙的剑就挂在堂后，龙都斩得，况几个伪证。',
'近来善簿出了蹊跷：绫罗满身的魂，册册施粥千石、修桥百座；衣衫褴褛的真善魂，凭据只是半块瓦片、一领裹尸的苇席。更有烫金的《善举认证书》成箱抬进司里，落款都是同一家「福报摇号代办」。',
'魏公三日不眠，把一摞善簿推给你这个生脸外包：本官看熟了的脸，看不出新的假。你核。'],
s32:[
'察查司判官陆之道，绿面赤须，貌狞心热，是阴间的仵作，也是御史。《聊斋》里替人换心开智、换首雪冤的那位陆判就是他——人心鬼心神心，他都剖得开，验状只替证据说话，上得了阎罗殿。',
'如今他手里压着一桩剖不动的尸：尸主报了「自尽」，三日不腐，冤声夜夜撞义庄的瓦。家属已收天曹《避劫险》三倍烧埋银，签字画押，明早火化——偏偏察查司的勘验公文，排期在半个月后。',
'三更天，他翻墙敲开你的窗，抛来一把薄刀：本判签字要等公文，你是外包，你不用。走，开棺去。'],
s33:[
'鲁班，公输氏，名班，工匠的祖师爷。木鸢三日不下，云梯破城，锯刨墨斗榫卯皆出其手；他那双眼睛看惯了绳墨尺寸，什么活儿在眼前一过，料长几分、榫虚几厘，比尺子还准。',
'天曹要在两界造百万座「合规神龛」，请他出山验工。他到工地第一天，墨斗连弹七道线，七道线齐刷刷朝同一方向歪了半厘——旁人劝他换墨斗，他蹲在样龛前蹲了一夜：不是线歪，是这房子，自己在缩。',
'缩的料去了哪，空的瓤供的是谁，老木匠全看在眼里。他认尺寸不认神佛，可他也知道，有些尺寸一量出来，是要得罪神仙的。'],
s34:[
'何仙姑是八仙里唯一的女仙，零陵姑娘，十三岁溪边遇仙食桃得道，从此手持荷花行世，主清净疗愈，专司女子采桑纺织、生产病痛之愿。她的荷花池在零陵山坳里，池水是一脉活泉，多少难产的妇人靠半盏荷露母子平安。',
'这年天曹一纸《人间水域统一调配》，水车架进荷塘，日夜不停把活水抽往云深处——说是瑶池设宴，要补三日「景观水」。半池枯了，粉荷卷边，池边求子求药的妇人排的队却更长了。',
'仙姑不与人争，也不与官争。她只把一片荷瓣放进你掌心，软声软气：硬堵水车要惊胎气。水的事，咱们软着来。'],
s35:[
'关帝祠在城南立了一百四十年。求义的、求财的、拜把子的，门槛磨得发亮。祠祝说，夜里有刀鸣，声不大，但一夜一夜，没停过。',
'祠穷了三个月。香火钱断供，祠祝跑光，只剩神案上那柄青龙偃月的木样和一件旧锦袍，还守着满殿蛛网。而三条街外，新开的「武圣祈福中心」金碧辉煌，香客排到巷口——扫码开光，童叟无欺。',
'夜风穿堂，你在殿角看见一道赤面长髯的影子。他没有看你，只看着神案上的刀：某家的刀，替人间斩了一百四十年的邪。如今斩不动一张收款码。'],
s36:[
'奈何桥这头到望乡台，长队排出去十里。以前渡资三文，童叟无欺；如今涨到九文，还分「普通魂」「加急魂」「VIP魂」三档——收钱的牌子，盖着新成立的「忘川渡务提举司」大印。',
'孟婆在桥头熬了三千年的汤。她记得每一个过桥的魂：哪个亏欠过谁，哪个惦记着谁，全在她那口锅里。她说递牌子的那位鬼吏，生前是她看着长大的娃，穷魂出身，饿死在灾年。',
'如今那娃官袍加身，穷魂的渡资，是他涨的。孟婆搅着汤，火光照着皱纹：老身这双手，熬汤行。掰手腕——不行了。'],
s37:[
'罚恶司的业绩册，一年比一年厚：页页「满额」，月月「先进」，墙上的锦旗多到没地方挂。可人间恶鬼越捉越多，钟馗的剑，一年比一年钝。',
'钟馗昨夜吹灯点名：三百个在编鬼差，应到的只有三十个。剩下二百七十个名字，俸禄月月领足，名字底下一个鬼影都没有——空饷，吃到了罚恶司自己头上。',
'他一屁股坐在案上，把业绩册摔到你脚边：俺生前撞柱，撞的是不公。俺死后吃鬼，吃的是邪恶。可这册子上的二百七十个名字——俺的牙，都不知道先啃哪个。'],
s38:[
'花果山又上文书了。这次不是招安，是「妖口普查」：全山猴子限期登记「妖籍」，不登记者按黑户妖收押。山门口立起了登记处，点一个名，烙一个铁牌。',
'孙悟空成佛五百年了。头上的金箍早没人提收走的事，他自己也懒得摘。可猴孙还是那群猴孙——十万年前就在山上住着，几时轮到一纸公文来点名。',
'他蹲在山崖上啃桃，桃核一颗颗吐在登记处的公文上。看见你来，他把最后一口桃咽下去：来得正好。俺正想看看——这道「外包的差」，敢不敢按他们自己写的规矩，办他们自己的人。'],
s39:[
'陈塘关外的河滩，新支起一片窝棚，木牌上写着「莲花化身·平价速成，三炷香出壳」。藕身论斤称，白胖水嫩，泡在浑水里。买主多是穷人家——给病重的孩子「换身续命」。',
'莲花化身是太乙真人一节一节塑出来的命。窝棚里三天速成的那些，泡了水会烂。藕一烂，困在里面的孩子魂魄，跟着一起烂。',
'哪吒踩着风火轮堵在作坊门口，少年音，字却冷：俺当年剔骨还父，好歹是俺自己剔的。这些孩子——是被人按进去的。'],
s40:[
'灌江口的旧庙前立起两块新碑：左边「天眼监测·灌江口服务站」，右边「草头神精简名单」。一千二百草头神，在册的只剩三百。',
'天眼被「技术托管」给了监测公司。看什么、不看什么，全由 KPI 决定：香火、违建、越级上访，必看；水患、渔船失事、山民求救——「不在监测范围」。',
'杨戬负手立在殿前，额上竖眼半睁半闭：本君这只眼，生来是看妖的。他们拿去，专挑不敢还手的看。'],
s41:[
'普陀山的功德箱换了新的——鎏金镶嵌，正面一块小牌：「功德金融·善款增值计划：您的每一文功德都在生息」。箱侧一行小字：「救助申请审批周期 45-180 天」。',
'山下疫病的人等不了四十五天，饿的人连四五天都等不了。善款在账上滚动生息，粥棚的火却越来越小。',
'观音菩萨立在紫竹林边，净瓶抱在臂弯，声音像退潮后的沙滩：善款是哭声换来的。哭声——不能生利息。'],
s42:[
'阴律司的库房没有门，只有一道朱砂封条。封条完好，三千张「借寿回执」却不翼而飞——簿上死了的活着，活着的已经死了。',
'人间的「延寿代办」开着三家分号，门口排队的人捧着银锭子，出来时捧着一张盖了阴律司大印的黄纸。被支取阳寿的，都是些没人替他们说话的穷魂。',
'崔珏把朱笔搁在砚上，笔尖悬着一滴不肯落的朱砂：本判掌簿三百年，头一回遇着有人替本判勾人，勾得比本判还熟。'],
s43:[
'泾河龙王那一案，封在赏善司三百年。卷宗上写的是「行雨误时，按律当斩」，盖的是魏征的私印——他生前梦里斩的龙，死后还要替这条龙守案卷。',
'可这半年，卷宗被人一页一页借了出去。借据上只有一行字：「业务需要，长期借用。」市面上的钱庄，开始拿「龙王旧案一页」作抵押，放贷给渔户、船工、丢了儿子的老妇。',
'魏征立在长案后，衣冠一丝不乱：本官认字认了三十年。涂了的，也认得出。'],
s44:[
'察查司的验状上，一年里死了三回同一个人。三具尸首，三张不同的脸，指纹不同，牙口不同，验状上的名字，却只有一个。',
'京城有门叫「替死」的生意：该死的人出钱，善堂替他找一具无主尸首，换一张验状。死的是别人，活着的是他——只是他从此不敢照镜子。',
'陆之道蹲在第三具尸首旁，薄刃挑开验状：本判验尸三十年，验过溺死的、病死的、摔死的。头一回验到「替死」的。'],
s45:[
'财帛司的香火账上，多了一批「未到账的香火」。有人把明年、后年的香火提前卖了，一层层加价，卖到了第三手——买主是些小庙庙祝、香烛摊贩，还有把养老钱换成黄纸的老人。',
'凭证是一张黄纸，印着「财帛司预收」，底下盖一个「代」字章。比干的印，从来不刻「代」字。',
'比干坐在案后，衣服敞着，胸口那里空着：本官没有心，所以不看人，只看数。这数，三年一模一样，一文不差——太干净了。'],
s46:[
'凡间新起一门生意：「按月订阅，续命不断」。断供一日，病即复发；断供一月，人就没了。契书背面印着药铺的号——正是药王当年施药的那一间。',
'药王庙后院的药圃荒了半边，土三年没换过，种什么死什么。前殿的「延命订阅」，药就是从这里出去的。',
'孙思邈蹲在畦边，捻起一撮土：本王的方子被改了三味，添了一味。添的那味，叫「断不得」。'],
s47:[
'匠作监的工匠名册上一千二百人，工地上却只见三百张脸。其余九百人的工钱，月月照发，活儿也照干——只是干活的东西，不是人。',
'九百个「工匠」是机关傀儡，照着匠人的手刻的，刻得比人还齐整，签到用朱笔，一天一天，字迹全一样。',
'鲁班把曲尺往梁上一卡，又俯身听了听地底：底下有响动，不是人走路的声音。俺这行，最忌讳拿假手替真手。'],
s48:[
'岳阳楼下的酒肆挂出一块新招牌：「纯阳亲度·度牒现货，三百两一张」。买牒的人排到江边，一半是求仙的，一半是明知假、也要买那句「我已经是仙了」。',
'真度牒的朱砂掺金粉，假牒掺的是铁锈。可印牒的雕版刻得极工整，工整得不像人手——像是同一个模子里翻出来的命。',
'吕洞宾把酒壶倒扣在桌上，酒液一滴不剩：本仙这双手，一年也度不了三个。他们一年卖三千张，卖得比本仙还像本仙。'],
s49:[
'城里各家药铺都挂起了「荷仙姑亲制仙露」的招牌，一瓶难求。喝了的人病没好，反倒咳出一股荷腥气，瓶底沉着一层白。',
'真露是子时从荷叶上收的，一夜收不满半盏。假露是后巷一口大缸、一根竹管、一桶井水加两把明矾——墙上字条写着：色白、味淡、放三天不起沫。',
'何仙姑蹲在池边，指尖拨开一片荷叶，叶下浮着一层油花：这池水，本仙养了三百年。他们抽水的时候，连声招呼都不打。'],
s50:[
'雷部新设「代劈」一职，明码标价：谁出得起香火，雷就往谁指的头上落。三个月里，七道雷落错了地方，七份批文上写着同一个词——「忤逆」。',
'真雷的痕是斜的，落地炸开三道裂纹；代劈的雷，痕是直的，裂纹只有一道，整齐得像用尺子划的。',
'电母把两面镜子立在案上：先照，后劈，是雷部的规矩。如今是先收钱，后照——照出来的，还是本君的脸。'],
s51:[
'玄坛的财符，一张保一间铺子一年。如今有人把符整沓收上来，租给赌坊，一张符押三家。一夜之间，整条街的铺子都关了门，只剩赌坊的灯亮着。',
'收符的游方道士穿得像、念得也像，就是不会画符——符上的朱砂纹是印的，边角还留着裁切的白茬。赵公明画符，从不裁边。',
'赵公明踩着黑虎走进空街，靴底碾过一张黄符：本帅这符，保的是营生，不是赌本。'],
s52:[
'今年秋闱，上榜的名字和文章对不上。落卷的卷面干干净净，中卷的卷角有个极小的墨点——那墨点，是接单者和买主对上的暗号。',
'文昌阁外有人接单：代点魁斗，价高者得。榜一张贴出去，寒门子弟的十年灯火，就被一个墨点抹了。',
'文昌帝君把两份卷子并排铺开，天聋地哑立在阶下：本君的朱笔，点的从来是文章。如今有人替本君点——点的不是文章，是银子。'],
s53:[
'漕运衙门把「护航」包给了外头的「顺风堂」：交了银子，旗子插上，风雨照来，船照翻。三个月，翻了十一条船，旗子还都在桅杆上飘着。',
'顺风旗的布是旧的，字是新描的，旗角还留着半截旧纹样——是妈祖庙里撤下来的旧幡。拿旧幡收买命钱，风不认旗，只认灯。',
'妈祖站在湄洲的礁石上，手里那盏引航灯忽明忽暗：本宫来晚了。这句话她说得很轻，海风却一下子静了。'],
s54:[
'纠察司的罚单，如今有人代缴：交一份钱，抹一条过；钱交得多的，过抹得干净。',
'罚单的底根还留着，编号连着，抹去的那几条，编号是连在一起的——一单没少，一单没销，只是不记在人名下了。',
'王灵官把金鞭往案上一横：本官纠察三界，头一回听说，过还能代缴。'
],
s55:[
'南天门的善根，如今按季考核：每人每季须积善根若干，积不够的，门籍往后挪一名。',
'善根本该是随手做的，如今成了要交的差事。有人拿着钱，去雇人替自己行善；善行是真的，行善的人不是。',
'增长天王把手里的戟往地上一顿：本将守门，不守账。可账本如今摆到了门外。'
],
s56:[
'北俱芦洲的福德税，收到了不该收的地方：行善要交税，积德要报备，连扶老人过街，都得先领一张「福德申报单」。',
'申报单的存根堆了三间屋。多闻天王翻了半日，翻出一张：某年某月，某人扶一老妇过街，申报为「一日一善」，核减。',
'多闻天王把混元伞收了：本天王管的是福德，不是税。'
],
s57:[
'一殿的排号，如今能花钱买：早来的人在门外站着，晚来的人从侧门进去，进去还回头看一眼站着的。',
'排号簿上，买的号与排的号，字迹不一样。排的号是判官的笔，买的号，是别处来的手。',
'秦广王把孽镜台擦了擦：照一照吧。镜下没有号，只有人。'
],
s58:[
'五殿的冤单，包给了外头的「理冤堂」：按件收费，理得出就收，理不出退一半。三个月，退了一半又一半。',
'冤单的申诉栏里，有一行字被重描过：「已受理，待复核」——受理的日期改了三次，复核的日期还是空的。',
'阎罗王把惊堂木压在单上：本王判的是案，不是件。'
],
s59:[
'轮回门的投胎，如今能加急：交了加急费的，插在前面；没交的，在门外等着，等到忘了自己在等什么。',
'加急的号牌是木的，普通的是纸的。牌上都写着「六道」，可插队的那些，去的多是同三道。',
'转轮王把轮盘按住：这轮子转的是业，不是价。'
],
s60:[
'东海的雨票，被人倒卖：一票一场雨，票贩子把该下的雨囤起来，旱的地方等雨，雨成了货。',
'雨票的票面是湿的，捏一把能挤出水。敖广把票摊开，一张张看：这雨，是本王的；这价，不是。',
'敖广把云头压低：本王行雨，从来只看旱不旱，不看买不买。'
],
s61:[
'嵩山的地脉，被人拿去签了租约：租给矿户，一签百年，租金一次付清，付完山就不是山的了。',
'租约上写「只取山石，不动地脉」。矿户取的就是地脉里的水脉石——取一脉，塌一片村。',
'中岳大帝把玉印从印匣里取出来：本帝这印，压的是地脉。地脉一动，印就轻了。'
],
s62:[
'北宫荡魔的差事，如今分包给了外头的「镇魔行」：按头收费，收了钱才荡魔。不交钱的人家，魔就堵在门口。',
'镇魔行的名册上，每一头魔都编了号，旁边写着「已受理」「待受理」「不受理」。不受理的那一叠，最厚。',
'真武大帝坐在北宫，龟蛇盘在脚边：本帝荡魔，从不收钱。如今这魔，还分起受理不受理了。'
],
s63:[
'雷部的雷票超发了三倍：一张票许一道雷，如今同一道雷，卖给了三个人。劈下来的时候，三个人一起抬头。',
'雷票是雷部库里的旧纸，纹路却对不上。多出来的两倍，是有人拿另一批纸，照着旧票印的。',
'雷祖双鞭横在膝上，鞭梢还冒着细烟：本尊这雷，一道是一道。'
],
s64:[
'华山的矿脉被人私采，采出来的金子，铸成一尊西岳大帝像，又卖回给西岳庙。金子绕了一圈，回到山上，山却空了。',
'铸坊的模子上刻着「捐造」二字。捐造的像，卖三倍价；卖出去的金牌，枚枚刻着「西岳」。',
'西岳大帝把一尊小金像摆在案上：这像很轻。轻的不是像，是本帝这座山。'
],
s65:[
'兵符被人租了出去：一符一军，租的人拿它去打仗，打完把符还回来，符上还带着别人家的血。',
'流出的符有十七枚，都是从一个旧祠里「请」出来的。租期三年，租金按军计，钱货两清，不问生死。',
'九天玄女立在云台上，天书摊在面前，书页无字：本座授符，一生授一次。'
],
s66:[
'地狱开始考核：每个狱卒每月须「度化」够数，度不够的扣香火。于是没人愿意度难度的魂。',
'考核表上每一层的「度化」栏底下，都有一行小字：「不含疑难」。最底那一层，数还是零。',
'地藏王菩萨坐在九华山下，谛听伏在脚边，耳朵贴着地：本愿度的，就是疑难。'
],
s67:[
'舍利押运的差事外包给了镖行：镖行押一半，另一半在半道上「丢」了。丢的那一半，过几日出现在别家的供桌上。',
'镖行的押运图上有三处「歇脚」，都不在官道上。本将该押的，是这七颗舍利的每一寸路。',
'韦驮立在山门内，降魔杵拄地，杵底压着押运单：本将从不假手于人。'
],
s68:[
'罗酆山的六天宫，被人拿去签了租约：租给外头的「幽冥置业」，六宫改作仓房，鬼魂按间收租。',
'六宫的仓门上钉着铜牌，编号一直排到第九百间。仓里堆的不是货，是魂。',
'酆都大帝坐在六天宫仅剩的一盏灯下：本帝统北阴三千年一替。如今这六宫，租出去了。'
],
s69:[
'生死簿被人影印了：影印本流到人间，命可以买，寿可以改——改的，还不是自己的命。',
'影印本的纸边有暗纹，暗纹连着第几页，页就归哪一司管。改过的六十三页，分属三司，印都是真的。',
'东岳大帝坐在泰山之巅，生死簿摊在膝上：印是朕的，笔不是。'
],
s70:[
'蟠桃还没熟，就被预售了：交定金的先拿桃。桃没熟，就先摘；摘下来的，是青的。',
'预售契上写着「先付定金，桃熟补尾」，契尾又添一行小字：「可提前支取」。提前支取的四百枚，没有一枚是熟的。',
'西王母倚在瑶池玉栏上，手里托着一枚青桃：本宫这桃，三千年一熟。'
]
};

/* ================= 反查表 ================= */
const GODHOOD_BY_GOD = {};
Object.entries(GODS).forEach(([g, gd])=>{ if(gd.gh) (GODHOOD_BY_GOD[gd.gh] = GODHOOD_BY_GOD[gd.gh]||[]).push(g); });
