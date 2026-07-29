# Arquitetura de backend e storage (recomendacao)

Documento de decisao. Data: 08/07/2026 BRT. Contexto: catalogo B2B de brindes com
orcamento (sem pagamento), ~1200 SKUs, area de revendedor, painel de cadastro,
integracao com ERP (preco/estoque) e CRM (leads), SEO como objetivo central.
Imagens enviadas pelo Plinio e hospedadas por nos; carga inicial via migration.

## Stack recomendada

1. App: Next.js 15 (App Router) com Payload CMS 3 embutido no mesmo projeto
   (site publico, painel /admin e API). Ja e a stack decidida.
2. Renderizacao: ISR. Paginas do catalogo ficam estaticas/cacheadas (bom para SEO
   e barato de servir) e revalidam sob demanda quando o cliente edita no painel
   (webhook/hook do Payload). Concilia "site rapido e indexavel" com "painel
   dinamico".
3. Banco: Postgres. Metadado de produto e pequeno (poucos MB para 1200 SKUs).
4. Imagens: object storage dedicado, pelo adapter de storage do Payload.
5. Integracao: o site conversa somente com o CRM (Leads2b), que se alimenta do ERP.
   Nao ha integracao direta site-ERP (ver secao "Integracao Site x CRM x ERP"). O
   cadastro no painel cria o conteudo editorial/SEO; a integracao nao o sobrescreve.

## Integracao Site x CRM x ERP (fechado 14/07/2026)

Definido em reuniao (Julien + Plinio; base validada antes com Leonardo Libona e
Thiago). Fluxo oficial e unico:

1. Site -> CRM (Leads2b) -> ERP. O site e o painel de revenda conversam SOMENTE com
   o CRM (Leads2b). O CRM se alimenta do ERP. Nao implementar integracao direta
   site-ERP.
2. O que vem do CRM: preco, estoque, fechamento de pedido e historico do painel de
   revenda; e o destino dos leads dos formularios do site (orcamento, SAC, contato).
3. Chave de integracao: o codigo Cigan (integrador), o mesmo do CRM/ERP. O produto
   tem ainda um codigo do site (comercial/visual, ex.: "MV 01"). O Plinio esta
   unificando os codigos para que um so sirva site, CRM e ERP (por isso a planilha
   atrasa). Ver docs/modelo-produto.md.
4. Captura de interacoes: UTM e tagueamento GA do site vao alimentar o lead scoring
   no CRM.
5. Pendencias: a URL/credencial e a doc da API Leads2b ainda nao chegaram; sem elas o
   painel de revenda e o envio de leads seguem mock. Falta a pauta formal com o
   Leonardo para os detalhes da ponte CRM-ERP.

## A questao das imagens (o ponto principal)

Nao vale pagar o storage do Supabase so por imagem. O custo de um catalogo de
imagem e o egress (banda para servir), nao o espaco guardado. O Supabase free da
~5 GB de egress e corta (HTTP 402) ao estourar.

Decidido: Cloudflare R2. Egress zero para sempre, 10 GB de storage no free.
Dimensionando: ~1200 SKUs x ~3 imagens x ~200 KB otimizada = ~0,7 GB, cabe folgado.
Servir as imagens nunca vira conta relevante.

### Transformacao de imagem no upload (duvida do Fabio)

Sim: o cliente sobe qualquer imagem (um JPEG/PNG pesado) e o codigo gera a versao
otimizada automaticamente. Isso acontece no upload, dentro do Payload, que usa a lib
sharp para redimensionar em alguns tamanhos e converter para WebP. As versoes leves
ficam no R2 e sao as que o site serve. Ou seja, ganhamos o mesmo que o Cloudinary
daria (otimizacao automatica), sem depender dele nem do teto dele, e sem custo por
requisicao. Por isso R2 + Payload/sharp resolve sozinho, e o Cloudinary sai de cena.

## Banco de dados

Product metadata cabe em qualquer free. Atencao a um detalhe do Supabase free: ele
pausa o projeto apos 1 semana sem trafego, ruim para site de cliente no ar. Saidas:

1. Supabase Pro (US$ 25/mes) na producao: remove o pause e amplia egress. DECIDIDO.
2. Neon no free: scale-to-zero acorda sozinho na requisicao, sem pause manual
   semanal. 0,5 GB de storage e 100 CU-horas/mes no free. Mais tranquilo para
   MVP/homologacao.

Ambos funcionam com o adapter Postgres do Payload.

## Hospedagem

Pegadinha: o Vercel Hobby e gratis mas o termo de uso proibe uso comercial, entao
para site de cliente nao serve de graca (viraria Pro, US$ 20/mes). Opcoes:

1. Cloudflare (Pages/Workers + R2): permite uso comercial, egress zero, barato. DECIDIDO.
   Mantem a conta de banda perto de zero mesmo com trafego.
