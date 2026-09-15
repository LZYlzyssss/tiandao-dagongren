/* ================= 天道打工人 · 战斗引擎 v3 =================
  三时刻（敌 85% / 60% / 30% 血）· 敌人意图（强攻/蓄力/守势）· 读招克制
  11 种神格主动技 · 技能冷却 · 好感五档援助 · 壳神神位减伤 · 侵蚀幻觉
  共鸣（耗神/控制/灼烧/真伤/治疗护盾）· 免死被动 · 四系克制
  接口：Battle.run(node, ctx) -> 'win' | 'flee' | 'dead'
  ============================================================ */
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const rnd = (a,b)=> a + Math.random()*(b-a);
const clamp = (v,a,b)=> Math.max(a,Math.min(b,v));

/* 意图→克制动作映射（玩家用对应类型/动作时获 +40% 伤害或 −50% 承伤） */
const INTENT_INFO = {
  qiang: { name:'强攻', desc:'下回合重击，宜护盾/守势化解' },
  xu:    { name:'蓄力', desc:'正在积蓄，宜震骇/雷控打断' },
  shou:  { name:'守势', desc:'举盾减伤，宜易伤/灼烧/真伤破防' },
  mixed: { name:'游斗', desc:'无明显倾向' },
};
/* 克制判定：某主动技类型是否克制当前意图 */
const COUNTER = {
  qiang: { skill:['shield','heal','nukeHeal','percentHeal'], dmgReduce:0.5 },
  xu:    { skill:['control','nukeStun','percentStun'], bonus:0.4 },
  shou:  { skill:['vuln','burn','percentStun','percentHeal','nuke'], bonus:0.4 },
};

