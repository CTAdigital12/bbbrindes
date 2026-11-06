# Lockfile do deploy isolado do backend

O Railway recebe `backend` como raiz por `railway up backend --path-as-root`.
O lockfile da raiz do monorepo nao faz parte desse upload. Sem um lockfile nessa
raiz isolada, `pnpm install` resolve novas dependencias transitivas a cada envio.

Em 06/11/2026 duas tentativas do complemento PR122 falharam antes do build por uma
publicacao incompleta do AWS SDK no registro. A versao ativa PR121 permaneceu em200.

`backend/pnpm-lock.yaml` deriva do lockfile principal: o importador `backend` vira
`.` e as resolucoes existentes sao preservadas. Arquivo gerado,9920 linhas; manter
integro e necessario para representar o grafo de pacotes, justificando o tamanho.
Nenhuma dependencia declarada foi adicionada ou atualizada. O lockfile principal
continua inalterado e segue sendo a fonte dos workspaces/CI do monorepo.

Ao alterar dependencias do backend, sincronizar tambem o lockfile de deploy isolado.
Validar o manifesto e o importador, uma instalacao congelada em diretorio separado
e o build completo com esse conjunto. Nao executar instalacoes de teste sobre as
junctions node_modules dos worktrees existentes.

Validacao 06/11/2026 17:23 BRT: importador identico ao backend do lockfile principal;
zero resolucoes divergentes; instalacao limpa com pnpm9.12.0 --frozen-lockfile aprovada
(676 pacotes instalados) e build Payload completo aprovado nessa copia isolada,
incluindo lint e TypeScript. Nenhuma alteracao de banco, schema, API ou interface.
