(function(){
  'use strict';
  let installPrompt=null;
  function register(){
    if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(error=>console.warn('PWA indisponível:',error));
    window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;document.querySelectorAll('.install-button').forEach(button=>button.hidden=false)});
    window.addEventListener('appinstalled',()=>{AppStorage.update('product',state=>({...state,installed:true,installedAt:new Date().toISOString()}));notify('Aprova360 instalado com sucesso.')});
    document.addEventListener('click',event=>{const button=event.target.closest('[data-action="install-app"]');if(button)install()});
  }
  async function install(){if(!installPrompt)return notify('Use a opção “Instalar aplicativo” do seu navegador.');installPrompt.prompt();await installPrompt.userChoice;installPrompt=null}
  function notify(message){if(window.App?.toast)return App.toast(message,'success');const host=document.querySelector('.toast-region');if(!host)return;const toast=document.createElement('div');toast.className='toast success';toast.textContent=message;host.appendChild(toast);setTimeout(()=>toast.remove(),3500)}
  window.Product={install,notify};document.addEventListener('DOMContentLoaded',register);
})();
