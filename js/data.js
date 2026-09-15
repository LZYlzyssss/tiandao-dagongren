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
  sources:'《礼记·郊特牲》社祀；《搜神记》；闽台《福德正神金卷》宝卷',
  story:'最早的土地神是古代的「社」，《礼记》里说「社稷」就是土谷之神。民间给他塑个矮胖老头像，旁边总蹲着一只小狗——传说土地公被妖精欺侮时，是村头黄狗救了他一命，从此他走到哪儿都带只狗。',
img:'Chinese ink wash painting of a kind old earth god with white beard holding a gnarled wooden staff, warm smile, sumi-e style with ochre and moss green accents, rice paper texture, portrait',
aid:{name:'社土为盾',type:'shield',shield:0.32,desc:'相熟薄土盾，信重全队护盾回血，莫逆地脉真伤，本体全场缠绕控制并回血。'},
gifts:{loved:['wugu'],liked:['hulu'],disliked:['panta']}},
zao_jun:{name:'灶君',title:'东厨司命',icon:'灶',tier:'E',camp:'天庭',path:'huo',unlock:null,gh:null,
intro:'守一家灶火，录一家善恶，腊月廿四上天密奏一家所行，岁首回銮赐福，是天庭安在人家里的一双眼睛，被迫密报两头赔笑。',
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
  sources:'《史记·殷本纪》《宋微子世家》；《封神演义》第二十六、二十七回、九十九回',
  story:'比干是商朝王叔，劝纣王不要宠妲己被挖心。他走出宫门碰见卖空心菜的老妇人，问「人无心能活吗」，老妇人说「菜无心能活，人为何不能」——比干顿悟倒地，被封文财神。游戏里他最懂「空心」滋味。',
img:'Chinese ink wash painting of Bi Gan the civil wealth god with hollow chest in court robes, serene and sorrowful, sumi-e style with jade green and gold accents, portrait',
aid:{name:'无心秤',type:'shield',shield:0.35,desc:'相熟公正护盾，信重命中暴击增益，莫逆持续回血，本体清增益转全队大护盾反弹。'},
gifts:{loved:['mozhen'],liked:['puti'],disliked:['hulu']}},
sun_simiao:{name:'孙思邈',title:'药王爷',icon:'药',tier:'C',camp:'民间',path:'sheng',unlock:{ch:2},gh:'s_yaowang',
intro:'药王爷主医药疗疾走方施诊，兼治神的空心之症，著千金方的仁厚医者，唯一敢给神看病的人，诊出空心化不可逆。',
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
  sources:'《元史·舆服志》（电母旗）；《道法会元》；《西游记》第四十五回',
  story:'电母是雷公老婆，负责打闪电。传说本是瞎子的女儿，雷公打雷时不小心劈了她爹，后来上天做电母专门提醒——「先闪电再打雷，免得劈错好人」。所以现在都是先闪电后打雷。',
img:'Chinese ink wash painting of the Lightning Goddess holding two mirrors radiating light, poised and precise, sumi-e style with electric blue and silver accents, portrait',
aid:{name:'镜光一闪',type:'vuln',mult:1.8,vuln:0.5,rounds:2,desc:'相熟雷伤加易伤，信重震骇打断加雷伤，莫逆群雷伤眩晕，本体群雷核弹眩晕灼烧。'},
gifts:{loved:['xiangzhu'],liked:['panta'],disliked:['hulu']}},
zhao_gongming:{name:'赵公明',title:'武财神',icon:'赵',tier:'B',camp:'天庭',path:'bing',unlock:{ch:4},gh:'b_zhaogong',
intro:'武财神玄坛元帅，率招宝纳珍招财利市四神主公平之财与驱雷驭役，旧瘟神出身，最懂被天庭定义再被香火改写的价码。',
  sources:'晋·干宝《搜神记》；《太上洞渊神咒经》；《真诰》；《封神演义》第四十七、五十一、九十九回',
  story:'赵公明本是瘟神，后来被道教收编变成武财神。他手拿黑鞭，骑黑虎。有四个手下：招宝、纳珍、招财、利市——合起来叫「五路财神」。过年贴的财神画，武财神是他，文财神是比干。',
img:'Chinese ink wash painting of Zhao Gongming the military wealth god on a black tiger with iron whip, opulent and shrewd, sumi-e style with gold and black accents, portrait',
aid:{name:'铁鞭扫',type:'nuke',mult:2.6,desc:'相熟重击破甲，信重流血连击，莫逆群伤群易伤，本体核弹缴械并战后掉宝提升。'},
gifts:{loved:['puti'],liked:['panta'],disliked:['taomu']}},
wen_chang:{name:'文昌帝君',title:'文昌帝君',icon:'昌',tier:'B',camp:'天庭',path:'fa',unlock:{ch:4},gh:'f_wenchang',
intro:'掌天下文运功名禄籍桂籍榜册，读书人的头顶上司，梓潼神与文昌六星合流，骑白特侍天聋地哑，天庭亲信掌禄籍。',
  sources:'《华阳国志》；《北梦琐言》；《明史·礼志》；《文昌帝君阴骘文》',
  story:'文昌帝君本是文昌星，后来人格化成张亚子。传说东晋时四川人，战死沙场后被封为文昌帝君，专管科举。旁边总跟着「天聋」「地哑」两个童子——天机不可泄露，所以一个聋一个哑。',
img:'Chinese ink wash painting of Wenchang the literature god riding a white mule with brush and scroll, elegant and scholarly, sumi-e style with indigo and gold, portrait',
aid:{name:'朱笔点斗',type:'vuln',mult:1.9,vuln:0.5,rounds:2,desc:'相熟易伤加命中，信重群沉默，莫逆全队暴击回能，本体群易伤并禁用援助法术。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['hulu']}},
ma_zu:{name:'妈祖',title:'天上圣母',icon:'妈',tier:'B',camp:'民间',path:'sheng',unlock:{ch:4},gh:'s_mazu',
intro:'海神主海上救难护航济溺，闽海舟船与漕运的命，林默娘乘席渡海专济海难，民命海难为上，削藩动她先动民心。',
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
  sources:'《玉历宝钞》（清传本）；《集说诠真》；《阎王经》系统',
img:'Chinese ink wash painting of King Qin Guang first hall of the underworld holding a brush and ledger, shrewd and tired, sumi-e style with dark robes, portrait',
aid:{name:'销牒朱笔',type:'percent',pct:0.32,desc:'相熟单体真伤，信重显形加易伤，莫逆群定身，本体群显形群易伤加大真伤。'},
gifts:{loved:['mozhen'],liked:['xiangzhu'],disliked:['panta']}},
yan_luo:{name:'阎罗王',title:'五殿阎罗',icon:'阎',tier:'B',camp:'地府',path:'you',unlock:{ch:4},gh:'y_yanluo',
intro:'五殿阎罗王掌叫唤大地狱与十六诛心小狱审喊冤之鬼，因哀怜屈死屡放亡魂还阳被降调，玩家顶头上司，自身难保。',
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
s_bigan:{name:'无心格',path:'sheng',q:'宝',icon:'❤️',god:'比干',desc:'我没有心——所以不偏。',stat:{hp:34,def:8},passive:{extra:'易伤持续-1回，灼烧中毒-15%',labels:['易伤-1回','灼烧中毒-15%']},active:{name:'七窍玲珑',type:'shield',cost:30,cd:4,shield:0.38,rounds:3,desc:'净化异常+38%生命护盾3回合'}},
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
   ]}
 ]},

