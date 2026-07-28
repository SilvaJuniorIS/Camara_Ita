# Aprova360 — plano de produto

## Proposta

O Aprova360 é um aplicativo de preparação para concursos que responde diariamente à pergunta: **“o que devo estudar agora?”** A trilha para Agente Administrativo da Câmara de Itanhaém é o primeiro produto de conteúdo dentro da plataforma.

## Público inicial

- candidatos que trabalham e dispõem de 1 a 3 horas por dia;
- iniciantes que não conseguem organizar edital, revisões e questões;
- candidatos de concursos municipais organizados pela VUNESP;
- pessoas que já compraram apostilas, mas não mantêm constância.

## Oferta comercial sugerida

| Plano | Preço sugerido | Papel |
|---|---:|---|
| Essencial | Gratuito | aquisição, demonstração do método e criação de hábito |
| Pro | R$ 19,90/mês | receita recorrente e acesso completo |
| Turma fundadora | R$ 149,00 | validação inicial e caixa de lançamento |

Os preços são hipóteses e devem ser validados com entrevistas, página de pré-venda e uma primeira turma de 20 a 50 usuários.

## O que já está pronto

- marca e posicionamento independentes;
- landing page de aquisição;
- onboarding que personaliza carga, experiência e objetivo;
- área de planos e demonstração de assinatura;
- aplicativo PWA instalável;
- funcionamento offline das páginas essenciais;
- curso, questões, simulados, planner, revisões e desempenho;
- backup local e experiência responsiva;
- termos provisórios transparentes sobre o estágio do MVP.

## O que falta antes de cobrar clientes

1. Criar backend e banco de dados.
2. Implementar autenticação por e-mail e recuperação de acesso.
3. Integrar Mercado Pago, Stripe ou Asaas.
4. Validar assinaturas e permissões no servidor, nunca apenas no navegador.
5. Criar painel administrativo para conteúdo, alunos e pagamentos.
6. Revisar termos, privacidade, cancelamento e reembolso com profissional jurídico.
7. Definir CNPJ, suporte, emissão fiscal e canais oficiais.
8. Ampliar e revisar pedagogicamente o conteúdo vendido.
9. Configurar domínio, e-mail transacional, métricas e monitoramento.
10. Publicar política de atendimento e prazo de resposta.

## Arquitetura recomendada para produção

- frontend: React/Next.js ou evolução progressiva do JavaScript atual;
- API: Node.js/TypeScript;
- banco: PostgreSQL;
- autenticação: Supabase Auth, Clerk ou Auth.js;
- pagamentos: Mercado Pago, Stripe ou Asaas;
- arquivos: armazenamento S3 compatível;
- e-mail: Resend ou equivalente;
- métricas: Plausible/PostHog com consentimento;
- hospedagem: Vercel, Cloudflare ou infraestrutura equivalente.

## Métricas do lançamento

- conversão da landing para onboarding;
- conclusão do onboarding;
- ativação: primeira sessão + primeira questão;
- retenção em 7 e 30 dias;
- sessões de estudo por semana;
- conversão do gratuito para Pro;
- cancelamento e motivo;
- disciplinas e recursos mais usados.

## Estratégia inicial

1. Convidar 20 candidatos para uma turma beta gratuita de 14 dias.
2. Observar onde abandonam a jornada e entrevistar ao menos 5 usuários.
3. Corrigir os principais atritos.
4. Abrir 30 vagas para a turma fundadora.
5. Só então investir em conteúdo e aquisição em escala.
