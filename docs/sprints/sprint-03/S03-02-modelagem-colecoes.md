# S03-02 Modelagem das colecoes (schema)

Status: a fazer
Frente: backend
Prioridade: P0
Atualizado: 09/07/2026 BRT

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
ERP. SKU e a chave que o ERP casa depois. Ver docs/arquitetura-backend.md.
