// O formulário envia para o próprio servidor (server.mjs), que repassa ao CRM.
// O token do CRM fica na variável de ambiente CRM_WEBHOOK_URL, nunca neste arquivo.
window.CHIKAS_CONFIG = Object.freeze({ leadEndpoint: '/api/lead' });