{id:'c1m2',name:'游魂三缕',god:'yan_luo',chapter:1,forced:true,main:'c1m2',reqMain:'c1m1',danger:1,money:30,merit:8,
 scroll:'阎君殿朱签：巡收夹壁游魂三缕，误一魂扣当月香火三成。朱字旁添注：朱砂快没了，勾魂笔自带。',
 reward:{shards:{bing:1,huo:1}},
 nodes:[
  {type:'event',text:'灰雾里三缕游魂抱着生前执念打转——一个攥着半张考榜，一个端着冷药碗，一个还在念叨「再让我看一眼放榜」。土地公在旁喊招，喊到一半忘词：「它抬手你就躲！它缩脖子你就——就什么来着？」',
   choices:[{t:'凝神戒备，按意图见招拆招',r:{log:'三缕游魂呜咽着围了上来。'}}]},
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
   ]}
 ]},

{id:'c2m2',name:'被抽灯油的神',god:'zao_jun',chapter:2,forced:true,main:'c2m2',reqMain:'c2m1',danger:2,money:50,merit:10,
 scroll:'腊月将尽，灶君的奏报匣点不着火，门神两位夜班站着都能睡着，都说「像被谁抽了灯油」。',
 reward:{shards:{huo:2}},
 nodes:[
  {type:'event',text:'灶君对着奏报匣子吹气，火苗冒半寸就灭。门上神荼郁垒抱着兵刃打哈欠，谁都不记得昨夜是谁先睡的。是夜你替二位门神站岗，半夜竟有无业野魂趁隙摸上庙墙。',
   choices:[{t:'提灯守夜',r:{log:'灰影翻墙而入！'}}]},
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
  {type:'battle',enemy:'yehu',name:'灯油鼠群',scale:1.15},
  {type:'battle',enemy:'bifang',name:'窃油鼠君',scale:0.8},
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
   ]}
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
   ]}
 ]},

