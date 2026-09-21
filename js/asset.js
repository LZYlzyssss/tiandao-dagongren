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
  /* ---- 运行环境与资源根（兼容三种宿主） ----
     1) 静态站 https://lzylzyssss.github.io/...  2) file:// 双击直开  3) Capacitor WebView（https://localhost）
     所有图片 URL 一律基于 document.baseURI 推绝对路径：相对"img/x.jpg"写法在三种宿主下都稳，
     且绝不使用"/"开头的根绝对路径（Capacitor 打包后根路径不指向 assets/public，必 404）。 */
  _envCache:null,
  _env(){
    if(this._envCache) return this._envCache;
    const proto=location.protocol;
    let base=(document.baseURI||location.href).replace(/[^/]*$/,'');   /* 末尾带 / */
    this._envCache={
      proto,
      isFile:proto==='file:',
      isHttp:proto==='http:'||proto==='https:',
      isCap:!!(window.Capacitor||window.androidBridge),
      base
    };
    return this._envCache;
  },
  base(){ return this._env().base; },

  /* ---- webp 协商：探针确认 img/ 下存在同名 .webp 才切换；探针前/无 webp 时一律 jpg（零行为变化）。
     2026-09-21 已用 ffmpeg 全量生成 img/*.webp（bf_ 保原尺寸、其余长边≤1280，q82；jpg 原图保留未删），
     webp 管线自此常态启用：带宽降到约 1/7，首访设备图片加载提速明显。
     探针结果写 localStorage（7 天）；若再批量重转 webp，抬 _WEBP_CACHE_VER 立刻生效。 */
  _webp:null,
  _WEBP_CACHE_VER:'webp-v1',
  async _probeWebp(){
    if(this._webp!==null) return this._webp;
    if(!this._env().isHttp){ this._webp=false; return false; }   /* file:// 无法可靠验 404，保守不切 */
    /* 1) 先问缺图负缓存：若 p_r0.webp 被坐实缺失则连探都不探（webp 全量在库，正常不会命中） */
    this._missInit();
    if(this._isMissing(this.base()+'img/p_r0.webp')){ this._webp=false; this._cacheWebp(false); return false; }
    /* 2) 再读 7 日内的探针结论 */
    try{
      const c=JSON.parse(localStorage.getItem(this._WEBP_CACHE_VER)||'null');
      if(c && Date.now()-c.t<7*864e5){ this._webp=!!c.ok; return this._webp; }
    }catch(e){}
    const samples=['p_r0','ui_main'];
    const hit=await new Promise(res=>{
      let left=samples.length, found=false;
      const done=ok=>{ if(ok) found=true; if(--left<=0) res(found); };
      samples.forEach(k=>{
        const im=new Image();
        const t=setTimeout(()=>{ im.onload=im.onerror=null; done(false); },1500);
        im.onload =()=>{ clearTimeout(t); done(true); };
        im.onerror=()=>{ clearTimeout(t); done(false); };
        im.src=this.base()+'img/'+k+'.webp';
      });
    });
    this._webp=hit;
    this._cacheWebp(hit);
    if(hit) console.info('[ASSET] 检测到 webp 素材，启用 webp 管线');
    return hit;
  },
  _cacheWebp(ok){
    try{ localStorage.setItem(this._WEBP_CACHE_VER, JSON.stringify({t:Date.now(),ok:!!ok})); }catch(e){}
  },

  /* key 可带 '#sprite' 后缀：战斗专用抠底立牌，取独立库 img/bsprite/<key>.png|webp；
     不带后缀的原图（登场/过场/图鉴）路径完全不变 */
  file(key){
    const sp=typeof key==='string'&&key.endsWith('#sprite');
    if(sp) key=key.slice(0,-7);
    key=this.ALIAS[key]||key;
    const ext=this._webp?'webp':(sp?'png':'jpg');
    return this.base()+'img/'+(sp?'bsprite/':'')+key+'.'+ext;
  },
  avatarFile(gid){ return this.base()+'img/av_'+gid+'.jpg'; },

  /* 任意入参 → 可直接请求的文件 URL：list key 走 file()；绝对 URL 原样；'img/' 相对路径补 base */
  _toFile(v){
    if(!v) return null;
    const b=typeof v==='string'?v.replace(/#sprite$/,''):v;   /* 变体按其原图 key 验籍 */
    if(this.list[v]||this.list[b]) return this.file(v);
    if(/^(https?:|file:|blob:|data:)/i.test(v)) return v;
    if(v.slice(0,4)==='img/') return this.base()+v;
    return null;
  },

  /* ---- 本地图探测（Promise + 缓存） ----
     三种结论：true=有本地图(已下载) / false=坐实缺失(404，永久水墨兜底) / undefined=本次网络失败(不坐实，下次还能再试) */
  _probe:{}, _probeQueue:[], _probeInflight:{}, _missing:{},

  /* ---- 缺图负缓存（消除「已知缺图」的重复 404 请求与控制台红错） ----
     _KNOWN_MISSING：发版时按磁盘实测的内置清单（相对路径，命中直接终态，零请求）。
       补图后把对应项删掉即可；批量补图后直接抬 _MISSING_VER 清空全部历史结论。
     localStorage：运行期新坐实的 404 也记下来（7 天后重验一次），换设备/清缓存才会再探。 */
  _MISSING_VER:'miss-20260921',
  _KNOWN_MISSING:[
    /* 32 张旧版 av_ 头像：47 神一律走 g_ 立绘，av_ 永不挂载（15 张阎罗体系旧档仍保留在盘） */
    'img/av_ao_guang.jpg','img/av_bi_gan.jpg','img/av_di_zang.jpg','img/av_dian_mu.jpg',
    'img/av_dong_yue.jpg','img/av_duo_wen.jpg','img/av_er_lang.jpg','img/av_feng_du.jpg',
    'img/av_guan_yin.jpg','img/av_guan_yu.jpg','img/av_he_xiangu.jpg','img/av_lei_zu.jpg',
    'img/av_lu_ban.jpg','img/av_lu_zhidao.jpg','img/av_lv_dongbin.jpg','img/av_ma_zu.jpg',
    'img/av_ne_zha.jpg','img/av_qin_guang.jpg','img/av_sun_simiao.jpg','img/av_sun_wukong.jpg',
    'img/av_wei_tuo.jpg','img/av_wei_zheng.jpg','img/av_wen_chang.jpg','img/av_xi_wangmu.jpg',
    'img/av_xi_yue.jpg','img/av_xuan_nv.jpg','img/av_zeng_zhang.jpg','img/av_zhao_gongming.jpg',
    'img/av_zhen_wu.jpg','img/av_zhong_kui.jpg','img/av_zhong_yue.jpg','img/av_zhuan_lun.jpg',
    /* 玩家品阶 5-9 立绘/立牌（当前版本未开放，开放补图后删此 20 项）；
       jpg/png 与 webp 孪生成对：file() 按探针结果切后缀，两种管线都要命中负缓存 */
    'img/p_r5.jpg','img/p_r6.jpg','img/p_r7.jpg','img/p_r8.jpg','img/p_r9.jpg',
    'img/p_r5.webp','img/p_r6.webp','img/p_r7.webp','img/p_r8.webp','img/p_r9.webp',
    'img/bsprite/p_r5.png','img/bsprite/p_r6.png','img/bsprite/p_r7.png','img/bsprite/p_r8.png','img/bsprite/p_r9.png',
    'img/bsprite/p_r5.webp','img/bsprite/p_r6.webp','img/bsprite/p_r7.webp','img/bsprite/p_r8.webp','img/bsprite/p_r9.webp',
    /* 程序化水墨图：由 INKSVG 实时生成，不需要图片文件（双后缀同理成对） */
    'img/bf_c1n.jpg','img/stat_mp.jpg','img/bf_c1n.webp','img/stat_mp.webp',
  ],
  _missStore:{}, _missHydrated:false,
  _missInit(){
    if(this._missHydrated) return;
    this._missHydrated=true;
    /* 内置项：永久终态（exp=0） */
    this._KNOWN_MISSING.forEach(rel=>{ this._missStore[rel]=0; });
    /* 学习项：7 天有效期；版本不符整体丢弃 */
    try{
      const raw=JSON.parse(localStorage.getItem(this._MISSING_VER)||'null');
      if(raw&&raw.v===this._MISSING_VER&&raw.t){
        const now=Date.now();
        Object.keys(raw.t).forEach(rel=>{
          const ts=raw.t[rel];
          if(ts&&now-ts<7*864e5) this._missStore[rel]=ts;
        });
      }
    }catch(e){}
    /* 坐实进运行时 _missing（绝对 URL） */
    Object.keys(this._missStore).forEach(rel=>{ this._missing[this.base()+rel]=1; });
  },
  _missRel(url){
    const b=this.base();
    return url&&url.indexOf(b)===0 ? url.slice(b.length) : null;
  },
  _isMissing(url){
    this._missInit();
    return !!this._missing[url];
  },
  /* 新坐实的 404：运行时 + localStorage 双写（内置项不落盘） */
  missLearn(url){
    if(!url) return;
    this._missing[url]=1;
    const rel=this._missRel(url);
    if(!rel||this._missStore[rel]===0) return;
    this._missStore[rel]=Date.now();
    try{
      const raw={v:this._MISSING_VER,t:{}};
      Object.keys(this._missStore).forEach(k=>{ if(this._missStore[k]!==0) raw.t[k]=this._missStore[k]; });
      localStorage.setItem(this._MISSING_VER, JSON.stringify(raw));
    }catch(e){}
  },

  /* ---- 内存级缓存（Capacitor / 移动端 WebView 的关键） ----
     _loading  : url -> 在途 Promise，preload/demand/warm/挂载四路共用一条请求，绝不重复下载
     _blobUrl  : url -> blob: 内存地址。http(s)（含 Capacitor https://localhost）下图到后转 blob，
                 卡牌反复切换/页面重挂直接读内存，零网络、零解码等待，彻底绕开部分安卓 WebView 磁盘缓存异常
     _failedLog: 失败名只在控制台打印一次 */
  _loading:{}, _blobUrl:{}, _failedLog:{},

  /* 失败/缺图终态的统一占位：米纸墨框 +「佚」字方印（自包含 data URI，不依赖任何网络文件） */
  get PLACEHOLDER(){
    if(this._ph) return this._ph;
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">'+
      '<rect width="200" height="200" fill="#efe6d0"/><rect x="14" y="14" width="172" height="172" rx="10" fill="none" stroke="#8a7a5c" stroke-width="3" stroke-dasharray="8 7"/>'+
      '<text x="100" y="128" font-size="86" text-anchor="middle" fill="#a9462f" font-family="serif">佚</text></svg>';
    return this._ph='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  },
  /* 给挂载层用的最终 URL：优先内存 blob，其次原 URL */
  _serve(url){ return this._blobUrl[url]||url; },
  _shortName(url){
    try{ return decodeURIComponent(String(url).split('/').pop().split('?')[0]); }catch(e){ return String(url); }
  },
  _logFail(url,reason){
    if(this._failedLog[url]) return;
    this._failedLog[url]=1;
    console.warn('[ASSET] 图片加载失败，已替换占位骨架：'+this._shortName(url)+'（'+reason+'）');
  },

  /* ---- 真图到达订阅（渐进挂载核心） ----
     页面挂载点先显示 SVG 骨架并订阅；真图在任意时刻（挂载直拉 / priority / warm）下载成功后，
     统一经 _flushWaiters 通知所有挂载点自动换成真图，无需重新 render。
     cb(url)：成功→真图地址；坐实 404→null（终态，保持骨架）；网络失败→暂不回调，订阅保留，后台补到后再通知 */
  _waiters:{}, _pullInflight:{},
  _flushWaiters(file){
    const list=this._waiters[file]; if(!list||!list.length) return;
    const serve=this._serve(file);
    list.splice(0).forEach(cb=>{ try{ cb(serve); }catch(e){} });
  },
  /* 按文件 URL 订阅（av_ 等不在 list 中的直接路径也走这里） */
  onFile(file,cb){
    if(!file) return;
    file=this._toFile(file)||file;
    this._missInit();
    if(this._probe[file]===true){ cb(this._serve(file)); return; }
    if(this._probe[file]===false||this._missing[file]){ cb(null); return; }
    (this._waiters[file]=this._waiters[file]||[]).push(cb);
    this._pull(file);
  },
  /* 按资产 key 订阅（'#sprite' 变体按原图 key 验籍，文件走 bsprite png/webp） */
  onKeyReady(key,cb){
    const b=typeof key==='string'?key.replace(/#sprite$/,''):key;
    if(!key||!this.list[b]){ cb(null); return; }
    this.onFile(this.file(key),cb);
  },
  /* 高优先级直拉（页面正在看的图）：自带在途去重，不走 warm 的单线程/让路节流；
     成功后坐实缓存结论、通知挂载点、标记 warm 已完成避免后台重复劳动 */
  _pull(file){
    if(this._pullInflight[file]||this._probe[file]!==undefined||this._missing[file]) return this._pullInflight[file]||Promise.resolve();
    const p=(async()=>{
      let st=await this._loadOnce(file);
      if(st==='fail') st=await this._loadOnce(file);
      if(st==='ok'){
        this._probe[file]=true;
        this._flushWaiters(file);
      }else if(st==='missing'){
        this._probe[file]=false; this._missing[file]=1;
        (this._waiters[file]||[]).splice(0).forEach(cb=>{ try{cb(null);}catch(e){} });
      }
      /* st==='fail'：网络抖动，不坐实，waiters 保留；后台 warm 会再试，拉到后再通知 */
      this._pullInflight[file]=null;
    })();
    this._pullInflight[file]=p;
    return p;
  },
  /* 批量高优先级：小并发池主动拉取一组 key（用于进门后在架工单图等）
     兼容两种入参：list 内的 key（'g_xxx'）或直接文件路径（'img/av_xxx.jpg'） */
  priority(keys,conc){
    const fileOf=v=>this._toFile(v);
    const q=(keys||[]).filter((v,i,a)=>{
      if(!v||a.indexOf(v)!==i) return false;
      const f=fileOf(v);
      if(!f) return false;
      return this._probe[f]===undefined && !this._missing[f];
    });
    if(!q.length) return;
    let i=0;
    const worker=()=>{
      const k=q[i++];
      if(k===undefined) return Promise.resolve();
      const f=fileOf(k);
      return this._pull(f).then(()=>{
        /* 关键修复：只有确实缓存成功才标记完成；弱网失败(_probe!==true)绝不能标 done，
           否则全量 warm 兜底会跳过它，该图沦为永久字牌 */
        if(f && this._probe[f]===true) this._warmDone[k]=1;
        return worker();
      });
    };
    for(let w=0;w<Math.min(conc||3,q.length);w++) worker();
  },

  /* ==================================================================
     可见驱动高优队列（demand）——解决"进去后还是字牌"的核心
     - 元素进入视口即入队，4 并发直拉，不受 warm 单线程/让路影响
     - 弱网失败自动指数退避重试（1.2s/3s/6s），当前看到的图一定追到成功
     - 多次仍失败则交回全量 warm 做最终兜底，绝不永久漏图
     ================================================================== */
  _demandQ:[], _demandSet:{}, _demandRunning:false, _demandTries:{},
  demand(keys){
    (Array.isArray(keys)?keys:[keys]).forEach(k=>{
      if(!k || this._demandSet[k]) return;
      const f=this._toFile(k);
      if(!f) return;
      if(this._probe[f]===true || this._missing[f]) return;  /* 已成功 / 坐实缺图：无需再拉 */
      this._demandSet[k]=1;
      this._demandQ.push(k);
    });
    this._demandStart();
  },
  _demandStart(){
    if(this._demandRunning) return;
    this._demandRunning=true;
    const self=this;
    const CONC=4; let active=0, idx=0;
    const pump=()=>{
      while(active<CONC && idx<self._demandQ.length){
        const k=self._demandQ[idx++]; active++;
        self._demandOne(k).catch(()=>{}).finally(()=>{ active--; pump(); });
      }
      /* 队列彻底排空（无在途、无剩余）才复位闸门，给后续 demand 重新开泵；
         否则闸门永远为 true，晚到的可见图会搁浅在队列里无人处理 */
      if(active===0 && idx>=self._demandQ.length) self._demandRunning=false;
    };
    pump();
  },
  async _demandOne(k){
    const f=this._toFile(k);
    if(!f) return;
    if(this._probe[f]===true){ this._warmDone[k]=1; return; }
    if(this._missing[f]){ this._demandSet[k]=0; return; }
    /* 前台可见图开拉即滚动续 2s 让路窗：preboot/warm 后台队列感知后休眠让连接，
       弱网下立绘不再被全量预载挤慢；前台停歇 2s 后后台自动恢复，全量落盘目标不变 */
    this._warmPauseUntil=Math.max(this._warmPauseUntil,Date.now()+2000);
    const st=await this._loadOnce(f,30000);   /* 可见大图给足 30s，弱网不误伤 */
    if(st==='ok'){
      this._probe[f]=true; this._warmDone[k]=1; this._flushWaiters(f); return;
    }
    if(st==='missing'){
      this._probe[f]=false; this._missing[f]=1;
      (this._waiters[f]||[]).splice(0).forEach(cb=>{ try{cb(null);}catch(e){} });
      return;
    }
    /* 网络抖动：可见图退避重试最多 4 次；仍失败交还 warm 全量兜底 */
    const n=this._demandTries[k]||0;
    if(n<3){
      this._demandTries[k]=n+1;
      await new Promise(r=>setTimeout(r,[1200,3000,6000][n]));
      return this._demandOne(k);
    }
    this._demandTries[k]=0; this._warmDone[k]=0; this._demandSet[k]=0;
    this.warm(k);
  },

  /* 单条取图的统一入口：终态缓存 + 全局唯一在途 + 超时。
     返回 'ok' | 'missing'(永久缺图) | 'fail'(网络抖动)，永不 throw。
     preload / demand / warm / 挂载探测四路全部收敛于此——同一 URL 全 App 同时只下载一次，
     卡牌反复切换时第二次起直接命中，零网络请求。 */
  _loadOnce(url, ms){
    if(!url) return Promise.resolve('fail');
    this._missInit();
    if(this._probe[url]===true) return Promise.resolve('ok');
    if(this._missing[url]) return Promise.resolve('missing');
    if(this._loading[url]) return this._loading[url];
    const p=this._fetchImg(url,ms||20000).finally(()=>{ if(this._loading[url]===p) this._loading[url]=null; });
    this._loading[url]=p;
    return p;
  },
  async _fetchImg(url, TO){
    const done=await Promise.race([
      new Promise(res=>{
        const im=new Image();
        im.decoding='async';                      /* 异步解码，不卡主线程/动画 */
        im.onload =()=>res(true);
        im.onerror=()=>res(false);
        im.src=url;
      }),
      new Promise(res=>setTimeout(()=>res('timeout'),TO)),   /* 弱网半死连接硬超时，不挂死队列 */
    ]);
    if(done==='timeout'){ this._logFail(url,'超时 '+(TO/1000)+' 秒'); return 'fail'; }
    if(done){
      this._blobize(url);                         /* http(s) 下异步转内存 blob，不阻塞回报 */
      return 'ok';
    }
    /* error：HEAD 验明是否坐实 404（HEAD 不耗图片流量；file:// 无法 XHR，按网络抖动处理，不冤枉本地文件） */
    if(this._env().isHttp){
      try{
        const hr=await fetch(url,{method:'HEAD',cache:'no-store'});
        if(hr.status===404){ this._logFail(url,'404 素材缺失，永久水墨兜底'); this.missLearn(url); return 'missing'; }
      }catch(e){ /* 断网时 HEAD 也失败 → 网络抖动 */ }
    }
    this._logFail(url,'网络错误，稍后自动重试');
    return 'fail';
  },
  /* 成功图异步转 blob: 内存地址（仅 http(s)，含 Capacitor https://localhost；file:// fetch 受限时跳过）。
     之后挂载/切换一律读内存 blob：零网络、零等待，绕开部分安卓 WebView 磁盘缓存读写异常。 */
  _blobize(url){
    if(this._blobUrl[url]||!this._env().isHttp||/^blob:/i.test(url)) return;
    fetch(url,{cache:'force-cache'}).then(r=>r.ok?r.blob():null).then(b=>{
      if(b&&!this._blobUrl[url]) this._blobUrl[url]=URL.createObjectURL(b);
    }).catch(()=>{});
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
        this._flushWaiters(f);   /* 后台预热补到真图：通知所有已挂骨架的元素原地换图 */
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
    url=this._toFile(key)||this.file(key);
    const st=await this._loadOnce(url);
    if(st==='ok'){ this._probe[url]=true; this._flushWaiters(url); return 'ok'; }
    if(st==='missing'){ this._missing[url]=1; this._probe[url]=false;
      (this._waiters[url]||[]).splice(0).forEach(cb=>{ try{cb(null);}catch(e){} }); return 'missing'; }
    /* 网络抖动：退避后重试，最多 2 次 */
    if(tries<2){
      await new Promise(r=>setTimeout(r,600*(tries+1)));
      return this._preloadOne(key,tries+1);
    }
    return 'fail';
  },

  /* ==================================================================
     preboot —— 启动全量预载（启动进度条的真实数据源，战斗前拉齐所有卡牌/UI/战斗图）
     - 先跑 webp 探针，再按 核心 → 战斗 → 卡牌 → 其余 排序；4 并发
       （安卓 WebView 同域约 6 连接，留 2 条给引擎/字体，避免请求排队互锁）
     - 已有终态的图零请求直接计完成；av_ 小头像 soft 探测（47 神仅 15 张真实存在，
       缺文件立即按完成结算、不重试、不刷错误日志）
     - 永不 reject；调用方即使超时先进游戏，本队列仍在后台继续跑完，warm/demand 共享在途去重
     opt: { core:[list key 或直接文件 URL], conc:4, onprogress(done,total,{done,fail,missing}) }
     ================================================================== */
  preboot(opt){
    opt=opt||{};
    if(this._prebootRun) return this._prebootRun;
    this._prebootRun=(async()=>{
      await this._probeWebp();
      const core=opt.core||[];
      const coreFiles=core.filter(v=>!this.list[v]);
      const coreKeys=new Set(core.filter(v=>!!this.list[v]));
      const rank=k=>{
        if(coreKeys.has(k)) return 0;
        if(/^(e_|sk_|gh_|sol_|rp_|bf_|scene_)/.test(k)) return 1;   /* 战斗/过场：绝不在战斗中临时加载 */
        if(/^(g_|it_)/.test(k)) return 2;                            /* 卡牌：神立绘 + 物品图标 */
        return 3;                                                    /* 工单/属性/设施/其余 */
      };
      const keys=Object.keys(this.list).sort((a,b)=>rank(a)-rank(b)||(a<b?-1:a>b?1:0));
      /* av_ 小头像 soft 探测：仅探「无 g_ 立绘」的神。
         GOD_ART 诸神一律挂载 g_ 大图（main.js/ui.js 均不取 av_），其 av_ 旧档即使在盘也永不显示，
         再去软探只会刷一排 404，故整体排除 */
      const avs=(typeof GODS!=='undefined')
        ? Object.keys(GODS).filter(g=>!(typeof GOD_ART!=='undefined'&&GOD_ART.includes(g))).map(g=>this.avatarFile(g))
        :[];
      const q=[];
      keys.forEach(k=>q.push(['key',k]));
      coreFiles.forEach(f=>q.push(['file',f]));
      avs.forEach(f=>q.push(['av',f]));
      const total=q.length;
      let done=0, fail=0, missing=0;
      const tick=()=>{ try{ opt.onprogress&&opt.onprogress(done+missing,total,{done,fail,missing}); }catch(e){} };
      /* av soft：自管 Image，不走 _loadOnce——缺失是常态（不刷警告日志、不坐实终态、不重试阻塞）；
         成功才坐实并通知挂载点；失败仅按完成计数，进门后 warm 对仍需的头像还有一次正式兜底 */
      const runAv=url=>new Promise(res=>{
        this._missInit();
        if(this._probe[url]===true) return res('ok');
        if(this._missing[url]) return res('missing');
        const im=new Image(); im.decoding='async';
        const t=setTimeout(()=>{ im.onload=im.onerror=null; res('fail'); },12000);
        im.onload =()=>{ clearTimeout(t); this._probe[url]=true; this._blobize(url); this._flushWaiters(url); res('ok'); };
        im.onerror=()=>{ clearTimeout(t); res('fail'); };
        im.src=url;
      });
      const runJob=([type,v])=>{
        if(type==='av') return runAv(v).then(st=>st==='ok'?'ok':'missing');   /* soft：缺失/超时计完成不挡门 */
        return this._preloadOne(v);                       /* list key 与直接文件 URL 均支持，内含 2 次退避重试 */
      };
      let idx=0;
      const worker=()=>{
        const job=q[idx++];
        if(job===undefined) return Promise.resolve();
        /* 进门后业务取图（ASSET.src/demand 会设让路窗）优先：preboot 让路，
           但单任务最多让 2.5s 必须放行——否则持续滚动窗下回填近乎停摆，
           缓存迟迟补不齐，翻到未取过的图就得现场走慢网络（v33 实测教训） */
        const pause=()=>new Promise(r=>setTimeout(r,500));
        const go=(waited=0)=>{
          if(Date.now()<this._warmPauseUntil && waited<2500) return pause().then(()=>go(waited+500));
          return runJob(job).then(st=>{
            if(st==='ok') done++; else if(st==='missing') missing++; else fail++;
            tick();
            return worker();
          }).catch(()=>{ fail++; tick(); return worker(); });
        };
        return go();
      };
      tick();
      await Promise.all(Array.from({length:Math.min(opt.conc||4,Math.max(1,q.length))},worker));
      return {done,fail,missing,total};
    })();
    return this._prebootRun;
  },

  /* ---- 后台预热队列：单并发兜底全量；可见图由 demand 独立高优拉，互不抢连接 ---- */
  _warmQ:[], _warmDone:{}, _warmBusy:0, _warmStarted:false, _warmPauseUntil:0, _warmWaitSince:0,
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
      /* 让路窗内最多连等 2.5s（与 preboot 同规）：兜底回填有下限速度，不因持续窗全停 */
      const paused=Date.now()<this._warmPauseUntil;
      if(paused){
        if(!this._warmWaitSince) this._warmWaitSince=Date.now();
        if(Date.now()-this._warmWaitSince<2500){ setTimeout(loop,500); return; }
      } else this._warmWaitSince=0;
      if(this._warmBusy>=1){ setTimeout(loop,500); return; }
      const k=this._warmQ.shift();
      if(k===undefined){ setTimeout(loop,1200); return; }
      this._warmBusy++;
      this._preloadOne(k)
        .then(st=>{
          if(st!=='fail'){ this._warmDone[k]=1; }
          else if(!this._warmDone[k] && !this._warmQ.includes(k)){
            /* 弱网失败：冷却 12s 再回队尾，先让其它图走，避免一张坏图反复堵队首 */
            setTimeout(()=>{ if(!this._warmDone[k] && !this._warmQ.includes(k)) this._warmQ.push(k); },12000);
          }
        })
        .catch(()=>{})
        .then(()=>{ this._warmBusy--; setTimeout(loop,250); });
      loop();
    });
    setTimeout(loop, 4000);                               /* 进门 4 秒、首屏稳定后开始兜底补齐 */
  },

  /* ---- <img> 标签：html() 出骨架，scan() 挂载回退链 ----
     decoding="async"：图片解码不卡主线程；尺寸由各容器 CSS 固定（宽高 100%/object-fit:cover），
     骨架与真图同尺寸，src 切换不发生布局跳动（CLS=0），故无需再写死 width/height 属性 */
  html(key, cls, alt){
    return `<img class="${cls||''}" alt="${alt||''}" data-asset="${key}" decoding="async" src="">`;
  },

  /* 真图到达后安全赋值：异步解码预载 → 成功替换淡入；失败换统一占位图，绝不留裂图 */
  _assignReal(img,url){
    const im=new Image();
    im.decoding='async';
    im.onload =()=>{ img.src=url; img.classList.add('loaded'); };
    im.onerror=()=>{ if(!img.getAttribute('src')) img.src=this.PLACEHOLDER; };
    im.src=url;
  },

  mount(img, key){
    const sp=typeof key==='string'&&key.endsWith('#sprite');
    const base=sp?key.slice(0,-7):key;
    if(!key || !this.list[base]){ img.style.display='none'; return; }
    img.decoding='async';
    img.classList.add('asset-fade');
    /* 总保险：任何真图 URL 赋给节点后再失败（blob 失效/磁盘缓存损坏）——
       #sprite 战斗立牌缺失时回退挂载原 jpg（仅一次），其余换统一占位图，绝不留裂图 */
    img.addEventListener('error',()=>{
      if(img.dataset.phSet) return;
      const s=img.getAttribute('src')||'';
      if(s && s.slice(0,5)!=='data:'){
        if(sp){
          img.dataset.phSet='1'; img.dataset.asset=base;
          this.mount(img,base); return;
        }
        img.dataset.phSet='1'; img.src=this.PLACEHOLDER;
      }
    },true);
    this.watchVis(img,[key]);          /* 进入视口即高优直拉并失败重试 */
    const f=this.file(key);
    /* 快路径：真图已在内存/blob 缓存，直接挂，无闪烁 */
    if(this._probe[f]===true){
      img.addEventListener('load',()=>img.classList.add('loaded'),{once:true});
      img.src=this._serve(f); return;
    }
    /* 渐进：先挂水墨骨架并立即可见（绝不空白），真图到达后替换并保持可见 */
    const svg=this.svg(key);
    if(svg){
      img.addEventListener('load',()=>img.classList.add('loaded'),{once:true});
      img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
    }
    this.onKeyReady(key,url=>{
      if(!url){
        if(sp){ img.dataset.asset=base; this.mount(img,base); return; }  /* 立牌坐实 404：回退原图 */
        if(!img.getAttribute('src')) img.src=this.PLACEHOLDER;  /* 坐实 404：墨字骨架即占位，无骨架时用通用占位 */
        return;
      }
      this._assignReal(img,url);
    });
  },
  /* ---- 视口感知：元素进入屏幕（含提前 240px）即 demand 高优拉取 ----
     玩家翻到哪页/哪张卡，眼前的图永远最先拉，不必等全局预热队列 */
  _visObs:null,
  initVisObserver(){
    if(this._visObs!==null) return;
    if(typeof IntersectionObserver==='undefined'){ this._visObs=false; return; }
    this._visObs=new IntersectionObserver(entries=>{
      const ks=[];
      entries.forEach(en=>{
        if(!en.isIntersecting) return;
        const el=en.target;
        if(el._visKeys) ks.push.apply(ks,el._visKeys);
        this._visObs.unobserve(el);   /* 进入过一次即可：拉到由订阅自动换图，失败 demand 内部重试 */
      });
      if(ks.length) this.demand(ks);
    },{rootMargin:'240px 0px',threshold:0.01});
  },
  watchVis(el, keys){
    if(!el) return;
    el._visKeys=(Array.isArray(keys)?keys:[keys]).filter(Boolean);
    this.initVisObserver();
    /* 同步兜底：挂载时已在视口（含上下各 240px 预拉带）的元素立即 demand，
       不依赖 IO 的首拍回调（个别内核首拍延迟；也让第一眼工单图零等待） */
    const r=el.getBoundingClientRect();
    const vh=window.innerHeight||document.documentElement.clientHeight||0;
    const vw=window.innerWidth||document.documentElement.clientWidth||0;
    const inView=r.width>0 && r.height>0 &&
      r.bottom>-240 && r.top<vh+240 && r.right>-240 && r.left<vw+240;
    if(inView){ this.demand(el._visKeys); return; }
    /* 视口外（弹窗未展开/下方未滚到）：交 IO，进入视口即触发 */
    if(this._visObs) this._visObs.observe(el);
  },

  scan(root){
    (root||document).querySelectorAll('img[data-asset]').forEach(img=>{
      if(img.classList.contains('asseted')) return;
      img.classList.add('asseted');
      this.mount(img, img.dataset.asset);
    });
    (root||document).querySelectorAll('img[data-gava]').forEach(img=>{
      if(img.classList.contains('avaed')) return;
      img.classList.add('avaed');
      this.mountAvatar(img, img.dataset.gava);
    });
  },

  /* ---- 背景图：渐进挂载（水墨骨架立显 → 真图到达原地淡入替换，无需重渲染） ---- */
  bg(el, key, opacity){
    if(!el || !this.list[key]){ if(el) el.style.opacity=0; return; }
    const target=(opacity!=null?opacity:1);
    if(el._assetKey===key){ el.style.opacity=target; return; }
    el._assetKey=key;
    this.watchVis(el,[key]);          /* 卡片/场景进入视口即高优直拉 */
    const f=this.file(key);
    /* 快路径：真图已缓存 */
    if(this._probe[f]===true){
      el.style.backgroundImage=`url("${this._serve(f)}")`;
      el.style.opacity=target;
      return;
    }
    el.style.transition='opacity .5s ease';
    /* 1) 水墨骨架立即铺满：卡片任何时刻都有内容，不空白 */
    const svg=this.svg(key);
    if(svg) el.style.backgroundImage=`url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
    el.style.opacity=target;
    /* 2) 真图到达后淡出骨架、换真图、淡入（内存 blob/SW 命中时这一拍几乎不可察觉） */
    this.onKeyReady(key,url=>{
      if(!url || el._assetKey!==key) return;
      const im=new Image();
      im.decoding='async';
      im.onload=()=>{
        if(el._assetKey!==key) return;
        el.style.opacity=0;
        el.style.backgroundImage=`url("${url}")`;
        requestAnimationFrame(()=>requestAnimationFrame(()=>{ el.style.opacity=target; }));
      };
      im.src=url;
    });
  },

  /* ---- 神头像（gh-ava）：墨字垫底 → av 小图 → g 大立绘渐进 ---- */
  mountAvatar(img, gid){
    const g=(typeof GODS!=='undefined')&&GODS[gid];
    if(!g){ img.remove(); return; }
    img.decoding='async';
    const hasArt=(typeof GOD_ART!=='undefined')&&GOD_ART.includes(gid);
    const av=this.avatarFile(gid);
    /* 有真绘神：demand 只拉 g_ 大图（本地无 av_ 小图文件，跳过 av 省 demand 槽） */
    if(hasArt){
      this.watchVis(img,['g_'+gid]);
      this.onKeyReady('g_'+gid,url=>{
        if(url) this._assignReal(img,url);
        else img.remove();                 /* 坐实无图：移除 img 露底层墨字（即占位态） */
      });
      return;
    }
    /* 无真绘神：仅挂 av 订阅（preboot 已 soft 探测；404 坐实则露字骨架） */
    this.onFile(av,url=>{
      if(url) this._assignReal(img,url);
      else img.remove();
    });
  },

  /* ---- 便捷取 key ---- */
  bfKey(ch, night){ return 'bf_c'+Math.min(5,Math.max(1,ch||1))+(night?'n':''); },
  sceneKey(ch){ return 'scene_c'+Math.min(5,Math.max(1,ch||1)); },

  /* ---- 程序化水墨 SVG 兜底（由文件末尾 INKSVG 提供） ---- */
  svg(key){ return INKSVG ? INKSVG.make(String(key).replace(/#sprite$/,'')) : ''; },
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
  /* 任务树 43 个独立化具名怪（本地真图，描述仅作占位） */
  wuyeyehun:'a jobless ragged wandering ghost holding an old wooden token, weary and hollow',
  tiangengzhinianhun:'a ghost half-sunken in a field ridge, clutching mud and withered crops, obsessed',
  maopaijiachai:'an impostor ghost bailiff in stolen black robes with a fake badge and real iron chain',
  guanzhongnihun:'a drowned ghost rising from a well pipe, sopping hair and pale bloated hands',
  chidietaohun:'a fleeing ghost clutching a crumpled writ, running with torn robes and desperate eyes',
  taoyiheichai:'a runaway black-clad ghost bailiff with cruel eyes and a heavy chain',
  huolingtongzi:'a fierce fire spirit boy in red robes with flame hair, standing on a burning lotus talisman',
  moguigui:'an inky cabinet ghost stained black with old ink, only two pale eyes visible',
  keshenkuilei:'a limp judge puppet with cut strings, hollow shell head, bowing mechanically',
  guanshen:'a floating shattered golden crown halo above an empty faceless head in black robes',
  huanzhongzhuyi:'a vermilion official robe moving by itself in mist with no wearer',
  tiancaitiefang:'a ghost plasterer pasting scrolls all over the walls of a celestial archive room',
  bixingqiaoshou:'a bixi tortoise-dragon shell beast carrying a giant inscribed stele on its back',
  fengtiaohegui:'a humanoid wrapped in layers of sealing paper strips, covered in compliance stamps',
  kongmaogongcao:'an empty clerk with a blank attendance sheet where its face should be',
  daibanpuzhanggui:'a sly shopkeeper ghost behind a counter offering proxy attendance stamps',
  bianzhishou:'a bureaucratic编制 beast with tusks, shaped like an official badge, ferocious guardian',
  juanxiansheng:'a walking scroll document shaped like a robed scholar, unrolling paper limbs',
  huishoushi:'a celestial reclaim envoy holding a recall decree and a large sealing box',
  zhouxuntiying:'a day patrol guard whose shadow acts separately, creeping behind',
  renzhengkeli:'an empty-shell clerk covered in hanging certification tags and approval plaques',
  heguimoshou:'a rigid compliance beast built of stacked forms and square seals, process-driven monster',
  fanshiyinchai:'a vengeful ghost bailiff with half a waist token, corrupted black uniform',
  yigui:'a gaunt plague ghost wreathed in sickly green-black epidemic mist',
  jianhanhanqiu:'a fierce branded prisoner ghost with torn case files, muscular and defiant',
  shengyouxiaocheli:'a stingy oil-cart clerk pushing a small cart with an oil lamp, thin and scheming',
  tiankukugui:'a wretched storehouse ghost guarding a vast celestial treasury full of gold it cannot touch',
  gongdaotianchai:'a stern tribute convoy officer with stacked tribute chests, greedy cold face',
  zhaoansuiyuan:'a demon turned government attendant, half monster half clerk with an amnesty tag',
  gongyunxingli:'a self-righteous star clerk holding a crooked balance scale, pompous expression',
  qiwei:'a guard formed from a contract deed, its blade a giant calligraphy brush',
  huishouxiaoli:'a junior reclaim clerk carrying a sack of recovered souls and old objects',
  xunyeqiwei:'a night watch contract guard with a clapper, patrolling in lantern darkness',
  chizhengxuhao:'a mischievous hao-spirit (tapir-like) proudly showing off an official permit',
  lipeiqichai:'a claims clerk with stacks of claim forms, slick and calculating',
  zhengshuichaiding:'a water-tax collector with a ladle and tax bowl, greedy and oppressive',
  kuzhankuzu:'a hunched old warehouse porter ghost bent under heavy stacked crates',
  yujingshao:'a fish-spirit scout with salt-crusted gills, agile and alert',
  xunfengguai:'a swirling xun-wind demon, a vortex humanoid with howling gusts',
  bailangjiaojiang:'a white-wave flood dragon general with partial scales and a halberd, surging spray',
  jiaowang:'a nine-headed flood dragon king crowned among serpents, commanding reversed river waters',
  guishexuanjiajiang:'an armored general formed of intertwined tortoise and black snake, dark heavy armor',
  wangsiguiwang:'the ghost king of the City of Unjust Dead, regal horned crown, heavy with vengeful souls'
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

  /* ---------- 礼物（7）+ 装备（10） 方形水墨骨架（真图弱网未到即见） ---------- */
  /* key 后缀 → 分类色 + 字形 + 装饰简图（墨笔写意，统一 200×200） */
  const ITEM={
    /* 礼物：木土色底，古字 */
    it_taomu:{c:'#6f4a2c',w:'桃',kind:'peach'},
    it_wugu:{c:'#7a5a30',w:'谷',kind:'sack'},
    it_xiangzhu:{c:'#5a3a20',w:'香',kind:'candle'},
    it_mozhen:{c:'#3a2c22',w:'墨',kind:'ink'},
    it_panta:{c:'#a0522d',w:'桃',kind:'peachBig'},
    it_hulu:{c:'#4a5f32',w:'葫',kind:'gourd'},
    it_puti:{c:'#2f4a3a',w:'菩',kind:'leaf'},
    /* 丹药（走 pill 已有；列在这里保证 make 也能兜住） */
    it_danmo:{c:INK3,w:'尘'},it_dan:{c:GRN,w:'丹'},it_wang:{c:GOLD,w:'王'},
    it_xiong:{c:CIN,w:'凶'},it_bingzhu:{c:IDG,w:'兵'},it_gui:{c:PUR,w:'鬼'},
    /* 装备：钢蓝/赭底，兵器古字 */
    it_pan:{c:'#334a5f',w:'笔',kind:'brush'},
    it_zhan:{c:'#4a3528',w:'剑',kind:'sword'},
    it_chui:{c:'#3a3a3a',w:'锤',kind:'hammer'},
    it_jia:{c:'#5a4022',w:'甲',kind:'armor'},
    it_pei:{c:'#2f4f6f',w:'佩',kind:'turtle'},
    it_yi:{c:'#4a3a60',w:'衣',kind:'robe'},
    it_chen:{c:'#3f3f45',w:'尘',kind:'whisk'},
    it_suo:{c:'#4a2f2f',w:'链',kind:'chain'},
    it_hu:{c:'#4a3a20',w:'葫',kind:'flameGourd'},
    it_yin:{c:'#6f2c22',w:'印',kind:'seal'},
  };
  function itemArt(k){
    const d=ITEM[k]||{c:INK,w:''};
    let s=head(200,200,PAPER);
    s+=`<rect x="14" y="14" width="172" height="172" rx="14" fill="none" stroke="${d.c}" stroke-width="3" opacity="0.5"/>`;
    s+=`<circle cx="100" cy="100" r="74" fill="${d.c}" opacity="0.12"/>`;
    switch(d.kind){
      case 'brush': s+=`<line x1="130" y1="44" x2="82" y2="152" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`+
                      `<path d="M82 152 L72 170 L94 170 Z" fill="${d.c}"/>`; break;
      case 'sword': s+=`<path d="M100 32 L108 170 L92 170 Z" fill="${d.c}"/>`+
                      `<rect x="60" y="162" width="80" height="10" rx="3" fill="${INK2}"/>`; break;
      case 'hammer': s+=`<rect x="70" y="60" width="60" height="34" rx="6" fill="${d.c}"/>`+
                       `<rect x="95" y="92" width="10" height="84" rx="3" fill="${INK2}"/>`; break;
      case 'armor': s+=`<path d="M60 50 L140 50 L150 170 L130 180 L100 172 L70 180 L50 170 Z" fill="${d.c}" opacity="0.8"/>`+
                       `<path d="M100 50 L100 172" stroke="${PAPER}" stroke-width="3"/>`; break;
      case 'turtle': s+=`<ellipse cx="100" cy="116" rx="52" ry="38" fill="${d.c}"/>`+
                       `<circle cx="100" cy="78" r="16" fill="${d.c}"/>`; break;
      case 'robe': s+=`<path d="M72 42 L128 42 L146 180 L54 180 Z" fill="${d.c}" opacity="0.8"/>`+
                      `<path d="M100 42 L100 180" stroke="${INK2}" stroke-width="2" opacity="0.5"/>`; break;
      case 'whisk': for(let i=0;i<9;i++) s+=`<line x1="${100+i*4-16}" y1="60" x2="${100+i*4-24}" y2="170" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity="0.65"/>`;
                     s+=`<ellipse cx="100" cy="56" rx="20" ry="10" fill="${d.c}"/>`; break;
      case 'chain': s+=`<circle cx="60" cy="60" r="12" fill="none" stroke="${INK}" stroke-width="6"/>`+
                       `<circle cx="140" cy="60" r="12" fill="none" stroke="${INK}" stroke-width="6"/>`+
                       `<circle cx="100" cy="100" r="12" fill="none" stroke="${INK}" stroke-width="6"/>`+
                       `<circle cx="60" cy="140" r="12" fill="none" stroke="${INK}" stroke-width="6"/>`+
                       `<circle cx="140" cy="140" r="12" fill="none" stroke="${INK}" stroke-width="6"/>`; break;
      case 'gourd': s+=`<ellipse cx="100" cy="72" rx="28" ry="32" fill="${d.c}"/>`+
                      `<ellipse cx="100" cy="132" rx="42" ry="36" fill="${d.c}"/>`+
                      `<rect x="96" y="28" width="8" height="12" rx="2" fill="${INK}"/>`; break;
      case 'flameGourd': s+=`<ellipse cx="100" cy="72" rx="28" ry="32" fill="${d.c}"/>`+
                           `<ellipse cx="100" cy="132" rx="42" ry="36" fill="${d.c}"/>`+
                           `<path d="M100 84 Q108 110 100 132 Q92 110 100 84" fill="${CIN}" opacity="0.7"/>`; break;
      case 'seal': s+=`<rect x="60" y="60" width="80" height="80" rx="6" fill="${d.c}"/>`+
                     `<rect x="74" y="74" width="52" height="52" rx="2" fill="none" stroke="${PAPER}" stroke-width="3" opacity="0.7"/>`; break;
      case 'peach': s+=`<circle cx="100" cy="110" r="52" fill="${d.c}"/>`+
                       `<path d="M100 58 Q84 32 68 40" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`+
                       `<ellipse cx="100" cy="110" rx="12" ry="8" fill="${PAPER}" opacity="0.3"/>`; break;
      case 'peachBig': s+=`<circle cx="100" cy="110" r="56" fill="${d.c}"/>`+
                          `<path d="M100 54 Q76 22 60 32" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`+
                          `<ellipse cx="100" cy="110" rx="14" ry="9" fill="${PAPER}" opacity="0.3"/>`; break;
      case 'sack': s+=`<path d="M46 74 L154 74 L140 170 L60 170 Z" fill="${d.c}"/>`+
                      `<path d="M46 74 L100 56 L154 74" stroke="${INK}" stroke-width="4" fill="none"/>`; break;
      case 'candle': s+=`<rect x="88" y="70" width="24" height="96" rx="3" fill="${d.c}"/>`+
                        `<path d="M100 40 Q112 60 100 74 Q88 60 100 40" fill="${CIN}" opacity="0.9"/>`; break;
      case 'ink': s+=`<rect x="56" y="78" width="88" height="60" rx="6" fill="${d.c}"/>`+
                     `<rect x="68" y="90" width="64" height="10" rx="2" fill="${INK2}" opacity="0.5"/>`; break;
      case 'gourd': s+=`<ellipse cx="100" cy="72" rx="28" ry="32" fill="${d.c}"/>`+
                       `<ellipse cx="100" cy="132" rx="42" ry="36" fill="${d.c}"/>`+
                       `<rect x="96" y="28" width="8" height="12" rx="2" fill="${INK}"/>`; break;
      case 'leaf': s+=`<path d="M100 34 Q150 70 132 160 Q100 180 68 160 Q50 70 100 34 Z" fill="${d.c}"/>`+
                       `<path d="M100 34 L100 170" stroke="${PAPER}" stroke-width="3" opacity="0.7"/>`; break;
    }
    s+=txt(100,d.kind==='brush'?144:d.kind==='seal'?116:116,d.w,PAPER,d.kind==='seal'?26:32,'normal');
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
      if(PILL[key]) return pill(key);           /* 丹药专用（保留旧渲染） */
      if(ITEM[key]) return itemArt(key);         /* 礼物 + 装备 + 丹药兜底 */
      if(key==='stat_mp') return head(200,200,PAPER)+`<circle cx="100" cy="100" r="70" fill="${IDG}"/>`+txt(100,104,'力',PAPER,52)+tailSvg(200,200);
      return '';
    }catch(e){ return ''; }
  }
  return {make};
})();
