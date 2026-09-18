/* ================= 天道打工人 · 界面层（分页版） ================= */
const $ = id => document.getElementById(id);
const h = (tag, cls, html)=>{ const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };
/* 头像：有立绘的神（GOD_ART 25 位）优先用 img/g_<gid>.jpg 圆裁，回退 av_<gid>.jpg；
   缺失则 onerror 移除 img，露出下层毛笔字（不再直连在线图床） */
function godAvatar(key,px){
  const g=GODS[key];
  const hasArt = typeof GOD_ART!=='undefined' && GOD_ART.includes(key);
  const src = hasArt ? 'img/g_'+key+'.jpg' : ASSET.avatarFile(key);
  const onerr = hasArt ? `this.onerror=()=>this.remove();this.src='${ASSET.avatarFile(key)}'` : 'this.remove()';
  return `<span class="gh-ava" style="width:${px}px;height:${px}px;font-size:${Math.round(px*.5)}px"><span>${g.icon}</span><img alt="${g.name}" src="${src}" onload="this.classList.add('loaded')" onerror="${onerr}"></span>`;
}
/* 物品/法宝图标：文字兜底 + ASSET 挂载图片 */
function ic(id,txt,big){ return `<div class="item-ic${big?' big':''}">${ASSET.html('it_'+id,'item-img',txt)}<span class="ic-txt">${txt}</span></div>`; }

