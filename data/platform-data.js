(function () {
  'use strict';

  const source = (id, title, url, publishedAt, type) => ({ id, title, url, publishedAt, type });
  const position = (id, name, education, vacancies, requirements) => ({
    id, name, education, vacancies, weeklyHours: 40, requirements,
    remuneration: null, duties: [], disciplineWeights: {},
    remunerationStatus: 'awaiting_official_notice',
    dutiesStatus: 'awaiting_official_notice',
    weightsStatus: 'awaiting_official_notice'
  });
  const topic = (id, name, subtopics, priority = 3) => ({ id, name, subtopics, priority, status: 'provisional' });

  window.PlatformSeed = {
    schemaVersion: 3,
    updatedAt: '2026-07-30T12:00:00-03:00',
    publicationStatus: 'pre_notice',
    provisional: true,
    contest: {
      id: 'camara-itanhaem-2026',
      organization: 'Câmara Municipal da Estância Balneária de Itanhaém',
      board: 'Fundação VUNESP',
      process: '103/2026',
      contract: '04/2026',
      contractSignedAt: '2026-06-22',
      contractValidUntil: '2027-06-22',
      officialNoticePublished: false,
      totalVacancies: 27,
      totalPositions: 11,
      weeklyHours: 40,
      salaryRange: { minimum: 4013.31, maximum: 6824.24, currency: 'BRL', perPosition: false },
      objectiveTest: { minimumQuestions: 50, minimumSpecificKnowledgePercent: 60, status: 'confirmed_in_etp' },
      disclaimer: 'Conteúdo provisório de preparação. O edital oficial ainda não foi publicado.'
    },
    sources: [
      source('official-news', 'Câmara confirma concurso e divulga quadro de vagas', 'https://www.itanhaem.sp.leg.br/Noticias/Details?id=3761', '2026-06-25', 'official_news'),
      source('procurement', 'Processo de contratação direta nº 103/2026', 'https://itanhaem.sp.leg.br/licitacao?CurrentPage=1', '2026-05-18', 'official_procurement'),
      source('etp', 'Estudo Técnico Preliminar do concurso', 'https://itanhaem.sp.leg.br/Licitacao?handler=Imagem&id=598', '2026-05-18', 'official_preliminary_document')
    ],
    positions: [
      position('agente-administrativo', 'Agente Administrativo', 'Ensino médio completo', 12, ['Ensino médio completo']),
      position('tecnico-informatica', 'Técnico de Informática', 'Ensino médio técnico', 2, ['Ensino médio técnico profissionalizante em Informática']),
      position('tecnico-audiovisual', 'Técnico em Audiovisual', 'Ensino médio técnico', 2, ['Ensino médio completo', 'Curso técnico na área']),
      position('encarregado-estoque', 'Encarregado de Estoque', 'Ensino médio completo', 1, ['Ensino médio completo']),
      position('assistente-contabilidade', 'Assistente de Contabilidade', 'Ensino médio técnico', 1, ['Ensino médio completo', 'Curso Técnico de Contabilidade', 'Registro no conselho profissional']),
      position('analista-legislativo', 'Analista Legislativo (Direito)', 'Ensino superior completo', 4, ['Ensino superior completo em Direito']),
      position('administrador-compras', 'Administrador de Compras', 'Ensino superior completo', 1, ['Ensino superior completo']),
      position('tesoureiro', 'Tesoureiro', 'Ensino superior completo', 1, ['Ensino superior em Ciências Contábeis, Economia ou Administração']),
      position('administrador-patrimonio', 'Administrador de Patrimônio', 'Ensino superior completo', 1, ['Ensino superior completo']),
      position('administrador-rh', 'Administrador em Recursos Humanos', 'Ensino superior completo', 1, ['Administração, Ciências Contábeis, Direito, Psicologia, Gestão em Recursos Humanos ou Gestão Pública']),
      position('jornalista', 'Jornalista', 'Ensino superior completo', 1, ['Ensino superior completo na área de Comunicação Social'])
    ],
    disciplines: [
      {
        id: 'portugues', name: 'Língua Portuguesa', status: 'provisional', color: '#2563eb',
        topics: [
          topic('ortografia', 'Ortografia', ['Acordo ortográfico', 'Acentuação', 'Emprego de letras']),
          topic('interpretacao', 'Interpretação de textos', ['Tema e finalidade', 'Inferência', 'Coesão e coerência'], 5),
          topic('gramatica', 'Gramática', ['Classes de palavras', 'Sintaxe', 'Semântica']),
          topic('pontuacao', 'Pontuação', ['Vírgula', 'Dois-pontos', 'Pontuação e sentido'], 4),
          topic('concordancia', 'Concordância', ['Nominal', 'Verbal'], 4),
          topic('regencia', 'Regência', ['Nominal', 'Verbal'], 4),
          topic('crase', 'Crase', ['Regra geral', 'Casos proibidos', 'Casos facultativos'], 4),
          topic('redacao-oficial', 'Redação oficial', ['Clareza e concisão', 'Padrão ofício', 'Comunicações oficiais'], 3)
        ]
      },
      {
        id: 'matematica', name: 'Matemática', status: 'provisional', color: '#7c3aed',
        topics: [
          topic('porcentagem', 'Porcentagem', ['Aumentos', 'Descontos', 'Variações sucessivas'], 5),
          topic('razao', 'Razão e proporção', ['Razões', 'Escalas', 'Proporções'], 4),
          topic('regra-tres', 'Regra de três', ['Simples', 'Composta'], 4),
          topic('juros', 'Juros', ['Juros simples', 'Montante'], 3),
          topic('problemas', 'Resolução de problemas', ['Grandezas', 'Equações', 'Situações práticas'], 5),
          topic('geometria', 'Geometria básica', ['Perímetro', 'Área', 'Volume'], 2)
        ]
      },
      {
        id: 'informatica', name: 'Informática', status: 'provisional', color: '#0891b2',
        topics: [
          topic('windows-11', 'Windows 11', ['Arquivos e pastas', 'Configurações', 'Atalhos'], 4),
          topic('microsoft-365', 'Microsoft 365', ['Integração', 'Colaboração', 'Nuvem'], 4),
          topic('word', 'Word', ['Formatação', 'Layout', 'Revisão'], 4),
          topic('excel', 'Excel', ['Fórmulas', 'Funções', 'Gráficos e filtros'], 5),
          topic('powerpoint', 'PowerPoint', ['Slides', 'Temas', 'Apresentação'], 3),
          topic('outlook', 'Outlook', ['Mensagens', 'Agenda', 'Regras'], 3),
          topic('internet', 'Internet', ['Navegadores', 'Pesquisa', 'Correio eletrônico'], 4),
          topic('lgpd', 'LGPD aplicada', ['Dados pessoais', 'Tratamento', 'Segurança'], 4),
          topic('seguranca', 'Segurança da informação', ['Phishing', 'Senhas', 'Backup'], 5),
          topic('google-workspace', 'Google Workspace', ['Drive', 'Docs', 'Planilhas'], 3)
        ]
      },
      {
        id: 'administracao-publica', name: 'Administração Pública', status: 'provisional', color: '#0f766e',
        topics: [
          topic('principios', 'Princípios', ['Legalidade', 'Impessoalidade', 'Moralidade', 'Publicidade', 'Eficiência'], 5),
          topic('organizacao', 'Administração direta e indireta', ['Órgãos', 'Autarquias', 'Fundações', 'Empresas estatais'], 4),
          topic('poderes', 'Poderes administrativos', ['Vinculado', 'Discricionário', 'Hierárquico', 'Disciplinar', 'Polícia'], 4),
          topic('atos', 'Atos administrativos', ['Elementos', 'Atributos', 'Anulação e revogação'], 5),
          topic('servico-publico', 'Serviço público', ['Princípios', 'Delegação', 'Usuários'], 3),
          topic('licitacoes', 'Licitações e Lei 14.133/2021', ['Princípios', 'Fases', 'Modalidades', 'Contratação direta'], 5),
          topic('transparencia', 'Transparência e controle', ['LAI', 'Controle interno', 'Controle externo'], 4)
        ]
      },
      {
        id: 'processo-legislativo', name: 'Processo Legislativo', status: 'provisional', color: '#b45309',
        topics: [
          topic('poder-legislativo', 'Noções do Poder Legislativo', ['Separação dos poderes', 'Competências'], 5),
          topic('funcoes-camara', 'Funções da Câmara', ['Legislativa', 'Fiscalizadora', 'Administrativa'], 5),
          topic('mesa-diretora', 'Mesa Diretora', ['Composição', 'Competências'], 4),
          topic('comissoes', 'Comissões', ['Permanentes', 'Temporárias', 'Pareceres'], 4),
          topic('sessoes', 'Sessões', ['Ordinárias', 'Extraordinárias', 'Solenes'], 4),
          topic('processo', 'Processo legislativo municipal', ['Iniciativa', 'Discussão', 'Votação', 'Sanção e veto'], 5),
          topic('lei-organica', 'Lei Orgânica de Itanhaém', ['Organização municipal', 'Competências', 'Poderes'], 5),
          topic('regimento', 'Regimento Interno da Câmara', ['Órgãos', 'Proposições', 'Tramitação'], 5)
        ]
      },
      {
        id: 'atualidades', name: 'Atualidades', status: 'provisional', color: '#be123c',
        topics: [
          topic('brasil', 'Brasil', ['Sociedade', 'Administração pública']),
          topic('economia', 'Economia', ['Indicadores', 'Trabalho e renda']),
          topic('tecnologia', 'Tecnologia', ['Inteligência artificial', 'Transformação digital']),
          topic('meio-ambiente', 'Meio ambiente', ['Clima', 'Sustentabilidade']),
          topic('politica', 'Política', ['Instituições', 'Cidadania'])
        ]
      },
      {
        id: 'raciocinio-logico', name: 'Raciocínio Lógico', status: 'provisional', color: '#4f46e5',
        topics: [
          topic('proposicoes', 'Proposições', ['Conectivos', 'Negação', 'Equivalências'], 5),
          topic('sequencias', 'Sequências', ['Numéricas', 'Figurais'], 4),
          topic('problemas-logicos', 'Problemas lógicos', ['Ordenação', 'Associação'], 5),
          topic('tabelas', 'Tabelas', ['Leitura', 'Cruzamento de dados'], 3),
          topic('diagramas', 'Diagramas', ['Conjuntos', 'Diagramas lógicos'], 4)
        ]
      }
    ],
    positionDisciplineMap: {
      'agente-administrativo': ['portugues', 'matematica', 'informatica', 'administracao-publica', 'processo-legislativo', 'atualidades', 'raciocinio-logico'],
      'tecnico-informatica': ['portugues', 'matematica', 'informatica', 'administracao-publica', 'processo-legislativo', 'raciocinio-logico'],
      'tecnico-audiovisual': ['portugues', 'matematica', 'informatica', 'administracao-publica', 'processo-legislativo', 'atualidades'],
      'encarregado-estoque': ['portugues', 'matematica', 'informatica', 'administracao-publica', 'processo-legislativo', 'raciocinio-logico'],
      'assistente-contabilidade': ['portugues', 'matematica', 'informatica', 'administracao-publica', 'processo-legislativo', 'raciocinio-logico'],
      'analista-legislativo': ['portugues', 'administracao-publica', 'processo-legislativo', 'atualidades', 'raciocinio-logico'],
      'administrador-compras': ['portugues', 'matematica', 'informatica', 'administracao-publica', 'processo-legislativo'],
      'tesoureiro': ['portugues', 'matematica', 'informatica', 'administracao-publica', 'processo-legislativo', 'raciocinio-logico'],
      'administrador-patrimonio': ['portugues', 'matematica', 'informatica', 'administracao-publica', 'processo-legislativo'],
      'administrador-rh': ['portugues', 'informatica', 'administracao-publica', 'processo-legislativo', 'raciocinio-logico'],
      'jornalista': ['portugues', 'informatica', 'administracao-publica', 'processo-legislativo', 'atualidades']
    },
    boardProfile: {
      id: 'vunesp', name: 'Fundação VUNESP',
      characteristics: ['Questões de múltipla escolha com cinco alternativas', 'Comandos objetivos com forte atenção ao texto-base', 'Distratores plausíveis e próximos da regra correta', 'Cobrança aplicada a situações concretas'],
      chargingStyle: ['Leitura literal combinada com interpretação', 'Gramática contextualizada', 'Cálculos diretos com atenção a dados do enunciado', 'Conhecimentos específicos ligados às atribuições do cargo'],
      difficulty: 'progressive',
      interpretationLevel: 'high',
      dryLawIncidence: 'medium_to_high_in_legal_subjects',
      objectiveProfile: { alternatives: 5, penaltyForWrongAnswer: false, confirmedForThisContest: false },
      statistics: { source: 'local_question_bank', questions: 0, distribution: [], accuracy: null, averageTimeSeconds: null },
      teacherPrompt: 'Ensine como professor especialista em provas da VUNESP: explique o conceito, destaque o comando, compare distratores, mostre a regra e encerre com uma estratégia de prova.'
    },
    questionSchema: {
      required: ['id', 'disciplineId', 'topicId', 'statement', 'options', 'correctOption', 'comment'],
      optional: ['subtopicId', 'year', 'positionId', 'organization', 'level', 'sourceType', 'accuracyPercent', 'averageTimeSeconds', 'tags']
    },
    simulations: [10, 20, 40, 60, 100].map((count, index) => ({
      id: `vunesp-${count}`, title: `Modo VUNESP — ${count} questões`, count,
      durationMinutes: Math.round(count * 2.5), correction: 'automatic', ranking: 'device_local',
      realTime: true, order: index + 1
    })),
    legislation: [
      { id: 'cf-1988', title: 'Constituição Federal', status: 'reference_ready', articles: [] },
      { id: 'lei-14133', title: 'Lei nº 14.133/2021', status: 'reference_ready', articles: [] },
      { id: 'lai', title: 'Lei de Acesso à Informação', status: 'reference_ready', articles: [] },
      { id: 'lgpd', title: 'Lei Geral de Proteção de Dados', status: 'reference_ready', articles: [] },
      { id: 'lei-organica-itanhaem', title: 'Lei Orgânica de Itanhaém', status: 'awaiting_verified_import', articles: [] },
      { id: 'regimento-camara', title: 'Regimento Interno da Câmara', status: 'awaiting_verified_import', articles: [] },
      { id: 'estatuto-servidores', title: 'Estatuto dos Servidores', status: 'awaiting_identification', articles: [] }
    ],
    entityCatalog: ['Cargo', 'Disciplina', 'Assunto', 'Subassunto', 'Questão', 'Simulado', 'Flashcard', 'Mapa Mental', 'Plano de Estudo', 'Progresso', 'Legislação', 'Bibliografia', 'Notícia', 'Cronograma'],
    bibliographies: [],
    news: [],
    timeline: [],
    importHistory: []
  };
})();
