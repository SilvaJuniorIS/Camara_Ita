/* Camada única de persistência. Nenhum outro módulo acessa localStorage diretamente. */
(function () {
  'use strict';
  const PREFIX = 'aprovacao_';
  const defaults = {
    user: { name: 'Estudante', createdAt: new Date().toISOString() },
    progress: { completedChapters: [], lastChapter: 1 },
    answers: {},
    notes: [],
    schedule: [],
    reviews: [],
    errors: [],
    flashcards: {},
    simulations: [],
    study_sessions: [],
    knowledge_base: null,
    adaptive_plan: null,
    generated_questions: [],
    generated_flashcards: [],
    reflections: {},
    onboarding: { completed: false, step: 1, exam: 'Câmara de Itanhaém', weeklyHours: 12.5, experience: 'iniciante', goalDate: '' },
    subscription: { plan: 'free', status: 'active', startedAt: new Date().toISOString(), trialEndsAt: null },
    product: { installed: false, version: '2.0.0', acceptedTermsAt: null },
    settings: { theme: 'light', fontSize: 'normal', weeklyHours: 18.5, questionGoal: 100, pomodoro: 25, sounds: true, notifications: false, animations: true, confirmDelete: true }
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  const key = name => PREFIX + name;
  function load(name, fallback) {
    try {
      const raw = localStorage.getItem(key(name));
      return raw === null ? clone(fallback ?? defaults[name] ?? null) : JSON.parse(raw);
    } catch (error) {
      console.warn(`Falha ao carregar ${name}:`, error);
      return clone(fallback ?? defaults[name] ?? null);
    }
  }
  function save(name, value) {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
      document.dispatchEvent(new CustomEvent('storage:updated', { detail: { name, value } }));
      return true;
    } catch (error) {
      console.error(`Falha ao salvar ${name}:`, error);
      return false;
    }
  }
  function update(name, updater) {
    const current = load(name);
    const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    save(name, next);
    return next;
  }
  function remove(name) { localStorage.removeItem(key(name)); }
  function initialize() {
    Object.entries(defaults).forEach(([name, value]) => {
      if (localStorage.getItem(key(name)) === null) save(name, clone(value));
    });
  }
  function exportAll() {
    const payload = { version: 1, exportedAt: new Date().toISOString(), data: {} };
    Object.keys(defaults).forEach(name => { payload.data[name] = load(name); });
    return JSON.stringify(payload, null, 2);
  }
  function importAll(raw) {
    const payload = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!payload || payload.version !== 1 || !payload.data) throw new Error('Backup inválido ou incompatível.');
    Object.keys(defaults).forEach(name => {
      if (Object.prototype.hasOwnProperty.call(payload.data, name)) save(name, payload.data[name]);
    });
  }
  function reset() { Object.keys(defaults).forEach(remove); initialize(); }
  window.AppStorage = { load, save, update, remove, initialize, exportAll, importAll, reset, defaults: clone(defaults) };
  initialize();
})();
