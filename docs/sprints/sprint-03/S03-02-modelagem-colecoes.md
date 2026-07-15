# S03-02 Modelagem das colecoes (schema)

Status: em andamento
Frente: backend
Prioridade: P0
Atualizado: 15/07/2026 BRT

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
