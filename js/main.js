/* ================= 天道打工人 · 启动 ================= */
window.addEventListener('DOMContentLoaded', ()=>{

  /* 顶栏头像：点开玩家自身立绘卷 */
  document.querySelector('.brand-seal').addEventListener('click', ()=>UI.openPlayerPortrait());

  /* 开场 / 续玩 */
  const hasSave = Game.load();
  if(hasSave){
    Stats.recalc();
    UI.view = Game.s.busy ? 'office' : 'office';
    /* 异常退出时若在执行单中，安全复位（当天工单重刷） */
    if(Game.s.busy){
      Game.s.busy=false;
      Shelf.refresh();
      Game.save();
    }
    /* 已有存档：直接进衙，开场页轻量放行 */
    const intro=$('intro');
    intro.innerHTML=`<div class="paper intro-card">
      <h1 class="title-brush" style="font-size:40px">天道打工人</h1>
      <p class="intro-sub">神衙的灯笼还亮着，就等你回来</p>
      <div style="margin-top:8px;line-height:2.1;font-size:15px">
        现任：<b>${RANKS[Game.s.rank].name}</b> ｜ 第 ${Game.s.month} 月 ${Game.s.day} 日 ｜ 香火钱 ${Game.s.money} 文
      </div>
    </div>`;
    intro.querySelector('.paper').appendChild((()=>{
      const cont=h('button','btn btn-primary btn-lg','回神衙当值');
      cont.onclick=()=>{ intro.classList.add('hidden'); UI.render(); if(typeof Guide!=='undefined') Guide.autoStart(); };
      return cont;
    })());
    intro.querySelector('.paper').appendChild((()=>{
      const nw=h('button','btn btn-ghost btn-lg','撕碎劳务契重开');
      nw.style.marginLeft='12px';
      nw.onclick=()=>{ Game.clear(); Game.newGame(); intro.classList.add('hidden'); UI.view='office'; UI.render(); if(typeof Guide!=='undefined') Guide.begin(); };
      return nw;
    })());
  }

  /* 入职 */
  document.addEventListener('click', e=>{
    const act=e.target.getAttribute && e.target.getAttribute('data-action');
    if(act==='newGame'){
      Game.newGame();
      $('intro').classList.add('hidden');
      UI.view='office';
      UI.render();
      UI.toast('画押已成，从此你就是天庭的人了（外包）');
      if(typeof Guide!=='undefined') Guide.begin();
    }
  });

  /* 防止意外关页丢档：所有关键动作内已即时存档 */
});
