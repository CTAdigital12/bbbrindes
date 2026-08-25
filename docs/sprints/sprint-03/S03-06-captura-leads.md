# S03-06 Captura de leads (orcamento e SAC)

Status: a fazer
Frente: backend
Prioridade: P0
Atualizado: 15/07/2026 BRT

## Descricao
Backend que recebe, valida e persiste os leads dos dois formularios (orcamento B2B e
SAC), com o envio ao CRM/automacao atras de uma interface (adapter). A captura e o
armazenamento ficam prontos agora; a conexao com Leads2b/CRM/e-mail se pluga quando
os provedores forem definidos.

## Checklist
- [ ] Endpoint/colecao para o lead de orcamento (dados + itens + cor + quantidade + origem)
- [ ] Endpoint/colecao para o lead de SAC (com motivo)
- [ ] Validacao server-side e minimo de PII em log (CLAUDE.md regra 15)
- [ ] Interface de envio ao CRM (adapter) com implementacao stub por enquanto
- [ ] Ponto de disparo do e-mail de confirmacao (stub ate o provedor)
- [ ] Teste minimo do fluxo de orcamento (CLAUDE.md regra 19)

## Observacoes
LGPD: coletar o minimo, nunca logar PII completa. O envio real ao CRM e o e-mail sao
Sprint seguinte, quando os provedores estiverem definidos.

## Atualizacao 15/07/2026
O CRM destino e o Leads2b (confirmado na reuniao). Este card faz a captura, a
validacao, a persistencia e a interface de envio (adapter com stub). O adapter real do
Leads2b fica no S03-09 (aguarda a API). O lead deve carregar os dados de origem
(UTM/GA) para o lead scoring no CRM, capturados no S03-10.

## Atualizacao 23/07/2026 (requisito do cliente: log de entrega, nao armazenar)
Julien: "NAO PRECISO ARMAZENAR, DESDE QUE TENHA UM LOG DE ENTREGA". O CRM (Leads2b) e o
dono do dado do orcamento; o site NAO mantem um banco de orcamentos/leads. O site entrega
o lead ao CRM e mantem um LOG DE ENTREGA (auditoria: data/hora, id da requisicao, id
retornado pelo CRM, status entregue/falhou/reenviado), com minimo de PII. Para retry, o
payload existe so ate a entrega (curta duracao), depois so o registro minimo de auditoria.
Isso simplifica o card e ajuda na LGPD. O adapter stub segue valido. Detalhe do desenho e
do endpoint em docs/integracao-leads2b.md.

## Atualizacao 23/07/2026 (formulario "Quero ser revendedor")
Alem de orcamento e SAC, entra a captura da solicitacao de revenda (golden path, ver
docs/golden-paths.md):
1. Formulario "Quero ser revendedor" com CNPJ, inscricao estadual, nome fantasia, razao
   social, cidade/UF, site, WhatsApp, e-mail, endereco.
2. Vira lead na Leads2b num FUNIL NOVO, tags origem-site-cadastro-sobrindes +
   interesse-revenda. Aprovacao manual (Elieser), prazo 24h.
3. Mesmo desenho dos demais leads: entrega ao CRM + log de entrega, SEM armazenar. O
   envio real espera token/endpoint (Fase 1, S03-09); form + log + adapter stub da agora.
