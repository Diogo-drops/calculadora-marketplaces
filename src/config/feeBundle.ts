import type {Rule} from '../types';
import {defaultRules} from './marketplaceFees';
import {sources,feeRevision,feeReviewDate,shippingSource} from './feeSources';
export type FeeBundle={revision:string;checkedAt:string;attemptedAt:string;rules:Rule[];sources:typeof sources;shipping:{percentage:number;cap:number;source:string;verifiedAt:string}};
export const initialBundle:FeeBundle={revision:feeRevision,checkedAt:feeReviewDate,attemptedAt:feeReviewDate,rules:defaultRules,sources,shipping:{percentage:6,cap:5000,source:shippingSource,verifiedAt:'2026-10-06'}};
