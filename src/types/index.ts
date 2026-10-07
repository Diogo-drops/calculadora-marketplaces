export type Market = 'ml' | 'shopee' | 'tiktok';
export type Rule = {id:string; market:Market; name:string; percentage:number; fixed:number; perUnit:number; min:number; max:number|null; category:string; listing:string; seller:string; logistics:string; program:string; start:string; end:string; source:string; note:string; active:boolean;priceBasis?:'listed'|'net';origin?:'official'|'custom';verifiedAt?:string;perUnitPercentage?:number;minOrders90?:number;maxOrders90?:number|null};
export type Context = {category:string;listing:string;seller:string;logistics:string;program:string;manual:boolean;percentage:number;fixed:number;perUnit:number;affiliate:number;logisticRate:number;campaign:number;logisticCap?:number;manualSource?:string;manualCheckedAt?:string;managedShipping?:boolean;orders90?:number};
export type Sale = {price:number;cost:number;quantity:number;packaging:number;shipping:number;tax:number;discount:number;extra:number; date:string};
export type Line = {name:string;value:number;kind:'platform'|'tax'|'cost'};
export type Result = {gross:number;revenue:number;fees:number;netRevenue:number;profit:number;margin:number;markup:number|null;feePercent:number;lines:Line[]; warnings:string[]};
export type Product = {id:string;name:string;sku:string;cost:number;ml:number;shopee:number;tiktok:number;weight:number;packaging:number;tax:number;category:string;note:string};
export type Snapshot = {id:string;name:string;date:string;market:Market;sale:Sale;contexts:Record<Market,Context>;rules:Rule[]};
