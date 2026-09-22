#!/usr/bin/env python3
# Pre-processador do catalogo: le o CSV bruto do cliente (aba Especificacoes) e
# emite um JSON normalizado que o seed backend/src/seed/catalogo.ts consome.
#
# Por que existe: o CSV tem cabecalho agrupado em 2 linhas, celulas multi-linha
# (beneficios, especificacoes) e nomes de categoria com acento/caixa. O Python
# resolve CSV com robustez (aspas, quebras internas); o seed TS fica simples.
#
# O CSV bruto e o JSON de saida NAO vao pro repo (repo publico; ficam gitignored
# em backend/src/seed/data/). So esta logica de transformacao e versionada.
#
# Uso (na pasta docs/importacao-catalogo/, ou passando os caminhos):
#   python build-catalogo-json.py "<caminho do CSV>" "<caminho do JSON de saida>"
# Padroes: CSV em ~/Downloads (versao AGOSTO_26), JSON em backend/src/seed/data/catalogo.json

import csv
import json
import os
import re
import sys
import unicodedata

# --- caminhos ---
HOME = os.path.expanduser("~")
DEFAULT_CSV = os.path.join(
    HOME,
    "Downloads",
    "PLANILHA BANCO DE DADOS BB Brindes — Planilha de produtos e suas especificações (AGOSTO_26) - Especificações.csv",
)
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
DEFAULT_OUT = os.path.join(REPO, "backend", "src", "seed", "data", "catalogo.json")

CSV_PATH = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_CSV
OUT_PATH = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_OUT

# --- indices de coluna (linha 1 do CSV = nomes reais) ---
C = {
    "site": 0, "tabelaRevenda": 5, "tabelaB2B": 6,
    "codigoSite": 7, "codigoCigam": 8, "nome": 9,
    "subtitulo": 10, "descricaoCurta": 11, "descricaoCompleta": 12,
    "beneficios": 13, "especificacoes": 14, "idealPara": 15, "diferenciais": 16,
    "palavrasChave": 17, "titleTag": 18, "metaDescription": 19, "slug": 20,
    "altTextPrincipal": 21, "cat1": 22, "cat2": 23, "cat3": 24, "ecologico": 25,
    "ncm": 39, "dimensoes": 40, "pesoUnitario": 41, "materiaPrima": 42,
    "modeloCaixaMaster": 43, "qtdPorCaixa": 44, "dimensoesCaixaMaster": 45,
    "pesoCaixaMaster": 46, "metodos": 47, "areaTransfer": 48,
    "areaTampografia": 49, "areaSerigrafia": 50, "sleeve": 51,
}
# selos: coluna do CSV -> chave do grupo `selos` no schema Payload
SELOS = {
    26: "livreDeBpa", 27: "usoMicroondas", 28: "usoLavaLoucas",
    29: "recicladoTotal", 30: "logisticaReversa", 31: "usoPermanente",
    32: "reducaoCo2", 33: "fonteRenovavel", 34: "designCircular",
    35: "upcycling", 36: "fibraNatural", 37: "reciclavel", 38: "reducaoPlastico",
}

NEGATIVOS = {"", "NAO", "NÃO", "N", "-", "0", "X-", "FALSE"}


