/* Read-only bridge for the isolated online interface pilot. No IndexedDB writes. */
(() => {
  'use strict';
  const BASE='https://xyuqdpenhnlwnplisxjh.supabase.co';
  const BUCKET='figure-photos';
  let key='',token='',user=null,session=0;
  const photos=new Map(),ids=new Map();
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
    ids.clear();
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
      const localId=numericId(row,i,'figures');ids.set('figures:'+localId,row.id);
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
      const localId=numericId(row,i,'wishlist');ids.set('wishlist:'+localId,row.id);
      return {...row.data,id:localId}
    });
    const settings={...(remoteSettings.find(s=>s.owner_id===user.id)?.data||{})};
    if(current!==session)throw Error('Sessão alterada durante a leitura.');
    message(figures.length+' figuras e '+remotePhotos.length+' fotos carregadas.');
    return {figures,groups,wishlist,settings};
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
    document.addEventListener('click',event=>{
      if(!document.body.classList.contains('online-unlocked'))return;
      const b=event.target.closest('button');if(!b)return;
      if(b.closest('#onlineControls,#onlineGate')||b.matches('.nav,.mnav,#clearFilters,.lb-close,.lb-prev,.lb-next')||
        b.closest('#photoLightbox')||b.matches('#detailModal .close'))return;
      event.preventDefault();event.stopImmediatePropagation();
      message('Esta versão da interface permite consulta. Cadastro e edição online estão na próxima etapa.',true);
    },true);
  }
  window.curioRemote={start,read,
    write:()=>Promise.reject(Error('Gravação desativada neste piloto de leitura.')),
    remove:()=>Promise.reject(Error('Exclusão desativada neste piloto de leitura.'))};
})();
