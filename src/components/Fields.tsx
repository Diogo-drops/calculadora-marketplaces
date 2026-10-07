'use client';
import { useState } from 'react';
import { cents } from '../calculations';
interface NumberProps {label:string; value:number; onChange:(n:number)=>void; money?:boolean; integer?:boolean; min?:number; max?:number}
export function NumberField({label,value,onChange,money=false,integer=false,min=0,max}:NumberProps){
 const [text,setText]=useState<string|null>(null);
 const [error,setError]=useState('');
 const display=text??(money?(value/100).toFixed(2).replace('.',','):String(value).replace('.',','));
 function change(v:string){
  setText(v);
  try{
   const n=money?cents(v):Number(v.replace(',','.'));
   if(v===''||!Number.isFinite(n)||n<min||(max!==undefined&&n>max)||(integer&&!Number.isSafeInteger(n))||(!integer&&!money&&Math.abs(n*100-Math.round(n*100))>0.000001))throw Error();
   onChange(n);setError('');
  }catch{setError('Valor inválido; último valor válido mantido.');}
 }
 return <label className={'field '+(error?'invalid':'')}><span>{label}</span><div className="input-wrap">{money&&<b>R$</b>}<input aria-label={label} aria-invalid={!!error} inputMode={integer?'numeric':'decimal'} value={display} onChange={e=>change(e.target.value)} onBlur={()=>{if(!error)setText(null);}}/></div>{error&&<small role="alert">{error}</small>}</label>;
}
export function TextField({label,value,onChange,type='text'}:{label:string;value:string;onChange:(s:string)=>void;type?:string}){return <label className="field"><span>{label}</span><input type={type} value={value} onChange={e=>onChange(e.target.value)}/></label>}
export function Select({label,value,onChange,options}:{label:string;value:string;onChange:(s:string)=>void;options:string[]}){return <label className="field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o} value={o}>{o||'Todas / padrão'}</option>)}</select></label>}
