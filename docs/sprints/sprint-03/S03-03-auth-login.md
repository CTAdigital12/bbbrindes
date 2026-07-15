# S03-03 Autenticacao e paginas de login

Status: a fazer
Frente: fullstack
Prioridade: P0
Atualizado: 15/07/2026 BRT

## Descricao
Login real usando a auth nativa do Payload. Substitui o login mock do wireframe.
Cobre o acesso do revendedor a area logada e o acesso do admin ao painel. Nao
depende da integracao (preco, estoque e pedido vem depois do CRM Leads2b, ver
S03-09).

## Checklist
- [ ] Auth do Payload configurada (revendedor e admin)
- [ ] Pagina de login do revendedor ligada a auth real (troca o mock)
- [ ] Sessao/protecao de rota na area do revendedor (/revendedor/painel)
- [ ] Painel do admin (/admin) protegido
- [ ] Recuperacao de senha (fluxo basico)
- [ ] Teste minimo do login do revendedor (CLAUDE.md regra 19)

## Observacoes
A area do revendedor ja esta desenhada no wireframe; aqui ela ganha login de
verdade. Preco e estoque continuam placeholder ate a integracao do CRM Leads2b
(S03-09). A colecao Revendedores (S03-02) vira colecao auth aqui.
