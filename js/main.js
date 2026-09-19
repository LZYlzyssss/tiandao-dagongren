/* ================= 天道打工人 · 启动（BOOT 预载门） =================
   1) 启动加载屏：引擎/字体 + 进门必修图集【真正下载完成】才放行；
      404 缺图计入完成（水墨兜底是正确终态），网络失败自动重拉，绝不假装 100%
   2) 点入职/续玩/下凡/翻图鉴：小遮罩等对应卷宗到齐再展开
   3) 进门后：剩余素材后台单线程预热，真实请求让路 12 秒
   4) Service Worker 持久缓存 + 在途请求去重，二次访问本地秒开 */

/* 轮询等待某条件成立（带超时） */
function waitUntil(pred, ms, step){
  return new Promise(res=>{
    const t0=Date.now();
    (function c(){
      if(pred()) return res(true);
      if(Date.now()-t0>ms) return res(false);
      setTimeout(c, step||100);
    })();
  });
}
const withTimeout=(p,ms)=>Promise.race([p,new Promise(res=>setTimeout(()=>res(false),ms))]);

/* 去重保序 */
function uniq(a){ return (a||[]).filter((v,i)=>v&&a.indexOf(v)===i); }

/* ================= 小型“点卯”遮罩：切场景前等图（真实进度，不假装） ================= */
function gate(keys, label){
  keys=uniq(keys);
  if(!keys.length) return Promise.resolve();
  const el=$('bootGate'), tip=$('bgTip');
  /* 遮罩或文案节点缺失也绝不能挡住进门 */
  if(!el || !tip) return Promise.resolve();
  try{ el.classList.remove('hidden'); }catch(e){ return Promise.resolve(); }
  let cancelled=false;
  const setTip=txt=>{ try{ tip.textContent=txt; }catch(e){} };
  /* preload 已保证不 reject；外层再兜一层，run() 任何同步抛错都计 fail */
  const run=()=>new Promise(res=>{
    try{
      ASSET.preload(keys,{conc:6,onprogress:(d,t,st)=>{
        setTip((label||'研墨铺纸…')+'（'+d+'/'+t+(st.fail?'，重拉 '+st.fail:'')+'）');
      }}).then(r=>res(r)).catch(()=>res({fail:1}));
    }catch(e){ res({fail:1}); }
  });
  /* 只做"短暂点卯"：到齐即走，最多等 6 秒。所有目标界面都有骨架→真图原地淡入，
     未到的图由调用方 ASSET.demand 在玩家看过场/读故事期间自动补齐——
     弱网下绝不再为大图硬等 20 秒（接案下凡卡死的根因）。
     铁律：无论成功、失败还是超时，此 Promise 只 resolve 不 reject ——
     点卯门是增强体验，永远不能成为「卡在原页面」的理由 */
  const job=(async()=>{
    let r=await run(), guard=0;
    while(r.fail && guard<1 && !cancelled){ setTip('网络波动，重拉卷宗…'); r=await run(); guard++; }
    await new Promise(r=>setTimeout(r,260));                    /* 给淡入留半拍 */
  })();
  return Promise.race([
    job,
    new Promise(res=>setTimeout(()=>{ cancelled=true; res(); },6000)),
  ]).catch(()=>{}).finally(()=>{ try{ el.classList.add('hidden'); }catch(e){} });
}

