import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
try { process.loadEnvFile(); } catch {}
const root = fileURLToPath(new URL('./dist/', import.meta.url));
const types = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.json':'application/json' };
const crmUrl = process.env.CRM_WEBHOOK_URL;
if (!crmUrl) console.warn('CRM_WEBHOOK_URL não definida: os cadastros do formulário serão recusados.');
const states = new Set('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' '));
const json = (res, status, body) => res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}).end(JSON.stringify(body));

async function readBody(req) {
  let size = 0; const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 10_000) throw new Error('Body too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function toCrmLead(data) {
  const text = (value, max) => String(value ?? '').trim().slice(0, max);
  const lead = {
    name: text(data.name, 100),
    supermarket: text(data.supermarket, 150),
    phone: String(data.whatsapp ?? '').replace(/\D/g, ''),
    city: text(data.city, 100),
    state: text(data.state, 2).toUpperCase(),
    document: String(data.cnpj ?? '').toUpperCase().replace(/[^A-Z0-9]/g, ''),
  };
  const valid = lead.name.length >= 2 && lead.supermarket.length >= 2 && lead.city.length >= 2 && states.has(lead.state)
    && /^[1-9]{2}(?:9\d{8}|[2-5]\d{7})$/.test(lead.phone) && /^[A-Z0-9]{12}\d{2}$/.test(lead.document);
  if (!valid) return null;
  // O CRM não tem campo de empresa: o supermercado vai junto do nome para não se perder.
  return { name: `${lead.name} — ${lead.supermarket}`, phone: lead.phone, document: lead.document, cnpj: lead.document, city: lead.city, state: lead.state, company: lead.supermarket };
}

async function handleLead(req, res) {
  if (!crmUrl) { json(res, 503, { ok:false }); return; }
  let lead;
  try { lead = toCrmLead(await readBody(req)); } catch { json(res, 400, { ok:false }); return; }
  if (!lead) { json(res, 422, { ok:false }); return; }
  try {
    const response = await fetch(crmUrl, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(lead), signal:AbortSignal.timeout(12000) });
    if (!response.ok) {
      console.error(`CRM recusou o lead: HTTP ${response.status} ${(await response.text()).slice(0, 300)}`);
      json(res, 502, { ok:false }); return;
    }
    json(res, 200, { ok:true });
  } catch (error) {
    console.error(`Falha ao enviar lead ao CRM: ${error.message}`);
    json(res, 502, { ok:false });
  }
}

const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/api/lead') {
      if (req.method !== 'POST') { res.writeHead(405, {'Allow':'POST'}).end(); return; }
      await handleLead(req, res); return;
    }
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) { res.writeHead(403).end(); return; }
    const content = await readFile(file);
    res.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'}).end(content);
  } catch { if (!res.headersSent) res.writeHead(404).end('Not found'); }
});
server.listen(Number(process.env.PORT) || 3000, process.env.HOST || '0.0.0.0', () => console.log(`Servidor disponível na porta ${server.address().port}`));
