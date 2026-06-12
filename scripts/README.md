# Scripts

## trello-sync.mjs

Sincroniza os cards das sprints (`docs/sprints/**/S*.md`) com o board do Trello.
Cria listas por status (A Fazer, Em Andamento, Concluido), cria cada card com
descricao e checklist, e nao duplica (pula cards cujo codigo, ex. S00-01, ja existe).

### Pre-requisitos

1. Preencher no `.env` (local, fora do git):
   1. `TRELLO_API_KEY`: em https://trello.com/power-ups/admin , crie um Power-Up e copie a API Key.
   2. `TRELLO_TOKEN`: gere com o link (troque SUA_API_KEY):
      `https://trello.com/1/authorize?expiration=never&name=bbbrindes&scope=read,write&response_type=token&key=SUA_API_KEY`
   3. `TRELLO_BOARD_ID`: ja vem como `dAiTB3Ff` (do link do board).

### Rodar (a partir da raiz do repo)

```bash
pnpm trello:sync
# ou direto:
node --env-file=.env scripts/trello-sync.mjs
```

### Notas

1. Idempotente para criacao: rodar de novo nao duplica; cria so os cards novos (sprints futuras).
2. Atualizacao de cards ja existentes (mover de lista, marcar checklist) ainda nao e feita pelo script; por ora e create-only. Da para evoluir quando precisarmos refletir mudancas de status automaticamente.
3. Requer Node 20.6+ (usa `--env-file`). Aqui rodamos com Node 24.
