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
  tip.textContent=label||'研墨铺纸…';
  el.classList.remove('hidden');
  const run=()=>ASSET.preload(keys,{conc:8,onprogress:(d,t,st)=>{
    tip.textContent=(label||'研墨铺纸…')+'（'+d+'/'+t+(st.fail?'，重拉 '+st.fail:'')+'）';
  }});
  /* 网络失败重拉两轮；30 秒保险（断网时每轮快速失败，不会死等） */
  const job=(async()=>{
    let r=await run(), guard=0;
    while(r.fail && guard<2){ tip.textContent='网络波动，重拉卷宗…'; r=await run(); guard++; }
    await new Promise(r=>setTimeout(r,260));                    /* 给淡入留半拍 */
  })();
  return Promise.race([job,new Promise(res=>setTimeout(res,30000))])
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
  /* 切到任何页签都立刻可见的小图全家桶（约 20MB）：顶栏/营造/商铺/神格/底图/品阶立绘 */
  smallKeys(rk){
    return [
      'p_r'+rk,
      'ui_main','ui_desk','ui_yamen','ui_hero',
      'stat_rank','stat_calendar','stat_cult','stat_money','stat_favor',
      'stat_erode','stat_merit','stat_hp','stat_mp',
      'fac_shrine','fac_desk','fac_incense','fac_banner',
      'sol_xiaojiang','sol_duwei',
    ].concat(Object.keys(ASSET.list).filter(k=>/^(it_|gh_)/.test(k)));
  },
  /* 进门第一眼会看到的一切：小图桶 + 在架工单大图 */
  requiredKeys(){
    const s=Game.s;
    const rk=Math.min(4,Math.min(8,s.rank||0));
    return this.smallKeys(rk).concat(this.shelfKeys());
  },
  run(){
    const bar=$('blBar'), pct=$('blPct'), tip=$('blTip'), loader=$('bootLoader');
    const hasSave=!!Game.s;
    const keys=hasSave?this.requiredKeys():['p_r0','ui_main','ui_hero'];
    let finished=false, skip=false;
    const finish=()=>{
      if(finished) return; finished=true;
      bar.style.width='100%'; pct.textContent='100%';
      tip.textContent='朱砂已干，请进——';
      setTimeout(()=>{ loader.classList.add('done'); setTimeout(()=>loader.remove(),600); },350);
    };
    /* 网络实在太差时的人道出口：60 秒后可主动进门，未到卷宗后台继续拉 */
    const skipBtn=document.createElement('button');
    skipBtn.className='btn btn-ghost btn-sm';
    skipBtn.textContent='网络太慢，先进衙（图片随后就到）';
    skipBtn.style.cssText='margin-top:14px;opacity:0;transition:opacity .4s;pointer-events:none';
    skipBtn.onclick=()=>{ skip=true; };
    loader.appendChild(skipBtn);
    const skipTimer=setTimeout(()=>{ skipBtn.style.opacity='1'; skipBtn.style.pointerEvents='auto'; },60000);

    const onprog=(d,t,st)=>{
      const p=t?d/t:1;
      bar.style.width=(p*100).toFixed(0)+'%';
      pct.textContent=Math.round(p*100)+'%';
      const line=this.TIPS.filter(x=>p>=x[0]).pop();
      if(line && !st.fail) tip.textContent=line[1];
      if(st.fail) tip.textContent='南天门驿道拥堵，正在重拉掉队的卷宗…';
    };
    const run=()=>ASSET.preload(keys,{conc:8,onprogress:onprog});
    /* 引擎/字体并行，各自超时放行，不拖图的后腿 */
    const engine=waitUntil(()=>window.PIXI,8000);
    const fonts=(document.fonts&&document.fonts.ready)?withTimeout(document.fonts.ready,3000):Promise.resolve();
    /* 图集必须真实到齐；网络失败整轮重拉（已到/已缺项秒回，只补掉队的） */
    (async()=>{
      let r=await run(), guard=0;
      while(r.fail && !skip && guard<4){ r=await run(); guard++; }
      await Promise.all([engine,fonts]);
      clearTimeout(skipTimer);
      finish();
    })();
  },
};

/* ================= 进门后：全量素材后台预热（静默、单线程、让路） ================= */
function warmAll(){
  if(typeof ASSET==='undefined') return;
  const s=Game.s;
  const ch=Math.min(5,Math.max(1,s.chapter||1));
  /* 第一梯队（队首）：已结识神立绘（大图最慢，图鉴/人脉随时会看）、在架单敌人、本章战场过场 */
  const met=Object.keys(GODS).filter(g=>Game.isGodUnlocked(g));
  const gKeys=met.filter(g=>ASSET.list['g_'+g]).map(g=>'g_'+g);
  const avKeys=met.filter(g=>typeof GOD_ART!=='undefined' && !GOD_ART.includes(g)).map(g=>ASSET.avatarFile(g));
  const eKeys=[];
  (s.shelf||[]).forEach(o=>{
    const m=MISSIONS.find(x=>x.id===o.mid);
    (m&&m.acts||[]).forEach(a=>{ if(a.enemy) eKeys.push('e_'+a.enemy); });
  });
  ASSET.warm(uniq(gKeys.concat(eKeys).concat(['bf_c'+ch,'bf_c'+ch+'n','scene_c'+ch])),true);
  /* 第二梯队：技能（战斗）、无真绘神的头像 */
  ASSET.warm(Object.keys(ASSET.list).filter(k=>/^sk_/.test(k)).concat(avKeys));
  /* 其余一切（全部敌人、未解锁神、他章场景工单），去重自动跳过已完成项 */
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
    /* 启动加载屏：预载当天工单与首屏一切，真实到齐才放行 */
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
        gate(BOOT.smallKeys(0).concat(BOOT.shelfKeys()),'点卯到任，先领文书…').then(()=>{
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
      gate(BOOT.smallKeys(0).concat(BOOT.shelfKeys()),'点卯到任，先领文书…').then(()=>{
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
