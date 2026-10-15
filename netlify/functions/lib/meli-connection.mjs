import {createHash,randomBytes,randomUUID,createCipheriv,createDecipheriv} from 'node:crypto';
const BASE='https://xyuqdpenhnlwnplisxjh.supabase.co/rest/v1/curio_marketplace_connections';
function key(){if(!/^[a-f0-9]{64}$/i.test(process.env.MELI_OAUTH_COOKIE_KEY||''))throw Error('connection_unavailable');return createHash('sha256').update('curio-meli-storage-v1:'+process.env.MELI_OAUTH_COOKIE_KEY).digest()}
function encrypt(value){const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',key(),iv);return Buffer.concat([iv,c.update(JSON.stringify(value)),c.final(),c.getAuthTag()]).toString('base64url')}
function decrypt(value){const b=Buffer.from(value,'base64url'),d=createDecipheriv('aes-256-gcm',key(),b.subarray(0,12));d.setAuthTag(b.subarray(-16));return JSON.parse(Buffer.concat([d.update(b.subarray(12,-16)),d.final()]).toString())}
async function db(query='',method='GET',body){const secret=process.env.SUPABASE_SECRET_KEY;if(!secret?.startsWith('sb_secret_'))throw Error('connection_unavailable');const r=await fetch(BASE+query,{method,headers:{apikey:secret,'content-type':'application/json',Prefer:'return=representation,resolution=merge-duplicates'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error('connection_unavailable');return r.json()}
function payload(token){if(typeof token.access_token!=='string'||typeof token.refresh_token!=='string'||!Number.isFinite(token.expires_in)||token.expires_in<=0)throw Error('connection_unavailable');return {provider:'mercadolivre',encrypted_token:encrypt({access_token:token.access_token,refresh_token:token.refresh_token}),expires_at:new Date(Date.now()+token.expires_in*1000).toISOString(),lease_id:null,lease_until:null,updated_at:new Date().toISOString()}}
export async function saveMeliConnection(token){await db('?on_conflict=provider','POST',payload(token))}
export async function getMeliToken(){
 const [row]=await db('?provider=eq.mercadolivre');if(!row)throw Error('connection_unavailable');
 const current=decrypt(row.encrypted_token);if(Date.parse(row.expires_at)>Date.now()+60000)return current.access_token;
 const id=randomUUID(),now=new Date().toISOString();
 const params=new URLSearchParams({provider:'eq.mercadolivre',or:`(lease_until.is.null,lease_until.lt.${now})`});
 const locked=await db('?'+params,'PATCH',{lease_id:id,lease_until:new Date(Date.now()+30000).toISOString()});if(!locked.length)throw Error('connection_busy');
 const token=decrypt(locked[0].encrypted_token);
 // Another request may have completed a refresh between the initial read and lease acquisition.
 if(Date.parse(locked[0].expires_at)>Date.now()+60000){await db('?provider=eq.mercadolivre&lease_id=eq.'+id,'PATCH',{lease_id:null,lease_until:null});return token.access_token}
 try{
  const r=await fetch('https://api.mercadolibre.com/oauth/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'refresh_token',client_id:process.env.MELI_CLIENT_ID,client_secret:process.env.MELI_CLIENT_SECRET,refresh_token:token.refresh_token}),signal:AbortSignal.timeout(10000),redirect:'error'});
  if(!r.ok){if([400,401].includes(r.status))await db('?provider=eq.mercadolivre&lease_id=eq.'+id,'DELETE');throw Error('connection_unavailable')}
  const next=await r.json();const saved=await db('?provider=eq.mercadolivre&lease_id=eq.'+id,'PATCH',payload(next));if(!saved.length)throw Error('connection_unavailable');return next.access_token;
 }catch{throw Error('connection_unavailable')}
}
export function meliProductId(url){if(url.protocol!=='https:'||!['www.mercadolivre.com.br','mercadolivre.com.br'].includes(url.hostname)||url.username||url.password||url.port)return null;return url.pathname.match(/\/p\/(MLB[0-9]+)(?:\/|$)/)?.[1]||null}
export async function meliCatalogPreview(url){const id=meliProductId(url);if(!id)return null;const token=await getMeliToken();const r=await fetch('https://api.mercadolibre.com/products/'+id,{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(8000),redirect:'error'});if(!r.ok)throw Error('catalog_unavailable');const p=await r.json();if(p.id!==id||typeof p.name!=='string'||!p.name.trim())throw Error('catalog_unavailable');const image=(Array.isArray(p.pictures)?p.pictures:[]).map(x=>x.secure_url||x.url).find(x=>{try{const u=new URL(x);return u.protocol==='https:'&&u.hostname==='http2.mlstatic.com'&&!u.username&&!u.password&&!u.port}catch{return false}})||'';return {name:p.name.trim().slice(0,240),image,price:null,store:'mercadolivre.com.br',partial:true,source:'mercadolivre-catalog',productId:id}}
