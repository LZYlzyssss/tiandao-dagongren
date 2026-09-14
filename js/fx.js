/* ================= 天道打工人 · 动效引擎 ================= */

const FX = {
  _particles:[],

  /* 背景浮墨粒子 —— 定时生成，自动消失 */
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

  startInk(){
    /* 每 800ms 生成一颗，最多同时 18 颗 */
    setInterval(()=>{
      const layer=document.getElementById('inkLayer');
      if(layer && layer.children.length < 18){
        this.spawnInk();
      }
    }, 800);
    /* 初始播种 6 颗 */
    for(let i=0;i<6;i++) setTimeout(()=>this.spawnInk(), i*200);
  },

  /* 战斗屏震 */
  shake(){
    const field=document.getElementById('battleField');
    if(!field) return;
    field.classList.remove('shake');
    void field.offsetWidth;
    field.classList.add('shake');
    setTimeout(()=>field.classList.remove('shake'), 400);
  },

  /* 墨溅（命中点爆开） */
  splash(side, color){
    const battleField=document.getElementById('battleField');
    const fig=document.getElementById('side'==='foe'?'figFoe':'figPlayer');
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

/* DOMContentLoaded 后启动粒子 */
window.addEventListener('DOMContentLoaded', ()=>{
  FX.startInk();
  /* 用 MutationObserver 自动给新生成的立绘挂加载检测 */
  const obs=new MutationObserver(()=>{
    FX.scanAvatars();
  });
  obs.observe(document.getElementById('app'), {childList:true, subtree:true});
});
