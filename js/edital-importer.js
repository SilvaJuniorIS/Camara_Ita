(function () {
  'use strict';
  let pending = null;
  const esc = value => Navigation.escapeText(value ?? '');
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  const capture = (text, expression) => normalize(text.match(expression)?.[1] || '');
  const dateMatches = text => [...new Set((text.match(/\b(?:0?[1-9]|[12]\d|3[01])\/(?:0?[1-9]|1[0-2])\/20\d{2}\b/g) || []))];

  function page() {
    const db = Platform.database();
    const history = db.importHistory || [];
    return `<div class="page-heading"><div><span class="eyebrow">Atualização sem código</span><h1>Importador do edital</h1><p>Extraia o PDF, revise as alterações detectadas e só então substitua a base provisória.</p></div></div>
      <div class="official-alert"><div><span class="badge warning">${db.contest.officialNoticePublished ? 'Edital carregado' : 'Aguardando edital'}</span><b>Fluxo seguro em três etapas</b><p>1. Extração local · 2. Conferência humana · 3. Aplicação e histórico.</p></div><button class="button button-secondary" data-edital-action="export">Exportar base atual</button></div>
      <div class="grid grid-3"><article class="card"><div class="drop-zone"><b>Selecione o edital oficial</b><p>PDF pesquisável ou pacote JSON validado.</p><input id="edital-file" type="file" accept=".pdf,.json,application/pdf,application/json"><label class="button button-primary" for="edital-file">Escolher arquivo</label><small>O PDF é processado no navegador.</small></div></article><article class="card span-2" id="edital-preview"><div class="empty-state"><b>Nenhum arquivo analisado.</b><p>A base provisória continuará ativa até você confirmar a importação.</p></div></article></div>
      <section class="card section-card"><div class="card-header"><div><h2>Histórico de importações</h2><span class="card-subtitle">Rastreabilidade de cada atualização aplicada.</span></div></div>${history.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Arquivo</th><th>Data</th><th>Tipo</th><th>Campos</th></tr></thead><tbody>${history.map(item => `<tr><td>${esc(item.fileName)}</td><td>${new Date(item.importedAt).toLocaleString('pt-BR')}</td><td>${esc(item.type)}</td><td>${item.detectedFields}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state"><b>Sem importações.</b><p>O histórico começa quando o edital oficial for aplicado.</p></div>'}</section>`;
  }

  async function readPdf(file) {
    if (!window.pdfjsLib) throw new Error('O leitor de PDF não pôde ser carregado. Tente novamente com internet ou importe o JSON.');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const documentData = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: documentData }).promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map(item => item.str).join(' '));
    }
    return pages.join('\n');
  }

  function detect(text, fileName) {
    const upper = text.toUpperCase();
    const sections = {
      disciplines: capture(text, /(?:CONTEÚDO PROGRAMÁTICO|CONHECIMENTOS GERAIS)([\s\S]{0,12000}?)(?:CRONOGRAMA|DAS PROVAS|ANEXO|$)/i),
      schedule: capture(text, /(?:CRONOGRAMA)([\s\S]{0,6000}?)(?:ANEXO|CONTEÚDO|$)/i),
      requirements: capture(text, /(?:REQUISITOS|ESCOLARIDADE)([\s\S]{0,5000}?)(?:ATRIBUIÇÕES|VENCIMENTO|$)/i),
      tests: capture(text, /(?:DAS PROVAS|PROVAS OBJETIVAS)([\s\S]{0,6000}?)(?:CRITÉRIOS|DESEMPATE|$)/i),
      tieBreak: capture(text, /(?:CRITÉRIOS DE DESEMPATE|DESEMPATE)([\s\S]{0,3000}?)(?:RESULTADO|RECURSOS|$)/i),
      titles: capture(text, /(?:PROVA DE TÍTULOS|AVALIAÇÃO DE TÍTULOS)([\s\S]{0,3000}?)(?:RESULTADO|RECURSOS|$)/i),
      physicalTest: capture(text, /(?:TESTE DE APTIDÃO FÍSICA|TAF)([\s\S]{0,3000}?)(?:RESULTADO|RECURSOS|$)/i)
    };
    const detected = {
      fileName, type: 'official_notice_pdf', extractedAt: new Date().toISOString(),
      textLength: text.length, dates: dateMatches(text),
      boardFound: upper.includes('VUNESP'),
      organizationFound: upper.includes('ITANHAÉM') && upper.includes('CÂMARA'),
      sections
    };
    detected.detectedFields = Object.values(sections).filter(Boolean).length + (detected.dates.length ? 1 : 0);
    return detected;
  }

  function preview(result) {
    pending = result;
    const sectionRows = Object.entries(result.sections || {}).map(([key, value]) => {
      const labels = { disciplines: 'Disciplinas e conteúdo', schedule: 'Cronograma', requirements: 'Requisitos', tests: 'Provas', tieBreak: 'Desempate', titles: 'Títulos', physicalTest: 'TAF' };
      return `<tr><td>${labels[key]}</td><td><span class="badge ${value ? 'success' : 'warning'}">${value ? 'Detectado' : 'Não localizado'}</span></td><td>${value ? esc(value.slice(0, 180)) + (value.length > 180 ? '…' : '') : 'Conferir manualmente no documento'}</td></tr>`;
    }).join('');
    document.getElementById('edital-preview').innerHTML = `<div class="card-header"><div><h2>Prévia da extração</h2><span class="card-subtitle">${esc(result.fileName)} · ${result.detectedFields || 0} grupos detectados</span></div><span class="badge ${result.organizationFound === false ? 'danger' : 'success'}">${result.organizationFound === false ? 'Órgão não confirmado' : 'Pronto para revisão'}</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Campo</th><th>Situação</th><th>Amostra</th></tr></thead><tbody>${sectionRows}</tbody></table></div><p class="card-subtitle">Datas encontradas: ${(result.dates || []).map(esc).join(' · ') || 'nenhuma'}. A aplicação não é automática: confirme após comparar com o PDF.</p><div class="button-row"><button class="button button-primary" data-edital-action="apply">Confirmar e aplicar</button><button class="button button-secondary" data-edital-action="cancel">Cancelar</button></div>`;
  }

  async function fileSelected(file) {
    if (!file) return;
    const target = document.getElementById('edital-preview');
    target.innerHTML = '<div class="empty-state"><b>Analisando arquivo…</b><p>Extraindo campos do edital para sua conferência.</p></div>';
    try {
      if (file.name.toLowerCase().endsWith('.json')) {
        const payload = JSON.parse(await file.text());
        pending = payload;
        if (payload.schemaVersion && payload.contest) {
          preview({ fileName: file.name, type: 'validated_json', detectedFields: Object.keys(payload).length, dates: [], organizationFound: true, sections: { disciplines: `${payload.disciplines?.length || 0} disciplinas`, schedule: `${payload.timeline?.length || 0} eventos`, requirements: `${payload.positions?.length || 0} cargos`, tests: payload.contest?.objectiveTest ? 'Estrutura de prova incluída' : '', tieBreak: '', titles: '', physicalTest: '' }, fullDatabase: payload });
        } else throw new Error('JSON sem a estrutura de dados esperada.');
      } else {
        const text = await readPdf(file);
        preview(detect(text, file.name));
      }
    } catch (error) {
      target.innerHTML = `<div class="empty-state"><b>Não foi possível analisar.</b><p>${esc(error.message)}</p></div>`;
    }
  }

  function apply() {
    if (!pending) return;
    let db = pending.fullDatabase ? pending.fullDatabase : Platform.database();
    if (!pending.fullDatabase) {
      db.provisional = false;
      db.publicationStatus = 'official_notice_imported';
      db.contest.officialNoticePublished = true;
      db.contest.officialNoticeImportedAt = new Date().toISOString();
      db.contest.officialNoticeFileName = pending.fileName;
      db.timeline = (pending.dates || []).map((date, index) => ({ id: `edital-date-${index}`, date, source: pending.fileName, status: 'needs_label_review' }));
      db.officialNoticeExtraction = pending.sections;
      db.disciplines = db.disciplines.map(item => ({ ...item, status: pending.sections.disciplines ? 'official_notice_pending_structured_review' : item.status }));
    }
    db.importHistory = [...(db.importHistory || []), { fileName: pending.fileName, importedAt: new Date().toISOString(), type: pending.type, detectedFields: pending.detectedFields || 0 }];
    Platform.saveDatabase(db);
    window.App.toast('Edital aplicado e histórico atualizado.','success');
    setTimeout(() => location.reload(), 500);
  }
  function cancel() { pending = null; document.getElementById('edital-preview').innerHTML = '<div class="empty-state"><b>Importação cancelada.</b><p>A base anterior permanece inalterada.</p></div>'; }
  function exportDatabase() {
    const blob = new Blob([JSON.stringify(Platform.database(), null, 2)], { type: 'application/json' });
    const anchor = document.createElement('a'); anchor.href = URL.createObjectURL(blob); anchor.download = 'aprova360-base-concurso.json'; anchor.click(); URL.revokeObjectURL(anchor.href);
  }

  window.EditalImporter = { page, fileSelected, apply, cancel, exportDatabase };
})();