{id:'c3m2',name:'毒沼与厉鬼·账房在死人堆',god:'cui_jue',chapter:3,forced:true,main:'c3m2',reqMain:'c3m1',danger:4,money:100,merit:20,
 scroll:'枉死城最底层，相柳毒沼渗进城墙。欠债的魂被扔进沼边「工偿」化成厉鬼，总账簿藏在沼心账台。',
 reward:{pill:'wang',shards:{you:2}},
 nodes:[
  {type:'event',text:'雾里九首残影若隐若现，厉鬼在沼边徘徊，被扔进沼前它们也都是还债的苦魂。',
   choices:[{t:'涉沼前行',r:{log:'厉鬼闻见生人气，扑了上来。'}}]},
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
  {type:'event',text:'老农抱着一把没烧完的稻谷，鞋上还沾着阳间的泥。',
   choices:[
    {t:'出示拘票，强行拘拿',r:{log:'老农攥紧了秧苗，执念骤然化作黑气。'}},
    {t:'回村替他给儿子托梦「夏至前灌水」',r:{renqing:1,skip:1,log:'你跑完这趟人情，老农含泪把稻谷塞进你手里，安心随行。'}},
    {t:'嫌费事，喊阴兵直接锁拿',r:{flags:{flag_ruthless:1},log:'你祭出锁魂链，老农的执念被激得暴涨。'}}
   ]},
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
    {t:'以火德神格相引，哄它归位',requires:{path:'huo'},r:{favor:{tudi_gong:5},flags:{flag_know_truth:1},skip:1,log:'你放出一缕温和火光，火灵破涕为笑，乖乖归位长明灯。'}},
    {t:'拿水硬浇',r:{flags:{flag_ruthless:1},log:'冷水激上窑火，火灵当场暴怒，焰色发青！'}},
    {t:'问它「长明灯为何调走」',r:{flags:{flag_know_truth:1},log:'它奶声奶气：「上头说……省油，灯火统一管。」'}}
   ]},
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
  {type:'battle',enemy:'zhisha',name:'墨柜鬼',scale:1},
  {type:'event',text:'崔珏袖手看完你收拾墨柜鬼，破天荒地给你斟了半盏冷茶。',
   choices:[{t:'谢过府君',r:{favor:{cui_jue:2},log:'他点了点头，没说话。'}}]}
 ]},

