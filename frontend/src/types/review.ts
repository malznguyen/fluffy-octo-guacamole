// Review-related type definitions

export interface Review {
  id: number;
  rating: number; // 1-5
  content: string;
  userName: string;
  userAvatar?: string;
  createdAt: string; // ISO date
  isOwner: boolean;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  content: string;
}

export interface ProductReviewStats {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  hasUserReviewed: boolean;
  userReview?: Review;
}
