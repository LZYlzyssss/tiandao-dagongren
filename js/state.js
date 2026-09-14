/* ================= 天道打工人 · 状态与规则 ================= */
const SAVE_KEY = 'tiandao_dagongren_v1';

const Game = {
  s: null,

  newGame(){
    this.s = {
      rank:0, month:1, day:1,
      cult:0, money:120, favor:2, merit:0,
      hp:100, strikes:0,
      gh:{},            // id -> {awakened:bool, insight:0..1, sleep:days}
      equipped:[],      // 已镶嵌神格 id
      bag:{},           // 已购法宝 id -> true
      wear:{weapon:null, armor:null, trinket:null}, // 三栏位穿戴
      soldiers:[],      // ['xiaojiang',...]
      fac:{ shrine:0, desk:0, incense:0, banner:0 },
      shelf:[],         // [{mid, bargain}]
      busy:false,       // 下凡中
      fusionBless:{},   // out -> 0..1 失败祝福
      tut:{done:false, stage:'start'},  // 新手引导进度
      log:[],
    };
    Stats.recalc();
    this.s.hp = Stats.cur().maxHp;
    Shelf.refresh();
    this.save();
  },

  save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(this.s)); }catch(e){} },
  load(){
    try{
      const raw = localStorage.getItem(SAVE_KEY);
      if(!raw) return false;
      this.s = JSON.parse(raw);
      this.migrate();
      return true;
    }catch(e){ return false; }
  },
  /** 旧存档兼容：items(买到即生效) → bag + wear 三栏位 */
  migrate(){
    const s=this.s;
    if(s.bag===undefined) s.bag={};
    if(!s.wear) s.wear={weapon:null, armor:null, trinket:null};
    if(s.items){
      Object.keys(s.items).forEach(id=>{
        if(!ITEMS[id]) return;
        s.bag[id]=true;
        const sl=ITEMS[id].slot;
        if(!s.wear[sl]) s.wear[sl]=id;   // 旧档已拥有的法宝自动穿戴上
      });
      delete s.items;
    }
    /* 老玩家存档默认不弹新手引导（可在案牍页手动重看） */
    if(!s.tut) s.tut={done:true, stage:'done'};
  },
  clear(){ try{ localStorage.removeItem(SAVE_KEY); }catch(e){} },

  /* ---------- 神格 ---------- */
  hasGh(id){ return !!this.s.gh[id]; },
  awakened(id){ return !!(this.s.gh[id] && this.s.gh[id].awakened); },

  /** 完成委托：获得神格碎片。返回结算信息 */
  grantGodhood(mid){
    const m = MISSIONS.find(x=>x.id===mid);
    const id = m.gh, g = GODHOODS[id];
    const res = { id, name:g.name, isNew:false, awakened:false, cultGain:0 };
    if(!this.s.gh[id]){
      this.s.gh[id] = { awakened:false, insight:0, sleep:0 };
      res.isNew = true;
      res.cultGain = g.cult;
      this.s.cult += g.cult;
      /* 觉醒检定 */
      const rate = Math.min(0.95, 0.3 + (this.s.fac.shrine>0 ? FACILITIES.shrine.levels[this.s.fac.shrine-1].wakeBonus : 0));
      if(Math.random() < rate){
        this.s.gh[id].awakened = true;
        res.awakened = true;
      }
    }else{
      res.cultGain = 8;
      this.s.cult += 8;
      const rec = this.s.gh[id];
      if(!rec.awakened){
        rec.insight = Math.min(1, rec.insight + 0.2);
        res.insight = rec.insight;
      }
    }
    Stats.recalc();
    this.save();
    return res;
  },

  /** 在神龛手动参悟：花香火钱点化未觉醒神格 */
  ponder(id){
    const rec = this.s.gh[id]; if(!rec || rec.awakened) return;
    const cost = 120;
    if(this.s.money < cost){ UI.toast('香火钱不足'); return; }
    this.s.money -= cost;
    const rate = Math.min(0.95, 0.25 + rec.insight + (this.s.fac.shrine>0 ? FACILITIES.shrine.levels[this.s.fac.shrine-1].wakeBonus : 0));
    if(Math.random() < rate){
      rec.awakened = true; rec.insight = 0;
      UI.toast(`「${GODHOODS[id].name}」觉醒了！`);
    }else{
      rec.insight = Math.min(1, rec.insight + 0.25);
      UI.toast('感悟加深，尚差一线');
    }
    Stats.recalc(); this.save(); UI.render();
  },

  toggleEquip(id){
    const eq = this.s.equipped;
    const i = eq.indexOf(id);
    if(i>=0){ eq.splice(i,1); }
    else{
      if(this.s.gh[id] && this.s.gh[id].sleep>0){ UI.toast('该神格正在沉睡，无法催动'); return; }
      if(eq.length >= Stats.slots()){ UI.toast('镶嵌槽已满（晋升品阶可扩充）'); return; }
      eq.push(id);
    }
    Stats.recalc();
    if(this.s.hp > Stats.cur().maxHp) this.s.hp = Stats.cur().maxHp;
    this.save(); UI.render();
    if(typeof Guide!=='undefined') Guide.act('toggleEquip', id);
  },

  /** 融合 */
  canFuse(f){
    return f.in.every(id=>this.awakened(id)) &&
           !f.in.some(id=>this.s.equipped.includes(id));
  },
  fuse(f){
    if(!this.canFuse(f)){ UI.toast('条件未满足'); return; }
    if(this.s.money < f.cost){ UI.toast('香火钱不足'); return; }
    this.s.money -= f.cost;
    const bless = this.s.fusionBless[f.out]||0;
    if(Math.random() < f.baseRate + bless){
      f.in.forEach(id=>{ delete this.s.gh[id]; });
      this.s.equipped = this.s.equipped.filter(id=>!f.in.includes(id));
      this.s.gh[f.out] = { awakened:true, insight:0, sleep:0 };
      this.s.cult += GODHOODS[f.out].cult;
      this.s.fusionBless[f.out] = 0;
      UI.toast(`融合出神格：「${GODHOODS[f.out].name}」！`);
    }else{
      this.s.fusionBless[f.out] = Math.min(0.9, (this.s.fusionBless[f.out]||0)+0.25);
      UI.toast('融合失败，神格抗拒，彼此记下了气息');
    }
    Stats.recalc(); this.save(); UI.render();
  },

  /* ---------- 法宝：购买 / 穿戴 / 取下 ---------- */
  buyItem(id){
    if(this.s.bag[id]){ UI.toast('铺中只剩样品，这一件你已购入'); return; }
    const it = ITEMS[id];
    if(this.s.money < it.price){ UI.toast('香火钱不足'); return; }
    this.s.money -= it.price; this.s.bag[id] = true;
    this.save(); UI.render();
    UI.toast(`购入「${it.name}」，已收入背包`);
  },
  /** 穿戴：同栏位旧装备自动换回背包 */
  wearItem(id){
    if(!this.s.bag[id]) return;
    const slot = ITEMS[id].slot;
    this.s.wear[slot] = id;
    Stats.recalc();
    if(this.s.hp > Stats.cur().maxHp) this.s.hp = Stats.cur().maxHp;
    this.save(); UI.render(); UI.toast(`已装备「${ITEMS[id].name}」`);
  },
  takeOff(slot){
    const id = this.s.wear[slot];
    if(!id) return;
    this.s.wear[slot] = null;
    Stats.recalc();
    if(this.s.hp > Stats.cur().maxHp) this.s.hp = Stats.cur().maxHp;
    this.save(); UI.render(); UI.toast(`已取下「${ITEMS[id].name}」`);
  },
  /** 出售闲置法宝：仅背包中未穿戴的可卖，半价回收，概不赎回 */
  sellItem(id){
    const s=this.s;
    if(!s.bag[id]) return;
    const it=ITEMS[id];
    if(s.wear[it.slot]===id){ UI.toast('佩中的法宝不能出手，请先取下'); return; }
    const gain=Math.floor(it.price*SELL_RATE);
    delete s.bag[id];
    s.money += gain;
    Stats.recalc();
    this.save(); UI.render();
    UI.toast(`老道掂了掂，丢下 ${gain} 文，把「${it.name}」收走了`);
  },
  recruit(id){
    const cap = 1 + (this.s.fac.banner>0 ? FACILITIES.banner.levels.slice(0,this.s.fac.banner).reduce((a,l)=>a+(l.cap||0),0) : 0);
    if(this.s.soldiers.length >= cap){ UI.toast('阴兵编制已满，升级招妖幡可扩充'); return; }
    const so = SOLDIERS[id];
    if(this.s.money < so.price){ UI.toast('香火钱不足'); return; }
    this.s.money -= so.price; this.s.soldiers.push(id);
    this.save(); UI.render(); UI.toast(`招募了一名${so.name}`);
  },
  upgradeFac(key){
    const f = FACILITIES[key], lv = this.s.fac[key];
    if(lv >= f.levels.length){ UI.toast('已至最高级'); return; }
    const cost = f.levels[lv].cost;
    if(this.s.money < cost){ UI.toast('香火钱不足'); return; }
    this.s.money -= cost; this.s.fac[key] = lv+1;
    Stats.recalc();
    if(this.s.hp>Stats.cur().maxHp) this.s.hp=Stats.cur().maxHp;
    this.save(); UI.render(); UI.toast(`${f.name}升至 ${lv+2} 级`);
  },

  /* ---------- 工单 ---------- */
  bargain(idx){
    if(this.s.favor<=0){ UI.toast('人情不够，神仙也没空理你'); return; }
    const o = this.s.shelf[idx]; if(!o || o.bargain) return;
    this.s.favor--; o.bargain = true;
    this.save(); UI.render(); UI.toast('神仙勉强同意追加香火钱');
  },
  reject(idx){
    this.s.shelf.splice(idx,1);
    this.save(); UI.render();
  },

  /* ---------- 日历与考核 ---------- */
  advanceDay(){
    this.s.day++;
    Object.values(this.s.gh).forEach(r=>{ if(r.sleep>0) r.sleep--; });
    if(this.s.day > MONTH_DAYS){ this.review(); return true; }
    Shelf.refresh();
    this.save();
    return false;
  },
  rest(){
    const st = Stats.cur();
    this.s.hp = st.maxHp;
    this.advanceDay();
    UI.toast('你在神衙闭目调息了一天，神力充盈');
    UI.render();
  },
  /** 战斗死亡的惩罚 */
  deathPenalty(){
    const lostMoney = Math.floor(this.s.money*0.3);
    this.s.money -= lostMoney;
    this.s.merit = Math.max(0, this.s.merit-15);
    this.s.hp = Stats.cur().maxHp;
    this.s.busy = false;
    const reviewed = this.advanceDay();
    return { lostMoney, reviewed };
  },
  review(){
    const target = monthTarget(this.s.month);
    const pass = this.s.merit >= target;
    let promoted = false;
    if(pass){
      this.s.strikes = 0;
      if(this.s.rank < RANKS.length-1){ this.s.rank++; promoted = true; }
      this.s.money += 80;
      this.s.month++;
    }else{
      this.s.strikes++;
      this.s.month++;
    }
    this.s.merit = 0;
    this.s.day = 1;
    Stats.recalc();
    this.s.hp = Stats.cur().maxHp;
    Shelf.refresh();
    this.save();
    UI.showReview(pass, promoted, target, this.s.strikes);
  },
};

