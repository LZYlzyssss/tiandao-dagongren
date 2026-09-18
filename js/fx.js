/* ================= 天道打工人 · 动效引擎 v2 =================
   PixiJS 优先：墨雾粒子层（随章节变色）
   CSS 兜底：浮墨粒子 / 屏震 / 墨溅 / 暴击闪光 / 暗角 / 水墨转场 */

const FX = {
  _particles:[],
  _pixi:null,      // PIXI.Application
  _fog:[],         // 墨雾粒子池
  _palIdx:-1,

  /* ---- 章节调色板（墨雾颜色随章节变化） ---- */
  PALETTES:[
    { name:'青灰', fog:0x6b7f86 },   /* 章1 义庄 */
    { name:'朱暖', fog:0xa8704f },   /* 章2 城隍庙 */
    { name:'电青', fog:0x5a7fa6 },   /* 章3 龙宫雷部 */
    { name:'黛绿', fog:0x6b8f63 },   /* 章4 花果山 */
    { name:'金墨', fog:0xb3954f },   /* 章5 南天门 */
  ],
  setChapter(ch){
    const idx=Math.min(4,Math.max(0,(ch||1)-1));
    if(this._palIdx===idx) return;
    this._palIdx=idx;
    this._retintFog();
  },

  /* ================= Pixi 墨雾引擎 ================= */
  initPixi(){
    try{
      if(typeof PIXI==='undefined') return false;
      const holder=document.getElementById('fxCanvas');
      if(!holder) return false;
      if(this._pixi) return true;
      const app=new PIXI.Application({
        resizeTo:window, backgroundAlpha:0, antialias:true,
        autoDensity:true, resolution:Math.min(2,window.devicePixelRatio||1),
      });
      holder.appendChild(app.view);
      this._pixi=app;

      /* 软墨团纹理（运行时绘制，无需素材） */
      const cv=document.createElement('canvas'); cv.width=cv.height=64;
      const g=cv.getContext('2d');
      const grd=g.createRadialGradient(32,32,2,32,32,30);
      grd.addColorStop(0,'rgba(255,255,255,.55)');
      grd.addColorStop(.6,'rgba(255,255,255,.18)');
      grd.addColorStop(1,'rgba(255,255,255,0)');
      g.fillStyle=grd; g.fillRect(0,0,64,64);
      const tex=PIXI.Texture.from(cv);

      /* 墨雾粒子池：自下而上漂浮，正弦横摆 */
      for(let i=0;i<26;i++){
        const s=new PIXI.Sprite(tex);
        const size=60+Math.random()*140;
        s.width=size; s.height=size*(0.5+Math.random()*0.3);
        s.anchor.set(0.5);
        s.x=Math.random()*app.screen.width;
        s.y=app.screen.height+Math.random()*app.screen.height*0.8;
        s.alpha=0;
        app.stage.addChild(s);
        this._fog.push({ s, vy:-(8+Math.random()*22), sway:Math.random()*Math.PI*2,
          swayAmp:14+Math.random()*26, baseA:.05+Math.random()*.10 });
      }
      app.ticker.add(dt=>this._tickFog(dt/60));
      this._retintFog();
      return true;
    }catch(e){
      console.warn('FX: Pixi 初始化失败，回退 CSS 粒子', e);
      this._pixi=null;
      return false;
    }
  },

  _tickFog(dt){
    const app=this._pixi; if(!app) return;
    const W=app.screen.width, H=app.screen.height;
    this._fog.forEach(f=>{
      f.s.y+=f.vy*dt;
      f.sway+=dt*0.5;
      f.s.x+=Math.sin(f.sway)*f.swayAmp*dt;
      f.s.alpha+=(f.baseA-f.s.alpha)*Math.min(1,dt*2);
      if(f.s.y < -f.s.height){
        f.s.y=H+f.s.height/2;
        f.s.x=Math.random()*W;
        f.s.alpha=0;
      }
    });
  },

  _retintFog(){
    const c=this.PALETTES[Math.max(0,this._palIdx)].fog;
    this._fog.forEach(f=>f.s.tint=c);
  },

  /* ================= 背景层控制 ================= */
  /* 页面氛围底图（office 各页签） */
  setAmbient(key, opacity){
    const el=document.getElementById('ambientBg');
    if(!el) return;
    if(!key){ el.style.opacity=0; el._assetKey=''; return; }
    ASSET.bg(el, key, opacity!=null?opacity:.13);
  },
  /* 情景底图（下凡/战斗/结算） */
  setScene(key, opacity){
    const el=document.getElementById('sceneBg');
    if(!el) return;
    if(!key){ el.style.opacity=0; el._assetKey=''; return; }
    ASSET.bg(el, key, opacity!=null?opacity:.2);
  },
  /* 战场底图（战斗场地内） */
  setBattleBG(key){
    const el=document.getElementById('battleBg');
    if(!el) return;
    ASSET.bg(el, key, .55);
  },

  /* ================= 水墨转场 ================= */
  inkWipe(mid){
    const d=document.createElement('div');
    d.className='ink-wipe';
    document.body.appendChild(d);
    if(mid) setTimeout(mid, 470);
    setTimeout(()=>d.remove(), 1050);
  },

  /* ================= CSS 粒子兜底 ================= */
  spawnInk(){
    const layer=document.getElementById('inkLayer');
    if(!layer) return;
    const dot=document.createElement('div');
    dot.className='ink-dot';
    const size = 4 + Math.random()*14;
    dot.style.width = size+'px';
    dot.style.height = size+'px';
    dot.style.left = Math.random()*100 + '%';
    dot.style.bottom = '-20px';
    dot.style.animationDuration = (5 + Math.random()*8) + 's';
    layer.appendChild(dot);
    setTimeout(()=>dot.remove(), 14000);
  },

  startInk(fallbackOnly){
    if(fallbackOnly){
      /* 每 800ms 生成一颗，最多同时 18 颗 */
      setInterval(()=>{
        const layer=document.getElementById('inkLayer');
        if(layer && layer.children.length < 18){
          this.spawnInk();
        }
      }, 800);
      /* 初始播种 6 颗 */
      for(let i=0;i<6;i++) setTimeout(()=>this.spawnInk(), i*200);
    }else{
      /* Pixi 生效：隐藏 DOM 粒子层避免双重渲染 */
      const layer=document.getElementById('inkLayer');
      if(layer) layer.style.display='none';
    }
  },

  /* ================= 战斗特效 ================= */
  shake(){
    const field=document.getElementById('battleField');
    /* 手机轻震动反馈（安卓支持，iPhone 自动忽略，无害） */
    try{ if(navigator.vibrate) navigator.vibrate(28); }catch(e){}
    if(!field) return;
    field.classList.remove('shake');
    void field.offsetWidth;
    field.classList.add('shake');
    setTimeout(()=>field.classList.remove('shake'), 400);
  },

  /* 墨溅（命中点爆开） */
  splash(side, color){
    const battleField=document.getElementById('battleField');
    const target = side==='foe' ? document.getElementById('figFoe') : document.getElementById('figPlayer');
    if(!battleField || !target) return;
    const sp=document.createElement('div');
    sp.className='ink-splash';
    const c = color || '#2b2620';
    sp.style.background=`radial-gradient(circle, ${c}88 0%, ${c}33 40%, transparent 70%)`;
    sp.style.left=(target.offsetLeft + target.offsetWidth/2 - 40) + 'px';
    sp.style.top=(target.offsetTop + target.offsetHeight/2 - 40) + 'px';
    battleField.appendChild(sp);
    setTimeout(()=>sp.remove(), 500);
  },

  /* 暴击全屏闪光 */
  critFlash(){
    const field=document.getElementById('battleField');
    if(!field) return;
    const f=document.createElement('div');
    f.className='flash-crit';
    field.appendChild(f);
    setTimeout(()=>f.remove(), 250);
  },

  /* 连击墨痕：敌人身上累积墨点（连续命中时叠层） */
  _combo:0,
  comboHit(){
    this._combo++;
    const foe=$('figFoe'); if(!foe) return;
    const mark=document.createElement('i');
    mark.className='combo-mark';
    mark.style.cssText=`position:absolute;left:${20+Math.random()*60}%;top:${15+Math.random()*60}%;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;border-radius:50%;background:radial-gradient(circle,#2b2622,rgba(43,38,32,.3) 60%,transparent);z-index:5;pointer-events:none;opacity:.75;animation:comboFade 2.5s ease-out forwards;`;
    foe.style.position=foe.style.position||'relative';
    foe.appendChild(mark);
    setTimeout(()=>mark.remove(),2500);
    /* 满 5 连击时全屏墨震 */
    if(this._combo>=5){
      this.shake();
      this._combo=0;
    }
  },
  comboReset(){ this._combo=0; },

  /* 血墨溅屏：玩家受击时屏边红墨脉冲 */
  bloodScreen(){
    const field=$('battleField'); if(!field) return;
    const v=document.createElement('div');
    v.className='blood-vignette';
    v.style.cssText='position:absolute;inset:0;z-index:6;pointer-events:none;border-radius:8px;box-shadow:inset 0 0 40px 8px rgba(192,60,46,.45);animation:bloodPulse .8s ease-out forwards;';
    field.appendChild(v);
    setTimeout(()=>v.remove(),800);
  },

  /* 立绘加载完成标记 */
  markAvatarLoad(img){
    if(!img) return;
    if(img.complete && img.naturalWidth>0){
      img.classList.add('loaded');
    }else{
      img.addEventListener('load', ()=>img.classList.add('loaded'));
      img.addEventListener('error', ()=>{ img.style.display='none'; });
    }
  },

  /* 扫描页面所有未标记的立绘 */
  scanAvatars(){
    document.querySelectorAll('.gh-ava img:not(.loaded)').forEach(img=>{
      this.markAvatarLoad(img);
    });
  },
};

/* DOMContentLoaded 后启动：Pixi 优先，CSS 兜底 */
window.addEventListener('DOMContentLoaded', ()=>{
  const pixiOK=FX.initPixi();
  FX.startInk(!pixiOK);
  /* 用 MutationObserver 自动给新生成的立绘/资产图挂加载检测 */
  const obs=new MutationObserver(()=>{
    FX.scanAvatars();
    ASSET.scan();
  });
  obs.observe(document.getElementById('app'), {childList:true, subtree:true});
});
