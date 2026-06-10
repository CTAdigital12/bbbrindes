# S00-07 Carrinho de orcamento e formulario

Status: concluido
Frente: frontend
Prioridade: P0
Atualizado: 10/06/2026 12:14 BRT

## Descricao
Carrinho de orcamento (sem pagamento): lista de itens com produto, cor e quantidade editaveis, e formulario obrigatorio com nome, empresa, telefone e email. Validacao apenas de UI na Sprint 0. O envio leva para a tela de confirmacao (S00-08). Integracao real com Leads2b/CRM e Sprint 3.

## Checklist
- [x] Lista de itens (produto, cor, quantidade) com remover e alterar quantidade
- [x] Estado vazio com call to action para o catalogo
- [x] Formulario: nome, empresa, telefone, email (obrigatorios)
- [x] Validacao de UI (campos obrigatorios e formato de email)
- [x] Carrinho persistido entre telas (context + localStorage)
- [x] Envio leva para a tela de confirmacao