2. Vercel Pro (US$ 20/mes): melhor DX, mas pago para uso comercial.
3. Node host (Railway/Render/Fly) para o Payload, com o front estatico no
   Cloudflare Pages.

## Numeros de free tier (jul/2026, conferir no cadastro)

1. Supabase free: 500 MB DB, 1 GB storage, ~5 GB egress, 2 projetos, pausa apos 1
   semana inativo. Pro US$ 25/mes.
2. Cloudflare R2 free: 10 GB storage, 1M Class A e 10M Class B ops/mes, egress
   zero. Acima: US$ 0,015/GB-mes de storage, egress segue gratis.
3. Cloudinary free: 25 creditos/mes (storage + banda + transformacoes), imagem ate
   10 MB. Estourou, bloqueia upload.
4. Neon free: 0,5 GB storage/projeto, 100 CU-horas/mes, scale-to-zero, 5 GB egress.

## Realidade do "gratis"

MVP/homologacao roda em free tier (Neon + R2 + Cloudflare Pages). Producao, com
trafego e sem pause, some para ~US$ 20-25/mes em algum ponto (Vercel Pro ou
Supabase Pro), e o R2 mantem a parte de imagem perto de zero.

## Decisoes tomadas (08/07/2026)

1. Postgres: Supabase Pro (US$ 25/mes) na producao.
2. Imagem: Cloudflare R2 para storage, com transformacao/otimizacao no upload via
   Payload + sharp (gera WebP e tamanhos responsivos). Cloudinary descartado. O
   cliente sobe qualquer imagem e o codigo entrega a versao leve.
3. Hospedagem: Cloudflare (Pages/Workers), uso comercial ok e egress zero.

## Custo mensal estimado (stack decidida)

1. Desenvolvimento/homologacao: ~US$ 0. Supabase free, R2 free (nosso volume cabe) e
   Cloudflare free. O pause do Supabase free nao atrapalha em dev.
2. Producao (go-live): ~US$ 25-30/mes. Supabase Pro US$ 25, R2 ~US$ 0 (abaixo de 10
   GB), Cloudflare Pages/Workers US$ 0-5. Em BRL, ~R$ 140-170/mes (cambio varia).
3. Nao incluido: dominios (do cliente) e e-mail transacional (provedor a definir,
   comeca em free tier).

## Recomendacao resumida

Neon (ou Supabase Pro) para Postgres, Cloudflare R2 para imagens, Cloudflare
Pages/Workers para hospedar, Payload 3 sobre Next 15 com ISR. Comeca em free tier e
escala com custo baixo e previsivel, com egress de imagem sempre proximo de zero.

## Decisao de banco e infra (confirmada 23/07/2026)

Reafirma e encerra o impasse que estava parado desde 20/07 (auditar ou nao o banco
existente).

1. NAO reaproveitar banco nenhum. O banco atual e o do NopCommerce, plataforma que hoje
   faz a leitura dos 5 sites do grupo que estao no ar. Ele tem painel de admin proprio,
   mas nao tem logica para conversar com o CRM.
2. Construir tudo do zero (decisao ja tomada desde o inicio do projeto) e desativar o
   site atual em NopCommerce. A estrutura nova fala via API com a ferramenta de captura
   de leads (Leads2b). Confirma a stack ja decidida: Payload 3 sobre Postgres.
3. Consequencia pratica: some a necessidade de "acesso para auditar o banco existente".
   Nao precisamos de acesso ao NopCommerce.

Onde a estrutura nova vai morar, dois caminhos:

1. A PARTE, na nossa infra (Cloudflare + Supabase Postgres + R2), como ja decidido acima.
   Recomendado para dev e homologacao: destrava agora, sem depender de terceiros, casa
   com a stack (Postgres) e mantem o controle de seguranca/LGPD.
2. Na cloud do grupo, a Gilix (o Plinio compara a "nossa Amazon"), provisionada pelo
   time tecnico do Grupo BB. Contato tecnico: Igor (abre acesso e instala o que
   pedirmos).

RISCO a vigiar no caminho Gilix: citaram MySQL como tipo de banco. MySQL NAO e adapter
suportado pelo Payload (usamos db-postgres; o scaffold ja aponta para Postgres). Se algum
dia a producao for para a Gilix, tem que ser PostgreSQL, nao MySQL, e um host de
aplicacao Node.js (nao so um banco), mais armazenamento de objetos S3-compativel, SSL,
gestao de segredos e backup automatico. Recomendacao: dev/homolog a parte agora;
discutir producao na Gilix so no go-live, sob essas condicoes.

## Fontes

1. Supabase Pricing: https://supabase.com/pricing
2. Cloudflare R2 Pricing: https://developers.cloudflare.com/r2/pricing/
3. Cloudinary Pricing: https://cloudinary.com/pricing
4. Neon Pricing: https://neon.com/pricing
