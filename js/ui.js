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
    const forced=Game.s.shelf.some(o=>{ const m=MISSIONS.find(x=>x.id===o.mid); return m&&m.forced; });
    $('dotDesk').style.display=(forced && this.tab!=='desk')?'block':'none';
  },

  renderTop(){
    const s=Game.s, st=Stats.cur(), rk=RANKS[s.rank];
    const target=monthTarget(s.month);
    const eb=ERODE_BANDS[Game.erodeLevel()];
    const erodeHot = Game.erodeLevel()>=2;
    $('topStats').innerHTML = `
      <div class="stat-chip"><span class="k">品阶</span><span class="v">${rk.name}</span></div>
      <div class="stat-chip"><span class="k">两界日历</span><span class="v">${s.month}<small>月</small> ${s.day}<small>日</small></span></div>
      <div class="stat-chip"><span class="k">修为</span><span class="v">${s.cult}</span></div>
      <div class="stat-chip"><span class="k">香火钱</span><span class="v">${s.money}<small> 文</small></span></div>
      <div class="stat-chip"><span class="k">人情</span><span class="v">${s.renqing}</span></div>
      <div class="stat-chip ${erodeHot?'erode-hot':''}"><span class="k">侵蚀</span><span class="v">${s.erode}<small> ${eb.name}</small></span></div>
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

    /* 剧情档案入口：翻查已结之卷 */
    const total=Math.max(1,MISSIONS.filter(m=>m.main||m.side).length);
    const doneCnt=Object.keys(s.mainDone).length+Object.keys(s.sideDone).length;
    const sp=h('div','panel story-entry');
    sp.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
      <div>
        <div style="font-weight:bold;letter-spacing:1px">📜 剧情档案</div>
        <div class="sub" style="font-size:12px;color:var(--ink-faint)">经办过的差事都归档在这里，闲时可以翻开重读</div>
      </div>
      <button class="btn btn-primary">已结 ${doneCnt}/${total} 卷</button>
    </div>`;
    sp.querySelector('button').onclick=()=>UI.openStoryArchive();
    c.appendChild(sp);

    const p=h('div','panel');
    p.innerHTML=`<h2>工单架 <span class="sub">神仙们的脏活累活</span></h2>`;
    if(!s.shelf.length){
      p.appendChild(h('div','shelf-empty','案头空空如也。<br>去「神衙」闭目调息度过今日，明日兴许就有新工单了。'));
    }
    s.shelf.forEach((o,idx)=>{
      const m=MISSIONS.find(x=>x.id===o.mid);
      if(!m) return;
      const god=GODS[m.god];
      const isLong=!!m.long;
      const actTotal=m.acts?m.acts.length:0;
      const actCur=Math.min(o.act||0, actTotal-1);
      const card=h('div','order'+(m.forced?' forced':''));
      /* v3 奖励标签：读 m.reward（gh / 五系碎末 / 同名碎片 / 妖丹） */
      const rv=m.reward||{};
      let rewardTags='';
      if(rv.gh) rewardTags+=`<span class="tag tag-gh">神格·${GODHOODS[rv.gh].name}</span>`;
      if(rv.shards) Object.entries(rv.shards).forEach(([p,n])=>{ rewardTags+=`<span class="tag">${PATHS[p].name}系碎末×${n}</span>`; });
      if(rv.dshards) Object.entries(rv.dshards).forEach(([g,n])=>{ rewardTags+=`<span class="tag">${GODS[g].name}碎片×${n}</span>`; });
      if(rv.pill) rewardTags+=`<span class="tag">${PILLS[rv.pill].name}</span>`;
      if(!rewardTags) rewardTags='<span class="tag">无神格</span>';
      card.innerHTML=`
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span class="god-link" data-god="${m.god}" title="点击查看神明档案">${godAvatar(m.god,40)}</span>
          <div class="o-body" style="flex:1;min-width:0">
            <div class="o-head">
              <span class="o-title">${m.name}</span>
              <span>${'★'.repeat(m.danger)}<span style="color:var(--line)">${'★'.repeat(5-m.danger)}</span></span>
            </div>
            <div class="o-god">${god.name} · ${god.title}
              <span class="tier-tag tier-${(god.tier||'E').toLowerCase()}">${god.tier||'E'}</span>
              ${o.bargain?'<span style="color:var(--cinnabar)">【已加价 +50%】</span>':''}
              ${isLong?`<span style="color:var(--gold)">【长单·${actCur+1}/${actTotal}幕】</span>`:''}
              ${m.main?'<span style="color:var(--cinnabar)">【主线】</span>':''}
            </div>
            <div class="o-scroll">${m.scroll}</div>
            <div class="o-meta">
              ${rewardTags}
              <span class="tag tag-money">${Math.round(m.money*(o.bargain?1.5:1))} 文</span>
              <span class="tag tag-merit">功过 ${m.merit}</span>
              ${m.forced?'<span class="tag tag-forced">官遣</span>':''}
            </div>
          </div>
        </div>`;
      const glink=card.querySelector('.god-link');
      glink.onclick=()=>this.openGodModal(m.god);
      const acts=h('div','o-actions'); acts.style.marginTop='8px';
      const go=h('button','btn btn-primary btn-sm', isLong&&actCur>0?'续办下凡':'接案下凡');
      go.onclick=()=>this.startMission(idx);
      acts.appendChild(go);
      if(!m.forced){
        const b=h('button','btn btn-sm','加价');
        b.disabled=o.bargain||s.renqing<=0;
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

  /* ================= 页二：修行（神格盘 / 碎末凝格 / 妖丹 / 融合） ================= */
  renderCult(c){
    const s=Game.s, st=Stats.cur();
    const p=h('div','panel');
    p.innerHTML=`<h2>神格盘 <span class="sub">槽位 ${s.equipped.length}/${Stats.slots()}</span></h2>`;
    if(st.clash) p.appendChild(h('div','clash-warn','道争：兵⟷法、幽⟷生同嵌，神力上限 −20%（侵蚀 40+ 扩至 −30%）。鱼与熊掌，自己掂量。'));
    if(st.resonance && st.resonance.length){
      st.resonance.forEach(r=>{
        const rs=RESONANCE[r.path];
        const label = r.strong ? (rs.four.label||'强化共鸣') : (rs.two.label||'共鸣');
        p.appendChild(h('div','resonance',`同道共鸣：${PATHS[r.path].name}系 ${r.strong?'齐聚(四格)':'双格'} —— ${label}`));
      });
    }

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
      else if(rec.awakened) stateHtml=`<div class="gh-wake">已觉醒 · 神通「${g.active.name}」<br><span style="color:var(--ink-faint)">被动：${g.passive?(g.passive.labels||['—']).join('，'):'—'}</span></div>`;
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
        const aw=AWAKE_RATE[g.q]||AWAKE_RATE['凡'];
        const pb=h('button','btn btn-indigo btn-sm',`参悟 · ${aw.cost}文`);
        pb.disabled=s.money<aw.cost;
        pb.onclick=()=>Game.ponder(id); row.appendChild(pb);
      }
      if(eq && !rec.awakened){
        const db=h('button','btn btn-ghost btn-sm','拆回碎末');
        db.title='拆回 1 枚同系碎末（半价回收）';
        db.onclick=()=>Game.dismantle(id); row.appendChild(db);
      }
      item.appendChild(row);
      list.appendChild(item);
    });
    p.appendChild(list);
    c.appendChild(p);

    /* ---- 碎末凝格（同系 5 碎末 → 凝格池随机凡品格） ---- */
    const sp=h('div','panel');
    sp.innerHTML=`<h2>碎末凝格 <span class="sub">同系 5 碎末 → 随机凡品格</span></h2>
      <div class="section-tip">兵/法/火三系碎末可凝格；幽/生系碎末不入凝格池（仅靠整格获取或拆回）。</div>`;
    Object.entries(s.shards).forEach(([path,n])=>{
      const pool=CONDENSE_POOL[path];
      const canCondense = pool && pool.length>0;
      const r=h('div','shop-row',
        `<div><div class="sr-t"><span class="path-dot dot-${path}"></span>${PATHS[path].name}系碎末 <span class="lv-tag">${n}/${SHARD_NEED}</span></div>
         <div class="sr-d">${canCondense?'5 枚可凝出一枚随机凡品格':'该系碎末不入凝格池（拆回专用）'}</div></div>`);
      if(canCondense){
        const b=h('button','btn btn-primary btn-sm','凝格');
        b.disabled=n<SHARD_NEED;
        b.onclick=()=>Game.condense(path);
        r.appendChild(b);
      }
      sp.appendChild(r);
    });
    c.appendChild(sp);

    /* ---- 同名碎片（D 神 5 碎片 → 专属灵品格） ---- */
    const dsp=Object.entries(s.dshards||{}).filter(([,n])=>n>0);
    if(dsp.length){
      const dp=h('div','panel');
      dp.innerHTML=`<h2>同名碎片 <span class="sub">D 神 5 碎片 → 专属灵品格</span></h2>`;
      dsp.forEach(([g,n])=>{
        const gd=GODS[g];
        if(!gd || !gd.gh) return;
        const r=h('div','shop-row',
          `<div><div class="sr-t">${godAvatar(g,28)} ${gd.name} 碎片 <span class="lv-tag">${n}/${SHARD_NEED}</span></div>
           <div class="sr-d">5 枚可凝成专属灵品格「${GODHOODS[gd.gh].name}」</div></div>`);
        const b=h('button','btn btn-primary btn-sm','凝格');
        b.disabled=n<SHARD_NEED;
        b.onclick=()=>Game.condenseGod(g);
        r.appendChild(b); dp.appendChild(r);
      });
      c.appendChild(dp);
    }

    /* ---- 妖丹（炼化 / 吞噬 / 侵蚀） ---- */
    const pp=h('div','panel');
    pp.innerHTML=`<h2>妖丹炉 <span class="sub">炼化出整格 / 吞噬得常驻属性</span></h2>`;
    /* 侵蚀条 */
    const eb=ERODE_BANDS[Game.erodeLevel()];
    pp.appendChild(h('div','erode-bar',
      `<div class="erode-fill" style="width:${s.erode}%;background:${Game.erodeLevel()>=3?'var(--cinnabar)':'var(--ink-soft)'}"></div>`));
    pp.appendChild(h('div','section-tip',`侵蚀 ${s.erode}/100 · ${eb.name} —— ${eb.desc}`));
    /* 丹炉状态 */
    if(s.refining){
      const p2=PILLS[s.refining.pill];
      pp.appendChild(h('div','clash-warn',`丹炉中正在炼化「${p2.name}」，还需 ${s.refining.daysLeft} 日……`));
    }
    const pills=Object.entries(s.pills||{}).filter(([,n])=>n>0);
    if(!pills.length){
      pp.appendChild(h('div','section-tip','尚无妖丹。击败妖魔类敌人可获得，或在工单奖励中获取。'));
    }else{
      pills.forEach(([id,n])=>{
        const pl=PILLS[id]; if(!pl) return;
        const r=h('div','shop-row',
          `<div><div class="sr-t">${pl.icon} ${pl.name} <span class="lv-tag">×${n}</span></div>
           <div class="sr-d">炼化：花 ${pl.refineCost}文，${pl.days}日出整格（${(pl.band||[]).join('/')}品质）${pl.pathWeight?'·加权'+PATHS[pl.pathWeight].name+'系':''}<br>
            吞噬：${pl.devour.hp>0?'神躯+'+pl.devour.hp:''} ${pl.devour.atk>0?'攻击+'+pl.devour.atk:''} ${pl.devour.def>0?'防御+'+pl.devour.def:''} ｜ 侵蚀+${pl.devour.erode}${pl.special?' · '+pl.specialDesc:''}</div></div>`);
        const rb=h('button','btn btn-indigo btn-sm','炼化');
        rb.disabled=!!s.refining || s.money<pl.refineCost;
        rb.onclick=()=>Game.refineStart(id); r.appendChild(rb);
        const db=h('button','btn btn-sm btn-sell','吞噬');
        db.title='常驻属性增长，但侵蚀值上升';
        db.onclick=()=>this.openConfirm('吞噬妖丹',
          `当真要吞下「${pl.name}」？<br>常驻属性会永久增长，但侵蚀值 +${pl.devour.erode}。<br>
           <span style="color:var(--ink-faint);font-size:13px">侵蚀达 80 锁定 D 级神格获取，100 锁定坏结局轨道。</span>`,
          ()=>Game.devourPill(id), '吞下');
        r.appendChild(db);
        pp.appendChild(r);
      });
    }
    c.appendChild(pp);

    /* ---- 融合（按章节/配方过滤） ---- */
    const fp=h('div','panel');
    fp.innerHTML=`<h2>神格融合 <span class="sub">两枚觉醒神格合而为一</span></h2>`;
    FUSIONS.forEach(f=>{
      if(!Game.hasRecipe(f)) return;   /* 仅显示已解锁配方 */
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
    if(!FUSIONS.some(f=>Game.hasRecipe(f))){
      fp.appendChild(h('div','section-tip','尚未习得任何融合配方。推进主线、完成支线可获配方；商铺配方随章节解锁。'));
    }
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
    /* 「谱系」入口：总路阵营 + 支路层级的众神关系网格 */
    const gridBtn=h('button','btn btn-primary btn-lg ya-grid-btn','📜 众神谱系 · 已结识 '+Object.keys(GODS).filter(g=>Game.isGodUnlocked(g)).length+'/'+GODS_TOTAL);
    gridBtn.style.marginTop='8px';
    gridBtn.onclick=()=>UI.openGodGrid();
    hero.appendChild(gridBtn);
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
      「礼单」上的物件买了送神明——在工单架点<b>神明头像</b>开档案送礼，好感到位，关键时刻有人搭手。
      闲置的物件老道也肯回收——只出<b>半价</b>，钱款两讫，概不退换。</div>`;
    c.appendChild(intro);

    ['weapon','armor','trinket','gift'].forEach(slot=>{
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

    /* 背包（未穿戴；礼物不出现在行囊，送礼走神明档案） */
    const bp=h('div','panel');
    const spare=Object.keys(s.bag).filter(id=>ITEMS[id] && ITEMS[id].slot!=='gift' && s.wear[ITEMS[id].slot]!==id);
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
        <div class="sr-d">第 ${s.month} 月 ${s.day} 日 ｜ 修为 <b>${s.cult}</b> ｜ 香火钱 <b style="color:var(--gold)">${s.money} 文</b> ｜ 人情 <b>${s.renqing}</b></div>
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
    if(st.clash) bp.appendChild(h('div','clash-warn','道争发动中：神力上限 −20%（侵蚀 40+ 扩至 −30%）。'));
    if(st.resonance && st.resonance.length){
      st.resonance.forEach(r=>{
        const rs=RESONANCE[r.path];
        const lbl = r.strong ? (rs.four.label||'强化') : (rs.two.label||'共鸣');
        bp.appendChild(h('div','resonance',`同道共鸣：${PATHS[r.path].name}系 ${r.strong?'齐聚':'双格'} —— ${lbl}`));
      });
    }
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

    /* 神明人脉 */
    const rp=h('div','panel');
    const metN=Object.keys(s.godsRel).filter(g=>s.godsRel[g].met && GODS[g]).length;
    rp.innerHTML=`<h2>神明人脉 <span class="sub">已识 ${metN} 位 · 点头像可送礼</span></h2>
      <div class="section-tip">交情至「相熟」，战斗关键时刻可呼叫其援助。送礼偏好：挚爱 +18 / 喜欢 +8 / 无感 +4 / 忌讳 +1，每日一礼。</div>`;
    Object.entries(GODS).forEach(([g,gd])=>{
      const rel=s.godsRel[g], met=rel&&rel.met;
      const unlocked=Game.isGodUnlocked(g);
      const lv=met?Game.favorLevel(rel.favor):0;
      const row=h('div','shop-row contact-row'+(met?'':' locked'));
      row.innerHTML=`
        <div class="item-ic" style="font-size:18px">${met?gd.icon:'?'}</div>
        <div class="item-body">
          <div class="sr-t">${gd.name} <span class="tier-tag tier-${(gd.tier||'e').toLowerCase()}">${gd.tier||'E'}</span>
            ${met?`<span style="color:var(--cinnabar);font-size:12px"> ${Game.favorName(lv)} · ${rel.favor}</span>`:''}</div>
          <div class="sr-d">${met?gd.title
            :(!unlocked?(function(){const u=gd.unlock;return u&&u.rank!==undefined?`晋升「${RANKS[u.rank].name}」后可结识`:u&&u.chapter!==undefined?`主线第 ${u.chapter} 章后可结识`:u&&u.by!==undefined?`需 ${GODS[u.by].name} 引荐`:'机缘未至';})()
            :'闻名未识——接下其工单便算打上交道')}</div>
        </div>
        ${met?'<span class="tag tag-merit">已结识</span>':unlocked?'<span class="tag">未识</span>':'<span class="tag">未解锁</span>'}`;
      if(met) row.onclick=()=>this.openGodModal(g);
      rp.appendChild(row);
    });
    c.appendChild(rp);
  },

  /* ================= 下凡事件链 ================= */
  startMission(idx){
    const o=Game.s.shelf[idx];
    this.rt={ order:o, mid:o.mid, node:0, ctx:{atkBuff:0,shield:0,enemyAtk:0,enemyVuln:false}, result:null };
    Game.s.busy=true;
    Game.meetGod(this.mission().god);   // 接单即结识
    Game.save();
    this.view='mission';
    this.render();
    this.renderMissionNode();
    if(typeof Guide!=='undefined') Guide.act('startMission');
  },

  mission(){ return MISSIONS.find(x=>x.id===this.rt.mid); },
  /** 当前应渲染的节点序列：短单=nodes，长单=当前幕 nodes */
  curNodes(){
    const m=this.mission(), o=this.rt.order;
    if(m.long) return m.acts[Math.min(o.act||0, m.acts.length-1)].nodes;
    return m.nodes;
  },

  renderMissionNode(){
    const m=this.mission(), nodes=this.curNodes(), node=nodes[this.rt.node], god=GODS[m.god];
    const o=this.rt.order;
    const c=$('pageStage'); c.innerHTML='';
    const wrap=h('div','panel');
    const dots=nodes.map((n,i)=>`<i class="${i<this.rt.node?'done':i===this.rt.node?'cur':''}"></i>`).join('');
    const actTitle=m.long?`<span style="color:var(--gold)"> · ${m.acts[Math.min(o.act||0,m.acts.length-1)].title}</span>`:'';
    wrap.innerHTML=`
      <div class="mish-god">
        ${godAvatar(m.god,46)}
        <div style="flex:1">
          <div style="font-size:16px;font-weight:bold;letter-spacing:1px">${m.name}${actTitle}</div>
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
      const foeName=node.name||ENEMIES[node.enemy].name;
      const sc=h('div','scroll-card',`<span class="ink-mark">▍</span>前方杀气翻涌——<b style="color:var(--cinnabar)">${foeName}</b> 拦住去路！`);
      wrap.appendChild(sc);
      c.appendChild(wrap);
      this.runBattleNode(node);
    }
  },

  chooseEvent(i){
    const node=this.curNodes()[this.rt.node];
    const co=node.choices[i], r=co.r||{};
    /* 剧情档案：记录玩家抉择（'单id:幕号:节点号'->选项号） */
    Game.s.storyChoices[this.rt.mid+':'+(this.rt.order.act||0)+':'+this.rt.node]=i;
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
    /* v3 抉择后果：功过/人情/侵蚀/好感/旗标/免战跳节点 */
    if(r.merit) Game.s.merit+=r.merit;
    if(r.renqing) Game.s.renqing+=r.renqing;
    if(r.erode) Game.addErode(r.erode);
    if(r.cleanse) Game.reduceErode(r.cleanse);
    if(r.favor) Object.entries(r.favor).forEach(([g,n])=>Game.addFavor(g,n));
    if(r.flags) Object.entries(r.flags).forEach(([k,v])=>{
      if(typeof v==='number' && typeof Game.s.flags[k]==='number') Game.s.flags[k]+=v;
      else Game.s.flags[k]=(v===undefined?true:v);
    });
    if(r.skip) this.rt.pendingSkip=r.skip;
    this.rt.result=r.log||'你继续前行。';
    Game.save(); this.renderTop(); this.renderMissionNode();
    if(typeof Guide!=='undefined') Guide.act('chooseEvent');
  },

  nextNode(){
    this.rt.node++; this.rt.result=null;
    if(this.rt.pendingSkip){ this.rt.node+=this.rt.pendingSkip; this.rt.pendingSkip=0; }
    if(this.rt.node>=this.curNodes().length){ this.settle(); return; }
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
      if(this.rt.node>=this.curNodes().length){ this.settle(); return; }
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

    /* 长单：未到末幕 → 幕推进并跨天，明日续办 */
    if(m.long && (o.act||0) < m.acts.length-1){
      o.act=(o.act||0)+1;
      s.busy=false;
      const actDone=m.acts[o.act-1];
      const reviewed=Game.advanceDay();
      Game.save();
      this.view='office'; this.tab='desk';
      if(!reviewed){
        this.openNotice('长单·告一段落',
          `「${m.name}」<b>${actDone.title}</b>办完，人困神乏。<br>${GODS[m.god].name}传话："余下的事明日再办，案头单子给你留着。"<br>
           <span style="color:var(--ink-faint);font-size:13px">明日到工单架点「续办下凡」继续（第 ${o.act+1}/${m.acts.length} 幕）。</span>`,
          ()=>{ if(typeof Guide!=='undefined') Guide.act('noticeClosed'); });
      }
      this.render();
      return;
    }

    const money=Math.round(m.money*(o.bargain?1.5:1));
    /* v3 统一发奖：构建 reward 对象，grantReward 处理 gh/shards/dshards/pill/merit/money/favor/erode/flags */
    const rew = m.reward ? Object.assign({}, m.reward) : {};
    rew.money = (rew.money||0) + money;
    rew.merit = (rew.merit||0) + (m.merit||0);
    rew.favor = Object.assign({}, rew.favor||{});
    rew.favor[m.god] = (rew.favor[m.god]||0) + 4 + m.danger*2;
    const out = Game.grantReward(rew);
    s.renqing += 1;
    const gh = out.gh || {noGh:true};
    /* 主线幕 / 支线结案落 flag（防重复上架）；章末任务推进章节并敕封 */
    if(m.main) s.mainDone[m.main]=true;
    if(m.side) s.sideDone[m.side]=true;
    let mainMsg='';
    if(m.chapterEnd){
      if(s.chapter<=(m.chapter||1)) s.chapter=(m.chapter||1)+1;
      Game.promoteRank();
      mainMsg=`<div style="color:var(--cinnabar);margin-top:8px"><b>—— 第 ${m.chapter} 章终 ——</b><br>
        敕封「${RANKS[s.rank].name}」！神格盘与工单容量随品阶扩充。</div>`;
    }else if(m.main){
      mainMsg=`<div style="color:var(--cinnabar);margin-top:6px"><b>—— 主线推进 ——</b></div>`;
    }
    /* 移除已完成工单 */
    s.shelf=s.shelf.filter(x=>x!==o);
    s.busy=false;
    this.view='settle';
    Game.save();

    const c=$('pageStage'); c.innerHTML='';
    $('tabbar').classList.add('hidden');
    const wrap=h('div','panel settle');
    /* 奖励文案 */
    let rwdHtml=`香火钱 <b style="color:var(--gold)">+${money} 文</b><br>
      功过 <b style="color:var(--jade)">+${m.merit||0}</b> ｜ 人情 <b>+1</b> ｜ 与${GODS[m.god].name}交情 <b>+${4+m.danger*2}</b>`;
    if(gh.noGh){
      rwdHtml+=`<br><span style="color:var(--ink-faint)">低阶神拿不出神格作谢，这份人情他记下了。</span>`;
    }else{
      rwdHtml+=`<br>${GODS[m.god].name}赐你神格：<b>${gh.name}</b>（修为 +${gh.cultGain}）`;
    }
    if(out.shards && out.shards.length) out.shards.forEach(([p,n])=>{ rwdHtml+=`<br>碎末 <b>${PATHS[p].name}系 +${n}</b>`; });
    if(out.dshards && out.dshards.length) out.dshards.forEach(([g,n])=>{ rwdHtml+=`<br>同名碎片 <b>${GODS[g].name} +${n}</b>`; });
    if(out.pill) rwdHtml+=`<br>妖丹 <b>${PILLS[out.pill].name}</b>`;
    wrap.innerHTML=`<h3>${m.long?'长单完结 · 回衙复命':'差使办妥 · 回衙复命'}</h3>
      <div style="width:80px;height:80px;margin:6px auto 4px">${godAvatar(m.god,80)}</div>
      <div style="font-size:13px;color:var(--ink-faint);margin-bottom:6px">${GODS[m.god].name} 一揖到地</div>
      <div class="reward-line">${rwdHtml}</div>${mainMsg}`;
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

  /* ================= 剧情档案（卷宗架） ================= */
  openStoryArchive(){
    const s=Game.s;
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay');
    ov.onclick=(e)=>{ if(e.target===ov){ ml.innerHTML=''; ml.classList.add('hidden'); } };
    const box=h('div','paper m-box story-archive');
    box.innerHTML=`
      <div class="gg-head">
        <h2>剧情档案</h2>
        <span class="gc-skip" onclick="document.getElementById('modalLayer').innerHTML='';document.getElementById('modalLayer').classList.add('hidden');">✕</span>
      </div>
      <div class="gg-tip">主线归章，支线归档 · 已结之卷可翻开重读，含你当时的选择</div>`;
    const body=h('div','gg-body');

    /* 主线按章分组 */
    const CH_MAX=[1,2,3,4,5];
    CH_MAX.forEach(ch=>{
      const list=MISSIONS.filter(m=>m.main&&(m.chapter||1)===ch);
      if(!list.length) return;
      const grp=h('div','gg-camp');
      const met=list.filter(m=>m.main&&s.mainDone[m.main]).length;
      grp.innerHTML=`<div class="gg-camp-title">第 ${ch} 章 · 主线<span class="gg-camp-count"> 已结 ${met}/${list.length}</span></div>`;
      list.forEach(m=>grp.appendChild(this.storyCell(m)));
      body.appendChild(grp);
    });
    /* 支线一组 */
    const sides=MISSIONS.filter(m=>m.side);
    if(sides.length){
      const grp=h('div','gg-camp');
      const met=sides.filter(m=>s.sideDone[m.side]).length;
      grp.innerHTML=`<div class="gg-camp-title">支线 · 散差<span class="gg-camp-count"> 已结 ${met}/${sides.length}</span></div>`;
      sides.forEach(m=>grp.appendChild(this.storyCell(m)));
      body.appendChild(grp);
    }
    box.appendChild(body);
    ml.appendChild(ov); ml.appendChild(box);
    ml.classList.remove('hidden');
  },

  /* 卷宗格：已结可读 / 经办中 / 问号占位 */
  storyCell(m){
    const s=Game.s;
    const done=(m.main&&s.mainDone[m.main])||(m.side&&s.sideDone[m.side]);
    const onShelf=s.shelf.some(o=>o.mid===m.id);
    const tag=m.main?'主线':'支线';
    if(done){
      const cell=h('div','gg-cell sa-done',
        `<div class="sa-vol">卷</div>
         <div class="gg-name">${m.name}</div>
         <div class="gg-title">${tag} · ${'★'.repeat(m.danger)}</div>`);
      cell.onclick=()=>UI.openStoryScroll(m.id);
      return cell;
    }
    if(onShelf){
      return h('div','gg-cell gg-unknown',
        `<div class="gg-avatar gg-q">…</div>
         <div class="gg-name">经办中</div>
         <div class="gg-title">${tag}</div>`);
    }
    return h('div','gg-cell gg-unknown',
      `<div class="gg-avatar gg-q">？</div>
       <div class="gg-name">？？？</div>
       <div class="gg-title">尚未经办</div>`);
  },

  /* 翻开一卷：按节点串读剧情 + 抉择回显 */
  openStoryScroll(mid){
    const m=MISSIONS.find(x=>x.id===mid); if(!m) return;
    const s=Game.s, god=GODS[m.god];
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay');
    ov.onclick=(e)=>{ if(e.target===ov){ ml.innerHTML=''; ml.classList.add('hidden'); } };
    const box=h('div','paper m-box story-scroll');
    const back=h('div','gg-head');
    back.innerHTML=`<button class="btn btn-back">◂ 归档</button>
      <span class="gc-skip" onclick="document.getElementById('modalLayer').innerHTML='';document.getElementById('modalLayer').classList.add('hidden');">✕</span>`;
    back.querySelector('.btn-back').onclick=()=>UI.openStoryArchive();
    box.appendChild(back);

    const head=h('div','ss-head',`
      ${godAvatar(m.god,52)}
      <div style="flex:1;min-width:0">
        <div style="font-size:17px;font-weight:bold">${m.name}</div>
        <div style="font-size:12px;color:var(--ink-faint)">${god.name} · ${god.title} 委托 · ${m.main?('第 '+(m.chapter||1)+' 章 · 主线'):('支线 · '+(m.side||'').toUpperCase())}</div>
      </div>`);
    box.appendChild(head);

    const bodyEl=h('div','ss-body');
    const renderNodes=(nodes,actIdx,actTitle)=>{
      if(actTitle) bodyEl.appendChild(h('div','ss-act-title',actTitle));
      nodes.forEach((node,ni)=>{
        if(node.type==='event'){
          const seg=h('div','ss-node',`<div class="ss-text"><span class="ink-mark">▍</span>${node.text}</div>`);
          const ci=s.storyChoices[m.id+':'+actIdx+':'+ni];
          if(ci!==undefined && node.choices && node.choices[ci]){
            seg.appendChild(h('div','ss-choice','▸ 你当时选了：'+node.choices[ci].t));
          }
          bodyEl.appendChild(seg);
        }else if(node.type==='battle'){
          bodyEl.appendChild(h('div','ss-battle','⚔ 与 <b>'+(node.name||ENEMIES[node.enemy].name)+'</b> 一战'));
        }
      });
    };
    if(m.long){ m.acts.forEach((act,ai)=>renderNodes(act.nodes,ai,'〔第 '+(ai+1)+' 幕 · '+act.title+'〕')); }
    else renderNodes(m.nodes||[],0,null);

    box.appendChild(bodyEl);
    /* 卷尾注脚：结案所获 */
    const rv=m.reward||{};
    let foot='案卷归档 · 两界交界破神衙存照';
    if(rv.gh) foot='结案所获：神格「'+GODHOODS[rv.gh].name+'」 · '+foot;
    ml.appendChild(ov); ml.appendChild(box);
    box.appendChild(h('div','ss-foot',foot));
    ml.classList.remove('hidden');
  },

  /* ================= 众神谱系（关系网格） ================= */
  openGodGrid(){
    /* 阵营总路 + tier 支路；未结识的神以「圆圈问号」占位，不露真容 */
    const CAMP_ORDER=['天庭','地府','民间','妖仙','释门','上古'];
    const TIER_ORDER=['E','D','C','B','A','S'];
    /* 按 camp 分组 + tier 子分组（含未解锁，占位归组） */
    const byCamp={};
    Object.entries(GODS).forEach(([gid,gd])=>{
      const camp=gd.camp||'民间';
      const tier=gd.tier||'E';
      if(!byCamp[camp]) byCamp[camp]={};
      if(!byCamp[camp][tier]) byCamp[camp][tier]=[];
      byCamp[camp][tier].push(gid);
    });

    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay');
    ov.onclick=(e)=>{ if(e.target===ov){ ml.innerHTML=''; ml.classList.add('hidden'); } };
    const box=h('div','paper m-box god-grid');
    box.innerHTML=`
      <div class="gg-head">
        <h2>众神谱系</h2>
        <span class="gc-skip" onclick="document.getElementById('modalLayer').innerHTML='';document.getElementById('modalLayer').classList.add('hidden');">✕</span>
      </div>
      <div class="gg-tip">全谱 ${GODS_TOTAL} 位（首批实装 47 位，余者后续登场）· 点击已结识的神看登场小传 / 来历出处 / 援助招式</div>`;
    const body=h('div','gg-body');
    CAMP_ORDER.forEach(camp=>{
      const tiers=byCamp[camp]; if(!tiers) return;
      const campEl=h('div','gg-camp');
      const campAll=Object.values(tiers).reduce((a,b)=>a+b.length,0);
      const campMet=Object.values(tiers).reduce((a,b)=>a+b.filter(g=>Game.isGodUnlocked(g)).length,0);
      campEl.innerHTML=`<div class="gg-camp-title">${camp}<span class="gg-camp-count"> 已识 ${campMet}/${campAll}</span></div>`;
      TIER_ORDER.forEach(tier=>{
        const list=tiers[tier]; if(!list) return;
        const tierRow=h('div','gg-tier-row');
        tierRow.innerHTML=`<div class="gg-tier-label">${tier}</div>`;
        const grid=h('div','gg-grid');
        list.forEach(gid=>{
          const gd=GODS[gid];
          if(!Game.isGodUnlocked(gid)){
            /* 未结识：圆圈问号占位，不可点击 */
            const unk=h('div','gg-cell gg-unknown',
              `<div class="gg-avatar gg-q">？</div>
               <div class="gg-name">？？？</div>
               <div class="gg-title">尚未结识</div>`);
            grid.appendChild(unk);
            return;
          }
          const card=h('div','gg-cell',
            `<div class="gg-avatar">${godAvatar(gid,48)}</div>
             <div class="gg-name">${gd.name}</div>
             <div class="gg-title">${gd.title||''}</div>`);
          card.onclick=()=>UI.openGodModal(gid);
          grid.appendChild(card);
        });
        tierRow.appendChild(grid);
        campEl.appendChild(tierRow);
      });
      body.appendChild(campEl);
    });
    box.appendChild(body);
    ml.appendChild(ov); ml.appendChild(box);
    ml.classList.remove('hidden');
  },

  /* ================= 神明档案（好感 / 送礼） ================= */
  openGodModal(g){
    const gd=GODS[g]; if(!gd) return;
    const s=Game.s, rel=s.godsRel[g]||{met:0,favor:0};
    const lv=Game.favorLevel(rel.favor);
    const cur=FAVOR_LEVELS[lv], next=FAVOR_LEVELS[lv+1];
    const unlocked=Game.isGodUnlocked(g);
    const aidOk=rel.met && lv>=1;
    const aidLv=Game.aidLevelOf(g);
    const aidPct=Math.round(Game.aidFactor(g)*100);
    /* 解锁条件文案 */
    let unlockTxt='';
    if(!unlocked && gd.unlock){
      const u=gd.unlock;
      unlockTxt = u.rank!==undefined ? `晋升至「${RANKS[u.rank].name}」后方可结识`
                : u.chapter!==undefined ? `主线推进至第 ${u.chapter} 章后方可结识`
                : u.by!==undefined ? `需 ${GODS[u.by].name} 引荐`
                : '机缘未至';
    }
    /* 背包里的礼物 */
    const gifts=Object.keys(s.bag).filter(id=>ITEMS[id] && ITEMS[id].slot==='gift');
    const today=s.month*100+s.day;
    const giftToday=rel.giftDay===today;
    const pr=gd.gifts||{};
    const prefTag=id=> (pr.loved||[]).indexOf(id)>=0 ? '<span style="color:var(--cinnabar)">挚爱</span>'
                    : (pr.liked||[]).indexOf(id)>=0 ? '<span style="color:var(--jade)">喜欢</span>'
                    : (pr.disliked||[]).indexOf(id)>=0 ? '<span style="color:var(--ink-faint)">忌讳</span>'
                    : '<span style="color:var(--ink-faint)">无感</span>';

    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay'), box=h('div','paper m-box god-modal');
    box.innerHTML=`
      <div class="gm-head">
        ${godAvatar(g,64)}
        <div class="gm-name">
          <div style="font-size:18px;font-weight:bold">${gd.name} <span class="tier-tag tier-${(gd.tier||'e').toLowerCase()}">${gd.tier||'E'}</span></div>
          <div style="font-size:12px;color:var(--ink-faint)">${gd.title}</div>
        </div>
      </div>
      ${unlocked?`<div class="gm-block gm-intro">
        <div class="gm-label">登场小传</div>
        <div class="gm-intro-text">${gd.intro||''}</div>
        ${gd.sources?`<div class="gm-sources">📖 出处：${gd.sources}</div>`:''}
      </div>`:''}
      ${rel.met
        ? `<div class="favor-block">
             <div class="favor-lv">交情：<b style="color:var(--cinnabar)">${cur.name}</b>
               ${next?`<span style="color:var(--ink-faint);font-size:12px">（再 ${next.v-rel.favor} 点进阶「${next.name}」）</span>`:'<span style="color:var(--ink-faint);font-size:12px">（已至顶）</span>'}</div>
             <div class="favor-bar"><i style="width:${Math.min(100,rel.favor/140*100)}%"></i></div>
             <div style="font-size:12px;color:var(--ink-faint)">好感 ${rel.favor}/140 · 每日一礼，办差亦增进交情</div>
           </div>
           ${aidOk?`<div class="aid-hint">◆ 援助档位【${FAVOR_LEVELS[aidLv].name}】· 威力 ${aidPct}%：战斗关键时刻可呼叫「<b>${gd.aid.name}</b>」——${gd.aid.desc}</div>`
                  :`<div class="aid-hint" style="color:var(--ink-faint)">◆ 交情至「相熟」（好感 20），战斗关键时刻可呼叫其援助（五档：神念25%/分身45%/完整75%/本体100%）</div>`}
           <div class="gm-gifts"><b>行囊中的礼物</b>${giftToday?'<span style="color:var(--ink-faint);font-size:12px"> · 今日已送过，明日再来</span>':''}</div>
           <div class="gift-list"></div>
           ${gifts.length?'':'<div class="section-tip">行囊中没有礼物。去「商铺 · 礼单」购些心意。</div>'}`
        : `<div class="section-tip">${unlockTxt||'尚未结识此神。接下其工单，便算打上了交道。'}</div>`}`;
    const gl=box.querySelector('.gift-list');
    if(gl){
      gifts.forEach(id=>{
        const it=ITEMS[id];
        const r=h('div','shop-row gift-row',
          `<div class="item-ic">${it.icon}</div>
           <div class="item-body">
             <div class="sr-t">${it.name} <span class="grade g-${itemGradeCls(it.grade)}">${it.grade}</span> ${prefTag(id)}</div>
             <div class="sr-d">${it.desc}</div>
           </div>`);
        const b=h('button','btn btn-primary btn-sm','送出');
        b.disabled=giftToday;
        b.onclick=()=>{ ml.innerHTML=''; Game.sendGift(g,id); this.openGodModal(g); };
        r.appendChild(b); gl.appendChild(r);
      });
    }
    const cb=h('button','btn btn-ghost','合上档案');
    cb.style.marginTop='12px';
    cb.onclick=()=>{ ml.innerHTML=''; };
    box.appendChild(cb); ov.appendChild(box); ml.appendChild(ov);
  },

  /* ================= 月末考核（v3：上/称/下/不称职，连续两次不称职即贬） ================= */
  showReview({grade,target,bonus,fine,strikes,gameOver}){
    if(typeof Guide!=='undefined') Guide.act('review');
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay'), box=h('div','paper review-card');
    if(gameOver){
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
    const sealMap={shang:'优',ping:'称',xia:'平',bu:'过'};
    const gradeName={shang:'上考',ping:'称职',xia:'下考',bu:'不称职'}[grade]||'不称职';
    const sealColor = grade==='shang'?'var(--cinnabar)':grade==='bu'?'#6f6a7a':'var(--jade)';
    box.innerHTML=`
      <div class="big-seal" style="background:${sealColor}">${sealMap[grade]||'过'}</div>
      <h2>考核 · ${gradeName}</h2>
      <div class="review-list">
        <div>本月功过目标：${target} 点 ｜ 实得 ${Game.s.merit} 点</div>
        ${bonus?`<div>阎王爷朱批：<b>尚堪驱驰</b>，赏香火钱 ${bonus} 文。</div>`:''}
        ${fine?`<div>阎王爷朱批：<b>着实废物</b>，罚没香火钱 ${fine} 文，记大过一次（${strikes}/2）。</div>`:''}
        ${grade==='xia'?`<div>阎王爷朱批：<b>勉强够看</b>，无赏无罚。</div>`:''}
        <div style="color:var(--ink-faint);font-size:13px;margin-top:6px">侵蚀值自然回落 3 点。晋升走主线敕封，不在此处。</div>
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
          <div class="intent-bubble" id="eIntent"></div>
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
    /* v3：敌人意图气泡 */
    const ie=$('eIntent');
    if(ie){
      const it=B.e.intentNext||B.e.intent||'mixed';
      const info=INTENT_INFO[it]||INTENT_INFO.mixed;
      ie.textContent=info.name;
      ie.title=info.desc;
      ie.className='intent-bubble intent-'+it;
    }
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

  /* 关键时刻：等待玩家抉择（v3：援助五档 / 技能冷却 / 读招克制提示） */
  battleMoment(B){
    return new Promise(resolve=>{
      this._momentResolve=resolve;
      const slot=$('momentSlot'); if(!slot){ resolve({act:'flee'}); return; }
      const m=h('div','moment');
      /* 神明援助：好感 Lv1+（相熟），AID_POWER > 0 即可，每场一次 */
      const gm=this.mission?this.mission():null;
      const gkey=gm?gm.god:null;
      const canAid=gkey && !B.aidUsed && Game.aidFactor(gkey)>0;
      const aidPct = gkey ? Math.round(Game.aidFactor(gkey)*100) : 0;
      const aidLvName = gkey ? FAVOR_LEVELS[Game.aidLevelOf(gkey)].name : '';
      m.innerHTML=`<h3>关键时刻 · 你当如何？</h3>
        <div class="m-actions">
          <button class="btn btn-indigo" id="mCast">祭法宝（催动神格神通）</button>
          ${canAid?`<button class="btn btn-primary" id="mAid">呼神援助（${GODS[gkey].name}·${GODS[gkey].aid.name} · ${aidLvName}${aidPct}%威力）</button>`:''}
          <button class="btn" id="mBurn">拼命（透支神格，沉睡三日）</button>
          <button class="btn" id="mWait">凝神接战（见招拆招）</button>
          <button class="btn btn-ghost" id="mFlee">遁走（保命，委托失败）</button>
        </div><div id="mSub"></div>`;
      slot.innerHTML=''; slot.appendChild(m);
      if(typeof Guide!=='undefined') Guide.act('momentOpen');
      const gdone=v=>{ slot.innerHTML=''; if(typeof Guide!=='undefined') Guide.act('momentDone'); resolve(v); };

      $('mWait').onclick=()=>gdone({act:'wait'});
      $('mFlee').onclick=()=>gdone({act:'flee'});
      if($('mAid')) $('mAid').onclick=()=>gdone({act:'aid'});
      $('mCast').onclick=()=>{
        const sub=$('mSub'); sub.innerHTML='<div class="skill-list"></div>';
        const list=sub.firstChild;
        const ids=B.p.skillIds;
        if(!ids.length){ sub.innerHTML='<div class="section-tip" style="margin-top:8px">你还没有觉醒任何神格神通。可选择凝神接战、拼命或遁走。</div>'; return; }
        /* 当前意图用于读招克制提示 */
        const curIntent = B.e.intentNext||B.e.intent||'mixed';
        const ci = COUNTER[curIntent];
        ids.forEach(id=>{
          const g=GODHOODS[id], a=g.active;
          const cd=B.p.cooldowns[id]||0;
          const isCounter = ci && ci.skill && ci.skill.includes(a.type);
          const cdHtml = cd>0 ? `<span class="sp-cost" style="color:var(--cinnabar)">冷却 ${cd}回合</span>` : `<span class="sp-cost">神力 ${a.cost}</span>`;
          const ctrHtml = isCounter ? `<span style="color:var(--jade);font-size:11px"> ◆读招克制！</span>` : '';
          const b=h('button','skill-pick'+(isCounter?' counter':''),
            `<b>${g.name}·${a.name}</b> ${cdHtml}${ctrHtml}<br>
             <span style="font-size:12px;color:var(--ink-soft)">${a.desc}</span>`);
          b.disabled = cd>0 || B.p.mp<a.cost;
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
