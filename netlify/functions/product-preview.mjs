// Small, bounded preview for supported stores. Never fetch arbitrary user hosts.
const stores=['mercadolivre.com.br','mercadolivre.com','amazon.com.br','amazon.com','aliexpress.com','shopee.com.br','shopee.com'];
const safeHost=host=>stores.some(domain=>host===domain||host.endsWith('.'+domain));
const response=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const decode=s=>String(s||'').replace(/&(?:amp|quot|#39|apos|lt|gt|#(\d+)|#x([0-9a-f]+));/gi,(m,d,x)=>({ '&amp;':'&','&quot;':'"','&#39;':"'",'&apos;':"'",'&lt;':'<','&gt;':'>'})[m.toLowerCase()]??(d?String.fromCodePoint(Number(d)):x?String.fromCodePoint(parseInt(x,16)):m));
function meta(html,key){for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){let attrs={};for(const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g))attrs[m[1].toLowerCase()]=decode(m[2]??m[3]);if([attrs.property,attrs.name].includes(key))return attrs.content||''}return ''}
function productJson(html){for(const script of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{const value=JSON.parse(script[1]);const find=x=>Array.isArray(x)?x.map(find).find(Boolean):x&&typeof x==='object'?(String(x['@type']||'').toLowerCase()==='product'?x:find(x['@graph'])):null;let found=find(value);if(found)return found}catch{}}return {}}
function cleanImage(src,base){try{let url=new URL(src,base);return url.protocol==='https:'&&url.username===''&&url.password===''?url.href:''}catch{return ''}}
function suggestedName(url){const slug=url.pathname.split('/').filter(Boolean).find(x=>x.includes('-')&&!/^[A-Z0-9]{10}$/i.test(x));if(!slug)return '';try{return decodeURIComponent(slug).replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim().slice(0,180)}catch{return ''}}
async function storePage(original){
 let url=original;
 for(let i=0;i<4;i++){
  const page=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(7000),headers:{'user-agent':'Mozilla/5.0 (compatible; CurioPreview/1.0)','accept':'text/html'}});
  if(![301,302,303,307,308].includes(page.status))return {page,url};
  const location=page.headers.get('location');if(!location)break;
  const next=new URL(location,url);
  if(next.protocol!=='https:'||!safeHost(next.hostname.toLowerCase())||next.username||next.password||next.port)break;
  url=next;
 }
 return {page:null,url};
}
export default async function handler(req){
 if(req.method!=='POST')return response({error:'Método inválido.'},405);
 const auth=req.headers.get('authorization'),key=req.headers.get('apikey');
 if(!auth?.startsWith('Bearer ')||!key?.startsWith('sb_publishable_'))return response({error:'Entre na conta para analisar links.'},401);
 try{const check=await fetch('https://xyuqdpenhnlwnplisxjh.supabase.co/auth/v1/user',{headers:{authorization:auth,apikey:key},signal:AbortSignal.timeout(4000)});if(!check.ok)return response({error:'Sessão expirada. Entre novamente.'},401)}catch{return response({error:'Não foi possível verificar a conta agora.'},503)}
 let supplied;try{supplied=(await req.json()).url}catch{return response({error:'Link inválido.'},400)}
 let url;try{url=new URL(supplied);if(url.protocol!=='https:'||!safeHost(url.hostname.toLowerCase())||url.username||url.password||url.port)throw Error()}catch{return response({error:'Esta loja ainda não é compatível. Preencha os dados manualmente.'},400)}
 const fallback=()=>{const name=suggestedName(url);return name?response({name,image:'',price:null,store:url.hostname,partial:true}):response({error:'A loja bloqueou a leitura deste produto. Preencha nome, preço e foto manualmente.'},422)};
 try{
  const fetched=await storePage(url);url=fetched.url;const page=fetched.page;
  if(!page?.ok||!String(page.headers.get('content-type')||'').includes('text/html'))return fallback();
  const reader=page.body.getReader();let chunks=[],size=0;while(size<450000){let {value,done}=await reader.read();if(done)break;chunks.push(value);size+=value.byteLength}await reader.cancel();
  const html=new TextDecoder().decode(Buffer.concat(chunks.map(x=>Buffer.from(x))).subarray(0,450000)),structured=productJson(html),offer=Array.isArray(structured.offers)?structured.offers[0]:structured.offers||{};
  let name=String(structured.name||meta(html,'og:title')||meta(html,'twitter:title')||'').replace(/\s+/g,' ').trim().slice(0,180);
  if(/robot check|captcha|automated access|verificação de segurança/i.test(name)||/^amazon(?:\.com(?:\.br)?)?\s*$/i.test(name))name='';
  let partial=false;
  if(!name){name=suggestedName(url);partial=!!name}
  const rawPrice=offer.price??meta(html,'product:price:amount')??meta(html,'og:price:amount');
  const currency=String(offer.priceCurrency||meta(html,'product:price:currency')||'').toUpperCase();
  const image=!partial&&name?cleanImage(Array.isArray(structured.image)?structured.image[0]:structured.image?.url||structured.image||meta(html,'og:image')||meta(html,'twitter:image'),url):'';
  if(!name&&!image)return fallback();
  const price=!partial&&(currency==='BRL'||!currency&&url.hostname.endsWith('.com.br'))&&rawPrice!==''&&rawPrice!=null&&Number.isFinite(Number(rawPrice))?Number(rawPrice):null;
  return response({name,image,price,store:url.hostname,partial:partial||!image||price===null});
 }catch{return fallback()}
}
export const config={path:'/api/product-preview'};
