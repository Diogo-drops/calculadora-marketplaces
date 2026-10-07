import type {Rule,Context,Market,Sale} from '../types/index';
export const names:Record<Market,string>={ml:'Mercado Livre',shopee:'Shopee',tiktok:'TikTok Shop'};
export const markets:Market[]=['ml','shopee','tiktok'];
export const emptyRule:Rule={id:'',market:'ml',name:'Comissão',percentage:0,fixed:0,perUnit:0,min:1,max:null,category:'',listing:'',seller:'',logistics:'',program:'',start:'',end:'',source:'',note:'Regra personalizada: informar fonte e vigência.',active:true};
const shopeeBase:Rule={...emptyRule,market:'shopee',name:'Shopee',start:'2026-10-01',source:'https://seller.shopee.com.br/edu/article/26839/Comissao-para-vendedores-CNPJ-e-CPF-em-2026',priceBasis:'net',origin:'official',verifiedAt:'2026-10-07',note:'Tabela publicada em 01/10/2026. Comissão já inclui transação e acesso ao Programa de Frete Grátis. Subsídio Pix pago pela Shopee não é custo extra do vendedor.'};
const shopeeBands=[{min:1,max:7999,percentage:20,perUnit:450},{min:8000,max:9999,percentage:14,perUnit:1600},{min:10000,max:19999,percentage:14,perUnit:2000},{min:20000,max:null,percentage:14,perUnit:2600}];
export const shopeeRules:Rule[]=[
 {...shopeeBase,id:'official-shopee-cnpj-small',seller:'CNPJ',min:1,max:899,percentage:20,perUnitPercentage:50,note:'CNPJ: abaixo de R$9, taxa por item de metade do preço, além da comissão de 20%. Comunicado 26839 esclarece mudança de R$8 para R$9.'},
 ...shopeeBands.map((band,i)=>({...shopeeBase,...band,min:i===0?900:band.min,id:'official-shopee-cnpj-'+i,seller:'CNPJ'})),
 ...shopeeBands.map((band,i)=>({...shopeeBase,...band,id:'official-shopee-cpf-'+i,seller:'Pessoa Física'})),
 {...shopeeBase,id:'official-shopee-cpf-additional',seller:'Pessoa Física',name:'Adicional CPF acima de 450 pedidos',min:1200,perUnit:300,minOrders90:451,note:'Adicional somente para CPF com mais de 450 pedidos em 90 dias. A fórmula regressiva abaixo de R$12 precisa ser confirmada na conta.'}
];
export const defaultRules:Rule[]=[...shopeeRules,
 {...emptyRule,id:'official-tiktok-low',market:'tiktok',name:'TikTok Shop',percentage:10,perUnit:400,min:1,max:4999,start:'2026-07-15',source:'https://seller-br.tiktok.com/university/essay?knowledge_id=24428156307201',note:'Tabela geral. Incentivos da conta não incluídos. Faixa após desconto do vendedor.',priceBasis:'net',origin:'official',verifiedAt:'2026-10-06'},
 {...emptyRule,id:'official-tiktok-high',market:'tiktok',name:'TikTok Shop',percentage:6,perUnit:600,min:5000,max:null,start:'2026-07-15',source:'https://seller-br.tiktok.com/university/essay?knowledge_id=24428156307201',note:'Tabela geral. Incentivos da conta não incluídos. Faixa após desconto do vendedor.',priceBasis:'net',origin:'official',verifiedAt:'2026-10-06'}
];
export const defaultContext:Context={category:'',listing:'Clássico',seller:'CNPJ',logistics:'',program:'',manual:false,percentage:12,fixed:0,perUnit:0,affiliate:0,logisticRate:0,campaign:0,logisticCap:5000,manualSource:'',manualCheckedAt:'',managedShipping:true,orders90:0};
export const defaultContexts:Record<Market,Context>={ml:{...defaultContext},shopee:{...defaultContext,percentage:14},tiktok:{...defaultContext,percentage:6,logisticRate:6}};
export const defaultSale:Sale={price:4999,cost:1800,quantity:1,packaging:150,shipping:0,tax:0,discount:0,extra:0,date:'2026-10-07'};
