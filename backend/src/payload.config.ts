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
import { Revendedores } from './collections/Revendedores'

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
    // Revenda
    Revendedores,
    // Sistema
    Media,
    Users,
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
