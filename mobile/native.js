import {Capacitor} from '@capacitor/core';
import {App} from '@capacitor/app';
import {Browser} from '@capacitor/browser';
import {Filesystem,Directory} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';
if(Capacitor.isNativePlatform()){
 document.documentElement.classList.add('curio-native');

 App.addListener('backButton',async()=>{
  const dialog=document.querySelector('#curioDialog:not([hidden])');
  if(dialog){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));return;}
  const modals=[...document.querySelectorAll('.modal.on')];
  const modal=modals.at(-1);
  if(modal){const close=modal.querySelector('.close');if(close)close.click();return;}
  if(await curioConfirm('Sair do CURIÓ?'))await App.exitApp();
 });
 // Arquivos gerados pelo app são compartilhados pelo seletor Android.
 const originalClick=HTMLAnchorElement.prototype.click;
 async function saveBackup(anchor){
  const response=await fetch(anchor.href);const blob=await response.blob();
  const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=reject;reader.readAsDataURL(blob);});
  const name=(anchor.download||'curio-backup.json').replace(/[^\w.\-]/g,'_');
  const file=await Filesystem.writeFile({path:name,data:base64,directory:Directory.Cache});
  await Share.share({title:'Backup do CURIÓ',files:[file.uri]});
 }
 HTMLAnchorElement.prototype.click=function(){
  if(this.download&&this.href.startsWith('blob:')){
   saveBackup(this).catch(()=>curioAlert('Não foi possível compartilhar o backup. Tente novamente.'));return;
  }
  return originalClick.call(this);
 };
 document.addEventListener('click',event=>{
  const anchor=event.target.closest?.('a[href]');if(!anchor||anchor.download)return;
  const url=new URL(anchor.href,location.href);
  if(url.protocol==='https:'&&url.origin!==location.origin){event.preventDefault();Browser.open({url:url.href}).catch(()=>curioAlert('Não foi possível abrir o link.'));}
 },true);
}
