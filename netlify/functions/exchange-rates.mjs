let cached, pending;
const valid=data=>Array.isArray(data)&&['USD','EUR'].every(q=>data.some(x=>x.base==='BRL'&&x.quote===q&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&Number.isFinite(x.rate)&&x.rate>0));
export default async function handler(req){
 const origin=req.headers.get('origin');
 const headers={'content-type':'application/json','cache-control':'public, max-age=3600'};
 if(['https://localhost','capacitor://localhost','http://localhost'].includes(origin)){headers['access-control-allow-origin']=origin;headers.vary='Origin'}
 if(req.method!=='GET')return new Response(null,{status:405,headers});
 try{
  if(!cached||Date.now()-cached.checkedAt>3600000){
   pending??=(async()=>{const res=await fetch('https://api.frankfurter.dev/v2/rates?base=BRL&quotes=USD,EUR',{signal:AbortSignal.timeout(6000)});if(!res.ok)throw Error();const data=await res.json();if(!valid(data))throw Error();cached={base:'BRL',rates:Object.fromEntries(data.map(x=>[x.quote,x.rate])),date:data.map(x=>x.date).sort()[0],checkedAt:Date.now()};})();
   try{await pending}finally{pending=null}
  }
  return new Response(JSON.stringify(cached),{headers});
 }catch{return new Response(JSON.stringify({error:'Cotação indisponível.'}),{status:503,headers:{...headers,'cache-control':'no-store'}})}
}
export const config={path:'/api/exchange-rates'};
