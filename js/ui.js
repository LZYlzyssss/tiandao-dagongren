/* ================= 天道打工人 · 界面层（分页版） ================= */
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
  tab:'desk',        // desk(案牍) | cult(修行) | yamen(神衙) | shop(商铺) | equip(装备) | me(我的)
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
    const flowing=this.view!=='office';
    $('tabbar').classList.toggle('hidden', flowing);
    if(flowing) return;   /* mission / battle / settle 视图由各自流程维护 */
    this.renderTabbar();
    const stage=$('pageStage'); stage.innerHTML='';
    if(this.tab==='desk') this.renderDesk(stage);
    else if(this.tab==='cult') this.renderCult(stage);
    else if(this.tab==='yamen') this.renderYamen(stage);
    else if(this.tab==='shop') this.renderShop(stage);
    else if(this.tab==='equip') this.renderEquip(stage);
    else this.renderMe(stage);
    stage.scrollTop=0;
    if(typeof Guide!=='undefined') Guide.afterRender();
  },

  switchTab(tab){
    if(this.view!=='office') return;
    this.tab=tab; this.render();
    if(typeof Guide!=='undefined') Guide.act('tab', tab);
  },

  renderTabbar(){
    document.querySelectorAll('#tabbar .tab').forEach(b=>{
      b.classList.toggle('active', b.dataset.tab===this.tab);
    });
    /* 有官遣单且不在案牍页时，案牍标签亮红点 */
    const forced=Game.s.shelf.some(o=>MISSIONS.find(m=>m.id===o.mid).forced);
    $('dotDesk').style.display=(forced && this.tab!=='desk')?'block':'none';
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

  /* ================= 页一：案牍（工单架） ================= */
  renderDesk(c){
    const s=Game.s, target=monthTarget(s.month);
    const kpi=h('div','panel kpi-panel');
    kpi.innerHTML=`
      <h2>案头工单 <span class="sub">三十日一考 · 阎魔王亲阅</span>
        ${s.tut&&s.tut.done?'<button class="tut-replay">重看指引</button>':''}</h2>
      <div class="kpi-row">
        <div><span class="kpi-k">本月功过</span><b style="color:var(--${s.merit>=target?'jade':'cinnabar'})">${s.merit}/${target}</b></div>
        <div><span class="kpi-k">本月还剩</span><b>${MONTH_DAYS - s.day + 1} 日</b></div>
        <div><span class="kpi-k">在架工单</span><b>${s.shelf.length} 张</b></div>
        <div><span class="kpi-k">记过</span><b style="color:var(--${s.strikes?'cinnabar':'ink-faint'})">${s.strikes}/2</b></div>
      </div>
      ${s.strikes>0?'<div class="clash-warn" style="margin-top:8px">你已被记过，本月再不合格就要被贬作孤魂野鬼。</div>':''}`;
    const rb=kpi.querySelector('.tut-replay');
    if(rb && typeof Guide!=='undefined') rb.onclick=()=>Guide.begin(true);
    c.appendChild(kpi);

    const p=h('div','panel');
    p.innerHTML=`<h2>工单架 <span class="sub">神仙们的脏活累活</span></h2>`;
    if(!s.shelf.length){
      p.appendChild(h('div','shelf-empty','案头空空如也。<br>去「神衙」闭目调息度过今日，明日兴许就有新工单了。'));
    }
    s.shelf.forEach((o,idx)=>{
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
        b.disabled=o.bargain||s.favor<=0;
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

  /* ================= 页二：修行（神格盘 / 融合） ================= */
  renderCult(c){
    const s=Game.s, st=Stats.cur();
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
        sl.title=`${g.name}（${PATHS[g.path].name}系）${rec.sleep>0?` 沉睡中 ${rec.sleep} 日`:''}`;
        const dot=h('span','p-dot dot-'+g.path); sl.appendChild(dot);
        if(rec.sleep>0) sl.classList.add('sleeping');
        sl.onclick=()=>Game.toggleEquip(id);
      }
      slots.appendChild(sl);
    }
    p.appendChild(slots);
    p.appendChild(h('div','section-tip','点击已镶嵌的神格可取下；下方神格点「镶嵌」入盘。沉睡中的神格无法催动。'));

    const list=h('div','gh-list');
    const owned=Object.keys(s.gh);
    if(!owned.length) p.appendChild(h('div','section-tip','尚无神格。去「案牍」接工单给神仙们办差，神格就是你的工钱。'));
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
          <span style="font-size:11px;color:var(--ink-faint)">${g.fusion?'【融合】':PATHS[g.path].name+'系 · '+(g.god?GODS[g.god].name:'天道自生')}</span></div>
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
    const fp=h('div','panel');
    fp.innerHTML=`<h2>神格融合 <span class="sub">两枚觉醒神格合而为一</span></h2>`;
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
      fp.appendChild(b);
    });
    c.appendChild(p);
    c.appendChild(fp);
  },

  /* ================= 页三：神衙（营造 / 杂货铺 / 募兵 / 休整） ================= */
  renderYamen(c){
    const s=Game.s;
    const hero=h('div','yamen');
    hero.style.backgroundImage=`url("${YAMEN_BG}")`;
    hero.innerHTML=`
      <h2>两界交界·破神衙</h2>
      <div class="ya-desc">
        衙门口的灯笼常年不灭，照得见活人，也照得见鬼。<br>
        营造设施、募点阴兵、闭目调息，都是给自己的打工路添几分底气。
        买法宝请移步「商铺」。
      </div>`;
    c.appendChild(hero);

    /* ---- 营造 ---- */
    const fp=h('div','panel');
    fp.innerHTML=`<h2>神衙营造 <span class="sub">香火钱换硬实力</span></h2>`;
    Object.entries(FACILITIES).forEach(([key,f])=>{
      const lv=s.fac[key], maxed=lv>=f.levels.length;
      const next=maxed?null:f.levels[lv];
      const r=h('div','shop-row',
        `<div><div class="sr-t">${f.icon} ${f.name} <span class="lv-tag">${lv} 级</span></div>
         <div class="sr-d">${f.desc}${next?'<br>下一级：'+facEff(next)+' · 花费 '+next.cost+' 文':' · 已至最高级'}</div></div>`);
      if(next){ const b=h('button','btn btn-primary btn-sm','营造'); b.onclick=()=>Game.upgradeFac(key); r.appendChild(b); }
      else r.appendChild(h('span','tag tag-merit','已满级'));
      fp.appendChild(r);
    });
    c.appendChild(fp);

    /* ---- 募兵 ---- */
    const cap=1+(s.fac.banner>0?FACILITIES.banner.levels.slice(0,s.fac.banner).reduce((a,l)=>a+(l.cap||0),0):0);
    const sp=h('div','panel');
    sp.innerHTML=`<h2>招妖幡下 <span class="sub">在役阴兵 ${s.soldiers.length}/${cap}</span></h2>`;
    if(s.soldiers.length){
      const roster=h('div','roster');
      s.soldiers.forEach(id=>{
        const so=SOLDIERS[id];
        roster.appendChild(h('span','roster-chip',`${so.icon} ${so.name}`));
      });
      sp.appendChild(roster);
    }else{
      sp.appendChild(h('div','section-tip','光杆司令一个。募点阴兵，战场上能替你偷袭挡刀。'));
    }
    Object.entries(SOLDIERS).forEach(([id,so])=>{
      const r=h('div','shop-row',
        `<div><div class="sr-t">${so.icon} ${so.name}</div><div class="sr-d">${so.desc}</div></div>
         <span class="price">${so.price} 文</span>`);
      const b=h('button','btn btn-primary btn-sm','招募');
      b.disabled=s.soldiers.length>=cap;
      b.onclick=()=>Game.recruit(id);
      r.appendChild(b); sp.appendChild(r);
    });
    if(s.soldiers.length>=cap) sp.appendChild(h('div','section-tip','编制已满，升级招妖幡可扩充。'));
    c.appendChild(sp);

    /* ---- 休整 ---- */
    const rp=h('div','panel rest-panel');
    rp.innerHTML=`<h2>闭目调息</h2>
      <div class="sr-d" style="margin:4px 0 10px">休整一日，神躯神力尽复。白日渐逝，一日便翻过去。</div>`;
    const b=h('button','btn btn-primary','休整一日');
    b.onclick=()=>Game.rest();
    rp.appendChild(b);
    c.appendChild(rp);
  },

  /* ================= 页四：商铺（百宝铺） ================= */
  renderShop(c){
    const s=Game.s;
    const intro=h('div','panel shop-intro');
    intro.innerHTML=`
      <h2>阴阳百宝铺 <span class="sub">骑青牛的老道坐堂</span></h2>
      <div class="sr-d">老道说他卖的都是「体制内淘汰下来的好东西」。
      法宝各只一件，购入后收入<b>背包</b>，须到「装备」页<b>穿戴</b>才生效；
      兵刃、护身、奇物<b>每栏只可佩一件</b>。
      闲置的法宝老道也肯回收——只出<b>半价</b>，钱款两讫，概不退换。</div>`;
    c.appendChild(intro);

    ['weapon','armor','trinket'].forEach(slot=>{
      const info=SLOT_INFO[slot];
      const p=h('div','panel');
      p.innerHTML=`<h2><span class="slot-ico">${info.icon}</span> ${info.name}
        <span class="sub">${info.desc}</span></h2>`;
      Object.entries(ITEMS).filter(([,it])=>it.slot===slot).forEach(([id,it])=>{
        const owned=!!s.bag[id];
        const worn=s.wear[slot]===id;
        const r=h('div','shop-row item-row'+(owned?' owned':''));
        r.innerHTML=`
          <div class="item-ic">${it.icon}</div>
          <div class="item-body">
            <div class="sr-t">${it.name} <span class="grade g-${itemGradeCls(it.grade)}">${it.grade}</span>
              ${worn?'<span class="tag tag-merit">佩中</span>':''}</div>
            <div class="sr-d">${it.desc}</div>
          </div>
          <span class="price">${it.price} 文</span>`;
        const b=h('button','btn btn-sm', owned?'已购入':'请购');
        b.disabled=owned;
        b.onclick=()=>Game.buyItem(id);
        r.appendChild(b);
        p.appendChild(r);
      });
      c.appendChild(p);
    });

    /* ---- 旧货回收（只列背包中未穿戴的闲置法宝） ---- */
    const rp=h('div','panel');
    rp.innerHTML=`<h2>旧货回收 <span class="sub">半价收旧，概不赎回</span></h2>`;
    const spare=Object.keys(s.bag).filter(id=>s.wear[ITEMS[id].slot]!==id);
    if(!spare.length){
      rp.appendChild(h('div','shelf-empty','老道在铺子里打着哈欠——你行囊里没有闲置法宝。<br>佩中的法宝须先到「装备」页取下，才能出手。'));
    }else{
      rp.appendChild(h('div','section-tip','以下法宝正在行囊里闲置，可按原价 50% 出手。'));
      spare.forEach(id=>{
        const it=ITEMS[id], gain=Math.floor(it.price*SELL_RATE);
        const r=h('div','shop-row item-row',
          `<div class="item-ic">${it.icon}</div>
           <div class="item-body">
             <div class="sr-t">${it.name} <span class="grade g-${itemGradeCls(it.grade)}">${it.grade}</span>
               <span class="tag" style="margin-left:4px">${SLOT_INFO[it.slot].name}</span></div>
             <div class="sr-d">原价 ${it.price} 文 · 老道只肯出 <b class="sell-price">${gain} 文</b></div>
           </div>`);
        const b=h('button','btn btn-sm btn-sell','出手');
        b.onclick=()=>this.openConfirm('旧货回收',
          `当真要把「${it.name}」卖给老道？<br>
           原价 <b>${it.price} 文</b>，回收只得 <b style="color:var(--gold)">${gain} 文</b>。<br>
           <span style="color:var(--ink-faint);font-size:13px">钱款两讫，概不赎回。</span>`,
          ()=>Game.sellItem(id), '半价出手');
        r.appendChild(b);
        rp.appendChild(r);
      });
    }
    c.appendChild(rp);
  },

  /* ================= 页五：装备（三栏位 + 背包） ================= */
  renderEquip(c){
    const s=Game.s;

    /* 三个穿戴栏位 */
    const wp=h('div','panel');
    wp.innerHTML=`<h2>随身佩饰 <span class="sub">三栏各佩一件</span></h2>`;
    const slots=h('div','wear-slots');
    ['weapon','armor','trinket'].forEach(slot=>{
      const info=SLOT_INFO[slot], id=s.wear[slot];
      const card=h('div','wear-card'+(id?'':' empty'));
      if(id){
        const it=ITEMS[id];
        card.innerHTML=`
          <div class="wc-head"><span class="slot-ico">${info.icon}</span>${info.name}</div>
          <div class="item-ic big">${it.icon}</div>
          <div class="wc-name">${it.name} <span class="grade g-${itemGradeCls(it.grade)}">${it.grade}</span></div>
          <div class="sr-d">${it.desc}</div>`;
        const b=h('button','btn btn-ghost btn-sm','取下');
        b.style.marginTop='8px';
        b.onclick=()=>Game.takeOff(slot);
        card.appendChild(b);
      }else{
        card.innerHTML=`
          <div class="wc-head"><span class="slot-ico">${info.icon}</span>${info.name}</div>
          <div class="item-ic big">空</div>
          <div class="wc-name" style="color:var(--ink-faint)">未佩法宝</div>
          <div class="sr-d">${info.desc}</div>`;
      }
      slots.appendChild(card);
    });
    wp.appendChild(slots);
    c.appendChild(wp);

    /* 背包（未穿戴） */
    const bp=h('div','panel');
    const spare=Object.keys(s.bag).filter(id=>s.wear[ITEMS[id].slot]!==id);
    bp.innerHTML=`<h2>行囊 <span class="sub">在库 ${spare.length} 件 · 已购 ${Object.keys(s.bag).length} 件</span></h2>
      <div class="section-tip">同栏换新装时，旧法宝自动收回行囊，不会丢失。</div>`;
    if(!spare.length){
      bp.appendChild(h('div','shelf-empty','行囊空空如也。<br>去「商铺」淘两件称手的家伙吧。'));
    }
    spare.forEach(id=>{
      const it=ITEMS[id];
      const r=h('div','shop-row item-row',
        `<div class="item-ic">${it.icon}</div>
         <div class="item-body">
           <div class="sr-t">${it.name} <span class="grade g-${itemGradeCls(it.grade)}">${it.grade}</span>
             <span class="tag" style="margin-left:4px">${SLOT_INFO[it.slot].name}</span></div>
           <div class="sr-d">${it.desc}</div>
         </div>`);
      const b=h('button','btn btn-primary btn-sm','穿戴');
      b.onclick=()=>Game.wearItem(id);
      r.appendChild(b);
      bp.appendChild(r);
    });
    c.appendChild(bp);
  },

  /* ================= 页六：我的（角色卷宗） ================= */
  renderMe(c){
    const s=Game.s, st=Stats.cur(), rk=RANKS[s.rank];

    /* 身份 */
    const idp=h('div','panel me-head');
    idp.innerHTML=`
      <h2>身份卷宗</h2>
      <div class="me-seal">衙</div>
      <div class="me-id">
        <div class="me-rank">${rk.name}</div>
        <div class="sr-d">第 ${s.month} 月 ${s.day} 日 ｜ 修为 <b>${s.cult}</b> ｜ 香火钱 <b style="color:var(--gold)">${s.money} 文</b> ｜ 人情 <b>${s.favor}</b></div>
      </div>`;
    c.appendChild(idp);

    /* 战力 */
    const bp=h('div','panel');
    bp.innerHTML=`<h2>神躯战册 <span class="sub">当前出战数值</span></h2>`;
    const grid=h('div','stat-grid');
    const cell=(k,v)=>`<div class="stat-cell"><span class="kpi-k">${k}</span><b>${v}</b></div>`;
    grid.innerHTML=
      cell('神躯', `${Math.round(s.hp)}/${st.maxHp}`)+
      cell('神力上限', st.maxMp)+
      cell('攻击', st.atk)+
      cell('防御', st.def)+
      cell('暴击率', Math.round(st.crit*100)+'%')+
      cell('吸血', Math.round(st.lifesteal*100)+'%');
    bp.appendChild(grid);
    if(st.clash) bp.appendChild(h('div','clash-warn','道争发动中：神力上限 −20%。'));
    if(st.resonance) bp.appendChild(h('div','resonance',`同道共鸣：${PATHS[st.resonance].name}系，攻击 +10%。`));
    const fx=[];
    Object.values(s.wear||{}).forEach(id=>{
      if(id && s.bag[id] && ITEMS[id]) fx.push(`${ITEMS[id].name}：${itemFxText(ITEMS[id])}`);
    });
    fx.push(...st.passives.map(p=>`${GODHOODS[p.gh].name}·${p.label}`));
    if(fx.length){
      const ul=h('div','fx-list');
      ul.innerHTML=fx.map(x=>`<div>◆ ${x}</div>`).join('');
      bp.appendChild(ul);
    }
    c.appendChild(bp);

    /* 镶嵌神格速览 */
    const gp=h('div','panel');
    gp.innerHTML=`<h2>在身神格 <span class="sub">${s.equipped.length}/${Stats.slots()} 槽</span></h2>`;
    if(s.equipped.length){
      const row=h('div','gh-mini-row');
      s.equipped.forEach(id=>{
        const g=GODHOODS[id], rec=s.gh[id];
        const chip=h('div','gh-mini'+(rec.sleep>0?' sleeping':''),
          `<b>${g.icon} ${g.name}</b><span>${PATHS[g.path].name}系 · ${rec.awakened?'已觉醒':'未觉醒'}${rec.sleep>0?` · 沉睡${rec.sleep}日`:''}</span>`);
        chip.onclick=()=>{ this.tab='cult'; this.render(); };
        row.appendChild(chip);
      });
      gp.appendChild(row);
      gp.appendChild(h('div','section-tip','点神格可跳往「修行」页调整。'));
    }else{
      gp.appendChild(h('div','section-tip','尚无神格在身。去「案牍」接工单吧。'));
    }
    c.appendChild(gp);

    /* 法宝（三栏位穿戴速览，点击跳装备页） */
    const ip=h('div','panel');
    ip.innerHTML=`<h2>随身法宝 <span class="sub">点击可前往「装备」页</span></h2>`;
    const worn=Object.values(s.wear||{}).filter(Boolean);
    if(worn.length){
      worn.forEach(id=>{
        const it=ITEMS[id]; if(!it) return;
        const row=h('div','shop-row gear-jump',
          `<div class="item-ic">${it.icon}</div>
           <div class="item-body">
             <div class="sr-t">${it.name} <span class="grade g-${itemGradeCls(it.grade)}">${it.grade}</span>
               <span class="tag" style="margin-left:4px">${SLOT_INFO[it.slot].name}</span></div>
             <div class="sr-d">${it.desc}</div>
           </div>
           <span class="tag tag-merit">佩中</span>`);
        row.onclick=()=>{ this.tab='equip'; this.render(); };
        ip.appendChild(row);
      });
      const spare=Object.keys(s.bag).filter(x=>s.wear[ITEMS[x].slot]!==x).length;
      if(spare) ip.appendChild(h('div','section-tip',`行囊里还有 ${spare} 件未穿戴。`));
    }else{
      ip.appendChild(h('div','section-tip','尚未佩饰法宝。去「商铺」逛逛，购后到「装备」页穿戴。'));
    }
    c.appendChild(ip);

    /* 阴兵 */
    const sp=h('div','panel');
    sp.innerHTML=`<h2>麾下阴兵</h2>`;
    if(s.soldiers.length){
      s.soldiers.forEach(id=>{
        const so=SOLDIERS[id];
        sp.appendChild(h('div','shop-row',
          `<div><div class="sr-t">${so.icon} ${so.name}</div><div class="sr-d">${so.desc}</div></div>
           <span class="tag tag-merit">在役</span>`));
      });
    }else{
      sp.appendChild(h('div','section-tip','尚无阴兵。去「神衙」招妖幡下招募。'));
    }
    c.appendChild(sp);
  },

  /* ================= 下凡事件链 ================= */
  startMission(idx){
    const o=Game.s.shelf[idx];
    this.rt={ order:o, mid:o.mid, node:0, ctx:{atkBuff:0,shield:0,enemyAtk:0,enemyVuln:false}, result:null };
    Game.s.busy=true; Game.save();
    this.view='mission';
    this.render();
    this.renderMissionNode();
    if(typeof Guide!=='undefined') Guide.act('startMission');
  },

  mission(){ return MISSIONS.find(x=>x.id===this.rt.mid); },

  renderMissionNode(){
    const m=this.mission(), node=m.nodes[this.rt.node], god=GODS[m.god];
    const c=$('pageStage'); c.innerHTML='';
    const wrap=h('div','panel');
    const dots=m.nodes.map((n,i)=>`<i class="${i<this.rt.node?'done':i===this.rt.node?'cur':''}"></i>`).join('');
    wrap.innerHTML=`
      <div class="mish-god">
        ${godAvatar(m.god,46)}
        <div style="flex:1">
          <div style="font-size:16px;font-weight:bold;letter-spacing:1px">${m.name}</div>
          <div style="font-size:12px;color:var(--ink-faint)">${god.name} · ${god.title} 委托 · 两界办差中</div>
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
        const next=h('button','btn btn-primary btn-mish-next','继续前行');
        next.style.marginTop='10px';
        next.onclick=()=>this.nextNode();
        wrap.appendChild(next);
      }
    }
    c.appendChild(wrap);
    if(node.type==='event' && typeof Guide!=='undefined') Guide.act('eventNode');
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
    if(typeof Guide!=='undefined') Guide.act('chooseEvent');
  },

  nextNode(){
    this.rt.node++; this.rt.result=null;
    if(this.rt.node>=this.mission().nodes.length){ this.settle(); return; }
    this.renderMissionNode();
    if(typeof Guide!=='undefined') Guide.act('nextNode');
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
      if(typeof Guide!=='undefined') Guide.act('missionFail');
      this.endFail('你借遁光逃回神衙，委托黄了，神仙什么都不会给你。');
    }else{
      if(typeof Guide!=='undefined') Guide.act('missionFail');
      const {lostMoney,reviewed}=Game.deathPenalty();
      this.view='office'; this.tab='desk';
      if(!reviewed){
        this.openNotice('神躯溃散',
          `你被抬回神衙时只剩半缕残魂。罚没香火钱 ${lostMoney} 文，功过 −15。<br>醒来时已是新的一天，案头工单换了一批。`,
          ()=>{ if(typeof Guide!=='undefined') Guide.act('noticeClosed'); });
      }
      this.render();
    }
  },

  endFail(msg){
    this.view='office'; this.tab='desk'; Game.s.busy=false;
    const reviewed=Game.advanceDay();
    if(!reviewed){
      this.openNotice('委托失败', msg,
        ()=>{ if(typeof Guide!=='undefined') Guide.act('noticeClosed'); });
    }
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

    const c=$('pageStage'); c.innerHTML='';
    $('tabbar').classList.add('hidden');
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
        `神格入体却暂时沉寂。可在「修行」页花费香火钱「参悟」，提高觉醒机会。`));
    }
    if(gh.insight) wrap.appendChild(h('div','section-tip',`感悟累积至 ${Math.round(gh.insight*100)}%，再得同格神格将更易觉醒。`));
    const b=h('button','btn btn-primary btn-lg','回神衙');
    b.onclick=()=>{
      this.view='office'; this.tab='desk';
      Game.advanceDay();   // 可能触发月末考核（内部弹窗）
      this.render();
      if(typeof Guide!=='undefined') Guide.act('backOffice');
    };
    wrap.appendChild(b);
    c.appendChild(wrap);
    this.renderTop();
    if(typeof Guide!=='undefined') Guide.act('settle');
  },

  openNotice(title,html,onClose){
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay'), box=h('div','paper m-box');
    box.innerHTML=`<h3>${title}</h3><div style="font-size:15px;line-height:2">${html}</div>`;
    const b=h('button','btn btn-primary','知道了');
    b.style.marginTop='12px';
    b.onclick=()=>{ ml.innerHTML=''; onClose&&onClose(); };
    box.appendChild(b); ov.appendChild(box); ml.appendChild(ov);
  },

  /** 二次确认弹窗：onOk 在点确认后执行 */
  openConfirm(title,html,onOk,okText='确认'){
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay'), box=h('div','paper m-box');
    box.innerHTML=`<h3>${title}</h3><div style="font-size:15px;line-height:2">${html}</div>`;
    const close=()=>{ ml.innerHTML=''; };
    const ok=h('button','btn btn-primary btn-sell',okText);
    ok.style.marginTop='14px';
    ok.onclick=()=>{ close(); onOk&&onOk(); };
    const cancel=h('button','btn btn-ghost','再想想');
    cancel.style.marginTop='14px';
    cancel.style.marginLeft='12px';
    cancel.onclick=close;
    box.appendChild(ok); box.appendChild(cancel);
    ov.appendChild(box); ml.appendChild(ov);
  },

  /* ================= 月末考核 ================= */
  showReview(pass,promoted,target,strikes){
    if(typeof Guide!=='undefined') Guide.act('review');
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay'), box=h('div','paper review-card');
    if(strikes>=2){
      box.innerHTML=`
        <div class="big-seal" style="background:#3d3020">黜</div>
        <h2>贬为孤魂</h2>
        <div style="line-height:2.1;font-size:15px">
          连续两月考核不称职，阎王爷把你的劳务契撕了。<br>
          神格被诸神索回，神躯化作一缕青烟，从此你只是枉死城外一只普通的游魂。<br>
          <span style="color:var(--ink-faint)">—— 全剧终 ——</span>
        </div>`;
      const b=h('button','btn btn-primary btn-lg','重新投胎，再考一次');
      b.onclick=()=>{ Game.clear(); Game.newGame(); ml.innerHTML=''; UI.view='office'; UI.tab='desk'; UI.render(); if(typeof Guide!=='undefined') Guide.begin(); };
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
    b.onclick=()=>{ ml.innerHTML=''; UI.view='office'; UI.tab='desk'; UI.render(); if(typeof Guide!=='undefined') Guide.act('reviewed'); };
    box.appendChild(b); ov.appendChild(box); ml.appendChild(ov);
  },

  /* ================= 战斗界面 ================= */
  renderBattle(B){
    const c=$('pageStage'); c.innerHTML='';
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
    if(typeof Guide!=='undefined') Guide.act('battle');
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
      if(typeof Guide!=='undefined') Guide.act('momentOpen');
      const gdone=v=>{ slot.innerHTML=''; if(typeof Guide!=='undefined') Guide.act('momentDone'); resolve(v); };

      $('mWait').onclick=()=>gdone({act:'wait'});
      $('mFlee').onclick=()=>gdone({act:'flee'});
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
function itemGradeCls(g){
  return g==='宝品'?'bao':g==='灵品'?'ling':'fan';
}
/** 法宝当前生效词条简表（用于战册特效一览） */
function itemFxText(it){
  const a=[];
  const st=it.stat||{};
  if(st.hp) a.push(`神躯+${st.hp}`);
  if(st.atk) a.push(`攻击+${st.atk}`);
  if(st.def) a.push(`防御+${st.def}`);
  if(st.crit) a.push(`暴击+${Math.round(st.crit*100)}%`);
  if(st.lifesteal) a.push(`吸血${Math.round(st.lifesteal*100)}%`);
  const pr=it.proc||{};
  if(pr.stun) a.push(`命中${Math.round(pr.stun*100)}%震慑`);
  if(pr.healStart) a.push(`开战回血${Math.round(pr.healStart*100)}%`);
  if(pr.dmgReduce) a.push(`受伤-${Math.round(pr.dmgReduce*100)}%`);
  if(pr.burnOnHit) a.push(`命中${Math.round(pr.burnOnHit*100)}%点燃`);
  return a.join('，');
}
function bloss2txt(p){ return p?` <span style="color:var(--cinnabar)">感应${p}%</span>`:''; }

/* ================= 底部标签切换 ================= */
document.addEventListener('click', e=>{
  const btn=e.target.closest && e.target.closest('#tabbar .tab');
  if(btn) UI.switchTab(btn.dataset.tab);
});
