/* ================= 天道打工人 · 启动（BOOT 预载门） =================
   1) 启动加载屏：引擎/字体 + 进门必修图集全部就绪才放行（硬超时兜底）
   2) 点入职/续玩：小遮罩等当天工单图就绪再渲染，绝不“进去了图还没到”
   3) 进门后：剩余全部素材后台空闲预热（ASSET.warm），真实请求自动让路
   4) Service Worker 持久缓存图片，二次访问本地秒开 */

/* 轮询等待某条件成立（带超时，超时也算放行） */
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

/* ================= 小型“点卯”遮罩：切场景前等图 ================= */
function gate(keys, label){
  if(!keys||!keys.length) return Promise.resolve();
  const el=$('bootGate'); $('bgTip').textContent=label||'研墨铺纸…';
  el.classList.remove('hidden');
  const job=ASSET.preload(keys,{conc:6});
  return Promise.race([job,new Promise(res=>setTimeout(res,8000))])
    .then(()=>new Promise(r=>setTimeout(r,260)))           /* 给淡入留半拍 */
    .finally(()=>el.classList.add('hidden'));
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
  /* 当天在架工单涉及的图：专属场景 + 神仙立绘 */
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
  /* 进门第一眼会看到的一切 */
  requiredKeys(){
    const s=Game.s;
    const ch=Math.min(5,Math.max(1,s.chapter||1));
    const rk=Math.min(4,Math.min(8,s.rank||0));
    return [
      'p_r'+rk,
      'ui_main','ui_desk','ui_yamen','ui_hero',
      'bf_c'+ch,'bf_c'+ch+'n','scene_c'+ch,
      'stat_rank','stat_calendar','stat_cult','stat_money','stat_favor',
      'stat_erode','stat_merit','stat_hp','stat_mp',
    ].concat(this.shelfKeys());
  },
  run(){
    const bar=$('blBar'), pct=$('blPct'), tip=$('blTip'), loader=$('bootLoader');
    const hasSave=!!Game.s;
    const keys=hasSave?this.requiredKeys():['p_r0','ui_main','ui_hero'];
    let finished=false;
    const finish=()=>{
      if(finished) return; finished=true;
      bar.style.width='100%'; pct.textContent='100%';
      tip.textContent='朱砂已干，请进——';
      setTimeout(()=>{ loader.classList.add('done'); setTimeout(()=>loader.remove(),600); },350);
    };
    /* 图集进度（占大头） */
    const imgJob=ASSET.preload(keys,{conc:6,onprogress:(d,t)=>{
      const p=t?d/t:1;
      bar.style.width=(p*100).toFixed(0)+'%';
      pct.textContent=Math.round(p*100)+'%';
      const line=this.TIPS.find(x=>p<x[0]+0.001)?null:this.TIPS.filter(x=>p>=x[0]).pop();
      if(line) tip.textContent=line[1];
    }});
    /* 引擎/字体并行，不相互拖后腿，各自超时放行 */
    const engine=waitUntil(()=>window.PIXI,5000);
    const fonts=(document.fonts&&document.fonts.ready)?withTimeout(document.fonts.ready,3000):Promise.resolve();
    /* 全齐放行；网络极差时 25 秒硬保底，未完成的转后台继续 */
    Promise.race([Promise.all([imgJob,engine,fonts]),new Promise(res=>setTimeout(res,25000))])
      .then(finish);
  },
};

