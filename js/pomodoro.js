(function(){
  let seconds=0,timer=null,running=false;
  function render(){
    const settings=AppStorage.load('settings');seconds=settings.pomodoro*60;
    const host=document.getElementById('pomodoro-modal');if(!host)return;
    host.innerHTML=`<div class="modal" id="timer-dialog" role="dialog" aria-modal="true" aria-labelledby="timer-title"><div class="modal-panel pomodoro-mini"><div class="modal-header"><h2 id="timer-title">Sessão de foco</h2><button data-action="close-pomodoro" aria-label="Fechar">×</button></div><p class="card-subtitle">Mantenha o foco em uma tarefa por vez.</p><div class="timer-display" id="timer-display">${format(seconds)}</div><div class="form-group"><label for="timer-discipline">Disciplina</label><select class="select" id="timer-discipline"><option>Método e planejamento</option><option>Língua Portuguesa</option><option>Matemática</option><option>Informática</option><option>Administração Pública</option></select></div><div class="timer-controls"><button class="button button-primary" data-action="timer-start">Iniciar</button><button class="button button-secondary" data-action="timer-reset">Reiniciar</button></div></div></div>`;
  }
  function format(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
  function tick(){if(seconds>0){seconds--;update()}else{clearInterval(timer);running=false;complete()}}
  function update(){const el=document.getElementById('timer-display');if(el)el.textContent=format(seconds)}
  function start(){if(running)return;running=true;timer=setInterval(tick,1000)}
  function reset(){clearInterval(timer);running=false;seconds=AppStorage.load('settings').pomodoro*60;update()}
  function complete(){const duration=AppStorage.load('settings').pomodoro;const discipline=document.getElementById('timer-discipline')?.value||'Geral';AppStorage.update('study_sessions',s=>[...s,{id:Date.now(),date:new Date().toISOString(),discipline,duration,type:'Foco',notes:''}]);window.App?.toast(`Sessão de ${duration} minutos registrada.`,'success');reset()}
  window.Pomodoro={render,start,reset};
})();
