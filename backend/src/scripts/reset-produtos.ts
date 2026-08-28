// Reset das tabelas de `produtos` (S03-02 piloto). Uso pontual: quando o schema
// de produto muda muito e o push de dev do drizzle abre prompts de rename, este
// script dropa as tabelas produtos* (que estao VAZIAS no dev) para o proximo
// boot recriar o schema limpo, sem prompt.
//
// Roda com push DESLIGADO (PAYLOAD_DB_PUSH=false) para conectar sem disparar o
// push interativo:
//   npm run reset:produtos     (na pasta backend/)
//
// NAO toca em users, revendedores, categorias, media nem posts. Destrutivo
// apenas no schema de produtos, e produtos esta vazio.

import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

try {
  const { rows } = await payload.db.pool.query<{ tablename: string }>(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'produtos%'",
  )

  if (rows.length === 0) {
    payload.logger.info('Nenhuma tabela produtos* encontrada. Nada a resetar.')
  } else {
    for (const { tablename } of rows) {
      await payload.db.pool.query(`DROP TABLE IF EXISTS "${tablename}" CASCADE`)
      payload.logger.info(`Tabela dropada: ${tablename}`)
    }
    payload.logger.info(
      'Reset concluido. Reinicie o backend (npm run dev) para recriar o schema de produtos.',
    )
  }
  process.exit(0)
} catch (err) {
  console.error('Falha no reset de produtos:', err)
  process.exit(1)
}
