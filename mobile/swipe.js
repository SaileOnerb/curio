// Move as telas existentes: sem copiar cards ou reconstruir a coleção.
export function installNativeSwipe(){
 const area=document.querySelector('.main'),tabs=['home','collection','wishlist','finance','settings'];
 if(!area)return;
 let drag=null,busy=false;
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 const blocked=()=>document.querySelector('.modal.on,#photoLightbox.on,#bulkBar.on,#curioDialog:not([hidden]),#curioTour:not([hidden])');
 const setX=(panel,x)=>{panel.style.transform=`translate3d(${x}px,0,0)`;};
 function cleanup(s,commit){
  cancelAnimationFrame(s.frame);
  for(const p of s.panels){p.marker.replaceWith(p.view);p.view.style.cssText=p.style;p.wrapper.remove();}
  area.style.minHeight=s.height;
  if(commit){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===s.next));
   document.querySelectorAll('.nav[data-v],.mnav[data-mv]').forEach(b=>b.classList.toggle('on',(b.dataset.v||b.dataset.mv)===s.next));
   window.scrollTo({top:0,behavior:'instant'});
  }
  // Impede que a animação CSS antiga recomece após o gesto.
  for(const p of s.panels){p.view.style.animation='none';}
  busy=false;window.curioObserveCovers?.();
 }
 function mount(s,dir){
  const i=tabs.indexOf(s.view.id),next=tabs[i+dir];if(!next)return false;
  s.next=next;s.dir=dir;s.width=innerWidth;s.height=area.style.minHeight;
  const originalRect=s.view.getBoundingClientRect(),incoming=document.getElementById(next);
  const padding=parseFloat(getComputedStyle(area).paddingTop)||0;
  area.style.minHeight=`${Math.max(area.scrollHeight,scrollY+innerHeight)}px`;
  s.panels=[s.view,incoming].map((view,index)=>{
   const marker=document.createComment('curio-swipe'),style=view.style.cssText;
   view.before(marker);
   const wrapper=document.createElement('div');
   wrapper.style.cssText='position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:10;background:var(--bg);contain:paint;will-change:transform;';
   area.append(wrapper);wrapper.append(view);
   view.style.cssText+=`;display:block;animation:none!important;transition:none!important;position:absolute;left:${originalRect.left}px;top:${index?padding:originalRect.top}px;width:${originalRect.width}px;margin:0;`;
   return {view,marker,style,wrapper};
  });
  busy=true;draw(s);return true;
 }
 function draw(s){
  const x=Math.max(-s.width,Math.min(s.width,s.dx));
  setX(s.panels[0].wrapper,x);setX(s.panels[1].wrapper,s.dir*s.width+x);
 }
 function finish(s,commit){
  cancelAnimationFrame(s.frame);
  const x=Math.max(-s.width,Math.min(s.width,s.dx));
  const end=commit?-s.dir*s.width:0;
  const duration=reduced()?0:Math.max(150,Math.min(280,220*Math.abs(end-x)/s.width));
  const animations=s.panels.map((p,i)=>p.wrapper.animate([
   {transform:`translate3d(${i?s.dir*s.width+x:x}px,0,0)`},
   {transform:`translate3d(${i?s.dir*s.width+end:end}px,0,0)`}
  ],{duration,easing:'cubic-bezier(.2,.75,.25,1)',fill:'forwards'}));
  Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>cleanup(s,commit));
 }
 area.addEventListener('touchstart',e=>{
  if(!matchMedia('(max-width:700px)').matches||busy||e.touches.length!==1||blocked()||!document.body.classList.contains('online-unlocked'))return;
  if(e.target.closest('button,a,input,select,textarea,[contenteditable],.toolbar,.gallery,.choiceGrid,.bulkBar,.formactions'))return;
  for(let el=e.target;el&&el!==area;el=el.parentElement){if(el.scrollWidth>el.clientWidth+8&&['auto','scroll'].includes(getComputedStyle(el).overflowX))return;}
  const t=e.touches[0];if(t.clientX<25||t.clientX>innerWidth-25)return;
  drag={x:t.clientX,y:t.clientY,time:performance.now(),dx:0,view:area.querySelector('.view.on'),panels:null,frame:0};
 },{passive:true});
 area.addEventListener('touchmove',e=>{
  const s=drag;if(!s)return;
  if(e.touches.length!==1){drag=null;if(s.panels)finish(s,false);return;}
  const t=e.touches[0],dx=t.clientX-s.x,dy=t.clientY-s.y;s.dx=dx;
  if(!s.panels){
   if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){drag=null;return;}
   if(Math.abs(dx)<12||Math.abs(dx)<Math.abs(dy)*1.4)return;
   if(!s.view||!mount(s,dx<0?1:-1)){drag=null;return;}
  }
  if(e.cancelable)e.preventDefault();
  if(!s.frame)s.frame=requestAnimationFrame(()=>{s.frame=0;draw(s);});
 },{passive:false});
 area.addEventListener('touchend',e=>{
  const s=drag;drag=null;if(!s?.panels)return;
  if(e.changedTouches.length!==1||blocked()){finish(s,false);return;}
  s.dx=e.changedTouches[0].clientX-s.x;
  const toward=-s.dir*s.dx,elapsed=performance.now()-s.time;
  finish(s,toward>=s.width*.22||(toward>=45&&elapsed<250));
 },{passive:true});
 area.addEventListener('touchcancel',()=>{const s=drag;drag=null;if(s?.panels)finish(s,false);},{passive:true});
 // Navegar por botões não precisa animar toda uma coleção longa.
 const css=document.createElement('style');css.textContent='@media(max-width:700px){.view.on{animation:none!important}.curio-native .mobile-nav{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:var(--surface)}}';document.head.append(css);
}