/* 顶栏 8 个属性的点击弹窗文案 */
const STAT_INFO = {
  rank:{
    name:'品阶', fallback:'品', img:'stat_rank',
    用途:'决定你可接工单的品阶上限、可召唤援助的神格档位上限，以及 KPI 考核的难度系数。',
    来源:'两界劳务契上白纸黑字写死的档位。九品从九品是外包，七品以上才算有正式编制。',
    作用:'每升一品，HP/MP 基础值 +15，解锁新的神格槽位和装备槽位，众神对你的初始态度也会变化。',
    介绍:'外包阴神没资格挑活，活多钱少背锅快；正式神则有编有俸，养尊处优但 KPI 不达标一样贬谪。'
  },
  calendar:{
    name:'两界日历', fallback:'日', img:'stat_calendar',
    用途:'显示你在两界办差了多少天。每月 30 日，月底阎王爷考功过，不够 65 记贬谪。',
    来源:'天地运行自有节律。你签的劳务契按两界日历计酬，逾期自动扣钱。',
    作用:'时间推进触发：每日结算侵蚀、香火钱自然衰减、人情每日扣 2 点（未送）、工单自动上架下架。',
    介绍:'凡人看阳历年月日，你看两界日历——正月不接阴差，七月鬼门大开，神仙也得歇年节。'
  },
  cult:{
    name:'修为', fallback:'修', img:'stat_cult',
    用途:'综合反映你当前的神格等级。通过凝聚碎末、合成神格、战斗历练提升。',
    来源:'来自神格入体的累积感悟，以及战斗中以战养战的修行。',
    作用:'修为越高，攻击/防御/暴击基础值越高，某些高阶神格需要修为门槛才能凝出。',
    介绍:'外包阴神的修行路：从阴差到巡山夜叉，再到判官，最后能不能坐上阎王爷的位子——看你打多少杂工。'
  },
  money:{
    name:'香火钱', fallback:'钱', img:'stat_money',
    用途:'可用于商铺买装备、给神明送礼、招阴兵、炼化丹药、升级神衙。',
    来源:'工单结算（主力）、出售装备/丹药、神衙投资分红、神明援助回礼。',
    作用:'没钱寸步难行。HP 归零的死亡惩罚还要扣 15% 香火钱，死不起啊。',
    介绍:'神仙的钱叫"香火钱"，因为最早的神仙靠民间烧香供奉吃饭。你是外包，给神仙干活神仙给你香火钱，变相是神仙在发工资。'
  },
  favor:{
    name:'人情', fallback:'情', img:'stat_favor',
    用途:'显示你与所有神明的交情总值。战斗紧急时刻（HP<30%）可呼叫已结识的神援助。',
    来源:'接单即结识（+2）、战斗成功神感谢（+4）、送礼（挚爱+18 / 喜欢+8 / 无感+4 / 忌讳+1）。',
    作用:'交情到"相熟"的神可呼叫援助，交情越深援助威力越大。忌讳礼送多了交情会反向。',
    介绍:'神仙也是人情社会。阎王爷送钟馗的钟馗像他就笑纳，送灶王爷他就拉黑你——记住每个神的爱好，别送错。'
  },
  erode:{
    name:'侵蚀', fallback:'蚀', img:'stat_erode',
    用途:'反映神格道争对你精神的侵蚀。0 为清净，20-39 偶发幻觉，60+ 灯火将改（坏结局锁定）。',
    来源:'吸收相冲的神格（主因）、某些结局选项、长期维持高道争的战斗风格。',
    作用:'侵蚀≥2 时战斗偶有失误；≥3 时援助神可能降档；≥4 时终章倾向坏结局。',
    介绍:'外包阴神的核心矛盾：你靠吸收各路神格变强，但神格之间会打架——道争越烈侵蚀越重。结局分岔的关键之一。'
  },
  merit:{
    name:'本月功过', fallback:'过', img:'stat_merit',
    用途:'本月 KPI 进度条。月底阎王爷考功过，够 65 记升品，不够降品。',
    来源:'工单结算给功过（官遣+主线+长单给得多，支线给得少）。驳回工单倒扣功过。',
    作用:'功过不够 = 品阶下调 → 属性下降 + 可接工单降级 → 循环恶化；满额则额外奖励。',
    介绍:'阎王爷的考核指标很实在：每月 65 记功过起步。品阶越高目标越高，干不活就降级，外包又少一只。'
  },
  hp:{
    name:'神躯 / 神力', fallback:'躯', img:'stat_hp',
    用途:'HP（神躯）是战斗血量，归零则委托失败并受死亡惩罚；MP（神力）是释放技能/援助的消耗。',
    来源:'HP/MP 由品阶 + 修为 + 装备 + 神格槽位决定上限；每次战斗前满血满蓝。',
    作用:'HP 在战斗中归零 → 扣香火钱 15%、侵蚀 +3、推进一日；MP 不足无法释放技能或呼神。',
    介绍:'外包阴神的神躯本质是借来的——你只是一个容器，神格是主要战斗力。所以 HP 归零你不会真死，只会被打回原形继续打杂工。'
  },
};

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
    /* 画质升级：office 页签氛围底图 */
    if(typeof FX!=='undefined'){
      FX.setChapter(Game.s.chapter||1);
      FX.setScene(null);
      FX.setAmbient(this.tab==='desk'?'ui_desk':this.tab==='yamen'?'ui_yamen':'ui_main');
    }
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
    /* 顶栏玩家立绘随品阶换装（立绘共五档，高品复用 r4） */
    const sealImg=$('brandSealImg');
    if(sealImg) sealImg.src='img/p_r'+Math.min(s.rank||0,4)+'.jpg';
    const target=monthTarget(s.month);
    const eb=ERODE_BANDS[Game.erodeLevel()];
    const erodeHot = Game.erodeLevel()>=2;
    /* 辅助：生成 stat-chip（图片图标 + 点击弹窗） */
    const chip=(key, titleHTML, cls='')=>{
      const info=STAT_INFO[key];
      const imgHTML=typeof ASSET!=='undefined' && ASSET.list[info.img]
        ? ASSET.html(info.img,'sc-img',info.fallback)
        : '';
      return `<div class="stat-chip${cls?' '+cls:''}" data-stat="${key}" style="cursor:pointer">
        <span class="sc-ico">${imgHTML}<span class="sc-fallback" style="color:var(--ink)">${info.fallback}</span></span>
        <span class="sc-txt">${titleHTML}</span></div>`;
    };
    $('topStats').innerHTML =
      chip('rank',    `<span class="k">品阶</span><span class="v">${rk.name}</span>`) +
      chip('calendar',`<span class="k">两界日历</span><span class="v">${s.month}<small>月</small> ${s.day}<small>日</small></span>`) +
      chip('cult',    `<span class="k">修为</span><span class="v">${s.cult}</span>`) +
      chip('money',   `<span class="k">香火钱</span><span class="v">${s.money}<small> 文</small></span>`) +
      chip('favor',   `<span class="k">人情</span><span class="v">${s.renqing}</span>`) +
      chip('erode',   `<span class="k">侵蚀</span><span class="v">${s.erode}<small> ${eb.name}</small></span>`, erodeHot?'erode-hot':'') +
      chip('merit',   `<span class="k">本月功过</span><span class="v">${s.merit}/${target}</span>`, s.merit>=target?'':'kpi-hot') +
      /* 神躯/神力 chip 特殊：带血条 */
      `<div class="stat-chip bar-chip" data-stat="hp" style="cursor:pointer">
        <span class="sc-ico">${typeof ASSET!=='undefined'?ASSET.html('stat_hp','sc-img','躯'):''}<span class="sc-fallback" style="color:#a8382c">躯</span></span>
        <span class="sc-txt" style="flex:1"><span class="k">神躯 ${Math.max(0,Math.round(s.hp))}/${st.maxHp} ｜ 神力 ${st.maxMp}</span>
        <div class="bar"><i class="bar-hp" style="width:${Math.max(0,s.hp/st.maxHp*100)}%"></i></div></span>
      </div>`;
    /* 绑定点击事件（事件委托，避免 innerHTML 丢失） */
    setTimeout(()=>{
      document.querySelectorAll('#topStats .stat-chip').forEach(el=>{
        el.addEventListener('click', ()=>{
          const k=el.dataset.stat; if(k) UI.openStatInfo(k);
        });
      });
    },0);
  },

  /* ================= 顶栏属性详情弹窗 ================= */
  openStatInfo(key){
    const info=STAT_INFO[key]; if(!info) return;
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay');
    ov.onclick=(e)=>{ if(e.target===ov){ ml.innerHTML=''; ml.classList.add('hidden'); } };
    const box=h('div','paper m-box stat-modal');
    const imgHTML=typeof ASSET!=='undefined' && ASSET.list[info.img]
      ? ASSET.html(info.img,'si-img',info.fallback)
      : '';
    box.innerHTML=`
      <div class="si-head">
        <div class="si-ico">${imgHTML}<span class="si-fallback">${info.fallback}</span></div>
        <div class="si-title">
          <h3>${info.name}</h3>
          <span class="gc-skip" onclick="document.getElementById('modalLayer').innerHTML='';document.getElementById('modalLayer').classList.add('hidden');">✕</span>
        </div>
      </div>
      <div class="si-body">
        <div class="si-row"><b class="si-l">用途</b><div class="si-v">${info.用途}</div></div>
        <div class="si-row"><b class="si-l">来源</b><div class="si-v">${info.来源}</div></div>
        <div class="si-row"><b class="si-l">作用</b><div class="si-v">${info.作用}</div></div>
        <div class="si-row"><b class="si-l">介绍</b><div class="si-v">${info.介绍}</div></div>
      </div>`;
    ov.appendChild(box); ml.appendChild(ov); ml.classList.remove('hidden');
    /* 手动扫描弹窗内的 img，确保资产管线挂载（不依赖 MutationObserver 时序） */
    if(typeof ASSET!=='undefined') ASSET.scan(ml);
    if(typeof FX!=='undefined') FX.scanAvatars && FX.scanAvatars(ml);
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
      const card=h('div','order'+(m.forced?' forced':'')+(typeof ASSET!=='undefined'?' order-bg':'')+' order-ch'+(m.chapter||1));
      /* 画质批3：卡片优先用 task_<id> 专属场景图，fallback 章节 bf 图 */
      if(typeof ASSET!=='undefined'){
        const taskKey='task_'+m.id;
        const bgKey=ASSET.list[taskKey] ? taskKey : ASSET.bfKey(m.chapter||1, (m.danger||0)>=4);
        card.dataset.bgKey=bgKey;
        ASSET.bg(card, bgKey, 1);
      }
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
          <span style="font-size:11px;color:var(--ink-faint)">${g.fusion?'【融合】':PATHS[g.path].name+'系 · '+(g.god||'天道自生')}</span></div>
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
    ASSET.bg(hero, 'ui_hero', 1);
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
      const imgHTML=ASSET.list['fac_'+key]?ASSET.html('fac_'+key,'ya-img',f.icon):'';
      const r=h('div','shop-row',
        `<div><div class="sr-t">
          <span class="ya-ico">${imgHTML}<span class="ya-fb">${f.icon}</span></span>
          ${f.name} <span class="lv-tag">${lv} 级</span>
         </div>
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
      const imgHTML=ASSET.list['sol_'+id]?ASSET.html('sol_'+id,'ya-img',so.icon):'';
      const r=h('div','shop-row',
        `<div><div class="sr-t">
          <span class="ya-ico">${imgHTML}<span class="ya-fb">${so.icon}</span></span>
          ${so.name}</div><div class="sr-d">${so.desc}</div></div>
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
          ${ic(id,it.icon)}
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
          ic(id,it.icon)+`
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
          ${ic(id,it.icon,true)}
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
        ic(id,it.icon)+`
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
      <div class="me-seal"><img src="img/p_r${Math.min(s.rank||0,4)}.jpg" alt="你"></div>
      <div class="me-id">
        <div class="me-rank">${rk.name}</div>
        <div class="sr-d">第 ${s.month} 月 ${s.day} 日 ｜ 修为 <b>${s.cult}</b> ｜ 香火钱 <b style="color:var(--gold)">${s.money} 文</b> ｜ 人情 <b>${s.renqing}</b></div>
      </div>`;
    idp.querySelector('.me-seal').onclick=()=>this.openPlayerPortrait();
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
          ic(id,it.icon)+`
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
    rp.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <h2 style="margin:0">神明人脉 <span class="sub">已识 ${metN} 位 · 点头像可送礼</span></h2>
        <button class="btn btn-primary btn-sm" id="btnGodCodex">📖 神仙图鉴</button>
      </div>
      <div class="section-tip">交情至「相熟」，战斗关键时刻可呼叫其援助。送礼偏好：挚爱 +18 / 喜欢 +8 / 无感 +4 / 忌讳 +1，每日一礼。</div>`;
    rp.querySelector('#btnGodCodex').onclick=()=>this.openGodCodex();
    Object.entries(GODS).forEach(([g,gd])=>{
      const rel=s.godsRel[g], met=rel&&rel.met;
      /* 只渲染已结识的；未解锁/未结识的完全隐藏 */
      if(!met) return;
      const lv=Game.favorLevel(rel.favor);
      const row=h('div','shop-row contact-row');
      row.innerHTML=`
        ${godAvatar(g,40)}
        <div class="item-body">
          <div class="sr-t">${gd.name} <span class="tier-tag tier-${(gd.tier||'e').toLowerCase()}">${gd.tier||'E'}</span>
            <span style="color:var(--cinnabar);font-size:12px"> ${Game.favorName(lv)} · ${rel.favor}</span></div>
          <div class="sr-d">${gd.title}</div>
        </div>
        <span class="tag tag-merit">已结识</span>`;
      row.onclick=()=>this.openGodModal(g);
      rp.appendChild(row);
    });
    c.appendChild(rp);
  },

  /* ================= 下凡事件链 ================= */
  startMission(idx){
    const o=Game.s.shelf[idx];
    this.rt={ order:o, mid:o.mid, node:0, ctx:{atkBuff:0,shield:0,enemyAtk:0,enemyVuln:false}, result:null };
    Game.s.busy=true;
    const isNew=Game.meetGod(this.mission().god);   // 接单即结识；首次结识在故事过场之后展「仙驾初临」
    Game.save();
    this.view='mission';
    this.render();
    /* 顺序：下凡过场（场景图 → 任务故事）→ 委托神初见登场卷 → 进入剧情节点；
       场景底图提前挂到 mission 页，新手引导延后到进入节点后，避免被遮挡 */
    const m=this.mission();
    const bgKey=ASSET.list['task_'+m.id]?'task_'+m.id:ASSET.sceneKey(m.chapter||Game.s.chapter||1);
    if(typeof FX!=='undefined'){ FX.setAmbient(null); FX.setScene(bgKey, .45); }
    const enterNode=()=>{
      this.renderMissionNode();
      if(typeof Guide!=='undefined') Guide.act('startMission');
    };
    this.showMissionIntro(m, bgKey, ()=>{
      /* 长单续办等已结识情形：故事讲完直接办差；初见：故事之后拜见委托神 */
      if(isNew) this.showGodDebut(m.god, enterNode, {first:true});
      else enterNode();
    });
  },

  /* 仙驾初临 · 神仙登场卷（两阶段，复用下凡过场的水墨语言）
     阶段一 照面：立绘/字牌 + 尊号名号 + 品阶阵营 + 亲笔开场白 quote；
     阶段二 知底：司职小传 intro、民间典故 story、典籍出处 sources 逐段展开。
     opts.first=接单首遇（末幕接下凡过场）；opts.review=图鉴重温（末幕回大图页）。
     每位神仙仅首遇自动展一次；重温入口在神仙图鉴。 */
  showGodDebut(g, cb, opts){
    opts=opts||{};
    const gd=GODS[g];
    if(!gd){ cb&&cb(); return; }
    const ml=$('modalLayer'); ml.innerHTML=''; ml.classList.remove('hidden');
    const hasArt = typeof GOD_ART!=='undefined' && GOD_ART.includes(g);
    const src = hasArt ? 'img/g_'+g+'.jpg' : ASSET.avatarFile(g);
    const onerr = hasArt ? `this.onerror=()=>this.remove();this.src='${ASSET.avatarFile(g)}'` : 'this.remove()';
    const quoteHtml = gd.quote ? `<div class="db-quote">「${gd.quote}」</div>` : '';
    const sec=(cls,label,text)=> text ? `<div class="db-sec ${cls}"><label>${label}</label><p>${text}</p></div>` : '';
    const go2 = opts.review ? '轻触，合上仙录 ▸' : (opts.mid ? '轻触，继续 ▸' : '轻触，接卷办差 ▸');
    const ov=h('div','debut'+(opts.review?' is-review':''));
    ov.innerHTML=`
      <div class="db-wash"></div>
      <div class="db-seal"><span>${opts.review?'仙录重温':'仙驾初临'}</span></div>
      <div class="db-body">
        <div class="db-stage">
          <div class="db-face"><span class="db-char">${gd.icon}</span><img alt="${gd.name}" src="${src}" onload="this.classList.add('ok')" onerror="${onerr}"></div>
          <div class="db-id">
            <div class="db-title">${gd.title}</div>
            <div class="db-name">${gd.name}</div>
            <div class="db-tags"><i>${gd.tier}品</i><i>${gd.camp}</i></div>
            ${quoteHtml}
          </div>
        </div>
        <div class="db-scroll">
          ${sec('db-sec-intro','司职小传',gd.intro)}
          ${sec('db-sec-story','民间典故',gd.story)}
          ${sec('db-sec-src','典籍出处',gd.sources)}
        </div>
      </div>
      <div class="db-go"><span class="db-go-1">轻触，拜见 ▸</span><span class="db-go-2">${go2}</span></div>`;
    ml.appendChild(ov);

    let stage=0, done=false;
    const goNext=()=>{
      if(done) return;
      if(stage===0){
        stage=1;
        ov.classList.add('story');
        const sc=ov.querySelector('.db-scroll');
        ov.querySelectorAll('.db-scroll .db-sec').forEach((el,i)=>{ el.style.transitionDelay=(0.18+i*0.22)+'s'; });
        requestAnimationFrame(()=>sc.classList.add('show'));
        /* 兜底：标签恰在后台时 rAF 可能挂起，setTimeout 补一次 */
        setTimeout(()=>{ if(ov.isConnected && !sc.classList.contains('show')) sc.classList.add('show'); }, 160);
        return;
      }
      done=true;
      document.removeEventListener('keydown', onKey);
      ov.classList.add('out');
      setTimeout(()=>{ ov.remove(); cb&&cb(); }, 460);
    };
    const onKey=e=>{
      if(e.key==='Enter'||e.key===' '||e.key==='Escape'){ e.preventDefault(); goNext(); }
    };
    ov.addEventListener('click', goNext);
    document.addEventListener('keydown', onKey);
  },

  /* 冲洗「剧情中首次结识」队列：选项/通关/结案结算后调用，依次补播登场卷，播完执行 cb */
  flushDebut(cb){
    const q=Game.s.pendingDebut;
    if(!q || !q.length){ cb&&cb(); return; }
    const g=q.shift();
    Game.save();
    this.showGodDebut(g, ()=>this.flushDebut(cb), {mid:true});
  },

  /* ================= 敌人登场（杀气压迫） =================
     tier 1-2 杂兵：黑红场快切，立绘+名号压屏，约1.4s自动隐去（可点掉）；
     tier 3+ 精英/Boss：全屏登场卷——立绘压顶→名号墨裂劈入→判语/特性/血量杀机，
     点击或按键「迎战」方揭幕开打。返回 Promise，由战斗引擎 await。 */
  showEnemyDebut(e){
    return new Promise(resolve=>{
      const ml=$('modalLayer'); ml.innerHTML=''; ml.classList.remove('hidden');
      const KIND={hun:['魂','游魂野魄'],gui:['鬼','阴司鬼类'],yao:['妖','山野妖修'],xiong:['凶','上古凶兽'],zhan:['战','战魂英灵'],ke:['壳','空壳神僚']};
      const INTENT={qiang:'强攻',xu:'蓄力',shou:'守势',mixed:'游斗'};
      const DREAD_T={3:'凶焰炽盛',4:'大凶临身',5:'劫数临头'};
      const kd=KIND[e.kind]||['祟','邪祟'];
      const src='img/e_'+e.id+'.jpg';
      const stars='✦'.repeat(e.tier)+'✧'.repeat(Math.max(0,5-e.tier));
      const dread=(typeof ENEMY_DREAD!=='undefined'&&ENEMY_DREAD[e.id])||'';
      /* 登场瞬间震屏一次 */
      document.body.classList.add('em-shake');
      setTimeout(()=>document.body.classList.remove('em-shake'),380);

      let done=false;
      const finish=()=>{
        if(done) return; done=true;
        document.removeEventListener('keydown',onKey);
        ov.classList.add('em-out');
        setTimeout(()=>{ ov.remove(); resolve(); },320);
      };
      const onKey=ev=>{
        if(ev.key==='Enter'||ev.key===' '||ev.key==='Escape'){ ev.preventDefault(); finish(); }
      };

      let ov;
      if(e.tier>=3){
        /* —— Boss 档：全屏杀机登场卷 —— */
        const weak=(e.weak||[]).map(p=>(typeof PATHS!=='undefined'&&PATHS[p])?PATHS[p].name:p).join(' / ')||'无显豁';
        const tags=(e.traits&&e.traits.tags?e.traits.tags:[]).slice(0,3)
          .map(t=>`<i>${t}</i>`).join('');
        const intentTxt=INTENT[e.intentNext]||'游斗';
        ov=h('div','em-debut tier'+e.tier);
        ov.innerHTML=`
          <div class="em-wash"></div><div class="em-glow"></div>
          <div class="em-face"><span class="em-char">${kd[0]}</span><img alt="${e.name}" src="${src}" onload="this.classList.add('ok')" onerror="this.remove()"></div>
          <div class="em-cap">
            <div class="em-kind">${kd[1]} · ${DREAD_T[e.tier]||'凶焰炽盛'} <span class="em-stars">${stars}</span></div>
            <div class="em-name" data-name="${e.name}">${e.name}</div>
            ${dread?`<div class="em-dread">「${dread}」</div>`:''}
            <div class="em-tags">${tags}</div>
            <div class="em-data">
              <span><label>${e.hpLabel}</label><b>${e.maxHp}</b></span>
              <span><label>杀意倾向</label><b>${intentTxt}</b></span>
              <span><label>克星</label><b>${weak}</b></span>
            </div>
            <div class="em-go">拔 刀 迎 战 ▸</div>
          </div>`;
      }else{
        /* —— 杂兵档：快切压屏 —— */
        ov=h('div','em-quick tier'+e.tier);
        ov.innerHTML=`
          <div class="em-wash"></div><div class="em-glow"></div>
          <div class="eq-face"><span class="em-char">${kd[0]}</span><img alt="${e.name}" src="${src}" onload="this.classList.add('ok')" onerror="this.remove()"></div>
          <div class="eq-name">${e.name}</div>
          <div class="eq-stars">${stars}</div>`;
        setTimeout(finish,1500);
      }
      ov.addEventListener('click',finish);
      document.addEventListener('keydown',onKey);
      ml.appendChild(ov);
    });
  },

  /* ================= 晋升敕封仪式（章末 rank 提升时播放） =================
     实景电影五幕：
     一「圣旨降临」：降下圣旨全屏实景缓推 + 金字标题 + 金粒飘降；
     二「跪接天恩」：交叉淡化至第一人称接旨实景，金旨展卷、诏文逐行；
     三「落印」：朱印砸落（震屏+金尘）；
     四「脱胎换骨」：金光柱临身，旧品官身灰化散去，新金身自光中升起，全屏展示新阶立绘与名号/封号/职司；
     五「领旨谢恩」：旧阶→新阶、封号、恩典逐项亮起。
     自动播放约 15s；播放中点击/空格逐拍推进（首次点按进入快节奏），末幕再点闭合。返回 Promise。 */
  showRankPromotion(fromRank,toRank){
    /* 各品阶职司一句话（变身幕介绍用；不入 data.js） */
    const RANK_DUTY=[
      '两界杂差，按件计功',
      '职司两界跑腿、昼夜勾魂',
      '职司巡按地界、查访庙祀',
      '职司文案簿册、佐理刑名',
      '职司笔下判生死、定赏罚',
      '职司推勘疑狱、覆审旧案',
      '职司执律行刑、秋审定谳',
      '职司佐理酆都、纠察百司',
      '职司摄理一司、九卿之副'
    ];
    return new Promise(resolve=>{
      const oldR=RANKS[fromRank], newR=RANKS[toRank];
      const duty=RANK_DUTY[toRank]||'神职一新，恪恭厥职';
      const ed=(typeof RANK_EDICT!=='undefined'&&RANK_EDICT[toRank])||
        {seal:'敕命',hao:'加官进禄',edict:`敕封「${newR.name}」，神格盘与工单容量随品阶扩充。`};
      const ml=$('modalLayer'); ml.innerHTML=''; ml.classList.remove('hidden');

      /* 预载实景与新旧官身立绘，保证变身幕不断流 */
      const figI=Math.min(fromRank||0,4), figJ=Math.min(toRank||0,4);
      ['img/rp_descend.jpg','img/rp_receive.jpg',`img/p_r${figI}.jpg`,`img/p_r${figJ}.jpg`]
        .forEach(u=>{ const im=new Image(); im.src=u; });

      /* 恩典增量 */
      const gifts=[];
      if(newR.slots>oldR.slots) gifts.push(['神格盘槽位',`${oldR.slots} → ${newR.slots}`]);
      if(newR.shelf>oldR.shelf) gifts.push(['法宝货架',`${oldR.shelf} → ${newR.shelf}`]);
      if(newR.soldiers>oldR.soldiers) gifts.push(['阴兵编制',`${oldR.soldiers} → ${newR.soldiers}`]);
      if(newR.facCap>oldR.facCap) gifts.push(['设施上限',`${oldR.facCap} → ${newR.facCap}`]);
      if((typeof TIER_ORDER!=='undefined') && TIER_ORDER[newR.tierCap]>TIER_ORDER[oldR.tierCap])
        gifts.push(['可遣神格档位',`${oldR.tierCap} 档 → ${newR.tierCap} 档`]);

      /* 御印：四字排2×2，两字居中 */
      const sc=(ed.seal||'敕命').slice(0,4);
      const sealHtml=sc.length>=4
        ? `<i>${sc[0]}</i><i>${sc[1]}</i><i>${sc[2]}</i><i>${sc[3]}</i>`
        : `<i>${sc[0]||'敕'}</i><i>${sc[1]||'命'}</i>`;

      /* 落印金尘（围绕诏纸中下部炸开） */
      let dustHtml='';
      for(let i=0;i<18;i++){
        const l=32+Math.random()*36, t=52+Math.random()*22;
        const dx=(Math.random()-0.5)*360, dy=-(80+Math.random()*260);
        const d=0.9+Math.random()*0.9, delay=Math.random()*0.25;
        dustHtml+=`<span style="left:${l}%;top:${t}%;--dx:${dx}px;--dy:${dy}px;--d:${d}s;--dl:${delay}s"></span>`;
      }
      /* 第一幕飘降金粒 */
      let snowHtml='';
      for(let i=0;i<16;i++){
        const l=Math.random()*100, sd=5+Math.random()*6, sl=Math.random()*8;
        const sx=(Math.random()-0.5)*120;
        snowHtml+=`<i style="left:${l}%;--sd:${sd}s;--sl:${sl}s;--sx:${sx}px"></i>`;
      }

      const ov=h('div','rp-on');
      ov.innerHTML=`
        <div class="rp-photo rp-photo-down" style="background-image:url('img/rp_descend.jpg')"></div>
        <div class="rp-photo rp-photo-up" style="background-image:url('img/rp_receive.jpg')"></div>
        <div class="rp-veil"></div>
        <div class="rp-veil-deep"></div>
        <div class="rp-snow">${snowHtml}</div>
        <div class="rp-cap rp-cap-a">
          <div class="rp-cap-title">圣旨降临</div>
          <div class="rp-cap-sub">九 天 纶 音 &nbsp;·&nbsp; 降 恩 于 尔</div>
        </div>
        <div class="rp-cap rp-cap-b">
          <div class="rp-cap-title">跪 接 天 恩</div>
          <div class="rp-cap-sub">整 衣 敛 容 &nbsp;·&nbsp; 俯 首 恭 迎</div>
        </div>
        <div class="rp-decree">
          <div class="rp-decree-inner">
            <div class="rp-pre rp-l1">奉天承运&nbsp;&nbsp;幽冥帝君&nbsp;&nbsp;敕曰</div>
            <div class="rp-rname rp-l2">敕封 <b>${newR.name}</b></div>
            <div class="rp-hao rp-l3">赐封号「<b>${ed.hao}</b>」</div>
            <div class="rp-edict rp-l4">${ed.edict}</div>
            <div class="rp-sign">幽冥帝君　敕</div>
            <div class="rp-seal"><span class="${sc.length>=4?'rp-seal4':'rp-seal2'}">${sealHtml}</span></div>
          </div>
        </div>
        <div class="rp-dust">${dustHtml}</div>
        <div class="rp-morph">
          <div class="rp-rays"><i></i><i></i><i></i></div>
          <div class="rp-morph-tag">脱 胎 换 骨</div>
          <div class="rp-beam"></div>
          <div class="rp-figure">
            <img class="rp-fig-old" src="img/p_r${figI}.jpg" alt="旧品官身" onerror="this.remove()">
            <img class="rp-fig-new" src="img/p_r${figJ}.jpg" alt="新品官身" onerror="this.remove()">
          </div>
          <div class="rp-flash"></div>
          <div class="rp-idcard">
            <div class="rp-id-kicker">天 曹 换 骨 · 新 授 官 身</div>
            <div class="rp-id-name">${newR.name}</div>
            <div class="rp-id-line"></div>
            <div class="rp-id-hao">「${ed.hao}」</div>
            <div class="rp-id-duty">${duty}</div>
          </div>
        </div>
        <div class="rp-final">
          <div class="rp-rays"><i></i><i></i><i></i></div>
          <div class="rp-final-tag">幽 冥 敕 封</div>
          <div class="rp-ranks"><span class="rp-old">${oldR.name}</span><i class="rp-arrow">▶</i><span class="rp-new">${newR.name}</span></div>
          <div class="rp-hao-big">「${ed.hao}」</div>
          <div class="rp-gifts">${gifts.map(g=>`<i><label>${g[0]}</label><b>${g[1]}</b></i>`).join('')}</div>
          <div class="rp-go">领 旨 谢 恩 ▸</div>
        </div>
        <div class="rp-hint">轻 触 续 进 ▸</div>`;

      let stage=0, rushed=false, done=false;
      const timers=[];
      const later=(fn,ms)=>{ timers.push(setTimeout(fn,ms)); };
      const clearTimers=()=>{ timers.forEach(clearTimeout); timers.length=0; };
      /* 落印震屏 */
      const slam=()=>{
        document.body.classList.add('rp-shake');
        later(()=>document.body.classList.remove('rp-shake'),460);
      };
      /* 进入某一幕：单调推进；manual=用户点按，之后整体节奏加快 */
      const enter=(n,manual)=>{
        if(done||n<=stage||n>5) return;
        clearTimers();
        if(manual&&!rushed){ rushed=true; ov.classList.add('rp-rush'); }
        while(stage<n){ stage++; ov.classList.add('s'+stage); }
        if(n===3) slam();
        if(stage<5){
          /* 正常：降临5s / 展卷3.9s / 落印1.8s / 变身4.6s；快节奏相应压缩 */
          const gap = rushed
            ? (n===1?1600:n===2?1000:n===3?800:3100)
            : (n===1?5000:n===2?3900:n===3?1800:4600);
          later(()=>enter(stage+1),gap);
        }
      };
      later(()=>enter(1),300);

      /* 闭合 */
      const finish=()=>{
        if(done) return; done=true;
        clearTimers();
        document.body.classList.remove('rp-shake');
        document.removeEventListener('keydown',onKey);
        ov.classList.add('rp-out');
        later(()=>{ ov.remove(); resolve(); },380);
      };
      /* 点按/按键：播放中逐拍推进，末幕闭合 */
      const onKey=ev=>{
        if(ev.key==='Enter'||ev.key===' '||ev.key==='Escape'){
          ev.preventDefault();
          if(stage>=5) finish(); else enter(stage+1,true);
        }
      };
      ov.addEventListener('click',()=>{ if(stage>=5) finish(); else enter(stage+1,true); });
      document.addEventListener('keydown',onKey);
      ml.appendChild(ov);
    });
  },

  /* 下凡过场层（两阶段）：
     阶段一：纯场景图全屏渐显，无任何标题/故事文字，只留「轻触继续」；
     点击后进入阶段二：题注 + 任务故事背景段落渐次浮现；再点击淡出进入剧情节点。
     长单续办（act>=1）时，故事取 MISSION_INTRO[id].acts[act]（该幕故事）。 */
  showMissionIntro(m, bgKey, cb){
    const ml=$('modalLayer');
    const ov=h('div','m-intro');
    const ch=m.chapter||Game.s.chapter||1;
    const actNo=this.rt&&this.rt.order?(this.rt.order.act||0):0;
    const tag=m.long ? `第 ${ch} 章 · 长差 · 第 ${actNo+1}/${m.acts.length} 幕`
      : m.main ? `第 ${ch} 章 · 主线官遣`
      : `支线 · ${(m.side||'').toUpperCase()}`;
    const god=GODS[m.god];
    const actTitle=(m.long&&actNo===0)?'':(m.long?`<div class="mi-act">${m.acts[Math.min(actNo,m.acts.length-1)].title}</div>`:'');
    /* 取故事段落：普通单=数组；长单 act0=all，act>=1=acts[act]；缺数据时为空 */
    let paras=[];
    const intro=(typeof MISSION_INTRO!=='undefined')?MISSION_INTRO[m.id]:null;
    if(intro){
      if(Array.isArray(intro)) paras=intro;
      else if(m.long) paras = actNo===0 ? (intro.all||[]) : ((intro.acts&&intro.acts[actNo])||[]);
    }
    const storyHtml=paras.length
      ? `<div class="mi-story">${paras.map(p=>`<p>${p}</p>`).join('')}</div>` : '';
    ov.innerHTML=`
      <div class="m-intro-bg"></div>
      <div class="m-intro-shade"></div>
      <div class="m-intro-cap">
        <div class="mi-tag">${tag}</div>
        ${actTitle}
        <div class="mi-name">${m.name}</div>
        <div class="mi-god">${god.name} · ${god.title} 委托</div>
        ${storyHtml}
      </div>
      <div class="mi-go"><span class="mi-go-1">轻触继续 ▸</span><span class="mi-go-2">轻触，前往办差 ▸</span></div>`;
    ml.appendChild(ov);
    ASSET.bg(ov.querySelector('.m-intro-bg'), bgKey, 1);

    /* 阶段机：0=纯图（仅可翻到故事）；1=故事已显（点击结束过场） */
    let stage=0, done=false;
    const goNext=()=>{
      if(done) return;
      if(stage===0){
        stage=1;
        ov.classList.add('story');
        const cap=ov.querySelector('.m-intro-cap');
        /* 故事段落逐段延迟显现 */
        cap.querySelectorAll('.mi-story p').forEach((p,i)=>{ p.style.transitionDelay=(0.25+i*0.18)+'s'; });
        requestAnimationFrame(()=>cap.classList.add('show'));
        return;
      }
      done=true;
      document.removeEventListener('keydown', onKey);
      ov.classList.add('out');
      setTimeout(()=>{ ov.remove(); cb&&cb(); }, 460);
    };
    const onKey=e=>{
      if(e.key==='Enter'||e.key===' '||e.key==='Escape'){ e.preventDefault(); goNext(); }
    };
    ov.addEventListener('click', goNext);
    document.addEventListener('keydown', onKey);
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
      const quit=h('button','btn btn-ghost btn-sm','⌂ 暂离回衙 · 单留案头');
      quit.style.marginTop='10px';
      quit.title='本次办理暂告段落，工单留在工单架，之后可重新接案（本幕进度从头计）';
      quit.onclick=()=>this.quitMission();
      wrap.appendChild(quit);
      if(this.rt.result){
        const rl=h('div','result-line','▸ '+this.rt.result);
        wrap.appendChild(rl);
        const next=h('button','btn btn-primary btn-mish-next','继续前行');
        next.style.marginTop='10px';
        next.onclick=()=>this.nextNode();
        wrap.appendChild(next);
      }
    }
    if(node.type==='quiz') this.renderQuiz(wrap,node);
    if(node.type==='game') this.renderGame(wrap,node);
    c.appendChild(wrap);
    /* 画质升级：下凡情景底图——优先本工单专属场景图全屏，无则退本章过场图；清页签氛围层避免叠图 */
    if(typeof FX!=='undefined'){
      FX.setAmbient(null);
      FX.setScene(ASSET.list['task_'+m.id]?'task_'+m.id:ASSET.sceneKey(m.chapter||Game.s.chapter||1), .45);
    }
    if(node.type==='event' && typeof Guide!=='undefined') Guide.act('eventNode');
    if(node.type==='battle'){
      const foeName=node.name||ENEMIES[node.enemy].name;
      const sc=h('div','scroll-card',`<span class="ink-mark">▍</span>前方杀气翻涌——<b style="color:var(--cinnabar)">${foeName}</b> 拦住去路！`);
      wrap.appendChild(sc);
      c.appendChild(wrap);
      this.runBattleNode(node);
    }
  },

  /* 问答门槛节点：须逐题答对（答错可反复重选，不答出行不了路），全对方可继续 */
  renderQuiz(wrap,node){
    const qs=node.qs||[node];
    let qi=0;
    const box=h('div','quiz-box');
    const quit=h('button','btn btn-ghost btn-sm','⌂ 暂离回衙 · 单留案头');
    quit.style.marginTop='10px';
    quit.title='考校未完，工单留在工单架，之后可重新接案（本幕进度从头计）';
    quit.onclick=()=>this.quitMission();
    const draw=()=>{
      box.innerHTML='';
      if(node.text) box.appendChild(h('div','scroll-card',`<span class="ink-mark">▍</span>${node.text}`));
      if(qi>=qs.length){
        this.applyNodePass(node,1);
        box.appendChild(h('div','quiz-done','✔ 对答如流，关隘已开'));
        const rl=h('div','result-line','▸ '+(node.pass&&node.pass.log||'你应声过关，继续前行。'));
        box.appendChild(rl);
        const next=h('button','btn btn-primary btn-mish-next','继续前行');
        next.style.marginTop='10px';
        next.onclick=()=>this.nextNode();
        box.appendChild(next);
        box.appendChild(quit);
        return;
      }
      const it=qs[qi];
      const rightTxt=it.opts[it.a];
      const opts=it.opts.slice();
      for(let k=opts.length-1;k>0;k--){ const j=Math.floor(Math.random()*(k+1)); [opts[k],opts[j]]=[opts[j],opts[k]]; }
      const head=h('div','quiz-head',
        `<span class="quiz-who">${node.who?'【'+node.who+' · 考校】':'【考校】'}</span><span class="quiz-prog">第 ${qi+1} / ${qs.length} 问</span>`);
      box.appendChild(head);
      box.appendChild(h('div','quiz-q',it.q));
      const list=h('div','quiz-opts');
      let answered=false, tipEl=null;
      opts.forEach(opt=>{
        const b=h('button','quiz-opt',opt);
        b.onclick=()=>{
          if(answered) return;
          if(opt===rightTxt){
            answered=true;
            b.classList.add('right');
            [...list.children].forEach(x=>x.disabled=true);
            box.appendChild(h('div','quiz-why','▸ '+it.why));
            qi++;
            const next=h('button','btn btn-primary btn-quiz-next', qi>=qs.length?'关隘已开，继续前行 ▸':'接下一问 ▸');
            next.style.marginTop='10px';
            next.onclick=()=>{ Game.save(); draw(); };
            box.appendChild(next);
          }else{
            b.classList.add('wrong'); b.disabled=true;
            if(!tipEl){ tipEl=h('div','quiz-tip','× 答岔了。再斟酌——此关答不过，前路行不得。'); box.appendChild(tipEl); }
          }
        };
        list.appendChild(b);
      });
      box.appendChild(list);
      box.appendChild(quit);
    };
    wrap.appendChild(box);
    draw();
  },

  /* 益智关卡节点：小游戏通关（失败局内重来）后方可继续；rating 1 满赏 / .6 半赏 */
  renderGame(wrap,node){
    const sc=h('div','scroll-card',`<span class="ink-mark">▍</span>${node.text||'前方设下一道关卡。'}`);
    wrap.appendChild(sc);
    const arena=h('div','mg-arena');
    wrap.appendChild(arena);
    const startRow=h('div','mg-start-row');
    const btn=h('button','btn btn-primary mg-btn','凝神 · 开始破局');
    let started=false;
    btn.onclick=()=>{
      if(started) return; started=true; btn.disabled=true; btn.textContent='破局中……';
      MiniGame.run(node.game, arena, {difficulty:node.difficulty||2}, (rating)=>{
        this.applyNodePass(node,rating);
        arena.innerHTML='';
        const perfect=rating>=1;
        const rl=h('div','result-line','▸ '+(node.pass&&node.pass.log||'机关已破，前行无碍。')+(perfect?' <span style="color:var(--gold)">（完美破局，赏罚从优）</span>':''));
        wrap.appendChild(rl);
        const next=h('button','btn btn-primary btn-mish-next','继续前行');
        next.style.marginTop='10px';
        next.onclick=()=>this.nextNode();
        wrap.appendChild(next);
      });
    };
    startRow.appendChild(btn);
    const quit=h('button','btn btn-ghost btn-sm','⌂ 暂离回衙 · 单留案头');
    quit.style.marginLeft='10px';
    quit.title='关卡未破，工单留在工单架，之后可重新接案（本幕进度从头计）';
    quit.onclick=()=>this.quitMission();
    startRow.appendChild(quit);
    wrap.appendChild(startRow);
  },

  /* 通关/答对结算：字段同 event 选项 r；数值赏按 rating 折算，布尔效果（敌弱等）通关即有 */
  applyNodePass(node,rating){
    const r=node.pass||{}, k=rating>=1?1:0.6;
    const num=v=>v?Math.max(1,Math.round(v*k)):0;
    const st=Stats.cur();
    if(r.heal) Game.s.hp=Math.min(st.maxHp, Game.s.hp+Math.round(st.maxHp*r.heal/100));
    if(r.atkBuff) this.rt.ctx.atkBuff+=r.atkBuff*k;
    if(r.shield) this.rt.ctx.shield=(this.rt.ctx.shield||0)+r.shield*k;
    if(r.enemyVuln) this.rt.ctx.enemyVuln=true;
    if(r.money) Game.s.money+=num(r.money);
    if(r.merit) Game.s.merit+=num(r.merit);
    if(r.renqing) Game.s.renqing+=num(r.renqing);
    if(r.cleanse) Game.reduceErode(r.cleanse);
    if(r.favor) Object.entries(r.favor).forEach(([g,n])=>Game.addFavor(g,num(n)));
    if(r.flags) Object.entries(r.flags).forEach(([key,v])=>{
      if(typeof v==='number' && typeof Game.s.flags[key]==='number') Game.s.flags[key]+=v;
      else Game.s.flags[key]=(v===undefined?true:v);
    });
    Game.save(); this.renderTop();
    /* 过关赏中首次结识的神仙：补播登场卷（与结果行同帧，卷落即见结果） */
    this.flushDebut();
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
    /* 抉择中首次结识的神仙：结果落定后补播「仙驾初临」 */
    this.flushDebut();
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

  /* 剧情中暂离：无惩罚、不跨天，工单留在架上，重接从头计 */
  quitMission(){
    this.rt=null; this.view='office'; this.tab='desk';
    Game.s.busy=false;
    Game.save();
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
    let mainMsg='', promoFrom=null, promoTo=null;
    if(m.chapterEnd){
      if(s.chapter<=(m.chapter||1)) s.chapter=(m.chapter||1)+1;
      const oldRank=s.rank;
      if(Game.promoteRank()){ promoFrom=oldRank; promoTo=s.rank; }
      mainMsg=`<div style="color:var(--cinnabar);margin-top:8px"><b>—— 第 ${m.chapter} 章终 ——</b><br>
        一道明黄敕命自九霄直坠神衙——跪听封赏。</div>`;
    }else if(m.main){
      mainMsg=`<div style="color:var(--cinnabar);margin-top:6px"><b>—— 主线推进 ——</b></div>`;
    }
    /* 移除已完成工单 */
    s.shelf=s.shelf.filter(x=>x!==o);
    s.busy=false;
    this.view='settle';
    Game.save();
    /* 画质升级：结算用本章情景图（清页签氛围层）；章末的水墨换色等敕封仪式落幕后再转 */
    if(typeof FX!=='undefined'){
      FX.setAmbient(null);
      FX.setScene(ASSET.sceneKey(m.chapter||Game.s.chapter||1), .4);
    }

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
    /* 结案赏中首次结识的神仙先补播「仙驾初临」；若为章末，卷落后再降敕封诏书、做章节水墨转场 */
    const runPromo=()=>{
      if(promoTo!=null && this.showRankPromotion){
        setTimeout(()=>{
          this.showRankPromotion(promoFrom,promoTo).then(()=>{
            if(typeof FX!=='undefined') FX.inkWipe(()=>FX.setChapter(Game.s.chapter||1));
          });
        },800);
      }
    };
    this.flushDebut(runPromo);
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

  /* ================= 神仙图鉴 ================= */
  /* 已结识神仙的立绘墙：卡片=立绘+名字，点击放大纯图观摩 */
  openGodCodex(){
    const s=Game.s;
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay');
    ov.onclick=(e)=>{ if(e.target===ov){ ml.innerHTML=''; ml.classList.add('hidden'); } };
    const box=h('div','paper m-box god-codex');
    box.innerHTML=`
      <div class="gg-head">
        <h2>神仙图鉴</h2>
        <span class="gc-skip" onclick="document.getElementById('modalLayer').innerHTML='';document.getElementById('modalLayer').classList.add('hidden');">✕</span>
      </div>
      <div class="gg-tip">一面之缘亦入图鉴 · 点击立绘可放大观摩</div>
      <div class="cx-grid"></div>`;
    const grid=box.querySelector('.cx-grid');
    const met=Object.keys(GODS).filter(g=>{ const r=s.godsRel[g]; return r&&r.met; });
    if(!met.length){
      grid.innerHTML='<div class="section-tip">尚未结识任何神仙。接下工单下凡办差，自有神仙与你打交道。</div>';
    }
    met.forEach(g=>{
      const gd=GODS[g];
      const rel=s.godsRel[g];
      const hasArt = typeof GOD_ART!=='undefined' && GOD_ART.includes(g);
      const src = hasArt ? 'img/g_'+g+'.jpg' : ASSET.avatarFile(g);
      const card=h('div','cx-card');
      card.innerHTML=`
        <div class="cx-face${hasArt?'':' cx-round'}"><span class="cx-char">${gd.icon}</span><img alt="${gd.name}" src="${src}" onload="this.classList.add('ok')" onerror="this.remove()"></div>
        <div class="cx-name">${gd.name}</div>
        <div class="cx-rel">${Game.favorName(Game.favorLevel(rel.favor))}</div>`;
      card.onclick=()=>this.openCodexZoom(g);
      grid.appendChild(card);
    });
    ov.appendChild(box); ml.appendChild(ov);
    ml.classList.remove('hidden');
  },

  /* 图鉴放大：纯大图 + 名字，点击任意处合上；「翻开仙录」可重温该神登场卷 */
  openCodexZoom(g){
    const gd=GODS[g]; if(!gd) return;
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay cx-zoom-ov');
    const hasArt = typeof GOD_ART!=='undefined' && GOD_ART.includes(g);
    const src = hasArt ? 'img/g_'+g+'.jpg' : ASSET.avatarFile(g);
    ov.innerHTML=`
      <div class="cx-zoom">
        <div class="cx-zoom-face"><span class="cx-char">${gd.icon}</span><img alt="${gd.name}" src="${src}" onload="this.classList.add('ok')" onerror="this.remove()"></div>
        <div class="cx-zoom-name">${gd.name}</div>
        <button class="cx-zoom-book" type="button">翻开仙录</button>
        <div class="cx-zoom-hint">轻触任意处合上</div>
      </div>`;
    ov.onclick=()=>{ ml.innerHTML=''; ml.classList.add('hidden'); this.openGodCodex(); };
    ov.querySelector('.cx-zoom-book').onclick=(e)=>{
      e.stopPropagation();
      this.showGodDebut(g, ()=>this.openCodexZoom(g), {review:true});
    };
    ml.appendChild(ov);
    ml.classList.remove('hidden');
  },

  /* 玩家自身立绘卷：点头像查看当前品阶立绘与身份，轻触合上 */
  openPlayerPortrait(){
    if(!Game||!Game.s) return;
    const s=Game.s, rk=RANKS[s.rank];
    const robeIdx=Math.min(s.rank||0,4);
    const ml=$('modalLayer'); ml.innerHTML='';
    const ov=h('div','overlay cx-zoom-ov');
    ov.innerHTML=`
      <div class="cx-zoom pp-zoom">
        <div class="cx-zoom-face"><img alt="${rk.name}" src="img/p_r${robeIdx}.jpg" onload="this.classList.add('ok')"></div>
        <div class="cx-zoom-name">你 · ${rk.name}</div>
        <div class="pp-line">地府考公落榜，按了一纸《阴阳两界劳务契》，发配两界交界的破神衙——无编制的阴神，工单照接，香火照挣，转正遥遥。</div>
        <div class="pp-meta">第 ${s.month} 月 ${s.day} 日 ｜ 修为 ${s.cult} ｜ 神格位 ${rk.slots} ｜ 可领 ${rk.tierCap} 品神格</div>
        <div class="cx-zoom-hint">轻触任意处合上</div>
      </div>`;
    ov.onclick=()=>{ ml.innerHTML=''; ml.classList.add('hidden'); };
    ml.appendChild(ov);
    ml.classList.remove('hidden');
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
    ov.appendChild(box); ml.appendChild(ov);
    ml.classList.remove('hidden');
    if(typeof ASSET!=='undefined') ASSET.scan(ml);
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
    box.appendChild(h('div','ss-foot',foot));
    ov.appendChild(box); ml.appendChild(ov);
    ml.classList.remove('hidden');
    if(typeof ASSET!=='undefined') ASSET.scan(ml);
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
          if(!Game.isGodUnlocked(gid)) return; /* 未结识：直接跳过，不占位 */
          const card=h('div','gg-cell',
            `<div class="gg-avatar">${godAvatar(gid,48)}</div>
             <div class="gg-name">${gd.name}</div>
             <div class="gg-title">${gd.title||''}</div>`);
          card.onclick=()=>UI.openGodModal(gid);
          grid.appendChild(card);
        });
        if(grid.children.length){
          tierRow.appendChild(grid);
          campEl.appendChild(tierRow);
        }
      });
      if(campEl.querySelector('.gg-cell')) body.appendChild(campEl);
    });
    box.appendChild(body);
    ov.appendChild(box); ml.appendChild(ov);
    ml.classList.remove('hidden');
    if(typeof ASSET!=='undefined') ASSET.scan(ml);
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
        ${gd.story?`<div class="gm-block gm-story">
          <div class="gm-label">相关故事</div>
          <div class="gm-story-text">${gd.story}</div>
        </div>`:''}
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
          ic(id,it.icon)+`
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
    if(typeof ASSET!=='undefined') ASSET.scan(ml);
    if(typeof FX!=='undefined') FX.scanAvatars && FX.scanAvatars(ml);
  },
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
    /* 立绘 key：玩家 p_r{rank}，敌人 e_{id} */
    const pKey='p_r'+(Game.s.rank||0);
    const eKey='e_'+(B.e.id||'');
    wrap.innerHTML=`<div class="battle-field" id="battleField">
        <div class="battle-bg" id="battleBg"></div><div class="battle-veil"></div>
        <div class="round-tag">第 <span id="bRound">1</span> 回合</div>
        <div class="fighter" id="fPlayer">
          <div class="fig-body fig-player" id="figPlayer" style="color:var(--cinnabar-deep)">
            ${typeof ASSET!=='undefined'?ASSET.html(pKey,'fig-img',RANKS[Game.s.rank].name):''}
            <span class="fig-fallback">衙</span>
          </div>
          <div class="fig-name">你 · ${RANKS[Game.s.rank].name}</div>
          ${fbarHTML('p')}
          <div class="fstatus" id="pStatus"></div>
        </div>
        <div class="vs">战</div>
        <div class="fighter foe" id="fFoe">
          <div class="intent-bubble" id="eIntent"></div>
          <div class="fig-body fig-foe" id="figFoe" style="color:${B.e.tint}">
            ${typeof ASSET!=='undefined'?ASSET.html(eKey,'fig-img',B.e.name):''}
            <span class="fig-fallback">${B.e.icon}</span>
          </div>
          <div class="fig-name">${B.e.name}</div>
          ${fbarHTML('e', B.e.hpLabel)}
          <div class="fstatus" id="eStatus"></div>
        </div>
      </div>
      <div class="battle-log" id="battleLog"></div>
      <div id="momentSlot"></div>`;
    c.appendChild(wrap);
    /* 显式挂载所有战斗内资产图（立绘 + 背景图），不依赖 MutationObserver 时序 */
    if(typeof ASSET!=='undefined') ASSET.scan(wrap);
    /* 画质升级：战场图（按章 + 高危任务为夜战）与章节墨雾 */
    if(typeof FX!=='undefined'){
      const mm=(this.rt&&this.rt.mid)?this.mission():null;
      const chapter=(mm&&mm.chapter)||Game.s.chapter||1;
      const night=!!(mm&&mm.danger>=4);
      FX.setChapter(chapter);
      FX.setBattleBG(ASSET.bfKey(chapter,night));
    }
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

  /* 支援神立绘降临：金色光晕 + 神明立绘淡入淡出 */
  showAidGod(gkey){
    const gd=GODS[gkey]; if(!gd) return;
    const field=$('battleField'); if(!field) return;
    /* 先清掉上一个残留的 */
    field.querySelectorAll('.aid-god').forEach(n=>n.remove());
    const box=h('div','aid-god');
    const gid='g_'+gkey;
    const hasAsset=typeof ASSET!=='undefined' && ASSET.list && ASSET.list[gid];
    let img;
    if(hasAsset){
      img=h('img','aid-img');
      img.alt=gd.name;
      box.innerHTML=`<span class="aid-label">${gd.name}</span>`;
      box.insertBefore(img, box.firstChild);
      ASSET.mount(img, gid);
    }else{
      /* 兜底：本地头像 av_<gid>.jpg，再失败则仅留名号（不请求在线图床） */
      img=h('img','aid-img');
      img.alt=gd.name;
      img.src=ASSET.avatarFile(gkey);
      img.onerror=()=>{ img.remove(); };
      box.innerHTML=`<span class="aid-label">${gd.name}</span>`;
      box.insertBefore(img, box.firstChild);
    }
    field.appendChild(box);
    setTimeout(()=>box.remove(), 3000);
  },
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
