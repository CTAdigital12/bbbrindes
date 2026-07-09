# Guia para montar o material do catalogo (para o Plinio)

Este guia acompanha o arquivo `modelo-produtos.csv`. Ele existe para o material dos
produtos chegar num formato que a gente consegue importar de uma vez, sem ninguem
precisar ligar imagem com produto na mao. Quanto mais fiel a este formato, mais
rapida e sem erro fica a carga no site.

## Como funciona, em uma frase

Voce preenche uma linha por produto na planilha e nomeia as imagens pelo codigo do
produto. A gente roda a importacao, os produtos aparecem no site, e voce revisa.

## A planilha (uma linha por produto)

Abra o `modelo-produtos.csv` no Google Sheets (Arquivo > Importar) ou no Excel. Ele
ja vem com 2 linhas de exemplo preenchidas para servir de referencia. Preencha uma
linha por produto. As colunas:

### Obrigatorias (sem elas o produto nao entra)
1. `codigo`: o codigo/SKU do produto. E a chave que liga tudo (inclusive as imagens
   e, depois, o preco e o estoque do ERP). Ex.: `squeeze-eco-500ml`. Use letras
   minusculas, sem espaco nem acento (troque espaco por hifen).
2. `nome`: nome do produto como aparece no site. Ex.: `Squeeze Ecologico 500ml`.
3. `categoria`: uma das 15 categorias exatas da lista abaixo.
4. `descricao_curta`: 1 a 2 frases. E o resumo que aparece no card e vira a
   descricao do Google (SEO).
5. `material`: material principal. Ex.: `Plastico`, `Inox`, `Ceramica`, `Bambu`.
6. `cores`: as cores do produto, separadas por ponto e virgula. Ex.:
   `Branco;Azul;Verde`. Cada cor vira uma variacao do produto.

### Recomendadas (sao o conteudo novo da pagina de produto, importante para SEO)
7. `subtitulo`: uma frase curta que reforca o principal diferencial. Ex.:
   `Sua marca com pegada sustentavel`.
8. `descricao_completa`: texto mais longo, detalhado, que apoia o ranqueamento no
   Google. Pode ter varios paragrafos.
9. `principais_beneficios`: lista separada por ponto e virgula. Ex.:
   `Livre de BPA;Leve e resistente;Cores vibrantes`.
10. `ideal_para`: para que serve/ocasioes, separado por ponto e virgula. Ex.:
    `Acoes de marca;Eventos;Brindes de verao`.
11. `diferenciais_bb`: os diferenciais da BB aplicados a este produto, separados por
    ponto e virgula. Ex.: `Industria brasileira;Entrega garantida`.

### Opcionais
12. `aplicacoes`: contextos de uso (viram filtro), separados por ponto e virgula.
    Ex.: `Bebidas;Esportes`.
13. `personalizavel`: `sim` ou `nao`.
14. `linha_ecologica`: `sim` ou `nao` (marca o produto como parte da linha Green).
15. `imagens`: normalmente NAO precisa preencher (a gente acha as imagens pelo
    codigo, ver abaixo). Preencha so se quiser listar os nomes dos arquivos na mao.

Regra geral: onde a coluna aceita mais de um valor, separe por ponto e virgula (`;`)
dentro da mesma celula. Nao use virgula para isso.

## As 15 categorias validas (use exatamente um destes nomes)

1. Ecologicos - Green Plasticaria
2. Ecologicos - Green Fibras
3. Ecologicos - Medalhas e Trofeus
4. Copos
5. Canecas e Xicaras
6. Chaveiros
7. Casa e Decoracao
8. Escritorio
9. Squeezes
10. Bowls, Baldes e Potes
11. To Go / Viagem
12. Infantil
13. Cordoes e Costurados
14. In Mold Label
15. Projetos Especiais

## As imagens (a parte que mais evita erro)

Nomeie cada arquivo de imagem com o codigo do produto e um numero, na ordem em que
devem aparecer no site:

1. `codigo_1.jpg`, `codigo_2.jpg`, `codigo_3.jpg` ...
   Ex.: `squeeze-eco-500ml_1.jpg`, `squeeze-eco-500ml_2.jpg`.
   O numero 1 e a imagem principal.
2. Se a imagem muda conforme a cor, inclua a cor no nome:
   `codigo_cor_1.jpg`. Ex.: `squeeze-eco-500ml_azul_1.jpg`.

Recomendacoes de imagem: formato JPG ou PNG, fundo branco ou neutro, produto
centralizado, e o maior lado com pelo menos 1000 pixels. A gente gera as versoes
leves e otimizadas automaticamente, entao pode mandar a imagem boa; nao precisa
comprimir antes.

## Como entregar

1. A planilha preenchida (o proprio `modelo-produtos.csv` ou uma copia no Google
   Sheets).
2. As imagens, todas numa pasta compactada (.zip), nomeadas conforme a regra acima.

Nao e obrigatorio mandar os 1200 de uma vez; pode vir em lotes. So garanta que cada
lote esteja completo (planilha + imagens correspondentes).

## O que acontece depois

A gente roda a importacao com uma previa que aponta o que entrou, o que faltou
(ex.: produto sem imagem ou sem descricao) e o que veio com erro de formato. A gente
te devolve esse relatorio para voce completar o que faltar. Quando estiver ok, os
produtos vao para o site e voce revisa se o conteudo ficou correto. A parte de preco
e estoque nao entra por aqui: vem do ERP, ligada pelo codigo do produto.
