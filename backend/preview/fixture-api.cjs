// Dados publicos de producao sao somente lidos. Toda escrita abaixo fica nesta memoria.
const backend = 'https://heartfelt-courtesy-production-3747.up.railway.app';
const json = (res, value, status = 200) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(value));
};
async function all(collection) {
  const rows = [];
  let page = 1;
  let next = true;
  while (next) {
    const response = await fetch(`${backend}/api/${collection}?limit=500&depth=1&page=${page}`);
    if (!response.ok) throw new Error(`API ${collection}: ${response.status}`);
    const data = await response.json();
    rows.push(...data.docs);
    next = data.hasNextPage;
    page++;
  }
  return rows;
}
// Logs de entrega exigem login na API publica (403 sem token), entao a previa usa
// uma amostra local so pra validar o visual da caixa de entrada (memoria, nunca prod).
function mockOrcamentos() {
  const now = Date.now();
  return [
    { id: 1, requisicaoId: 'req-a1b2', status: 'simulado', modo: 'stub', empresa: 'Padaria do Ze', emailMascarado: 'c***@padaria.com', telefoneMascarado: '****-4821', qtdItens: 3, totalUnidades: 450, consentimento: true, createdAt: new Date(now - 36e5).toISOString() },
    { id: 2, requisicaoId: 'req-c3d4', status: 'entregue', modo: 'real', crmId: 'CRM-7781', empresa: 'Clinica Vida', emailMascarado: 'm***@vida.com.br', telefoneMascarado: '****-1190', qtdItens: 5, totalUnidades: 1200, consentimento: true, createdAt: new Date(now - 864e5).toISOString() },
    { id: 3, requisicaoId: 'req-e5f6', status: 'falhou', modo: 'real', empresa: 'Auto Pecas Sul', emailMascarado: 'v***@autosul.com', telefoneMascarado: '****-7733', qtdItens: 2, totalUnidades: 200, consentimento: true, erro: 'Timeout ao chamar o n8n (ECONNRESET).', createdAt: new Date(now - 2 * 864e5).toISOString() },
  ];
}
async function readFixtures() {
  const [products, categories, media, banners, settings, home, campanhas, cases, imprensa, posts, depoimentos, logos] = await Promise.all([
    all('produtos'), all('categorias'), all('media'), all('hero-slides'),
    fetch(backend + '/api/globals/configuracoes').then(r => r.json()),
    fetch(backend + '/api/globals/conteudo-home?depth=1').then(r => r.json()),
    all('campanhas'), all('cases'), all('imprensa'), all('posts'), all('depoimentos'), all('logos'),
  ]);
  const countByCat = new Map();
  for (const p of products) for (const c of (p.categorias || [])) { const id = typeof c === 'number' ? c : c && c.id; if (id != null) countByCat.set(id, (countByCat.get(id) || 0) + 1); }
  const categoriasRows = categories.map(c => ({ ...c, produtosCount: countByCat.get(c.id) || 0 }));
  return { products, categories, media, banners, certifications: settings.selos?.length || 0, home, campanhas, categoriasRows, cases, imprensa, posts, depoimentos, logos, orcamentos: mockOrcamentos() };
}
function hydrate(product, data) {
  const resolve = value => typeof value === 'number' ? data.media.find(m => m.id === value) || value : value;
  const category = value => typeof value === 'number' ? data.categories.find(c => c.id === value) || value : value;
  return { ...product, imagens: (product.imagens || []).map(resolve), imagemAmbientada: resolve(product.imagemAmbientada), cores: (product.cores || []).map(c => ({ ...c, imagem: resolve(c.imagem) })), categorias: (product.categorias || []).map(category) };
}
function mediaPage(url, data) {
  const q = (url.searchParams.get('where[filename][contains]') || '').toLowerCase();
  const images = data.media.filter(m => (m.mimeType || 'image').startsWith('image') && (m.filename || '').toLowerCase().includes(q));
  const page = Number(url.searchParams.get('page') || 1);
  return { docs: images.slice((page - 1) * 36, page * 36), totalPages: Math.ceil(images.length / 36), totalDocs: images.length };
}
async function upload(req, url, data) {
  const request = new Request(url, { method: 'POST', headers: req.headers, body: req, duplex: 'half' });
  const form = await request.formData();
  const file = form.get('file');
  const image = { id: 20000 + data.media.length, url: `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`, filename: file.name, alt: file.name };
  data.media.unshift(image);
  return { doc: image };
}
async function saveProduct(req, url, data) {
  let body = '';
  for await (const chunk of req) body += chunk;
  const changes = JSON.parse(body);
  let id = Number(url.pathname.split('/')[3]);
  let index = data.products.findIndex(p => p.id === id);
  if (req.method === 'POST') {
    id = Math.max(...data.products.map(p => p.id)) + 1;
    index = data.products.length;
    data.products.push({ id });
  }
  const original = data.products[index];
  if (!original) throw new Error('Produto não encontrado');
  const slug = original.slug || String(changes.nome).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const updated = hydrate({ ...original, ...changes, id, slug, updatedAt: new Date().toISOString() }, data);
  data.products[index] = updated;
  return { doc: updated };
}
function hydrateHero(banner, data) {
  const resolve = value => typeof value === 'number' ? data.media.find(m => m.id === value) || value : value;
  return { ...banner, imagemDesktop: resolve(banner.imagemDesktop), imagemMobile: resolve(banner.imagemMobile) };
}
async function saveHero(req, url, data) {
  let body = '';
  for await (const chunk of req) body += chunk;
  const changes = JSON.parse(body);
  let id = Number(url.pathname.split('/')[3]);
  let index = data.banners.findIndex(b => b.id === id);
  if (req.method === 'POST') {
    id = Math.max(0, ...data.banners.map(b => b.id)) + 1;
    index = data.banners.length;
    data.banners.push({ id });
  }
  const original = data.banners[index];
  if (!original) throw new Error('Banner não encontrado');
  const updated = hydrateHero({ ...original, ...changes, id, updatedAt: new Date().toISOString() }, data);
  data.banners[index] = updated;
  return { doc: updated };
}
async function saveHomeGlobal(req, data) {
  let body = '';
  for await (const chunk of req) body += chunk;
  const changes = JSON.parse(body);
  const resolve = value => typeof value === 'number' ? data.media.find(m => m.id === value) || value : value;
  const hydrated = { ...changes };
  for (const group of ['urgencia', 'ecoBanner', 'ecoLead']) {
    if (hydrated[group]) hydrated[group] = { ...hydrated[group], imagem: resolve(hydrated[group].imagem) };
  }
  data.home = { ...data.home, ...hydrated };
  return data.home;
}
function productsPage(url, data) {
  const q = (url.searchParams.get('where[nome][contains]') || '').toLowerCase();
  const limit = Number(url.searchParams.get('limit') || 24);
  const page = Number(url.searchParams.get('page') || 1);
  const filtered = data.products.filter(p => (p.nome || '').toLowerCase().includes(q));
  return { docs: filtered.slice((page - 1) * limit, page * limit), totalPages: Math.max(1, Math.ceil(filtered.length / limit)), totalDocs: filtered.length };
}
function hydrateCampanha(c, data) {
  const resolveMedia = v => typeof v === 'number' ? data.media.find(m => m.id === v) || v : v;
  const resolveProd = v => typeof v === 'number' ? data.products.find(p => p.id === v) || v : v;
  return { ...c, imagem: resolveMedia(c.imagem), produtos: (c.produtos || []).map(resolveProd) };
}
async function saveCampanha(req, url, data) {
  let body = '';
  for await (const chunk of req) body += chunk;
  const changes = JSON.parse(body);
  let id = Number(url.pathname.split('/')[3]);
  let index = data.campanhas.findIndex(c => c.id === id);
  if (req.method === 'POST') {
    id = Math.max(0, ...data.campanhas.map(c => c.id)) + 1;
    index = data.campanhas.length;
    data.campanhas.push({ id });
  }
  const original = data.campanhas[index];
  if (!original) throw new Error('Campanha não encontrada');
  const slug = original.slug || String(changes.nome || original.nome || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const updated = hydrateCampanha({ ...original, ...changes, id, slug, updatedAt: new Date().toISOString() }, data);
  data.campanhas[index] = updated;
  return { doc: updated };
}
function hydrateCategoria(c, data) {
  const resolveMedia = v => typeof v === 'number' ? data.media.find(m => m.id === v) || v : v;
  return { ...c, icone: resolveMedia(c.icone) };
}
async function saveCategoria(req, url, data) {
  let body = '';
  for await (const chunk of req) body += chunk;
  const changes = JSON.parse(body);
  let id = Number(url.pathname.split('/')[3]);
  let index = data.categoriasRows.findIndex(c => c.id === id);
  if (req.method === 'POST') {
    id = Math.max(0, ...data.categoriasRows.map(c => c.id)) + 1;
    index = data.categoriasRows.length;
    data.categoriasRows.push({ id, produtosCount: 0 });
  }
  const original = data.categoriasRows[index];
  if (!original) throw new Error('Categoria não encontrada');
  const slug = original.slug || String(changes.nome || original.nome || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const updated = hydrateCategoria({ ...original, ...changes, id, slug, produtosCount: original.produtosCount || 0, updatedAt: new Date().toISOString() }, data);
  data.categoriasRows[index] = updated;
  return { doc: updated };
}
// Config de cada colecao de conteudo editavel na previa: chave do array, campos de
// midia a reidratar (id -> objeto) e de que campo gerar o slug (quando tem slug).
const DOC_SAVERS = {
  cases: { key: 'cases', media: ['logo', 'imagem'], slugFrom: 'titulo' },
  imprensa: { key: 'imprensa', media: [], slugFrom: null },
  posts: { key: 'posts', media: ['capa'], slugFrom: 'titulo' },
  depoimentos: { key: 'depoimentos', media: ['foto'], slugFrom: null },
};
function hydrateMedia(doc, data, fields) {
  const resolve = v => typeof v === 'number' ? data.media.find(m => m.id === v) || v : v;
  const out = { ...doc };
  for (const f of fields) if (f in out) out[f] = resolve(out[f]);
  return out;
}
async function saveDoc(req, url, data, cfg) {
  let body = '';
  for await (const chunk of req) body += chunk;
  const changes = JSON.parse(body || '{}');
  const arr = data[cfg.key];
  let id = Number(url.pathname.split('/')[3]);
  let index = arr.findIndex(d => d.id === id);
  if (req.method === 'POST') { id = Math.max(0, ...arr.map(d => d.id)) + 1; index = arr.length; arr.push({ id }); }
  const original = arr[index];
  if (!original) throw new Error('Registro nao encontrado');
  const merged = { ...original, ...changes, id, updatedAt: new Date().toISOString() };
  if (cfg.slugFrom) merged.slug = original.slug || String(changes[cfg.slugFrom] || original[cfg.slugFrom] || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const updated = hydrateMedia(merged, data, cfg.media);
  arr[index] = updated;
  return { doc: updated };
}
// Logos e colecao de UPLOAD: o editor manda multipart (file + _payload) para trocar
// o arquivo, ou JSON (nome/ordem) para o resto. Guarda o arquivo como data URL.
async function saveLogo(req, url, data) {
  const request = new Request(url, { method: req.method, headers: req.headers, body: req, duplex: 'half' });
  const form = await request.formData();
  const payload = form.get('_payload') ? JSON.parse(form.get('_payload')) : {};
  const file = form.get('file');
  const arr = data.logos;
  let id = Number(url.pathname.split('/')[3]);
  let index = arr.findIndex(d => d.id === id);
  if (req.method === 'POST') { id = Math.max(0, ...arr.map(d => d.id)) + 1; index = arr.length; arr.push({ id }); }
  const original = arr[index] || { id };
  const updated = { ...original, ...payload, id, updatedAt: new Date().toISOString() };
  if (file && typeof file.arrayBuffer === 'function') {
    updated.url = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`;
    updated.filename = file.name; updated.mimeType = file.type;
  }
  arr[index] = updated;
  return { doc: updated };
}
async function saveMediaAlt(req, url, data) {
  let body = '';
  for await (const chunk of req) body += chunk;
  const changes = JSON.parse(body || '{}');
  const id = Number(url.pathname.split('/')[3]);
  const item = data.media.find(m => m.id === id);
  if (!item) throw new Error('Imagem nao encontrada');
  if (typeof changes.alt === 'string') item.alt = changes.alt;
  return { doc: item };
}
function fixtureAPI(data) {
  let failWrite = false;
  const routes = [
    { method: 'GET', match: url => url.pathname === '/preview-data', run: () => data },
    { method: 'POST', match: url => url.pathname === '/preview-control', run: () => { failWrite = true; return { ok: true }; } },
    { method: 'GET', match: url => url.pathname === '/api/media', run: (_req, url) => mediaPage(url, data) },
    { method: 'GET', match: url => url.pathname === '/api/produtos', run: (_req, url) => productsPage(url, data) },
    { method: 'POST', match: url => url.pathname === '/api/media', run: (req, url) => upload(req, url, data) },
    ...['POST', 'PATCH'].map(method => ({ method, match: url => /^\/api\/produtos(?:\/\d+)?$/.test(url.pathname), run: async (req, url) => {
      if (failWrite) { failWrite = false; throw new Error('Falha simulada: alterações não foram salvas.'); }
      return saveProduct(req, url, data);
    } })),
    ...['POST', 'PATCH'].map(method => ({ method, match: url => /^\/api\/hero-slides(?:\/\d+)?$/.test(url.pathname), run: async (req, url) => {
      if (failWrite) { failWrite = false; throw new Error('Falha simulada: alterações não foram salvas.'); }
      return saveHero(req, url, data);
    } })),
    { method: 'POST', match: url => url.pathname === '/api/globals/conteudo-home', run: async (req) => {
      if (failWrite) { failWrite = false; throw new Error('Falha simulada: alterações não foram salvas.'); }
      return saveHomeGlobal(req, data);
    } },
    ...['POST', 'PATCH'].map(method => ({ method, match: url => /^\/api\/campanhas(?:\/\d+)?$/.test(url.pathname), run: async (req, url) => {
      if (failWrite) { failWrite = false; throw new Error('Falha simulada: alterações não foram salvas.'); }
      return saveCampanha(req, url, data);
    } })),
    ...['POST', 'PATCH'].map(method => ({ method, match: url => /^\/api\/categorias(?:\/\d+)?$/.test(url.pathname), run: async (req, url) => {
      if (failWrite) { failWrite = false; throw new Error('Falha simulada: alterações não foram salvas.'); }
      return saveCategoria(req, url, data);
    } })),
    ...['cases', 'imprensa', 'posts', 'depoimentos'].flatMap(slug => ['POST', 'PATCH'].map(method => ({ method, match: url => new RegExp(`^/api/${slug}(?:/\\d+)?$`).test(url.pathname), run: async (req, url) => {
      if (failWrite) { failWrite = false; throw new Error('Falha simulada: alterações não foram salvas.'); }
      return saveDoc(req, url, data, DOC_SAVERS[slug]);
    } }))),
    ...['POST', 'PATCH'].map(method => ({ method, match: url => /^\/api\/logos(?:\/\d+)?$/.test(url.pathname), run: async (req, url) => {
      if (failWrite) { failWrite = false; throw new Error('Falha simulada: alterações não foram salvas.'); }
      const ct = req.headers['content-type'] || '';
      return ct.includes('multipart/form-data') ? saveLogo(req, url, data) : saveDoc(req, url, data, { key: 'logos', media: [], slugFrom: null });
    } })),
    { method: 'PATCH', match: url => /^\/api\/media\/\d+$/.test(url.pathname), run: async (req, url) => {
      if (failWrite) { failWrite = false; throw new Error('Falha simulada: alterações não foram salvas.'); }
      return saveMediaAlt(req, url, data);
    } },
  ];
  return async (req, res, url) => {
    const route = routes.find(route => route.method === req.method && route.match(url));
    if (!route) return false;
    try { json(res, await route.run(req, url)); }
    catch (error) { json(res, { errors: [{ message: error.message }] }, 400); }
    return true;
  };
}
module.exports = { fixtureAPI, readFixtures, json };
