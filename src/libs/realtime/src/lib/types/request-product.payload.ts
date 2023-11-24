import { ProductPayload } from './product.payload';
import { Review } from './review.payload';

export interface RequestProductReview extends Review, ProductPayload {}
