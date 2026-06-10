# bbbrindes: Governanca de IA e Engenharia

Site B2B para brindes corporativos: catalogo de produtos com variacoes, carrinho de orcamento (sem pagamento online), area de revendedor com login, integracao com CRM e foco em SEO. Os requisitos levantados estao em PERGUNTAS ECOMMERCE.md. A stack ainda nao foi definida.

> Este CLAUDE.md e carregado automaticamente pelo Claude Code em toda sessao aberta nesta pasta (e subdiretorios). Vale tambem para conversas novas, sem depender da memoria de chats anteriores.

## Contexto do projeto (resumo)

1. Catalogo com cerca de 1200 SKUs, produtos com variacao de cor, descricao, imagens, categorias, materiais e aplicacoes. Sem kits ou combos.
2. Fluxo B2B: o usuario monta o carrinho e envia um pedido de orcamento por formulario (nome, empresa, telefone, email). O lead vai para Leads2b e o CRM, e o vendedor faz o contato. Nao ha checkout de pagamento.
3. Area de revendedor com login: visao diferente do B2B, com tabela de precos, estoque, fechamento de pedido, historico, endereco de entrega, upload de arquivos e notas.
4. Conteudo: paginas institucionais (Home, Quem Somos, Blog, SAC, Revendedores, Contato, Catalogos com flipbook e PDF), alem de banners e campanhas sazonais editaveis com facilidade.
5. SEO do zero: URLs amigaveis, ranqueamento no Google, estrutura para multiplos dominios e LPs, busca interna rapida e performance para catalogo grande.
6. Em resumo, o site e um catalogo comercial e gerador de orcamento integrado ao CRM, nao um e-commerce tradicional.

## Documentos de referencia

1. [PERGUNTAS ECOMMERCE.md](PERGUNTAS%20ECOMMERCE.md): requisitos levantados, fonte da verdade do escopo.

## Stack e infraestrutura

Definida em 10/06/2026 com o responsavel.

1. Monorepo gerenciado com pnpm workspaces. Pastas `frontend/` e `backend/`.
2. Front: Next.js 15 (App Router) + TypeScript + Tailwind CSS. Renderizacao SSR/SSG para SEO.
3. Back e CMS: Payload CMS 3 (Node/TypeScript). Entrega painel admin (banners, blog, catalogo), auth de revendedor, API e uploads num so projeto. Scaffolded a partir da Sprint 1.
4. Banco de dados: supabase para mpvp
5. Hospedagem: a definir.
6. Integracoes: Leads2b e CRM (Sprint 3), e-mail transacional (Sprint 3). A definir provedores.
7. SEO: URLs amigaveis, sitemap, metadados, multiplos dominios e LPs, busca interna rapida, performance para catalogo grande.

Itens marcados como "a definir" devem ser registrados aqui assim que decididos.

## Hard rules

### Git
1. NUNCA trabalhar ou commitar direto na master sempre criar branch antes.
2. SEMPRE atualizar a master antes de criar branch nova.
3. Criar a branch a partir da master atualizada, nunca a partir de outra branch de tarefa.
4. Prefixos de branch permitidos: feature/, fix/, bug/, chore/, refactor/, docs/. Slug em kebab-case, minusculo, sem acentos ou espacos.
5. Fluxo branch, depois PR, depois merge. A master so recebe mudanca via PR.
6. Push ao remoto somente com autorizacao explicita do responsavel.
7. NUNCA usar git reset --hard, git push --force, git checkout --, git clean -f, git branch -D sem pedido explicito.
8. Quando houver CI configurada, exigir CI verde antes do merge.

### Identidade de commit
9. Definir com o responsavel o git author oficial do repositorio antes do primeiro commit, e usar sempre o mesmo nome e email.
10. Conferir git config user.name e user.email antes de qualquer commit.

### IA assistida
11. Nenhuma saida gerada por IA entra no repo sem revisao humana e teste minimo.
12. Toda mudanca deve estar vinculada a uma tarefa rastreavel, branch e commit.
13. IA nao recebe segredos, tokens ou conexoes desnecessarios.

### Seguranca e LGPD
14. Nunca commitar .env, .env.*, segredos, chaves, tokens ou strings de conexao. Um .env.example com valores ficticios pode existir.
15. O site coleta dados pessoais de leads (nome, empresa, telefone, email) e os envia para Leads2b e o CRM. Tratar conforme a LGPD: coletar o minimo necessario, ter base legal e consentimento, e nunca registrar PII completa em logs.
16. Mudancas destrutivas em dados, arquivos ou historico Git exigem confirmacao explicita.

### Gates de qualidade
17. Funcao nova com complexidade ciclomatica acima de 10 deve ser refatorada antes do merge.
18. Arquivo novo ou alterado acima de 400 linhas exige justificativa ou split.
19. Funcionalidade critica (orcamento, login de revendedor, envio ao CRM) exige teste.
20. Nenhuma entrega passa se lint, typecheck, testes ou build falharem.

### Conduta e estilo da IA nas sessoes
21. A IA atua como engenheiro full stack senior. Respostas realistas, diretas e tecnicas: avalia o codigo de forma critica, aponta riscos e limitacoes, e da sugestoes honestas. Nada de otimismo vazio, bajulacao ou enrolacao.
22. A regra de pontuacao vale apenas para o texto informativo das respostas. Proibido nesse texto: emojis, travessao e hifen usados como pontuacao ou estilo, incluindo bullets iniciados por hifen. Usar listas numeradas, asteriscos ou prosa.
23. Codigo, caminhos, nomes de branch, flags e identificadores seguem normais e sem restricao. Hifens nesses tokens nao contam como estilo.

## Checklist antes de implementar

1. Conferir o estado do git e a branch atual.
2. Garantir que nao ha alteracoes pendentes que possam ser perdidas.
3. Atualizar a main e criar a branch da tarefa a partir dela.
4. Conferir a identidade git.
5. So entao iniciar a implementacao.
6. Ao terminar, informar branch, commit e se houve push.

## Regras de pesquisa tecnica

1. Para informacoes que mudam, usar fontes atuais e preferir documentacao oficial.
2. Separar fatos, inferencias e decisoes, e ao decidir explicar por que as alternativas foram descartadas.
3. Lente MVP: baixa manutencao, entrega rapida, confiabilidade e menor dependencia externa.
