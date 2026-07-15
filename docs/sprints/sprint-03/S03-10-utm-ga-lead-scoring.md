# S03-10 UTM + tagueamento GA para lead scoring

Status: a fazer
Frente: frontend
Prioridade: P1
Atualizado: 15/07/2026 BRT

## Descricao
Capturar no site as interacoes e a origem de trafego (UTM) e o tagueamento do Google
Analytics, e anexar esses dados ao lead. O CRM (Leads2b) usa isso para o lead scoring.
A captura no site nao depende de terceiros; o scoring acontece no CRM.

## Checklist
- [ ] Ler e persistir os parametros UTM (source, medium, campaign, term, content) na sessao/lead
- [ ] Integrar o Google Analytics (GA4) com consentimento (LGPD)
- [ ] Taguear os eventos relevantes (ver produto, adicionar ao orcamento, enviar lead)
- [ ] Anexar UTM e client id do GA ao payload do lead (entra no S03-06/S03-09)
- [ ] Banner/gestao de consentimento de cookies (LGPD) antes de disparar trackers

## Observacoes
LGPD: so disparar analytics com base legal/consentimento; nao coletar alem do
necessario. O ID de medida do GA e o destino do scoring vem com a definicao do CRM.
A parte de captura de UTM ja pode ser feita; o GA depende do ID de medida do cliente.
