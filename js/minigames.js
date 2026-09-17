/* ================= 天道打工人 · 益智小游戏引擎 =================
   用法：MiniGame.run(type, hostEl, {difficulty:1-3, ...}, onWin)
     type: memory 记忆法坛 | lights 魂灯踏明 | pairs 符牌配对 | spot 辨真识假
   规则：通关必须——失败只可重来本关（卡关门槛），通关回调 onWin(rating)
     rating: 1=完美(满赏) / .6=尚可(半赏)，由节点数据折算战前增益。
   纯 DOM+CSS，零依赖；样式类前缀 mg-。
   ============================================================== */

const MG_EL = (tag, cls, html)=>{ const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };
const MG_SLEEP = ms=>new Promise(r=>setTimeout(r,ms));
/* 让浏览器先完成绘制再挂过渡（如倒计时条），避免起始状态被过渡吞掉 */
function MG_RAF(){ return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))); }

const MiniGame = {
  run(type, host, opts, onWin){
    host.innerHTML='';
    host.appendChild(MG_EL('div','mg-mask'));
    const panel=MG_EL('div','mg-panel');
    host.appendChild(panel);
    this._engines[type](panel, Object.assign({difficulty:2}, opts||{}), (rating)=>{
      panel.classList.add('mg-done');
      setTimeout(()=>onWin(rating), 420);
    });
  },

  _engines:{

    /* ---------- 记忆法坛：看符序、复符序，三轮渐长 ---------- */
    memory(panel,o,win){
      const RUNES=['☰','☱','☲','☳','☴','☵'];
      const N=Math.min(4+o.difficulty,6);
      const lens=[2+o.difficulty,3+o.difficulty,4+o.difficulty];
      let round=0, seq=[], idx=0, phase='idle', mistakes=0, busy=false;

      panel.appendChild(MG_EL('div','mg-tag','符 · 记 忆 法 坛'));
      const title=MG_EL('div','mg-title','凝神记符');
      const sub=MG_EL('div','mg-sub','法坛符记依序亮起，须照原序逐一复按。三轮符序渐长，错一环则本轮重来。');
      const hud=MG_EL('div','mg-hud');
      const board=MG_EL('div','mg-board mg-board-memory');
      panel.append(title,sub,hud,board);
      const ctrls=MG_EL('div','mg-ctrls'); panel.appendChild(ctrls);

      const btns=[];
      for(let i=0;i<N;i++){
        const b=MG_EL('button','mg-rune',RUNES[i%RUNES.length]);
        b.onclick=()=>press(i,b);
        board.appendChild(b); btns.push(b);
      }
      const flash=async (i,t)=>{ btns[i].classList.add(t||'lit'); await MG_SLEEP(430); btns[i].classList.remove(t||'lit'); await MG_SLEEP(160); };

      function hudText(){ hud.innerHTML=`<span>第 <b>${round+1}</b>/3 轮</span><span>符序 ${lens[round]} 记</span><span>错失 ${mistakes}</span>`; }

      async function startRound(){
        seq=[]; for(let i=0;i<lens[round];i++) seq.push(Math.floor(Math.random()*N));
        idx=0; phase='show'; busy=true; hudText();
        title.textContent='记好符序……';
        btns.forEach(b=>b.disabled=true);
        await MG_SLEEP(500);
        for(const i of seq) await flash(i);
        title.textContent='依序复按符记';
        phase='input'; busy=false;
        btns.forEach(b=>b.disabled=false);
      }

      async function press(i,b){
        if(phase!=='input'||busy) return;
        busy=true;
        if(i===seq[idx]){
          b.classList.add('ok'); setTimeout(()=>b.classList.remove('ok'),260);
          idx++;
          if(idx>=seq.length){
            round++;
            if(round>=3){ phase='done'; title.textContent='法坛三转，符序不差！'; hud.innerHTML='<span class="mg-wintext">阵成</span>'; return win(mistakes?0.6:1); }
            await MG_SLEEP(520); return startRound();
          }
          busy=false;
        }else{
          mistakes++;
          btns.forEach(x=>x.disabled=true);
          b.classList.add('bad'); await MG_SLEEP(380); b.classList.remove('bad');
          title.textContent='符序错乱，凝神重来本环';
          hudText();
          await MG_SLEEP(300); return startRound();
        }
      }

      const start=MG_EL('button','btn btn-primary mg-btn','屏息开坛');
      start.onclick=()=>{ start.remove(); round=0; startRound(); };
      ctrls.appendChild(start);
    },

    /* ---------- 魂灯踏明：点灯联动，全亮则阵成 ---------- */
    lights(panel,o,win){
      const K=[3,5,7][Math.min(o.difficulty,3)-1];
      const S=9;
      let lit=[], moves=0, minMoves=K, won=false;

      panel.appendChild(MG_EL('div','mg-tag','灯 · 魂 灯 踏 明'));
      const title=MG_EL('div','mg-title','点亮九盏魂灯');
      const sub=MG_EL('div','mg-sub','踏一盏灯，此灯与上下左右四盏明暗齐翻。令九灯尽数通明，魂路方开。');
      const hud=MG_EL('div','mg-hud');
      const board=MG_EL('div','mg-board mg-board-lights');
      panel.append(title,sub,hud,board);
      const ctrls=MG_EL('div','mg-ctrls'); panel.appendChild(ctrls);

      const lamps=[];
      const toggle=i=>{ lit[i]=!lit[i]; };
      const render=()=>{ lamps.forEach((b,i)=>b.classList.toggle('on',lit[i])); hud.innerHTML=`<span>已踏 <b>${moves}</b> 步</span><span>乱阵约 ${minMoves} 步可解</span>`; };

      for(let i=0;i<S;i++){
        const b=MG_EL('button','mg-lamp','灯');
        b.onclick=()=>{
          if(won) return;
          const r=Math.floor(i/3), c=i%3;
          toggle(i);
          if(r>0) toggle(i-3); if(r<2) toggle(i+3);
          if(c>0) toggle(i-1); if(c<2) toggle(i+1);
          moves++; render();
          if(lit.every(x=>x)){
            won=true;
            title.textContent='九灯齐明，魂路照开！';
            hud.innerHTML=`<span class="mg-wintext">${moves<=minMoves+2?'步不乱灯，完美成阵':'阵成'}</span>`;
            win(moves<=minMoves+2?1:0.6);
          }
        };
        board.appendChild(b); lamps.push(b);
      }
      const reset=()=>{
        lit=new Array(S).fill(true); moves=0;
        let last=-1;
        for(let n=0;n<K;n++){ let i; do{ i=Math.floor(Math.random()*S); }while(i===last); last=i;
          const r=Math.floor(i/3),c=i%3;
          [i, r>0?i-3:-1, r<2?i+3:-1, c>0?i-1:-1, c<2?i+1:-1].forEach(j=>{ if(j>=0) toggle(j); });
        }
        render();
      };
      const bReset=MG_EL('button','btn btn-ghost mg-btn','重摆灯阵');
      bReset.onclick=reset; ctrls.appendChild(bReset);
      reset();
    },

    /* ---------- 符牌配对：翻牌找对，全配则破 ---------- */
    pairs(panel,o,win){
      const SYM=['雷','火','水','魂','印','符','牒','判'];
      const P=[4,5,6][Math.min(o.difficulty,3)-1];
      let first=-1, lock=false, done=0, flips=0, won=false;

      panel.appendChild(MG_EL('div','mg-tag','牌 · 符 牌 配 对'));
      const title=MG_EL('div','mg-title','翻出同名的符牌');
      const sub=MG_EL('div','mg-sub','案上符牌背置，每翻两张：同名则配对留案，不同则覆回。全案配齐，名籍方清。');
      const hud=MG_EL('div','mg-hud');
      const board=MG_EL('div','mg-board mg-board-pairs');
      panel.append(title,sub,hud,board);

      const deck=[];
      for(let i=0;i<P;i++){ deck.push(SYM[i],SYM[i]); }
      for(let i=deck.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [deck[i],deck[j]]=[deck[j],deck[i]]; }
      const cards=deck.map((sym,pos)=>{
        const c=MG_EL('button','mg-card');
        c.appendChild(MG_EL('span','mg-card-back','符'));
        c.appendChild(MG_EL('span','mg-card-face',sym));
        c.onclick=()=>flip(pos,c);
        board.appendChild(c); return c;
      });
      const refresh=()=>{ hud.innerHTML=`<span>已配 <b>${done}</b>/${P} 对</span><span>翻牌 ${flips} 次</span>`; };

      async function flip(pos,c){
        if(lock||won||c.classList.contains('up')||c.classList.contains('match')) return;
        c.classList.add('up'); flips++; refresh();
        if(first<0){ first=pos; return; }
        const a=first; first=-1;
        if(deck[a]===deck[pos]){
          cards[a].classList.add('match'); c.classList.add('match');
          done++; refresh();
          if(done>=P){
            won=true;
            title.textContent='符牌全配，名籍厘清！';
            const perfect=flips<=P*3;
            hud.innerHTML=`<span class="mg-wintext">${perfect?'一次不差，过目不忘':'案牍已清'}</span>`;
            win(perfect?1:0.6);
          }
        }else{
          lock=true;
          await MG_SLEEP(680);
          cards[a].classList.remove('up'); c.classList.remove('up');
          lock=false;
        }
      }
      refresh();
    },

    /* ---------- 辨真识假：限时点出唯一真件，三轮 ---------- */
    spot(panel,o,win){
      const ROUNDS=[
        {tag:'辨印', hint:'真件——印角有一<b>朱缺</b>', count:4,  time:10000, cls:'diff-notch'},
        {tag:'辨墨', hint:'真件——墨色<b>较深</b>，余者皆淡', count:6,  time:9000,  cls:'diff-ink'},
        {tag:'辨框', hint:'真件——边框为<b>双线</b>', count:9,  time:8500,  cls:'diff-frame'}
      ];
      let round=0, errors=0, timer=null, dead=false;

      panel.appendChild(MG_EL('div','mg-tag','真 · 辨 真 识 假'));
      const title=MG_EL('div','mg-title','满堂符件，点出唯真');
      const sub=MG_EL('div','mg-sub','假件皆出一模，真件只有一处异处。看提示、抢时限，点错或超时即从头再辨。');
      const hud=MG_EL('div','mg-hud');
      const board=MG_EL('div','mg-board mg-board-spot');
      const bar=MG_EL('div','mg-timebar'); const fill=MG_EL('i'); bar.appendChild(fill);
      panel.append(title,sub,hud,board,bar);

      function clearTimer(){ if(timer){ clearInterval(timer); timer=null; } }
      function fail(msg){
        if(dead) return; dead=true; clearTimer();
        title.textContent=msg||'真伪莫辨，再睁法眼';
        board.classList.add('shake');
        setTimeout(()=>board.classList.remove('shake'),420);
        errors++;
        const ov=MG_EL('div','mg-fail','<div>'+title.textContent+'</div>');
        const rb=MG_EL('button','btn btn-primary mg-btn','重新辨认');
        rb.onclick=()=>{ ov.remove(); round=0; loadRound(); };
        ov.appendChild(rb); panel.appendChild(ov);
      }

      async function loadRound(){
        dead=false; clearTimer();
        const cfg=ROUNDS[round];
        hud.innerHTML=`<span>第 <b>${round+1}</b>/3 辨</span><span>${cfg.hint}</span>`;
        title.textContent='满堂符件，点出唯真';
        board.innerHTML='';
        board.className='mg-board mg-board-spot n'+cfg.count;
        await MG_SLEEP(30);
        const realIdx=Math.floor(Math.random()*cfg.count);
        for(let i=0;i<cfg.count;i++){
          const c=MG_EL('button','mg-seal'+(i===realIdx?' real '+cfg.cls:''));
          c.innerHTML='<b>印</b><i></i>';
          c.onclick=()=>{ if(dead) return; if(i===realIdx){ pass(); } else fail('这枚是假的！'); };
          board.appendChild(c);
        }
        const t0=Date.now();
        fill.style.transition='none'; fill.style.width='100%';
        await MG_RAF();
        fill.style.transition=`width ${cfg.time}ms linear`; fill.style.width='0%';
        timer=setInterval(()=>{ if(Date.now()-t0>=cfg.time){ clearTimer(); fail('时限已过，真件混回假中'); } },100);
      }
      function pass(){
        if(dead) return; dead=true; clearTimer(); fill.style.width='0%';
        round++;
        if(round>=3){
          title.textContent='三辨皆中，真伪立判！';
          hud.innerHTML=`<span class="mg-wintext">${errors?'已辨明真伪':'法眼无差，一次不歪'}</span>`;
          win(errors?0.6:1);
        }else{
          loadRound();
        }
      }
      loadRound();
    }
  }
};
