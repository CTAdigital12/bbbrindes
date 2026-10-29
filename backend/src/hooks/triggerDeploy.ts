import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  GlobalAfterChangeHook,
} from 'payload'

// Dispara o rebuild do site estatico (GitHub Pages) quando o conteudo editavel
// muda no admin. Sem isso, a edicao do cliente so aparece no ar no proximo build
// manual: o site e um export estatico (output: 'export') e le o Payload apenas na
// hora do build, inlinando o conteudo no HTML. FB-6.
//
// Como: chama o workflow_dispatch do deploy.yml via REST do GitHub. O token e um
// PAT fine-grained (repo CTAdigital12/bbbrindes, permissao Actions: Read and
// write) guardado na env GITHUB_DEPLOY_TOKEN do backend (Railway). Server-side
// only: nunca vai pro cliente. Sem o token, o hook vira no-op (o save continua
// funcionando), so registra um aviso no log.
//
// Debounce de cauda: uma rajada de saves (ex.: subir 50 imagens) coalesce num
// unico build, disparado alguns segundos depois do ultimo save, em vez de um
// build por save.

const REPO = process.env.DEPLOY_REPO || 'CTAdigital12/bbbrindes'
const WORKFLOW = process.env.DEPLOY_WORKFLOW || 'deploy.yml'
const REF = process.env.DEPLOY_REF || 'master'
const DEBOUNCE_MS = Number(process.env.DEPLOY_DEBOUNCE_MS || 10_000)

interface Logger {
  info: (msg: string) => void
  warn: (msg: string) => void
  error: (msg: string) => void
}

let pending: ReturnType<typeof setTimeout> | null = null
let pendingReason = ''

async function dispatch(reason: string, logger?: Logger) {
  const token = process.env.GITHUB_DEPLOY_TOKEN
  if (!token) return // ja avisado no agendamento
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ref: REF }),
      },
    )
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      logger?.error(`[deploy-hook] falha ao disparar rebuild (HTTP ${res.status}): ${body}`)
      return
    }
    logger?.info(`[deploy-hook] rebuild do site disparado (${reason})`)
  } catch (err) {
    logger?.error(`[deploy-hook] erro ao disparar rebuild: ${(err as Error).message}`)
  }
}

function scheduleRebuild(reason: string, logger?: Logger) {
  if (!process.env.GITHUB_DEPLOY_TOKEN) {
    logger?.warn(
      '[deploy-hook] GITHUB_DEPLOY_TOKEN ausente: edicao salva, mas rebuild do site NAO disparado.',
    )
    return
  }
  pendingReason = reason
  if (pending) clearTimeout(pending)
  pending = setTimeout(() => {
    pending = null
    void dispatch(pendingReason, logger)
  }, DEBOUNCE_MS)
  // Nao deixa o timer pendente segurar o processo no shutdown (ex.: redeploy).
  ;(pending as { unref?: () => void }).unref?.()
}

// Hooks prontos para plugar nas colecoes/globais que alimentam o site.
export const rebuildAfterChange: CollectionAfterChangeHook = ({ collection, operation, req, doc }) => {
  scheduleRebuild(`${collection.slug}.${operation}`, req?.payload?.logger as Logger | undefined)
  return doc
}

export const rebuildAfterDelete: CollectionAfterDeleteHook = ({ collection, req, doc }) => {
  scheduleRebuild(`${collection.slug}.delete`, req?.payload?.logger as Logger | undefined)
  return doc
}

export const rebuildGlobalAfterChange: GlobalAfterChangeHook = ({ req, doc }) => {
  scheduleRebuild('configuracoes.update', req?.payload?.logger as Logger | undefined)
  return doc
}

// Clona a colecao acrescentando os hooks de rebuild, preservando hooks ja
// existentes. Usado no payload.config para ligar o rebuild sem editar cada
// arquivo de colecao.
export function withRebuildHooks(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [...(collection.hooks?.afterChange ?? []), rebuildAfterChange],
      afterDelete: [...(collection.hooks?.afterDelete ?? []), rebuildAfterDelete],
    },
  }
}
