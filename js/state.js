/* ================= 天道打工人 · 状态与规则 v3 =================
   SAVE v3：五系神格 / 碎片凝格 / 妖丹炼化吞噬 / 侵蚀值 / 好感五档援助 / 9阶
   v2 旧档保留不迁（用户已批准方案①），存档键互不覆盖。
   ============================================================ */
const SAVE_KEY = 'tiandao_dagongren_v3';
/* ---- 名号登录 · 多存档点（本地点名册，localStorage） ----
   ROSTER_KEY：名册索引（轻量，用于登录页列表/查重）
   每个角色一档：SLOT_PREFIX + slotId，内容仍是 v3 结构（多一个 pname 字段）
   SAVE_KEY 仅用于把旧单档“起名认领”进名册，认领后删除 */
const ROSTER_KEY  = 'tiandao_dagongren_v3__roster';
const SLOT_PREFIX = 'tiandao_dagongren_v3__slot__';
/* 首次获得整格的修为收益（v3 神格不再单列 cult 字段，按品质给） */
const GH_CULT = { '凡':10, '灵':20, '宝':35, '仙':60 };

const Game = {
  s: null,
  slotId: null,
  roster: [],

  /* ================= 名号 / 名册 ================= */
  loadRoster(){
    try{ this.roster = JSON.parse(localStorage.getItem(ROSTER_KEY)||'[]') || []; }catch(e){ this.roster=[]; }
    return this.roster;
  },
  saveRoster(){ try{ localStorage.setItem(ROSTER_KEY, JSON.stringify(this.roster)); }catch(e){} },
  slotById(id){ return this.roster.find(r=>r.id===id); },
  findName(name){ const n=(name||'').trim(); return this.roster.find(r=>r.name===n); },
  /* 名号校验：1–8 位中英文数字，禁空白与特殊符号；返回 '' 合法，否则返回原因 */
  validName(name){
    name=(name||'').trim();
    if(!name) return '请先写下名号';
    if(name.length>8) return '名号至多 8 个字';
    if(/[\s<>\\/"'`]/.test(name)) return '名号不可含空格或怪符号';
    if(!/^[\u4e00-\u9fa5A-Za-z0-9·_]+$/.test(name)) return '名号只能用中文、英文或数字';
    return '';
  },
  hasLegacy(){
    try{ return !!localStorage.getItem(SAVE_KEY); }catch(e){ return false; }
  },
  /* 起名认领旧单档：把旧 v3 档迁入名册，成功返回 true */
  claimLegacy(name){
    name=(name||'').trim();
    if(this.validName(name)||this.findName(name)) return false;
    let s=null;
    try{ s=JSON.parse(localStorage.getItem(SAVE_KEY)); }catch(e){ s=null; }
    if(!s) return false;
    this.s=s;
    if(this.migrate()===false) return false;
    this.s.pname=name;
    this.slotId=this._newId();
    this._writeSlot();
    this.roster.push(this._metaFromSave(this.slotId,name));
    this.saveRoster();
    try{ localStorage.removeItem(SAVE_KEY); }catch(e){}
    return true;
  },
  /* 新角色立契入册 */
  createSlot(name){
    name=(name||'').trim();
    if(this.validName(name)||this.findName(name)) return false;
    this.slotId=this._newId();
    this.newGame(name);           /* newGame 内会 save 落槽 */
    this.roster.push(this._metaFromSave(this.slotId,name));
    this.saveRoster();
    return true;
  },
  /* 登录已有名号 */
  login(id){
    const meta=this.slotById(id);
    if(!meta) return false;
    try{
      const raw=localStorage.getItem(SLOT_PREFIX+id);
      if(!raw) return false;
      this.s=JSON.parse(raw);
      this.migrate();
      this.slotId=id;
      return true;
    }catch(e){ return false; }
  },
  /* 撕掉重玩：保留名号与槽位，进度清零 */
  restartSlot(){
    const meta=this.slotById(this.slotId);
    if(!meta) return;
    const name=meta.name;
    this.newGame(name);
  },
  /* 返回名册（换个名号）前调用：清内存当前档 */
  logout(){ this.s=null; this.slotId=null; },

  _newId(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); },
  _writeSlot(){ try{ localStorage.setItem(SLOT_PREFIX+this.slotId, JSON.stringify(this.s)); }catch(e){} },
  _metaFromSave(id,name){
    const s=this.s;
    return { id, name:name||s.pname||'无名',
      rank:s.rank||0, month:s.month||1, day:s.day||1, money:s.money||0,
      chapter:s.chapter||1, updatedAt:Date.now() };
  },

  newGame(pname){
    this.s = {
      ver:3,
      pname:pname||'无名',
      rank:0, month:1, day:1,
      cult:0, money:120, renqing:2, merit:0,
      hp:100, strikes:0,
      erode:0,
      gh:{},              // id -> {awakened:bool, insight:0..1, sleep:days}
      shards:{ bing:0, fa:0, you:0, huo:0, sheng:0 }, // 同系碎末（兵/法/火入凝格池）
      dshards:{},         // D神同名碎片：godKey -> 枚数（5枚凝专属灵品格）
      pills:{},           // 妖丹：pillId -> 枚数
      devour:{ hp:0, atk:0, def:0, crit:0, lifesteal:0, zhanshen:false }, // 吞噬常驻收益
      refining:null,      // 丹炉炼化：{pill, daysLeft}
      equipped:[],
      bag:{},
      wear:{weapon:null, armor:null, trinket:null},
      soldiers:[],
      fac:{ shrine:0, desk:0, incense:0, banner:0 },
      shelf:[],
      busy:false,
      fusionBless:{},
      recipes:{},         // 支线/初见获得的融合配方：out -> true（商店方按章节直接可见）
      tut:{done:false, stage:'start'},
      godsRel:{},         // godKey -> {met,favor(0~140),giftDay?}
      flags:{},
      chapter:1,
      mainDone:{},        // 主线幕 id -> true
      sideDone:{},        // 支线 id -> true
      storyChoices:{},    // 剧情档案：'单id:幕号:节点号' -> 选项号
      gameOver:false,
      log:[],
    };
    Stats.recalc();
    this.s.hp = Stats.cur().maxHp;
    Shelf.refresh();
    this.save();
  },

  /* 存档：写当前登录角色的槽位，并同步名册摘要 */
  save(){
    if(!this.s) return;
    if(!this.slotId){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(this.s)); }catch(e){} return; }
    this._writeSlot();
    const meta=this.slotById(this.slotId);
    if(meta){
      const fresh=this._metaFromSave(this.slotId, meta.name);
      ['rank','month','day','money','chapter','updatedAt'].forEach(k=>meta[k]=fresh[k]);
      this.saveRoster();
    }
  },
  /** v3 小版本字段兜底（不接受 v2 及更早存档） */
  migrate(){
    const s=this.s;
    if(!s || s.ver!==3) return false;
    const def=(k,v)=>{ if(s[k]===undefined) s[k]=v; };
    def('pname','无名');
    def('renqing', s.favor||0);
    def('erode',0); def('shards',{bing:0,fa:0,you:0,huo:0,sheng:0}); def('dshards',{});
    def('pills',{}); def('devour',{hp:0,atk:0,def:0,crit:0,lifesteal:0,zhanshen:false});
    def('refining',null); def('recipes',{}); def('godsRel',{}); def('flags',{});
    def('chapter',1); def('mainDone',{}); def('sideDone',{}); def('storyChoices',{}); def('gameOver',false);
    def('wear',{weapon:null,armor:null,trinket:null}); def('bag',{});
    def('pendingDebut',[]);   // 剧情中首次结识、待补播登场卷的神仙
    (s.shelf||[]).forEach(o=>{ if(o.act===undefined) o.act=0; });
    return true;
  },
  /* 删除当前角色整档（连名册名号一起抹除）；“撕掉重玩”请用 restartSlot() */
  clear(){
    if(this.slotId){
      try{ localStorage.removeItem(SLOT_PREFIX+this.slotId); }catch(e){}
      this.roster=this.roster.filter(r=>r.id!==this.slotId);
      this.saveRoster();
    }
    this.s=null; this.slotId=null;
  },

  toast(t){ if(typeof UI!=='undefined' && UI.toast) UI.toast(t); },

  /* ---------------- 神明人脉：结识 / 好感 / 解锁 / 送礼 ---------------- */
  meetGod(g){
    const rel=this.s.godsRel[g];
    if(rel && rel.met) return false;
    this.s.godsRel[g]={ met:1, favor: rel?rel.favor:0 };
    return true;
  },
  favorOf(g){ const r=this.s.godsRel[g]; return r?r.favor:0; },
  favorLevel(f){ let l=0; for(let i=0;i<FAVOR_LEVELS.length;i++){ if(f>=FAVOR_LEVELS[i].v) l=i; } return l; },
  favorName(l){ return FAVOR_LEVELS[l]?FAVOR_LEVELS[l].name:'相识'; },
  addFavor(g,n){
    const first=!(this.s.godsRel[g]&&this.s.godsRel[g].met);
    const r=this.s.godsRel[g]||(this.s.godsRel[g]={met:1,favor:0});
    r.met=1;
    const oldLv=this.favorLevel(r.favor);
    r.favor=Math.max(0, Math.min(FAVOR_LEVELS[FAVOR_LEVELS.length-1].v, r.favor+n));
    const newLv=this.favorLevel(r.favor);
    if(newLv>oldLv) this.toast(`「${GODS[g].name}」与你的交情升至【${FAVOR_LEVELS[newLv].name}】！`);
    /* 非接单途径（剧情抉择/关卡/结案赏）首次结识：排入待登场队列，由 UI 在结算后补播「仙驾初临」 */
    if(first && typeof GODS!=='undefined' && GODS[g]){
      this.s.pendingDebut=this.s.pendingDebut||[];
      if(this.s.pendingDebut.indexOf(g)<0) this.s.pendingDebut.push(g);
    }
  },
  /** 援助档位 0~4（0 不可唤；1 神念25% / 2 分身45% / 3 完整分身75% / 4 本体100%） */
  aidLevelOf(g){ return this.favorLevel(this.favorOf(g)); },
  aidFactor(g){ return AID_POWER[this.aidLevelOf(g)]||0; },
  /** 神明解锁：章节门槛 + 当前官阶 tier 上限（03册：高于上限不派单不见面） */
  isGodUnlocked(g){
    const gd=GODS[g]; if(!gd) return false;
    if(gd.unlock && gd.unlock.ch && this.s.chapter < gd.unlock.ch) return false;
    const cap=RANKS[this.s.rank].tierCap;
    if(TIER_ORDER[gd.tier] > TIER_ORDER[cap]) return false;
    return true;
  },
  sendGift(g,id){
    const s=this, rel=s.godsRel[g]||(s.godsRel[g]={met:1,favor:0});
    const today=s.month*100+s.day;
    if(rel.giftDay===today){ this.toast('今日已送过礼，频繁登门反倒惹人嫌'); return; }
    if(!s.bag[id]) return;
    const pr=(GODS[g]&&GODS[g].gifts)||{};
    let fav=4, tag='收下了，神色淡淡';
    if((pr.loved||[]).indexOf(id)>=0){ fav=18; tag='眼前一亮，抚掌大笑！'; }
    else if((pr.liked||[]).indexOf(id)>=0){ fav=8; tag='眉眼含笑，颇以为然'; }
    else if((pr.disliked||[]).indexOf(id)>=0){ fav=1; tag='神色微微一僵，勉强收下'; }
    delete s.bag[id]; rel.giftDay=today;
    this.addFavor(g,fav);
    this.toast(`「${GODS[g].name}」${tag}（好感 +${fav}）`);
    this.save(); if(typeof UI!=='undefined') UI.render();
  },

  /* ---------------- 神格：获取 / 觉醒 / 镶嵌 ---------------- */
  hasGh(id){ return !!this.s.gh[id]; },
  awakened(id){ return !!(this.s.gh[id] && this.s.gh[id].awakened); },

  /** 获得整格（任务奖励/炼化）：首次获得给修为并掷觉醒 */
  gainGodhood(id){
    const g=GODHOODS[id]; if(!g) return {id};
    const res={id,name:g.name,isNew:false,awakened:false,cultGain:0};
    if(!this.s.gh[id]){
      this.s.gh[id]={awakened:false,insight:0,sleep:0};
      res.isNew=true; res.cultGain=GH_CULT[g.q]||0; this.s.cult+=res.cultGain;
      const rate=this.awakeRate(id);
      if(Math.random()<rate){ this.s.gh[id].awakened=true; res.awakened=true; }
      /* v3 钩子：仅当指引暂停在 waitingGh（首单未给格）时恢复嵌入指引。
         严禁在 settle/mission/battle 等流程视图强切 UI——
         那种情况下交给玩家点「回神衙」触发 Guide.act('backOffice') 恢复。 */
      if(res.isNew && typeof Guide!=='undefined'){
        const t=this.s.tut;
        if(t && !t.done && t.stage==='waitingGh'){
          setTimeout(()=>{
            try{
              if(typeof UI==='undefined' || UI.view!=='office') return;
              if(UI.tab!=='cult'){ UI.tab='cult'; UI.render(); }
              Guide.show('cultEmbed');
            }catch(e){ console.warn('[GuideHook] error',e.message); }
          },400);
        }
      }
    }else{
      res.cultGain=8; this.s.cult+=8;
      const rec=this.s.gh[id];
      if(!rec.awakened){ rec.insight=Math.min(1,rec.insight+0.2); res.insight=rec.insight; }
    }
    Stats.recalc(); this.save();
    return res;
  },
  awakeRate(id){
    const g=GODHOODS[id], base=AWAKE_RATE[g.q]||AWAKE_RATE['凡'];
    const bonus=this.s.fac.shrine>0 ? SHRINE_BONUS[this.s.fac.shrine-1] : 0;
    return Math.min(AWAKE_CAP, base.rate + bonus);
  },
  /** 旧接口保留：按工单 gh 字段赐格（第5步任务多改用 grantReward） */
  grantGodhood(mid){
    const m=MISSIONS.find(x=>x.id===mid);
    if(!m || !m.gh) return {noGh:true};
    return this.gainGodhood(m.gh);
  },
  /** 统一发奖：gh整格 / shards碎末 / dshards同名碎片 / pill妖丹 / merit / money / favor / erode / flags */
  grantReward(rew){
    if(!rew) return {};
    const out={gh:null,shards:[],dshards:[],pill:null};
    if(rew.gh){ const r=this.gainGodhood(rew.gh); out.gh=r; }
    if(rew.shards) Object.entries(rew.shards).forEach(([p,n])=>{ this.s.shards[p]=(this.s.shards[p]||0)+n; out.shards.push([p,n]); });
    if(rew.dshards) Object.entries(rew.dshards).forEach(([g,n])=>{ this.s.dshards[g]=(this.s.dshards[g]||0)+n; out.dshards.push([g,n]); });
    if(rew.pill){ this.addPill(rew.pill,1); out.pill=rew.pill; }
    if(rew.merit){ this.s.merit+=rew.merit; }
    if(rew.money){ this.s.money+=rew.money; }
    if(rew.favor) Object.entries(rew.favor).forEach(([g,n])=>this.addFavor(g,n));
    if(rew.erode) this.addErode(rew.erode);
    if(rew.flags) Object.entries(rew.flags).forEach(([k,v])=>{ this.s.flags[k]=(v===undefined?true:v); });
    Stats.recalc(); this.save();
    return out;
  },

  /** 神龛参悟（按品质收费，失败累计 +3% 保底，封顶 70%） */
  ponder(id){
    const rec=this.s.gh[id]; if(!rec || rec.awakened) return;
    const g=GODHOODS[id], cfg=AWAKE_RATE[g.q]||AWAKE_RATE['凡'];
    if(this.s.money < cfg.cost){ this.toast('香火钱不足'); return; }
    this.s.money-=cfg.cost;
    const rate=Math.min(AWAKE_CAP, this.awakeRate(id) + rec.insight);
    if(Math.random()<rate){
      rec.awakened=true; rec.insight=0;
      this.toast(`「${g.name}」觉醒了！`);
    }else{
      rec.insight=Math.min(1,rec.insight+PONDER_INSIGHT);
      this.toast('感悟加深，尚差一线（下次 +3%）');
    }
    Stats.recalc(); this.save(); if(typeof UI!=='undefined') UI.render();
  },

  toggleEquip(id){
    const eq=this.s.equipped, i=eq.indexOf(id);
    let action=null;
    if(i>=0){ eq.splice(i,1); action='unequip'; }
    else{
      if(this.s.gh[id] && this.s.gh[id].sleep>0){ this.toast('该神格正在沉睡，无法催动'); return; }
      if(eq.length>=Stats.slots()){ this.toast('神格盘槽位已满（晋升品阶可扩充）'); return; }
      eq.push(id); action='equip';
    }
    Stats.recalc();
    if(this.s.hp>Stats.cur().maxHp) this.s.hp=Stats.cur().maxHp;
    this.save(); if(typeof UI!=='undefined') UI.render();
    /* 指引：成功镶嵌后从 cultEmbed 推进到 cultTalk */
    if(action==='equip' && typeof Guide!=='undefined') Guide.act('toggleEquip');
  },

  /* ---------------- 碎片凝格（04册第六节） ---------------- */
  /** 同系碎末 5 枚 → 凝格池随机凡品格（仅兵/法/火有池）；指定格向香火钱另计（二期） */
  condense(path){
    const pool=CONDENSE_POOL[path];
    if(!pool || !pool.length){ this.toast('该系碎末不入凝格池'); return; }
    if((this.s.shards[path]||0)<SHARD_NEED){ this.toast('碎末不足，需 5 枚同系碎末'); return; }
    this.s.shards[path]-=SHARD_NEED;
    const id=pool[Math.floor(Math.random()*pool.length)];
    const res=this.gainGodhood(id);
    this.toast(res.awakened?`凝出「${GODHOODS[id].name}」，且当场觉醒！`:`凝出神格「${GODHOODS[id].name}」`);
    if(typeof UI!=='undefined') UI.render();
    return res;
  },
  /** D神同名碎片 5 枚 → 该神专属灵品格 */
  condenseGod(g){
    const gd=GODS[g];
    if(!gd || !gd.gh || gd.tier!=='D'){ this.toast('该神无专属凝格'); return; }
    if((this.s.dshards[g]||0)<SHARD_NEED){ this.toast('同名碎片不足，需 5 枚'); return; }
    this.s.dshards[g]-=SHARD_NEED;
    const res=this.gainGodhood(gd.gh);
    this.toast(res.awakened?`五枚碎片凝成「${GODHOODS[gd.gh].name}」，灵光乍现，当场觉醒！`
                         :`五枚同名碎片凝成「${GODHOODS[gd.gh].name}」`);
    if(typeof UI!=='undefined') UI.render();
    return res;
  },
  /** 重复整格拆回 1 枚同系碎末（半价回收精神） */
  dismantle(id){
    if(!this.s.gh[id] || this.s.equipped.includes(id)){ this.toast('镶嵌中的神格不可拆'); return; }
    const g=GODHOODS[id];
    delete this.s.gh[id];
    this.s.shards[g.path]=(this.s.shards[g.path]||0)+1;
    this.toast(`「${g.name}」拆回 1 枚${PATHS[g.path].name}系碎末`);
    Stats.recalc(); this.save(); if(typeof UI!=='undefined') UI.render();
  },

  /* ---------------- 融合配方（材料不毁；失败只损香火钱） ---------------- */
  hasRecipe(f){
    if(f.src==='shop') return this.s.chapter >= (f.ch||1);
    return !!this.s.recipes[f.out];
  },
  grantRecipe(out){ this.s.recipes[out]=true; this.save(); },
  canFuse(f){
    return this.hasRecipe(f) &&
           f.in.every(id=>this.awakened(id)) &&
           !f.in.some(id=>this.s.equipped.includes(id));
  },
  fuse(f){
    if(!this.hasRecipe(f)){ this.toast('尚无此配方'); return; }
    if(!f.in.every(id=>this.awakened(id))){ this.toast('材料神格须全部觉醒'); return; }
    if(f.in.some(id=>this.s.equipped.includes(id))){ this.toast('请先将材料格从盘中取下'); return; }
    if(this.s.money<f.cost){ this.toast('香火钱不足'); return; }
    this.s.money-=f.cost;
    if(Math.random()< f.rate + (this.s.fusionBless[f.out]||0)){
      /* 成功：材料化去，产物觉醒态入盘 */
      f.in.forEach(id=>{ delete this.s.gh[id]; });
      this.s.equipped=this.s.equipped.filter(id=>!f.in.includes(id));
      this.s.gh[f.out]={awakened:true,insight:0,sleep:0};
      this.s.cult+=GH_CULT[GODHOODS[f.out].q]||0;
      this.s.fusionBless[f.out]=0;
      this.toast(`炼成神格：「${GODHOODS[f.out].name}」！`);
    }else{
      /* 失败：材料保留，记下气息，下次 +25% */
      this.s.fusionBless[f.out]=Math.min(0.9,(this.s.fusionBless[f.out]||0)+0.25);
      this.toast('火候未到，炼成一团清气——材料未损，气息却记下了');
    }
    Stats.recalc(); this.save(); if(typeof UI!=='undefined') UI.render();
  },

  /* ---------------- 妖丹：炼化 / 吞噬 / 侵蚀 ---------------- */
  addPill(id,n){ this.s.pills[id]=(this.s.pills[id]||0)+n; },
  /** 丹炉炼化：花香火钱、占 1~3 日，出随机同档整格（五系随机，特殊丹加权） */
  refineStart(id){
    const p=PILLS[id];
    if(!p || !(this.s.pills[id]>0)) return;
    if(this.s.refining){ this.toast('丹炉中尚有一炉丹未炼成'); return; }
    if(this.s.money<p.refineCost){ this.toast('香火钱不足'); return; }
    this.s.money-=p.refineCost; this.s.pills[id]--;
    this.s.refining={pill:id,daysLeft:p.days};
    this.toast(`丹炉火起，${p.name}入炉，需 ${p.days} 日炼成`);
    this.save(); if(typeof UI!=='undefined') UI.render();
  },
  refineFinish(){
    const r=this.s.refining, p=PILLS[r.pill];
    const all=Object.keys(GODHOODS).filter(id=>{
      const g=GODHOODS[id];
      return !g.fusion && p.band.includes(g.q);
    });
    /* 特殊丹（兵主残丹/鬼丹）：65% 出加权系，35% 仍走五系随机 */
    let pool=all;
    if(p.pathWeight){
      const weighted=all.filter(id=>GODHOODS[id].path===p.pathWeight);
      pool=(weighted.length && Math.random()<0.65) ? weighted : all;
    }
    const id=pool.length ? pool[Math.floor(Math.random()*pool.length)] : null;
    this.s.refining=null;
    let res=null;
    if(id){ res=this.gainGodhood(id); }
    this.toast(id?`丹炉开炉，炼出「${GODHOODS[id].name}」！`:'丹炉空空，只余一撮冷灰');
    if(typeof UI!=='undefined') UI.render();
    return res;
  },
  /** 吞噬：常驻收益入角色身（不占盘、不可卸），代价是侵蚀值 */
  devourPill(id){
    const p=PILLS[id];
    if(!p || !(this.s.pills[id]>0)) return;
    this.s.pills[id]--;
    const d=p.devour, v=this.s.devour;
    v.hp+=d.hp||0; v.atk+=d.atk||0; v.def+=d.def||0;
    if(p.special==='zhanshen') v.zhanshen=true;
    this.addErode(d.erode||0);
    Stats.recalc();
    if(this.s.hp>Stats.cur().maxHp) this.s.hp=Stats.cur().maxHp;
    this.toast(`吞下${p.name}——燥热贯体，力量实实在在长进了骨头里（侵蚀 +${d.erode}）`);
    this.save(); if(typeof UI!=='undefined') UI.render();
  },
  addErode(n){
    this.s.erode=Math.max(0,Math.min(100,this.s.erode+n));
    if(this.s.erode>=80) this.s.flags['erode_locked_D']=true;
  },
  reduceErode(n){ this.addErode(-n); },
  erodeLevel(){
    for(let i=0;i<ERODE_BANDS.length;i++){ if(this.s.erode<=ERODE_BANDS[i].max) return i; }
    return ERODE_BANDS.length-1;
  },

  /* ---------------- 法宝 / 阴兵 / 设施 ---------------- */
  buyItem(id){
    if(this.s.bag[id]){ this.toast('铺中只剩样品，这一件你已购入'); return; }
    const it=ITEMS[id];
    if(this.s.money<it.price){ this.toast('香火钱不足'); return; }
    this.s.money-=it.price; this.s.bag[id]=true;
    this.save(); if(typeof UI!=='undefined') UI.render();
    this.toast(`购入「${it.name}」，已收入背包`);
  },
  wearItem(id){
    if(!this.s.bag[id]) return;
    this.s.wear[ITEMS[id].slot]=id;
    Stats.recalc();
    if(this.s.hp>Stats.cur().maxHp) this.s.hp=Stats.cur().maxHp;
    this.save(); if(typeof UI!=='undefined') UI.render(); this.toast(`已装备「${ITEMS[id].name}」`);
  },
  takeOff(slot){
    const id=this.s.wear[slot]; if(!id) return;
    this.s.wear[slot]=null;
    Stats.recalc();
    if(this.s.hp>Stats.cur().maxHp) this.s.hp=Stats.cur().maxHp;
    this.save(); if(typeof UI!=='undefined') UI.render(); this.toast(`已取下「${ITEMS[id].name}」`);
  },
  sellItem(id){
    const s=this.s;
    if(!s.bag[id]) return;
    const it=ITEMS[id];
    if(s.wear[it.slot]===id){ this.toast('佩中的法宝不能出手，请先取下'); return; }
    const gain=Math.floor(it.price*SELL_RATE);
    delete s.bag[id]; s.money+=gain;
    Stats.recalc();
    this.save(); if(typeof UI!=='undefined') UI.render();
    this.toast(`老道掂了掂，丢下 ${gain} 文，把「${it.name}」收走了`);
  },
  recruit(id){
    const bonus=this.s.fac.banner>0 ? FACILITIES.banner.levels.slice(0,this.s.fac.banner).reduce((a,l)=>a+(l.cap||0),0) : 0;
    const cap=Math.min(RANKS[this.s.rank].soldiers, 1+bonus);
    if(this.s.soldiers.length>=cap){ this.toast('阴兵编制已满（晋升品阶或升招妖幡可扩充）'); return; }
    const so=SOLDIERS[id];
    if(this.s.money<so.price){ this.toast('香火钱不足'); return; }
    this.s.money-=so.price; this.s.soldiers.push(id);
    this.save(); if(typeof UI!=='undefined') UI.render(); this.toast(`招募了一名${so.name}`);
  },
  upgradeFac(key){
    const f=FACILITIES[key], lv=this.s.fac[key];
    if(lv>=f.levels.length){ this.toast('已至最高级'); return; }
    const total=Object.values(this.s.fac).reduce((a,b)=>a+b,0);
    if(total>=RANKS[this.s.rank].facCap){ this.toast('当前品阶设施总级已达上限，晋升后可再营造'); return; }
    const cost=f.levels[lv].cost;
    if(this.s.money<cost){ this.toast('香火钱不足'); return; }
    this.s.money-=cost; this.s.fac[key]=lv+1;
    Stats.recalc();
    if(this.s.hp>Stats.cur().maxHp) this.s.hp=Stats.cur().maxHp;
    this.save(); if(typeof UI!=='undefined') UI.render(); this.toast(`${f.name}升至 ${lv+2} 级`);
  },

  /* ---------------- 工单架人情 / 驳回 ---------------- */
  bargain(idx){
    if(this.s.renqing<=0){ this.toast('人情不够，神仙也没空理你'); return; }
    const o=this.s.shelf[idx]; if(!o || o.bargain) return;
    this.s.renqing--; o.bargain=true;
    this.save(); if(typeof UI!=='undefined') UI.render(); this.toast('神仙勉强同意追加香火钱');
  },
  reject(idx){
    this.s.shelf.splice(idx,1);
    this.save(); if(typeof UI!=='undefined') UI.render();
  },

  /* ---------------- 晋升（由主线结案调用，不再月末自动升阶） ---------------- */
  promoteRank(){
    if(this.s.rank>=RANKS.length-1) return false;
    this.s.rank++;
    Stats.recalc();
    if(this.s.hp>Stats.cur().maxHp) this.s.hp=Stats.cur().maxHp;
    this.toast(`敕封：${RANKS[this.s.rank].name}！`);
    this.save();
    return true;
  },

  /* ---------------- 日历 / 月末考核 / 死亡 ---------------- */
  advanceDay(){
    this.s.day++;
    Object.values(this.s.gh).forEach(r=>{ if(r.sleep>0) r.sleep--; });
    let refined=null;
    if(this.s.refining){
      this.s.refining.daysLeft--;
      if(this.s.refining.daysLeft<=0) refined=this.refineFinish();
    }
    if(this.s.day>MONTH_DAYS){ this.review(); return true; }
    Shelf.refresh();
    this.save();
    return false;
  },
  rest(){
    this.s.hp=Stats.cur().maxHp;
    this.advanceDay();
    this.toast('你在神衙闭目调息了一天，神力充盈');
    if(typeof UI!=='undefined') UI.render();
  },
  deathPenalty(){
    const lostMoney=Math.floor(this.s.money*0.3);
    this.s.money-=lostMoney;
    this.s.merit=Math.max(0,this.s.merit-15);
    this.s.hp=Stats.cur().maxHp;
    this.s.busy=false;
    const reviewed=this.advanceDay();
    return {lostMoney, reviewed};
  },
  /** 月末 KPI（03册）：评级上考/称职/下考/不称职；连续两次不称职即 gameOver。晋升走主线。 */
  review(){
    const s=this.s, target=monthTarget(s.month), ratio=s.merit/target;
    let grade, bonus=0, fine=0;
    if(ratio>=1.2){ grade='shang'; bonus=120; }
    else if(ratio>=1.0){ grade='ping'; bonus=80; }
    else if(ratio>=0.7){ grade='xia'; }
    else { grade='bu'; fine=Math.floor(s.money*0.2); s.strikes++; }
    if(grade==='shang'||grade==='ping') s.strikes=0;
    s.money=Math.max(0,s.money+bonus-fine);
    /* 侵蚀自然回落：每月 -3（04册第七节） */
    this.addErode(-3);
    s.month++; s.merit=0; s.day=1;
    Stats.recalc(); s.hp=Stats.cur().maxHp;
    Shelf.refresh();
    if(s.strikes>=2) s.gameOver=true;
    this.save();
    if(typeof UI!=='undefined' && UI.showReview) UI.showReview({grade,target,bonus,fine,strikes:s.strikes,gameOver:s.gameOver});
  },
};

