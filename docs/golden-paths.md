# Golden paths: revendedor e administrador

Fonte da verdade dos fluxos de uso do revendedor e do administrador do site, extraidos
do canvas do Obsidian ("BB Brindes - Golden Path.png", na raiz do repo) e das respostas
do cliente. Alimenta os cards S03-03 (auth), S03-04 (front), S03-06 (leads) e S03-12
(portal do revendedor). Onde um fluxo depende do CRM/ERP, esta marcado, porque isso
define o que da para construir agora e o que espera a integracao Leads2b (ver
docs/integracao-leads2b.md).

## 0. Quem loga (escopo de autenticacao)

Apenas REVENDEDOR e ADMIN tem login. O CLIENTE FINAL NAO loga e NAO cria conta.
Confirmado por quatro fontes:
1. PERGUNTAS ECOMMERCE.md: a pergunta "login de clientes?" e respondida escopando login
   so para a revenda ("Precisa ter login para o painel de compras da revenda").
2. Golden path (cliente final): "Sem criacao de conta. Meta explicita: jornada de menos
   de 3 minutos".
3. CLAUDE.md: cliente monta o carrinho e envia orcamento por formulario; "Area de
   revendedor com login".
4. Wireframe: so existe /revendedor/login; a pagina de orcamento nao tem auth.

Cuidado de vocabulario: nos requisitos, "para fazer o pedido precisa do cadastro
obrigatoriamente, nome, telefone, email e nome da empresa" quer dizer PREENCHER os dados
obrigatorios no formulario, NAO criar conta nem logar. O cliente informa os dados, o lead
vai para o CRM, e acabou. Isso define o escopo do S03-03: auth so para revendedor e admin.

## 1. Revendedor: virar revendedor (cadastro)

Gatilho: chega na pagina institucional de Revendedores (banner + numeros + beneficios)
ou pelo menu.

Passos:
1. Le a proposta de revenda na pagina de Revendedores.
2. Clica em "Quero ser revendedor".
3. Preenche o formulario de solicitacao.
4. Recebe confirmacao com prazo de analise.
5. A BB aprova e ele recebe o acesso JA com a tabela de preco atribuida.

Momento de valor: no primeiro login ele ja ve o preco dele e o material de venda.

Resultado tecnico: a solicitacao vira lead/oportunidade na Leads2b, num FUNIL NOVO, com
as tags `origem-site-cadastro-sobrindes` + `interesse-revenda`.

Decisoes fechadas:
1. Campos do formulario: CNPJ, inscricao estadual, nome fantasia, razao social,
   cidade/UF, site, WhatsApp, e-mail, endereco.
2. Prazo de analise prometido: 24 horas.
3. Criterio de aprovacao: exclusivo para empresas revendedoras de brinde.
4. Quem aprova: Elieser. Se recusar, o Elieser entra em contato.
5. Precisa de um funil novo no Leads2b (sera criado) e a solicitacao vai para la.

## 2. Revendedor: usar o portal (pre-pedido)

Quando o revendedor precisa vender ou acompanhar um pedido, resolve no portal SEM ligar
para a BB.

Gatilho: o cliente dele pediu preco, ou ele quer saber onde esta o pedido.

Passos:
1. Faz login.
2. Cai numa tela que ja mostra os pedidos em aberto.
3. Consulta produto com a tabela de preco DELE aplicada.
4. Monta pedido.
5. Acompanha ate a entrega.
6. Confirmacao de pedido enviado.

Regras embutidas (as mais importantes):
1. Acesso UNICO por empresa, sem niveis de usuario. Usuario unico na v1, sem
   sub-usuarios.
2. Quatro tabelas de preco. O nivel no cadastro define se o revendedor ve a tabela 1, 2,
   3 ou 4.
3. E PRE-PEDIDO, nao e-commerce. O botao e "FAZER PEDIDO", nao ha checkout; o fechamento
   se da com o financeiro.
4. Estoque por cor em tempo real e obrigatorio, via conexao com ERP/CRM.
5. Navegacao igual a do cliente final, so acrescentando o painel de estoque por cor e o
   botao de adicionar ao pedido.
6. Depois do pedido emitido, o portal vira ferramenta informativa: administracao de
   pedidos, historico de compras, nota fiscal em PDF e rastreamento de entrega.

Escala: ~4000 revendedores.

DEPENDENCIA: preco por tabela, estoque por cor em tempo real, nota fiscal em PDF e
rastreamento VEM do CRM/ERP (Site -> CRM Leads2b -> ERP). O shell navegavel e o pre-pedido
a gente constroi; esses dados ficam placeholder ate a integracao.

## 3. Administrador do site (o mundo do Plinio)

O canvas separa em quatro responsabilidades.

1. Catalogo (a exigencia mais enfatica da call). Autonomia TOTAL: cadastrar produto,
   metatag, script, descricao, cores possiveis, metadados e tags, sem depender da
   agencia. Conteudo mora em campos de texto, nao em banner desenhado um a um, para a BB
   replicar sozinha. E esse mesmo acesso que libera o cadastro de revendedores.
2. Revendedores (quem libera acesso). Recebe a solicitacao do formulario "Quero ser
   revendedor" -> analisa -> aprova ou recusa -> ATRIBUI A TABELA DE PRECO -> ativa.
   PASSO CRITICO: aprovar e atribuir tabela tem que ser o MESMO passo, senao o revendedor
   entra vendo preco errado ou nenhum. Um revendedor nunca pode ficar ativo sem tabela.
3. Comercial. E so um LOG, nao um painel de trabalho. Puxa contagem de leads, basico. O
   trabalho comercial de verdade acontece na Leads2b; o site so entrega o lead com a tag
   certa.
4. Marketing Frontend (nome do proprio Plinio). Troca de banners, fotos de categoria,
   elementos sazonais. Tudo frontend, sem time tecnico.

Leitura: o admin e o proprio painel do Payload, que ja entrega catalogo com campos
livres, metatags, cores, tags, aprovacao de revendedor com atribuicao de tabela e edicao
de banners/fotos. A "autonomia total" exigida e literalmente o que o painel do Payload da.

## 4. Pendencia aberta (a confirmar com o Julien)

No canvas, a pergunta "Financeiro (boleto, limite, saldo) entra na primeira versao?"
aparece ligada a resposta "Usuario unico", que parece um cruzamento errado. A leitura
provavel e que o financeiro NAO entra na v1. Confirmar com o Julien antes de modelar
qualquer coisa de financeiro no portal.