/* ================= 启动加载屏 ================= */
const BOOT={
  TIPS:[
    [0.00,'判官笔已蘸墨，正在勾销两界往来文书…'],
    [0.22,'无常哥催单说不急，但图得先到…'],
    [0.46,'黄泉驿马驮着卷宗，正在过山门…'],
    [0.70,'孟婆汤在煮，场景图在宣纸上晾…'],
    [0.90,'南天门的光缆年久失修，再稍候片刻…'],
  ],
  /* 当天在架工单涉及的图：专属场景（卡片背景）+ 委托神立绘（卡片印信位） */
  shelfKeys(){
    const ks=[];
    (Game.s.shelf||[]).forEach(o=>{
      const m=MISSIONS.find(x=>x.id===o.mid);
      if(!m) return;
      if(ASSET.list['task_'+m.id]) ks.push('task_'+m.id);
      if(m.god && ASSET.list['g_'+m.god]) ks.push('g_'+m.god);
    });
    return ks;
  },
  /* 进门硬门骨架（约 3MB）：玩家立绘 + 四栏底图 + 数值小图。
     保证进门瞬间顶栏/框架完整；营造/阴兵/工单/神格等所有其余图一律进门后
     由"视口 demand（看到即拉）+ warm 兜底"渐进出现，绝不挡进门 */
  smallKeys(rk){
    return [
      'p_r'+rk,
      'ui_main','ui_desk','ui_yamen','ui_hero',
      'stat_rank','stat_calendar','stat_cult','stat_money','stat_favor',
      'stat_erode','stat_merit','stat_hp','stat_mp',
    ];
  },
  /* 硬门只保骨架；在架工单大图不再挡门 */
  requiredKeys(){
    const s=Game.s;
    const rk=Math.min(4,Math.min(8,s.rank||0));
    return this.smallKeys(rk);
  },
  run(){
    const bar=$('blBar'), pct=$('blPct'), tip=$('blTip'), loader=$('bootLoader');
    const hasSave=!!Game.s;
    /* 全量预载：核心骨架 + cover 最先，随后战斗图/卡牌/其余全部拉齐才进门；
       相对路径经 ASSET.base() 补全，file:// 直开与 Capacitor 打包均可用 */
    const core=(hasSave?this.requiredKeys():this.smallKeys(0))
      .concat([ASSET.base()+'img/cover.png']);
    let finished=false, skip=false;
    const finish=()=>{
      if(finished) return; finished=true;
      clearTimeout(skipTimer); clearTimeout(autoTimer);
      bar.style.width='100%'; pct.textContent='100%';
      tip.textContent='朱砂已干，请进——';
      setTimeout(()=>{ loader.classList.add('done'); setTimeout(()=>loader.remove(),600); },350);
    };
    /* 网络实在太差时的人道出口：手动跳过 */
    const skipBtn=document.createElement('button');
    skipBtn.className='btn btn-ghost btn-sm';
    skipBtn.textContent='网络太慢，先进衙（图片随后就到）';
    skipBtn.style.cssText='margin-top:14px;opacity:0;transition:opacity .4s;pointer-events:none';
    skipBtn.onclick=()=>{ skip=true; };
    loader.appendChild(skipBtn);
    /* 全量素材（数十张卡牌/战斗图）：6 秒可手动先进衙；15 秒仍未完则自动放行，
       没拉到的图由后台继续跑完的 preboot + 视口 demand + warm 兜底，绝不让进度条卡死 */
    const skipTimer=setTimeout(()=>{ skipBtn.style.opacity='1'; skipBtn.style.pointerEvents='auto'; },6000);
    const autoTimer=setTimeout(()=>finish(),15000);

    const onprog=(d,t,st)=>{
      const p=t?d/t:1;
      bar.style.width=(p*100).toFixed(0)+'%';
      pct.textContent=Math.round(p*100)+'%';
      const line=this.TIPS.filter(x=>p>=x[0]).pop();
      if(line && !st.fail) tip.textContent=line[1];
      if(st.fail) tip.textContent='南天门驿道拥堵，正在重拉掉队的卷宗…';
    };
    /* preboot 全量预载（4 并发，安卓 WebView 留连接给引擎/字体）；单例不 reject，
       即使被 15 秒超时放行，队列仍在后台继续把剩余卡牌/战斗图下载完 */
    const run=()=>ASSET.preboot({core,conc:4,onprogress:onprog});
    /* 引擎/字体并行，各自超时放行，不拖图的后腿 */
    const engine=waitUntil(()=>window.PIXI,8000);
    const fonts=(document.fonts&&document.fonts.ready)?withTimeout(document.fonts.ready,3000):Promise.resolve();
    /* 图集到齐即进；网络失败最多补拉一轮（已到/已缺项秒回）。
       9 秒自动放行后立即停开新轮，把连接让给进门后的视口 demand，不在这里空耗 */
    (async()=>{
      let r=await run(), guard=0;
      while(r.fail && !skip && !finished && guard<2){ r=await run(); guard++; }
      if(finished) return;
      await Promise.all([engine,fonts]);
      finish();
    })();
  },
};

