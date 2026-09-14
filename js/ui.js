/* ================= 天道打工人 · 界面层 ================= */
const $ = id => document.getElementById(id);
const h = (tag, cls, html)=>{ const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };
const imgURL = (prompt,size)=>`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size||'square'}`;
function godAvatar(key,px){
  const g=GODS[key];
  return `<span class="gh-ava" style="width:${px}px;height:${px}px;font-size:${Math.round(px*.5)}px"><span>${g.icon}</span><img alt="${g.name}" src="${imgURL(g.img)}" onload="this.classList.add('loaded')" onerror="this.style.display='none'"></span>`;
}
const YAMEN_BG = imgURL('Chinese ink wash landscape painting of a lonely ancient yamen office temple at the misty border between mortal world and underworld, distant mountains, one red lantern glowing, sumi-e style with faint cinnabar red and indigo blue color accents, rice paper','landscape_16_9');

const UI = {
  view:'office',     // office | mission | battle | settle
  rt:null,           // 下凡运行时 {order, mid, node, ctx, lastResult}
  _momentResolve:null,

  toast(msg){
    const t=h('div','toast',msg); $('toastLayer').appendChild(t);
    setTimeout(()=>t.remove(),2300);
  },

  /* ================= 总渲染 ================= */
  render(){
    if(!Game.s) return;
    this.renderTop();
    this.renderLeft();
    this.renderRight();
    if(this.view==='office') this.renderOffice();
    /* mission/battle/settle 视图由各自流程维护 */
  },

  renderTop(){
    const s=Game.s, st=Stats.cur(), rk=RANKS[s.rank];
    const target=monthTarget(s.month);
    $('topStats').innerHTML = `
      <div class="stat-chip"><span class="k">品阶</span><span class="v">${rk.name}</span></div>
      <div class="stat-chip"><span class="k">两界日历</span><span class="v">${s.month}<small>月</small> ${s.day}<small>日</small></span></div>
      <div class="stat-chip"><span class="k">修为</span><span class="v">${s.cult}</span></div>
      <div class="stat-chip"><span class="k">香火钱</span><span class="v">${s.money}<small> 文</small></span></div>
      <div class="stat-chip"><span class="k">人情</span><span class="v">${s.favor}</span></div>
      <div class="stat-chip ${s.merit>=target?'':'kpi-hot'}">
        <span class="k">本月功过</span><span class="v">${s.merit}/${target}</span>
      </div>
      <div class="stat-chip bar-chip">
        <span class="k">神躯 ${Math.max(0,Math.round(s.hp))}/${st.maxHp} ｜ 神力 ${st.maxMp}</span>
        <div class="bar"><i class="bar-hp" style="width:${Math.max(0,s.hp/st.maxHp*100)}%"></i></div>
      </div>`;
  },

  /* ================= 左栏：工单架 ================= */
  renderLeft(){
    const c=$('colLeft'); c.innerHTML='';
    const p=h('div','panel');
    p.innerHTML=`<h2>工单架 <span class="sub">神仙们的脏活累活</span></h2>`;
    if(Game.s.busy){
      const m=MISSIONS.find(x=>x.id===this.rt.mid), god=GODS[m.god];
      p.appendChild(h('div','order',`
        <div class="o-god">${god.name} · ${god.title} · 委托执行中</div>
        <div class="o-title">${m.name}</div>
        <div class="o-scroll" style="margin-top:6px">你正在两界之间办差，办完自会回衙。</div>`));
      c.appendChild(p); return;
    }
    if(!Game.s.shelf.length){
      p.appendChild(h('div','shelf-empty','案头空空如也。<br>明日兴许就有新工单了。'));
    }
    Game.s.shelf.forEach((o,idx)=>{
      const m=MISSIONS.find(x=>x.id===o.mid), god=GODS[m.god];
      const card=h('div','order'+(m.forced?' forced':''));
      card.innerHTML=`
        <div style="display:flex;gap:10px;align-items:flex-start">
          ${godAvatar(m.god,40)}
          <div class="o-body" style="flex:1;min-width:0">
            <div class="o-head">
              <span class="o-title">${m.name}</span>
              <span>${'★'.repeat(m.danger)}<span style="color:var(--line)">${'★'.repeat(5-m.danger)}</span></span>
            </div>
            <div class="o-god">${god.name} · ${god.title} ${o.bargain?'<span style="color:var(--cinnabar)">【已加价 +50%】</span>':''}</div>
            <div class="o-scroll">${m.scroll}</div>
            <div class="o-meta">
              <span class="tag tag-gh">神格·${GODHOODS[m.gh].name}</span>
              <span class="tag tag-money">${Math.round(m.money*(o.bargain?1.5:1))} 文</span>
              <span class="tag tag-merit">功过 ${m.merit}</span>
              ${m.forced?'<span class="tag tag-forced">官遣</span>':''}
            </div>
          </div>
        </div>`;
      const acts=h('div','o-actions'); acts.style.marginTop='8px';
      const go=h('button','btn btn-primary btn-sm','接案下凡');
      go.onclick=()=>this.startMission(idx);
      acts.appendChild(go);
      if(!m.forced){
        const b=h('button','btn btn-sm','加价');
        b.disabled=o.bargain||Game.s.favor<=0;
        b.title='耗 1 点人情，香火钱报酬 +50%';
        b.onclick=()=>Game.bargain(idx);
        acts.appendChild(b);
        const r=h('button','btn btn-ghost btn-sm','驳回');
        r.onclick=()=>{ Game.reject(idx); this.toast('工单被你卷成一团丢进纸篓'); };
        acts.appendChild(r);
      }
      card.appendChild(acts); p.appendChild(card);
    });
    c.appendChild(p);
  },

  /* ================= 中栏：神衙 ================= */
  renderOffice(){
    const s=Game.s;
    const c=$('colCenter'); c.innerHTML='';
    const wrap=h('div','yamen');
    wrap.style.backgroundImage=`url("${YAMEN_BG}")`;
    const target=monthTarget(s.month);
    wrap.innerHTML=`
      <h2>两界交界·破神衙</h2>
      <div class="ya-desc">
        衙门口的灯笼常年不灭，照得见活人，也照得见鬼。案头堆着三界各路神仙的委托，
        香炉里插着你自己掏钱买的香。<br>
        本月功过 <b style="color:var(--${s.merit>=target?'jade':'cinnabar'})">${s.merit}/${target}</b>，
        三十日一考，由阎魔王亲阅。${s.strikes>0?`<span style="color:var(--cinnabar)">你已被记过 ${s.strikes} 次，再不合格就要被贬作孤魂野鬼。</span>`:''}
      </div>`;
    const grid=h('div','ya-grid');
    const mk=(t,d,btn,on)=>{
      const cd=h('div','ya-card',`<div class="yc-t">${t}</div><div class="yc-d">${d}</div>`);
      const b=h('button','btn btn-sm',btn); b.onclick=on; cd.appendChild(b); grid.appendChild(cd);
    };
    const shrineMaxed=s.fac.shrine>=FACILITIES.shrine.levels.length;
    mk('修神龛',shrineMaxed?'觉醒率已达最高 +30%':`升级后觉醒率 +${FACILITIES.shrine.levels[s.fac.shrine].wakeBonus*100}%（当前 ${s.fac.shrine} 级）`,'升级神龛',()=>this.openShop('fac'));
    const deskMaxed=s.fac.desk>=FACILITIES.desk.levels.length;
    const incMaxed=s.fac.incense>=FACILITIES.incense.levels.length;
    const banMaxed=s.fac.banner>=FACILITIES.banner.levels.length;
    mk('扩案几',deskMaxed?'工单架容量已达最高':`升级后工单架容量 +1（当前 ${s.fac.desk} 级）`,'升级案几',()=>this.openShop('fac'));
    mk('添香炉',incMaxed?'神力上限已达最高':`升级后神力上限 +30（当前 ${s.fac.incense} 级）`,'升级香炉',()=>this.openShop('fac'));
    mk('竖招妖幡',banMaxed?'阴兵编制已达最高':`升级后阴兵编制 +1（当前 ${s.fac.banner} 级）`,'升级招妖幡',()=>this.openShop('fac'));
    mk('法宝铺','判官笔、锁魂链、太乙拂尘','选购法宝',()=>this.openShop('item'));
    mk('休整一日','神躯神力尽复，但白日渐逝','闭目调息',()=>Game.rest());
    wrap.appendChild(grid);
    c.appendChild(wrap);
  },

  /* ================= 右栏：神格盘 / 阴兵营 ================= */
  renderRight(){
    const s=Game.s, c=$('colRight'); c.innerHTML='';
    const st=Stats.cur();

    /* ---- 神格盘 ---- */
    const p=h('div','panel');
    p.innerHTML=`<h2>神格盘 <span class="sub">槽位 ${s.equipped.length}/${Stats.slots()}</span></h2>`;
    if(st.clash) p.appendChild(h('div','clash-warn','道争：天启系与幽冥系神格同嵌，神力上限 −20%。鱼与熊掌，自己掂量。'));
    if(st.resonance) p.appendChild(h('div','resonance',`同道共鸣：${PATHS[st.resonance].name}系神格齐聚，攻击 +10%。`));

    const slots=h('div','slots');
    for(let i=0;i<Stats.slots();i++){
      const id=s.equipped[i];
      const sl=h('div','slot'+(id?' filled':''), id?GODHOODS[id].icon:'＋');
      if(id){
        const g=GODHOODS[id], rec=s.gh[id];
        sl.title=`${g.name}（${PATHS[g.path].name}）${rec.sleep>0?` 沉睡中 ${rec.sleep} 日`:''}`;
        const dot=h('span','p-dot dot-'+g.path); sl.appendChild(dot);
        if(rec.sleep>0) sl.classList.add('sleeping');
        sl.onclick=()=>Game.toggleEquip(id);
      }
      slots.appendChild(sl);
    }
    p.appendChild(slots);

    const list=h('div','gh-list');
    const owned=Object.keys(s.gh);
    if(!owned.length) p.appendChild(h('div','section-tip','尚无神格。去给神仙们办差，神格就是你的工钱。'));
    owned.forEach(id=>{
      const g=GODHOODS[id], rec=s.gh[id];
      const eq=s.equipped.includes(id);
      const item=h('div','gh-item'+(eq?' equipped':''));
      let stateHtml;
      if(rec.sleep>0) stateHtml=`<div class="gh-dorm">沉睡中（${rec.sleep} 日）</div>`;
      else if(rec.awakened) stateHtml=`<div class="gh-wake">已觉醒 · 神通「${g.active.name}」<br><span style="color:var(--ink-faint)">被动：${g.passive?g.passive.label:'—'}</span></div>`;
      else stateHtml=`<div class="gh-dorm">未觉醒（感悟 ${Math.round(rec.insight*100)}%）</div>`;
      item.innerHTML=`
        <div class="gh-t"><span class="path-dot dot-${g.path}"></span>${g.name}
          <span style="font-size:11px;color:var(--ink-faint)">${g.fusion?'【融合】':PATHS[g.path].name+' · '+(g.god?GODS[g.god].name:'天道自生')}</span></div>
        <div class="gh-s">${g.desc}<br>${stateHtml}</div>`;
      const row=h('div','o-actions'); row.style.marginTop='5px';
      const eb=h('button','btn btn-sm', eq?'取下':'镶嵌');
      eb.disabled=rec.sleep>0;
      eb.onclick=()=>Game.toggleEquip(id); row.appendChild(eb);
      if(!rec.awakened && rec.sleep<=0){
        const pb=h('button','btn btn-indigo btn-sm','参悟 · 120文');
        pb.onclick=()=>Game.ponder(id); row.appendChild(pb);
      }
      item.appendChild(row);
      list.appendChild(item);
    });
    p.appendChild(list);

    /* 融合 */
    FUSIONS.forEach(f=>{
      const out=GODHOODS[f.out], ins=f.in.map(x=>GODHOODS[x].name).join(' + ');
      const allAwake=f.in.every(x=>Game.awakened(x));
      const anyEquipped=f.in.some(x=>s.equipped.includes(x));
      const ready=Game.canFuse(f);
      const bless=Math.round((s.fusionBless[f.out]||0)*100);
      const label = !allAwake ? `（两枚神格皆觉醒后方可融合）${ins} → ${out.name}`
                  : anyEquipped ? `（融合前请先取下两枚神格）${ins} → ${out.name}`
                  : `融合：${ins} → ${out.name} · ${f.cost}文${bloss2txt(bless)}`;
      const b=h('button','btn btn-sm fuse-btn',label);
      b.disabled=!ready;
      b.onclick=()=>Game.fuse(f);
      p.appendChild(b);
    });
    c.appendChild(p);

    /* ---- 阴兵营 ---- */
    const sp=h('div','panel');
    const cap=1+(s.fac.banner>0?FACILITIES.banner.levels.slice(0,s.fac.banner).reduce((a,l)=>a+(l.cap||0),0):0);
    sp.innerHTML=`<h2>阴兵营 <span class="sub">编制 ${s.soldiers.length}/${cap}</span></h2>`;
    if(!s.soldiers.length) sp.appendChild(h('div','section-tip','光杆司令一个。招妖幡下可以募点阴兵差遣。'));
    s.soldiers.forEach(id=>{
      const so=SOLDIERS[id];
      sp.appendChild(h('div','soldier-row',
        `<span><b>${so.icon} ${so.name}</b><div class="sd">${so.desc}</div></span>`));
    });
    Object.entries(SOLDIERS).forEach(([id,so])=>{
      const r=h('div','shop-row',
        `<div><div class="sr-t">${so.icon} ${so.name}</div><div class="sr-d">${so.desc}</div></div>
         <span class="price">${so.price} 文</span>`);
      const b=h('button','btn btn-primary btn-sm','招募');
      b.onclick=()=>Game.recruit(id); r.appendChild(b); sp.appendChild(r);
    });
    c.appendChild(sp);
  },

  /* ================= 弹窗 ================= */
  openShop(kind){
    const s=Game.s, ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay');
    const box=h('div','paper m-box');
    if(kind==='fac'){
      box.innerHTML=`<button class="m-close">✕</button><h3>神衙营造</h3>`;
      Object.entries(FACILITIES).forEach(([key,f])=>{
        const lv=s.fac[key], maxed=lv>=f.levels.length;
        const next=maxed?null:f.levels[lv];
        const r=h('div','shop-row',
          `<div><div class="sr-t">${f.icon} ${f.name} <span style="font-size:12px;color:var(--cinnabar)">${lv} 级</span></div>
           <div class="sr-d">${f.desc}${next?'<br>下一级：'+facEff(next):' · 已至最高级'}</div></div>
           ${next?`<span class="price">${next.cost} 文</span>`:''}`);
        if(next){ const b=h('button','btn btn-primary btn-sm','营造'); b.onclick=()=>{Game.upgradeFac(key);this.openShop('fac');}; r.appendChild(b); }
        else r.appendChild(h('span','tag tag-merit','已满级'));
        box.appendChild(r);
      });
    }else{
      box.innerHTML=`<button class="m-close">✕</button><h3>阴阳杂货铺</h3>
        <div class="section-tip">掌柜是个骑青牛的老道，说他卖的都是“体制内淘汰下来的好东西”。</div>`;
      Object.entries(ITEMS).forEach(([id,it])=>{
        const owned=s.items[id];
        const r=h('div','shop-row',
          `<div><div class="sr-t">${it.icon} ${it.name}</div><div class="sr-d">${it.desc}</div></div>
           <span class="price">${it.price} 文</span>`);
        const b=h('button','btn btn-sm', owned?'已持有':'请购');
        b.disabled=owned;
        b.onclick=()=>{Game.buyItem(id);this.openShop('item');};
        r.appendChild(b); box.appendChild(r);
      });
    }
    box.querySelector('.m-close').onclick=()=>ml.innerHTML='';
    ov.onclick=e=>{ if(e.target===ov) ml.innerHTML=''; };
    ov.appendChild(box); ml.appendChild(ov);
  },

  /* ================= 下凡事件链 ================= */
  startMission(idx){
    const o=Game.s.shelf[idx];
    this.rt={ order:o, mid:o.mid, node:0, ctx:{atkBuff:0,shield:0,enemyAtk:0,enemyVuln:false}, result:null };
    Game.s.busy=true; Game.save();
    this.view='mission';
    this.renderLeft(); this.renderRight();
    this.renderMissionNode();
  },

  mission(){ return MISSIONS.find(x=>x.id===this.rt.mid); },

  renderMissionNode(){
    const m=this.mission(), node=m.nodes[this.rt.node], god=GODS[m.god];
    const c=$('colCenter'); c.innerHTML='';
    const wrap=h('div','panel');
    const dots=m.nodes.map((n,i)=>`<i class="${i<this.rt.node?'done':i===this.rt.node?'cur':''}"></i>`).join('');
    wrap.innerHTML=`
      <div class="mish-god">
        ${godAvatar(m.god,46)}
        <div style="flex:1">
          <div style="font-size:16px;font-weight:bold;letter-spacing:1px">${m.name}</div>
          <div style="font-size:12px;color:var(--ink-faint)">${god.name} · ${god.title} 委托</div>
        </div>
        <div class="node-dots">${dots}</div>
      </div>`;

    if(node.type==='event'){
      const sc=h('div','scroll-card',`<span class="ink-mark">▍</span>${node.text}`);
      wrap.appendChild(sc);
      const ch=h('div','choices');
      node.choices.forEach((co,i)=>{
        const req=co.requires;
        let ok=true, reqTxt='';
        if(req&&req.path){
          ok=Game.s.equipped.some(id=>GODHOODS[id].path===req.path && (!Game.s.gh[id].sleep || Game.s.gh[id].sleep<=0));
          reqTxt=`需镶嵌【${PATHS[req.path].name}系】神格`;
        }
        const b=h('button','choice-btn');
        b.innerHTML=`${co.t}${reqTxt?`<span class="req ${ok?'':'no'}">${reqTxt}</span>`:''}`;
        b.disabled=!ok;
        b.onclick=()=>this.chooseEvent(i);
        ch.appendChild(b);
      });
      wrap.appendChild(ch);
      if(this.rt.result){
        const rl=h('div','result-line','▸ '+this.rt.result);
        wrap.appendChild(rl);
        const next=h('button','btn btn-primary','继续前行');
        next.style.marginTop='10px';
        next.onclick=()=>this.nextNode();
        wrap.appendChild(next);
      }
    }
    c.appendChild(wrap);
    if(node.type==='battle'){
      const sc=h('div','scroll-card',`<span class="ink-mark">▍</span>前方杀气翻涌——<b style="color:var(--cinnabar)">${ENEMIES[node.enemy].name}</b> 拦住去路！`);
      wrap.appendChild(sc);
      c.appendChild(wrap);
      this.runBattleNode(node);
    }
  },

  chooseEvent(i){
    const node=this.mission().nodes[this.rt.node];
    const co=node.choices[i], r=co.r||{};
    const st=Stats.cur();
    if(r.hp){
      const d=Math.round(st.maxHp*Math.abs(r.hp)/100);
      Game.s.hp=Math.max(1, Game.s.hp-d);
    }
    if(r.heal) Game.s.hp=Math.min(st.maxHp, Game.s.hp+Math.round(st.maxHp*r.heal/100));
    if(r.atkBuff) this.rt.ctx.atkBuff+=r.atkBuff;
    if(r.shield) this.rt.ctx.shield=this.rt.ctx.shield+(r.shield||0);
    if(r.enemyAtk) this.rt.ctx.enemyAtk+=r.enemyAtk;
    if(r.enemyVuln) this.rt.ctx.enemyVuln=true;
    if(r.money){ Game.s.money+=r.money; }
    this.rt.result=r.log||'你继续前行。';
    Game.save(); this.renderTop(); this.renderMissionNode();
  },

  nextNode(){
    this.rt.node++; this.rt.result=null;
    if(this.rt.node>=this.mission().nodes.length){ this.settle(); return; }
    this.renderMissionNode();
  },

  async runBattleNode(node){
    this.view='battle';
    const res=await Battle.run(node, this.rt.ctx);
    await sleep(300);
    if(res==='win'){
      this.view='mission'; this.renderTop();
      /* 战斗结束后直接进入下一节点（玩家点继续） */
      this.rt.node++;
      if(this.rt.node>=this.mission().nodes.length){ this.settle(); return; }
      this.renderMissionNode();
    }else if(res==='flee'){
      this.endFail('你借遁光逃回神衙，委托黄了，神仙什么都不会给你。');
    }else{
      const {lostMoney,reviewed}=Game.deathPenalty();
      this.view='office';
      if(!reviewed){
        this.openNotice('神躯溃散',
          `你被抬回神衙时只剩半缕残魂。罚没香火钱 ${lostMoney} 文，功过 −15。<br>醒来时已是新的一天，案头工单换了一批。`);
      }
      this.render();
    }
  },

  endFail(msg){
    this.view='office'; Game.s.busy=false;
    const reviewed=Game.advanceDay();
    if(!reviewed) this.openNotice('委托失败', msg);
    this.render();
  },

  /* ================= 结算 ================= */
  settle(){
    const s=Game.s, m=this.mission(), o=this.rt.order;
    const money=Math.round(m.money*(o.bargain?1.5:1));
    s.money+=money; s.merit+=m.merit; s.favor+=1;
    const gh=Game.grantGodhood(m.id);
    /* 移除已完成工单 */
    s.shelf=s.shelf.filter(x=>x!==o);
    s.busy=false;
    this.view='settle';
    Game.save();

    const c=$('colCenter'); c.innerHTML='';
    const wrap=h('div','panel settle');
    wrap.innerHTML=`<h3>差使办妥 · 回衙复命</h3>
      <div style="width:80px;height:80px;margin:6px auto 4px">${godAvatar(m.god,80)}</div>
      <div style="font-size:13px;color:var(--ink-faint);margin-bottom:6px">${GODS[m.god].name} 亲赐神格</div>
      <div class="reward-line">
        香火钱 <b style="color:var(--gold)">+${money} 文</b><br>
        功过 <b style="color:var(--jade)">+${m.merit}</b> ｜ 人情 <b>+1</b><br>
        ${GODS[m.god].name}切下一块神格掷给你：<b>${gh.name}</b>（修为 +${gh.cultGain}）
      </div>`;
    if(gh.awakened){
      const pop=h('div','wake-pop',
        `<h4>神格觉醒！</h4><div>「${gh.name}」在你神躯中轰然亮起——<br>
         你悟得了大神通 <b>「${GODHOODS[gh.id].active.name}」</b><br>
         <span style="font-size:13px;color:var(--ink-soft)">${GODHOODS[gh.id].active.desc}</span></div>`);
      wrap.appendChild(pop);
    }else if(gh.isNew){
      wrap.appendChild(h('div','section-tip',
        `神格入体却暂时沉寂。可在右侧神格盘花费香火钱「参悟」，提高觉醒机会。`));
    }
    if(gh.insight) wrap.appendChild(h('div','section-tip',`感悟累积至 ${Math.round(gh.insight*100)}%，再得同格神格将更易觉醒。`));
    const b=h('button','btn btn-primary btn-lg','回神衙');
    b.onclick=()=>{
      this.view='office';
      Game.advanceDay();   // 可能触发月末考核（内部弹窗）
      this.render();
    };
    wrap.appendChild(b);
    c.appendChild(wrap);
    this.renderTop(); this.renderLeft(); this.renderRight();
  },

  openNotice(title,html){
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay'), box=h('div','paper m-box');
    box.innerHTML=`<h3>${title}</h3><div style="font-size:15px;line-height:2">${html}</div>`;
    const b=h('button','btn btn-primary','知道了');
    b.style.marginTop='12px';
    b.onclick=()=>ml.innerHTML='';
    box.appendChild(b); ov.appendChild(box); ml.appendChild(ov);
  },

  /* ================= 月末考核 ================= */
  showReview(pass,promoted,target,strikes){
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay'), box=h('div','paper review-card');
    if(strikes>=2){
      box.innerHTML=`
        <div class="big-seal" style="background:#3d3d3d">黜</div>
        <h2>贬为孤魂</h2>
        <div style="line-height:2.1;font-size:15px">
          连续两月考核不称职，阎王爷把你的劳务契撕了。<br>
          神格被诸神索回，神躯化作一缕青烟，从此你只是枉死城外一只普通的游魂。<br>
          <span style="color:var(--ink-faint)">—— 全剧终 ——</span>
        </div>`;
      const b=h('button','btn btn-primary btn-lg','重新投胎，再考一次');
      b.onclick=()=>{ Game.clear(); Game.newGame(); ml.innerHTML=''; UI.view='office'; UI.render(); };
      box.appendChild(b); ov.appendChild(box); ml.appendChild(ov);
      return;
    }
    box.innerHTML=`
      <div class="big-seal" style="background:${pass?'var(--cinnabar)':'#6f6a7a'}">${pass?'考':'过'}</div>
      <h2>${pass?'考核称职':'考核不称职'}</h2>
      <div class="review-list">
        <div>本月功过目标：${target} 点</div>
        ${pass?`<div>阎王爷朱批：<b>尚堪驱驰</b>，赏香火钱 80 文。</div>`
              :`<div>阎王爷朱批：<b>着实废物</b>，记大过一次（${strikes}/2）。</div>`}
        ${promoted?`<div style="color:var(--cinnabar);font-size:18px"><b>敕封：${RANKS[Game.s.rank].name}！</b><br>神格镶嵌槽 +1，可承接更大的神仙私活。</div>`:''}
      </div>`;
    const b=h('button','btn btn-primary btn-lg','翻开新一月的黄历');
    b.onclick=()=>{ ml.innerHTML=''; UI.view='office'; UI.render(); };
    box.appendChild(b); ov.appendChild(box); ml.appendChild(ov);
  },

  /* ================= 战斗界面 ================= */
  renderBattle(B){
    const c=$('colCenter'); c.innerHTML='';
    const wrap=h('div','battle-wrap');
    wrap.innerHTML=`<div class="battle-field" id="battleField">
        <div class="round-tag">第 <span id="bRound">1</span> 回合</div>
        <div class="fighter" id="fPlayer">
          <div class="fig-body" id="figPlayer" style="color:var(--cinnabar-deep)">衙</div>
          <div class="fig-name">你 · ${RANKS[Game.s.rank].name}</div>
          ${fbarHTML('p')}
          <div class="fstatus" id="pStatus"></div>
        </div>
        <div class="vs">战</div>
        <div class="fighter foe" id="fFoe">
          <div class="fig-body" id="figFoe" style="color:${B.e.tint}">${B.e.icon}</div>
          <div class="fig-name">${B.e.name}</div>
          ${fbarHTML('e', B.e.hpLabel)}
          <div class="fstatus" id="eStatus"></div>
        </div>
      </div>
      <div class="battle-log" id="battleLog"></div>
      <div id="momentSlot"></div>`;
    c.appendChild(wrap);
    this.updateBattle(B);
  },

  updateBattle(B){
    if(!$('battleField')) return;
    $('bRound').textContent=B.round;
    setBar('p',B.p.hp,B.p.maxHp,B.p.mp,B.p.maxMp,B.p.shield);
    setBar('e',B.e.hp,B.e.maxHp);
    $('pStatus').textContent=[
      B.p.shield>0?`光盾 ${B.p.shield}`:'',
      B.p.mp<B.p.maxMp?`神力 ${B.p.mp}`:''
    ].filter(Boolean).join(' · ');
    $('eStatus').textContent=[
      B.e.burn>0?`燃烧 ${B.e.burn}回合`:'',
      B.e.stun>0?`震骇 ${B.e.stun}回合`:'',
      (B.e.vulnTurns>0||B.e.vulnFixed>1)?'破绽':''
    ].filter(Boolean).join(' · ');
    const lg=$('battleLog');
    if(lg) lg.innerHTML=B.log.map(l=>`<div class="${l.cls}">${l.html}</div>`).join('');
  },

  killFoe(){ const f=$('figFoe'); if(f) f.classList.add('down'); },
  flash(side,cls){
    const f=$('fig'+(side==='foe'?'Foe':'Player'));
    if(!f) return;
    f.classList.remove('hit','cast'); void f.offsetWidth; f.classList.add(cls);
    /* 动效挂钩 */
    if(typeof FX!=='undefined'){
      if(cls==='hit'){
        FX.splash(side, side==='foe'?'#2b2620':'#c03c2e');
      }
      if(cls==='cast'){
        FX.shake();
        FX.critFlash();
      }
    }
  },
  floatFoe(t,color){ floatNum('#fFoe',t,color); },
  floatPlayer(t,color){ floatNum('#fPlayer',t,color); },

  /* 关键时刻：等待玩家抉择 */
  battleMoment(B){
    return new Promise(resolve=>{
      this._momentResolve=resolve;
      const slot=$('momentSlot'); if(!slot){ resolve({act:'flee'}); return; }
      const m=h('div','moment');
      m.innerHTML=`<h3>关键时刻 · 你当如何？</h3>
        <div class="m-actions">
          <button class="btn btn-indigo" id="mCast">祭法宝（催动神格神通）</button>
          <button class="btn" id="mBurn">拼命（透支神格，沉睡三日）</button>
          <button class="btn" id="mWait">凝神接战（见招拆招）</button>
          <button class="btn btn-ghost" id="mFlee">遁走（保命，委托失败）</button>
        </div><div id="mSub"></div>`;
      slot.innerHTML=''; slot.appendChild(m);

      $('mWait').onclick=()=>{ slot.innerHTML=''; resolve({act:'wait'}); };
      $('mFlee').onclick=()=>{ slot.innerHTML=''; resolve({act:'flee'}); };
      $('mCast').onclick=()=>{
        const sub=$('mSub'); sub.innerHTML='<div class="skill-list"></div>';
        const list=sub.firstChild;
        const ids=B.p.skillIds;
        if(!ids.length){ sub.innerHTML='<div class="section-tip" style="margin-top:8px">你还没有觉醒任何神格神通。可选择凝神接战、拼命或遁走。</div>'; return; }
        ids.forEach(id=>{
          const g=GODHOODS[id], a=g.active;
          const b=h('button','skill-pick',
            `<b>${g.name}·${a.name}</b> <span class="sp-cost">神力 ${a.cost}</span><br>
             <span style="font-size:12px;color:var(--ink-soft)">${a.desc}</span>`);
          b.disabled=B.p.mp<a.cost;
          b.onclick=()=>{ slot.innerHTML=''; resolve({act:'cast',id}); };
          list.appendChild(b);
        });
      };
      $('mBurn').onclick=()=>{
        const sub=$('mSub'); sub.innerHTML='<div class="skill-list"></div>';
        const list=sub.firstChild;
        if(!Game.s.equipped.length){ sub.innerHTML='<div class="section-tip" style="margin-top:8px">神格盘中空空如也，无格可透支。改选「凝神接战」或「遁走」。</div>'; return; }
        Game.s.equipped.forEach(id=>{
          if(Game.s.gh[id].sleep>0) return;
          const g=GODHOODS[id];
          const b=h('button','skill-pick',
            `<b>透支「${g.name}」</b><br><span style="font-size:12px;color:var(--cinnabar)">毁天灭地一击，该神格沉睡 3 日</span>`);
          b.onclick=()=>{ slot.innerHTML=''; resolve({act:'burn',id}); };
          list.appendChild(b);
        });
      };
    });
  },
};

