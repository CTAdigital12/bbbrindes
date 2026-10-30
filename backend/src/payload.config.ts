import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categorias } from './collections/Categorias'
import { Produtos } from './collections/Produtos'
import { Banners } from './collections/Banners'
import { Campanhas } from './collections/Campanhas'
import { Posts } from './collections/Posts'
import { Cases } from './collections/Cases'
import { Imprensa } from './collections/Imprensa'
import { Tags } from './collections/Tags'
import { Revendedores } from './collections/Revendedores'
import { LogsEntrega } from './collections/LogsEntrega'
import { Configuracoes } from './globals/Configuracoes'
import { ConteudoHome } from './globals/ConteudoHome'
import { ConteudoInstitucional } from './globals/ConteudoInstitucional'
import { withRebuildHooks } from './hooks/triggerDeploy'
import { orcamentoEndpoint } from './endpoints/orcamento'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// R2 so entra quando o bucket esta configurado. Sem isso (dev sem credenciais)
// o Payload cai no storage de disco local, mantendo o painel funcional.
const hasR2 = Boolean(process.env.S3_BUCKET)

// Origem do frontend (site estatico) que loga o revendedor via REST API. Em
// dev e prod (subdominio do mesmo site), o cookie de sessao e same-site, entao
// SameSite=Lax padrao basta; so precisamos liberar CORS + CSRF para essa
// origem. FRONTEND_URL vem do .env; default aponta para o dev local.
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000'

// Slugs cujo conteudo e inlinado no site estatico: toda mudanca precisa disparar
// um rebuild pra aparecer no ar (FB-6, ver hooks/triggerDeploy). Ficam de fora
// `users` (contas do admin) e `revendedores` (area logada, lida em runtime via
// REST, nao vai pro HTML estatico).
const REBUILD_ON_CHANGE = [
  'produtos',
  'categorias',
  'banners',
  'campanhas',
  'posts',
  'cases',
  'imprensa',
  'tags',
  'media',
]

// Conexao ao Postgres. Preferimos parametros SEPARADOS (PGHOST/PGPORT/PGUSER/
// PGPASSWORD/PGDATABASE) quando PGHOST estiver definido: a senha vai crua, sem
// precisar de percent-encode nem de montar a URI a mao (evita quebra por
// caractere especial). Sem PGHOST, cai na connection string DATABASE_URI.
// SSL exigido pelo Supabase; rejectUnauthorized:false por ser certificado gerido.
const dbPool = process.env.PGHOST
  ? {
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE || 'postgres',
      ssl: { rejectUnauthorized: false },
    }
  : { connectionString: process.env.DATABASE_URI || '' }

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  cors: [frontendURL],
  csrf: [frontendURL],
  // Travas de upload (FB-6): limite de peso por arquivo + mensagem em PT.
  // abortOnLimit ja e true por padrao (rejeita com HTTP 413 em vez de truncar).
  // So subimos imagem por ora (sem PDF), entao o limite global = o de imagem.
  upload: {
    limits: {
      fileSize: 15 * 1024 * 1024, // 15 MB por arquivo
    },
    abortOnLimit: true,
    responseOnLimit:
      'Arquivo muito grande. O limite por upload e 15 MB. Reduza o tamanho e tente de novo.',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    // Catalogo
    Produtos,
    Categorias,
    // Conteudo
    Banners,
    Campanhas,
    Posts,
    Cases,
    Imprensa,
    Tags,
    // Revenda
    Revendedores,
    // Sistema
    Media,
    Users,
    // Log de entrega dos orcamentos (FB-7). Operacional, nao vai pro HTML: fica
    // FORA de REBUILD_ON_CHANGE, entao nao dispara rebuild a cada submissao.
    LogsEntrega,
  ].map((collection) =>
    REBUILD_ON_CHANGE.includes(collection.slug) ? withRebuildHooks(collection) : collection,
  ),
  endpoints: [
    // FB-7 PART 0: recebe o pedido de orcamento do site, entrega ao CRM (stub por
    // ora) e grava o log de entrega. Montado em POST /api/orcamento.
    orcamentoEndpoint,
  ],
  globals: [
    // Configuracoes gerais do site (contato, redes, selos, blurb). FB-6.
    Configuracoes,
    // Conteudo da home (selos, diferenciais, depoimentos, FAQ, urgencia, eco, CTA). FB-6 Fase 5.
    ConteudoHome,
    // Conteudo institucional (Quem somos + SAC). FB-6 Fase 6.
    ConteudoInstitucional,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Em dev o Payload sincroniza o schema no boot (push). Scripts de manutencao
    // (ex.: reset:produtos) rodam com PAYLOAD_DB_PUSH=false para conectar sem
    // disparar o push interativo do drizzle. Em dev normal, push segue ligado.
    push: process.env.PAYLOAD_DB_PUSH !== 'false',
    pool: dbPool,
  }),
  sharp,
  plugins: [
    ...(hasR2
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.S3_BUCKET as string,
            config: {
              endpoint: process.env.S3_ENDPOINT,
              region: process.env.S3_REGION || 'auto',
              forcePathStyle: true,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
              },
            },
          }),
        ]
      : []),
  ],
})