const Battle = {
  /** @param {object} node {enemy, scale}
   *  @param {object} ctx {atkBuff, shield, enemyAtk, enemyVuln, intro, log[]}
   *  @returns {'win'|'flee'|'dead'} */
  async run(node, ctx){
    const s = Game.s, st = Stats.cur();

    /* ---- 玩家快照 ---- */
    const p = {
      maxHp: st.maxHp, hp: s.hp,
      maxMp: st.maxMp, mp: st.maxMp,
      atk: Math.round(st.atk * (1 + (ctx.atkBuff||0))),
      def: st.def, crit: st.crit, critDmg: st.critDmg, lifesteal: st.lifesteal,
      trueDmg: st.trueDmg||0, burnDot: st.burnDot||0, burnRound: st.burnRound||0,
      healShield: st.healShield||0, cleanseHeal: st.cleanseHeal||0,
      regen: st.regen||0, mpCost: st.mpCost||1, ctrlBonus: st.ctrlBonus||0,
      dmgReduce: st.dmgReduce||0,
      shield: 0,
      stunProc: st.stunProc, healStart: st.healStart,
      burnOnHit: st.burnOnHit||0,
      zhanshen: !!st.zhanshen,
      saves: (st.saves||[]).map(sv=>({...sv, used:false})),
    };
    /* 可催动的觉醒神格（含融合） */
    p.skillIds = s.equipped.filter(id=>s.gh[id] && s.gh[id].awakened && s.gh[id].sleep<=0);
    p.cooldowns = {};          // id -> 剩余冷却回合
    p.passiveGh = p.skillIds.slice();

    if(st.healStart){
      const h = Math.round(p.maxHp*st.healStart);
      p.hp = clamp(p.hp+h, 0, p.maxHp);
    }
    if(ctx.shield) p.shield += Math.round(p.maxHp*ctx.shield);

    /* ---- 敌方快照 ---- */
    const t = ENEMIES[node.enemy];
    const scale = node.scale || 1;
    const e = {
      id:node.enemy, name:node.name||t.name, icon:t.icon, tint:t.tint,
      kind:t.kind, tier:t.tier,
      maxHp: Math.round(t.hp*scale), hp:0,
      atk: Math.round(t.atk*(1+(scale-1)*0.7)*(1+(ctx.enemyAtk||0))),
      def:t.def, crit:t.crit||0, lifesteal:t.lifesteal||0,
      weak:t.weak||[], resist:t.resist||{},
      intent:t.intent||'mixed', intentNext:'mixed',
      traits:t.traits||{}, shell:!!t.shell,
      divineReduce:(t.traits&&t.traits.divineReduce)||0,
      burnFx:t.burnFx||'黑焰', hpLabel:t.hpLabel||'气血', deathFx:t.deathFx||'黑烟',
      burn:0, burnDmg:0, stun:0, vulnTurns:0, vulnFixed: ctx.enemyVuln?1.5:1,
      shielding:false, charging:false,
      phase:1,
    };
    e.hp = e.maxHp;
    /* 意图选择器 */
    const rollIntent = (enemy)=>{
      const base=enemy.intent||'mixed';
      if(base==='mixed' || Math.random()<0.25){
        const pool=['qiang','xu','shou','mixed'];
        return pool[Math.floor(Math.random()*pool.length)];
      }
      return base;
    };
    /* 决定首个意图 */
    e.intentNext = rollIntent(e);

    /* 阴兵 */
    const hasGuardsFirst = s.soldiers.includes('xiaojiang');
    const hasBlock = s.soldiers.includes('duwei');

    const B = {
      p,e, round:0, log:[], momentsUsed:0,
      finished:false, fled:false, playerDown:false,
      aidUsed:false, aidGod:null,
    };

    const addLog = (html, cls)=>{
      B.log.push({html, cls:cls||''});
      if(B.log.length>8) B.log.shift();
    };
    const isHalluc = ()=> st.halluc>0 && Math.random()<st.halluc;

    /* ---------- 四系克制系数（敌方 kind vs 行动系别） ---------- */
    const elemMul = (path)=>{
      if(!path) return 1;
      if(e.weak.includes(path)) return 1.4;
      if(e.resist && e.resist[path]) return 1 - e.resist[path];
      return 1;
    };
    /* 壳神减伤：常规伤害−divineReduce；真伤(percent系)无视；斩神(zhanshen)无视 */
    const shellMul = (isTrue)=>{
      if(!e.shell || isTrue || p.zhanshen) return 1;
      return 1 - (e.divineReduce||0);
    };

    /* ---------- 玩家普攻 ---------- */
    const playerStrike = async (mult=1, path, opts={})=>{
      if(e.stun>0){ /* 敌人震骇不影响玩家 */ }
      const isCrit = Math.random() < p.crit;
      const vulnMul = (e.vulnTurns>0 || e.vulnFixed>1) ? 1.5 : 1;
      const el = elemMul(path);
      const sh = e.shielding ? 0.5 : 1;
      let dmg = Math.max(1, Math.round((p.atk*mult*rnd(0.9,1.1) - e.def*0.45) * vulnMul * el * sh * (isCrit?p.critDmg:1)));
      if(isHalluc()){ dmg = Math.round(dmg*0.85); }
      e.hp = Math.max(0, e.hp-dmg);
      const life = p.lifesteal;
      let h = 0;
      if(life>0){ h=Math.round(dmg*life); p.hp=clamp(p.hp+h,0,p.maxHp); }
      if(!opts.silent) addLog(`你出手，${isCrit?'<b>暴击！</b>':''}造成 <b>${dmg}</b> 点伤害${h?`，汲取 ${h} 点生机`:''}`, 'lg-good');
      UI.flash('foe','hit'); UI.floatFoe(`-${dmg}`, isCrit?'#c03c2e':'#5c5347');
      if(isCrit) await sleep(120);
      /* 锁魂链 */
      if(p.stunProc && Math.random()<p.stunProc && e.hp>0 && !(e.traits&&e.traits.stunImmune)){
        e.stun = Math.max(e.stun,1);
        addLog('锁魂链缠上敌魂，它动弹不得！','lg-sys');
      }
      /* 神火印：命中点燃 */
      if(p.burnOnHit && e.hp>0 && e.burn<=0 && Math.random()<p.burnOnHit){
        e.burn = 2 + p.burnRound; e.burnDmg = Math.round(p.atk*0.3*(1+p.burnDot));
        addLog(`神火印火星溅出，点燃了「${e.name}」（每回合 ${e.burnDmg}，${e.burn} 回合）！`,'lg-sys');
      }
    };

    /* ---------- 敌人行动 ---------- */
    const enemyAct = async ()=>{
      if(e.stun>0){ e.stun--; addLog(`「${e.name}」被震骇，无法行动。`,'lg-sys'); return; }
      e.intent = e.intentNext;
      const isCrit = Math.random() < e.crit;
      let dmg = 0, tag='', waitMul = 1;
      /* 意图行为 */
      if(e.intent==='xu'){
        /* 蓄力：本回合不攻击，下回合加倍 */
        e.charging = true;
        addLog(`「${e.name}」正在【蓄力】，气息暴涨——下回合必有重击！`,'lg-bad');
        e.intentNext = 'qiang';   // 蓄力后必强攻
        return;
      }
      if(e.intent==='shou'){
        e.shielding = true;
        e.hp = clamp(e.hp + Math.round(e.maxHp*0.05), 0, e.maxHp);
        addLog(`「${e.name}」摆出【守势】，周身浮起护体之气，还回了点神元。`,'lg-bad');
        tag='（守势）';
      }
      if(e.intent==='qiang'){
        const mul = e.charging ? 2.2 : 1.6;
        e.charging = false;
        dmg = Math.max(1, Math.round((e.atk*mul*rnd(0.9,1.1) - p.def*0.45) * (isCrit?2:1)));
        tag = e.charging?'（蓄力爆发！）':(isCrit?'（狠招！）':'');
      }else{
        /* mixed 普通一击 */
        dmg = Math.max(1, Math.round((e.atk*rnd(0.9,1.1) - p.def*0.45) * (isCrit?2:1)));
        tag = isCrit?'（狠招！）':'';
      }
      /* 阴兵挡刀 */
      if(hasBlock && Math.random()<0.2){ dmg = Math.round(dmg*0.5); addLog('阴兵小将挺枪挡在你身前，替你挡下半数攻势！','lg-sys'); }
      /* 玩家百分比减伤 */
      if(p.dmgReduce>0) dmg = Math.max(1, Math.round(dmg*(1-p.dmgReduce)));
      /* 关键时刻「凝神接战」的守势减伤 */
      if(p._guard && p._guard<1) dmg = Math.max(1, Math.round(dmg*p._guard));
      /* 护盾 */
      if(p.shield>0){ const ab = Math.min(p.shield,dmg); p.shield-=ab; dmg-=ab; }
      p.hp = Math.max(0,p.hp-dmg);
      addLog(`「${e.name}」${tag}反击，造成 <b>${dmg}</b> 点伤害`, 'lg-bad');
      UI.flash('player','hit'); UI.floatPlayer(`-${dmg}`,'#c03c2e');
      /* 敌方特性 */
      if(e.lifesteal>0 && e.hp>0){ e.hp=clamp(e.hp+Math.round(dmg*e.lifesteal),0,e.maxHp); }
      if(e.traits.burnHit && Math.random()<e.traits.burnHit){
        const fx=Math.round(e.atk*0.4); p.hp=Math.max(0,p.hp-fx);
        addLog(`${e.burnFx}溅到你身上，追加 ${fx} 点伤害。`,'lg-bad');
        UI.floatPlayer(`-${fx}`,'#d2571c');
      }
      /* 守势只持续一回合 */
      e.shielding = false;
      /* 决定下回合意图（蓄力后已固定为强攻） */
      if(e.intentNext==='qiang' && e.intent==='xu'){ /* 蓄力→强攻已设定 */ }
      else { e.intentNext = rollIntent(e); }
    };

    /* ---------- 祭法宝（11 种主动技 + 冷却） ---------- */
    const castSkill = async (id)=>{
      const g = GODHOODS[id], a = g.active;
      if(p.mp < a.cost){ UI.toast('神力不足'); return false; }
      if((p.cooldowns[id]||0)>0){ UI.toast(`「${g.name}」冷却中（${p.cooldowns[id]}回合）`); return false; }
      p.mp -= a.cost;
      p.cooldowns[id] = a.cd||0;
      UI.flash('player','cast');
      addLog(`你催动神格「${g.name}」——<b>${a.name}</b>！`,'lg-sys');
      await sleep(250);

      const isTrue = a.type==='percentStun' || a.type==='percentHeal';
      const vulnMul = (e.vulnTurns>0 || e.vulnFixed>1) ? 1.5 : 1;
      const el = elemMul(g.path);
      /* 读招克制：技能类型是否克制当前意图 */
      const ci = COUNTER[e.intentNext] || COUNTER[e.intent];
      let counter = 1;
      if(ci && ci.skill && ci.skill.includes(a.type)){
        counter = 1 + (ci.bonus||0);
        addLog(`—— 读招克制！「${INTENT_INFO[e.intentNext]?.name||e.intent}」被你一招破去 ——`,'lg-good');
      }

      switch(a.type){
        case 'nuke':{
          let dmg=Math.max(1,Math.round((p.atk*a.mult*rnd(0.95,1.05)-e.def*0.45)*vulnMul*el*counter*shellMul(false)));
          if(e.shielding) dmg=Math.round(dmg*0.5);
          e.hp=Math.max(0,e.hp-dmg); UI.floatFoe(`-${dmg}`,'#7a2d8c');
          addLog(`棒影如山，造成 <b>${dmg}</b> 点伤害。`,'lg-good'); break;
        }
        case 'nukeStun':{
          let dmg=Math.max(1,Math.round((p.atk*a.mult*rnd(0.95,1.05)-e.def*0.45)*vulnMul*el*counter*shellMul(false)));
          if(e.shielding) dmg=Math.round(dmg*0.5);
          e.hp=Math.max(0,e.hp-dmg);
          if(!(e.traits&&e.traits.stunImmune)){ e.stun=Math.max(e.stun,(a.rounds||1)+p.ctrlBonus); e.charging=false; }
          UI.floatFoe(`-${dmg}`,'#7a2d8c');
          addLog(`天翻地覆，造成 <b>${dmg}</b> 点伤害，敌人被震骇${e.stun?` ${e.stun} 回合`:''}！`,'lg-good'); break;
        }
        case 'vuln':{
          let dmg=Math.max(1,Math.round((p.atk*a.mult-e.def*0.45)*el*counter*shellMul(false)));
          if(e.shielding) dmg=Math.round(dmg*0.5);
          e.hp=Math.max(0,e.hp-dmg); e.vulnTurns=(a.vuln||2); e.shielding=false;
          UI.floatFoe(`-${dmg}`,'#c9962f');
          addLog(`破绽毕露，造成 ${dmg} 点伤害，敌人 ${e.vulnTurns} 回合内承伤+50%。`,'lg-good'); break;
        }
        case 'nukeHeal':{
          let dmg=Math.max(1,Math.round((p.atk*a.mult*rnd(0.95,1.05)-e.def*0.45)*vulnMul*el*counter*shellMul(false)));
          if(e.shielding) dmg=Math.round(dmg*0.5);
          const h=Math.round(p.maxHp*a.heal*(1+p.healShield));
          e.hp=Math.max(0,e.hp-dmg); p.hp=clamp(p.hp+h,0,p.maxHp);
          UI.floatFoe(`-${dmg}`,'#2e6f8e'); UI.floatPlayer(`+${h}`,'#477a5a');
          addLog(`圣光贯体，造成 <b>${dmg}</b> 点伤害，回复 ${h} 点生命。`,'lg-good'); break;
        }
        case 'shield':{
          const sh=Math.round(p.maxHp*a.shield*(1+p.healShield)); p.shield+=sh;
          UI.floatPlayer(`护盾+${sh}`,'#2e6f8e');
          addLog(`光盾张开，获得 ${sh} 点护盾。`,'lg-sys'); break;
        }
        case 'heal':{
          const h=Math.round(p.maxHp*a.heal*(1+p.healShield));
          p.hp=clamp(p.hp+h,0,p.maxHp); UI.floatPlayer(`+${h}`,'#477a5a');
          addLog(`灵气涌动，回复 <b>${h}</b> 点生命。`,'lg-good'); break;
        }
        case 'burn':{
          let dmg=Math.max(1,Math.round((p.atk*a.mult*rnd(0.9,1.1)-e.def*0.45)*el*counter*shellMul(false)));
          if(e.shielding) dmg=Math.round(dmg*0.5);
          e.hp=Math.max(0,e.hp-dmg);
          e.burn=(a.burnRounds||3)+p.burnRound; e.burnDmg=Math.round(p.atk*a.burnPct*(1+p.burnDot));
          e.shielding=false;
          UI.floatFoe(`-${dmg}`,'#d2571c');
          addLog(`风火缠身，造成 ${dmg} 点伤害并点燃敌人（每回合 ${e.burnDmg}，${e.burn} 回合）。`,'lg-good'); break;
        }
        case 'percentStun':{
          const base=Math.round(e.maxHp*a.pct);
          const dmg=Math.round(base*(1+p.trueDmg)*shellMul(true));
          e.hp=Math.max(0,e.hp-dmg);
          if(!(e.traits&&e.traits.stunImmune)){ e.stun=Math.max(e.stun,(a.rounds||1)+p.ctrlBonus); e.charging=false; }
          UI.floatFoe(`-${dmg}`,'#7a5a8c');
          addLog(`朱笔落魂，造成 <b>${dmg}</b> 点真实伤害${e.stun?`并震骇 ${e.stun} 回合`:''}。`,'lg-good'); break;
        }
        case 'percentHeal':{
          const base=Math.round(e.maxHp*a.pct);
          const dmg=Math.round(base*(1+p.trueDmg)*shellMul(true));
          const h=Math.round(p.maxHp*a.heal*(1+p.healShield));
          e.hp=Math.max(0,e.hp-dmg); p.hp=clamp(p.hp+h,0,p.maxHp);
          UI.floatFoe(`-${dmg}`,'#7a5a8c'); UI.floatPlayer(`+${h}`,'#477a5a');
          addLog(`终审已下，造成 <b>${dmg}</b> 点真实伤害，回复 ${h} 点生命。`,'lg-good'); break;
        }
        case 'control':{
          let dmg=Math.max(1,Math.round((p.atk*(a.mult||1.2)-e.def*0.45)*el*counter*shellMul(false)));
          if(e.shielding) dmg=Math.round(dmg*0.5);
          e.hp=Math.max(0,e.hp-dmg);
          if(!(e.traits&&e.traits.stunImmune)){ e.stun=Math.max(e.stun,(a.ctrlRounds||1)+p.ctrlBonus); e.charging=false; }
          e.vulnTurns=Math.max(e.vulnTurns,2);
          UI.floatFoe(`-${dmg}`,'#2e6f9e');
          addLog(`雷霆贯体，造成 ${dmg} 点伤害，敌人被雷控 ${e.stun} 回合并露出破绽。`,'lg-good'); break;
        }
        case 'cleanse':{
          e.burn=0; /* 净化自身异常（此处简化为解除敌方对己的灼烧标记） */
          let h=0;
          if(a.heal){ h=Math.round(p.maxHp*a.heal*(1+p.healShield)); p.hp=clamp(p.hp+h,0,p.maxHp); }
          if(p.cleanseHeal>0){ const h2=Math.round(p.maxHp*p.cleanseHeal); p.hp=clamp(p.hp+h2,0,p.maxHp); h+=h2; }
          if(h) UI.floatPlayer(`+${h}`,'#477a5a');
          addLog(`清心净神，驱除缠身邪气${h?`，回复 ${h} 点生命`:''}。`,'lg-good'); break;
        }
        default:
          addLog(`「${g.name}」的神通暂未显化。`,'lg-sys');
      }
      await sleep(300);
      return true;
    };

    /* ---------- 拼命 ---------- */
    const burnGodhood = async (id)=>{
      const g = GODHOODS[id];
      UI.flash('player','cast');
      const dmg=Math.max(1,Math.round(p.atk*3.2*rnd(1.0,1.15)*shellMul(false)));
      e.hp=Math.max(0,e.hp-dmg);
      UI.floatFoe(`-${dmg}`,'#c03c2e');
      addLog(`你强行透支「${g.name}」，倾尽全力一击——<b>${dmg}</b> 点伤害！神格随即黯淡。`,'lg-bad');
      s.gh[id].sleep = 3;
      p.passiveGh = p.passiveGh.filter(x=>x!==id);
      p.skillIds = p.skillIds.filter(x=>x!==id);
      delete p.cooldowns[id];
      await sleep(300);
    };

    /* ---------- 神明援助（好感档位缩放，每场一次） ---------- */
    const castAid = async (gkey)=>{
      const gd=GODS[gkey], a=gd.aid;
      if(!gd) return;
      const lv=Game.aidLevelOf(gkey), factor=Game.aidFactor(gkey);
      if(lv<=0 || factor<=0){ UI.toast('交情尚浅，无法呼神'); return; }
      B.aidUsed=true; B.aidGod=gkey;
      UI.flash('player','cast');
      const lvName=FAVOR_LEVELS[lv].name;
      addLog(`危难之际，你遥唤「${gd.name}」——${lvName}降临，<b>${a.name}</b>！`,'lg-sys');
      await sleep(250);
      const scaleParam = (v)=> (typeof v==='number' ? v*factor : v);
      const canStun = !a.stunAt || lv>=a.stunAt;
      switch(a.type){
        case 'nuke':{
          const dmg=Math.max(1,Math.round(p.atk*scaleParam(a.mult)*rnd(0.95,1.05)-e.def*0.45)*shellMul(false));
          e.hp=Math.max(0,e.hp-dmg); UI.floatFoe(`-${dmg}`,'#c03c2e');
          addLog(`${gd.name}远程压阵，造成 <b>${dmg}</b> 点伤害。`,'lg-good'); break;
        }
        case 'percent': case 'percentStun': case 'percentHeal':{
          const dmg=Math.round(e.maxHp*scaleParam(a.pct)*(1+p.trueDmg)*shellMul(true));
          e.hp=Math.max(0,e.hp-dmg);
          if(a.stun && canStun && !(e.traits&&e.traits.stunImmune)) e.stun=Math.max(e.stun,1);
          if(a.heal){ const h=Math.round(p.maxHp*scaleParam(a.heal)*(1+p.healShield)); p.hp=clamp(p.hp+h,0,p.maxHp); UI.floatPlayer(`+${h}`,'#477a5a'); }
          UI.floatFoe(`-${dmg}`,'#7a5a8c');
          addLog(`一笔勾销，造成 <b>${dmg}</b> 点真实伤害${a.stun&&canStun?'并震骇敌人':''}。`,'lg-good'); break;
        }
        case 'heal':{
          const hp=Math.round(p.maxHp*scaleParam(a.heal)*(1+p.healShield));
          p.hp=clamp(p.hp+hp,0,p.maxHp); UI.floatPlayer(`+${hp}`,'#477a5a');
          addLog(`灵气涌入神躯，回复 <b>${hp}</b> 点生命。`,'lg-good'); break;
        }
        case 'shield':{
          const sh=Math.round(p.maxHp*scaleParam(a.shield)*(1+p.healShield)); p.shield+=sh;
          UI.floatPlayer(`护盾+${sh}`,'#2e6f8e');
          addLog(`护身签押落下，获得 <b>${sh}</b> 点护盾。`,'lg-sys'); break;
        }
        case 'healShield':{
          const hp=Math.round(p.maxHp*scaleParam(a.heal)*(1+p.healShield)), sh=Math.round(p.maxHp*scaleParam(a.shield)*(1+p.healShield));
          p.hp=clamp(p.hp+hp,0,p.maxHp); p.shield+=sh;
          UI.floatPlayer(`+${hp}`,'#477a5a'); UI.floatPlayer(`护盾+${sh}`,'#2e6f8e');
          addLog(`圣光垂照，回复 <b>${hp}</b> 点生命并获得 <b>${sh}</b> 点护盾。`,'lg-good'); break;
        }
        case 'burn':{
          e.burn=(a.rounds||3)+p.burnRound; e.burnDmg=Math.round(p.atk*scaleParam(a.pct||a.burnPct)*(1+p.burnDot));
          addLog(`神焰焚身，「${e.name}」被点燃（每回合 ${e.burnDmg}，${e.burn} 回合）！`,'lg-good'); break;
        }
        case 'vuln':{
          const dmg=Math.max(1,Math.round(p.atk*scaleParam(a.mult)-e.def*0.45)*shellMul(false));
          e.hp=Math.max(0,e.hp-dmg); e.vulnTurns=a.vuln||2;
          UI.floatFoe(`-${dmg}`,'#c9962f');
          addLog(`一道破绽被点破，造成 ${dmg} 点伤害，敌承伤+50%。`,'lg-good'); break;
        }
        case 'control':{
          if(canStun && !(e.traits&&e.traits.stunImmune)){ e.stun=Math.max(e.stun,1); e.charging=false; }
          addLog(`${gd.name}一道法旨，敌人动弹不得。`,'lg-good'); break;
        }
        case 'cleanse':{
          e.burn=0;
          if(a.heal){ const h=Math.round(p.maxHp*scaleParam(a.heal)*(1+p.healShield)); p.hp=clamp(p.hp+h,0,p.maxHp); UI.floatPlayer(`+${h}`,'#477a5a'); }
          addLog(`清净法旨，邪祟退散。`,'lg-good'); break;
        }
        case 'buff':{
          p.atk += Math.round(p.atk*(a.atk||0));
          addLog(`${gd.name}赐你增益，攻击提升。`,'lg-good'); break;
        }
        case 'debuff':{
          e.atk = Math.max(1, Math.round(e.atk*(1+(a.atk||0))));
          e.def = Math.max(0, Math.round(e.def*(1+(a.def||0))));
          addLog(`${gd.name}的威压令敌人攻防下降。`,'lg-good'); break;
        }
      }
      /* 本体档专属效果 */
      if(a.extraAt && lv>=a.extraAt && a.extraDesc){
        addLog(`<b>${gd.name}本体临世</b>：${a.extraDesc}`,'lg-good');
      }
      await sleep(300);
    };

    /* ---------- 关键时刻：85% / 60% / 30% ---------- */
    const moments = [ {at:0.85,used:false}, {at:0.6,used:false}, {at:0.3,used:false} ];
    const tryMoment = async ()=>{
      for(const m of moments){
        if(!m.used && e.hp/e.maxHp <= m.at && e.hp>0){
          m.used = true; B.momentsUsed++;
          addLog(`—— 战局胶着，<b>关键时刻</b>（敌血 ${Math.round(e.hp/e.maxHp*100)}%）已至 ——`,'lg-sys');
          UI.updateBattle(B);
          const choice = await UI.battleMoment(B);
          if(choice.act==='flee'){ B.fled=true; return true; }
          if(choice.act==='cast'){ await castSkill(choice.id); }
          if(choice.act==='burn'){ await burnGodhood(choice.id); }
          if(choice.act==='aid'){
            const m=UI.mission?UI.mission():null;
            await castAid(m?m.god:(B.aidGod||'yan_luo'));
          }
          /* 凝神接战：据敌意图做守势，减伤或反制 */
          if(choice.act==='wait'){
            addLog(`你凝神静气，见招拆招。`,'lg-sys');
            if(e.intentNext==='qiang' || e.intent==='qiang'){ p._guard = 0.5; addLog('（你摆出守势，下回合承伤减半）','lg-sys'); }
            else if(e.intentNext==='xu'){ addLog('（你蓄势待发，只等它蓄力破绽）','lg-sys'); }
            else { p._guard = 0.7; }
          }
        }
      }
      return false;
    };

    /* ============ 开打 ============ */
    addLog(`你截住了「${e.name}」。${ctx.intro||''}`,'');
    UI.renderBattle(B);
    await sleep(500);

    while(e.hp>0 && p.hp>0 && !B.fled){
      B.round++;
      /* 玩家每回合回蓝（含共鸣耗神减免） */
      p.mp = Math.min(p.maxMp, p.mp + Math.round(p.maxMp*0.15));
      /* 冷却递减 */
      Object.keys(p.cooldowns).forEach(k=>{ if(p.cooldowns[k]>0) p.cooldowns[k]--; });

      /* 灼烧结算（敌方） */
      if(e.burn>0){
        const d=e.burnDmg; e.hp=Math.max(0,e.hp-d); e.burn--;
        addLog(`火毒发作，「${e.name}」损失 ${d} 点生命。`,'lg-bad');
        UI.floatFoe(`-${d}`,'#d2571c');
        await sleep(200);
        if(e.hp<=0) break;
      }
      if(e.vulnTurns>0) e.vulnTurns--;
      if(e.stun>0){ /* 震骇标记在敌人行动时处理 */ }

      /* 鬼差先制（第一回合） */
      if(B.round===1 && hasGuardsFirst){
        const dmg=Math.max(1,Math.round(p.atk*0.5*rnd(0.9,1.1)));
        e.hp=Math.max(0,e.hp-dmg);
        addLog(`鬼差自阴影中先制偷袭，造成 ${dmg} 点伤害！`,'lg-sys');
        UI.floatFoe(`-${dmg}`,'#5c5347');
        await sleep(250);
      }

      /* 玩家行动：普攻 + 守势减伤标记 */
      p._guard = 1;
      await playerStrike(1, null);
      if(e.hp<=0) break;

      /* 关键时刻（玩家一击后） */
      if(await tryMoment()) break;
      if(e.hp<=0) break;

      /* 敌方行动 */
      await enemyAct();
      /* 守势减伤 */
      /* (已在 enemyAct 内按意图处理；p._guard 用于关键时刻的额外减伤) */
      if(p.hp<=0){
        /* 免死被动：首次致命伤回血 */
        const sv = p.saves.find(x=>!x.used);
        if(sv){
          sv.used=true;
          const heal=Math.round(p.maxHp*(sv.heal||0.15));
          p.hp=heal;
          addLog(`—— 神格「${GODHOODS[sv.gh]?.name||'守护'}」灵光乍现，你从鬼门关前退回一步（回复 ${heal} 生命）——`,'lg-sys');
          UI.floatPlayer(`+${heal}`,'#477a5a');
          await sleep(300);
        }else{
          break;
        }
      }
      if(await tryMoment()) break;

      UI.updateBattle(B);
      await sleep(650);
    }

    /* ============ 结算 ============ */
    B.finished = true;
    if(B.fled){
      addLog('你祭出遁光，抽身而退。工单……只能听天由命了。','lg-bad');
      UI.updateBattle(B); await sleep(400);
      s.hp = p.hp; Game.save();
      return 'flee';
    }
    if(e.hp<=0){
      addLog(`「${e.name}」溃散成一地${e.deathFx}。`,'lg-good');
      UI.killFoe();
      UI.updateBattle(B); await sleep(500);
      s.hp = p.hp; Game.save();
      return 'win';
    }
    /* 玩家倒下 */
    B.playerDown = true;
    p.hp = 0;
    addLog('你的神躯重重坠地，眼前一黑……','lg-bad');
    UI.updateBattle(B); await sleep(600);
    s.hp = 0; Game.save();
    return 'dead';
  },
};
