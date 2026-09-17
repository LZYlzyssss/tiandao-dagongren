/* ================= 天道打工人 · 新手引导 =================
  聚光灯遮罩 + 真实界面手持指引。
  进度持久化于 Game.s.tut = {done, stage}
  stage: start(首单前) / afterSettle(首单后，待巡览) / done
  外部通过 Guide.act(event, payload) 推动状态机。 */
const Guide = {
  active:false,
  step:null,          // 当前步骤 id
  _timer:null,
  _gate:null,         // 当前步骤的点击许可函数
  _pending:null,      // 月末考核弹窗期间挂起的事件
  _battleCount:0,

  /* ---------- 生命周期 ---------- */
  /** 全新入职 / 重看指引 */
  begin(replay){
    const s=Game.s;
    if(!s.tut) s.tut={done:false,stage:'start'};
    s.tut.done=false; s.tut.stage='start';
    Game.save();
    this._battleCount=0; this._momentCount=0; this._pending=null;
    this.start();
  },
  /** 读档续玩时按存档阶段进入 */
  autoStart(){
    const s=Game.s;
    if(!s.tut || s.tut.done) return;
    this._battleCount=0; this._momentCount=0; this._pending=null;
    if(s.tut.stage==='waitingGh'){
      const gids=Object.keys(s.gh||{}).filter(k=>s.gh[k]);
      if(gids.length){
        s.tut.stage='afterSettle'; Game.save();
        this.show('cultEmbed');
      }
      return;
    }
    if(s.tut.stage==='afterSettle') this.show('cultTab');
    else this.show('welcome');
  },
  start(){
    if(Game.s.tut && Game.s.tut.done) return;
    this.show('welcome');
  },
  /** 临时收起（月末考核/死亡通知等弹窗时） */
  suspend(){
    this.clearGate();
    const L=$('guideLayer'); if(L) L.classList.add('hidden');
  },
  /** 引导彻底结束（或暂停等待条件） */
  finish(){
    const s=Game.s;
    if(s.tut && s.tut.stage==='waitingGh'){
      /* v3：第一枚 gh 还没拿到，暂停引导等 gainGodhood 钩子触发 */
      this.active=false; this.step=null;
      this.clearGate(); this.stopTick();
      const L=$('guideLayer'); if(L) L.classList.add('hidden');
      return;
    }
    this.active=false; this.step=null;
    this.clearGate(); this.stopTick();
    const L=$('guideLayer'); if(L) L.classList.add('hidden');
    if(s.tut){ s.tut.done=true; s.tut.stage='done'; Game.save(); }
    if(typeof UI!=='undefined' && UI.view==='office') UI.render();
  },
  skip(){
    this.finish();
    UI.toast('指引已跳过，案牍页随时可点「指引」重看');
  },

  /* ---------- 步骤表 ---------- */
  STEPS:{
    welcome:{center:true,
      title:'画押已成，欢迎外包',
      html:'从此你就是天庭的人了——<b>没有编制</b>的那种。<br>花一两分钟跟着朱笔圈点走一遍：接工单、下凡打架、领神格、逛神衙。',
      btns:[{t:'开始当差',go:'topbar'},{t:'跳过引导',act:'skip'}]},

    topbar:{sel:'#topStats',
      title:'顶栏 · 你的全部身家',
      html:'<b>香火钱</b>是硬通货，<b>人情</b>能给工单加价；<b>本月功过</b>决定考核去留；<b>神躯</b>血条见底，就得回衙躺一天。',
      btns:[{t:'明白了',go:'kpi'}]},

    kpi:{sel:'.kpi-panel',
      title:'三十日一考',
      html:'阎王爷每月亲阅功过簿：本月攒够 <b>50 点功过</b>才算称职（往后每月加码）。<br>不称职记大过，<b>连续两次</b>直接贬作孤魂野鬼。工单每天刷新。',
      btns:[{t:'下一步',go:'order'}]},

    order:{sel:'.order',gate:'firstOrder',
      title:'接第一张工单',
      html:'工单写明了委托神、凶险星级与报酬。<br>跟着朱圈，点第一张工单上的<b>「接案下凡」</b>。<br><span style="color:var(--ink-faint);font-size:12px">加价耗人情、驳可得罪人，新手先原价接单。</span>',
      btns:[]},

    event1:{sel:'.choices',gate:'choices',
      title:'下凡 · 剧情抉择',
      html:'下凡途中常有岔路口：选项各有代价——受伤、蓄力、回血、赚外快；<b>灰色选项</b>要镶嵌了对应道途的神格才点得动。<br>先选一个试试。',
      btns:[]},

    gonode:{sel:'.btn-mish-next',gate:'nextBtn',
      title:'继续前行',
      html:'选得好。前路是凶是吉，点<b>「继续前行」</b>便知。',
      btns:[]},

    battle:{sel:'.battle-wrap',nonblock:true,
      title:'开打！',
      html:'你和敌人会<b>自动对砍</b>，看血条与战报即可。敌人血量吃紧时，会有「关键时刻」等你定夺——',
      btns:[{t:'知道了',close:true}]},

    moment:{sel:'#momentSlot',gate:'moment',
      title:'关键时刻 · 四至五选一',
      html:'<b>祭法宝</b>：耗神力，放觉醒神格的大神通，还能读招克制<br><b>呼神援助</b>（好感 Lv2+ 出现）：相熟以上的神明出手搭救<br><b>拼命</b>：透支神格打爆发，沉睡三日<br><b>凝神接战</b>：稳扎稳打，承伤减半<br><b>遁走</b>：保命，但委托黄了<br><span style="color:var(--cinnabar)">第一次，建议选「凝神接战」。</span>',
      btns:[]},

    eventLater:{sel:'.choices',nonblock:true,
      title:'又到岔路口',
      html:'按心意选就是——没有标准答案，只有不同的代价与机缘。',
      btns:[{t:'知道了',close:true}]},

    momentLater:{sel:'#momentSlot',nonblock:true,
      title:'关键时刻',
      html:'关键时刻又至，按你自己的判断选——打得过就拼命，打不过便走。',
      btns:[{t:'知道了',close:true}]},

    settle:{sel:'.settle',gate:'settle',
      title:'论功行赏',
      html:'香火钱、功过、人情到手。高阶神可能切一块<b>神格</b>给你（涨修为、有几率觉醒大神通）；低阶神给<b>碎末</b>攒同系五枚也能凝格；还有同名碎片、妖丹等报酬。<br>点<b>「回神衙」</b>，教你把神格嵌进神格盘。',
      btns:[]},

    fail:{center:true,
      title:'胜败乃兵家常事',
      html:'第一次当差难免失手……阴兵已把你抬回神衙。<br>罚过的钱心疼一阵就过去了，养足精神，再接一单便是。',
      btns:[{t:'重整旗鼓',go:'order'}]},

    cultTab:{gate:'tab:cult',
      title:'去「悟 · 修行」',
      html:'跟着朱圈，点底部<b>「悟 · 修行」</b>标签，看看刚挣来的神格。',
      btns:[]},

    cultEmbed:{sel:'.gh-list',gate:'cultOps',
      title:'把神格嵌进神格盘',
      html:'在神格列表找到新神格，点<b>「镶嵌」</b>入盘；嵌上才加属性，战斗中才催得动。（点盘中神格可取下）',
      btns:[],
      _checkGhEmpty:true,  // v3 标记：进入时若无 gh 则走 waitingGh 分支
      _skipNoGh:true},     // 无 gh 时自动跳到 cultTalk

    cultTalk:{sel:'.slots',
      title:'神格盘的门道',
      html:'同道系（兵/法/幽/生/火）嵌两枚有<b>共鸣</b>加成；齐聚四格出「强化共鸣」。<br><b>道争</b>：兵⟷法、幽⟷生同嵌，神力上限 −20%（侵蚀 40+ 扩至 −30%）。<br>未觉醒可花香火钱「参悟」；两枚都觉醒还能「融合」出更强神格。',
      btns:[{t:'下一步',go:'yamenTab'}]},

    cultGhEmpty:{center:true,nonblock:true,
      title:'你的第一枚神格还在路上',
      html:'修行页底部目前只有<b>碎末</b>——攒够同系 5 枚，或打完后续工单，就能拿到第一块整格。<br>镶嵌神格这件事，等它来了我再带你做～神衙、商铺、装备、我的这几个页，你自己先逛着熟悉下。',
      btns:[{t:'好，等我拿到神格再说',act:'finish'}]},

    yamenTab:{gate:'tab:yamen',
      title:'去「衙 · 神衙」',
      html:'点底部<b>「衙 · 神衙」</b>，看看你的破衙门。',
      btns:[]},

    yamenTalk:{sel:'.yamen',
      title:'破神衙也是家底',
      html:'这里可<b>营造设施</b>（觉醒率/工单架/神力/阴兵编制）、<b>招募阴兵</b>助战，残血时还能<b>休整一日</b>回满状态。',
      btns:[{t:'下一步',go:'shopTab'}]},

    shopTab:{gate:'tab:shop',
      title:'去「市 · 商铺」',
      html:'点底部<b>「市 · 商铺」</b>。',
      btns:[]},

    shopTalk:{sel:'.shop-intro',
      title:'阴阳百宝铺',
      html:'商铺分<b>兵刃/护身/奇物/礼单</b>四栏，装备页三栏佩饰；闲置旧物老道只肯按<b>半价</b>回收。<br>「礼单」上的物件买了送神明——在工单架点头像开档案送礼，好感到位时关键时刻有人搭手。',
      btns:[{t:'下一步',go:'equipTab'}]},

    equipTab:{gate:'tab:equip',
      title:'去「宝 · 装备」',
      html:'点底部<b>「宝 · 装备」</b>。',
      btns:[]},

    equipTalk:{sel:'.wear-slots',
      title:'三栏佩饰',
      html:'三栏<b>各佩一件</b>；同栏换新装时，旧法宝自动收回行囊，不会丢失。',
      btns:[{t:'下一步',go:'meTab'}]},

    meTab:{gate:'tab:me',
      title:'去「吾 · 我的」',
      html:'点底部<b>「吾 · 我的」</b>，看看你的神躯战册。',
      btns:[]},

    meTalk:{sel:'.stat-grid',
      title:'神躯战册',
      html:'六维数值、生效中的被动与法宝词条、在身神格、麾下阴兵，都在此盘点。',
      btns:[{t:'下一步',go:'deskTab'}]},

    deskTab:{gate:'tab:desk',
      title:'回到「牍 · 案牍」',
      html:'最后，点<b>「牍 · 案牍」</b>回到工位。',
      btns:[]},

    finale:{center:true,
      title:'指引到此结束',
      html:'往后的日子就是：<b>接案 → 下凡 → 领神格 → 置家业 → 月末考核</b>。<br>连续称职，能从九品阴神一路升到判官；阎王的<b>官遣单</b>到达时，案牍标签会亮红点。<br><br>祝打工愉快，早日转正。',
      btns:[{t:'我已知晓，开工',act:'finish'}]},
  },

  /* ---------- 渲染 ---------- */
  show(id){
    /* v3：进入 cultEmbed 前先看有没有整格——没有就走 waitingGh 分支 */
    if(id==='cultEmbed'){
      const gh=Game.s.gh||{};
      const gids=Object.keys(gh).filter(k=>gh[k]);
      if(!gids.length){
        if(Game.s.tut){ Game.s.tut.stage='waitingGh'; Game.save(); }
        this.show('cultGhEmpty'); return;
      }
      /* 有 gh 了，说明之前可能存过 waitingGh，清掉 */
      if(Game.s.tut && Game.s.tut.stage==='waitingGh'){ Game.s.tut.stage='afterSettle'; Game.save(); }
    }
    const d=this.STEPS[id]; if(!d) return;
    this.active=true; this.step=id;
    const L=$('guideLayer'); L.classList.remove('hidden');
    L.innerHTML='';
    const card=h('div','guide-card');
    card.innerHTML=`
      <div class="gc-head">
        <span class="gc-badge">新手引导</span>
        <span class="gc-skip" id="gcSkip">跳过 ✕</span>
      </div>
      <h3>${d.title}</h3>
      <p>${d.html||''}</p>
      <div class="gc-actions"></div>`;
    const acts=card.querySelector('.gc-actions');
    (d.btns||[]).forEach(b=>{
      const btn=h('button', b.act==='skip'?'btn btn-sm':'btn btn-primary btn-sm', b.t);
      btn.onclick=()=>{
        if(b.act==='skip'){ this.skip(); return; }
        if(b.act==='finish'){ this.finish(); return; }
        if(b.close){ this.closeNonblock(); return; }
        if(b.go) this.goto(b.go);
      };
      acts.appendChild(btn);
    });
    L.appendChild(card);
    this._card=card;

    /* 非阻断提示：不装护栏，不出现跳过时允许关 */
    if(d.nonblock){
      this.setGate(null);
    }else{
      this.installGate(d);
    }
    this.startTick();
    /* 先把目标滚到可见，再定位 */
    const el=this.targetEl();
    if(el && typeof el.scrollIntoView==='function' && !d.center){
      el.scrollIntoView({block:'center',behavior:'smooth'});
    }
    setTimeout(()=>this.reposition(), d.center?0:320);
  },

  goto(id){ this.show(id); },

  closeNonblock(){
    /* 仅关闭当前非阻断卡片，引导保持活跃等待后续事件 */
    const L=$('guideLayer');
    if(L) L.classList.add('hidden');
  },

  /** 办公视图重新渲染后，重新定位聚光灯 */
  afterRender(){
    if(!this.active) return;
    if(UI.view!=='office') return;
    const d=this.STEPS[this.step];
    if(!d) return;
    /* order 步骤遇案头空空：给休整入口 */
    if(this.step==='order' && !document.querySelector('.order')){
      this.showEmptyShelf();
      return;
    }
    const L=$('guideLayer');
    if(L.classList.contains('hidden') && !d.nonblock) L.classList.remove('hidden');
    this.installGate(d);
    this.reposition();
  },

  showEmptyShelf(){
    const L=$('guideLayer'); L.classList.remove('hidden'); L.innerHTML='';
    const card=h('div','guide-card');
    card.innerHTML=`
      <div class="gc-head"><span class="gc-badge">新手引导</span>
        <span class="gc-skip" id="gcSkip">跳过 ✕</span></div>
      <h3>今日案头已空</h3>
      <p>工单已被处理完了。去神衙<b>「休整一日」</b>翻到明天，案头会刷新新工单。</p>
      <div class="gc-actions"></div>`;
    const b=h('button','btn btn-primary btn-sm','去神衙休整');
    b.onclick=()=>{ Game.rest(); this.show('order'); };
    card.querySelector('.gc-actions').appendChild(b);
    L.appendChild(card);
    this._card=card; this.setGate(null); this.startTick(); this.reposition();
  },

  targetEl(){
    const d=this.STEPS[this.step]; if(!d||!d.sel) return null;
    return document.querySelector(d.sel);
  },

  /* ---------- 定位 ---------- */
  reposition(){
    if(!this.active) return;
    const d=this.STEPS[this.step]; if(!d) return;
    const L=$('guideLayer'), spot=L.querySelector('.guide-spot'), card=this._card;
    if(!card) return;
    const vw=innerWidth, vh=innerHeight;

    if(d.center){
      if(spot) spot.style.display='none';
      card.style.left='50%'; card.style.top='50%';
      card.style.transform='translate(-50%,-50%)';
      card.style.maxHeight='80vh';
      return;
    }
    const el=this.targetEl();
    if(!el){
      /* 目标暂时不在（界面切换中）：藏起聚光灯，卡片留中 */
      if(spot) spot.style.display='none';
      card.style.left='50%'; card.style.top='50%';
      card.style.transform='translate(-50%,-50%)';
      return;
    }
    const r=el.getBoundingClientRect();
    if(r.width===0 && r.height===0){ return; }
    const pad=8;
    if(!spot){
      const ns=h('div','guide-spot'); L.insertBefore(ns,card);
    }
    const sp=L.querySelector('.guide-spot');
    sp.style.display='block';
    sp.style.left=(r.left-pad)+'px';
    sp.style.top=(r.top-pad)+'px';
    sp.style.width=(r.width+pad*2)+'px';
    sp.style.height=(r.height+pad*2)+'px';

    /* 卡片：优先下方，空间不够则上方 */
    card.style.transform='none';
    card.style.maxHeight='';
    const cw=Math.min(340, vw-24);
    card.style.width=cw+'px';
    let left=Math.min(Math.max(12, r.left), vw-cw-12);
    let top=r.bottom+16;
    if(top+160>vh-10 && r.top>200){ top=Math.max(10, r.top-16-card.offsetHeight); }
    if(top<10) top=Math.max(10, vh-card.offsetHeight-70);
    card.style.left=left+'px'; card.style.top=top+'px';
  },

  startTick(){
    this.stopTick();
    this._timer=setInterval(()=>this.reposition(), 300);
  },
  stopTick(){ if(this._timer){ clearInterval(this._timer); this._timer=null; } },

  /* ---------- 点击护栏（只许点朱圈内的真实控件） ---------- */
  installGate(d){
    let gate=null;
    const g=d.gate;
    if(!g){ gate=t=>!!t.closest('#guideLayer'); }          // 纯说明步：只许点卡片
    else if(g==='firstOrder'){
      const btn=document.querySelector('.order .btn-primary');
      gate=t=>!!t.closest('#guideLayer')||(btn&&(t===btn||btn.contains(t)));
    }
    else if(g==='choices'){
      gate=t=>!!t.closest('#guideLayer')||!!t.closest('.choices');
    }
    else if(g==='nextBtn'){
      const btn=document.querySelector('.btn-mish-next');
      gate=t=>!!t.closest('#guideLayer')||(btn&&(t===btn||btn.contains(t)));
    }
    else if(g==='moment'){
      gate=t=>!!t.closest('#guideLayer')||!!t.closest('#momentSlot');
    }
    else if(g==='settle'){
      gate=t=>!!t.closest('#guideLayer')||!!t.closest('.settle');
    }
    else if(g==='cultOps'){
      gate=t=>!!t.closest('#guideLayer')||!!t.closest('.gh-list')||!!t.closest('.slots');
    }
    else if(typeof g==='string' && g.indexOf('tab:')===0){
      const wanted=g.slice(4);
      const btn=document.querySelector(`.tab[data-tab="${wanted}"]`);
      gate=t=>!!t.closest('#guideLayer')||(btn&&(t===btn||btn.contains(t)));
    }
    this.setGate(gate);
  },
  setGate(fn){
    this.clearGate();
    this._gate=fn;
    if(fn){
      document.addEventListener('pointerdown',this._guard,true);
      document.addEventListener('click',this._guard,true);
    }
  },
  clearGate(){
    if(this._gate){
      document.removeEventListener('pointerdown',this._guard,true);
      document.removeEventListener('click',this._guard,true);
    }
    this._gate=null;
  },
  _guard(e){
    if(!Guide._gate) return;
    if(Guide._gate(e.target)) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    if(Guide._card){
      Guide._card.classList.remove('gc-shake');
      void Guide._card.offsetWidth;
      Guide._card.classList.add('gc-shake');
    }
  },

  /* ---------- 事件状态机（由 UI/state 钩子调用） ---------- */
  act(ev, p){
    /* waitingGh 暂停态仅放行 backOffice（用于拿到首枚神格后恢复引导）*/
    if(!this.active && ev!=='backOffice') return;
    const s=this.step;

    if(ev==='startMission'){
      this._battleCount=0;
      const node=this.firstNode();
      if(node && node.type==='battle') this.battleIntro();
      else this.show('event1');
      return;
    }
    if(ev==='eventNode'){
      /* 后续剧情节点（战后）给一条非阻断提示 */
      if(s!=='event1' && s!=='gonode' && this._battleCount>=1){
        this.show('eventLater');
      }
      return;
    }
    if(ev==='chooseEvent'){
      if(s==='event1'){ this.show('gonode'); }
      else if(s==='eventLater'){ this.closeNonblock(); }
      return;
    }
    if(ev==='nextNode'){
      if(s!=='gonode') return;
      const node=this.curNode();
      if(node && node.type==='battle') this.battleIntro();
      else this.show('eventLater');
      return;
    }
    if(ev==='battle'){
      this._battleCount++;
      if(this._battleCount===1 && s!=='moment' && s!=='battle') this.battleIntro();
      return;
    }
    if(ev==='momentOpen'){
      this._momentCount=(this._momentCount||0)+1;
      this.show(this._momentCount===1?'moment':'momentLater');
      return;
    }
    if(ev==='momentDone'){
      if(s==='moment'){ this.suspend(); this.step='eventLater'; this.active=true; }
      else if(s==='momentLater'){ this.closeNonblock(); }
      return;
    }
    if(ev==='settle'){ this.show('settle'); return; }
    if(ev==='backOffice'){
      /* waitingGh 暂停态（active=false）下拿到首枚神格后，
         玩家点结算「回神衙」由此恢复引导，走标准巡览流程 */
      if(!this.active){
        const t0=Game.s.tut;
        const hasGh=Object.keys(Game.s.gh||{}).some(k=>Game.s.gh[k]);
        if(!t0||t0.done||t0.stage!=='waitingGh'||!hasGh) return;
        this.active=true;
      }
      if($('modalLayer').children.length){ this._pending='backOffice'; this.suspend(); return; }
      this.toTour();
      return;
    }
    if(ev==='missionFail'){ this._pending='fail'; this.suspend(); return; }
    if(ev==='noticeClosed'){
      if(this._pending==='fail'){ this._pending=null; this.show('fail'); }
      return;
    }
    if(ev==='review'){ if(!this._pending) this._pending='backOffice'; this.suspend(); return; }
    if(ev==='reviewed'){
      const pend=this._pending; this._pending=null;
      if(pend==='fail'){ this.show('fail'); }
      else if(pend==='backOffice'){ this.toTour(); }
      return;
    }
    if(ev==='gameover'){ this.finish(); return; }
    if(ev==='toggleEquip'){
      if(s==='cultEmbed') this.show('cultTalk');
      return;
    }
    if(ev==='tab'){
      const want={cultTab:'cult',yamenTab:'yamen',shopTab:'shop',equipTab:'equip',meTab:'me',deskTab:'desk'}[s];
      if(want && p===want) this.nextAfterTab(want);
      return;
    }
  },

  nextAfterTab(tab){
    const map={cult:'cultEmbed',yamen:'yamenTalk',shop:'shopTalk',equip:'equipTalk',me:'meTalk',desk:'finale'};
    this.show(map[tab]);
  },

  toTour(){
    const s=Game.s;
    if(s.tut){ s.tut.stage='afterSettle'; Game.save(); }
    this.show('cultTab');
  },

  battleIntro(){
    const L=$('guideLayer');
    if(L.classList.contains('hidden')) L.classList.remove('hidden');
    this.show('battle');
  },

  firstNode(){ if(!UI.mission) return null; const m=UI.mission(); return m?(UI.curNodes?UI.curNodes():m.nodes)[UI.rt.node]:null; },
  curNode(){ if(!UI.mission) return null; const m=UI.mission(); return m?(UI.curNodes?UI.curNodes():m.nodes)[UI.rt.node]:null; },
};

/* 跳过按钮的全局委托（卡片每次重建） */
document.addEventListener('click', e=>{
  if(e.target && e.target.id==='gcSkip') Guide.skip();
});
/* 窗口变化时重定位（tick 也会兜底） */
window.addEventListener('resize', ()=>{ if(Guide.active) Guide.reposition(); });