/* ================= 进门后：视口优先的素材加载 =================
   1) demand 第一眼：案牍页在架工单/神 + 神衙营造，4 并发独立池直拉、失败自动重试
   2) warm 升官先行：本章章末晋升任务全套插队
   3) warm 本章战场/过场，随后单池全量兜底
   玩家滚动/切页时，进入视口的任何图（道具/神格/图鉴/他章场景）由
   IntersectionObserver 立即提到 demand 最前——看到才拉、看到必到。
   所有图未到时先出水墨骨架，真图一到原地替换淡入，不空白、不挡玩 */
function missionEnemyKeys(m){
  const ks=[];
  (m&&m.acts||[]).forEach(a=>{ if(a.enemy) ks.push('e_'+a.enemy); });
  return ks;
}
/* 小头像：无真绘（不在 GOD_ART）的神才需要拉 av_，直接文件路径 */
function avatarPath(g){
  return (typeof GOD_ART!=='undefined' && GOD_ART.includes(g))?null:ASSET.avatarFile(g);
}
function warmAll(){
  if(typeof ASSET==='undefined') return;
  const s=Game.s;
  const ch=Math.min(5,Math.max(1,s.chapter||1));
  const shelfMissions=(s.shelf||[]).map(o=>MISSIONS.find(x=>x.id===o.mid)).filter(Boolean);

  /* ---- 第一眼高优 demand（4 并发独立池，失败自动重试）：案牍页在架工单/神，
          以及从硬门移出的神衙营造与阴兵——这些都在进门画面，看到就拉，不抢全量 ---- */
  const eye=BOOT.shelfKeys();
  shelfMissions.forEach(m=>{ const av=m.god&&avatarPath(m.god); if(av) eye.push(av); });
  ['fac_shrine','fac_desk','fac_incense','fac_banner','sol_xiaojiang','sol_duwei']
    .forEach(k=>{ if(ASSET.list[k]) eye.push(k); });
  ASSET.demand(uniq(eye));

  /* ---- 升官先行（硬要求）：本章章末晋升任务 工单/神/敌人/头像 全套，warm 队首插队 ---- */
  const promote=[];
  MISSIONS.forEach(m=>{
    if(m.chapterEnd && (m.chapter||1)===ch){
      if(ASSET.list['task_'+m.id]) promote.push('task_'+m.id);
      if(m.god){
        if(ASSET.list['g_'+m.god]) promote.push('g_'+m.god);
        const av=avatarPath(m.god); if(av) promote.push(av);
      }
      missionEnemyKeys(m).forEach(k=>promote.push(k));
    }
  });
  ASSET.warm(uniq(promote),true);

  /* ---- 本章战场/昼夜/过场：下凡战斗前预备 ---- */
  setTimeout(()=>ASSET.warm(['bf_c'+ch,'bf_c'+ch+'n','scene_c'+ch],true),1500);

  /* ---- 单池全量兜底：其余所有图（道具/神格/技能/他章工单/全部神与敌人）。
          不再像旧版那样进门就抢拉 11MB 道具图标；玩家切到商铺/图鉴/某工单时，
          视口 demand 会把当屏图立即提到最前，warm 只在空闲时补齐未看到的 ---- */
  setTimeout(()=>ASSET.warm(Object.keys(ASSET.list)),3000);
  setTimeout(()=>ASSET.warm(Object.keys(GODS).map(avatarPath).filter(Boolean)),3200);
}

