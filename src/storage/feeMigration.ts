import type {Rule,Context,Market} from '../types';
import {defaultRules,defaultContexts} from '../config/marketplaceFees';
import {defaultRules as oldDefaults} from '../config/legacyDemonstrationFees';
// Only exact original demonstration rules are removed. Custom rules are retained.
export function reconcileRules(saved:Rule[],officialRules:Rule[]=defaultRules):Rule[]{
 const custom=saved.filter(r=>!oldDefaults.some(old=>JSON.stringify(old)===JSON.stringify(r))&&r.origin!=='official');
 const knownIds=new Set(custom.map(r=>r.id));
 return [...custom,...officialRules.filter(r=>!knownIds.has(r.id))];
}
export function migrateContexts(saved:Record<Market,Context>,previousRevision:string):Record<Market,Context>{
 const next=structuredClone(saved);
 for(const m of ['ml','shopee','tiktok'] as const)next[m]={...defaultContexts[m],...next[m]};
 if(!previousRevision)next.tiktok={...next.tiktok,logisticRate:6,logisticCap:5000};
 return next;
}
