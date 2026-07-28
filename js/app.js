(function(){
  'use strict';
  const page=document.documentElement.dataset.page;
  const $=(s,r=document)=>r.querySelector(s);
  const pages={
    dashboard:()=>Dashboard.page(),curso:()=>Course.coursePage(),capitulo:()=>Course.chapterPage(),
    exercicios:()=>Quiz.exercisesPage(),simulados:()=>Quiz.simulationsPage(),flashcards:()=>Flashcards.page(),
    planner:()=>Planner.page(),revisoes:()=>Course.reviewsPage(),erros:()=>Quiz.errorsPage(),
    desempenho:()=>Performance.page(),anotacoes:()=>Notes.page(),configuracoes:settingsPage
  };
  function init(){
    applySettings();
    setupProduct();
    if(page&&$('#app')){$('#app').innerHTML=Navigation.shell(page,pages[page]());Pomodoro?.render();bind();afterRender()}
    else bindLanding();
  }
  function setupProduct(){
    if(!document.querySelector('link[rel="manifest"]')){const link=document.createElement('link');link.rel='manifest';link.href='manifest.webmanifest';document.head.appendChild(link)}
    if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(error=>console.warn('PWA indisponível:',error));
    window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();window.aprovaInstallPrompt=event;document.querySelectorAll('.install-button').forEach(button=>button.hidden=false)});
    if(new URLSearchParams(location.search).has('welcome'))setTimeout(()=>toast('Seu plano foi criado. Bem-vindo ao Aprova360!','success'),300);
    if(new URLSearchParams(location.search).has('trial'))setTimeout(()=>toast('Demonstração Pro ativa por 7 dias.','success'),300);
  }
  function bindLanding(){document.querySelectorAll('[data-action="toggle-theme"]').forEach(x=>x.addEventListener('click',toggleTheme))}
  function bind(){
    document.addEventListener('click',click);
    document.addEventListener('change',change);
    document.addEventListener('input',input);
    window.addEventListener('scroll',()=>$('.back-top')?.classList.toggle('visible',scrollY>500));
    $('.back-top')?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
    $('#task-form')?.addEventListener('submit',saveTask);
    $('#note-form')?.addEventListener('submit',e=>{e.preventDefault();Notes.save()});
    $('#settings-form')?.addEventListener('submit',saveSettings);
  }
  function afterRender(){
    if(page==='flashcards')Flashcards.init();
    if(page==='dashboard'){
      const grid=document.querySelector('.welcome-banner + .grid.grid-4');
      if(grid&&grid.children.length===1){
        const m=Dashboard.metrics(),p=AppStorage.load('progress');
        const values=[[`${m.progress}%`,'Progresso do curso','↗'],[`${m.hours}h`,'Horas estudadas','◷'],[m.answered,'Questões respondidas','✓'],[`${m.accuracy}%`,'Média de acertos','◎'],[`${m.streak} dias`,'Sequência de estudos','◆'],[m.reviews,'Revisões pendentes','↻'],['18h30','Meta semanal','□'],[`${p.completedChapters.length}/10`,'Capítulos concluídos','▤']];
        grid.replaceChildren(...values.map(([value,label,icon])=>{const card=document.createElement('article');card.className='card stat-card';const symbol=document.createElement('span');symbol.className='stat-icon';symbol.textContent=icon;const body=document.createElement('div'),strong=document.createElement('b'),caption=document.createElement('span');strong.textContent=value;caption.textContent=label;body.append(strong,caption);card.append(symbol,body);return card}));
      }
    }
  }
  function click(e){
    const el=e.target.closest('[data-action]');if(!el)return;const a=el.dataset.action,id=el.dataset.id;
    const handlers={
      'toggle-menu':()=>document.body.classList.toggle('menu-open'),'close-menu':()=>document.body.classList.remove('menu-open'),
      'toggle-theme':toggleTheme,'open-pomodoro':()=>$('#timer-dialog')?.classList.add('open'),'close-pomodoro':()=>$('#timer-dialog')?.classList.remove('open'),'timer-start':()=>Pomodoro.start(),'timer-reset':()=>Pomodoro.reset(),
      'toggle-module':()=>el.closest('.module').classList.toggle('open'),'complete-chapter':()=>completeChapter(Number(id)),
      'answer-question':()=>Quiz.answer(id),'retry-question':()=>Quiz.retry(id),'add-error':()=>Quiz.addError(id),
      'favorite-question':()=>favorite(id),'shuffle-questions':shuffleQuestions,'error-review':()=>editError(Number(id),'revisado'),'error-delete':()=>deleteEntry('errors',Number(id)),
      'export-errors':()=>download('caderno-erros.json',JSON.stringify(AppStorage.load('errors'),null,2)),'print':()=>print(),
      'start-simulation':()=>Quiz.startSimulation(id),'close-simulation':()=>$('#simulation-area').innerHTML='','sim-prev':()=>Quiz.simMove(-1),'sim-next':()=>Quiz.simMove(1),'sim-go':()=>Quiz.simGo(el.dataset.index),'sim-review':()=>Quiz.simReview(),'sim-finish':()=>Quiz.finishSim(),
      'flip-card':()=>Flashcards.flip(),'flash-prev':()=>Flashcards.move(-1),'flash-next':()=>Flashcards.move(1),'rate-card':()=>Flashcards.rate(el.dataset.rate),'shuffle-flashcards':()=>{Flashcards.filter('');toast('Cartões embaralhados.','success')},
      'open-task':()=>$('#task-modal').classList.add('open'),'close-task':()=>$('#task-modal').classList.remove('open'),'task-complete':()=>editTask(Number(id),'concluída'),'task-delete':()=>deleteEntry('schedule',Number(id)),
      'new-note':()=>Notes.open(),'edit-note':()=>Notes.open(id),'close-note':()=>$('#note-modal').classList.remove('open'),'delete-note':()=>deleteEntry('notes',Number(id)),
      'review-complete':()=>editReview(Number(id),'concluída'),'review-delay':()=>delayReview(Number(id)),'review-cancel':()=>editReview(Number(id),'cancelada'),
      'export-all':()=>download('backup-aprova360.json',AppStorage.exportAll()),'import-all':()=>$('#backup-input').click(),'reset-all':resetAll,
      'install-app':async()=>{if(window.aprovaInstallPrompt){window.aprovaInstallPrompt.prompt();await window.aprovaInstallPrompt.userChoice;window.aprovaInstallPrompt=null}else toast('Use a opção “Instalar aplicativo” do navegador.','success')}
    };handlers[a]?.()
  }
  function change(e){
    if(e.target.matches('#flash-filter'))Flashcards.filter(e.target.value);
    if(e.target.matches('.error-reason')){const id=Number(e.target.dataset.id);AppStorage.update('errors',x=>x.map(v=>v.id===id?{...v,reason:e.target.value}:v));toast('Classificação atualizada.','success')}
    if(e.target.matches('#backup-input'))importBackup(e.target.files[0]);
    if(e.target.matches('#filter-discipline,#filter-topic,#filter-level,#filter-status'))filterQuestions();
  }
  function input(e){if(e.target.matches('.reflection')){const key=e.target.dataset.key;AppStorage.update('reflections',r=>({...r,[key]:e.target.value}));const s=$('#reflection-status');if(s)s.textContent='Salvo agora ✓'}}
  function completeChapter(id){AppStorage.update('progress',p=>({...p,completedChapters:[...new Set([...p.completedChapters,id])],lastChapter:id}));const title=CourseData.modules[0].chapters[id-1],base=new Date();AppStorage.update('reviews',r=>{const add=[['24 horas',1],['7 dias',7],['30 dias',30]].filter(()=>!r.some(x=>x.chapterId===id)).map(([interval,days],i)=>{const due=new Date(base);due.setDate(due.getDate()+days);return{id:Date.now()+i,chapterId:id,title,interval,due:due.toISOString().slice(0,10),status:'pendente'}});return[...r,...add]});toast('Capítulo concluído e revisões programadas.','success')}
  function favorite(id){AppStorage.update('questions',q=>({...q,[id]:{...(q?.[id]||{}),favorite:!q?.[id]?.favorite}}));toast('Favorito atualizado.','success')}
  function filterQuestions(){const d=$('#filter-discipline').value,t=$('#filter-topic').value,l=$('#filter-level').value,s=$('#filter-status').value,a=AppStorage.load('answers'),f=AppStorage.load('questions')||{};document.querySelectorAll('.question-card').forEach(card=>{const q=QuestionsData.find(x=>x.id===card.dataset.question);const visible=(!d||q.discipline===d)&&(!t||q.topic===t)&&(!l||q.level===l)&&(!s||(s==='answered'&&a[q.id])||(s==='unanswered'&&!a[q.id])||(s==='wrong'&&a[q.id]&&!a[q.id].correct)||(s==='favorite'&&f[q.id]?.favorite));card.hidden=!visible})}
  function shuffleQuestions(){const host=$('#question-list');[...host.children].sort(()=>Math.random()-.5).forEach(x=>host.appendChild(x))}
  function editError(id,status){AppStorage.update('errors',x=>x.map(v=>v.id===id?{...v,status}:v));location.reload()}
  function deleteEntry(name,id){if(AppStorage.load('settings').confirmDelete&&!confirm('Deseja excluir este item?'))return;AppStorage.update(name,x=>x.filter(v=>v.id!==id));location.reload()}
  function editTask(id,status){AppStorage.update('schedule',x=>x.map(v=>v.id===id?{...v,status}:v));location.reload()}
  function saveTask(e){e.preventDefault();const t={id:Date.now(),date:$('#task-date').value,title:$('#task-title').value.trim(),discipline:$('#task-discipline').value.trim(),duration:Number($('#task-duration').value),type:$('#task-type').value,priority:'normal',status:'pendente',notes:$('#task-notes').value.trim()};AppStorage.update('schedule',x=>[t,...x]);location.reload()}
  function editReview(id,status){AppStorage.update('reviews',x=>x.map(v=>v.id===id?{...v,status}:v));location.reload()}function delayReview(id){AppStorage.update('reviews',x=>x.map(v=>{if(v.id!==id)return v;const d=new Date(v.due+'T12:00:00');d.setDate(d.getDate()+1);return{...v,due:d.toISOString().slice(0,10)}}));location.reload()}
  function toggleTheme(){const s=AppStorage.load('settings');s.theme=s.theme==='dark'?'light':'dark';AppStorage.save('settings',s);applySettings()}
  function applySettings(){const s=AppStorage.load('settings');document.documentElement.dataset.theme=s.theme;document.body?.classList.toggle('font-large',s.fontSize==='large')}
  function settingsPage(){const s=AppStorage.load('settings'),u=AppStorage.load('user');return `<div class="page-heading"><div><span class="eyebrow">Personalize sua rotina</span><h1>Configurações</h1><p>Metas, aparência, cronômetro e segurança dos seus dados.</p></div></div><form id="settings-form"><div class="grid grid-2"><section class="card"><div class="card-header"><h2>Perfil e metas</h2></div><div class="form-group"><label for="setting-name">Nome do estudante</label><input class="input" id="setting-name" value="${Navigation.escapeText(u.name)}"></div><div class="field-row"><div class="form-group"><label for="setting-hours">Meta semanal (horas)</label><input class="input" type="number" step=".5" id="setting-hours" value="${s.weeklyHours}"></div><div class="form-group"><label for="setting-questions">Meta de questões</label><input class="input" type="number" id="setting-questions" value="${s.questionGoal}"></div></div><div class="form-group"><label for="setting-pomodoro">Pomodoro (minutos)</label><input class="input" type="number" min="1" id="setting-pomodoro" value="${s.pomodoro}"></div></section><section class="card"><div class="card-header"><h2>Aparência e avisos</h2></div><div class="form-group"><label for="setting-theme">Tema</label><select class="select" id="setting-theme"><option value="light" ${s.theme==='light'?'selected':''}>Claro</option><option value="dark" ${s.theme==='dark'?'selected':''}>Escuro</option></select></div><div class="form-group"><label for="setting-font">Tamanho da fonte</label><select class="select" id="setting-font"><option value="normal">Normal</option><option value="large" ${s.fontSize==='large'?'selected':''}>Grande</option></select></div>${[['setting-sounds','Sons',s.sounds],['setting-notifications','Notificações',s.notifications],['setting-animations','Animações',s.animations],['setting-confirm','Confirmar antes de excluir',s.confirmDelete]].map(([id,l,v])=>`<label class="check-row"><input type="checkbox" id="${id}" ${v?'checked':''}> ${l}</label>`).join('')}</section></div><button class="button button-primary" type="submit" style="margin-top:18px">Salvar configurações</button></form><section class="card" style="margin-top:18px"><div class="card-header"><div><h2>Dados e backup</h2><span class="card-subtitle">Seus dados ficam somente neste navegador.</span></div></div><div class="button-row"><button class="button button-secondary" data-action="export-all">Exportar backup JSON</button><button class="button button-secondary" data-action="import-all">Importar backup</button><input type="file" id="backup-input" accept=".json" hidden><button class="button button-danger" data-action="reset-all">Redefinir plataforma</button></div></section>`}
  function saveSettings(e){e.preventDefault();AppStorage.save('user',{...AppStorage.load('user'),name:$('#setting-name').value.trim()||'Estudante'});AppStorage.save('settings',{...AppStorage.load('settings'),weeklyHours:Number($('#setting-hours').value),questionGoal:Number($('#setting-questions').value),pomodoro:Number($('#setting-pomodoro').value),theme:$('#setting-theme').value,fontSize:$('#setting-font').value,sounds:$('#setting-sounds').checked,notifications:$('#setting-notifications').checked,animations:$('#setting-animations').checked,confirmDelete:$('#setting-confirm').checked});toast('Configurações salvas.','success');setTimeout(()=>location.reload(),400)}
  async function importBackup(file){if(!file)return;try{AppStorage.importAll(await file.text());toast('Backup importado.','success');setTimeout(()=>location.reload(),500)}catch(err){toast(err.message,'error')}}
  function resetAll(){if(!confirm('Isso apagará todo o progresso local. Deseja continuar?'))return;AppStorage.reset();location.href='dashboard.html'}
  function download(name,text){const blob=new Blob([text],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
  function toast(message,type='success'){const host=$('.toast-region');if(!host)return;const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=message;host.appendChild(el);setTimeout(()=>el.remove(),3500)}
  window.App={toast};document.addEventListener('DOMContentLoaded',init);
})();