/* ================= 封面氛围微尘 ================= */
function spawnLoginDust(){
  const box=$('loginDust');
  if(!box) return;
  const N=16;
  for(let i=0;i<N;i++){
    const p=document.createElement('i');
    const sz=2+Math.random()*3.2;                 /* 2-5px */
    const dur=14+Math.random()*18;                /* 14-32s 上浮一圈 */
    const delay=-Math.random()*dur;               /* 错开初始相位，开局就满屏 */
    const x=Math.random()*100;                    /* 横向位置 vw% */
    const dx=(Math.random()*90-45).toFixed(0);    /* 上浮时左右漂移 px */
    p.style.cssText=`left:${x.toFixed(2)}%;width:${sz.toFixed(1)}px;height:${sz.toFixed(1)}px;`+
      `animation-duration:${dur.toFixed(1)}s;animation-delay:${delay.toFixed(1)}s;--dx:${dx}px`;
    box.appendChild(p);
  }
}

/* ================= PWA 安装引导 ================= */
const PWA={
  deferred:null,
  isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone===true;
  },
  isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent)
      || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  },
  dismissedRecently(){
    const t=+localStorage.getItem('pwa_bar_closed_at')||0;
    return Date.now()-t < 7*24*3600*1000;   /* 关过则 7 天不再提 */
  },
  /* 安卓/桌面 Chrome：捕获浏览器的安装邀请 */
  init(){
    if(this.isStandalone()) return;
    window.addEventListener('beforeinstallprompt', e=>{
      e.preventDefault();
      this.deferred=e;
      this.maybeShow();
    });
    window.addEventListener('appinstalled', ()=>{
      this.deferred=null;
      this.hide();
      UI.toast('已装入桌面，从此全屏点卯');
    });
  },
  /* 进门后由 Login 调用：已具备安装条件时显示引导 */
  maybeShow(){
    if(this.isStandalone() || this.dismissedRecently()) return;
    const bar=$('pwaBar');
    if(!bar || !bar.hidden) return;
    const ios=this.isIOS();
    /* iOS 只有"没有原生安装事件"，始终给手动指引；其余平台等 beforeinstallprompt */
    if(!ios && !this.deferred) return;
    if(ios){
      $('pwaHow').textContent='Safari 底部分享 → 添加到主屏幕';
      $('pwaInstall').textContent='查看步骤';
    }
    bar.hidden=false;
    requestAnimationFrame(()=>bar.classList.add('show'));
  },
  async install(){
    if(this.isIOS()){
      UI.toast('点底部分享图标 ⬆️ ，再选「添加到主屏幕」即可');
      return;
    }
    if(!this.deferred){ UI.toast('浏览器菜单里也能找到「安装应用」'); return; }
    this.deferred.prompt();
    const {outcome}=await this.deferred.userChoice.catch(()=>({outcome:'unknown'}));
    if(outcome==='accepted'){ this.deferred=null; this.hide(); }
  },
  hide(){
    const bar=$('pwaBar');
    if(bar){ bar.classList.remove('show'); setTimeout(()=>{bar.hidden=true;},300); }
  },
  close(){
    localStorage.setItem('pwa_bar_closed_at',String(Date.now()));
    this.hide();
  }
};

