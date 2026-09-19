/* ================= 天道打工人 · 程序化音效（Web Audio 合成，零音频文件） =================
   所有声音实时合成：木鱼点击、鼓/锣登场、兵刃破风、命中、受击、法术、神援、
   胜利/失败、赏钱、落印等。音色偏水墨国风（五声音阶、革鼓、铜锣）。
   - AudioContext 必须在用户首次手势后创建/恢复（浏览器自动播放策略）
   - 全局按钮 pointerdown 统一给轻"点按"声，业务事件各自 play(name)
   - 高频声音按名节流，避免机关枪；开关存 localStorage（全局，不分存档）
   调用：SFX.play('hit') / SFX.swing() / SFX.toggle() */
(function(){
'use strict';
const KEY='tiandao_sfx';
/* 同名音效最短触发间隔（ms），防连发刺耳 */
const GAP={tap:40,swing:70,hit:70,hurt:90,heal:200,shield:200,reward:120,pop:120};

const SFX={
  ctx:null, master:null,
  on:true,
  _last:{},
  _nb:null,

  init(){
    try{ this.on=localStorage.getItem(KEY)!=='0'; }catch(e){ this.on=true; }
    /* 首次手势解锁音频（pointerdown 为主，mousedown/keydown 兜底老式 WebView） */
    const unlock=()=>this.unlock();
    window.addEventListener('pointerdown',unlock,{passive:true});
    window.addEventListener('mousedown',unlock,{passive:true});
    window.addEventListener('keydown',unlock);
    /* 全局轻点音：只对可交互控件出声，捕获阶段早于业务回调 */
    window.addEventListener('pointerdown',e=>{
      if(!this.on) return;
      const t=e.target && e.target.closest && e.target.closest(
        'button, .tab, .roster-chip, .em-quick, .em-debut, .cover-enter, '+
        '.yg-item, .codex-entry, .slot-card, .login-back, .pwa-x, .gc-skip, '+
        '[role="button"], .rotate-tip button, .mg-key, .mg-tile');
      if(!t || t.disabled || t.getAttribute('aria-disabled')==='true') return;
      this.play('tap');
    },{passive:true,capture:true});
  },

  /* 手势内创建/恢复上下文；失败静默（老 WebView 无 AudioContext 时整个音效系统不阻塞游戏） */
  unlock(){
    if(!this.ctx){
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC) return;
      try{
        this.ctx=new AC();
        this.master=this.ctx.createGain();
        this.master.gain.value=0.85;
        this.master.connect(this.ctx.destination);
      }catch(e){ this.ctx=null; return; }
    }
    if(this.ctx.state==='suspended') this.ctx.resume().catch(()=>{});
  },

  /* 开关：返回开启与否 */
  toggle(){
    this.on=!this.on;
    try{ localStorage.setItem(KEY,this.on?'1':'0'); }catch(e){}
    if(this.on){ this.unlock(); this.play('pop'); }
    return this.on;
  },

  /* 主入口：按名播放，带节流 */
  play(name){
    if(!this.on || !this.ctx || this.ctx.state!=='running') return;
    const now=performance.now();
    if(now-(this._last[name]||0) < (GAP[name]||0)) return;
    this._last[name]=now;
    const fn=this['s_'+name];
    if(fn){ try{ fn.call(this); }catch(e){} }
  },

  /* ---------- 原语：单音（频率可滑动） ---------- */
  tone(o){
    const ctx=this.ctx, t0=ctx.currentTime+(o.when||0);
    const osc=ctx.createOscillator(), g=ctx.createGain();
    osc.type=o.type||'sine';
    osc.frequency.setValueAtTime(o.freq,t0);
    if(o.freq2) osc.frequency.exponentialRampToValueAtTime(Math.max(1,o.freq2),t0+o.dur);
    const peak=o.vol!=null?o.vol:0.2;
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(peak,t0+(o.attack||0.006));
    g.gain.exponentialRampToValueAtTime(0.0001,t0+o.dur);
    if(o.detune) osc.detune.setValueAtTime(o.detune,t0);
    osc.connect(g); g.connect(this.master);
    osc.start(t0); osc.stop(t0+o.dur+0.03);
  },

  /* ---------- 原语：噪声（破风/鼓皮/锣钹），1 秒缓冲复用 ---------- */
  _noiseBuffer(){
    if(this._nb) return this._nb;
    const ctx=this.ctx, len=ctx.sampleRate;
    const buf=ctx.createBuffer(1,len,ctx.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
    return this._nb=buf;
  },
  noise(o){
    const ctx=this.ctx, t0=ctx.currentTime+(o.when||0);
    const src=ctx.createBufferSource(); src.buffer=this._noiseBuffer();
    src.loop=true;
    const f=ctx.createBiquadFilter();
    f.type=o.ftype||'bandpass';
    f.Q.value=o.q||1;
    f.frequency.setValueAtTime(o.f0||800,t0);
    if(o.f1) f.frequency.exponentialRampToValueAtTime(Math.max(20,o.f1),t0+o.dur);
    const g=ctx.createGain();
    const peak=o.vol!=null?o.vol:0.2;
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(peak,t0+(o.attack||0.005));
    g.gain.exponentialRampToValueAtTime(0.0001,t0+o.dur);
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start(t0); src.stop(t0+o.dur+0.03);
  },

  /* ================= 音效库 ================= */

  /* 点按：轻木鱼 */
  s_tap(){
    this.tone({freq:620,freq2:500,type:'triangle',dur:0.07,vol:0.12});
    this.noise({f0:3200,ftype:'highpass',dur:0.03,vol:0.04});
  },

  /* 杂兵登场：阴风一卷 + 沉鼓 */
  s_debutMin(){
    this.noise({f0:520,f1:130,ftype:'lowpass',dur:0.34,vol:0.22});
    this.tone({freq:150,freq2:55,type:'sine',dur:0.30,vol:0.32,when:0.02});
  },

  /* Boss 登场：铜锣压场（基音 + 非谐波分音 + 钹片噪响） */
  s_debutBoss(){
    this.noise({f0:4200,f1:1300,ftype:'highpass',dur:0.28,vol:0.16});
    [[98,0.40,1.20],[235,0.16,0.80],[372,0.09,0.60],[548,0.06,0.50]]
      .forEach(p=>this.tone({freq:p[0],type:'sine',dur:p[2],vol:p[1]}));
  },

  /* 兵刃破风 */
  s_swing(){
    this.noise({f0:760,f1:180,ftype:'bandpass',q:1.3,dur:0.16,vol:0.16});
  },
  /* 命中：闷响 + 短革鼓 */
  s_hit(){
    this.noise({f0:2600,f1:420,ftype:'lowpass',dur:0.12,vol:0.28});
    this.tone({freq:175,freq2:72,type:'sine',dur:0.13,vol:0.28});
  },
  /* 暴击：命中 + 亮刃嗡鸣 */
  s_crit(){
    this.noise({f0:3400,f1:600,ftype:'lowpass',dur:0.16,vol:0.34});
    this.tone({freq:190,freq2:66,type:'sine',dur:0.16,vol:0.32});
    this.tone({freq:1568,type:'triangle',dur:0.22,vol:0.13,when:0.01});
  },
  /* 玩家受击：钝击 + 一声下滑闷哼 */
  s_hurt(){
    this.noise({f0:900,f1:200,ftype:'lowpass',dur:0.22,vol:0.28});
    this.tone({freq:205,freq2:72,type:'sawtooth',dur:0.26,vol:0.12});
  },
  /* 敌方蓄力：阴气上扬 */
  s_charge(){
    this.tone({freq:220,freq2:446,type:'sine',dur:0.40,vol:0.10});
    this.noise({f0:300,f1:900,ftype:'bandpass',q:2,dur:0.40,vol:0.06});
  },
  /* 守势/护盾：清光一卷 */
  s_shield(){
    this.noise({f0:2000,f1:5200,ftype:'highpass',dur:0.30,vol:0.08});
    this.tone({freq:659,freq2:988,type:'sine',dur:0.34,vol:0.07});
  },
  /* 法术：五声音阶上挑两点 + 高频灵气 */
  s_cast(){
    this.tone({freq:659,type:'sine',dur:0.12,vol:0.13});
    this.tone({freq:880,type:'sine',dur:0.22,vol:0.13,when:0.07});
    this.tone({freq:1319,type:'triangle',dur:0.26,vol:0.05,when:0.13});
  },
  /* 拼命：低喝重击（在 crit 之外再压一层） */
  s_burn(){
    this.tone({freq:160,freq2:60,type:'sawtooth',dur:0.30,vol:0.18});
    this.noise({f0:500,f1:120,ftype:'lowpass',dur:0.24,vol:0.22});
  },
  /* 疗伤：温润上行 */
  s_heal(){
    this.tone({freq:523,type:'sine',dur:0.18,vol:0.10});
    this.tone({freq:784,type:'sine',dur:0.30,vol:0.10,when:0.09});
  },
  /* 神明支援：宫角徵上拨 + 高八度落定，金光降临感 */
  s_aid(){
    [[523,0,0.34],[659,0.09,0.34],[784,0.18,0.34],[1047,0.28,0.55]]
      .forEach(n=>this.tone({freq:n[0],type:'triangle',dur:n[2],vol:0.13,when:n[1]}));
  },
  /* 遁走：坠风 */
  s_flee(){
    this.noise({f0:820,f1:110,ftype:'bandpass',q:1.2,dur:0.36,vol:0.18});
    this.tone({freq:400,freq2:120,type:'sine',dur:0.30,vol:0.12});
  },
  /* 胜利：五声音阶拨帘 + 一锤定音 */
  s_win(){
    [[523,0,0.30],[659,0.11,0.30],[784,0.22,0.30],[1047,0.34,0.55]]
      .forEach(n=>this.tone({freq:n[0],type:'triangle',dur:n[2],vol:0.14,when:n[1]}));
    this.tone({freq:131,freq2:98,type:'sine',dur:0.60,vol:0.22,when:0.36});
  },
  /* 败北：小三度下行，气坠 */
  s_dead(){
    this.tone({freq:392,type:'sine',dur:0.26,vol:0.16});
    this.tone({freq:311,type:'sine',dur:0.32,vol:0.15,when:0.16});
    this.tone({freq:233,type:'sine',dur:0.60,vol:0.18,when:0.34});
  },
  /* 赏钱落袋：两星铜音 */
  s_reward(){
    this.tone({freq:988,type:'sine',dur:0.09,vol:0.10});
    this.tone({freq:1319,type:'triangle',dur:0.26,vol:0.10,when:0.07});
  },
  /* 弹窗轻响 */
  s_pop(){
    this.tone({freq:520,freq2:660,type:'sine',dur:0.08,vol:0.07});
  },
  /* 敕封落印：朱印砸案——闷雷 + 锣尾 */
  s_stamp(){
    this.noise({f0:600,f1:150,ftype:'lowpass',dur:0.18,vol:0.32});
    this.tone({freq:110,freq2:58,type:'sine',dur:0.42,vol:0.34});
    this.tone({freq:330,type:'sine',dur:0.50,vol:0.07,when:0.01});
  },
};

SFX.init();
window.SFX=SFX;
})();
