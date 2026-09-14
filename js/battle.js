/* ================= 天道打工人 · 简化战斗引擎 =================
 自动对撞（约 8-12 回合），在敌人 60%/30% 血量时弹出两次关键时刻：
   祭法宝（觉醒技能） / 遁走 / 拼命（透支神格，战后沉睡 3 日）
*/
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const rnd = (a,b)=> a + Math.random()*(b-a);
const clamp = (v,a,b)=> Math.max(a,Math.min(b,v));

const Battle = {
  /** @param {object} node 战斗节点 {enemy,scale}
   *  @param {object} ctx 本单上下文 {atkBuff, shield, enemyAtk, enemyVuln, log[]}
   *  @returns {'win'|'flee'|'dead'} */
  async run(node, ctx){
    const s = Game.s, st = Stats.cur();

    /* ---- 玩家快照 ---- */
    const p = {
      maxHp: st.maxHp, hp: s.hp,
      maxMp: st.maxMp, mp: st.maxMp,
      atk: Math.round(st.atk * (1 + (ctx.atkBuff||0))),
      def: st.def, crit: st.crit, lifesteal: st.lifesteal,
      shield: 0, shieldRounds:0,
      stunProc: st.stunProc, healStart: st.healStart,
    };
    /* 可催动的觉醒神格（含融合） */
    p.skillIds = s.equipped.filter(id=>s.gh[id] && s.gh[id].awakened && s.gh[id].sleep<=0);
    /* 被动来源（拼命后移除） */
    p.passiveGh = s.equipped.filter(id=>s.gh[id] && s.gh[id].awakened && s.gh[id].sleep<=0);

    if(st.healStart){
      const h = Math.round(p.maxHp*st.healStart);
      p.hp = clamp(p.hp+h, 0, p.maxHp);
    }
    if(ctx.shield){
      p.shield += Math.round(p.maxHp*ctx.shield);
    }

    /* ---- 敌方快照 ---- */
    const t = ENEMIES[node.enemy];
    const scale = node.scale || 1;
    const e = {
      id:node.enemy, name:t.name, icon:t.icon, tint:t.tint,
      maxHp: Math.round(t.hp*scale), hp:0,
      atk: Math.round(t.atk*(1+(scale-1)*0.7)*(1+(ctx.enemyAtk||0))),
      def:t.def, crit:t.crit||0, lifesteal:t.lifesteal||0, burnHit:t.burnHit||0,
      burnFx:t.burnFx||'黑焰', hpLabel:t.hpLabel||'气血', deathFx:t.deathFx||'黑烟',
      burn:0, burnDmg:0, stun:0, vulnTurns:0, vulnFixed: ctx.enemyVuln?1.5:1,
    };
    e.hp = e.maxHp;

    /* 士兵 */
    const hasGuardsFirst = s.soldiers.includes('xiaojiang');
    const hasBlock = s.soldiers.includes('duwei');

    const B = {
      p,e, round:0, log:[], momentsUsed:0,
      momentLeft:true, finished:false, waiting:null,
      playerDown:false,
    };

    const addLog = (html, cls)=>{
      B.log.push({html, cls:cls||''});
      if(B.log.length>7) B.log.shift();
    };

    const effCrit = ()=> p.passiveGh.reduce((a,id)=>a+(GODHOODS[id].passive?.crit||0), 0.05);
    const effLife = ()=> p.passiveGh.reduce((a,id)=>a+(GODHOODS[id].passive?.lifesteal||0), 0);

    /* ---- 玩家普攻 ---- */
    const playerStrike = async (mult=1, opts={})=>{
      if(e.stun>0 && !opts.ignoreStunBlock){ /* 敌人被震骇不影响玩家出手 */ }
      const isCrit = Math.random() < effCrit();
      const vulnMul = (e.vulnTurns>0 || e.vulnFixed>1) ? 1.5 : 1;
      let dmg = Math.max(1, Math.round((p.atk*mult*rnd(0.9,1.1) - e.def*0.45) * vulnMul * (isCrit?2:1)));
      e.hp = Math.max(0, e.hp-dmg);
      const life = effLife();
      if(life>0){ const h=Math.round(dmg*life); p.hp=clamp(p.hp+h,0,p.maxHp); }
      if(!opts.silent) addLog(`你出手，${isCrit?'<b>暴击！</b>':''}造成 <b>${dmg}</b> 点伤害${life?`，汲取 ${h} 点生机`:''}`, 'lg-good');
      UI.flash('foe','hit'); UI.floatFoe(`-${dmg}`, isCrit?'#c03c2e':'#5c5347');
      if(isCrit) await sleep(120);
      /* 锁魂链 */
      if(p.stunProc && Math.random()<p.stunProc && e.hp>0){
        e.stun = Math.max(e.stun,1);
        addLog('锁魂链缠上敌魂，它动弹不得！','lg-sys');
      }
    };

    /* ---- 敌人行动 ---- */
    const enemyAct = async ()=>{
      if(e.stun>0){ e.stun--; addLog(`「${e.name}」被震骇，无法行动。`,'lg-sys'); return; }
      const isCrit = Math.random() < e.crit;
      let dmg = Math.max(1, Math.round((e.atk*rnd(0.9,1.1) - p.def*0.45) * (isCrit?2:1)));
      /* 阴兵小将挡刀 */
      if(hasBlock && Math.random()<0.2){
        dmg = Math.round(dmg*0.5);
        addLog('阴兵小将挺枪挡在你身前，替你挡下半数攻势！','lg-sys');
      }
      /* 护盾 */
      if(p.shield>0){
        const ab = Math.min(p.shield,dmg); p.shield-=ab; dmg-=ab;
      }
      p.hp = Math.max(0,p.hp-dmg);
      addLog(`「${e.name}」反击，造成 <b>${dmg}</b> 点伤害${isCrit?'（狠招！）':''}`, 'lg-bad');
      UI.flash('player','hit'); UI.floatPlayer(`-${dmg}`,'#c03c2e');
      /* 敌方特性：吸血 / 灼烧附加 */
      if(e.lifesteal>0 && e.hp>0){ e.hp=clamp(e.hp+Math.round(dmg*e.lifesteal),0,e.maxHp); }
      if(e.burnHit && Math.random()<e.burnHit){
        const fx=Math.round(e.atk*0.4);
        p.hp=Math.max(0,p.hp-fx);
        addLog(`${e.burnFx}溅到你身上，追加 ${fx} 点伤害。`,'lg-bad');
        UI.floatPlayer(`-${fx}`,'#d2571c');
      }
    };

    /* ---- 祭法宝（技能） ---- */
    const castSkill = async (id)=>{
      const g = GODHOODS[id], a = g.active;
      if(p.mp < a.cost) return;
      p.mp -= a.cost;
      UI.flash('player','cast');
      addLog(`你催动神格「${g.name}」——<b>${a.name}</b>！`,'lg-sys');
      await sleep(250);
      const vulnMul = (e.vulnTurns>0 || e.vulnFixed>1) ? 1.5 : 1;
      switch(a.type){
        case 'nuke':{
          const dmg=Math.max(1,Math.round((p.atk*a.mult*rnd(0.95,1.05)-e.def*0.45)*vulnMul));
          e.hp=Math.max(0,e.hp-dmg); UI.floatFoe(`-${dmg}`,'#7a2d8c');
          addLog(`棒影如山，造成 <b>${dmg}</b> 点伤害。`,'lg-good'); break;
        }
        case 'nukeStun':{
          const dmg=Math.max(1,Math.round((p.atk*a.mult*rnd(0.95,1.05)-e.def*0.45)*vulnMul));
          e.hp=Math.max(0,e.hp-dmg); e.stun=Math.max(e.stun,1); UI.floatFoe(`-${dmg}`,'#7a2d8c');
          addLog(`天翻地覆，造成 <b>${dmg}</b> 点伤害，敌人被震骇！`,'lg-good'); break;
        }
        case 'vuln':{
          const dmg=Math.max(1,Math.round((p.atk*a.mult-e.def*0.45)));
          e.hp=Math.max(0,e.hp-dmg); e.vulnTurns=a.vuln; UI.floatFoe(`-${dmg}`,'#c9962f');
          addLog(`破绽毕露，造成 ${dmg} 点伤害，敌人 ${a.vuln} 回合内承伤+50%。`,'lg-good'); break;
        }
        case 'nukeHeal':{
          const dmg=Math.max(1,Math.round((p.atk*a.mult*rnd(0.95,1.05)-e.def*0.45)*vulnMul));
          const h=Math.round(p.maxHp*a.heal);
          e.hp=Math.max(0,e.hp-dmg); p.hp=clamp(p.hp+h,0,p.maxHp);
          UI.floatFoe(`-${dmg}`,'#2e6f8e'); UI.floatPlayer(`+${h}`,'#477a5a');
          addLog(`圣光贯体，造成 <b>${dmg}</b> 点伤害，回复 ${h} 点生命。`,'lg-good'); break;
        }
        case 'shield':{
          const sh=Math.round(p.maxHp*a.shield); p.shield+=sh;
          UI.floatPlayer(`护盾+${sh}`,'#2e6f8e');
          addLog(`光盾张开，获得 ${sh} 点护盾（${a.rounds} 回合）。`,'lg-sys');
          p.shieldRounds=a.rounds; break;
        }
        case 'burn':{
          const dmg=Math.max(1,Math.round(p.atk*a.mult*rnd(0.9,1.1)-e.def*0.45));
          e.hp=Math.max(0,e.hp-dmg);
          e.burn=a.burnRounds; e.burnDmg=Math.round(p.atk*a.burnPct);
          UI.floatFoe(`-${dmg}`,'#d2571c');
          addLog(`风火缠身，造成 ${dmg} 点伤害并点燃敌人（每回合 ${e.burnDmg}）。`,'lg-good'); break;
        }
        case 'percentStun':{
          const dmg=Math.round(e.maxHp*a.pct);
          e.hp=Math.max(0,e.hp-dmg); e.stun=Math.max(e.stun,1);
          UI.floatFoe(`-${dmg}`,'#7a5a8c');
          addLog(`朱笔落魂，造成 <b>${dmg}</b> 点真实伤害并震骇敌人。`,'lg-good'); break;
        }
        case 'percentHeal':{
          const dmg=Math.round(e.maxHp*a.pct);
          const h=Math.round(p.maxHp*a.heal);
          e.hp=Math.max(0,e.hp-dmg); p.hp=clamp(p.hp+h,0,p.maxHp);
          UI.floatFoe(`-${dmg}`,'#7a5a8c'); UI.floatPlayer(`+${h}`,'#477a5a');
          addLog(`终审已下，造成 <b>${dmg}</b> 点真实伤害，回复 ${h} 点生命。`,'lg-good'); break;
        }
      }
      await sleep(300);
    };

    /* ---- 拼命 ---- */
    const burnGodhood = async (id)=>{
      const g = GODHOODS[id];
      UI.flash('player','cast');
      const dmg=Math.max(1,Math.round(p.atk*3.2*rnd(1.0,1.15)));
      e.hp=Math.max(0,e.hp-dmg);
      UI.floatFoe(`-${dmg}`,'#c03c2e');
      addLog(`你强行透支「${g.name}」，倾尽全力一击——<b>${dmg}</b> 点伤害！神格随即黯淡。`,'lg-bad');
      s.gh[id].sleep = 3;
      p.passiveGh = p.passiveGh.filter(x=>x!==id);
      p.skillIds = p.skillIds.filter(x=>x!==id);
      await sleep(300);
    };

    /* ---- 关键时刻 ---- */
    const moments = [ {at:0.6,used:false}, {at:0.3,used:false} ];
    const tryMoment = async ()=>{
      for(const m of moments){
        if(!m.used && e.hp/e.maxHp <= m.at && e.hp>0){
          m.used = true;
          addLog('—— 战局胶着，<b>关键时刻</b>已至 ——','lg-sys');
          UI.updateBattle(B);
          const choice = await UI.battleMoment(B);
          if(choice.act==='flee'){ B.fled=true; return true; }
          if(choice.act==='cast'){ await castSkill(choice.id); }
          if(choice.act==='burn'){ await burnGodhood(choice.id); }
          if(p.shieldRounds>0){ /* 护盾计时在回合末处理 */ }
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
      /* 灼烧结算 */
      if(e.burn>0){
        const d=e.burnDmg; e.hp=Math.max(0,e.hp-d); e.burn--;
        addLog(`火毒发作，「${e.name}」损失 ${d} 点生命。`,'lg-bad');
        UI.floatFoe(`-${d}`,'#d2571c');
        await sleep(200);
        if(e.hp<=0) break;
      }
      if(e.vulnTurns>0) e.vulnTurns--;
      if(p.shieldRounds>0){ p.shieldRounds--; if(p.shieldRounds<=0) p.shield=0; }
      if(e.stun>0){ /* 标记当回合 */ }

      /* 鬼差先制 */
      if(B.round===1 && hasGuardsFirst){
        const dmg=Math.max(1,Math.round(p.atk*0.5*rnd(0.9,1.1)));
        e.hp=Math.max(0,e.hp-dmg);
        addLog(`鬼差自阴影中先制偷袭，造成 ${dmg} 点伤害！`,'lg-sys');
        UI.floatFoe(`-${dmg}`,'#5c5347');
        await sleep(250);
      }

      /* 玩家行动 */
      await playerStrike();
      if(e.hp<=0) break;

      /* 关键时刻（玩家一击后） */
      if(await tryMoment()) break;
      if(e.hp<=0) break;

      /* 敌方行动 */
      await enemyAct();
      if(p.hp<=0) break;
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
