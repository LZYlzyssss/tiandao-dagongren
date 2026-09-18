/* ================= 天道打工人 · 数据层 v3 =================
   五系：bing兵 / fa法 / you幽 / huo火 / sheng生
   tier：E灵吏 D正神 C神官 B天君 A帝君 S天尊
   神格品质：凡 / 灵 / 宝 / 仙；神格 53 枚常规 + 14 枚融合产物
   权威设定源：lore/01 神仙谱、02 精怪妖魔谱、03 官阶典制、04 神格图鉴
   ============================================================ */
const PATHS={bing:{name:'兵',color:'#c0392b',desc:'爆发单体震骇'},fa:{name:'法',color:'#2e6f9e',desc:'雷法控制群攻'},you:{name:'幽',color:'#6b3fa0',desc:'真伤拘魂削弱'},huo:{name:'火',color:'#d2691e',desc:'灼烧连击调和'},sheng:{name:'生',color:'#3a8f5a',desc:'治疗护盾超度'}};
const FAVOR_LEVELS=[{v:0,name:'相识'},{v:20,name:'相熟'},{v:50,name:'信重'},{v:90,name:'莫逆'},{v:140,name:'生死之交'}];
const AID_POWER=[0,0.25,0.45,0.75,1.0];
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
gifts:{loved:['wugu'],liked:['xiangzhu'],disliked:['puti']}},
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
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['panta']}},
wei_zheng:{name:'魏征',title:'赏善判官',icon:'魏',tier:'C',camp:'地府',path:'you',unlock:{ch:3},gh:'y_weizheng',
intro:'掌赏善司核查生前行善之魂定人天福报，方正冷峻不苟言笑，人曹官梦斩泾河老龙的凌烟名臣，认法不认人也认证据。',
  sources:'《旧唐书·魏征传》；《贞观政要》；《西游记》第九、十回',
  story:'魏征是赏善司判官，和崔珏是同朝旧识。活着时就是李世民的谏臣，敢当面骂皇帝。做了判官更不认人——哪怕是天庭下来的神犯了错，他一样按律发落。体制内「规则派」代表。',
img:'Chinese ink wash painting of Wei Zheng as underworld reward-goodness judge in scholar robes holding a memorial tablet, stern and upright, sumi-e style with ink black accents, portrait',
aid:{name:'赏善录',type:'heal',heal:0.32,desc:'相熟治疗加护，信重真伤破盾，莫逆龙妖巨伤，本体破伪群易伤并反伤盾。'},
gifts:{loved:['mozhen'],liked:['puti'],disliked:['hulu']}},
zhong_kui:{name:'钟馗',title:'罚恶判官',icon:'钟',tier:'C',camp:'地府',path:'you',unlock:{ch:2},gh:'y_zhongkui',
intro:'掌罚恶司擒天下邪祟虚耗，专吃恶鬼与恶吏，刚烈粗犷嫉恶如仇的终南山进士，恨恶吏如仇，十个恶里九个穿着官衣。',
  sources:'北宋《梦溪笔谈》（唐明皇梦）；《唐逸史》；《钟馗斩鬼传》《钟馗全传》',
  story:'钟馗本是穷秀才，才华横溢却奇丑无比。考状元时皇帝因他丑不录取，钟馗一怒撞柱而死。天帝封他罚恶司判官专捉鬼。他有个习惯——每天画自己的像送街坊：「贴在门上鬼就不敢进」。',
img:'Chinese ink wash painting of Zhong Kui demon-queller with fierce ugly face in blue robe holding a sword, bold and boisterous, sumi-e style with strong ink strokes, portrait',
aid:{name:'啖鬼一口',type:'percent',pct:0.30,desc:'相熟真伤吸血，信重群震骇，莫逆大真伤灼烧斩杀，本体群真伤对鬼处决。'},
gifts:{loved:['hulu'],liked:['taomu'],disliked:['panta']}},
lu_zhidao:{name:'陆之道',title:'察查判官',icon:'陆',tier:'C',camp:'地府',path:'you',unlock:{ch:3},gh:'y_lupan',
intro:'掌察查司核查案情真伪卷宗虚实，阴间法医兼御史，貌狞心热痴气学术狂，剖开看假的真不了，验状能上阎罗殿只替证据说话。',
  sources:'清·蒲松龄《聊斋志异·陆判》',
  story:'陆之道是察查司判官，专查冤案错案。传说他有本「善恶簿」，记着每个人前世今生所有善恶。有人说他就是《聊斋志异》里帮朱尔旦换心的「陆判」。只认案情不认天条。',
img:'Chinese ink wash painting of Lu Pan the inspector judge with green face and red beard holding an autopsy knife, coldly scholarly, sumi-e style with dark green and cinnabar, portrait',
aid:{name:'勘验',type:'vuln',mult:1.8,vuln:0.5,rounds:2,desc:'相熟真伤加易伤，信重暴击回能增益，莫逆明牌加群破防，本体已损血比例核弹。'},
gifts:{loved:['mozhen'],liked:['hulu'],disliked:['puti']}},
bi_gan:{name:'比干',title:'文财神',icon:'干',tier:'C',camp:'民间',path:'sheng',unlock:{ch:3},gh:'s_bigan',
intro:'文财神之一，无心故无私，主公正之财与科甲文衡，商少师强谏三日被纣剖七窍玲珑心，清癯温和，最懂被挖空的滋味。',
quote:'人无心，便无偏私；这秤上的财，才配叫公道。',
  sources:'《史记·殷本纪》《宋微子世家》；《封神演义》第二十六、二十七回、九十九回',
  story:'比干是商朝王叔，劝纣王不要宠妲己被挖心。他走出宫门碰见卖空心菜的老妇人，问「人无心能活吗」，老妇人说「菜无心能活，人为何不能」——比干顿悟倒地，被封文财神。游戏里他最懂「空心」滋味。',
img:'Chinese ink wash painting of Bi Gan the civil wealth god with hollow chest in court robes, serene and sorrowful, sumi-e style with jade green and gold accents, portrait',
aid:{name:'无心秤',type:'shield',shield:0.35,desc:'相熟公正护盾，信重命中暴击增益，莫逆持续回血，本体清增益转全队大护盾反弹。'},
gifts:{loved:['mozhen'],liked:['puti'],disliked:['hulu']}},
sun_simiao:{name:'孙思邈',title:'药王爷',icon:'药',tier:'C',camp:'民间',path:'sheng',unlock:{ch:2},gh:'s_yaowang',
intro:'药王爷主医药疗疾走方施诊，兼治神的空心之症，著千金方的仁厚医者，唯一敢给神看病的人，诊出空心化不可逆。',
quote:'人间的病要治；神仙的病，也总得有人敢号这个脉。',
  sources:'《旧唐书·方伎传》；《新唐书》；《千金要方》《千金翼方》；《酉阳杂俎》医龙医虎传说',
  story:'药王孙思邈活了一百四十二岁，写了《千金方》。传说隐居时曾给老虎治伤——老虎叼金钗谢他，后来出门总带这只钗。民间药王庙会的主神，医者祖师爷。',
img:'Chinese ink wash painting of Sun Simiao the medicine king with white beard holding a gourd and tiger-ring, kindly and composed, sumi-e style with sage green accents, portrait',
aid:{name:'千金方',type:'heal',heal:0.38,desc:'相熟中等治疗，信重净化回血，莫逆濒死复活，本体大疗全净化持续回血。'},
gifts:{loved:['puti'],liked:['wugu'],disliked:['xiangzhu']}},
lu_ban:{name:'鲁班',title:'巧圣先师',icon:'班',tier:'C',camp:'民间',path:'bing',unlock:{ch:3},gh:'b_luban',
intro:'工匠祖师主营造机巧绳墨尺寸，护天下手艺人，公输般削竹木为鹊三日不下，认尺寸不认神佛，一眼看出神瓤不吃劲了。',
  sources:'《孟子·离娄》；《墨子·公输》《鲁问》；《礼记·檀弓》；《事物绀珠》',
  story:'鲁班本名公输班，春秋鲁国人。造过攻城云梯、木鸢飞车，被墨子怼过。民间说他发明了锯（被草割手灵感来的）、刨子、墨斗、榫卯。他有本《鲁班书》分上下卷，上卷盖房子，下卷「整人」——学下卷要绝后。',
img:'Chinese ink wash painting of Lu Ban the master carpenter holding a ink marker and try square, focused artisan, sumi-e style with wood brown ink, portrait',
aid:{name:'墨斗放线',type:'vuln',mult:1.9,vuln:0.5,rounds:2,desc:'相熟易伤2回合，信重大伤破甲，莫逆机关群伤，本体破防核弹眩晕并全队减伤。'},
gifts:{loved:['taomu'],liked:['mozhen'],disliked:['panta']}},
lv_dongbin:{name:'吕洞宾',title:'纯阳帝君',icon:'吕',tier:'C',camp:'天庭',path:'bing',unlock:{ch:3},gh:'b_lvchunyang',
intro:'全真北五祖之一，酒仙剑胆度人无数的游方散仙，黄粱一梦大悟，编外散仙烦工单，江淮斩蛟岳阳弄鹤，只度人不度天。',
quote:'天庭的工单催不进酒壶里——来，先干了这碗再说。',
  sources:'《续仙传》；《钟吕传道集》；元《纯阳帝君神化妙通纪》；《岳阳风土记》',
  story:'吕洞宾是八仙之一，有「狗咬吕洞宾」的故事。传说他有个朋友叫苟杳，被人欺负吕洞宾帮他出头。后来苟杳发达了，吕洞宾装穷去试探，苟杳不收留，吕洞宾叹「苟杳狗咬吕洞宾」——后来传成「狗咬吕洞宾」。',
img:'Chinese ink wash painting of Lyu Dongbin the immortal swordsman with wine gourd and sword, free-spirited and witty, sumi-e style with flowing brush lines, portrait',
aid:{name:'天遁剑诀',type:'nuke',mult:2.5,desc:'相熟两连击，信重沉睡控制加伤害，莫逆大伤灼烧，本体多段核弹灼烧震骇。'},
gifts:{loved:['hulu'],liked:['taomu'],disliked:['xiangzhu']}},
he_xiangu:{name:'何仙姑',title:'荷仙姑',icon:'荷',tier:'C',camp:'民间',path:'sheng',unlock:{ch:3},gh:'s_hexiang',
intro:'八仙中唯一女仙，持荷行世，主清净疗愈与女子采桑织之愿，清净温软偶带机锋，以竹罩投水渡海，荷花池近年被天庭征水。',
  sources:'宋《集仙传》（已佚，见《续通考》转引）；《太平广记》引《广异记》；明《东游记》',
  story:'何仙姑是八仙里唯一的女性。传说本是湖南零陵姑娘，十三岁在溪边碰见道士给她桃吃，吃了就成仙。常提装有蟠桃的花篮在人间行善，专治难产和妇女病。民间有「何仙姑送子」的说法。',
img:'Chinese ink wash painting of He Xiangu the lotus immortal holding a lotus petal, pure and gentle, sumi-e style with pink lotus and ink wash, portrait',
aid:{name:'荷露',type:'heal',heal:0.35,desc:'相熟治疗，信重净化持续回血，莫逆全队盾加闪避，本体大疗大盾反弹护罩。'},
gifts:{loved:['puti'],liked:['panta'],disliked:['hulu']}},
dian_mu:{name:'电母',title:'秀天君',icon:'电',tier:'C',camp:'天庭',path:'fa',unlock:{ch:3},gh:'f_dianmu',
intro:'雷部掌电之神，双镜放光为雷公雷祖司掌前引，端方利落精确到刻板，镜不留情也不撒谎，照见一座座被切空的庙。',
quote:'先照，后劈——这是规矩。镜中照见什么，本君不替谁遮掩。',
  sources:'《元史·舆服志》（电母旗）；《道法会元》；《西游记》第四十五回',
  story:'电母是雷公老婆，负责打闪电。传说本是瞎子的女儿，雷公打雷时不小心劈了她爹，后来上天做电母专门提醒——「先闪电再打雷，免得劈错好人」。所以现在都是先闪电后打雷。',
img:'Chinese ink wash painting of the Lightning Goddess holding two mirrors radiating light, poised and precise, sumi-e style with electric blue and silver accents, portrait',
aid:{name:'镜光一闪',type:'vuln',mult:1.8,vuln:0.5,rounds:2,desc:'相熟雷伤加易伤，信重震骇打断加雷伤，莫逆群雷伤眩晕，本体群雷核弹眩晕灼烧。'},
gifts:{loved:['xiangzhu'],liked:['panta'],disliked:['hulu']}},
zhao_gongming:{name:'赵公明',title:'武财神',icon:'赵',tier:'B',camp:'天庭',path:'bing',unlock:{ch:4},gh:'b_zhaogong',
intro:'武财神玄坛元帅，率招宝纳珍招财利市四神主公平之财与驱雷驭役，旧瘟神出身，最懂被天庭定义再被香火改写的价码。',
quote:'钱财的事好说——本帅早年管的，可是要命的买卖。',
  sources:'晋·干宝《搜神记》；《太上洞渊神咒经》；《真诰》；《封神演义》第四十七、五十一、九十九回',
  story:'赵公明本是瘟神，后来被道教收编变成武财神。他手拿黑鞭，骑黑虎。有四个手下：招宝、纳珍、招财、利市——合起来叫「五路财神」。过年贴的财神画，武财神是他，文财神是比干。',
img:'Chinese ink wash painting of Zhao Gongming the military wealth god on a black tiger with iron whip, opulent and shrewd, sumi-e style with gold and black accents, portrait',
aid:{name:'铁鞭扫',type:'nuke',mult:2.6,desc:'相熟重击破甲，信重流血连击，莫逆群伤群易伤，本体核弹缴械并战后掉宝提升。'},
gifts:{loved:['puti'],liked:['panta'],disliked:['taomu']}},
wen_chang:{name:'文昌帝君',title:'文昌帝君',icon:'昌',tier:'B',camp:'天庭',path:'fa',unlock:{ch:4},gh:'f_wenchang',
intro:'掌天下文运功名禄籍桂籍榜册，读书人的头顶上司，梓潼神与文昌六星合流，骑白特侍天聋地哑，天庭亲信掌禄籍。',
quote:'禄籍榜册都在本君案头；只是身边这两位，一个听不见，一个说不出。',
  sources:'《华阳国志》；《北梦琐言》；《明史·礼志》；《文昌帝君阴骘文》',
  story:'文昌帝君本是文昌星，后来人格化成张亚子。传说东晋时四川人，战死沙场后被封为文昌帝君，专管科举。旁边总跟着「天聋」「地哑」两个童子——天机不可泄露，所以一个聋一个哑。',
img:'Chinese ink wash painting of Wenchang the literature god riding a white mule with brush and scroll, elegant and scholarly, sumi-e style with indigo and gold, portrait',
aid:{name:'朱笔点斗',type:'vuln',mult:1.9,vuln:0.5,rounds:2,desc:'相熟易伤加命中，信重群沉默，莫逆全队暴击回能，本体群易伤并禁用援助法术。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['hulu']}},
ma_zu:{name:'妈祖',title:'天上圣母',icon:'妈',tier:'B',camp:'民间',path:'sheng',unlock:{ch:4},gh:'s_mazu',
intro:'海神主海上救难护航济溺，闽海舟船与漕运的命，林默娘乘席渡海专济海难，民命海难为上，削藩动她先动民心。',
quote:'海上风再大，灯亮着，人，便要回来。',
  sources:'《敕封天后志》；《圣墩祖庙重建顺济庙记》（宋·廖鹏飞）；《元史·祭祀志》；历朝封诰',
  story:'妈祖本名林默娘，福建莆田人。她能「神游」海上预知风暴。有次听说父亲出海遇风暴，神游去救，可惜救不了父亲自己也去了。死后湄洲岛建庙祭祀，从宋朝一路封到「天妃」「天后」「天上圣母」。',
img:'Chinese ink wash painting of Mazu the sea goddess in flowing robes by a lantern tower over stormy waves, compassionate and calm, sumi-e style with sea blue accents, portrait',
aid:{name:'神灯引',type:'heal',heal:0.40,desc:'相熟治疗夜间加成，信重全队护盾减伤，莫逆群显形易伤，本体大盾免死持续回血。'},
gifts:{loved:['wugu'],liked:['xiangzhu'],disliked:['panta']}},
guan_yu:{name:'关羽',title:'关圣帝君',icon:'关',tier:'B',camp:'民间',path:'bing',unlock:{ch:4},gh:'b_wusheng',
intro:'武圣主忠义伏魔武运与江湖商贾信义，三教共尊，傲上而不忍下，青龙偃月水淹七军威震华夏，头枕洛阳身卧当阳唯义是从。',
  sources:'《三国志·蜀书·关羽传》；《佛祖统纪》（智者大师玉泉显圣）；《三国演义》；历朝封号',
  story:'关羽三国名将，死后被佛教、道教、民间同时供奉。佛教尊他伽蓝菩萨，道教尊关圣帝君，民间尊武圣。核心精神是「义」——千里走单骑护嫂嫂、华容道义释曹操。黑白两道都拜他。',
img:'Chinese ink wash painting of Guan Yu the martial saint with red face and long beard holding the Green Dragon Crescent Blade, proud and righteous, sumi-e style with cinnabar accents, portrait',
aid:{name:'偃月一刀',type:'nuke',mult:2.7,desc:'相熟强攻重击，信重暴击增益，莫逆群伤减速，本体核弹群震骇并处决低血。'},
gifts:{loved:['hulu'],liked:['mozhen'],disliked:['panta']}},
wang_lingguan:{name:'王灵官',title:'三五火车',icon:'灵',tier:'B',camp:'天庭',path:'fa',unlock:{ch:4},gh:'f_lingguan',
intro:'道教五百灵官之首，镇天下名山山门第一进，主纠劾天上地下一切邪伪，刚正暴烈疾恶如仇，天庭纪律化身，相爷一切绕开他。',
quote:'本王这三只眼里，神仙和妖邪，走的是同一道闸。',
  sources:'明《三教搜神大全》；《列仙全传》（萨守坚、王善）；《西游记》第七回；《明史·礼志》',
  story:'王灵官本名王恶，北宋长沙人。死后被道教收编成天庭「纠察御史」——专管众神有没有犯错。手拿金鞭脚踏风火轮，额头有第三只眼。送他「桃木如意」他会很高兴——他最讨厌邪祟。',
img:'Chinese ink wash painting of Marshal Wang Lingguan with red face and third eye holding a golden whip, fierce and just, sumi-e style with fire red and gold, portrait',
aid:{name:'金鞭一指',type:'nuke',mult:2.6,desc:'相熟雷伤打断，信重群灼冲锋震骇，莫逆群打断加反伤盾，本体群雷核弹定身反伤。'},
gifts:{loved:['taomu'],liked:['xiangzhu'],disliked:['hulu']}},
zeng_zhang:{name:'增长天王',title:'增长天王',icon:'增',tier:'B',camp:'释门',path:'fa',unlock:{ch:4},gh:'f_tianwang',
intro:'四大天王之一护南赡部洲令善根增长掌风，魔礼青执青云剑剑锋无鞘，令行禁止的天庭受调护法，忠于合同与排班。',
  sources:'《长阿含经》《金光明经》；《陀罗尼集经》；《封神演义》第四十、九十九回',
  story:'增长天王是四大天王之一，佛教护法神也被道教收编。名字叫「毗楼勒叉」，汉译「增长」——令众生增长善根。手拿宝剑守护南方。四大天王寓意「风调雨顺」，持剑增长代表「风」。',
img:'Chinese ink wash painting of the Growth Heavenly King Virudhaka with blue body holding a sword, majestic and martial, sumi-e style with azure and gold armor, portrait',
aid:{name:'青云剑·风',type:'vuln',mult:1.8,vuln:0.5,rounds:2,desc:'相熟群伤加易伤，信重全队攻防增益，莫逆群灼风刃，本体风火群核弹击退震骇。'},
gifts:{loved:['taomu'],liked:['xiangzhu'],disliked:['hulu']}},
duo_wen:{name:'多闻天王',title:'多闻天王',icon:'闻',tier:'B',camp:'释门',path:'fa',unlock:{ch:4},gh:'f_tianwang',
intro:'四大天王之一护北俱芦洲以福德名闻四方，掌雨伞财施，魔礼红持混元珠伞，四天王里最懂代价的护法，管过边塞见过弃子。',
  sources:'《长阿含经》《毗沙门天王经》；《大唐西域记》（于阗护国）；《封神演义》',
  story:'多闻天王是四大天王之首，佛教叫「毗沙门」。手拿伞（或幢幡），怀里抱着「吐宝鼠」能吐金银。本是印度神，传到中国成财神之一，又演变成托塔李天王。',
img:'Chinese ink wash painting of the Vaishravana Heavenly King with green body holding a precious umbrella and jewel-spitting mongoose, composed and worldly, sumi-e style, portrait',
aid:{name:'伞盖轻旋',type:'shield',shield:0.38,desc:'相熟全队小盾，信重驱散增益缴械，莫逆群伤致盲，本体群控2回合并吸增益转大盾。'},
gifts:{loved:['puti'],liked:['mozhen'],disliked:['hulu']}},
qin_guang:{name:'秦广王',title:'一殿秦广',icon:'秦',tier:'B',camp:'地府',path:'you',unlock:{ch:3},gh:'y_qinguang',
intro:'十殿第一殿接引亡魂初判善恶，善人超升恶者照孽镜后分发诸狱，精明客气程式化疲劳的幽冥前台，批送十殿的笔很快。',
quote:'初到是吧？善恶单在那边填，笔自取——莫急，都得排。',
  sources:'《玉历宝钞》（清传本）；《集说诠真》；《阎王经》系统',
img:'Chinese ink wash painting of King Qin Guang first hall of the underworld holding a brush and ledger, shrewd and tired, sumi-e style with dark robes, portrait',
aid:{name:'销牒朱笔',type:'percent',pct:0.32,desc:'相熟单体真伤，信重显形加易伤，莫逆群定身，本体群显形群易伤加大真伤。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['panta']}},
yan_luo:{name:'阎罗王',title:'五殿阎罗',icon:'阎',tier:'B',camp:'地府',path:'you',unlock:{ch:4},gh:'y_yanluo',
intro:'五殿阎罗王掌叫唤大地狱与十六诛心小狱审喊冤之鬼，因哀怜屈死屡放亡魂还阳被降调，玩家顶头上司，自身难保。',
quote:'喊冤的先领号——本王自己，也还在队里排着呢。',
  sources:'《洛阳伽蓝记》；《隋书·韩擒虎传》；《玉历宝钞》；元杂剧、《三侠五义》（包拯）',
img:'Chinese ink wash painting of King Yama fifth hall with black face and crescent mark holding a scepter,威严 and weary, sumi-e style with deep purple and black, portrait',
aid:{name:'狱火惊堂',type:'percent',pct:0.33,desc:'相熟真伤，信重大真伤禁疗，莫逆群震骇加真伤，本体核弹真伤加禁疗场域2回合。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['panta']}},
zhuan_lun:{name:'转轮王',title:'十殿转轮',icon:'轮',tier:'B',camp:'地府',path:'you',unlock:{ch:4},gh:'y_zhuanlun',
intro:'十殿之末核定胎卵湿化男女贵贱发六道投生，给每个灵魂留最后一程体面的送站老人，十万游魂堵在轮回门前不是他的错。',
  sources:'《玉历宝钞》；《集说诠真》；敦煌写本《十王经》',
img:'Chinese ink wash painting of the Wheel-Turning King tenth hall turning the six-realm wheel, gentle and patient, sumi-e style with muted gold and grey, portrait',
aid:{name:'轮回簿翻',type:'debuff',atk:-0.2,def:-0.2,rounds:2,desc:'相熟降攻防2回合，信重治疗净化，莫逆随机控制，本体清增益清CD并复活一人。'},
gifts:{loved:['puti'],liked:['wugu'],disliked:['taomu']}},
ao_guang:{name:'敖广',title:'东海龙王',icon:'敖',tier:'B',camp:'天庭',path:'fa',unlock:{ch:4},gh:'f_aoguang',
intro:'四海水族之长领巡海夜叉虾兵蟹将司兴云布雨，招安派老狐狸，想给东海洋下一场不必请旨的雨，三太子被哪吒抽了筋。',
quote:'下雨，得请旨；你这桩小事嘛——寡王先「研究研究」。',
  sources:'《西游记》第三、十、四十一回等；《封神演义》（敖光）；《酉阳杂俎》；唐《祠令》封四海龙王',
img:'Chinese ink wash painting of the Dragon King Ao Guang in dragon robes with coral crown, aged and diplomatic, sumi-e style with sea blue and jade green, portrait',
aid:{name:'雨簿一点',type:'burn',mult:1.3,burnPct:0.5,burnRounds:3,desc:'相熟群水伤减速，信重缠绕控制加水伤，莫逆重击加群水伤，本体水雷群核弹缠绕破防。'},
gifts:{loved:['puti'],liked:['panta'],disliked:['taomu']}},
zhong_yue:{name:'中岳大帝',title:'中天崇圣',icon:'嵩',tier:'B',camp:'天庭',path:'sheng',unlock:{ch:4},gh:'s_zhongyue',
intro:'中岳嵩山之神居天下之中主土地山川陵台与地脉消长，五岳分权削藩受害者，地脉空心化被动中枢，教井神假装自己还满着。',
  sources:'《礼记·王制》五岳祀；《山海经·中次七经》；《旧唐书·礼仪志》；《宋史·礼志》；《五岳真形图》',
img:'Chinese ink wash painting of the Central Sacred Mountain Emperor on Mount Song with flowing robes, heavy and ancient, sumi-e style with earthy green and stone grey, portrait',
aid:{name:'岳影为屏',type:'shield',shield:0.40,desc:'相熟减伤护盾，信重群真伤减速，莫逆大减伤反伤，本体群真伤眩晕加地脉回血。'},
gifts:{loved:['xiangzhu'],liked:['wugu'],disliked:['hulu']}},
er_lang:{name:'二郎神',title:'清源真君',icon:'戬',tier:'A',camp:'天庭',path:'bing',unlock:{ch:4},gh:'b_qingyuan',
intro:'昭惠灵显王领梅山七圣一千二百草头神，听调不听宣的灌江口割据强神，斧劈桃山救母担山逐日，削藩首要对象。',
quote:'调令，本君接了；宣么？灌江口的庙门，从不朝那个方向开。',
  sources:'《西游记》第六回；《二郎宝卷》（明）；《封神演义》第四十回起；李冰次子、隋赵昱诸说并存',
img:'Chinese ink wash painting of Erlang Shen Yang Jian with third eye holding a three-pointed double-edged blade, proud and cold-humored, sumi-e style with silver and cinnabar, portrait',
aid:{name:'三尖两刃',type:'nuke',mult:3.3,desc:'相熟三连击，信重流血锁足，莫逆闪避化巨像反击，本体多段核弹破防无视假身。'},
gifts:{loved:['hulu'],liked:['taomu'],disliked:['panta']}},
ne_zha:{name:'哪吒',title:'三坛海会',icon:'吒',tier:'A',camp:'天庭',path:'bing',unlock:{ch:4},gh:'b_santan',
intro:'中坛元帅三坛海会大神领天将降妖，莲花化身的天庭旧逆，剔骨还父割肉还母后，对神格被切有生理性共情，最共情玩家。',
  sources:'《三教源流搜神大全》；《西游记》第三、四、八十三回；《封神演义》第十二回起',
img:'Chinese ink wash painting of Nezha the lotus child deity with fire wheels and red armillary sash holding fire-tipped spear, fierce and youthful, sumi-e style with vermilion and gold, portrait',
aid:{name:'乾坤圈·砸',type:'burn',mult:1.4,burnPct:0.55,burnRounds:3,desc:'相熟重击灼烧，信重群连击灼烧，莫逆莲花复活一次，本体六段核弹群灼烧震骇。'},
gifts:{loved:['taomu'],liked:['panta'],disliked:['xiangzhu']}},
zhen_wu:{name:'真武大帝',title:'玄天上帝',icon:'武',tier:'A',camp:'天庭',path:'fa',unlock:{ch:5},gh:'f_zhenwu',
intro:'北极镇天真武玄天上帝披发跣足踏龟蛇，统北方收天下妖魔的荡魔天尊，不争香火不抗调令，三方都想请而不敢硬请的砝码。',
quote:'魔，本帝来荡。其余的话——龟蛇不会说，本帝也不说。',
  sources:'《三教源流搜神大全》；《玄天上帝启圣录》；《明史·礼志》；宋赵彦卫《云麓漫钞》',
img:'Chinese ink wash painting of the True Martial Emperor with loose hair and bare feet stepping on turtle and snake, holding the Big Dipper sword, silent and majestic, sumi-e style, portrait',
aid:{name:'七星剑影',type:'nuke',mult:3.0,desc:'相熟雷水重击，信重缠绕减速2回合，莫逆群雷水震骇，本体群核弹对妖魔追加真伤。'},
gifts:{loved:['taomu'],liked:['xiangzhu'],disliked:['hulu']}},
lei_zu:{name:'雷祖',title:'普化天尊',icon:'雷',tier:'A',camp:'天庭',path:'fa',unlock:{ch:4},gh:'f_leizu',
intro:'雷部至尊统三十六雷主天之祸福物之权衡，掌物掌人司生司杀，闻仲绝龙岭封神，雷部被工单淹没，要劈的是发令的人。',
  sources:'《九天应元雷声普化天尊玉枢宝经》；《明史·礼志》；《道法会元》；《封神演义》第九十九回（闻仲）',
img:'Chinese ink wash painting of the Thunder Ancestor Wen Zhong with third eye and twin whips riding a qilin, dignified old minister, sumi-e style with purple lightning and gold, portrait',
aid:{name:'五雷正法',type:'nuke',mult:3.4,desc:'相熟大雷伤打断，信重群雷伤灼烧，莫逆残血处决，本体全屏雷核弹眩晕禁疗核验罪名。'},
gifts:{loved:['xiangzhu'],liked:['taomu'],disliked:['wugu']}},
xi_yue:{name:'西岳大帝',title:'金天顺圣',icon:'华',tier:'A',camp:'天庭',path:'sheng',unlock:{ch:4},gh:'s_xiyue',
intro:'西岳华山之神西方属金主五金矿藏飞禽走兽陶铸坑冶之利，守着满山不能换香火自保的金子，三圣母被压华山西峰的旧账。',
  sources:'《礼记·王制》；《龙鱼河图》；《旧唐书·礼仪志》；《宋史·礼志》；《五岳真形图》；《沉香宝卷》（劈山救母附会）',
img:'Chinese ink wash painting of the Western Sacred Mountain Emperor of Mount Hua in golden robes, aloof and noble-weary, sumi-e style with gold and stone grey, portrait',
aid:{name:'金锋一线',type:'nuke',mult:2.9,desc:'相熟破防重击，信重全队厚盾，莫逆群伤群易伤，本体真伤核弹加易伤禁疗2回合。'},
gifts:{loved:['puti'],liked:['xiangzhu'],disliked:['hulu']}},
xuan_nv:{name:'九天玄女',title:'九天玄女',icon:'玄',tier:'A',camp:'上古',path:'fa',unlock:{ch:5},gh:'f_xuannv',
intro:'上古兵主与术数之祖，传奇门遁甲六壬兵符，于天命将倾时只授破局者的西王母座前传法人，授黄帝破蚩尤、宋江三卷天书。',
  sources:'《诗经·商颂·玄鸟》；《黄帝内经》（传本）；《云笈七签·九天玄女传》；《广黄帝本行记》；《水浒传》第四十二回',
img:'Chinese ink wash painting of the Mysterious Lady of the Ninth Heaven on a phoenix holding scrolls and talismans, cold and transcendent, sumi-e style with dark teal and silver, portrait',
aid:{name:'六壬课',type:'vuln',mult:2.0,vuln:0.5,rounds:2,desc:'相熟易伤看破意图，信重全队闪避先手，莫逆剑阵群伤，本体打断群易伤并全队CD归零。'},
gifts:{loved:['mozhen'],liked:['puti'],disliked:['wugu']}},
guan_yin:{name:'观音菩萨',title:'大慈大悲',icon:'观',tier:'A',camp:'释门',path:'sheng',unlock:{ch:5},gh:'s_guanyin',
intro:'寻声救苦随类化现的大悲菩萨三十三身，手持净瓶杨柳，落伽山潮音洞听三界哭号，净瓶甘露能起死回生，慈悲不站队。',
quote:'哪一处有哭声，哪一处，便是南海。',
  sources:'《妙法莲华经·观世音菩萨普门品》《大悲心陀罗尼经》；《华严经》；《香山宝卷》（妙善公主）；《西游记》',
img:'Chinese ink wash painting of Guanyin the compassionate bodhisattva holding a willow branch and pure vase, serene and merciful, sumi-e style with soft jade white and gold, portrait',
aid:{name:'杨枝甘露',type:'heal',heal:0.42,desc:'相熟大额治疗，信重复活一人，莫逆全队大盾全净化，本体满疗复活全员免控免灼。'},
gifts:{loved:['puti'],liked:['xiangzhu'],disliked:['hulu']}},
di_zang:{name:'地藏王菩萨',title:'大愿地藏',icon:'藏',tier:'A',camp:'释门',path:'sheng',unlock:{ch:5},gh:'s_dizang',
intro:'幽冥教主地狱未空誓不成佛度尽六道罪苦众生的大愿菩萨，章5给玩家关键提示的九华山法主，问要救神还是救造狱的机器。',
  sources:'《地藏菩萨本愿经》；《大乘大集地藏十轮经》；唐《九华山化成寺记》（金乔觉）；《西游记》第三回、五十八回（谛听）',
img:'Chinese ink wash painting of Ksitigarbha bodhisattva with monk staff and wish-fulfilling pearl, gentle and vow-deep, sumi-e style with gold and muted red, portrait',
aid:{name:'谛听伏地',type:'vuln',mult:1.9,vuln:0.5,rounds:2,desc:'相熟看破群显形易伤，信重治疗对鬼真伤，莫逆全队盾阵亡反弹，本体鬼类持续真伤禁疗。'},
gifts:{loved:['puti'],liked:['xiangzhu'],disliked:['taomu']}},
wei_tuo:{name:'韦驮',title:'护法韦驮',icon:'韦',tier:'A',camp:'释门',path:'bing',unlock:{ch:5},gh:'b_weituo',
intro:'四大天王部下三十二将之首，护持僧伽佛法守护佛舍利的护法总神，山门内最后一个动手的神，一杵一个准，只奉法旨。',
  sources:'《长阿含经》；《大藏经·护法篇》（韦驮天/Skanda）；《金光明经》；《封神演义》韦护',
img:'Chinese ink wash painting of Skanda the protector deity in youthful armor holding a vajra pestle upright, disciplined and solemn, sumi-e style with gold and saffron, portrait',
aid:{name:'降魔杵影',type:'nuke',mult:3.1,desc:'相熟重击对魔加成，信重全队嘲讽大盾，莫逆贯穿连击打断，本体核弹对魔处决加免控盾。'},
gifts:{loved:['taomu'],liked:['puti'],disliked:['hulu']}},
sun_wukong:{name:'孙悟空',title:'斗战胜佛',icon:'猴',tier:'S',camp:'妖仙',path:'bing',unlock:{ch:5},gh:'b_douzhan',
intro:'花果山美猴王齐天大圣斗战胜佛，前半生反了两次天取了一趟经的石猴，削藩受害者花果山余部线，成佛后头上金箍没人收走过。',
  sources:'《西游记》（全书，第一、四、七回为主）；《大唐三藏取经诗话》；元杂剧《二郎神锁齐天大圣》',
img:'Chinese ink wash painting of Sun Wukong the Monkey King with golden headband and staff, irreverent and sharp-eyed, sumi-e style with dynamic cinnabar strokes, portrait',
aid:{name:'如意金箍棒',type:'nuke',mult:4.2,desc:'相熟三段重击，信重看破群易伤，莫逆分身群攻，本体全屏多段核弹灼烧震骇。'},
gifts:{loved:['panta'],liked:['hulu'],disliked:['xiangzhu']}},
feng_du:{name:'酆都大帝',title:'北阴大帝',icon:'酆',tier:'S',camp:'地府',path:'you',unlock:{ch:5},gh:'y_fengdu',
intro:'天下鬼神之宗治罗酆山统北阴六天宫三千年一替的幽冥旧主，被外包总署征作账房的被架空旧神，决定三千年一替还算不算数。',
  sources:'南朝·陶弘景《真灵位业图》第七中位；《枕中书》；《真诰》；葛洪《神仙传》（王方平、阴长生）',
img:'Chinese ink wash painting of the Great Emperor of Fengdu in ancient dark robes before six ghost palaces, aged and tired of power, sumi-e style with black and bronze, portrait',
aid:{name:'罗酆令',type:'percent',pct:0.40,desc:'相熟真伤对神加成，信重群减攻减速，莫逆群真伤削弱，本体全屏核弹封印援助并满复活。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['panta']}},
dong_yue:{name:'东岳大帝',title:'天齐仁圣',icon:'泰',tier:'S',camp:'地府',path:'you',unlock:{ch:5},gh:null,
intro:'五岳之首天帝之孙主召人魂魄定人生死贵贱，幽冥地府十八重地狱总领，被相爷借名架空的生死总领，用朕的名收天下人的命。',
  sources:'《风俗通义》；《博物志》；《旧唐书·礼仪志》；《宋史·礼志》；《封神演义》第九十九回；《五岳真形图》',
img:'Chinese ink wash painting of the Eastern Sacred Mountain Emperor of Mount Tai in imperial robes holding the book of life and death,沉重 and regal-weary, sumi-e style with jade and imperial gold, portrait',
aid:{name:'天齐符',type:'percent',pct:0.38,desc:'相熟真伤加易伤，信重减伤领域，莫逆血线越低越锁定，本体全屏真伤核弹封复活治疗。'},
gifts:{loved:['xiangzhu'],liked:['wugu'],disliked:['panta']}},
xi_wangmu:{name:'西王母',title:'瑶池金母',icon:'母',tier:'S',camp:'上古',path:'sheng',unlock:{ch:5},gh:null,
intro:'女仙之首居昆仑玉山瑶池掌不死药与蟠桃，司天之厉及五残的上古大神，终章瑶池叙功宴立场戏的旧贵之首，见过穆天子与汉武帝。',
  sources:'《山海经·西山经·大荒西经》；《穆天子传》；《汉武帝内传》《汉武故事》；《枕中书》；《西游记》',
img:'Chinese ink wash painting of the Queen Mother of the West in noble robes beside jade lake with peaches, poised and看透一切, sumi-e style with jade green and mother-of-pearl, portrait',
aid:{name:'三青传信',type:'vuln',mult:2.1,vuln:0.5,rounds:2,desc:'相熟看破易伤，信重回血微盾，莫逆群沉默减速，本体复活群定身或真伤核弹禁疗。'},
gifts:{loved:['panta'],liked:['puti'],disliked:['taomu']}}
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
const FUSIONS=[
{out:'fz_qitian',in:['b_douzhan','b_bingzhu'],cost:1800,rate:0.50,src:'quest',ch:1},
{out:'fz_xianfeng',in:['b_santan','b_wusheng'],cost:1200,rate:0.60,src:'shop',ch:2},
{out:'fz_fumo',in:['f_leizu','f_zhenwu'],cost:1800,rate:0.50,src:'quest',ch:3},
{out:'fz_liujia',in:['f_tianwang','f_xuannv'],cost:1200,rate:0.55,src:'shop',ch:4},
{out:'fz_zhuihun',in:['y_wuchang','y_zhongkui'],cost:1000,rate:0.55,src:'shop',ch:5},
{out:'fz_zhongshen',in:['y_yanluo','y_fengdu'],cost:1800,rate:0.50,src:'quest',ch:6},
{out:'fz_wanya',in:['h_zhurong','h_luoxuan'],cost:1600,rate:0.55,src:'shop',ch:7},
{out:'fz_niepan',in:['h_huaguang','h_zhuque'],cost:1200,rate:0.55,src:'quest',ch:8},
{out:'fz_suopo',in:['s_guanyin','s_dizang'],cost:1800,rate:0.50,src:'quest',ch:9},
{out:'fz_cihangduhai',in:['s_mazu','s_bixia'],cost:1000,rate:0.60,src:'shop',ch:10},
{out:'fz_lianyu',in:['y_cuijue','h_luoxuan'],cost:1500,rate:0.40,src:'quest',ch:11},
{out:'fz_tianbing',in:['b_douzhan','f_zutianshi'],cost:1500,rate:0.40,src:'quest',ch:12},
{out:'fz_sheshen',in:['s_dizang','y_mengpo'],cost:800,rate:0.25,src:'quest',ch:13},
{out:'fz_danlu',in:['h_huoling','s_yaowang'],cost:900,rate:0.45,src:'quest',ch:14}
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
    hp: 1450,
    atk: 95,
    def: 40,
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
    hp: 1380,
    atk: 110,
    def: 32,
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
    hp: 1650,
    atk: 88,
    def: 48,
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
    hp: 1300,
    atk: 100,
    def: 30,
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
    hp: 1500,
    atk: 120,
    def: 26,
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
    hp: 2400,
    atk: 140,
    def: 48,
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
    hp: 680,
    atk: 68,
    def: 30,
    weak: ['you'],
    resist: {},
    intent: 'xu',
    traits: {
      tags: ['远程朱批', '断线窗口'],
      phases: 2,
      divineReduce: 0.5,
      special: '神位减伤常规-50%；代笔：所有攻击由天庭远程执笔，朱批凌空蓄力后笔落为真实伤害(无视玩家护盾)，只能闪避或震骇执笔的线；HP50%朱线断裂，瘫软两回合易伤+无神位减伤(唯一全力输出窗口)，随后重连ATK+20%'
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
    hp: 1100,
    atk: 85,
    def: 40,
    weak: ['you'],
    resist: {},
    intent: 'mixed',
    traits: {
      tags: ['两阶段', '公文战法'],
      phases: 2,
      divineReduce: 0.5,
      special: '阶段一天曹主事：HP1100/ATK85/DEF40，公文战法以工单形式提前一回合送达——驳回(封印主动技2回合)、记过(三次本场攻-20%)、发还原籍(清空神力)，守势偏好；阶段二假面撕脸：满状态复活HP900/ATK115/DEF22，神位减伤消失，普攻连击，免疫震骇一次/三回合，召唤失神小吏两只，强攻偏好'
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
    hp: 3000,
    atk: 130,
    def: 45,
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
  /* 礼物（七样白名单，诸神偏好见 GODS[g].gifts；loved+18 / liked+8 / 忌讳+1 / 其余+4） */
  taomu:   { name:'桃木如意', slot:'gift', grade:'凡品', price:150, icon:'桃', desc:'老桃木雕的小如意，平实讨喜，各路神明都不至于嫌弃。' },
  wugu:    { name:'五谷福袋', slot:'gift', grade:'凡品', price:200, icon:'谷', desc:'新粟新稻缝成的福袋，盛满人间烟火气。' },
  xiangzhu:{ name:'龙涎香烛', slot:'gift', grade:'凡品', price:180, icon:'烛', desc:'一燃便满殿生香，衙门里的神明都吃这一套。' },
  mozhen:  { name:'徽墨「铁斋」', slot:'gift', grade:'灵品', price:300, icon:'墨', desc:'一两徽墨一两银。判官们案头最缺的就是这个。' },
  panta:   { name:'蟠桃（次品）', slot:'gift', grade:'灵品', price:320, icon:'果', desc:'瑶池挑剩的次品，但猴子才不管品相。' },
  hulu:    { name:'杏仁酒葫芦', slot:'gift', grade:'灵品', price:340, icon:'酒', desc:'装着杏花酿的小葫芦，严肃的神明多半摇头，爱酒的神仙两眼放光。' },
  puti:    { name:'金菩提', slot:'gift', grade:'宝品', price:600, icon:'菩', desc:'菩提树顶摘的金果，佛门至宝。' },
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
  { name:'从八品·阴阳差役',        slots:4, shelf:4, soldiers:2, facCap:6,  tierCap:'D' },
  { name:'八品·两界巡按',          slots:4, shelf:5, soldiers:2, facCap:8,  tierCap:'C' },
  { name:'从七品·主簿',            slots:5, shelf:5, soldiers:3, facCap:10, tierCap:'B' },
  { name:'七品·判官',              slots:5, shelf:6, soldiers:4, facCap:13, tierCap:'B' },
  { name:'从六品·推官',            slots:6, shelf:7, soldiers:5, facCap:16, tierCap:'A' },
  { name:'六品·刑曹',              slots:6, shelf:8, soldiers:6, facCap:19, tierCap:'A' },
  { name:'从五品·酆都判官中丞',    slots:7, shelf:9, soldiers:8, facCap:22, tierCap:'A' },
  { name:'五品·阴司少卿',          slots:8, shelf:10,soldiers:10,facCap:25, tierCap:'S' },
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
  {type:'battle',enemy:'zhisha',name:'逃役黑差',scale:1.05},
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
  {type:'battle',enemy:'youhun',name:'无业野魂',scale:1.1},
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
  {type:'battle',enemy:'guiwang',name:'枉死鬼王',scale:0.85},
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
  {type:'battle',enemy:'kongqipanguan',name:'壳神傀儡',scale:0.8}
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
  {type:'battle',enemy:'youhun',name:'田埂执念魂',scale:1.05},
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
  {type:'battle',enemy:'zhisha',name:'火灵童子',scale:0.95},
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
  {type:'battle',enemy:'zhisha',name:'墨柜鬼',scale:1},
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
  {type:'battle',enemy:'changgui',name:'反噬阴差',scale:1.1},
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
  {type:'battle',enemy:'xishenxiaoli',name:'省油小车吏',scale:1.1}
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
  {type:'battle',enemy:'youhun',name:'冒牌假差',scale:1.15},
  {type:'event',text:'三证并勘：假阴神知道巡路时辰、签文格式，唯独背不出城隍亲定的暗口令——内鬼就在城隍案下。',
   choices:[
    {t:'当堂指认书吏',r:{flags:{flag_know_truth:1},log:'书吏被天曹许了「转正神格」，被逼入绝路，放出一具试用壳神！'}},
    {t:'打草惊蛇，先拿外围',r:{flags:{flag_ruthless:1},log:'书吏携册逃入枉死城，你没能拦住。'}},
    {t:'收下书吏的买路钱',r:{money:150,erode:5,flags:{flag_ruthless:1},log:'真神蒙冤，城隍辖区又丢了六个魂。'}}
   ]},
  {type:'battle',enemy:'kongqipanguan',name:'冠神',scale:0.7},
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
  {type:'battle',enemy:'xishenxiaoli',name:'天库库鬼',scale:1.1},
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
  {type:'battle',enemy:'changgui',name:'疫鬼',scale:1.05},
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
  {type:'battle',enemy:'kongqipanguan',name:'幻中朱衣',scale:0.7},
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
  {type:'battle',enemy:'kongqipanguan',name:'天曹贴房',scale:0.85},
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
  {type:'battle',enemy:'xishenxiaoli',name:'贡道天差',scale:1.2},
  {type:'battle',enemy:'kongqipanguan',name:'赑屃形壳兽',scale:0.8},
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
  {type:'battle',enemy:'kongqipanguan',name:'封条化形·合规',scale:0.85},
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
  {type:'battle',enemy:'xishenxiaoli',name:'库栈库卒',scale:1},
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
   {type:'battle',enemy:'kongqipanguan',name:'空卯功曹',scale:0.75},
   {type:'event',text:'三名空卯功曹被你一一戳破，王灵官的雷符在工单架上烧出两个字：深查。',
    choices:[{t:'明日再查考功法名册',r:{log:'这一夜你先歇下。'}}]}
  ]},
  {title:'深查·考功法名册',nodes:[
   {type:'event',text:'按《考功法》反查：被「异地提拔」的功曹共二十七名，替换路径都通向同一家「点卯代办铺」。',
    choices:[{t:'按图索骥，再点一名',r:{log:'又一道空卯在你面前炸成纸灰。'}}]},
   {type:'battle',enemy:'kongqipanguan',name:'空卯功曹',scale:0.85},
   {type:'event',text:'代办铺的幌子在雷云下晃着，掌柜的戴着半张功曹面具。',
    choices:[{t:'直闯代办铺',r:{log:'明日便是收网之时。'}}]}
  ]},
  {title:'代办铺·扳到哪一层',nodes:[
   {type:'battle',enemy:'kongqipanguan',name:'点卯代办铺掌柜',scale:0.95},
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
   {type:'battle',enemy:'dafeng',name:'鱼精哨',scale:0.9}
  ]},
  {title:'二汛·溃堤抢修',nodes:[
   {type:'event',text:'江堤溃口，白浪蛟将裹着藤甲水压而来，兵系重击与火德烧甲是破防关键。',
    choices:[{t:'抢堵决口，迎战蛟将',r:{log:'蛟将立起半身，浪比庙高。'}}]},
   {type:'game',game:'lights',difficulty:2,
    text:'溃口处原布着灌江口「九桩锁浪灯」：踏一桩，此桩与上下左右四桩明灭齐翻，九桩全明，灯阵便能在决口前临时束起一道水栅，好叫你腾出手与蛟将放对。灯阵不亮，人浪两线便要一起压上来。',
    pass:{shield:0.3,enemyVuln:true,merit:8,log:'九灯连成一线，水栅在溃口处绷起半人高。白浪被拦在栅外，蛟将的藤甲水压先泄了三成。'}},
   {type:'battle',enemy:'bashe',name:'白浪蛟将',scale:0.55}
  ]},
  {title:'三汛·主浪翻江',nodes:[
   {type:'event',text:'蛟王亲至，翻江三连，必须在三次读招里打断它两次。磨刀声在最高处停了。',
    choices:[{t:'迎击蛟王',r:{log:'主浪拍上云天。'}}]},
   {type:'game',game:'memory',difficulty:3,
    text:'蛟王翻江三连，每连浪头都不同：第一连看鳍、第二连看潮眼、第三连看回水。灌江口读招牌三转渐长，须照浪序逐张复按，牌序不差，才算是在三次读招里咬住了蛟王的节拍、抢下两次打断的先手；错一张，主浪重卷、本轮重读。',
    pass:{shield:0.3,enemyVuln:true,merit:10,favor:{er_lang:8},log:'三转读招全中，你在第二、第三连各抢出一个空当，一脚踏在潮眼上。蛟王翻江之势为之一滞，高处的磨刀声，停了。'}},
   {type:'battle',enemy:'jiuying',name:'蛟王',scale:0.7},
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
   {type:'battle',enemy:'xishenxiaoli',name:'招安随员',scale:1.1}
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
   {type:'battle',enemy:'kongqipanguan',name:'编制兽',scale:0.95},
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
  {type:'battle',enemy:'kongqipanguan',name:'卷先生',scale:0.8},
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
  {type:'battle',enemy:'xishenxiaoli',name:'公允星吏',scale:1.05},
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
  {type:'battle',enemy:'dafeng',name:'巽风怪',scale:1.1},
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
  {type:'battle',enemy:'hundun',name:'龟蛇玄甲将',scale:0.8},
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
  {type:'battle',enemy:'kongqipanguan',name:'天曹回收使',scale:0.95},
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
  {type:'battle',enemy:'xishenxiaoli',name:'契卫',scale:1.2},
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
  {type:'battle',enemy:'xishenxiaoli',name:'回收小吏',scale:1},
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
  {type:'battle',enemy:'youhun',name:'管中溺魂',scale:1},
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
  {type:'battle',enemy:'changgui',name:'减函悍囚',scale:1.05},
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
  {type:'battle',enemy:'youhun',name:'持牒逃魂',scale:1.15},
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
  {type:'battle',enemy:'kongqipanguan',name:'昼巡替影',scale:0.65},
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
  {type:'battle',enemy:'xishenxiaoli',name:'巡夜契卫',scale:1.05},
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
  {type:'battle',enemy:'xishenxiaoli',name:'持证虚耗',scale:1.1},
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
  {type:'battle',enemy:'kongqipanguan',name:'认证壳吏',scale:0.85},
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
  {type:'battle',enemy:'xishenxiaoli',name:'理赔契差',scale:1.1},
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
  {type:'battle',enemy:'kongqipanguan',name:'合规模兽',scale:0.85},
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
  {type:'battle',enemy:'xishenxiaoli',name:'征水差丁',scale:1.05},
  {type:'event',text:'差丁退去，头顶水车还在哗哗地转。何仙姑看着半池枯荷，等你替她拿最后的主意。',
   choices:[
    {t:'以荷露为引，暗开一脉活泉回池，明池暗泉双活',r:{favor:{he_xiangu:15},flags:{flag_mercy_cut:1,flag_refuse_count:1},log:'仙姑指尖荷瓣漂入淤泥，清泉无声无息漫回半枯的荷塘。水车照旧在天上哗哗地抽，池面却一日日圆了回来——抽得走明水，抽不走生根的脉。'}},
    {t:'请村妇们按下手印，联名陈情求留一池',r:{favor:{he_xiangu:8},flags:{flag_know_truth:1,flag_stance:1},log:'几百个红手印按在状纸上，最上头那个手印旁，还歪歪扭扭印了个小脚丫。天曹的水车，破天荒停了半日。'}},
    {t:'收下「迁池补偿款」，签字让池改田',r:{money:120,erode:6,flags:{flag_ruthless:1},favor:{he_xiangu:-12},log:'仙姑没有争辩，只把最后一片干荷瓣收进袖中。从那以后，那一带妇人生产时，再也没人梦见过荷花。'}}
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
'仙姑不与人争，也不与官争。她只把一片荷瓣放进你掌心，软声软气：硬堵水车要惊胎气。水的事，咱们软着来。']

};

/* ================= 反查表 ================= */
const GODHOOD_BY_GOD = {};
Object.entries(GODS).forEach(([g, gd])=>{ if(gd.gh) (GODHOOD_BY_GOD[gd.gh] = GODHOOD_BY_GOD[gd.gh]||[]).push(g); });
