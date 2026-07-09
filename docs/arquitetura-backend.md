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
5. Chave de integracao: SKU. O cadastro no painel cria o produto; o ERP casa por
   SKU so para preco e estoque; o import nao sobrescreve o conteudo editorial/SEO.

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

## Fontes

1. Supabase Pricing: https://supabase.com/pricing
2. Cloudflare R2 Pricing: https://developers.cloudflare.com/r2/pricing/
3. Cloudinary Pricing: https://cloudinary.com/pricing
4. Neon Pricing: https://neon.com/pricing
