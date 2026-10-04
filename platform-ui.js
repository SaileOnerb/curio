(()=>{
 const controls=new Map();let active=null,previousFocus=null;
 const style=document.createElement('style');style.textContent=`
 select[data-curio-select]{display:none!important}.curioSelectButton{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:44px;padding:11px 14px;border:1px solid var(--hair,#444);border-radius:12px;background:var(--surface-2,#2c2c30);color:var(--text,#f5f5f7);font:inherit;text-align:left;cursor:pointer;min-width:0}.curioSelectButton span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.curioSelectButton svg{flex:none;width:16px;height:16px}.curioSelectButton:focus-visible{outline:2px solid var(--accent,#007aff);outline-offset:2px}.curioSelectButton:disabled{opacity:.5;cursor:default}
 #curioSelectModal{z-index:120;background:#0009;backdrop-filter:none}#curioSelectModal .box{width:min(480px,100%);padding:22px;background:var(--surface,#1c1c1f);color:var(--text,#f5f5f7);border:1px solid var(--hair,#444);border-radius:22px;max-height:85dvh;display:flex;flex-direction:column}#curioSelectTitle{font-size:22px;margin:0}#curioSelectSearch{width:100%;min-height:44px;margin:16px 0 12px;border:1px solid var(--hair,#444);background:var(--surface-2,#2c2c30);color:inherit;border-radius:12px;padding:12px}#curioSelectSearch[hidden]{display:none}#curioSelectOptions{overflow:auto;overscroll-behavior:contain;margin-top:14px;min-height:0}#curioSelectOptions button{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:48px;gap:14px;padding:13px 12px;border:0;border-radius:12px;margin:3px 0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}#curioSelectOptions button[aria-selected=true]{background:var(--surface-2,#2c2c30);font-weight:650}#curioSelectOptions button:focus-visible{outline:2px solid var(--accent,#007aff);outline-offset:-2px}#curioSelectOptions button:disabled{opacity:.45}#curioSelectOptions button b{color:var(--accent,#007aff)}#curioSelectEmpty{padding:16px;color:var(--muted,#888)}
 `;document.head.append(style);
 const modal=document.createElement('div');modal.id='curioSelectModal';modal.className='modal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','curioSelectTitle');
 modal.innerHTML='<div class="box"><div class="modalhead"><h2 id="curioSelectTitle">Selecionar opção</h2><button class="close" type="button" aria-label="Fechar">×</button></div><input id="curioSelectSearch" type="search" placeholder="Buscar opção" aria-label="Buscar opção" autocomplete="off" hidden><div id="curioSelectOptions" role="listbox" aria-labelledby="curioSelectTitle"></div></div>';
 document.body.append(modal);
 const search=modal.querySelector('input'),list=modal.querySelector('[role=listbox]');
 function close(){modal.classList.remove('on');active=null;previousFocus?.focus();}
 modal.querySelector('.close').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close();});
 function caption(select){
  if(select.getAttribute('aria-label'))return select.getAttribute('aria-label');
  const names={filterGroup:'Coleção',filterMaker:'Fabricante',sortBy:'Ordenar figuras',fMaker:'Fabricante',fLine:'Linha',fCondition:'Condição'};
  if(names[select.id])return names[select.id];
  const label=select.labels?.[0];if(label){const copy=label.cloneNode(true);copy.querySelectorAll('select,button,input,svg').forEach(x=>x.remove());const text=copy.textContent.trim();if(text)return text;}
  return 'Selecionar opção';
 }
 function refresh(select,button){
  const text=select.selectedOptions[0]?.textContent||'Selecionar';
  if(button.firstElementChild.textContent!==text)button.firstElementChild.textContent=text;
  if(button.disabled!==select.disabled)button.disabled=select.disabled;
  button.setAttribute('aria-label',caption(select)+': '+text);
 }
 function render(){
  list.replaceChildren();if(!active)return;
  const query=search.value.toLocaleLowerCase('pt-BR');
  for(const option of active.options){if(option.hidden||!option.textContent.toLocaleLowerCase('pt-BR').includes(query))continue;
   const b=document.createElement('button');b.type='button';b.setAttribute('role','option');b.setAttribute('aria-selected',String(option.selected));b.disabled=option.disabled||option.parentElement?.disabled===true;
   const text=document.createElement('span');text.textContent=option.textContent;b.append(text);
   if(option.selected){const mark=document.createElement('b');mark.textContent='✓';mark.setAttribute('aria-hidden','true');b.append(mark);}
   b.onclick=()=>{if(!active?.isConnected||active.disabled){close();return;}const select=active;select.value=option.value;select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));refresh(select,controls.get(select));close();};list.append(b);
  }
  if(!list.children.length){const p=document.createElement('p');p.id='curioSelectEmpty';p.textContent='Nenhuma opção encontrada.';list.append(p);}
 }
 search.oninput=render;
 modal.addEventListener('keydown',e=>{
  e.stopPropagation();if(e.key==='Escape'){e.preventDefault();close();return;}
  const options=[...list.querySelectorAll('button:not(:disabled)')];const i=options.indexOf(document.activeElement);
  if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?options.length-1:e.key==='ArrowDown'?Math.min(i+1,options.length-1):Math.max(i-1,0);options[n]?.focus();}
  if(e.key==='Enter'&&e.target===search){e.preventDefault();options[0]?.click();}
  if(e.key==='Tab'){const focusable=[modal.querySelector('.close'),...(!search.hidden?[search]:[]),...options];const j=focusable.indexOf(document.activeElement);if(e.shiftKey&&j<=0){e.preventDefault();focusable.at(-1)?.focus();}else if(!e.shiftKey&&j===focusable.length-1){e.preventDefault();focusable[0]?.focus();}}
 });
 function scan(){
  for(const [select,button] of controls){if(!select.isConnected){button.remove();controls.delete(select);}else refresh(select,button);}
  document.querySelectorAll('select:not([multiple]):not([data-curio-select])').forEach(select=>{
   select.dataset.curioSelect='';const button=document.createElement('button');button.type='button';button.className='curioSelectButton';button.setAttribute('aria-haspopup','dialog');button.innerHTML='<span></span><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 6 5 5 5-5" stroke="currentColor" stroke-width="1.6"/></svg>';select.after(button);controls.set(select,button);refresh(select,button);
   select.addEventListener('change',()=>refresh(select,button));
   button.onclick=()=>{if(select.disabled)return;active=select;previousFocus=button;refresh(select,button);modal.querySelector('h2').textContent=caption(select);search.value='';search.hidden=select.options.length<9;render();modal.classList.add('on');(search.hidden?list.querySelector('[aria-selected=true]:not(:disabled)')||modal.querySelector('.close'):search).focus();};
  });
 }
 let pending=false;const observer=new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;scan();});});
 // Não observar os botões gerados: isso evita um ciclo de atualização visual.
 observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','hidden']});
 scan();
})();
