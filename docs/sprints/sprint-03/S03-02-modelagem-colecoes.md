# S03-02 Modelagem das colecoes (schema)

Status: em andamento
Frente: backend
Prioridade: P0
Atualizado: 16/07/2026 BRT

## Descricao
Transformar o mock de hoje (data/*.ts) em colecoes reais no Payload. Inclui os
campos novos da PDP definidos pelo Plinio e os campos que o ERP vai alimentar (preco
e estoque), estes marcados como origem ERP e nao sobrescritos pelo cadastro.

## Checklist
- [ ] Colecao Produtos: sku (chave), nome, subtitulo, descricaoCurta, descricaoCompleta, beneficios, idealPara, diferenciaisProduto, categoria, material, aplicacoes, cores, imagens
- [ ] Campos preco e estoque marcados como origem ERP (placeholder ate a integracao)
- [ ] Colecao Categorias (as 15 validadas, com o grupo Ecologicos)
- [ ] Colecoes de conteudo: Banners, Mini banners, Campanhas, Blog, Cases, Imprensa
- [ ] Colecao Revendedores (empresa, responsavel, CNPJ, endereco de entrega, notas)
- [ ] Tipos gerados do Payload para o front consumir

## Observacoes
O conteudo editorial/SEO (subtitulo, descricoes, beneficios) vive aqui e nao vem do
ERP. O codigo Cigan e a chave que casa com CRM/ERP. Ver docs/arquitetura-backend.md.

## Atualizacao 15/07/2026 (reuniao Julien x Plinio)
A primeira versao das colecoes foi implementada (backend/src/collections, commit
0dacaf3) antes da reuniao. O cliente validou a estrutura de produto e ela muda: dois
codigos (site + Cigan) no lugar de um sku; headline; palavra chave e meta description;
argumento comercial (interno); ate 3 categorias por produto (relacao multipla, a
primeira principal); ecologico como boolean; e o grupo `erp` reenquadrado como
integracao via CRM (Leads2b), nao ERP direto. Decisao do Fabio: NAO mexer no schema
ate a planilha final do Plinio (codigos em unificacao), para evitar retrabalho. O
delta completo esta em docs/modelo-produto.md. Card congelado ate la.

## Atualizacao 16/07/2026 (planilha real analisada)
A planilha do cliente chegou (versao 06.2026, ~190 produtos, 50 colunas) e foi
analisada linha a linha. Ela destrava a maior parte do modelo, mas o card SEGUE
congelado por tres bloqueios (detalhe em docs/modelo-produto.md):
1. Granularidade: o codigo CIGAM descarta o sufixo de variacao do codigo do site
   (233 CL e 233 PB sao dois produtos no site com o mesmo CIGAM MV01233). Como o CIGAM
   e a chave que traz preco/estoque do CRM, nao da para marcar como unique ate decidir
   se e variacao de um produto ou dois produtos no mesmo item do ERP.
2. Imagens: a planilha nao tem coluna de imagem, arquivo ou link.
3. Cores/variacoes: a planilha nao tem coluna de cor. Provavel que os ~1200 SKUs do
   escopo sejam ~190 produtos x cores, ou seja, o import teria que gerar as variacoes.

Alem do delta ja registrado, a planilha revelou 26 colunas nao citadas na ata que
tambem entram neste card: 13 selos por produto (livre de BPA, 100% reciclado,
logistica reversa, fibra natural etc.), 8 campos de logistica (NCM, peso, caixa
master) e 5 de impressao (metodos e areas). Mais 7 flags de canal (SITE, BRINDICE,
FREESHOP, brindes.com, CATALOGO, TABELA REVENDA, TABELA B2B), que viram visibilidade
do produto. Resolvido de graca: "Medalhas e Trofeus" nao e linha ecologica (o
`ecologico=sim` so aparece nas linhas Green).

## Atualizacao 28/08/2026 (schema de produto destravado no nivel piloto)
Material do Plinio (planilha com slug/title tag + pasta de imagens do Squeeze) permitiu
reescrever a colecao Produtos conforme docs/modelo-produto.md e validar com 1 produto real.
Ver docs/REGISTRO.md (28/08/2026). Destravado: dois codigos, SEO por produto, categorias
multiplas, ecologico booleano, selos, logistica, impressao, canais. Ainda bloqueado para o
import completo: fonte estruturada de cor/tom por SKU e convencao de nome de imagem. codigoCigam
segue NAO unique (CL/PB). Branch feature/sprint-03-02-produto-piloto-squeeze.