/* ================= 数值派生 ================= */
const Stats = {
  cur(){ return this._cache; },
  slots(){ return RANKS[Game.s.rank].slots; },
  recalc(){
    const s=Game.s;
    const v={ maxHp:150, atk:24, def:12, maxMp:60,
      crit:0.05, critDmg:1.5, lifesteal:0,
      trueDmg:0, burnDot:0, burnRound:0, healShield:0, cleanseHeal:0,
      regen:0, mpCost:1, ctrlBonus:0, dmgReduce:0,
      stunProc:0, healStart:0, burnOnHit:0,
      passives:[], saves:[], clash:false, resonance:[],
      zhanshen:!!(s.devour&&s.devour.zhanshen) };

    /* 修为成长 */
    v.maxHp+=s.cult;
    v.atk+=Math.floor(s.cult/5);
    v.def+=Math.floor(s.cult/15);
    v.maxMp+=Math.floor(s.cult/4);

    /* 香炉 */
    if(s.fac.incense>0) v.maxMp+=FACILITIES.incense.levels.slice(0,s.fac.incense).reduce((a,l)=>a+l.mana,0);

    /* 吞噬妖丹的常驻收益 */
    if(s.devour){
      v.maxHp+=s.devour.hp||0; v.atk+=s.devour.atk||0; v.def+=s.devour.def||0;
      v.crit+=s.devour.crit||0; v.lifesteal+=s.devour.lifesteal||0;
    }

    /* 镶嵌神格：统计各系枚数（融合格【调和】计入双系；火不替别系凑数） */
    const counts={bing:0,fa:0,you:0,huo:0,sheng:0};
    s.equipped.forEach(id=>{
      const g=GODHOODS[id], rec=s.gh[id];
      if(!g) return;
      if(rec && rec.sleep>0) return;
      if(g.fusion && g.paths) g.paths.forEach(p=>counts[p]++);
      else counts[g.path]=(counts[g.path]||0)+1;
      if(g.stat){ v.maxHp+=g.stat.hp||0; v.atk+=g.stat.atk||0; v.def+=g.stat.def||0; }
      if(rec && rec.awakened && g.passive){
        const p=g.passive;
        v.crit+=p.crit||0; v.critDmg+=(p.critDmg||0); v.lifesteal+=p.lifesteal||0;
        v.atk+=p.atk||0; v.def+=p.def||0; v.dmgReduce+=p.dmgReduce||0;
        v.trueDmg+=p.trueDmg||0; v.burnDot+=p.burnDot||0; v.burnRound+=p.burnRound||0;
        v.healShield+=p.healShield||0; v.cleanseHeal+=p.cleanseHeal||0;
        v.regen+=p.regen||0; v.mpCost*=(p.mpCost||1);
        v.ctrlBonus+=p.ctrlBonus||0;
        if(p.firstSave) v.saves.push({gh:id, ...p.firstSave});
        (p.labels||[]).forEach(label=>v.passives.push({gh:id,label}));
      }
    });

    /* 同系共鸣：≥2 触发、≥4 强化（04册第八节） */
    Object.entries(RESONANCE).forEach(([p,r])=>{
      const n=counts[p]||0;
      if(n>=2){
        v.resonance.push({path:p,strong:n>=4});
        const t=n>=4?{...r.two,...r.four}:r.two;
        v.crit+=t.crit||0; v.critDmg+=(t.critDmg||0); v.lifesteal+=t.lifesteal||0;
        v.trueDmg+=t.trueDmg||0; v.burnDot+=t.burnDot||0; v.burnRound+=t.burnRound||0;
        v.healShield+=t.healShield||0; v.cleanseHeal+=t.cleanseHeal||0;
        v.mpCost*=(t.mpCost||1); v.ctrlBonus+=t.ctrlBonus||0;
      }
    });

    /* 道争：兵⟷法、幽⟷生（火中性不争不凑）；侵蚀40+惩罚扩大 */
    const has=p=>counts[p]>0;
    const clashing=(has('bing')&&has('fa'))||(has('you')&&has('sheng'));
    if(clashing){
      v.clash=true;
      v.maxMp=Math.floor(v.maxMp*(Game.s.erode>=40?0.7:0.8));
    }

    /* 法宝（三栏位穿戴生效） */
    Object.values(s.wear||{}).forEach(id=>{
      if(!id || !s.bag[id]) return;
      const it=ITEMS[id]; if(!it) return;
      if(it.stat){
        v.maxHp+=it.stat.hp||0; v.atk+=it.stat.atk||0; v.def+=it.stat.def||0;
        v.crit+=it.stat.crit||0; v.lifesteal+=it.stat.lifesteal||0;
      }
      if(it.proc){
        v.stunProc=Math.max(v.stunProc,it.proc.stun||0);
        v.healStart=Math.max(v.healStart,it.proc.healStart||0);
        v.dmgReduce=Math.max(v.dmgReduce,it.proc.dmgReduce||0);
        if(it.proc.burnOnHit) v.burnOnHit=it.proc.burnOnHit;
      }
    });

    v.halluc=ERODE_BANDS[Game.erodeLevel()].halluc;
    if(s.hp>v.maxHp) s.hp=v.maxHp;
    this._cache=v;
    return v;
  },
};

