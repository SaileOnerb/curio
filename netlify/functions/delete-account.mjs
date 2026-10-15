const BASE='https://xyuqdpenhnlwnplisxjh.supabase.co';
const ORIGINS=new Set(['https://curiocollection.com.br','https://localhost','http://localhost','capacitor://localhost']);
export default async function handler(req){
 const origin=req.headers.get('origin');
 const headers={'content-type':'application/json','cache-control':'no-store',...(ORIGINS.has(origin)?{'access-control-allow-origin':origin,'vary':'Origin'}:{})};
 const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(origin&&!ORIGINS.has(origin))return reply({error:'Origem inválida.'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'authorization, apikey, content-type'}});
 if(req.method!=='POST')return reply({error:'Método inválido.'},405);
 const auth=req.headers.get('authorization'),key=req.headers.get('apikey'),secret=process.env.SUPABASE_SECRET_KEY;
 if(!auth?.startsWith('Bearer ')||!key?.startsWith('sb_publishable_'))return reply({error:'Entre novamente na conta.'},401);
 if(!secret?.startsWith('sb_secret_'))return reply({error:'Exclusão indisponível: configuração do servidor pendente.'},503);
 try{
  const u=await fetch(BASE+'/auth/v1/user',{headers:{authorization:auth,apikey:key},signal:AbortSignal.timeout(8000)});
  if(!u.ok)return reply({error:'Sessão expirada. Entre novamente.'},401);
  const user=await u.json();if(!/^[0-9a-f-]{36}$/i.test(user.id)||!user.email)return reply({error:'Conta inválida.'},401);
  const body=await req.json();
  if(body.confirmation!=='EXCLUIR CONTA'||typeof body.password!=='string'||!body.password||body.password.length>1024)return reply({error:'Confirme a frase e sua senha atual.'},400);
  const check=await fetch(BASE+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:key,'content-type':'application/json'},body:JSON.stringify({email:user.email,password:body.password}),signal:AbortSignal.timeout(8000)});
  if(!check.ok)return reply({error:'Não foi possível confirmar sua senha. Nenhum dado foi apagado.'},401);
  const verified=await check.json();if(verified.user?.id!==user.id)return reply({error:'Confirmação inválida.'},401);
  const admin=async(path,method,body)=>{const r=await fetch(BASE+path,{method,headers:{apikey:secret,'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();return r.status===204?null:r.json()};
  // Nunca aceita um ID ou caminho do cliente. Lista somente o prefixo da conta autenticada.
  let budget=0;
  async function clean(prefix){
   while(true){
    if(++budget>120)throw Error();
    const rows=await admin('/storage/v1/object/list/figure-photos','POST',{prefix,limit:100,offset:0});
    if(!Array.isArray(rows))throw Error();if(!rows.length)return;
    const files=[];
    for(const row of rows){if(typeof row.name!=='string'||row.name.includes('/')||row.name==='..')throw Error();const path=prefix+'/'+row.name;if(row.id)files.push(path);else await clean(path)}
    if(files.length)await admin('/storage/v1/object/figure-photos','DELETE',{prefixes:files});
    // Pastas virtuais vazias desaparecem da listagem após remover seus objetos.
   }
  }
  await clean(user.id);
  // FKs owner_id -> auth.users ON DELETE CASCADE removem os registros associados.
  await admin('/auth/v1/admin/users/'+user.id,'DELETE',{should_soft_delete:false});
  return reply({deleted:true});
 }catch{return reply({error:'Não foi possível concluir a exclusão. Alguns arquivos podem ter sido removidos. Sua conta não é apagada antes de limpar as fotos; tente novamente para concluir.'},503)}
}
export const config={path:'/api/account/delete'};
