import {randomBytes,createHash,timingSafeEqual,createCipheriv,createDecipheriv} from 'node:crypto';
const ROOT='https://curiocollection.com.br';
const CALLBACK=ROOT+'/api/mercadolivre/callback';
const COOKIE='__Host-curio-meli-validation';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const headers={'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-curio-meli-diagnostic':'2','referrer-policy':'no-referrer','x-content-type-options':'nosniff','content-security-policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self' https://auth.mercadolivre.com.br; frame-ancestors 'none'; base-uri 'none'"};
function page(title,body,status=200,extra={}){return new Response(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · CURIÓ</title><style>body{background:#0f0f10;color:#f5f5f5;font:16px system-ui;margin:0;padding:32px 20px}main{max-width:720px;margin:auto}section{background:#18181b;border:1px solid #2f2e36;border-radius:20px;padding:24px}button{background:#f5f5f5;color:#18181b;border:0;border-radius:12px;padding:14px 22px;font:inherit;cursor:pointer}li{margin:14px 0}p{line-height:1.6;color:#bdbdc3}code{overflow-wrap:anywhere}</style><main><h1>${esc(title)}</h1><section>${body}</section></main></html>`,{status,headers:{...headers,...extra}})}
function equal(a,b){return timingSafeEqual(createHash('sha256').update(a).digest(),createHash('sha256').update(b).digest())}
function seal(data,key){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);return Buffer.concat([iv,cipher.update(JSON.stringify(data)),cipher.final(),cipher.getAuthTag()]).toString('base64url')}
function open(value,key){const buf=Buffer.from(value,'base64url');const d=createDecipheriv('aes-256-gcm',key,buf.subarray(0,12));d.setAuthTag(buf.subarray(-16));return JSON.parse(Buffer.concat([d.update(buf.subarray(12,-16)),d.final()]).toString())}
const cookie=(value,maxAge)=>`${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
async function probe(path,token){try{const r=await fetch('https://api.mercadolibre.com'+path,{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(8000),redirect:'error'});let data;try{data=await r.json()}catch{}return {status:r.status,data}}catch{return {status:0}}}
export default async function handler(req){
 const env=process.env;
 if(!env.MELI_CLIENT_ID||!env.MELI_CLIENT_SECRET||!env.MELI_VALIDATION_PASSWORD||!env.MELI_OAUTH_COOKIE_KEY||! /^[a-fA-F0-9]{64}$/.test(env.MELI_OAUTH_COOKIE_KEY))return page('Integração pendente','<p>As variáveis privadas do servidor ainda não foram configuradas.</p>',503);
 const key=Buffer.from(env.MELI_OAUTH_COOKIE_KEY,'hex'),url=new URL(req.url);
 if(url.pathname==='/api/mercadolivre/callback'){
  const clear={'set-cookie':cookie('',0)};
  if(req.method!=='GET')return page('Método inválido','',405);
  try{
   const raw=(req.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
   const session=open(raw,key);
   if(!Number.isFinite(session.expires)||session.expires<Date.now()||!url.searchParams.get('state')||!equal(session.state,url.searchParams.get('state')))throw Error();
   if(url.searchParams.has('error'))return page('Autorização cancelada','<p>Nenhum teste foi realizado. Inicie novamente pelo painel privado.</p>',400,clear);
   const code=url.searchParams.get('code');if(!code)throw Error();
   const response=await fetch('https://api.mercadolibre.com/oauth/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded',accept:'application/json'},body:new URLSearchParams({grant_type:'authorization_code',client_id:env.MELI_CLIENT_ID,client_secret:env.MELI_CLIENT_SECRET,code,redirect_uri:CALLBACK,code_verifier:session.verifier}),signal:AbortSignal.timeout(10000),redirect:'error'});
   if(!response.ok)return page('Autorização indisponível',`<p>A troca de autorização falhou (HTTP ${response.status}). Confira as credenciais, o endereço de retorno e o PKCE.</p>`,502,clear);
   const token=await response.json();if(typeof token.access_token!=='string')throw Error();
   const tests=[['Conta autorizada','/users/me',d=>Boolean(d.id)],['Busca de anúncios semelhantes','/sites/MLB/search?q=marvel%20legends&limit=3',d=>Array.isArray(d.results)],['Anúncio de outro vendedor','/items/MLB5399548670',d=>Boolean(d.id&&typeof d.price==='number')],['Busca no catálogo','/products/search?site_id=MLB&q=marvel%20legends&limit=3',d=>Array.isArray(d.results)]];
   const results=[];for(const [name,path,valid] of tests){
    const result=await probe(path,token.access_token);
    let detail='';
    if(result.status===403){
     const allowed=new Set(['PA_UNAUTHORIZED_RESULT_FROM_POLICIES','FORBIDDEN','access_denied','forbidden','Invalid scopes','PolicyAgent']);
     const codes=[result.data?.code,result.data?.error,result.data?.blocked_by].filter(x=>typeof x==='string'&&allowed.has(x));
     detail=`<p>${codes.length?'Código da API: '+codes.map(esc).join(' · '):'A resposta não contém um código de erro reconhecido.'} O status sozinho não identifica a causa.</p>`;
    }
    if(path.startsWith('/products/search')&&Array.isArray(result.data?.results)){
     const rows=result.data.results.slice(0,3);
     detail=`<p>${result.data.results.length} produtos nesta resposta.</p><ul>${rows.map(x=>`<li>${esc(String(x.name||'Sem nome').slice(0,240))} · ${esc(/^MLB[0-9]+$/.test(x.id)?x.id:'ID não reconhecido')} · fotos: ${Array.isArray(x.pictures)?x.pictures.length:0}</li>`).join('')}</ul>`;
     const first=rows.find(x=>/^MLB[0-9]+$/.test(x.id));
     if(first){const d=await probe('/products/'+first.id,token.access_token);detail+=`<p>Detalhe do primeiro produto: HTTP ${d.status||'indisponível'}; nome: ${esc(String(d.data?.name||'ausente').slice(0,240))}; fotos: ${Array.isArray(d.data?.pictures)?d.data.pictures.length:0}; preço numérico: ${Number.isFinite(d.data?.price)?'presente':'ausente'}.</p>`}
    }
    results.push(`<li><strong>${esc(name)}</strong>: ${result.status===200&&result.data&&valid(result.data)?'resposta válida':result.status===200?'resposta sem os campos esperados':result.status?'HTTP '+result.status:'consulta indisponível'}${detail}</li>`);
   }
   return page('Diagnóstico detalhado',`<ul>${results.join('')}</ul><p>Os tokens não foram salvos nem exibidos. Uma busca válida ainda exige verificar se os resultados representam anúncios comparáveis. Catálogo não equivale a histórico de vendas.</p>`,200,clear);
  }catch{return page('Validação interrompida','<p>A sessão expirou, é inválida ou o serviço não respondeu. Inicie uma nova tentativa pelo painel privado.</p>',400,clear)}
 }
 if(!['GET','POST'].includes(req.method))return page('Método inválido','',405);
 let credentials='';try{credentials=Buffer.from((req.headers.get('authorization')||'').replace(/^Basic /,''),'base64').toString()}catch{}
 if(!equal(credentials,'admin:'+env.MELI_VALIDATION_PASSWORD))return page('Acesso privado','<p>Use as credenciais administrativas deste teste.</p>',401,{'www-authenticate':'Basic realm="Curio validation", charset="UTF-8"'});
 if(req.method==='GET'){
  const csrf=randomBytes(32).toString('base64url');
  return page('Validar Mercado Livre',`<p>Este teste consulta sua conta e alguns recursos de leitura. Não modifica anúncios e não salva tokens.</p><form method="post"><input type="hidden" name="csrf" value="${csrf}"><button>Autorizar e testar</button></form>`,200,{'set-cookie':cookie(seal({csrf,expires:Date.now()+600000},key),600)});
 }
 const origin=req.headers.get('origin');
 if(origin&&origin!=='null'&&origin!==ROOT)return page('Origem inválida','<p>Abra novamente o painel no domínio principal.</p>',403);
 try{
  const raw=(req.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
  const session=open(raw,key),form=await req.formData(),csrf=form.get('csrf');
  if(!Number.isFinite(session.expires)||session.expires<Date.now()||typeof session.csrf!=='string'||typeof csrf!=='string'||!equal(session.csrf,csrf))throw Error();
 }catch{return page('Sessão inválida','<p>Abra novamente o painel e clique em Autorizar e testar.</p>',403)}
 const state=randomBytes(32).toString('base64url'),verifier=randomBytes(32).toString('base64url');
 const auth=new URL('https://auth.mercadolivre.com.br/authorization');
 for(const [k,v] of Object.entries({response_type:'code',client_id:env.MELI_CLIENT_ID,redirect_uri:CALLBACK,state,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256'}))auth.searchParams.set(k,v);
 return new Response(null,{status:303,headers:{...headers,location:auth.href,'set-cookie':cookie(seal({state,verifier,expires:Date.now()+600000},key),600)}});
}
export const config={path:['/api/mercadolivre','/api/mercadolivre/callback']};
