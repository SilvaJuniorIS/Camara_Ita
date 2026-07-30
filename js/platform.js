(function () {
  'use strict';
  const DB_KEY = 'knowledge_base';
  const PLAN_KEY = 'adaptive_plan';

  const clone = value => JSON.parse(JSON.stringify(value));
  const esc = value => Navigation.escapeText(value ?? '');
  const statusLabel = value => ({
    awaiting_official_notice: 'Aguardando edital',
    provisional: 'Provisório',
    confirmed_in_etp: 'Confirmado no ETP',
    reference_ready: 'Base preparada',
    awaiting_verified_import: 'Aguardando importação',
    awaiting_identification: 'A identificar'
  }[value] || value);

  function database() {
    const saved = AppStorage.load(DB_KEY, null);
    if (!saved || Number(saved.schemaVersion) < Number(PlatformSeed.schemaVersion)) {
      AppStorage.save(DB_KEY, clone(PlatformSeed));
      return clone(PlatformSeed);
    }
    return saved;
  }
  function saveDatabase(value) {
    value.updatedAt = new Date().toISOString();
    AppStorage.save(DB_KEY, value);
    return value;
  }
  function allTopics(db = database()) {
    return db.disciplines.flatMap(discipline => discipline.topics.map(item => ({ ...item, disciplineId: discipline.id, disciplineName: discipline.name })));
  }
  function subjectsForPosition(positionId, db = database()) {
    const ids = db.positionDisciplineMap[positionId] || db.disciplines.map(item => item.id);
    return ids.map(id => db.disciplines.find(item => item.id === id)).filter(Boolean);
  }
  function number(value) { return new Intl.NumberFormat('pt-BR').format(value); }
  function money(value) { return value == null ? 'Aguardando edital' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value); }

  function page() {
    const db = database();
    const topicCount = allTopics(db).length;
    const positionRows = db.positions.map(item => `<tr><td><b>${esc(item.name)}</b></td><td>${esc(item.education)}</td><td>${item.vacancies}</td><td>${item.weeklyHours}h</td><td>${money(item.remuneration)}</td><td><span class="badge ${item.remuneration == null ? 'warning' : 'success'}">${statusLabel(item.remunerationStatus)}</span></td></tr>`).join('');
    const disciplineCards = db.disciplines.map(item => `<article class="card knowledge-card"><span class="knowledge-color" style="background:${item.color}"></span><div><span class="badge warning">Base provisória</span><h3>${esc(item.name)}</h3><p>${item.topics.length} assuntos · ${item.topics.reduce((sum, current) => sum + current.subtopics.length, 0)} subassuntos</p><details><summary>Ver conteúdo</summary><ul>${item.topics.map(current => `<li><b>${esc(current.name)}</b><span>${current.subtopics.map(esc).join(' · ')}</span></li>`).join('')}</ul></details></div></article>`).join('');
    return `<div class="page-heading"><div><span class="eyebrow">Concurso monitorado</span><h1>Câmara de Itanhaém · VUNESP</h1><p>Base orientada a dados, pronta para receber o edital oficial sem alterar o código.</p></div><div class="page-actions"><a class="button button-secondary" href="banca.html">Perfil VUNESP</a><a class="button button-primary" href="edital.html">Importar edital</a></div></div>
      <div class="official-alert"><div><span class="badge warning">Pré-edital</span><b>O edital ainda não foi publicado</b><p>Vagas, cargos, jornada e estrutura mínima da prova foram confirmados em fontes oficiais. Conteúdos e pesos permanecem provisórios.</p></div><a href="${db.sources[0].url}" target="_blank" rel="noopener">Ver comunicado oficial ↗</a></div>
      <div class="grid grid-4">${metric(number(db.contest.totalVacancies), 'Vagas imediatas'), metric(number(db.contest.totalPositions), 'Cargos'), metric(`${db.contest.weeklyHours}h`, 'Jornada semanal'), metric(`${db.contest.objectiveTest.minimumQuestions}+`, 'Questões na prova')}</div>
      <section class="card section-card"><div class="card-header"><div><h2>Quadro oficial de cargos</h2><span class="card-subtitle">Escolaridade e requisitos confirmados no ETP; vencimento individual aguarda edital.</span></div><span class="badge success">27 vagas conferidas</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Cargo</th><th>Escolaridade</th><th>Vagas</th><th>Jornada</th><th>Remuneração</th><th>Situação</th></tr></thead><tbody>${positionRows}</tbody></table></div></section>
      <section class="section-card"><div class="page-heading compact"><div><span class="eyebrow">Matriz provisória</span><h2>${db.disciplines.length} disciplinas · ${topicCount} assuntos</h2><p>Priorização baseada no perfil VUNESP e em concursos legislativos municipais; será substituída pela matriz oficial após validação do edital.</p></div></div><div class="knowledge-grid">${disciplineCards}</div></section>
      <section class="grid grid-3 section-card">${sourceCard(db.sources[0])}${sourceCard(db.sources[1])}${sourceCard(db.sources[2])}</section>`;
  }
  function metric(value, label) { return `<article class="card stat-card"><span class="stat-icon">✓</span><div><b>${value}</b><span>${label}</span></div></article>`; }
  function sourceCard(item) { return `<article class="card source-card"><span class="badge success">Fonte oficial</span><h3>${esc(item.title)}</h3><p>Publicado em ${new Date(item.publishedAt + 'T12:00:00').toLocaleDateString('pt-BR')}.</p><a href="${item.url}" target="_blank" rel="noopener">Abrir documento ↗</a></article>`; }

  function boardPage() {
    const db = database(), profile = db.boardProfile;
    const questions = window.QuestionsData || [];
    const distribution = Object.entries(questions.reduce((acc, item) => { acc[item.discipline] = (acc[item.discipline] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]);
    return `<div class="page-heading"><div><span class="eyebrow">Perfil da banca</span><h1>Como a VUNESP cobra</h1><p>Estratégia aplicada ao conteúdo da Câmara, separando fatos confirmados de tendências históricas.</p></div><div class="page-actions"><a class="button button-primary" href="professor.html">Abrir modo professor</a></div></div>
      <div class="grid grid-4">${metric('5', 'Alternativas usuais')}${metric('Alta', 'Carga de interpretação')}${metric('Média/alta', 'Lei seca em Direito')}${metric('≥ 60%', 'Conhecimentos específicos')}</div>
      <div class="grid grid-2 section-card"><article class="card"><div class="card-header"><h2>Características</h2><span class="badge">VUNESP</span></div><ul class="insight-list">${profile.characteristics.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article><article class="card"><div class="card-header"><h2>Forma de cobrança</h2><span class="badge warning">Estratégia</span></div><ul class="insight-list">${profile.chargingStyle.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article></div>
      <div class="grid grid-2 section-card"><article class="card"><div class="card-header"><div><h2>Distribuição do banco local</h2><span class="card-subtitle">Não representa estatística oficial da banca.</span></div></div>${distribution.length ? distribution.map(([name, count]) => `<div class="distribution-row"><span>${esc(name)}</span><div class="progress"><i style="width:${Math.round(count / questions.length * 100)}%"></i></div><b>${count}</b></div>`).join('') : '<div class="empty-state">Sem questões cadastradas.</div>'}</article><article class="card"><div class="card-header"><h2>Checklist de resolução</h2></div><ol class="numbered-list"><li>Leia primeiro o comando e identifique o que deve ser julgado.</li><li>Volte ao texto ou à regra procurando a evidência exata.</li><li>Elimine alternativas absolutas ou que misturam conceitos.</li><li>Compare as duas últimas opções palavra por palavra.</li><li>Registre o motivo do erro, não apenas o gabarito.</li></ol></article></div>`;
  }

  function professorPage() {
    const db = database();
    const options = allTopics(db).map(item => `<option value="${item.disciplineId}|${item.id}">${esc(item.disciplineName)} — ${esc(item.name)}</option>`).join('');
    return `<div class="page-heading"><div><span class="eyebrow">Modo professor</span><h1>Professor VUNESP</h1><p>Explicações, erros frequentes, revisão ativa e exercícios gerados a partir da base cadastrada.</p></div></div>
      <div class="grid grid-2"><article class="card teacher-controls"><div class="form-group"><label for="teacher-topic">Assunto</label><select class="select" id="teacher-topic">${options}</select></div><div class="teacher-actions"><button class="button button-primary" data-teacher-action="explain">Explique como a VUNESP cobra</button><button class="button button-secondary" data-teacher-action="questions">Gere 20 questões semelhantes</button><button class="button button-secondary" data-teacher-action="mistakes">Quais erros os candidatos cometem?</button><button class="button button-secondary" data-teacher-action="review">Criar revisão e flashcards</button></div><p class="card-subtitle">O modo local não envia dados a serviços externos. A arquitetura aceita um provedor de IA quando ele for conectado.</p></article><article class="card teacher-output" id="teacher-output" aria-live="polite"><div class="empty-state"><b>Escolha uma ação.</b><p>O professor usará disciplina, assunto e subassuntos cadastrados.</p></div></article></div>`;
  }
  function teacherAction(action) {
    const [disciplineId, topicId] = document.getElementById('teacher-topic').value.split('|');
    const db = database(), discipline = db.disciplines.find(item => item.id === disciplineId), item = discipline.topics.find(topicItem => topicItem.id === topicId);
    const output = document.getElementById('teacher-output');
    const common = `<span class="badge">VUNESP</span><h2>${esc(discipline.name)} · ${esc(item.name)}</h2>`;
    if (action === 'explain') output.innerHTML = `${common}<p>A VUNESP tende a apresentar o conceito em contexto e trocar um elemento da regra por outro plausível. Neste assunto, domine <b>${item.subtopics.map(esc).join(', ')}</b>.</p><h3>Estratégia</h3><ol class="numbered-list"><li>Identifique a regra central.</li><li>Sublinhe restrições e exceções do comando.</li><li>Teste cada alternativa contra a regra, sem completar o texto por intuição.</li></ol>`;
    if (action === 'mistakes') output.innerHTML = `${common}<h3>Erros mais prováveis</h3><ul class="insight-list"><li>Responder pelo tema geral sem atender ao comando.</li><li>Confundir conceito principal com uma exceção.</li><li>Ignorar palavras como “sempre”, “somente” ou “incorreta”.</li><li>Não revisar o motivo do erro após consultar o gabarito.</li></ul>`;
    if (action === 'review') {
      const cards = item.subtopics.map((subtopic, index) => ({ id: `generated-${topicId}-${Date.now()}-${index}`, front: `${item.name}: o que revisar em ${subtopic}?`, back: `Definição, aplicação, exceções e uma questão no padrão VUNESP.`, discipline: discipline.name, topic: item.name, generated: true }));
      AppStorage.update('generated_flashcards', list => [...(list || []), ...cards]);
      output.innerHTML = `${common}<h3>Revisão criada</h3><p>${cards.length} flashcards adicionados. Revise em 24 horas, 7 dias e 30 dias.</p><ul class="insight-list">${cards.map(card => `<li><b>${esc(card.front)}</b><br>${esc(card.back)}</li>`).join('')}</ul>`;
    }
    if (action === 'questions') {
      const generated = Array.from({ length: 20 }, (_, index) => {
        const subtopic = item.subtopics[index % item.subtopics.length];
        return { id: `GEN-${topicId}-${Date.now()}-${index}`, discipline: discipline.name, disciplineId, topic: item.name, topicId, subtopic, statement: `No contexto de ${item.name}, assinale a alternativa que apresenta corretamente um aspecto de ${subtopic}.`, options: [`A definição e a aplicação de ${subtopic} devem ser verificadas conforme a regra estudada.`, `${subtopic} nunca admite análise do contexto.`, `${subtopic} é sinônimo de qualquer outro conceito da disciplina.`, `${subtopic} não pode ser objeto de questão objetiva.`, `Todas as alternativas anteriores estão corretas.`], correct: 0, comment: `Revise a definição, a aplicação e as exceções de ${subtopic}.`, level: index % 3 === 0 ? 'Médio' : 'Fácil', generated: true };
      });
      AppStorage.save('generated_questions', generated);
      output.innerHTML = `${common}<h3>20 exercícios de treino gerados</h3><p>Os itens são modelos autorais locais, não questões oficiais da VUNESP.</p><ol class="numbered-list">${generated.slice(0, 5).map(q => `<li>${esc(q.statement)}</li>`).join('')}</ol><p class="card-subtitle">Amostra de 5 itens exibida; os 20 foram salvos na base local.</p>`;
    }
  }

  function studyPlanPage() {
    const db = database();
    const positionOptions = db.positions.map(item => `<option value="${item.id}">${esc(item.name)}</option>`).join('');
    const current = AppStorage.load(PLAN_KEY, null);
    return `<div class="page-heading"><div><span class="eyebrow">Plano adaptativo</span><h1>Seu cronograma automático</h1><p>Distribuição diária por cargo, disponibilidade e data desejada, com revisões em 24h, 7 e 30 dias.</p></div></div>
      <div class="grid grid-3"><article class="card"><form id="adaptive-plan-form"><div class="form-group"><label for="plan-position">Cargo</label><select class="select" id="plan-position">${positionOptions}</select></div><div class="form-group"><label for="plan-hours">Horas por dia</label><input class="input" id="plan-hours" type="number" min="0.5" max="12" step="0.5" value="2"></div><div class="form-group"><label for="plan-date">Data desejada</label><input class="input" id="plan-date" type="date" required value="${new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10)}"></div><button class="button button-primary" type="submit">Gerar plano</button></form></article><article class="card span-2" id="adaptive-plan-output">${current ? renderPlan(current) : '<div class="empty-state"><b>Informe sua rotina.</b><p>O plano alterna teoria, questões e revisões pela curva do esquecimento.</p></div>'}</article></div>`;
  }
  function createPlan(positionId, hours, targetDate) {
    const db = database(), subjects = subjectsForPosition(positionId, db), start = new Date(), end = new Date(`${targetDate}T12:00:00`);
    const days = Math.max(1, Math.ceil((end - start) / 86400000));
    const sessions = [];
    for (let day = 0; day < days; day += 1) {
      const date = new Date(start); date.setDate(start.getDate() + day);
      const discipline = subjects[day % subjects.length];
      const currentTopic = discipline.topics[Math.floor(day / subjects.length) % discipline.topics.length];
      const totalMinutes = Math.round(hours * 60);
      sessions.push({ date: date.toISOString().slice(0, 10), discipline: discipline.name, topic: currentTopic.name, theoryMinutes: Math.round(totalMinutes * .55), questionsMinutes: Math.round(totalMinutes * .3), reviewMinutes: totalMinutes - Math.round(totalMinutes * .55) - Math.round(totalMinutes * .3), reviews: [1, 7, 30].filter(offset => day - offset >= 0).map(offset => `${offset === 1 ? '24h' : `${offset}d`}: ${sessions[day - offset]?.topic || ''}`) });
    }
    const result = { id: Date.now(), createdAt: new Date().toISOString(), positionId, hoursPerDay: hours, targetDate, days, sessions };
    AppStorage.save(PLAN_KEY, result);
    AppStorage.save('schedule', sessions.map((session, index) => ({ id: result.id + index, date: session.date, title: `Teoria e questões — ${session.topic}`, discipline: session.discipline, duration: Math.round(hours * 60), type: 'plano adaptativo', priority: index % 7 === 0 ? 'alta' : 'normal', status: 'pendente', notes: session.reviews.join(' · ') })));
    return result;
  }
  function renderPlan(plan) {
    const db = database(), position = db.positions.find(item => item.id === plan.positionId);
    return `<div class="card-header"><div><h2>${esc(position?.name)}</h2><span class="card-subtitle">${plan.days} dias · ${plan.hoursPerDay}h por dia</span></div><span class="badge success">Plano ativo</span></div><div class="plan-week">${plan.sessions.slice(0, 7).map(session => `<article><time>${new Date(session.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })}</time><b>${esc(session.discipline)}</b><span>${esc(session.topic)}</span><small>${session.theoryMinutes}m teoria · ${session.questionsMinutes}m questões · ${session.reviewMinutes}m revisão</small>${session.reviews.length ? `<em>${session.reviews.map(esc).join(' · ')}</em>` : ''}</article>`).join('')}</div>`;
  }

  function legislationPage() {
    const db = database();
    return `<div class="page-heading"><div><span class="eyebrow">Legislação comentada</span><h1>Base legal</h1><p>Estrutura por norma e artigo para resumos, anotações, flashcards e questões relacionadas.</p></div><div class="page-actions"><button class="button button-primary" data-action="import-law">Importar lei em JSON</button><input id="law-input" type="file" accept=".json" hidden></div></div><div class="knowledge-grid">${db.legislation.map(law => `<article class="card knowledge-card"><div><span class="badge ${law.articles.length ? 'success' : 'warning'}">${statusLabel(law.status)}</span><h3>${esc(law.title)}</h3><p>${law.articles.length} artigos cadastrados</p><ul class="entity-features"><li>Comentários e resumos</li><li>Anotações pessoais</li><li>Flashcards vinculados</li><li>Questões relacionadas</li></ul></div></article>`).join('')}</div>`;
  }
  async function importLaw(file) {
    if (!file) return;
    const payload = JSON.parse(await file.text());
    if (!payload.id || !payload.title || !Array.isArray(payload.articles)) throw new Error('Arquivo de legislação inválido.');
    const db = database(), index = db.legislation.findIndex(item => item.id === payload.id);
    const normalized = { ...payload, status: 'imported', articles: payload.articles.map(article => ({ id: article.id || article.number, number: article.number, text: article.text, comments: article.comments || [], summary: article.summary || '', notes: article.notes || [], flashcardIds: article.flashcardIds || [], questionIds: article.questionIds || [] })) };
    if (index >= 0) db.legislation[index] = normalized; else db.legislation.push(normalized);
    saveDatabase(db);
  }

  window.Platform = { database, saveDatabase, page, boardPage, professorPage, teacherAction, studyPlanPage, createPlan, renderPlan, legislationPage, importLaw, allTopics, subjectsForPosition };
})();
