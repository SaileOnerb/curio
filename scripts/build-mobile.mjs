import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
const output=new URL('../mobile-dist/',import.meta.url);
const root=new URL('../',import.meta.url);
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
let html=await readFile(new URL('index-online.html',root),'utf8');
const api="fetch('/api/product-preview'";
if(!html.includes(api))throw new Error('Endpoint de análise mudou: revise o build Android.');
html=html.replace(api,"fetch('https://curiocollection.com.br/api/product-preview'");
html=html.replace('</body>','<script src="./native.js"></script></body>');
await writeFile(new URL('index.html',output),html);
let data=await readFile(new URL('online-data.js',root),'utf8');
const redirect='function redirectTo(){';
if(!data.includes(redirect))throw new Error('Redirect de autenticação mudou.');
data=data.replace(redirect,redirect+"\n    if(window.Capacitor?.isNativePlatform())return 'https://curiocollection.com.br/';");
await writeFile(new URL('online-data.js',output),data);
await cp(new URL('icons/',root),new URL('icons/',output),{recursive:true});
await cp(new URL('platform-ui.js',root),new URL('platform-ui.js',output));
await cp(new URL('platform-swipe.js',root),new URL('platform-swipe.js',output));
await cp(new URL('manifest.webmanifest',root),new URL('manifest.webmanifest',output));
await build({entryPoints:[fileURLToPath(new URL('../mobile/native.js',import.meta.url))],outfile:fileURLToPath(new URL('native.js',output)),bundle:true,format:'iife',target:'es2022'});
console.log('Interface Android preparada em mobile-dist.');

await cp(new URL('platform-i18n.js',root),new URL('platform-i18n.js',output));

await cp(new URL('platform-currency.js',root),new URL('platform-currency.js',output));
