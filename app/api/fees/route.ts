import {initialBundle,type FeeBundle} from '../../../src/config/feeBundle';
import {validateRule} from '../../../src/calculations';
export const dynamic='force-dynamic';
const catalogUrl='https://raw.githubusercontent.com/Diogo-drops/calculadora-marketplaces/main/data/fees.json';
export async function GET(){
 try{
  const response=await fetch(catalogUrl,{cache:'no-store',signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw Error('Catálogo indisponível');
  const bundle=await response.json() as FeeBundle;
  if(!bundle.revision||!bundle.checkedAt||!Array.isArray(bundle.rules)||!bundle.sources?.shopee||!bundle.shipping)throw Error('Catálogo inválido');
  bundle.rules.forEach(validateRule);
  return Response.json(bundle,{headers:{'Cache-Control':'no-store'}});
 }catch{
  return Response.json({...initialBundle,warning:'Não foi possível consultar a revisão online. Exibindo a última tabela incluída na publicação.'},{headers:{'Cache-Control':'no-store'}});
 }
}
