import { MerchantPayload } from './merchant.payload';
import { Review } from './review.payload';

export interface RequestMerchantReview extends Review, MerchantPayload {}