{id:'s05',name:'阎君殿错投录',god:'yan_luo',chapter:1,yamen:true,side:'s05',danger:2,money:70,merit:14,
 scroll:'善人投了畜生道、屠夫投了富贵家、一个秀才投去了忘川——三封判词全错。朱笔没错，是装判词的筒子被换了。',
 reward:{shards:{you:2}},
 nodes:[
  {type:'event',text:'三魂堵门，阎王爷脸黑得像锅底。牛头等的筒写「善」里面却是恶签；马面赌咒没离岗；夜值小鬼说看见「朱衣吏」来过——可当夜根本没有朱衣吏当值。',
   choices:[{t:'比对三套签筒的墨色再作定论',r:{log:'证词在你脑中一一过筛。'}}]},
  {type:'event',text:'三条线索摆在面前，你要当场指认。',
   choices:[
    {t:'指认小鬼偷懒看错',r:{merit:-7,flags:{flag_ruthless:1},log:'你冤枉了好人，真犯就此脱身，赏钱减半。'}},
    {t:'点破「筒被整组调换」，锁定外包老差役',r:{flags:{flag_know_truth:1},skip:1,log:'能进出值房、整组调筒的，只有当值外包老差役——他在偷卖「好胎」名额。'}},
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
  {type:'battle',enemy:'xishenxiaoli',name:'省油小车吏',scale:1.1}
 ]},

{id:'s07',name:'冒牌阴神案',god:'cheng_huang',chapter:2,side:'s07',danger:3,money:90,merit:20,
 scroll:'庙会丢魂、淫祠索祭、路口卖路引——三起十年前就结过的旧案同时复发，作案者报的全是在籍阴神的名号。',
 reward:{dshards:{cheng_huang:3},shards:{you:1}},
 nodes:[
  {type:'event',text:'你在夜路口设伏，两道冒牌身影果然现身，签文格式竟分毫不差。',
   choices:[{t:'拿下假差',r:{log:'两道黑影分头逃窜。'}}]},
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
    {t:'以生息净化析出汤中灰',requires:{path:'sheng'},r:{favor:{meng_po:5},flags:{flag_know_truth:1},log:'灰里夹着半枚没磨碎的神格签，编号与「可重封」锦囊相同。'}},
    {t:'查送水的担水鬼',r:{flags:{flag_know_truth:1},log:'他赌咒只从固定泉眼挑水，泉眼边却尽是天曹小车的辙印。'}}
   ]},
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
    choices:[{t:'戳破第一道空卯',r:{log:'那名「功曹」面具裂开，壳下空空如也。'}}]},
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
   {type:'battle',enemy:'dafeng',name:'鱼精哨',scale:0.9}
  ]},
  {title:'二汛·溃堤抢修',nodes:[
   {type:'event',text:'江堤溃口，白浪蛟将裹着藤甲水压而来，兵系重击与火德烧甲是破防关键。',
    choices:[{t:'抢堵决口，迎战蛟将',r:{log:'蛟将立起半身，浪比庙高。'}}]},
   {type:'battle',enemy:'bashe',name:'白浪蛟将',scale:0.55}
  ]},
  {title:'三汛·主浪翻江',nodes:[
   {type:'event',text:'蛟王亲至，翻江三连，必须在三次读招里打断它两次。磨刀声在最高处停了。',
    choices:[{t:'迎击蛟王',r:{log:'主浪拍上云天。'}}]},
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
   {type:'battle',enemy:'xishenxiaoli',name:'招安随员',scale:1.1}
  ]},
  {title:'三轮谈判',nodes:[
   {type:'event',text:'温有节派来的协办文吏法条陈，三轮措辞，每一步都是坑。',
    choices:[
     {t:'引「山籍自治」旧例，辅以明账思路',r:{flags:{flag_neutral_pact:1},log:'文吏一时语塞，第三条路被你谈出了一道缝。'}},
     {t:'强硬顶回',r:{flags:{flag_stance:1},log:'文吏冷笑，谈判濒临破裂。'}},
     {t:'太软，答应编册',r:{flags:{flag_ruthless:1},log:'小猴们默默排队报数，你听见山在叹气。'}}
    ]}
  ]},
  {title:'契成·编制兽',nodes:[
   {type:'event',text:'谈判决裂的最后一刻，协办文吏放出一具「编制兽」强行点卯——打退它，自治契才落得了印。',
    choices:[{t:'护住桃林旧旗',r:{log:'编制兽扛着一口巨大的印玺踏来。'}}]},
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
    {t:'不动声色，把标签换给一块石头',r:{flags:{flag_neutral_pact:1},skip:1,log:'你趁他点数，悄悄把标签换给了路边一块石头。'}},
    {t:'塞钱让他今夜先去别处',r:{money:-100,flags:{flag_mercy_cut:1},skip:1,log:'小吏掂了掂钱袋，嘟囔着推车走了。'}}
   ]},
  {type:'battle',enemy:'xishenxiaoli',name:'回收小吏',scale:1},
  {type:'event',text:'天快亮时，土地公忽然短暂地什么都想起来了一瞬。「小……小友啊。老夫想起来了。第一章那天，老夫要嘱咐你的那句话是——别学我们。要回来。」灯影一晃，他又忘了，只慈祥地笑：「远客来，好。喝茶，好。」',
   choices:[{t:'攥紧半块供糕，踏上云阶',r:{log:'你没有回头，怕一回头就走不动了。'}}]}
 ]}

];


/* ================= 反查表 ================= */
const GODHOOD_BY_GOD = {};
Object.entries(GODS).forEach(([g, gd])=>{ if(gd.gh) (GODHOOD_BY_GOD[gd.gh] = GODHOOD_BY_GOD[gd.gh]||[]).push(g); });