/* ================= 名号登录（本地点名册 · 两屏） ================= */
const Login={
  $(){ return $('loginCard'); },
  show(){
    Game.loadRoster();
    $('intro').classList.remove('hidden');
    this.toCover();
  },
  /* 第一屏：纯封面 */
  toCover(){
    const intro=$('intro');
    intro.classList.add('is-cover'); intro.classList.remove('is-login');
    $('loginWrap').hidden=true;
    $('loginCover').style.display='';
  },
  /* 第二屏：登录卡 */
  toLogin(){
    const intro=$('intro');
    intro.classList.add('is-login'); intro.classList.remove('is-cover');
    $('loginCover').style.display='none';
    $('loginWrap').hidden=false;
    this.renderHome();
  },
  _rankName(r){ return (typeof RANKS!=='undefined'&&RANKS[r])?RANKS[r].name:('九品'); },
  renderHome(){
    const card=this.$(); card.className='login-card'; card.innerHTML='';

    /* 旧单档认领横幅 */
    if(Game.hasLegacy()){
      const lb=h('div','legacy-banner');
      lb.innerHTML='<b>检出一份旧履历</b><br>检测到你此前的一份单档记录。在下方写下名号，点「认领旧档」即可把进度并入名册。';
      card.appendChild(lb);
    }

    const field=h('div','login-field');
    const inp=h('input','login-input');
    inp.type='text'; inp.maxLength=8; inp.placeholder='写下你的名号（1–8 字）';
    inp.setAttribute('aria-label','名号');
    /* 手机键盘弹起时，确保输入框滚到可视区中部，不被键盘挡住 */
    inp.addEventListener('focus',()=>{ setTimeout(()=>{ try{ inp.scrollIntoView({block:'center',behavior:'smooth'}); }catch(e){ inp.scrollIntoView(); } },300); });
    const go=h('button','btn btn-primary','点卯进入');
    field.appendChild(inp); field.appendChild(go);
    card.appendChild(field);

    const hint=h('div','login-hint');
    card.appendChild(hint);

    const submit=()=>{
      const name=inp.value;
      const err=Game.validName(name);
      if(err){ hint.textContent=err; inp.focus(); return; }
      const meta=Game.findName(name);
      if(meta) this.renderSlot(meta); else this.renderNew(name.trim());
    };
    go.onclick=submit;
    inp.addEventListener('keydown',e=>{ if(e.key==='Enter') submit(); });

    /* 旧档认领按钮：读输入框名号 */
    const lb=card.querySelector('.legacy-banner');
    if(lb){
      const cb=h('button','btn btn-indigo btn-sm','用这个名号认领旧档');
      cb.onclick=()=>{
        const name=inp.value;
        if(Game.validName(name)){ hint.textContent=Game.validName(name); inp.focus(); return; }
        if(Game.findName(name.trim())){ hint.textContent='此名号已在册，直接点「点卯进入」回去当差即可'; return; }
        if(!Game.claimLegacy(name.trim())){ hint.textContent='旧履历已损坏，无法认领，可直接立契新档'; return; }
        this._afterEnter('claim');
      };
      lb.appendChild(cb);
    }

    /* 在册名号：点一下直接填名并进入角色卡 */
    if(Game.roster.length){
      card.appendChild((()=>{
        const t=h('div','roster-tip','— 在册名号 · 点选入衙 —');
        const list=h('div','roster-list');
        Game.roster
          .slice().sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0))
          .forEach(m=>{
            const chip=h('div','roster-chip');
            const nm=h('span','',m.name); const rk=h('small','',this._rankName(m.rank));
            chip.appendChild(nm); chip.appendChild(rk);
            chip.onclick=()=>{ inp.value=m.name; hint.textContent=''; this.renderSlot(m); };
            list.appendChild(chip);
          });
        const wrap=h('div'); wrap.appendChild(t); wrap.appendChild(list);
        return wrap;
      })());
    }
    setTimeout(()=>inp.focus(),50);
  },
  /* 名号不在册：只有新游戏 */
  renderNew(name){
    const card=this.$(); card.className='login-card';
    card.innerHTML=`
      <div class="slot-card">
        <div class="slot-name">${name}</div>
        <div class="slot-new-tip">
          两界花名册上查无此人。<br>
          立契入册，便做那<b>无编制的九品阴神</b>，从此三十日一考，自求多福。
        </div>
        <div class="login-actions">
          <button class="btn btn-primary btn-lg" id="lnNew">立契入册 · 新游戏</button>
        </div>
        <button class="slot-back" id="lnBack">‹ 返回，重写名号</button>
      </div>`;
    card.querySelector('#lnNew').onclick=()=>{
      if(!Game.createSlot(name)){ this.renderHome(); return; }
      this._afterEnter('new');
    };
    card.querySelector('#lnBack').onclick=()=>this.renderHome();
  },
  /* 名号在册：回去当差 / 撕掉重玩（二次确认） */
  renderSlot(meta){
    const card=this.$(); card.className='login-card';
    card.innerHTML=`
      <div class="slot-card">
        <div class="slot-name">${meta.name}</div>
        <div class="slot-meta">
          <span>现任 <b>${this._rankName(meta.rank)}</b></span>
          <span>第 <b>${meta.chapter||1}</b> 章</span>
          <span>第 <b>${meta.month}</b> 月 <b>${meta.day}</b> 日</span>
          <span>香火钱 <b>${meta.money}</b> 文</span>
        </div>
        <div class="login-actions">
          <button class="btn btn-primary btn-lg" id="lnGo">回去当差</button>
          <button class="btn btn-ghost" id="lnReset">撕掉劳务契，重玩此号</button>
        </div>
        <button class="slot-back" id="lnBack">‹ 返回名册</button>
      </div>`;
    card.querySelector('#lnGo').onclick=()=>{
      if(!Game.login(meta.id)){ alert('此份档案读取失败，可能已被清除'); this.renderHome(); return; }
      this._afterEnter('continue');
    };
    /* 撕掉重玩：两步确认，4 秒内不点第二下自动还原 */
    const resetBtn=card.querySelector('#lnReset');
    let arm=false, armTimer=null;
    resetBtn.onclick=()=>{
      if(!arm){
        arm=true;
        resetBtn.textContent='再点一次确认：本号进度全部清零';
        resetBtn.classList.add('btn-danger'); resetBtn.classList.remove('btn-ghost');
        armTimer=setTimeout(()=>{
          arm=false;
          resetBtn.textContent='撕掉劳务契，重玩此号';
          resetBtn.classList.remove('btn-danger'); resetBtn.classList.add('btn-ghost');
        },4000);
        return;
      }
      clearTimeout(armTimer);
      if(!Game.login(meta.id)){ alert('此份档案读取失败，可能已被清除'); this.renderHome(); return; }
      Game.restartSlot();
      this._afterEnter('restart');
    };
    card.querySelector('#lnBack').onclick=()=>this.renderHome();
  },
  /* 登录/新建/重开/认领 统一进门：先过点卯门，再开衙 */
  _afterEnter(mode){
    Stats.recalc();
    /* 异常退出时若在执行单中，安全复位（当天工单重刷） */
    if(Game.s && Game.s.busy){ Game.s.busy=false; Shelf.refresh(); Game.save(); }
    const keys=BOOT.requiredKeys();
    const tip=(mode==='continue'||mode==='claim')?'调取你的案卷…':'点卯到任，先领文书…';
    gate(keys,tip).then(()=>{
      $('intro').classList.add('hidden');
      UI.view='office'; UI.tab='desk'; UI.render(); warmAll();
      setTimeout(()=>PWA.maybeShow(),2500);   /* 进门后再轻声提一句安装 */
      if(mode==='continue'||mode==='claim'){
        if(typeof Guide!=='undefined') Guide.autoStart();
      }else{
        UI.toast(mode==='restart'?'旧契已撕，从头再来':'画押已成，从此你就是天庭的人了（外包）');
        if(typeof Guide!=='undefined') Guide.begin();
      }
    });
  },
};

