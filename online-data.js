/* Supabase bridge for the isolated online interface pilot. No IndexedDB writes. */
(() => {
  'use strict';
  const BASE='https://xyuqdpenhnlwnplisxjh.supabase.co';
  const BUCKET='figure-photos';
  let key='',token='',user=null,session=0;
  const photos=new Map(),ids=new Map(),versions=new Map();
  let cache=null,photoRows=[],collectionRows=[],pendingImport=null,importing=false;
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
    const allowed=['dark','hideHomeValues','monthlyGoal','annualGoal','customMakers','profileName','profileAvatar'];
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
    let cursor=0,firstError=null;
    await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{
      while(cursor<items.length&&!firstError){const index=cursor++;try{await fn(items[index],index)}catch(error){firstError=error}}
    }));
    if(firstError)throw firstError;
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
  const importId=x=>String(x?.id??'');
  const normalizeName=s=>String(s||'').trim().replace(/\s+/g,' ').toLocaleLowerCase('pt-BR');
  const importPhotoSpecs=f=>[
    ...(f.cover?[{kind:'cover',position:0,src:f.cover}]:[]),
    ...(f.coverOriginal?[{kind:'original',position:0,src:f.coverOriginal}]:[]),
    ...(Array.isArray(f.gallery)?f.gallery.map((src,position)=>({kind:'gallery',position,src})).filter(p=>p.src):[])
  ];
  function importPhotoType(src){
    const match=/^data:(image\/(?:jpeg|png|webp));base64,[A-Za-z0-9+/=]+$/.exec(src);
    if(!match)throw Error('O backup contém uma foto em formato não suportado.');
    return {mime:match[1],ext:{'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[match[1]]};
  }
  function inspectBackup(backup){
    if(!backup||backup.format!=='curio-backup'||backup.formatVersion!==1||
      !Array.isArray(backup.figures)||!Array.isArray(backup.wishlist)||!Array.isArray(backup.groups))
      throw Error('Use um backup JSON completo do CURIÓ no formato curio-backup v1.');
    const names=new Map(),idsByKind=[['figura',backup.figures],['wishlist',backup.wishlist],['coleção',backup.groups]];
    for(const [kind,items] of idsByKind){const seen=new Set();for(const x of items){const id=importId(x);if(!id||seen.has(id))throw Error('ID ausente ou duplicado em '+kind+'.');seen.add(id)}}
    for(const g of backup.groups){if(typeof g.name!=='string'||!g.name.trim())throw Error('Coleção sem nome.');const n=normalizeName(g.name);if(names.has(n))throw Error('Nomes duplicados de coleções.');names.set(n,{legacy_id:importId(g),name:g.name.trim()})}
    let photos=0,bytes=0;
    for(const f of backup.figures){
      if(typeof f.name!=='string'||!f.name.trim())throw Error('Figura sem nome.');
      if(f.groups!=null&&!Array.isArray(f.groups))throw Error('Coleções de figura inválidas.');
      if(f.gallery!=null&&!Array.isArray(f.gallery))throw Error('Galeria inválida.');
      for(const name of f.groups||[]){const n=normalizeName(name);if(n&&!names.has(n))names.set(n,{legacy_id:'name:'+n,name:String(name).trim()})}
      for(const p of importPhotoSpecs(f)){importPhotoType(p.src);photos++;let size=Math.floor((p.src.length-p.src.indexOf(',')-1)*.75);if(size>10485760)throw Error('Uma foto supera 10 MB.');bytes+=size}
    }
    for(const w of backup.wishlist)for(const [name,value] of Object.entries(w))if(typeof value==='string'&&value.startsWith('data:'))throw Error('Imagem na Wishlist sem destino: '+name);
    return {groups:[...names.values()],photos,bytes};
  }
  async function digest(data){const bytes=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(bytes)].map(v=>v.toString(16).padStart(2,'0')).join('')}
  async function prepareImport(file){
    if(!user)throw Error('Entre na conta.');
    if(!file||file.size>100*1048576)throw Error('Escolha um JSON de até 100 MB.');
    const current=session,raw=await file.arrayBuffer();
    let backup;try{backup=JSON.parse(new TextDecoder().decode(raw))}catch{throw Error('JSON inválido.');}
    const manifest=inspectBackup(backup),fingerprint=await digest(raw);
    if(current!==session)throw Error('Sessão alterada.');
    pendingImport={backup,manifest,fingerprint,session:current,fileName:file.name};
    return {fileName:file.name,figures:backup.figures.length,groups:manifest.groups.length,wishlist:backup.wishlist.length,photos:manifest.photos,bytes:manifest.bytes,fingerprint:fingerprint.slice(0,12),account:user.email||user.id};
  }
  async function runImport(progress=()=>{}){
    if(importing)throw Error('Já existe uma importação em andamento.');
    if(!pendingImport||!user||pendingImport.session!==session)throw Error('Selecione o arquivo após entrar na conta.');
    importing=true;const current=session,{backup,manifest,fingerprint}=pendingImport,owner=user.id;
    const ensureSession=()=>{if(current!==session)throw Error('Sessão alterada.');};
    const rowKey=(row,kind,index)=>row.legacy_id??String(numericId(row,index,kind));
    try{
      progress('Conferindo a conta…');
      const [settingsRows,existingFigures,existingGroups,existingWish]=await Promise.all(['user_settings','figures','collections','wishlist'].map(list));ensureSession();
      const existingSettings=settingsRows.find(x=>x.owner_id===owner),marker=existingSettings?.data?.migrationFingerprint;
      if(marker&&marker!==fingerprint)throw Error('Esta conta já iniciou outro backup. Use o mesmo arquivo ou uma conta vazia.');
      if(!marker&&(existingFigures.length||existingGroups.length||existingWish.length))throw Error('Esta conta contém dados. Use uma conta vazia para evitar mesclar backups diferentes.');
      if(!existingSettings){await mutation('user_settings','POST',{owner_id:owner,data:{migrationFingerprint:fingerprint,migrationStartedAt:new Date().toISOString()}})}
      else if(!marker){const data={...existingSettings.data,migrationFingerprint:fingerprint,migrationStartedAt:new Date().toISOString()};const r=await mutation('user_settings','PATCH',{data},'?owner_id=eq.'+owner);if(r.length!==1)throw Error('Não foi possível reservar a conta.');}
      const total=manifest.groups.length+backup.figures.length+backup.wishlist.length+manifest.photos+backup.figures.reduce((n,f)=>n+(f.groups||[]).length,0);
      let done=0;const step=what=>progress(++done+' de '+total+' · '+what);
      const groups=await list('collections'),groupIds=new Map();
      for(const g of manifest.groups){ensureSession();let row=groups.find((r,i)=>rowKey(r,'groups',i)===g.legacy_id);
        if(!row){row=(await mutation('collections','POST',{owner_id:owner,legacy_id:g.legacy_id,name:g.name}))[0];if(!row)throw Error('Coleção não confirmada.');groups.push(row)}
        if(row.name!==g.name)throw Error('Conflito na coleção '+g.name+'.');groupIds.set(normalizeName(g.name),row.id);step('Coleção: '+g.name)}
      const figures=await list('figures'),links=await list('figure_collections'),photoRecords=await list('figure_photos'),photoJobs=[];
      for(const f of backup.figures){ensureSession();const legacy_id=importId(f),name=f.name.trim();let row=figures.find((r,i)=>rowKey(r,'figures',i)===legacy_id);
        if(!row){const {id,cover,coverOriginal,gallery,groups,name:ignored,...data}=f;row=(await mutation('figures','POST',{owner_id:owner,legacy_id,name,data}))[0];if(!row)throw Error('Figura não confirmada.');figures.push(row)}
        if(row.name!==name)throw Error('Conflito na figura '+name+'.');step('Figura: '+name);
        for(const groupName of f.groups||[]){const collection_id=groupIds.get(normalizeName(groupName));if(!collection_id)throw Error('Coleção desconhecida: '+groupName);
          if(!links.some(x=>x.figure_id===row.id&&x.collection_id===collection_id)){const link=(await mutation('figure_collections','POST',{owner_id:owner,figure_id:row.id,collection_id}))[0];if(!link)throw Error('Vínculo não confirmado.');links.push(link)}step('Vínculo de '+name)}
        for(const p of importPhotoSpecs(f))photoJobs.push({p,row,name});
      }
      await mapLimit(photoJobs,6,async({p,row,name})=>{ensureSession();const {mime,ext}=importPhotoType(p.src),blob=await (await fetch(p.src)).blob();if(!blob.size||blob.size>10485760)throw Error('Foto inválida: '+name);
          const path=owner+'/'+row.id+'/'+p.kind+'-'+p.position+'.'+ext;
          let found=photoRecords.find(x=>x.figure_id===row.id&&x.kind===p.kind&&x.position===p.position);
          if(found&&found.storage_path!==path){const existingBlob=await api('/storage/v1/object/authenticated/'+BUCKET+'/'+found.storage_path);
            if(existingBlob.size!==blob.size||await digest(await existingBlob.arrayBuffer())!==await digest(await blob.arrayBuffer()))throw Error('Foto diferente já existe em '+name+'.');
          }else{
            if(!found){const uploadResponse=await fetch(BASE+'/storage/v1/object/'+BUCKET+'/'+path,{method:'POST',headers:authHeaders({'Content-Type':mime,'x-upsert':'true'}),body:blob});if(!uploadResponse.ok)throw Error('Falha ao enviar foto de '+name+' (HTTP '+uploadResponse.status+').');
              found=(await mutation('figure_photos','POST',{owner_id:owner,figure_id:row.id,kind:p.kind,position:p.position,storage_path:path}))[0];if(!found)throw Error('Foto não registrada.');photoRecords.push(found)}
            if(!photos.has(path))photos.set(path,URL.createObjectURL(blob));
          }
          step('Foto enviada: '+name)
      });
      const wish=await list('wishlist');
      for(const w of backup.wishlist){ensureSession();const legacy_id=importId(w);if(!wish.some((r,i)=>rowKey(r,'wishlist',i)===legacy_id)){const {id,...data}=w;const row=(await mutation('wishlist','POST',{owner_id:owner,legacy_id,data}))[0];if(!row)throw Error('Wishlist não confirmada.');wish.push(row)}step('Wishlist')}
      const [fs,cs,ws,ps,ls]=await Promise.all(['figures','collections','wishlist','figure_photos','figure_collections'].map(list));ensureSession();
      const importedFigureIds=new Set(fs.filter((r,i)=>backup.figures.some(f=>importId(f)===rowKey(r,'figures',i))).map(r=>r.id));
      const importedGroupIds=new Set(cs.filter((r,i)=>manifest.groups.some(g=>g.legacy_id===rowKey(r,'groups',i))).map(r=>r.id));
      const counts={figures:importedFigureIds.size,groups:importedGroupIds.size,wishlist:ws.filter((r,i)=>backup.wishlist.some(w=>importId(w)===rowKey(r,'wishlist',i))).length,photos:ps.filter(p=>importedFigureIds.has(p.figure_id)).length,links:ls.filter(l=>importedFigureIds.has(l.figure_id)&&importedGroupIds.has(l.collection_id)).length};
      const expectedLinks=backup.figures.reduce((n,f)=>n+(f.groups||[]).length,0);
      if(counts.figures!==backup.figures.length||counts.groups!==manifest.groups.length||counts.wishlist!==backup.wishlist.length||counts.photos!==manifest.photos||counts.links!==expectedLinks)throw Error('Contagens divergentes: '+JSON.stringify(counts));
      const prefs=backup.settings&&typeof backup.settings==='object'&&!Array.isArray(backup.settings)?Object.fromEntries(Object.entries(backup.settings).filter(([k])=>!['id','lastBackup','changesSinceBackup','backupReminderNext'].includes(k))):{};
      const setting=(await list('user_settings')).find(x=>x.owner_id===owner);
      const data={...setting.data,...(setting.data.migrationCompletedAt?{}:prefs),migrationFingerprint:fingerprint,migrationCompletedAt:setting.data.migrationCompletedAt||new Date().toISOString()};
      if((await mutation('user_settings','PATCH',{data},'?owner_id=eq.'+owner)).length!==1)throw Error('Preferências não confirmadas.');
      progress('Concluído: '+counts.figures+' figuras, '+counts.groups+' coleções, '+counts.wishlist+' desejos e '+counts.photos+' fotos.');
      return counts;
    }finally{importing=false}
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
  async function authError(response,action){
    let body={};try{body=await response.json()}catch{}
    const code=body.error_code||body.code||body.error||'';
    const known={
      invalid_credentials:'E-mail ou senha incorretos. Confira os dados da conta usada no piloto.',
      email_not_confirmed:'O e-mail desta conta ainda não foi confirmado. Abra o link de confirmação ou use Reenviar confirmação.',
      signup_disabled:'O cadastro está desativado no projeto Supabase.',
      captcha_failed:'A verificação antirobô falhou. Atualize a página e tente novamente.',
      over_email_send_rate_limit:'O limite de e-mails foi atingido. Aguarde e tente mais tarde.'
    };
    return Error(known[code]||body.msg||body.message||body.error_description||action+' (HTTP '+response.status+').');
  }
  function redirectTo(){
    if(!['https:','http:'].includes(location.protocol))return '';
    if(location.protocol==='http:'&&!['localhost','127.0.0.1'].includes(location.hostname))return '';
    return location.origin+location.pathname;
  }
  function start(onReady){
    lock();
    try{$('onlineKey').value=localStorage.getItem('curio-supabase-publishable-key')||''}catch{}
    if(!$('onlineKey').value)$('onlineKey').closest('details').open=true;
    let mode='login',recoveryToken='';
    const setMode=(next,notice='')=>{
      mode=next;const titles={login:'Entrar no CURIÓ',signup:'Criar conta',forgot:'Recuperar senha',reset:'Definir nova senha'};
      const intros={login:'Acesse seus dados em qualquer dispositivo.',signup:'Crie sua coleção pessoal. Confirme seu e-mail para entrar.',forgot:'Enviaremos um link de recuperação ao seu e-mail.',reset:'Escolha uma nova senha para sua conta.'};
      $('onlineAuthTitle').textContent=titles[next];$('onlineAuthIntro').textContent=intros[next];
      $('onlineEmailWrap').hidden=next==='reset';$('onlinePasswordWrap').hidden=next==='forgot';$('onlineConfirmWrap').hidden=!['signup','reset'].includes(next);
      $('onlinePassword').autocomplete=next==='login'?'current-password':'new-password';
      $('onlineLogin').textContent={login:'Entrar',signup:'Criar conta',forgot:'Enviar link',reset:'Salvar nova senha'}[next];
      $('onlineCreate').hidden=next!=='login';$('onlineForgot').hidden=next!=='login';$('onlineBack').hidden=next==='login';$('onlineResend').hidden=true;
      $('onlinePassword').value='';$('onlinePasswordConfirm').value='';message(notice);
    };
    $('onlineCreate').onclick=()=>setMode('signup');
    $('onlineForgot').onclick=()=>setMode('forgot');
    $('onlineBack').onclick=()=>{recoveryToken='';setMode('login')};
    $('onlineResend').onclick=async()=>{
      const proposedKey=$('onlineKey').value.trim(),email=$('onlineEmail').value.trim();
      if(!email||!proposedKey.startsWith('sb_publishable_'))return message('Informe e-mail e chave publicável.',true);
      const button=$('onlineResend');button.disabled=true;
      try{const redirect=redirectTo(),r=await fetch(BASE+'/auth/v1/resend'+(redirect?'?redirect_to='+encodeURIComponent(redirect):''),{method:'POST',headers:{apikey:proposedKey,'Content-Type':'application/json'},body:JSON.stringify({type:'signup',email})});if(!r.ok)throw Error('Não foi possível reenviar (HTTP '+r.status+').');message('Se o cadastro estiver pendente, confira seu e-mail.')}catch(e){message(e.message,true)}finally{button.disabled=false}
    };
    try{
      const params=new URLSearchParams(location.hash.slice(1));
      if(params.get('type')==='recovery'&&params.get('access_token')){recoveryToken=params.get('access_token');setMode('reset')}
      else if(params.get('type')==='signup'||params.get('type')==='email')setMode('login','E-mail confirmado. Entre com sua senha.');
      if(params.has('access_token')||params.has('error')){
        if(params.has('error'))message('O link não foi aceito. Solicite outro e-mail.',true);
        history.replaceState(null,'',location.pathname+location.search);
      }
    }catch{}
    $('onlineLogin').onclick=async()=>{
      const button=$('onlineLogin');button.disabled=true;
      try{
        const proposedKey=$('onlineKey').value.trim();
        if(!proposedKey.startsWith('sb_publishable_'))throw Error('Use a chave publicável sb_publishable_…');
        const email=$('onlineEmail').value.trim(),password=$('onlinePassword').value;
        if(mode!=='reset'&&!email)throw Error('Informe o e-mail.');
        if(mode!=='forgot'&&!password)throw Error('Informe a senha.');
        if(['signup','reset'].includes(mode)){
          if(password.length<8)throw Error('Use uma senha de pelo menos 8 caracteres.');
          if(password!==$('onlinePasswordConfirm').value)throw Error('As senhas não coincidem.');
        }
        const redirect=redirectTo(),redirectQuery=redirect?'?redirect_to='+encodeURIComponent(redirect):'';
        if(mode==='signup'){
          const r=await fetch(BASE+'/auth/v1/signup'+redirectQuery,{method:'POST',headers:{apikey:proposedKey,'Content-Type':'application/json'},body:JSON.stringify({email,password}),cache:'no-store'});
          $('onlinePassword').value=$('onlinePasswordConfirm').value='';
          if(!r.ok)throw await authError(r,'Cadastro recusado');
          const result=await r.json();if(!result.user?.id&&!result.id)throw Error('O cadastro não foi confirmado pelo servidor.');
          try{localStorage.setItem('curio-supabase-publishable-key',proposedKey)}catch{}
          setMode('login',result.access_token?'Conta criada. Entre com sua senha.':'Confira o e-mail para confirmar a conta. Depois, entre com sua senha.');if(!result.access_token)$('onlineResend').hidden=false;
          return;
        }
        if(mode==='forgot'){
          const r=await fetch(BASE+'/auth/v1/recover'+redirectQuery,{method:'POST',headers:{apikey:proposedKey,'Content-Type':'application/json'},body:JSON.stringify({email}),cache:'no-store'});
          if(!r.ok)throw await authError(r,'Falha na recuperação');
          try{localStorage.setItem('curio-supabase-publishable-key',proposedKey)}catch{}
          setMode('login','Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.');return;
        }
        if(mode==='reset'){
          if(!recoveryToken)throw Error('Abra novamente o link de recuperação.');
          const r=await fetch(BASE+'/auth/v1/user',{method:'PUT',headers:{apikey:proposedKey,Authorization:'Bearer '+recoveryToken,'Content-Type':'application/json'},body:JSON.stringify({password}),cache:'no-store'});
          $('onlinePassword').value=$('onlinePasswordConfirm').value='';
          if(!r.ok)throw Error('Link expirado ou senha recusada (HTTP '+r.status+').');
          recoveryToken='';setMode('login','Senha atualizada. Entre com a nova senha.');return;
        }
        const response=await fetch(BASE+'/auth/v1/token?grant_type=password',{
          method:'POST',headers:{apikey:proposedKey,'Content-Type':'application/json'},body:JSON.stringify({email,password}),cache:'no-store'});
        $('onlinePassword').value='';
        if(!response.ok)throw await authError(response,'Login recusado');
        const data=await response.json();if(!data.access_token||!data.user?.id)throw Error('Login incompleto.');
        key=proposedKey;token=data.access_token;user=data.user;session++;
        try{localStorage.setItem('curio-supabase-publishable-key',key)}catch{}
        await onReady();unlock();
      }catch(e){message(e.message,true)}finally{button.disabled=false}
    };
    $('onlineLogout').onclick=()=>{
      if(importing){message('Aguarde a importação terminar.',true);return}
      session++;token=key='';user=null;for(const url of photos.values())URL.revokeObjectURL(url);
      photos.clear();lock();setMode('login','Sessão encerrada.');
    };
    $('onlineRefresh').onclick=async()=>{
      const button=$('onlineRefresh');button.disabled=true;
      try{await onReady()}catch(e){message('Falha ao atualizar: '+e.message,true)}
      finally{button.disabled=false}
    };
  }
  window.curioRemote={start,read,saveSettings,exportBackup,prepareImport,runImport,eraseAccount,account:()=>user&&{id:user.id,email:user.email},
    write,remove};
})();
