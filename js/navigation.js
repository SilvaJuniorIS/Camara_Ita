(function () {
  'use strict';
  const items = [
    ['dashboard','Visão geral','◫','dashboard.html'],['curso','Meu curso','▤','curso.html'],
    ['capitulo','Capítulos','☷','capitulo.html?id=1'],['exercicios','Exercícios','✓','exercicios.html'],
    ['simulados','Simulados','◉','simulados.html'],['flashcards','Flashcards','◇','flashcards.html'],
    ['planner','Planner','□','planner.html'],['revisoes','Revisões','↻','revisoes.html'],
    ['erros','Caderno de erros','!','caderno-erros.html'],['desempenho','Desempenho','↗','desempenho.html'],
    ['anotacoes','Anotações','✎','anotacoes.html'],['configuracoes','Configurações','⚙','configuracoes.html']
  ];
  function shell(page, content) {
    const user = AppStorage.load('user');
    const progress = AppStorage.load('progress');
    const percent = Math.round((progress.completedChapters.length / 10) * 100);
    const links = items.map(([id,label,icon,href], index) => `${index === 0 || index === 7 || index === 11 ? `<span class="nav-label">${index === 0 ? 'Estudar' : index === 7 ? 'Acompanhar' : 'Sistema'}</span>` : ''}<a class="nav-link ${page === id ? 'active' : ''}" href="${href}"><span class="nav-icon" aria-hidden="true">${icon}</span>${label}</a>`).join('');
    return `<a class="skip-link" href="#main-content">Pular para o conteúdo</a>
      <div class="app-shell"><aside class="sidebar" aria-label="Menu principal"><a class="brand" href="index.html"><span class="brand-mark">AV</span><span><strong>Projeto Aprovação</strong><small>VUNESP • Itanhaém</small></span></a><nav class="sidebar-nav">${links}</nav><div class="sidebar-progress"><div><span>Progresso geral</span><b>${percent}%</b></div><div class="progress"><i style="width:${percent}%"></i></div></div></aside>
      <div class="mobile-overlay" data-action="close-menu"></div><div class="app-main"><header class="topbar"><button class="icon-button menu-toggle" data-action="toggle-menu" aria-label="Abrir menu">☰</button><div class="search"><span>⌕</span><label class="sr-only" for="global-search">Buscar</label><input id="global-search" placeholder="Buscar capítulos, questões e anotações…"></div><div class="top-actions"><button class="icon-button" data-action="open-pomodoro" aria-label="Abrir cronômetro" title="Cronômetro">◷</button><button class="icon-button" data-action="toggle-theme" aria-label="Alternar tema" title="Alternar tema">◐</button><a class="profile-button" href="configuracoes.html"><span class="avatar">${escapeText(user.name).slice(0,2).toUpperCase()}</span><span>${escapeText(user.name)}<small>Meu perfil</small></span></a></div></header><main class="content" id="main-content">${content}</main></div></div>
      <div class="toast-region" role="status" aria-live="polite"></div><button class="back-top" aria-label="Voltar ao topo">↑</button><div id="pomodoro-modal"></div>`;
  }
  function escapeText(value) { const node = document.createElement('span'); node.textContent = String(value ?? ''); return node.innerHTML; }
  window.Navigation = { shell, escapeText };
})();