window.addEventListener('DOMContentLoaded', ()=>{

  /* ---- Service Worker：浏览器/PWA 下图片持久落盘、二次访问秒开 ----
     Capacitor WebView（https://localhost）可注册则注册，失败静默——APP 内不依赖 SW：
     图片缓存由 ASSET 的 blob 内存层 + WebView 自身 HTTP 缓存双重保证，SW 缺席也不影响看图。
     file:// 直开时浏览器不允许注册 SW，条件天然跳过。 */
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }

  /* 顶栏头像：点开玩家自身立绘卷 */
  document.querySelector('.brand-seal').addEventListener('click', ()=>UI.openPlayerPortrait());

  /* 名册加载 → 轻量启动门（只拉首批小图）→ 纯封面 → 点击进登录卡 */
  Game.loadRoster();
  spawnLoginDust();
  BOOT.run();
  Login.show();

  $('coverEnter').addEventListener('click', e=>{ e.stopPropagation(); Login.toLogin(); });
  $('loginCover').addEventListener('click', ()=>Login.toLogin());
  $('loginBack').addEventListener('click', ()=>Login.toCover());

  /* PWA 安装引导 */
  PWA.init();
  $('pwaInstall').addEventListener('click', ()=>PWA.install());
  $('pwaClose').addEventListener('click', ()=>PWA.close());

  /* 防止意外关页丢档：所有关键动作内已即时存档 */
});
