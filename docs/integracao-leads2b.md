# Integracao com o CRM Leads2b (S03-09)

Plano de integracao entre o site e o CRM Leads2b. Baseado na documentacao oficial
(https://developers.leads2b.dev) estudada em 23/07/2026 e nas respostas do Julien de
23/07. Fonte da verdade desta frente. Ver [S03-09](sprints/sprint-03/S03-09-integracao-leads2b.md)
e [S03-06](sprints/sprint-03/S03-06-captura-leads.md).

## 1. O que a documentacao confirma

1. Autenticacao: header `Authorization: Bearer <token>`. O token e gerado na interface
   do Leads2b (Configuracoes > Integracoes > Gerar Chave), exige usuario admin e um plano
   com o modulo de API. Sem refresh automatico: e um token fixo, de vida longa. 401 se
   invalido.
2. Base URL: `https://api.leads2b.com/`, com versao (v1 e v2). REST, JSON, metodos
   GET/POST/PATCH/DELETE.
3. Recursos documentados (guia da API): Leads, Oportunidades e Orcamentos, alem de
   Pedidos, Clientes/Enderecos e Produtos.
4. Webhooks: so de SAIDA (o Leads2b notifica a gente). Registrados na interface
   (Configuracoes > Apps e Conexoes > Webhooks); disparam POST JSON para uma URL publica
   nossa. Payload = bloco `meta` (id, company_id, object, action, user_id, date) + bloco
   `data` (especifico do objeto). Objetos: customer, item, order, lead, opportunity,
   after_sale, quotation. Acoes: created, updated, deleted, won, lost.

## 2. A lacuna a resolver

Nao foi possivel extrair da referencia (openapi.html) o endpoint EXATO de criar lead
(caminho e campos do corpo). O spec e grande e a leitura automatica so capturou a secao
de Pedidos; Leads/Oportunidades/Orcamentos ficaram fora do trecho lido, e o arquivo do
spec nao esta num caminho .json/.yaml acessivel direto. O guia confirma que as secoes
existem; falta o detalhe.

Como fechar, em ordem de facilidade:
1. Abrir https://developers.leads2b.dev/api/openapi.html num navegador e copiar a secao
   "Leads": metodo, caminho e campos.
2. Com um token, bater na API e descobrir o formato exato (de preferencia em sandbox).
3. Perguntar ao suporte: contato@leads2b.com.

## 3. Requisito do cliente que define o desenho (Julien, 23/07)

Pergunta: o orcamento solicitado deve ser salvo no nosso banco, ou so no CRM?
Resposta: "NAO PRECISO ARMAZENAR, DESDE QUE TENHA UM LOG DE ENTREGA".

Consequencia direta: o CRM (Leads2b) e o dono do dado do orcamento. O site NAO mantem um
banco de orcamentos/leads. O site precisa entregar o lead ao CRM e manter um LOG DE
ENTREGA (auditoria de que foi enviado e se chegou). Isso simplifica o desenho e ajuda na
LGPD (menos PII guardada).

## 4. Arquitetura proposta

Principio central: entregar o lead ao CRM de forma confiavel, com prova de entrega, sem
virar um banco de leads paralelo.

1. Fluxo: formulario de orcamento (nome, empresa, telefone, email + itens do carrinho) ->
   backend (Payload) -> adapter do Leads2b cria o lead -> registra no log de entrega.
2. Log de entrega (nao e "armazenar o orcamento"): cada submissao gera um registro com
   data/hora, um id interno da requisicao, o id retornado pelo CRM quando houver, e o
   status (entregue, falhou, reenviado). Minimo de PII no log; nunca PII completa em texto
   claro (regra 15).
3. Durabilidade e retry, com honestidade sobre o trade-off: para reenviar apos uma falha,
   o payload do orcamento precisa existir em algum lugar no momento do retry. Solucao que
   respeita o "nao armazenar": guardar o payload apenas ATE a entrega (curta duracao, fila
   ou registro temporario), e apos entregar manter so o registro minimo de auditoria,
   descartando/minimizando o payload. Assim nao viramos um banco de leads permanente.
4. Adapter atras de interface: o envio ao Leads2b fica isolado. Da para construir o
   formulario, o log e a interface agora (com stub), e plugar o endpoint real quando o
   formato do lead estiver confirmado (secao 2). E o que o S03-06 ja previa como stub.
5. Token so no servidor: a chamada sai do backend, nunca do navegador. Token em
   variavel de ambiente/secret, jamais no repo (regra 14).
6. Mapeamento de objeto (recomendacao): o orcamento do site vira um LEAD no Leads2b, com
   os itens do carrinho serializados num campo de observacao. E o menos acoplado, porque
   nao exige sincronizar os IDs de produto do nosso catalogo com os do Leads2b. Criar
   "quotation" (orcamento) estruturado fica para uma fase 2, se precisar.
7. LGPD: consentimento antes de enviar, minimo de PII, sem PII completa em log (regra 15).

## 5. Seguranca dos webhooks (se formos consumir)

Os webhooks NAO tem verificacao de assinatura documentada. Se consumirmos (fase 2),
proteger por conta: URL secreta com token no caminho, tratar todo payload como nao
confiavel, validar contra o que esperamos, e allowlist de IP se o Leads2b publicar os IPs.

## 6. Faseamento

1. Fase 0 (ja da para fazer, agora que o Supabase esta confirmado): formulario de
   orcamento gravando via adapter stub, o log de entrega, e a interface do adapter.
   Testavel de ponta a ponta.
2. Fase 1 (precisa do token e do formato do lead): implementar o adapter real (criar
   lead) com fila e retry. Testar contra o Leads2b, de preferencia em sandbox.
3. Fase 2 (opcional): consumir webhooks (lead ganho/perdido) para refletir status, com a
   protecao da secao 5.

## 7. Dependencias a resolver (lado do cliente)

1. Um token da conta Leads2b do cliente (admin gera em Configuracoes > Integracoes; nos
   recebemos como secret). Mesma logica do banco: depende de alguem com acesso la.
2. Confirmar se existe ambiente de teste/sandbox, para nao sujar o CRM real no dev.
3. O formato exato do endpoint de criar lead (as tres opcoes da secao 2).
