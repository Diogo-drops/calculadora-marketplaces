import type {Context,Market,Result,Rule,Sale,Line} from '../types/index';
import {markets} from '../config/marketplaceFees';
export const safe=(n:number)=>{if(!Number.isSafeInteger(n)||n<0)throw Error('Informe valores positivos válidos dentro da precisão numérica suportada.');return n;};
export function cents(value:string):number {const s=value.trim().replace(',','.');if(!/^\d+(\.\d{0,2})?$/.test(s))throw Error('Use um valor positivo com até duas casas decimais.');const [a,b='']=s.split('.');return safe(Number(BigInt(a)*BigInt(100)+BigInt(b.padEnd(2,'0'))));}
export function basis(p:number){if(!Number.isFinite(p)||p<0||p>100||Math.abs(p*100-Math.round(p*100))>0.000001)throw Error('Percentuais devem estar entre 0 e 100, com até duas casas.');return Math.round(p*100);}
export const percentage=(amount:number,p:number)=>safe(Number((BigInt(safe(amount))*BigInt(basis(p))+BigInt(5000))/BigInt(10000)));
export function validateSale(s:Sale){[s.price,s.cost,s.packaging,s.shipping,s.discount,s.extra].forEach(safe);if(s.price<1||!Number.isSafeInteger(s.quantity)||s.quantity<1)throw Error('Preço mínimo: R$ 0,01. Quantidade mínima: 1.');if(s.discount>=s.price)throw Error('O desconto por item deve ser menor que o preço.');basis(s.tax);safe(s.price*s.quantity);safe(s.cost*s.quantity);if(!/^\d{4}-\d{2}-\d{2}$/.test(s.date))throw Error('Informe uma data válida.');}
export function validateRule(r:Rule){[r.min,r.fixed,r.perUnit].forEach(safe);basis(r.percentage);basis(r.perUnitPercentage??0);safe(r.minOrders90??0);if(r.maxOrders90!=null)safe(r.maxOrders90);if(r.max!==null&&(safe(r.max)<r.min))throw Error('Máximo deve ser maior ou igual ao mínimo.');if(r.start&&r.end&&r.start>r.end)throw Error('Vigência final anterior à inicial.');if(!r.name.trim())throw Error('Dê um nome à regra.');}
export function applicable(r:Rule,m:Market,s:Sale,c:Context,price=true){return r.active&&r.market===m&&(c.orders90??0)>=(r.minOrders90??0)&&(r.maxOrders90==null||(c.orders90??0)<=r.maxOrders90)&&(!price||((s.price-(r.priceBasis==='net'?s.discount:0))>=r.min&&(r.max===null||(s.price-(r.priceBasis==='net'?s.discount:0))<=r.max)))&&(!r.start||s.date>=r.start)&&(!r.end||s.date<=r.end)&&(['category','listing','seller','logistics','program'] as const).every(k=>!r[k]||r[k]===c[k]);}
function shopeeManaged(s:Sale,c:Context,r:Rule[]){return !c.manual&&r.some(x=>x.market==='shopee'&&x.id.startsWith('official-shopee-')&&applicable(x,'shopee',s,c,false));}
function shopeeUnknown(m:Market,s:Sale,c:Context,r:Rule[]){return m==='shopee'&&shopeeManaged(s,c,r)&&c.seller==='Pessoa Física'&&(c.orders90??0)>450&&s.price-s.discount<1200;}
function platform(m:Market,s:Sale,c:Context,rules:Rule[]):{lines:Line[];warnings:string[]} {const selected=c.manual?[{...rules[0],name:'Tarifa manual',percentage:c.percentage,fixed:c.fixed,perUnit:c.perUnit,perUnitPercentage:0}]:rules.filter(r=>applicable(r,m,s,c));const amount=safe((s.price-s.discount)*s.quantity);const lines:Line[]=[];for(const r of selected){lines.push({name:r.name+' · comissão',value:percentage(amount,r.percentage),kind:'platform'},{name:r.name+' · fixa por pedido',value:safe(r.fixed),kind:'platform'},{name:r.name+' · por item',value:safe((r.perUnit+percentage(s.price-s.discount,r.perUnitPercentage??0))*s.quantity),kind:'platform'});}if(m!=='ml')lines.push({name:'Comissão de afiliado',value:percentage(amount,c.affiliate),kind:'platform'},{name:m==='shopee'?'Taxa extra contratada (manual)':'Programa logístico',value:m==='tiktok'?safe(Math.min(percentage(s.price-s.discount,c.logisticRate),c.logisticCap??5000)*s.quantity):percentage(amount,shopeeManaged(s,c,rules)?0:c.logisticRate),kind:'platform'},{name:'Campanha promocional',value:percentage(amount,c.campaign),kind:'platform'});return {lines,warnings:shopeeUnknown(m,s,c,rules)?['CPF com mais de 450 pedidos: abaixo de R$12 há tarifa regressiva sem fórmula completa publicada. Informe a tarifa efetiva da conta no modo manual.']:selected.length?[]:['Nenhuma regra corresponde a esta venda. Cadastre uma regra ou informe a tarifa manual.']};}
export const calculateMercadoLivre=(s:Sale,c:Context,r:Rule[])=>platform('ml',s,c,r);
export const calculateShopee=(s:Sale,c:Context,r:Rule[])=>platform('shopee',s,c,r);
export const calculateTikTokShop=(s:Sale,c:Context,r:Rule[])=>platform('tiktok',s,c,r);
export const calculateProfit=(revenue:number,costs:number)=>revenue-costs;
export const calculateMargin=(profit:number,revenue:number)=>revenue?profit/revenue*100:0;
export const calculateMarkup=(revenue:number,cost:number)=>cost?(revenue/cost-1)*100:null;
export function calculate(s:Sale,m:Market,c:Context,r:Rule[]):Result{validateSale(s);const p={ml:calculateMercadoLivre,shopee:calculateShopee,tiktok:calculateTikTokShop}[m](s,c,r);const revenue=safe((s.price-s.discount)*s.quantity);const fees=safe(p.lines.reduce((a,l)=>a+l.value,0));const lines:Line[]=[...p.lines,{name:'Frete pago pelo vendedor',value:s.shipping,kind:'cost'},{name:'Impostos',value:percentage(revenue,s.tax),kind:'tax'},{name:'Custo do produto',value:safe(s.cost*s.quantity),kind:'cost'},{name:'Embalagem',value:s.packaging,kind:'cost'},{name:'Outros custos',value:s.extra,kind:'cost'}];const total=safe(lines.reduce((a,l)=>a+l.value,0));const profit=calculateProfit(revenue,total);return {gross:s.price*s.quantity,revenue,fees,netRevenue:revenue-fees-s.shipping-percentage(revenue,s.tax),profit,margin:calculateMargin(profit,revenue),markup:calculateMarkup(revenue,s.cost*s.quantity+s.packaging+s.shipping+s.extra),feePercent:fees/revenue*100,lines,warnings:p.warnings};}
// Exhaustive residue solver: percentage rounding repeats each 10,000 cents.
// It solves every configured interval independently, including downward fee jumps.
export function calculateTargetPrice(s:Sale,m:Market,c:Context,rules:Rule[],target:number):number|null {
 validateSale(s); const t=basis(target);
 if(m==='shopee'&&shopeeManaged(s,c,rules)&&c.seller==='Pessoa Física'&&(c.orders90??0)>450)throw Error('Para CPF acima de 450 pedidos, o menor preço global depende da tarifa regressiva abaixo de R$12. Confirme essa tarifa na conta para usar o preço ideal.');
 const matching=c.manual?[]:rules.filter(r=>applicable(r,m,s,c,false));
 const cap=c.logisticCap??5000;
 safe(cap);
 const shippingRate=basis(c.logisticRate);
 const capStart=m==='tiktok'&&shippingRate>0?s.discount+Math.max(1,Math.ceil((cap*10000-5000)/shippingRate)):null;
 const cuts=[...new Set([s.discount+1,...matching.flatMap(r=>{
  const shift=r.priceBasis==='net'?s.discount:0;
  return [Math.max(s.discount+1,r.min+shift),...(r.max!==null&&Number.isSafeInteger(r.max+shift+1)?[Math.max(s.discount+1,r.max+shift+1)]:[])];
 }),...(capStart!==null?[capStart]:[])])].sort((a,b)=>a-b);
 for(let idx=0;idx<cuts.length;idx++){
  const lo=cuts[idx],hi=cuts[idx+1]===undefined?Number.MAX_SAFE_INTEGER:cuts[idx+1]-1;
  const active=matching.filter(r=>applicable(r,m,{...s,price:lo},c));
  if(!c.manual&&!active.length)continue;
  const capped=m==='tiktok'&&shippingRate>0&&capStart!==null&&lo>=capStart;
  const rates=[...(c.manual?[c.percentage]:active.map(r=>r.percentage)),s.tax,...(m!=='ml'?[c.affiliate,c.campaign,...(m!=='tiktok'?[shopeeManaged(s,c,rules)?0:c.logisticRate]:[])]:[])].map(basis);
  const logisticBp=m==='tiktok'&&!capped?shippingRate:0;
  const unitRates=(c.manual?[]:active.map(r=>basis(r.perUnitPercentage??0)));
  const rateSum=rates.reduce((a,b)=>a+b,0)+logisticBp+unitRates.reduce((a,b)=>a+b,0);
  const q=BigInt(s.quantity),period=BigInt(10000);
  const slope=q*BigInt(10000-rateSum-t);
  const fixed=BigInt(c.manual?c.fixed+c.perUnit*s.quantity:active.reduce((a,r)=>a+r.fixed+r.perUnit*s.quantity,0))+BigInt(s.cost)*q+BigInt(s.packaging+s.shipping+s.extra)+(capped?BigInt(cap)*q:BigInt(0));
  let best:number|null=null;
  for(let offset=0;offset<10000&&lo+offset<=hi;offset++){
   const base=BigInt(lo+offset),unit=base-BigInt(s.discount),revenue=unit*q;
   const fees=rates.reduce((a,b)=>a+(revenue*BigInt(b)+BigInt(5000))/period,BigInt(0))+((unit*BigInt(logisticBp)+BigInt(5000))/period)*q+unitRates.reduce((a,b)=>a+((unit*BigInt(b)+BigInt(5000))/period)*q,BigInt(0));
   const gap=(revenue-fees-fixed)*period-revenue*BigInt(t);
   let cycles=BigInt(0);
   if(gap<BigInt(0)){if(slope<=BigInt(0))continue;cycles=(-gap+slope*period-BigInt(1))/(slope*period);}
   const candidate=base+cycles*period;
   if(candidate>BigInt(hi)||candidate*q>BigInt(Number.MAX_SAFE_INTEGER))continue;
   const n=Number(candidate);if(best===null||n<best)best=n;
  }
  if(best!==null)return best;
 }
 return null;
}
export const calculateBreakEven=(s:Sale,m:Market,c:Context,r:Rule[])=>calculateTargetPrice(s,m,c,r,0);
export const compareMarketplaces=(s:Sale,c:Record<Market,Context>,r:Rule[])=>markets.map(m=>({market:m,...calculate(s,m,c[m],r)}));
export function calculateKit(s:Sale,m:Market,c:Context,r:Rule[],units:number,total:number){safe(units);if(units<1)throw Error('Kit deve ter ao menos 1 unidade.');const result=calculate({...s,price:total,cost:safe(s.cost*units),quantity:1},m,c,r);return {...result,unitProfit:result.profit/units,unitMargin:result.margin,units,totalCost:result.revenue-result.profit};}
export function calculateMonthlyProjection(result:Result,orders:number){safe(orders);return {...result,gross:safe(result.gross*orders),fees:safe(result.fees*orders),profit:result.profit*orders,lines:result.lines.map(l=>({...l,value:safe(l.value*orders)}))};}
export function rating(m:number){return m<0?'PREJUÍZO':m<=10?'MARGEM MUITO BAIXA':m<=20?'MARGEM BAIXA':m<=30?'MARGEM RAZOÁVEL':m<=40?'BOA MARGEM':'EXCELENTE MARGEM';}
