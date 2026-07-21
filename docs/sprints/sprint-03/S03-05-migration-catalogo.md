# S03-05 Migration de carga do catalogo

Status: a fazer
Frente: backend
Prioridade: P1
Atualizado: 16/07/2026 BRT

## Descricao
Deixar pronta a migration one-shot que carrega os ~1200 produtos de uma vez a partir
do material do Plinio (planilha + imagens). O script fica pronto agora; roda quando o
material chegar no formato combinado.

## Checklist
- [ ] Definir e documentar o formato de entrada (planilha com colunas + convencao de nome de imagem por codigo)
- [ ] Guia pronto para o Plinio montar o material no formato certo
- [ ] Parser da planilha para a colecao Produtos (upsert por codigo Cigan)
- [ ] Casar imagens por codigo e subir para o R2 (otimizadas no upload)
- [ ] Modo dry-run (validar sem gravar)
- [ ] Relatorio de linhas importadas / ignoradas / com erro

## Observacoes
Bloqueada para rodar ate o material chegar, mas o script e o guia de formato podem
ser feitos agora. Ver docs/arquitetura-backend.md.

## Atualizacao 15/07/2026
A estrutura validada muda o template e a chave: dois codigos (site + Cigan; upsert e
casamento por Cigan), ate 3 categorias por produto e os campos novos (headline, SEO,
argumento comercial, ecologico boolean). O template docs/importacao-catalogo (CSV +
GUIA-PLINIO) precisa reconciliar com isso (delta em docs/modelo-produto.md). Acao da
ata: confirmar com o Julien se a planilha do cliente atende o banco antes de reescrever
o template. So mexer quando a planilha final chegar.

## Atualizacao 16/07/2026 (planilha real analisada)
A planilha do cliente (06.2026, ~190 produtos, 50 colunas) chegou e foi analisada.
Impactos diretos neste card (detalhe em docs/modelo-produto.md):
1. O template docs/importacao-catalogo esta SUPERADO. A planilha do cliente e a fonte;
   o template so serviria se tivessemos que pedir o material do zero. Decidir:
   descontinuar ou reescrever como espelho da planilha.
2. A chave de upsert nao esta resolvida. O CIGAM nao e unico (233 CL e 233 PB
   compartilham MV01233), entao upsert por CIGAM quebraria. Aguarda a decisao de
   granularidade.
3. O import teria que gerar variacoes de cor, mas a planilha nao tem coluna de cor nem
   de imagem. Sem isso, nao ha carga de catalogo.
4. Parsing exige limpeza: a coluna SITE mistura `ok`, `ok (370 ml)`, `S/COD` e
   `COD. 280`; peso sem padrao (33gr/44g/3,5/150); dimensoes em texto livre; categorias
   com variacao de acento e caixa (precisa de mapa de nomes para as 15 validadas).
5. Listas vem com um item por linha na celula (beneficios, ideal para, diferenciais) e
   palavras chave SEO vem separadas por virgula. O parser precisa quebrar por \n e por
   virgula, respectivamente.
6. Importar apenas linhas com a flag SITE preenchida.