/* ================= 数值派生 ================= */
const Stats = {
  cur(){ return this._cache; },
  slots(){ return RANKS[Game.s.rank].slots; },
  recalc(){
    const s = Game.s;
    const v = { maxHp:150, atk:24, def:12, maxMp:60,
      crit:0.05, lifesteal:0, passives:[], clash:false, resonance:null,
      stunProc:0, healStart:0, dmgReduce:0, burnOnHit:0, burnOnHitDmg:0 };

    /* 修为成长 */
    v.maxHp += s.cult;
    v.atk += Math.floor(s.cult/5);
    v.def += Math.floor(s.cult/15);
    v.maxMp += Math.floor(s.cult/4);

    /* 香炉 */
    if(s.fac.incense>0) v.maxMp += FACILITIES.incense.levels.slice(0,s.fac.incense).reduce((a,l)=>a+l.mana,0);

    /* 镶嵌神格 */
    const paths = {};
    s.equipped.forEach(id=>{
      const g = GODHOODS[id], rec = s.gh[id];
      if(!g) return;
      const sleeping = rec && rec.sleep>0;
      if(!sleeping){
        paths[g.path] = (paths[g.path]||0)+1;
        if(g.stat){
          v.maxHp += g.stat.hp||0; v.atk += g.stat.atk||0; v.def += g.stat.def||0;
        }
        if(rec && rec.awakened && g.passive){
          v.crit += g.passive.crit||0;
          v.lifesteal += g.passive.lifesteal||0;
          v.atk += g.passive.atk||0;
          v.def += g.passive.def||0;
          v.passives.push({gh:id, label:g.passive.label});
        }
      }
    });

    /* 道争 */
    if(s.equipped.some(id=>GODHOODS[id] && GODHOODS[id].path==='revelation') &&
       s.equipped.some(id=>GODHOODS[id] && GODHOODS[id].path==='nether')){
      v.clash = true; v.maxMp = Math.floor(v.maxMp*0.8);
    }
    /* 共鸣 */
    Object.entries(paths).forEach(([p,n])=>{
      if(n>=RESONANCE_NEED && !v.resonance) v.resonance = p;
    });
    if(v.resonance) v.atk = Math.floor(v.atk*1.1);

    /* 法宝：仅三栏位中穿戴的生效 */
    Object.values(s.wear||{}).forEach(id=>{
      if(!id || !s.bag[id]) return;
      const it = ITEMS[id]; if(!it) return;
      if(it.stat){
        v.maxHp += it.stat.hp||0;
        v.atk += it.stat.atk||0;
        v.def += it.stat.def||0;
        v.crit += it.stat.crit||0;
        v.lifesteal += it.stat.lifesteal||0;
      }
      if(it.proc){
        v.stunProc = Math.max(v.stunProc, it.proc.stun||0);
        v.healStart = Math.max(v.healStart, it.proc.healStart||0);
        v.dmgReduce = Math.max(v.dmgReduce, it.proc.dmgReduce||0);
        if(it.proc.burnOnHit){ v.burnOnHit = it.proc.burnOnHit; v.burnOnHitDmg = 0.3; }
      }
    });

    if(s.hp > v.maxHp) s.hp = v.maxHp;
    this._cache = v;
    return v;
  },
};

/* ================= 工单架 ================= */
const Shelf = {
  refresh(){
    /* 官遣单若尚未接取，跨日保留 */
    const kept = (Game.s.shelf||[]).filter(o=>{
      const m = MISSIONS.find(x=>x.id===o.mid);
      return m && m.forced;
    });
    const count = 3 + (Game.s.fac.desk>0 ? FACILITIES.desk.levels.slice(0,Game.s.fac.desk).reduce((a,l)=>a+(l.shelf||0),0) : 0);
    const pool = MISSIONS.filter(m=>!m.forced);
    const copy = pool.slice();
    while(kept.length + copy.length > count && copy.length){ copy.splice(Math.floor(Math.random()*copy.length),1); }
    while(kept.length < count && copy.length){
      const i = Math.floor(Math.random()*copy.length);
      kept.push({ mid:copy.splice(i,1)[0].id, bargain:false });
    }
    /* 每月初一，官遣单必到 */
    if(Game.s.day===1 && !kept.some(o=>MISSIONS.find(m=>m.id===o.mid).forced)){
      kept.unshift({ mid:'m8', bargain:false });
    }
    Game.s.shelf = kept;
  },
};