/* ================= 进门后：全量素材后台预热（静默，让路） ================= */
function warmAll(){
  if(typeof ASSET==='undefined') return;
  const s=Game.s;
  const ch=Math.min(5,Math.max(1,s.chapter||1));
  const rk='p_r'+Math.min(4,Math.min(8,s.rank||0));
  /* P0：衙门设施/阴兵 + 五系神格底图/技能（战斗在即） */
  const p0=['fac_shrine','fac_desk','fac_incense','fac_banner','sol_xiaojiang','sol_duwei']
    .concat(Object.keys(ASSET.list).filter(k=>/^(sk_|gh_)/.test(k)));
  /* P1：已结识神立绘+头像、本章战场/过场 */
  const unlocked=Object.keys(GODS).filter(g=>Game.isGodUnlocked(g));
  const p1=unlocked.filter(g=>ASSET.list['g_'+g]).map(g=>'g_'+g)
    .concat(['bf_c'+ch,'bf_c'+ch+'n','scene_c'+ch,rk]);
  const av=unlocked.map(g=>ASSET.avatarFile(g));
  /* P2：敌人立绘 */
  const p2=Object.keys(ASSET.list).filter(k=>/^e_/.test(k));
  /* 先排普通队列，再把 P0 提到队首：保证最先下的是马上要用的 */
  ASSET.warm(p1); ASSET.warm(av); ASSET.warm(p2);
  ASSET.warm(p0,true);
  /* 其余一切（物品图标/未解锁神/其余章节场景工单），稍后补排，去重自动跳过 */
  setTimeout(()=>ASSET.warm(Object.keys(ASSET.list)),3000);
}

window.addEventListener('DOMContentLoaded', ()=>{

  /* ---- Service Worker：图片持久缓存，二次访问本地秒开 ---- */
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }

  /* 顶栏头像：点开玩家自身立绘卷 */
  document.querySelector('.brand-seal').addEventListener('click', ()=>UI.openPlayerPortrait());

  /* 开场 / 续玩 */
  const hasSave = Game.load();
  if(hasSave){
    Stats.recalc();
    UI.view = Game.s.busy ? 'office' : 'office';
    /* 异常退出时若在执行单中，安全复位（当天工单重刷） */
    if(Game.s.busy){
      Game.s.busy=false;
      Shelf.refresh();
      Game.save();
    }
    /* 启动加载屏：预载当天工单与首屏一切，齐了才放行 */
    BOOT.run();
    /* 已有存档：直接进衙，开场页轻量放行 */
    const intro=$('intro');
    intro.innerHTML=`<div class="paper intro-card">
      <h1 class="title-brush" style="font-size:40px">天道打工人</h1>
      <p class="intro-sub">神衙的灯笼还亮着，就等你回来</p>
      <div style="margin-top:8px;line-height:2.1;font-size:15px">
        现任：<b>${RANKS[Game.s.rank].name}</b> ｜ 第 ${Game.s.month} 月 ${Game.s.day} 日 ｜ 香火钱 ${Game.s.money} 文
      </div>
    </div>`;
    intro.querySelector('.paper').appendChild((()=>{
      const cont=h('button','btn btn-primary btn-lg','回神衙当值');
      cont.onclick=()=>{
        gate(BOOT.shelfKeys(),'调取在架工单…').then(()=>{
          intro.classList.add('hidden'); UI.render(); warmAll();
          if(typeof Guide!=='undefined') Guide.autoStart();
        });
      };
      return cont;
    })());
    intro.querySelector('.paper').appendChild((()=>{
      const nw=h('button','btn btn-ghost btn-lg','撕碎劳务契重开');
      nw.style.marginLeft='12px';
      nw.onclick=()=>{
        Game.clear(); Game.newGame();
        gate(['ui_main','ui_desk'].concat(BOOT.shelfKeys()),'点卯到任，先领文书…').then(()=>{
          intro.innerHTML='';
          intro.classList.add('hidden'); UI.view='office'; UI.tab='desk'; UI.render(); warmAll();
          if(typeof Guide!=='undefined') Guide.begin();
        });
      };
      return nw;
    })());
  }else{
    /* 新访客：必修集少，快速放行到契约页 */
    BOOT.run();
  }

  /* 入职 */
  document.addEventListener('click', e=>{
    const act=e.target.getAttribute && e.target.getAttribute('data-action');
    if(act==='newGame'){
      Game.newGame();
      gate(['ui_main','ui_desk','ui_hero'].concat(BOOT.shelfKeys()),'点卯到任，先领文书…').then(()=>{
        $('intro').classList.add('hidden');
        UI.view='office';
        UI.render();
        warmAll();
        UI.toast('画押已成，从此你就是天庭的人了（外包）');
        if(typeof Guide!=='undefined') Guide.begin();
      });
    }
  });

  /* 防止意外关页丢档：所有关键动作内已即时存档 */
});
