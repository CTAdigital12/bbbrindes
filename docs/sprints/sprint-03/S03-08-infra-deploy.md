# S03-08 Infra e deploy (Cloudflare + R2 + Supabase)

Status: a fazer
Frente: infra
Prioridade: P0
Atualizado: 09/07/2026 BRT

## Descricao
Preparar o ambiente da stack decidida: projeto no Cloudflare (Pages/Workers), bucket
R2, projeto Supabase e o pipeline de deploy do backend + front. Homologacao primeiro;
producao (Supabase Pro) no go-live.

## Checklist
- [ ] Bucket R2 criado (credenciais via env)
- [ ] Projeto Supabase de dev (free) provisionado
- [ ] Deploy do app (Next + Payload) no Cloudflare, ambiente de homologacao
- [ ] Variaveis de ambiente e segredos configurados no Cloudflare (nunca no repo)
- [ ] Migrations do banco rodando no deploy
- [ ] Plano de producao: Supabase Pro no go-live (custo ~US$ 25/mes)

## Observacoes
Custo em dev ~US$ 0 (free tiers); producao ~US$ 25-30/mes. Ver a secao de custo em
docs/arquitetura-backend.md. Migrar do GitHub Pages (wireframe) para o Cloudflare
quando a homologacao do backend estiver de pe.
