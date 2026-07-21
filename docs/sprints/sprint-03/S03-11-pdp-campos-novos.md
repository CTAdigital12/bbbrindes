# S03-11 Simular os campos novos na PDP do wireframe

Status: a fazer
Frente: frontend
Prioridade: P1
Atualizado: 16/07/2026 BRT

## Descricao
Depois de incluir os campos validados, simular na pagina de produto do wireframe onde
cada informacao entra: nome + headline como primeira chamada, depois subtitulo,
descricoes, beneficios e diferenciais. Serve para o cliente ver a estrutura antes do
design final. Acao da ata (@Fabio).

## Checklist
- [ ] Mapear cada campo do modelo (docs/modelo-produto.md) para um lugar na PDP
- [ ] Nome + headline como primeira chamada; subtitulo em seguida
- [ ] Descricao curta visivel; descricao completa com "ver mais" para nao lotar
- [ ] Beneficios e diferenciais em blocos legiveis
- [ ] Nao exibir o argumento comercial (uso interno, treino do agente)
- [ ] Recursos de layout (ver mais, background, secoes) para nao poluir
- [ ] Validacao visual no browser pelo Fabio antes de sugerir PR (CLAUDE.md regra 27)

## Observacoes
Layout definido a quatro maos com a analista de conteudo (SEO + UX); nao "lotar" a
pagina. Depende da definicao final dos campos (planilha do Plinio, ver S03-02). Pode
comecar com dados mock representando os campos novos, mesmo antes da planilha. Ver
docs/modelo-produto.md.

## Atualizacao 16/07/2026 (planilha real analisada)
A planilha revelou tres blocos que a ata nao citou e que mudam o escopo desta
simulacao (detalhe em docs/modelo-produto.md):
1. 13 selos por produto (livre de BPA, uso em microondas, uso em lava-loucas, 100%
   reciclado, logistica reversa, uso permanente, reducao de CO2, 50% fonte renovavel,
   design circular, upcycling, fibra natural, produto reciclavel, reducao de plastico).
   Isso e um sistema de icones na PDP, e provavel filtro no catalogo. Precisa de arte
   (depende do design/identidade visual).
2. Bloco de logistica (NCM, dimensoes, peso, materia prima, caixa master).
3. Bloco de impressao (metodos e areas de transfer, tampografia, serigrafia, sleeve).
   Para um site de brindes, essa e informacao de venda, nao detalhe tecnico escondido.

Definir com o Plinio o que de cada bloco e publico, o que e so revendedor/B2B e o que
nao vai para o site. O `subtitulo` da planilha e texto longo (uma ou duas frases), nao
frase curta, o que muda a hierarquia visual proposta. O argumento comercial segue
interno. Da para comecar com mock, mas a arte dos selos e o layout final dependem do
design e da analista de conteudo.
