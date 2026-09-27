// Small, bounded preview for supported stores. Never fetch arbitrary user hosts.
const stores=['mercadolivre.com.br','mercadolivre.com','amazon.com.br','amazon.com','aliexpress.com','shopee.com.br','shopee.com'];
const safeHost=host=>stores.some(domain=>host===domain||host.endsWith('.'+domain));
const response=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const decode=s=>String(s||'').replace(/&(?:amp|quot|#39|apos|lt|gt|#(\d+)|#x([0-9a-f]+));/gi,(m,d,x)=>({ '&amp;':'&','&quot;':'"','&#39;':"'",'&apos;':"'",'&lt;':'<','&gt;':'>'})[m.toLowerCase()]??(d?String.fromCodePoint(Number(d)):x?String.fromCodePoint(parseInt(x,16)):m));
function meta(html,key){for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){let attrs={};for(const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g))attrs[m[1].toLowerCase()]=decode(m[2]??m[3]);if([attrs.property,attrs.name].includes(key))return attrs.content||''}return ''}
function productJson(html){for(const script of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{const value=JSON.parse(script[1]);const find=x=>Array.isArray(x)?x.map(find).find(Boolean):x&&typeof x==='object'?(String(x['@type']||'').toLowerCase()==='product'?x:find(x['@graph'])):null;let found=find(value);if(found)return found}catch{}}return {}}
function cleanImage(src,base){try{let url=new URL(src,base);return url.protocol==='https:'&&url.username===''&&url.password===''?url.href:''}catch{return ''}}
export default async function handler(req){
 if(req.method!=='POST')return response({error:'Método inválido.'},405);
 let supplied;try{supplied=(await req.json()).url}catch{return response({error:'Link inválido.'},400)}
 let url;try{url=new URL(supplied);if(url.protocol!=='https:'||!safeHost(url.hostname.toLowerCase())||url.username||url.password||url.port)throw Error()}catch{return response({error:'Esta loja ainda não é compatível. Preencha os dados manualmente.'},400)}
 try{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);
  let page;try{page=await fetch(url,{redirect:'manual',signal:controller.signal,headers:{'user-agent':'Mozilla/5.0 (compatible; CurioPreview/1.0)','accept':'text/html'}})}finally{clearTimeout(timer)}
  if(!page.ok||!String(page.headers.get('content-type')||'').includes('text/html'))return response({error:'A loja não disponibilizou os dados. Preencha manualmente.'},422);
  const reader=page.body.getReader();let chunks=[],size=0;while(size<450000){let {value,done}=await reader.read();if(done)break;chunks.push(value);size+=value.byteLength}await reader.cancel();
  const html=new TextDecoder().decode(Buffer.concat(chunks.map(x=>Buffer.from(x))).subarray(0,450000)),structured=productJson(html),offer=Array.isArray(structured.offers)?structured.offers[0]:structured.offers||{};
  const name=String(structured.name||meta(html,'og:title')||meta(html,'twitter:title')||'').replace(/\s+/g,' ').trim().slice(0,180);
  const rawPrice=offer.price??meta(html,'product:price:amount')??meta(html,'og:price:amount');
  const currency=String(offer.priceCurrency||meta(html,'product:price:currency')||'').toUpperCase();
  const image=cleanImage(Array.isArray(structured.image)?structured.image[0]:structured.image?.url||structured.image||meta(html,'og:image')||meta(html,'twitter:image'),url);
  if(!name&&!image)return response({error:'A loja não forneceu nome ou foto. Preencha manualmente.'},422);
  return response({name,image,price:currency==='BRL'&&rawPrice!==''&&rawPrice!=null&&Number.isFinite(Number(rawPrice))?Number(rawPrice):null,store:url.hostname});
 }catch{return response({error:'Não foi possível consultar a loja agora. Preencha manualmente.'},422)}
}
export const config={path:'/api/product-preview'};
