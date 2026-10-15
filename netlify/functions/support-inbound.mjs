import {Webhook} from 'svix';
const SUPPORT='support@curiocollection.com.br';
const INBOX='curiocollection26@gmail.com';
const API='https://api.resend.com';
function mailbox(value){if(typeof value!=='string'||/[\r\n]/.test(value))return '';const m=value.trim().match(/^(?:[^<>]*<)?([^<>\s@]+@[^<>\s@]+\.[^<>\s@]+)>?$/);return m?m[1].toLowerCase():''}
const reply=(status=200)=>new Response(null,{status,headers:{'cache-control':'no-store'}});
async function json(path,key,options={}){const r=await fetch(API+path,{...options,headers:{authorization:'Bearer '+key,'content-type':'application/json',...options.headers},signal:AbortSignal.timeout(10000),redirect:'error'});if(!r.ok)throw Error('Provider request failed');return r.json()}
export default async function handler(req){
 if(req.method!=='POST')return reply(405);
 const key=process.env.RESEND_SUPPORT_API_KEY,secret=process.env.RESEND_SUPPORT_WEBHOOK_SECRET;
 if(!key||!secret)return reply(503);
 const raw=await req.text();if(Buffer.byteLength(raw)>262144)return reply(413);
 let event;
 try{new Webhook(secret).verify(raw,{'svix-id':req.headers.get('svix-id'),'svix-timestamp':req.headers.get('svix-timestamp'),'svix-signature':req.headers.get('svix-signature')});event=JSON.parse(raw)}catch{return reply(401)}
 if(event.type!=='email.received')return reply();
 const id=event.data?.email_id;
 if(typeof id!=='string'||! /^[a-f0-9-]{36}$/i.test(id))return reply(400);
 try{
  const email=await json('/emails/receiving/'+id,key);
  const recipients=[...(email.to||[]),...(email.cc||[]),...(email.bcc||[]),...(email.received_for||[])];
  if(!recipients.some(x=>mailbox(x)===SUPPORT))return reply();
  const sender=mailbox(email.reply_to?.[0])||mailbox(email.from);
  // Não responde automaticamente ao remetente: encaminha apenas à caixa fixa do responsável.
  // Ignora devoluções automáticas para evitar ciclos entre encaminhamento e Gmail.
  const auto=Object.entries(email.headers||{}).find(([k])=>k.toLowerCase()==='auto-submitted')?.[1];
  if(sender===SUPPORT&&auto&&auto!=='no')return reply();
  const attachments=[];let total=0,after='';
  if(email.attachments?.length){
   do{
    const page=await json('/emails/receiving/'+id+'/attachments?limit=100'+(after?'&after='+encodeURIComponent(after):''),key);
    if(!Array.isArray(page.data))throw Error('Invalid attachments');
    for(const a of page.data){
     if(!a.download_url||!Number.isFinite(a.size)||a.size<0||total+a.size>20*1024*1024)throw Error('Attachment limit');
     const url=new URL(a.download_url);if(url.protocol!=='https:'||url.username||url.password)throw Error('Invalid attachment URL');
     const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('Attachment unavailable');
     const reader=response.body.getReader(),chunks=[];let size=0;
     while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(total+size>20*1024*1024){await reader.cancel();throw Error('Attachment limit')}chunks.push(Buffer.from(part.value))}
     total+=size;attachments.push({filename:String(a.filename||'anexo').replace(/[\r\n/\\]/g,'_').slice(0,180),content:Buffer.concat(chunks).toString('base64')});
    }
    after=page.has_more?page.data.at(-1)?.id:'';if(page.has_more&&!after)throw Error('Invalid pagination');
   }while(after);
  }
  const subject=String(email.subject||'(sem assunto)').replace(/[\r\n]/g,' ').slice(0,200);
  const text=`Mensagem recebida pelo suporte do CURIÓ\nDe: ${String(email.from||'desconhecido').replace(/[\r\n]/g,' ')}\nPara: ${SUPPORT}\n\n${email.text||'Esta mensagem contém apenas HTML. Consulte a versão original em Resend → Emails → Receiving.'}`;
  await json('/emails',key,{method:'POST',headers:{'Idempotency-Key':'curio-support-forward/'+id},body:JSON.stringify({from:'CURIÓ Suporte <'+SUPPORT+'>',to:[INBOX],subject:'[CURIÓ Suporte] '+subject,text,...(sender?{reply_to:sender}:{}),...(attachments.length?{attachments}:{}),headers:{'X-Curio-Forwarded':'1','Auto-Submitted':'auto-generated'}})});
  return reply();
 }catch{return reply(503)}
}
export const config={path:'/api/support/inbound'};
