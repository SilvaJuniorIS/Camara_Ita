# Aprova360

Aplicativo PWA de preparação para concursos públicos. A primeira trilha atende candidatos ao cargo de Agente Administrativo da Câmara Municipal de Itanhaém. Usa HTML5, CSS3 e JavaScript puro, pode ser instalado no celular e salva o progresso no `localStorage`.

> As questões são autorais e destinadas a treinamento inspirado no estilo de concursos. Não são questões oficiais da VUNESP.

## Funcionalidades

- página inicial profissional e painel responsivo;
- onboarding personalizado, planos comerciais e demonstração Pro;
- instalação como aplicativo PWA e cache offline;
- curso modular, progresso e revisões automáticas em 24 horas, 7 e 30 dias;
- banco com 20+ questões, filtros, correção comentada e caderno de erros;
- simulados com histórico de resultados;
- 30 flashcards com classificação de dificuldade;
- planner editável e plano inicial de 90 dias;
- Pomodoro configurável e registro de horas;
- anotações, métricas e análise automática;
- tema claro/escuro, fonte ampliada, backup, importação e redefinição;
- navegação por teclado e layout adaptado a celular.

## Como executar

Abra `index.html` diretamente em um navegador moderno. Para desenvolvimento, também pode usar um servidor estático:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

O servidor local é necessário para testar instalação, Service Worker e funcionamento offline.

## Estrutura

- `*.html`: páginas e shells semânticos;
- `css/`: reset, variáveis, sistema visual, componentes e responsividade;
- `js/storage.js`: única camada que acessa o `localStorage`;
- `js/app.js`: inicialização, eventos e integração entre módulos;
- `js/`: curso, quiz, planner, flashcards, notas, desempenho e Pomodoro;
- `data/`: curso, questões, flashcards e simulados;
- `assets/`: imagens, ícones e ilustrações futuras.
- `manifest.webmanifest` e `sw.js`: instalação e funcionamento offline;
- `PRODUCT.md`: estratégia comercial e requisitos antes da cobrança real.
- `CONTENT.md`: matriz curricular, fontes oficiais e separação entre núcleo do edital e reforço estratégico.

## Base pré-edital VUNESP

`data/platform-data.js` é a fonte única para os 27 cargos/vagas, matriz
provisória, perfil VUNESP, simulados, legislação, fontes e histórico. Os
vencimentos por cargo, atribuições e pesos ficam marcados como pendentes até o
edital oficial.

O importador em `edital.html` lê PDF pesquisável ou pacote JSON, mostra os
campos detectados para conferência e só aplica a atualização após confirmação.
As novas áreas são Concurso, Perfil VUNESP, Professor VUNESP, Plano automático,
Legislação e Atualização do edital.

## Adicionar conteúdo

### Capítulos

Inclua o título em `CourseData.modules`, no arquivo `data/course-data.js`. Para um capítulo com layout próprio, adicione uma função em `js/course.js` e roteie o parâmetro `id` em `chapterPage()`.

### Questões

Adicione uma entrada em `data/questions-data.js` com id único, disciplina, assunto, enunciado, cinco alternativas, índice da resposta correta, comentário e nível.

### Flashcards

Inclua frente, verso e disciplina no vetor `pairs` de `data/flashcards-data.js`.

### Simulados

Cadastre título, quantidade e duração em `data/simulations-data.js`. O motor seleciona questões do banco e salva o histórico.

### Cores

Edite os tokens no `:root` de `css/variables.css`. O tema escuro usa sobrescritas em `[data-theme="dark"]`.

## Publicação

### GitHub Pages

Envie para um repositório, abra **Settings → Pages**, selecione a branch principal e a pasta raiz. Como os caminhos são relativos e não existe build, a publicação é direta.

### Vercel

Importe o repositório, escolha **Other** como framework, deixe o build vazio e use a raiz como diretório de saída.

## Limitações locais

Os dados ficam vinculados ao navegador e dispositivo atuais. Limpar os dados do site remove o progresso; use o backup JSON. A tela de assinatura é uma demonstração e não processa pagamentos. Não há login, nuvem, colaboração, notificações push nem banco de dados.

## Evolução recomendada

- completar disciplinas e ampliar o banco de questões;
- adicionar mapas mentais, PDFs e videoaulas;
- autenticação e sincronização em nuvem;
- PWA com funcionamento offline integral;
- migração para React quando houver backend;
- análises assistidas por IA com proteção de dados.
