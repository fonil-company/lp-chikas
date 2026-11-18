'use strict';
const form = document.querySelector('#lead-form');
const phone = form.elements.whatsapp;
const cnpj = form.elements.cnpj;
const statusMessage = document.querySelector('#form-status');
const digits = value => value.replace(/\D/g, '');

phone.addEventListener('input', () => {
  const n = digits(phone.value).slice(0, 11);
  phone.value = n.length > 6 ? `(${n.slice(0, 2)}) ${n.slice(2, n.length > 10 ? 7 : 6)}-${n.slice(n.length > 10 ? 7 : 6)}` : n.length > 2 ? `(${n.slice(0, 2)}) ${n.slice(2)}` : n;
  phone.setCustomValidity('');
});
cnpj.addEventListener('input', () => {
  const n = cnpj.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 14);
  cnpj.value = n.replace(/^(.{2})(.)/, '$1.$2').replace(/^(.{6})(.)/, '$1.$2').replace(/^(.{10})(.)/, '$1/$2').replace(/^(.{15})(.)/, '$1-$2');
  cnpj.setCustomValidity('');
});
const state = form.elements.state;
const city = form.elements.city;
state.addEventListener('change', () => {
  const list = window.CHIKAS_CITIES?.[state.value] || [];
  city.replaceChildren(new Option('Selecione sua cidade', ''), ...list.map(name => new Option(name)));
  city.options[0].disabled = true;
  city.selectedIndex = 0;
  city.disabled = !list.length;
});
function validCnpj(value) {
  const n = value.replace(/[^A-Z0-9]/g, '');
  if (!/^[A-Z0-9]{12}\d{2}$/.test(n) || /^(\d)\1{13}$/.test(n)) return false;
  const check = part => {
    const weights = part.length === 12 ? [5,4,3,2,9,8,7,6,5,4,3,2] : [6,5,4,3,2,9,8,7,6,5,4,3,2];
    const rest = [...part].reduce((sum, c, i) => sum + (c.charCodeAt(0) - 48) * weights[i], 0) % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return check(n.slice(0,12)) === Number(n[12]) && check(n.slice(0,13)) === Number(n[13]);
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  statusMessage.hidden = true;
  const number = digits(phone.value);
  phone.setCustomValidity(/^[1-9]{2}(?:9\d{8}|[2-5]\d{7})$/.test(number) ? '' : 'Informe um WhatsApp válido com DDD.');
  cnpj.setCustomValidity(validCnpj(cnpj.value) ? '' : 'Confira o CNPJ do estabelecimento.');
  for (const name of ['name','supermarket']) {
    const input = form.elements[name];
    input.value = input.value.trim();
  }
  if (!form.reportValidity()) return;
  const endpoint = window.CHIKAS_CONFIG?.leadEndpoint;
  if (!endpoint) {
    statusMessage.textContent = 'O formulário estará disponível em breve. Nenhum dado foi enviado.';
    statusMessage.hidden = false;
    return;
  }
  const button = form.querySelector('button');
  const label = button.querySelector('span');
  button.disabled = true;
  label.textContent = 'Enviando cadastro…';
  const payload = Object.fromEntries(new FormData(form));
  payload.whatsapp = number;
  payload.cnpj = cnpj.value.replace(/[^A-Z0-9]/g, '');
  try {
    const response = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), signal:AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Submission failed');
    form.hidden = true;
    document.querySelector('.form-heading').hidden = true;
    const success = document.querySelector('#success-message');
    success.hidden = false;
    success.focus();
    form.reset();
  } catch {
    statusMessage.textContent = 'Não foi possível enviar agora. Seus dados continuam aqui. Tente novamente em instantes.';
    statusMessage.hidden = false;
  } finally {
    button.disabled = false;
    label.textContent = 'Quero receber o catálogo';
  }
});
