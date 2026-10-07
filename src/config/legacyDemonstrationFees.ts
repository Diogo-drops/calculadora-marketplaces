import type {Rule,Context,Market,Sale} from '../types/index';
export const names:Record<Market,string>={ml:'Mercado Livre',shopee:'Shopee',tiktok:'TikTok Shop'};
export const markets:Market[]=['ml','shopee','tiktok'];
export const emptyRule:Rule={id:'',market:'ml',name:'Comissão',percentage:0,fixed:0,perUnit:0,min:1,max:null,category:'',listing:'',seller:'',logistics:'',program:'',start:'',end:'',source:'Exemplo demonstrativo — confirmar no painel do vendedor',note:'Não representa uma tarifa oficial vigente.',active:true};
export const defaultRules:Rule[]=[{...emptyRule,id:'ml-classico',market:'ml',listing:'Clássico',percentage:12,perUnit:600},{...emptyRule,id:'ml-premium',market:'ml',listing:'Premium',percentage:17,perUnit:600},{...emptyRule,id:'shopee-base',market:'shopee',percentage:14,perUnit:400},{...emptyRule,id:'tiktok-low',market:'tiktok',percentage:10,perUnit:400,max:4999},{...emptyRule,id:'tiktok-high',market:'tiktok',percentage:6,perUnit:600,min:5000}];
export const defaultContext:Context={category:'',listing:'Clássico',seller:'CNPJ',logistics:'',program:'',manual:false,percentage:12,fixed:0,perUnit:0,affiliate:0,logisticRate:0,campaign:0};
export const defaultContexts:Record<Market,Context>={ml:{...defaultContext},shopee:{...defaultContext,percentage:14},tiktok:{...defaultContext,percentage:6}};
export const defaultSale:Sale={price:4999,cost:1800,quantity:1,packaging:150,shipping:0,tax:0,discount:0,extra:0,date:'2026-10-06'};
