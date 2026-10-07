export function read<T>(key:string,fallback:T):T{try{const raw=localStorage.getItem('marketcalc-v1-'+key);return raw?JSON.parse(raw):fallback;}catch{return fallback;}}
export function write<T>(key:string,value:T){localStorage.setItem('marketcalc-v1-'+key,JSON.stringify(value));}
