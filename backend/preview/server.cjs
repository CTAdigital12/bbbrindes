// Previa local dos componentes reais. Nunca encaminha escritas para producao.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { readPayloadStyles } = require('./payload-styles.cjs');
const { fixtureAPI, readFixtures, json } = require('./fixture-api.cjs');
const root = path.resolve(__dirname, '../..');
const modules = path.join(root, 'node_modules/.pnpm');
const moduleNames = fs.readdirSync(modules);
const esbuildName = moduleNames.find(name => name.startsWith('esbuild@0.25.')) || moduleNames.find(name => name.startsWith('esbuild@'));
const esbuild = require(path.join(modules, esbuildName, 'node_modules/esbuild'));
const destination = path.join(__dirname, '.build');
const assets = {
  '/app.js': [path.join(destination, 'app.js'), 'text/javascript'],
  '/app.js.map': [path.join(destination, 'app.js.map'), 'application/json'],
  '/app.css': [path.join(destination, 'app.css'), 'text/css'],
  '/admin-brand/bb-brindes.webp': [path.join(root, 'backend/public/admin-brand/bb-brindes.webp'), 'image/webp'],
};
async function start() {
  await esbuild.build({ entryPoints: [path.join(__dirname, 'app.tsx')], bundle: true, outfile: path.join(destination, 'app.js'), jsx: 'automatic', platform: 'browser', target: 'chrome110', sourcemap: true, loader: { '.scss': 'css' }, alias: { 'next/link': path.join(__dirname, 'next-link.tsx'), 'next/navigation': path.join(__dirname, 'next-navigation.ts') } });
  const data = await readFixtures();
  const styles = await readPayloadStyles();
  const handleAPI = fixtureAPI(data);
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (await handleAPI(req, res, url)) return;
      if (assets[url.pathname]) {
        const [file, type] = assets[url.pathname];
        res.writeHead(200, { 'Content-Type': type });
        fs.createReadStream(file).pipe(res);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BB Brindes | Validação do painel</title>${styles}<link rel="stylesheet" href="/app.css"><div id="root"></div><script src="/app.js"></script></html>`);
    } catch (error) { json(res, { message: error.message }, 500); }
  });
  server.listen(3044, '127.0.0.1', () => console.log(JSON.stringify({ preview: 'http://localhost:3044/admin', produtos: data.products.length, categorias: data.categories.length, media: data.media.length, gravacao: 'somente memoria local' })));
}
start().catch(error => { console.error(error.message); process.exitCode = 1; });