/* ================= 工单架 ================= */
const Shelf = {
  available(m){
    const s=Game.s;
    /* 已结案/章节未到/主线前置幕未完成：一律不上架（先于官遣豁免判定） */
    if(m.side && s.sideDone[m.side]) return false;
    if(m.main){
      if(s.mainDone[m.main]) return false;
      if(m.reqMain && !s.mainDone[m.reqMain]) return false;
    }
    if(m.chapter && s.chapter < m.chapter) return false;
    /* 官遣单（朱签必到）/ 阎君殿转批单：不受神品 tierCap 限制 */
    if(m.forced || m.yamen) return true;
    if(!Game.isGodUnlocked(m.god)) return false;
    return true;
  },
  cap(){
    const s=Game.s;
    let c=RANKS[s.rank].shelf;
    if(s.fac.desk>0) c+=FACILITIES.desk.levels.slice(0,s.fac.desk).reduce((a,l)=>a+(l.shelf||0),0);
    return c;
  },
  refresh(){
    const s=Game.s;
    const kept=(s.shelf||[]).filter(o=>{
      const m=MISSIONS.find(x=>x.id===o.mid);
      if(!m) return false;
      if(m.forced) return true;
      if((o.type==='long'||m.long) && (o.act||0)<(m.acts?m.acts.length:0)) return true;
      return false;
    });
    /* 主线单必上架（当前章节未结案者） */
    MISSIONS.filter(m=>m.main && this.available(m))
      .forEach(m=>{ if(!kept.some(o=>o.mid===m.id)) kept.push({mid:m.id,bargain:false}); });
    const count=this.cap();
    /* 普通短单池 */
    const copy=MISSIONS.filter(m=>!m.forced && !m.long && !m.main && !m.sideLocked && this.available(m))
      .filter(m=>!kept.some(o=>o.mid===m.id));
    while(kept.length+copy.length>count && copy.length){ copy.splice(Math.floor(Math.random()*copy.length),1); }
    while(kept.length<count && copy.length){
      const i=Math.floor(Math.random()*copy.length);
      kept.push({mid:copy.splice(i,1)[0].id,bargain:false});
    }
    /* 长单：月初必放一张；月中架空则 25% 补 */
    if(!kept.some(o=>{ const m=MISSIONS.find(x=>x.id===o.mid); return m&&m.long; })){
      const longs=MISSIONS.filter(m=>m.long && this.available(m)).filter(m=>!kept.some(o=>o.mid===m.id));
      if(longs.length && (s.day===1 || (kept.length<count && Math.random()<0.25))){
        kept.push({mid:longs[Math.floor(Math.random()*longs.length)].id,bargain:false,type:'long',act:0});
      }
    }
    s.shelf=kept;
    /* 新在架工单的场景图提前入预热队首，玩家翻开案牍时已在缓存 */
    if(typeof ASSET!=='undefined'){
      ASSET.warm(kept.map(o=>'task_'+o.mid).filter(k=>ASSET.list[k]), true);
    }
  },
};
