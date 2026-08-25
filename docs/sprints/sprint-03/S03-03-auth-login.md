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

## Atualizacao 23/07/2026 (golden path do revendedor e do admin)
Regras dos golden paths (docs/golden-paths.md) que entram neste card:
1. Revendedores vira colecao auth com ACESSO UNICO POR EMPRESA, sem sub-usuarios na v1.
2. Campo `nivel` (1 a 4) define qual das 4 tabelas de preco o revendedor enxerga.
3. Aprovar e atribuir tabela sao o MESMO passo: um revendedor nunca pode ficar ativo sem
   tabela, senao ve preco errado ou nenhum. Modelar como regra/hook no Payload (ativar
   exige nivel/tabela).
4. Admin e o proprio painel do Payload: autonomia total de catalogo (produto, metatag,
   cores, tags) e Marketing Frontend (banners, fotos), mais a aprovacao de revendedor.
Buildable JA (backend no ar): auth do revendedor e do admin, protecao de rota. Preco e
estoque seguem placeholder ate a integracao (S03-09).

## Atualizacao 23/07/2026 (escopo confirmado: so revendedor e admin logam)
Confirmado contra requisitos, golden path, CLAUDE.md e wireframe: o CLIENTE FINAL NAO
loga e NAO cria conta (orcamento e formulario anonimo). Auth so para revendedor e admin.
"Cadastro" nos requisitos = preencher os dados do formulario, nao criar conta. Ver
docs/golden-paths.md secao 0.
