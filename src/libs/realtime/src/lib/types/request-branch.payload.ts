import { BranchPayload } from './branch.payload';
import { Review } from './review.payload';

export interface RequestBranchReview extends Review, BranchPayload {}
