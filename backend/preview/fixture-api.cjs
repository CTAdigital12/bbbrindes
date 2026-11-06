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
  const [products, categories, media, banners, settings] = await Promise.all([
    all('produtos'), all('categorias'), all('media'), all('hero-slides'),
    fetch(backend + '/api/globals/configuracoes').then(r => r.json()),
  ]);
  return { products, categories, media, banners, certifications: settings.selos?.length || 0 };
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
function fixtureAPI(data) {
  let failWrite = false;
  const routes = [
    { method: 'GET', match: url => url.pathname === '/preview-data', run: () => data },
    { method: 'POST', match: url => url.pathname === '/preview-control', run: () => { failWrite = true; return { ok: true }; } },
    { method: 'GET', match: url => url.pathname === '/api/media', run: (_req, url) => mediaPage(url, data) },
    { method: 'POST', match: url => url.pathname === '/api/media', run: (req, url) => upload(req, url, data) },
    ...['POST', 'PATCH'].map(method => ({ method, match: url => /^\/api\/produtos(?:\/\d+)?$/.test(url.pathname), run: async (req, url) => {
      if (failWrite) { failWrite = false; throw new Error('Falha simulada: alterações não foram salvas.'); }
      return saveProduct(req, url, data);
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
