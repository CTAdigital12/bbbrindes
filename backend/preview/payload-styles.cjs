// Usa o CSS real para que conflitos com os componentes do Payload aparecam na previa.
async function readPayloadStyles() {
  const origin = 'https://heartfelt-courtesy-production-3747.up.railway.app';
  const response = await fetch(origin + '/admin/login');
  if (!response.ok) throw new Error(`CSS do Payload: login respondeu ${response.status}`);
  const html = await response.text();
  const links = [...html.matchAll(/<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/g)];
  const urls = links.map(match => new URL(match[1], origin)).filter(url => url.origin === origin && /^\/_next\/static\/css\/[a-f0-9]+\.css$/.test(url.pathname));
  if (!urls.length) throw new Error('Nao foram encontrados os estilos reais do Payload.');
  return urls.map(url => `<link rel="stylesheet" href="${url.href}">`).join('');
}
module.exports = { readPayloadStyles };
