/* Supabase bridge for the isolated online interface pilot. No IndexedDB writes. */
(() => {
  'use strict';
  const BASE='https://xyuqdpenhnlwnplisxjh.supabase.co';
  const BUCKET='figure-photos';
  let key='',token='',user=null,session=0;
  const photos=new Map(),ids=new Map(),versions=new Map();
  let cache=null,photoRows=[],collectionRows=[];
  const $=id=>document.getElementById(id);
  const message=(s,error=false)=>{
    for(const el of [$('onlineMessage'),$('onlineStatus')])if(el){el.textContent=s;el.style.color=error?'#ffa8a8':'#9ce0b8'}
  };
  function numericId(row,index,kind){
    const legacy=Number(row.legacy_id);
    if(row.legacy_id!=null&&String(legacy)===String(row.legacy_id)&&
      Number.isSafeInteger(legacy)&&legacy>0)return legacy;
    const hex=row.id.replace(/-/g,'').slice(0,12);
    return 1000000000000+parseInt(hex,16);
  }
  async function api(url){
    const response=await fetch(BASE+url,{
      headers:{apikey:key,Authorization:'Bearer '+token},cache:'no-store'});
    if(!response.ok)throw Error('HTTP '+response.status+' em '+url.split('?')[0]);
    return (response.headers.get('content-type')||'').includes('application/json')
      ?response.json():response.blob();
  }
  async function list(table){
    const result=[];
    for(let offset=0;;offset+=500){
      const rows=await api('/rest/v1/'+table+'?select=*&limit=500&offset='+offset);
      if(!Array.isArray(rows))throw Error('Resposta inválida: '+table);
      result.push(...rows);
      if(rows.length<500)return result;
    }
  }
  async function saveSettings(obj){
    if(!user)throw Error('Entre na conta.');
    const found=(await list('user_settings')).find(s=>s.owner_id===user.id);
    const allowed=['dark','hideHomeValues','monthlyGoal','annualGoal','customMakers'];
    const next={...(found?.data||{})};
    for(const name of allowed)if(Object.prototype.hasOwnProperty.call(obj,name))next[name]=obj[name];
    const method=found?'PATCH':'POST';
    const url='/rest/v1/user_settings'+(found?'?owner_id=eq.'+user.id:'');
    const response=await fetch(BASE+url,{method,headers:{apikey:key,Authorization:'Bearer '+token,
      'Content-Type':'application/json',Prefer:'return=representation'},
      body:JSON.stringify(found?{data:next}:{owner_id:user.id,data:next})});
    if(!response.ok)throw Error('Falha ao salvar preferências (HTTP '+response.status+').');
    const result=await response.json();
    if(!Array.isArray(result)||result.length!==1)throw Error('Preferências não confirmadas no servidor.');
    if(cache)cache.settings={...next};
  }
  async function photo(path){
    if(photos.has(path))return photos.get(path);
    const blob=await api('/storage/v1/object/authenticated/'+BUCKET+'/'+path);
    const url=URL.createObjectURL(blob);photos.set(path,url);return url;
  }
  async function mapLimit(items,limit,fn){
    let cursor=0;
    await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{
      while(cursor<items.length){const index=cursor++;await fn(items[index],index)}
    }));
  }
  async function read(){
    if(!user)throw Error('Entre na conta.');
    const current=session;
    message('Lendo a coleção online…');
    const [remoteFigures,remoteCollections,remoteWish,remoteLinks,remotePhotos,remoteSettings]=
      await Promise.all(['figures','collections','wishlist','figure_collections','figure_photos','user_settings'].map(list));
    if(current!==session)throw Error('Sessão alterada durante a leitura.');
    ids.clear();versions.clear();photoRows=remotePhotos;collectionRows=remoteCollections;
    const groupById=new Map(remoteCollections.map((row,i)=>{
      const localId=numericId(row,i,'groups');ids.set('groups:'+localId,row.id);
      return [row.id,{id:localId,name:row.name}]
    }));
    const groups=Array.from(groupById.values());
    const groupNames=new Map();
    for(const link of remoteLinks){
      const g=groupById.get(link.collection_id);
      if(!g)continue;
      if(!groupNames.has(link.figure_id))groupNames.set(link.figure_id,[]);
      groupNames.get(link.figure_id).push(g.name);
    }
    const figures=remoteFigures.map((row,i)=>{
      const localId=numericId(row,i,'figures');ids.set('figures:'+localId,row.id);versions.set(row.id,row.updated_at);
      return {...row.data,id:localId,name:row.name,
        groups:groupNames.get(row.id)||[],cover:'',coverOriginal:'',gallery:[]}
    });
    const figureByUuid=new Map(remoteFigures.map((r,i)=>[r.id,figures[i]]));
    await mapLimit(remotePhotos,5,async(p,index)=>{
      const f=figureByUuid.get(p.figure_id);if(!f)return;
      const src=await photo(p.storage_path);
      if(p.kind==='cover')f.cover=src;
      else if(p.kind==='original')f.coverOriginal=src;
      else if(p.kind==='gallery')f.gallery[p.position]=src;
      message('Carregando fotos: '+(index+1)+' de '+remotePhotos.length);
    });
    for(const f of figures)f.gallery=f.gallery.filter(Boolean);
    const wishlist=remoteWish.map((row,i)=>{
      const localId=numericId(row,i,'wishlist');ids.set('wishlist:'+localId,row.id);versions.set(row.id,row.updated_at);
      return {...row.data,id:localId}
    });
    const settings={...(remoteSettings.find(s=>s.owner_id===user.id)?.data||{})};
    if(current!==session)throw Error('Sessão alterada durante a leitura.');
    message(figures.length+' figuras e '+remotePhotos.length+' fotos carregadas.');
    cache={figures,groups,wishlist,settings};return cache;
  }
  function authHeaders(extra={}){return {apikey:key,Authorization:'Bearer '+token,...extra}}
  async function mutation(table,method,payload,filter=''){
    if(!user||!cache)throw Error('Entre na conta.');
    const r=await fetch(BASE+'/rest/v1/'+table+filter,{method,headers:authHeaders({'Content-Type':'application/json',Prefer:'return=representation'}),body:payload===undefined?undefined:JSON.stringify(payload),cache:'no-store'});
    if(!r.ok){let detail='';try{detail=(await r.json()).message||''}catch{}throw Error('Falha em '+table+' (HTTP '+r.status+(detail?': '+detail:'')+').')}
    const rows=await r.json();if(!Array.isArray(rows))throw Error('Resposta inválida de '+table);return rows;
  }
  function replaceCached(store,obj){const arr=cache[store],at=arr.findIndex(x=>x.id===obj.id);if(at<0)arr.push(obj);else arr.splice(at,1,obj)}
  function dataOnly(obj,exclude){const out={};for(const [k,v] of Object.entries(obj))if(!exclude.includes(k))out[k]=v;return out}
  async function writeWish(obj){
    const uuid=ids.get('wishlist:'+obj.id),data=dataOnly(obj,['id']);let row;
    if(uuid){row=(await mutation('wishlist','PATCH',{data,updated_at:new Date().toISOString()},'?id=eq.'+uuid+'&updated_at=eq.'+encodeURIComponent(versions.get(uuid))))[0];if(!row)throw Error('Wishlist alterada em outro dispositivo. Atualize a página.')}
    else {row=(await mutation('wishlist','POST',{owner_id:user.id,data}))[0];if(!row)throw Error('Não foi possível confirmar o item.');ids.set('wishlist:'+obj.id,row.id)}
    versions.set(row.id,row.updated_at);replaceCached('wishlist',{...obj});
  }
  async function writeGroup(obj){
    const uuid=ids.get('groups:'+obj.id);let row;
    if(uuid){row=(await mutation('collections','PATCH',{name:obj.name},'?id=eq.'+uuid))[0];if(!row)throw Error('Coleção não encontrada. Atualize a página.');}
    else {row=(await mutation('collections','POST',{owner_id:user.id,name:obj.name}))[0];if(!row)throw Error('Coleção não confirmada.');ids.set('groups:'+obj.id,row.id)}
    const at=collectionRows.findIndex(x=>x.id===row.id);if(at<0)collectionRows.push(row);else collectionRows[at]=row;
    replaceCached('groups',{...obj});
  }
  async function storageDelete(path){const r=await fetch(BASE+'/storage/v1/object/'+BUCKET+'/'+path,{method:'DELETE',headers:authHeaders()});if(!r.ok&&r.status!==404)throw Error('Falha ao remover uma foto (HTTP '+r.status+').')}
  async function upload(src,uuid,kind,position){
    const blob=await (await fetch(src)).blob();
    if(!['image/jpeg','image/png','image/webp'].includes(blob.type)||!blob.size||blob.size>10485760)throw Error('Foto inválida ou acima de 10 MB.');
    const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[blob.type];
    const path=user.id+'/'+uuid+'/'+kind+'-'+position+'-'+crypto.randomUUID()+'.'+ext;
    const r=await fetch(BASE+'/storage/v1/object/'+BUCKET+'/'+path,{method:'POST',headers:authHeaders({'Content-Type':blob.type}),body:blob});
    if(!r.ok)throw Error('Falha no envio da foto (HTTP '+r.status+').');
    let current=photoRows.find(p=>p.figure_id===uuid&&p.kind===kind&&p.position===position),row;
    try{
      if(current){row=(await mutation('figure_photos','PATCH',{storage_path:path},'?id=eq.'+current.id))[0]}
      else row=(await mutation('figure_photos','POST',{owner_id:user.id,figure_id:uuid,kind,position,storage_path:path}))[0];
      if(!row)throw Error('Foto não confirmada no banco.');
    }catch(e){await storageDelete(path).catch(()=>{});throw e}
    if(current){const index=photoRows.indexOf(current);photoRows[index]=row;await storageDelete(current.storage_path)}else photoRows.push(row);
    const url=URL.createObjectURL(blob);photos.set(path,url);return url;
  }
  async function savePhotoSlot(src,oldSrc,uuid,kind,position){
    if(!src)return '';
    if(src===oldSrc)return src;
    if(!src.startsWith('data:image/')&&!src.startsWith('blob:'))throw Error('Formato de foto não reconhecido.');
    return upload(src,uuid,kind,position);
  }
  async function syncLinks(uuid,names){
    const desired=new Set(names.map(name=>{const c=collectionRows.find(r=>r.name===name);if(!c)throw Error('Coleção não encontrada: '+name);return c.id}));
    const old=await api('/rest/v1/figure_collections?select=*&figure_id=eq.'+uuid);
    for(const c of old)if(!desired.has(c.collection_id))await mutation('figure_collections','DELETE',undefined,'?figure_id=eq.'+uuid+'&collection_id=eq.'+c.collection_id);
    for(const id of desired)if(!old.some(c=>c.collection_id===id))await mutation('figure_collections','POST',{owner_id:user.id,figure_id:uuid,collection_id:id});
  }
  async function writeFigure(obj){
    const uuid=ids.get('figures:'+obj.id),old=cache.figures.find(f=>f.id===obj.id);
    const data=dataOnly(obj,['id','name','groups','cover','coverOriginal','gallery']);let row;
    if(uuid){row=(await mutation('figures','PATCH',{name:obj.name,data,updated_at:new Date().toISOString()},'?id=eq.'+uuid+'&updated_at=eq.'+encodeURIComponent(versions.get(uuid))))[0];if(!row)throw Error('Figura alterada em outro dispositivo. Atualize antes de editar.');}
    else {row=(await mutation('figures','POST',{owner_id:user.id,name:obj.name,data}))[0];if(!row)throw Error('Figura não confirmada.');ids.set('figures:'+obj.id,row.id)}
    versions.set(row.id,row.updated_at);
    await syncLinks(row.id,obj.groups||[]);
    const next={...obj};
    next.cover=await savePhotoSlot(obj.cover,old?.cover,row.id,'cover',0);
    next.coverOriginal=await savePhotoSlot(obj.coverOriginal,old?.coverOriginal,row.id,'original',0);
    next.gallery=[];
    for(let i=0;i<(obj.gallery||[]).length;i++)next.gallery[i]=await savePhotoSlot(obj.gallery[i],old?.gallery?.[i],row.id,'gallery',i);
    for(const p of [...photoRows])if(p.figure_id===row.id&&p.kind==='gallery'&&p.position>=next.gallery.length){await storageDelete(p.storage_path);await mutation('figure_photos','DELETE',undefined,'?id=eq.'+p.id);photoRows.splice(photoRows.indexOf(p),1)}
    replaceCached('figures',next);
  }
  async function write(store,obj){if(!user)throw Error('Entre na conta.');if(store==='figures')return writeFigure(obj);if(store==='groups')return writeGroup(obj);if(store==='wishlist')return writeWish(obj);throw Error('Operação indisponível.');}
  async function remove(store,id){
    if(!user||!cache)throw Error('Entre na conta.');
    const table={figures:'figures',groups:'collections',wishlist:'wishlist'}[store];if(!table)throw Error('Operação indisponível.');
    const uuid=ids.get(store+':'+id);if(!uuid)throw Error('Registro não encontrado. Atualize a página.');
    if(store==='figures')for(const p of photoRows.filter(x=>x.figure_id===uuid))await storageDelete(p.storage_path);
    const rows=await mutation(table,'DELETE',undefined,'?id=eq.'+uuid);
    if(rows.length!==1)throw Error('Registro alterado em outro dispositivo. Atualize a página.');
    if(store==='figures')photoRows=photoRows.filter(x=>x.figure_id!==uuid);
    if(store==='groups')collectionRows=collectionRows.filter(x=>x.id!==uuid);
    const arr=cache[store],at=arr.findIndex(x=>x.id===id);if(at>=0)arr.splice(at,1);
    ids.delete(store+':'+id);versions.delete(uuid);
  }
  const asDataUrl=blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error||Error('Foto ilegível'));reader.readAsDataURL(blob)});
  async function exportBackup(progress=()=>{}){
    if(!user)throw Error('Entre na conta.');
    const owner=user.id, current=session;
    const [fs,cs,ws,links,ps,ss]=await Promise.all(['figures','collections','wishlist','figure_collections','figure_photos','user_settings'].map(list));
    if(current!==session)throw Error('Sessão alterada.');
    const groups=cs.map((c,i)=>({id:numericId(c,i,'groups'),name:c.name}));
    const groupMap=new Map(cs.map((c,i)=>[c.id,groups[i]]));
    const figs=fs.map((f,i)=>({...f.data,id:numericId(f,i,'figures'),name:f.name,groups:[],cover:'',coverOriginal:'',gallery:[]}));
    const figureMap=new Map(fs.map((f,i)=>[f.id,figs[i]]));
    for(const link of links){const f=figureMap.get(link.figure_id),g=groupMap.get(link.collection_id);if(!f||!g)throw Error('Vínculo incompleto.');if(!f.groups.includes(g.name))f.groups.push(g.name)}
    for(let i=0;i<ps.length;i++){
      if(current!==session)throw Error('Sessão alterada.');
      const p=ps[i],f=figureMap.get(p.figure_id);if(!f)throw Error('Foto sem figura.');
      const blob=await api('/storage/v1/object/authenticated/'+BUCKET+'/'+p.storage_path);
      if(!(blob instanceof Blob)||!blob.size||!['image/jpeg','image/png','image/webp'].includes(blob.type))throw Error('Foto inválida: '+p.storage_path);
      const src=await asDataUrl(blob);
      if(p.kind==='cover')f.cover=src;else if(p.kind==='original')f.coverOriginal=src;else if(p.kind==='gallery')f.gallery[p.position]=src;else throw Error('Tipo de foto inválido.');
      progress('Baixando fotos: '+(i+1)+' de '+ps.length);
    }
    for(const f of figs){if(Array.from({length:f.gallery.length},(_,i)=>!f.gallery[i]).some(Boolean))throw Error('Galeria incompleta.');f.gallery=f.gallery.filter(Boolean)}
    const {migrationFingerprint,migrationStartedAt,migrationCompletedAt,...prefs}=ss.find(x=>x.owner_id===owner)?.data||{};
    const data={format:'curio-backup',formatVersion:1,appVersion:'online-pilot',exportedAt:new Date().toISOString(),figures:figs,wishlist:ws.map((w,i)=>({...w.data,id:numericId(w,i,'wishlist')})),groups,settings:{...prefs,id:'main'}};
    const json=JSON.stringify(data),check=JSON.parse(json);
    if(check.figures.length!==fs.length||check.groups.length!==cs.length||check.wishlist.length!==ws.length)throw Error('Conferência do backup falhou.');
    if(current!==session)throw Error('Sessão alterada.');
    const url=URL.createObjectURL(new Blob([json],{type:'application/json'})),link=document.createElement('a');
    link.href=url;link.download='curio-online-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
    return {figures:fs.length,photos:ps.length};
  }
  async function eraseAccount(progress=()=>{}){
    if(!user)throw Error('Entre na conta.');
    const owner=user.id,current=session;
    const photosToDelete=await list('figure_photos');
    if(current!==session)throw Error('Sessão alterada.');
    async function removeRows(table){
      progress('Apagando '+table+'…');
      const response=await fetch(BASE+'/rest/v1/'+table+'?owner_id=eq.'+encodeURIComponent(owner),{method:'DELETE',headers:{apikey:key,Authorization:'Bearer '+token,Prefer:'return=representation'},cache:'no-store'});
      if(!response.ok)throw Error('Falha em '+table+' (HTTP '+response.status+')');
      if(current!==session)throw Error('Sessão alterada.');
      if((await list(table)).length)throw Error('Restaram registros em '+table);
    }
    // Delete files first so metadata remains available for a safe retry after interruption.
    for(let i=0;i<photosToDelete.length;i++){
      if(current!==session)throw Error('Sessão alterada.');
      const p=photosToDelete[i];progress('Removendo arquivos: '+(i+1)+' de '+photosToDelete.length);
      const r=await fetch(BASE+'/storage/v1/object/'+BUCKET+'/'+p.storage_path,{method:'DELETE',headers:{apikey:key,Authorization:'Bearer '+token}});
      if(!r.ok&&r.status!==404)throw Error('Falha ao remover arquivo '+(i+1)+' (HTTP '+r.status+').');
    }
    // Foreign-key dependents first; verify each table is empty before continuing.
    for(const table of ['figure_collections','figure_photos','figures','collections','wishlist','user_settings'])await removeRows(table);
    for(const url of photos.values())URL.revokeObjectURL(url);photos.clear();
    progress('Limpeza concluída.');
  }
  function lock(){
    document.body.classList.add('online-locked');
    document.body.classList.remove('online-unlocked');
    $('onlineGate').hidden=false;
    $('onlineControls').hidden=true;
  }
  function unlock(){
    document.body.classList.remove('online-locked');
    document.body.classList.add('online-unlocked');
    $('onlineGate').hidden=true;
    $('onlineControls').hidden=false;
  }
  function start(onReady){
    lock();
    try{$('onlineKey').value=localStorage.getItem('curio-supabase-publishable-key')||''}catch{}
    if(!$('onlineKey').value)$('onlineKey').closest('details').open=true;
    $('onlineLogin').onclick=async()=>{
      const button=$('onlineLogin');button.disabled=true;
      try{
        const proposedKey=$('onlineKey').value.trim();
        if(!proposedKey.startsWith('sb_publishable_'))throw Error('Use a chave publicável sb_publishable_…');
        const email=$('onlineEmail').value.trim(),password=$('onlinePassword').value;
        if(!email||!password)throw Error('Preencha e-mail e senha.');
        const response=await fetch(BASE+'/auth/v1/token?grant_type=password',{
          method:'POST',headers:{apikey:proposedKey,'Content-Type':'application/json'},
          body:JSON.stringify({email,password}),cache:'no-store'});
        $('onlinePassword').value='';
        if(!response.ok)throw Error('Login recusado (HTTP '+response.status+').');
        const data=await response.json();
        if(!data.access_token||!data.user?.id)throw Error('Login incompleto.');
        key=proposedKey;token=data.access_token;user=data.user;session++;
        try{localStorage.setItem('curio-supabase-publishable-key',key)}catch{}
        await onReady();
        $('onlineAccount').textContent=user.email||email;
        unlock();
      }catch(e){message(e.message,true)}finally{button.disabled=false}
    };
    $('onlineLogout').onclick=()=>{
      session++;token=key='';user=null;for(const url of photos.values())URL.revokeObjectURL(url);
      photos.clear();lock();message('Sessão encerrada.');
    };
    $('onlineRefresh').onclick=async()=>{
      const button=$('onlineRefresh');button.disabled=true;
      try{await onReady()}catch(e){message('Falha ao atualizar: '+e.message,true)}
      finally{button.disabled=false}
    };
  }
  window.curioRemote={start,read,saveSettings,exportBackup,eraseAccount,account:()=>user&&{id:user.id,email:user.email},
    write,remove};
})();
