# S03-09 Integracao Leads2b (CRM): revenda e envio de leads

Status: a fazer
Frente: backend
Prioridade: P0 (bloqueado)
Atualizado: 15/07/2026 BRT

## Descricao
Implementar o consumo real da API do Leads2b (CRM), unica ponte do site com o mundo
ERP. Cobre os dois sentidos: puxar do CRM os dados do painel de revenda (estoque,
preco, fechamento de pedido e historico) e enviar ao CRM os leads dos formularios do
site. E a implementacao concreta do adapter que o S03-06 deixa como stub.

## Checklist
- [ ] Cliente da API Leads2b (auth, base URL, tratamento de erro e retry) via env
- [ ] Adapter de leads: envia orcamento e SAC ao CRM (implementa a interface do S03-06)
- [ ] Consumo de estoque/preco por produto para o painel de revenda (chave: codigo Cigan)
- [ ] Fechamento de pedido do revendedor via CRM
- [ ] Historico de pedidos do revendedor via CRM
- [ ] Cache/ISR onde fizer sentido para nao bater no CRM a cada request
- [ ] Teste minimo do envio de lead e da leitura de estoque (CLAUDE.md regra 19)

## Observacoes
Bloqueado: falta a URL, a credencial e a doc da API Leads2b, alem da pauta formal com
o Leonardo para os detalhes da ponte CRM-ERP. Sem integracao direta site-ERP. A chave
que casa produto e CRM/ERP e o codigo Cigan. Ver docs/arquitetura-backend.md (secao
Integracao Site x CRM x ERP). LGPD: minimo de PII, nunca logar dados completos.
