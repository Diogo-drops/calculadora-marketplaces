import type {Market} from '../types';
export const feeRevision='2026-10-07.1';
export const feeReviewDate='2026-10-07';
export const sources:Record<Market,{status:string;detail:string;url:string;verified:boolean}>={
 ml:{status:'Cotação da conta necessária',detail:'O Mercado Livre varia comissão por categoria e anúncio; a tarifa fixa também depende da logística. Informe uma cotação do simulador oficial para o produto. Nenhuma tarifa universal foi aplicada.',url:'https://vendedores.mercadolivre.com.br/nota/como-usar-o-simulador-de-custos-do-mercado-livre',verified:false},
 shopee:{status:'Tabela oficial de outubro aplicada · conferida em 07/10/2026',detail:'Vigência 01/10/2026: até R$79,99, 20% + R$4,50/item; R$80–99,99, 14% + R$16; R$100–199,99, 14% + R$20; a partir de R$200, 14% + R$26. Para CNPJ abaixo de R$9, taxa por item de 50% do preço. CPF acima de 450 pedidos/90 dias: +R$3, com tarifa regressiva abaixo de R$12 a confirmar na conta. Frete Grátis incluído; Pix não reduz o repasse.',url:'https://seller.shopee.com.br/edu/article/26839/Comissao-para-vendedores-CNPJ-e-CPF-em-2026',verified:true},
 tiktok:{status:'Tabela pública conferida em 06/10/2026',detail:'Regra geral vigente desde 15/07/2026. Faixa após desconto do vendedor: abaixo de R$ 50, 10% + R$ 4/item; a partir de R$ 50, 6% + R$ 6/item. Incentivos individuais, afiliados e campanhas devem ser confirmados na conta.',url:'https://seller-br.tiktok.com/university/essay?knowledge_id=24428156307201',verified:true}
};
export const shippingSource='https://seller-br.tiktok.com/university/essay?knowledge_id=5665577566734097';
