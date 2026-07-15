# S03-05 Migration de carga do catalogo

Status: a fazer
Frente: backend
Prioridade: P1
Atualizado: 15/07/2026 BRT

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
