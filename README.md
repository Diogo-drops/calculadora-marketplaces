# Calculadora de Marketplaces

Calculadora em português para Shopee, TikTok Shop e Mercado Livre, com comparação, kits, margem, preço ideal, produtos e histórico. Valores monetários calculados em centavos; simulações e personalizações ficam no LocalStorage de cada navegador.

## Executar
Requer Node.js 22.13 ou superior.

```sh
npm install
npm run dev
npm test
npm run build
npm start
```

## Publicação na Vercel
Projeto Next.js. Importe este repositório, usando a raiz e os comandos definidos em vercel.json. Nenhuma credencial precisa estar no código. O endpoint /api/fees é somente leitura e não permite que visitantes alterem as tarifas centrais.

## Taxas e revisão
- data/fees.json é o catálogo central público de tarifas; não contém dados pessoais, produtos ou histórico.
- /api/fees consulta esse arquivo diretamente no GitHub. Se a consulta falhar, usa a versão incluída na publicação e mostra aviso.
- O navegador atualiza ao abrir, recuperar foco e a cada 15 minutos.
- Alterações apenas em data/fees.json dispensam novo build (Ignored Build Step); alterações de código geram deploy pela integração Git.
- A tarefa de revisão diária do ChatGPT deve atualizar este JSON junto com o catálogo do Site original, mantendo fontes e datas honestas. A tarefa pertence ao ChatGPT, não é um cron executado pela Vercel.
- Atualize com GitHub Contents API usando o SHA atual do arquivo. Releia para confirmar. Nunca coloque credenciais no JSON.
- A Shopee foi conferida em 07/10/2026, com vigência 01/10/2026. Até R$79,99: 20% + R$4,50/item; R$80–99,99: 14% + R$16; R$100–199,99: 14% + R$20; a partir de R$200: 14% + R$26.
- CNPJ abaixo de R$9: taxa por item de metade do preço além de 20%. CPF acima de 450 pedidos/90 dias: adicional R$3/item. A fórmula regressiva desse CPF abaixo de R$12 não está integralmente publicada; confirmar tarifa na conta e usar modo manual. O preço ideal desse contexto fica bloqueado.
- TikTok: abaixo de R$50 líquidos, 10% + R$4/item; a partir de R$50, 6% + R$6/item. SFP 6% limitado a R$50/produto. Conferido em 06/10/2026.
- Mercado Livre depende de cotação por categoria/anúncio/logística; não há taxa universal inventada.
- Não há garantia de atualização em tempo real nem de condições individuais da conta.

## Fontes oficiais
Shopee: https://seller.shopee.com.br/edu/article/26839/Comissao-para-vendedores-CNPJ-e-CPF-em-2026
O conteúdo público também está em https://seller.shopee.com.br/help/api/v3/article/detail/?article_id=26839&lang=default com cabeçalho shopee-language: default. Conferir as imagens da tabela.
TikTok: https://seller-br.tiktok.com/university/essay?knowledge_id=24428156307201
SFP: https://seller-br.tiktok.com/university/essay?knowledge_id=5665577566734097
Mercado Livre: https://vendedores.mercadolivre.com.br/nota/como-usar-o-simulador-de-custos-do-mercado-livre

## Validação
109 testes de cálculo cobrem faixas, quantidade, descontos, teto, exceções e busca do menor preço com margem desejada.
