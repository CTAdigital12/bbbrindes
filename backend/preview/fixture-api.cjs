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
async function readFixtures() {
  const [products, categories, media, banners, settings, home, campanhas] = await Promise.all([
    all('produtos'), all('categorias'), all('media'), all('hero-slides'),
    fetch(backend + '/api/globals/configuracoes').then(r => r.json()),
    fetch(backend + '/api/globals/conteudo-home?depth=1').then(r => r.json()),
    all('campanhas'),
  ]);
  const countByCat = new Map();
  for (const p of products) for (const c of (p.categorias || [])) { const id = typeof c === 'number' ? c : c && c.id; if (id != null) countByCat.set(id, (countByCat.get(id) || 0) + 1); }
  const categoriasRows = categories.map(c => ({ ...c, produtosCount: countByCat.get(c.id) || 0 }));
  return { products, categories, media, banners, certifications: settings.selos?.length || 0, home, campanhas, categoriasRows };
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
