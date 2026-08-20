# S03-01 Scaffold do backend (Payload + Supabase + R2)

Status: a fazer
Frente: backend
Prioridade: P0
Atualizado: 09/07/2026 BRT

## Descricao
Subir o Payload CMS 3 na pasta backend/ do monorepo, sobre Next, conectado ao
Postgres do Supabase e com o storage adapter apontando para o Cloudflare R2. Base de
todo o resto.

## Checklist
- [ ] Payload 3 instalado em backend/ (ou embutido no app Next, conforme a arquitetura)
- [ ] Adapter Postgres conectado a um projeto Supabase (free em dev)
- [ ] Storage adapter do R2 configurado (bucket, credenciais via env)
- [ ] Upload gerando versoes otimizadas no upload (sharp: WebP + tamanhos responsivos)
- [ ] Painel /admin subindo localmente com o primeiro usuario admin
- [ ] .env.example atualizado (sem segredos reais)

## Observacoes
Segredos (Supabase, R2) so no .env local, nunca no repo (CLAUDE.md regra 14).
Referencia: docs/arquitetura-backend.md.

## Atualizacao 23/07/2026 (banco confirmado, DESTRAVADO)
O Julien confirmou "vamos seguir com o banco via Supabase mesmo". A decisao "a parte"
foi aceita, entao o boot do /admin nao depende mais de terceiros. Proximo passo: criar
o projeto Supabase de dev na nossa conta, por a connection string no backend/.env local
e subir o /admin. Isso fecha o S03-01 e valida o S03-02 de ponta a ponta.
Ver docs/arquitetura-backend.md, secao "Decisao de banco e infra".
