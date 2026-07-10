# S03-03 Autenticacao e paginas de login

Status: a fazer
Frente: fullstack
Prioridade: P0
Atualizado: 09/07/2026 BRT

## Descricao
Login real usando a auth nativa do Payload. Substitui o login mock do wireframe.
Cobre o acesso do revendedor a area logada e o acesso do admin ao painel. Nao
depende do ERP (o ERP entra so para preco e estoque).

## Checklist
- [ ] Auth do Payload configurada (revendedor e admin)
- [ ] Pagina de login do revendedor ligada a auth real (troca o mock)
- [ ] Sessao/protecao de rota na area do revendedor (/revendedor/painel)
- [ ] Painel do admin (/admin) protegido
- [ ] Recuperacao de senha (fluxo basico)
- [ ] Teste minimo do login do revendedor (CLAUDE.md regra 19)

## Observacoes
A area do revendedor ja esta desenhada no wireframe; aqui ela ganha login de
verdade. Preco e estoque continuam placeholder ate a integracao do ERP.
