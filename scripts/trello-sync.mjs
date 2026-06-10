// Sincroniza os cards das sprints (docs/sprints/**/S*.md) com o board do Trello.
// Cria listas por status (A Fazer, Em Andamento, Concluido), cria cada card com
// descricao e checklist, e nao duplica (pula cards cujo codigo ja existe).
//
// Uso (a partir da raiz do repo):
//   node --env-file=.env scripts/trello-sync.mjs
// Requer TRELLO_API_KEY, TRELLO_TOKEN e TRELLO_BOARD_ID no .env.

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const KEY = process.env.TRELLO_API_KEY;
// Aceita TRELLO_TOKEN ou TRELLO_API_TOKEN (nomes usados no .env).
const TOKEN = process.env.TRELLO_TOKEN || process.env.TRELLO_API_TOKEN;
const BOARD = process.env.TRELLO_BOARD_ID || "dAiTB3Ff";
const API = "https://api.trello.com/1";

if (!KEY || !TOKEN) {
  console.error("Defina TRELLO_API_KEY e TRELLO_TOKEN no .env. Veja .env.example.");
  process.exit(1);
}

const SPRINTS_DIR = "docs/sprints";
// Nome de exibicao usado so se a lista nao existir no board (criacao).
const STATUS_DISPLAY = { "a fazer": "A Fazer", "em andamento": "Em andamento", concluido: "Concluido" };

async function trello(method, path, params = {}) {
  const qs = new URLSearchParams({ key: KEY, token: TOKEN, ...params });
  const res = await fetch(`${API}${path}?${qs}`, { method });
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// Normaliza nome de lista: sem acento, sem emoji, minusculo (para casar nomes do board).
function norm(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function statusKey(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("concl")) return "concluido";
  if (s.includes("andamento")) return "em andamento";
  return "a fazer";
}

function parseCard(md) {
  const titleLine = md.split(/\r?\n/).find((l) => l.startsWith("# ")) || "# (sem titulo)";
  const title = titleLine.replace(/^#\s+/, "").trim();
  const code = title.split(/\s+/)[0];
  const status = (md.match(/^Status:\s*(.+)$/m)?.[1] || "").trim();
  const desc = ((md.split("## Descricao")[1] || "").split("## Checklist")[0] || "").trim();
  const checklistRaw = md.split("## Checklist")[1] || "";
  const items = [...checklistRaw.matchAll(/^- \[( |x)\]\s+(.+)$/gm)].map((m) => ({
    checked: m[1] === "x",
    name: m[2].trim(),
  }));
  return { title, code, status, desc, items };
}

async function listarArquivosDeCard() {
  const sprints = (await readdir(SPRINTS_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  const arquivos = [];
  for (const sprint of sprints) {
    const dir = join(SPRINTS_DIR, sprint);
    const files = (await readdir(dir))
      .filter((f) => /^S\d+-\d+.*\.md$/i.test(f))
      .sort();
    for (const f of files) arquivos.push({ sprint, path: join(dir, f) });
  }
  return arquivos;
}

async function main() {
  console.log(`Board: ${BOARD}`);

  // Listas existentes do board. Casamos por nome normalizado para nao duplicar
  // (ex.: "Concluido" casa com "Concluido 🎉"). So cria se nao houver match.
  const lists = await trello("GET", `/boards/${BOARD}/lists`);
  async function resolveLista(key) {
    let l = lists.find((x) => norm(x.name) === key);
    if (!l) {
      l = await trello("POST", `/boards/${BOARD}/lists`, { name: STATUS_DISPLAY[key] || key });
      lists.push(l);
      console.log(`Lista criada: ${STATUS_DISPLAY[key] || key}`);
    }
    return l;
  }

  // Cards existentes, para nao duplicar (match pelo codigo S00-01 no inicio do nome).
  const existentes = await trello("GET", `/boards/${BOARD}/cards`, { fields: "name" });
  const codigosExistentes = new Set(
    existentes.map((c) => c.name.trim().split(/\s+/)[0]),
  );

  const arquivos = await listarArquivosDeCard();
  let criados = 0;
  let pulados = 0;

  for (const { path } of arquivos) {
    const md = await readFile(path, "utf8");
    const card = parseCard(md);

    if (codigosExistentes.has(card.code)) {
      pulados++;
      console.log(`Pulado (ja existe): ${card.code}`);
      continue;
    }

    const lista = await resolveLista(statusKey(card.status));
    const novo = await trello("POST", "/cards", {
      idList: lista.id,
      name: card.title,
      desc: card.desc,
    });

    if (card.items.length > 0) {
      const cl = await trello("POST", "/checklists", { idCard: novo.id, name: "Checklist" });
      for (const it of card.items) {
        await trello("POST", `/checklists/${cl.id}/checkItems`, {
          name: it.name,
          checked: String(it.checked),
        });
      }
    }

    codigosExistentes.add(card.code);
    criados++;
    console.log(`Criado: ${card.code} -> ${lista.name} (${card.items.length} itens)`);
  }

  console.log(`\nResumo: ${criados} criado(s), ${pulados} pulado(s).`);
}

main().catch((err) => {
  console.error("Falha no sync com o Trello:");
  console.error(err.message);
  process.exit(1);
});