function fbarHTML(k, label){
  return `<div class="fbar">
    <div class="fl"><span>${k==='p'?'生命':(label||'气血')}</span><span id="${k}Num"></span></div>
    <div class="bar"><i class="${k==='p'?'bar-hp':'bar-mp'}" id="${k}Bar" style="width:100%"></i></div>
  </div>`;
}
function setBar(k,hp,max,mp,maxMp,shield){
  const bar=$(k+'Bar'), num=$(k+'Num');
  if(!bar) return;
  bar.style.width=Math.max(0,hp/max*100)+'%';
  num.textContent = k==='p'
    ? `${Math.round(hp)}/${max} ｜ 神力 ${mp}/${maxMp}`
    : `${Math.round(hp)}/${max}`;
}
function floatNum(sel,text,color){
  const f=document.querySelector(sel); if(!f) return;
  const s=h('div','float-num',text);
  s.style.color=color||'#2b2620';
  s.style.left=(f.offsetLeft+ f.offsetWidth/2 - 14 + (Math.random()*24-12))+'px';
  s.style.top=(f.offsetTop+10)+'px';
  $('battleField').appendChild(s);
  setTimeout(()=>s.remove(),1000);
}
function facEff(n){
  return n.wakeBonus?`觉醒率 +${n.wakeBonus*100}%`:n.shelf?'工单架 +1':n.mana?'神力上限 +'+n.mana:n.cap?'阴兵编制 +1':'';
}
function bloss2txt(p){ return p?` <span style="color:var(--cinnabar)">感应${p}%</span>`:''; }