def strip_acentos(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def slugify(s):
    s = strip_acentos(s).lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def norm_cat(s):
    return re.sub(r"[^a-z0-9]", "", strip_acentos(s).lower())


# nome de categoria (normalizado) -> slug da collection categorias
CAT_MAP = {
    "greenfibras": "green-fibras",
    "greenplasticaria": "green-plasticaria",
    "medalhasetrofeus": "medalhas-trofeus",
    "infantil": "infantil",
    "canecasexicaras": "canecas-xicaras",
    "bowlsbaldesepotes": "bowls-potes",
    "togoviagem": "to-go-viagem",
    "escritorio": "escritorio",
    "copos": "copos",
    "casaedecoracao": "casa-decoracao",
    "squeezes": "squeezes",
    "chaveiros": "chaveiros",
    "inmoldlabel": "in-mold-label",
    "cordoesecosturados": "cordoes-costurados",
}


def cell(row, key):
    i = C[key]
    return row[i].strip() if len(row) > i else ""


def truthy(v):
    return v.strip() != "" and strip_acentos(v).strip().upper() not in NEGATIVOS


def lista_por_linha(v):
    # uma entrada por linha; dropa linhas so com bullet/pontuacao (sem letra/digito)
    out = []
    for ln in re.split(r"\r?\n", v):
        t = ln.strip()
        if not t:
            continue
        if not re.search(r"[0-9A-Za-zÀ-ÿ]", t):
            continue
        out.append(t)
    return out


def pares_especificacoes(v):
    # linhas alternadas: rotulo, valor, rotulo, valor...
    linhas = [ln.strip() for ln in re.split(r"\r?\n", v) if ln.strip()]
    pares = []
    for i in range(0, len(linhas) - 1, 2):
        rotulo, valor = linhas[i], linhas[i + 1]
        if rotulo and valor:
            pares.append({"rotulo": rotulo, "valor": valor})
    return pares


def paragrafos(v):
    return [p.strip() for p in re.split(r"\r?\n\s*\r?\n|\r?\n", v) if p.strip()]


def qtd(v):
    m = re.search(r"\d+", v.replace(".", "").replace(",", ""))
    return int(m.group()) if m else None


def cat_slugs(row, warn):
    slugs = []
    for k in ("cat1", "cat2", "cat3"):
        nome = cell(row, k)
        if not nome:
            continue
        slug = CAT_MAP.get(norm_cat(nome))
        if slug is None:
            warn.append(f"categoria nao mapeada: {nome!r} (produto {cell(row,'codigoSite')})")
            continue
        if slug not in slugs:
            slugs.append(slug)
    return slugs


def main():
    with open(CSV_PATH, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.reader(f))
    prods = [r for r in rows[2:] if len(r) > 9 and cell(r, "codigoSite") and cell(r, "nome")]
    site_ok = [r for r in prods if cell(r, "site").lower() == "ok"]

    warn = []
    seen_slug = {}
    seen_codigo = set()
    out = []
    for r in site_ok:
        codigo = cell(r, "codigoSite")
        if codigo in seen_codigo:
            warn.append(f"codigoSite duplicado, pulando 2a ocorrencia: {codigo}")
            continue
        seen_codigo.add(codigo)

        nome = cell(r, "nome")
        cslug = cell(r, "slug").strip("/").split("/")[-1]
        slug = slugify(cslug) if cslug else slugify(nome)
        if slug in seen_slug and seen_slug[slug] != codigo:
            slug = f"{slug}-{slugify(codigo)}"
            warn.append(f"slug colidiu, desambiguado para {slug} (produto {codigo})")
        seen_slug[slug] = codigo

        cats = cat_slugs(r, warn)
        if not cats:
            warn.append(f"SEM categoria valida, pulando produto {codigo} ({nome})")
            continue

        selos = {}
        for ci, chave in SELOS.items():
            val = r[ci].strip() if len(r) > ci else ""
            if truthy(val):
                selos[chave] = True

        p = {
            "codigoSite": codigo,
            "codigoCigam": cell(r, "codigoCigam") or None,
            "nome": nome,
            "slug": slug,
            "subtitulo": cell(r, "subtitulo") or None,
            "descricaoCurta": cell(r, "descricaoCurta") or None,
            "descricaoCompletaParagrafos": paragrafos(cell(r, "descricaoCompleta")),
            "beneficios": lista_por_linha(cell(r, "beneficios")),
            "idealPara": lista_por_linha(cell(r, "idealPara")),
            "diferenciais": lista_por_linha(cell(r, "diferenciais")),
            "especificacoes": pares_especificacoes(cell(r, "especificacoes")),
            "categorias": cats,
            "ecologico": truthy(cell(r, "ecologico")),
            "selos": selos,
            "seo": {
                "titleTag": cell(r, "titleTag") or None,
                "metaDescription": cell(r, "metaDescription") or None,
                "palavrasChave": [t.strip() for t in cell(r, "palavrasChave").split(",") if t.strip()],
                "altTextPrincipal": cell(r, "altTextPrincipal") or None,
            },
            "logistica": {
                "ncm": cell(r, "ncm") or None,
                "dimensoes": cell(r, "dimensoes") or None,
                "pesoUnitario": cell(r, "pesoUnitario") or None,
                "materiaPrima": cell(r, "materiaPrima") or None,
                "modeloCaixaMaster": cell(r, "modeloCaixaMaster") or None,
                "qtdPorCaixa": qtd(cell(r, "qtdPorCaixa")),
                "dimensoesCaixaMaster": cell(r, "dimensoesCaixaMaster") or None,
                "pesoCaixaMaster": cell(r, "pesoCaixaMaster") or None,
            },
            "impressao": {
                "metodos": cell(r, "metodos") or None,
                "areaTransfer": cell(r, "areaTransfer") or None,
                "areaTampografia": cell(r, "areaTampografia") or None,
                "areaSerigrafia": cell(r, "areaSerigrafia") or None,
                "sleeve": cell(r, "sleeve") or None,
            },
            "canais": {
                "site": cell(r, "site").lower() == "ok",
                "tabelaRevenda": cell(r, "tabelaRevenda").lower() == "ok",
                "tabelaB2B": cell(r, "tabelaB2B").lower() == "ok",
            },
        }
        out.append(p)

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f"CSV:  {CSV_PATH}")
    print(f"JSON: {OUT_PATH}")
    print(f"produtos no CSV: {len(prods)} | SITE=ok: {len(site_ok)} | exportados: {len(out)}")
    print(f"sem beneficios: {sum(1 for p in out if not p['beneficios'])}")
    print(f"sem especificacoes: {sum(1 for p in out if not p['especificacoes'])}")
    print(f"ecologicos: {sum(1 for p in out if p['ecologico'])}")
    print(f"avisos ({len(warn)}):")
    for w in warn:
        print(f"  - {w}")


if __name__ == "__main__":
    main()
