'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { MessageSquare, ShoppingBag } from 'lucide-react';
import { Review } from '@/types/review';
import { getProductReviews, createReview, deleteReview } from '@/lib/api/reviews';
import { useAuthStore } from '@/stores/auth-store';
import { StarRating } from './star-rating';
import { ReviewItem } from './review-item';
import { ReviewForm } from './review-form';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductReviewsSectionProps {
  productId: number;
}

export function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const { isAuthenticated, user } = useAuthStore();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [hasPurchased, setHasPurchased] = useState(true); // TODO: Check from orders API
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const stats = await getProductReviews(productId);
      setReviews(stats.reviews);
      setAverageRating(stats.averageRating);
      setTotalReviews(stats.totalReviews);
      setHasUserReviewed(stats.hasUserReviewed);
      setUserReview(stats.userReview || null);
    } catch (error: any) {
      toast.error('Không thể tải đánh giá sản phẩm');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (data: { productId: number; rating: number; content: string }) => {
    try {
      setIsSubmitting(true);
      await createReview(data);
      toast.success('Đánh giá đã được gửi thành công!');
      await fetchReviews();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Không thể gửi đánh giá';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      setIsDeleting(reviewId);
      await deleteReview(reviewId);
      toast.success('Đánh giá đã được xóa');
      await fetchReviews();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Không thể xóa đánh giá';
      toast.error(message);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const canReview = isAuthenticated && hasPurchased && !hasUserReviewed;

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-8 border-b border-neutral-200">
        <div className="text-center sm:text-left">
          <span className="text-5xl font-black text-neutral-900">
            {averageRating.toFixed(1)}
          </span>
        </div>
        <div>
          <StarRating rating={averageRating} size="lg" />
          <p className="text-sm text-neutral-600 mt-1">
            Dựa trên {totalReviews} đánh giá
          </p>
        </div>
      </div>

      {/* Review Form */}
      {canReview && (
        <ReviewForm
          productId={productId}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Not purchased message */}
      {isAuthenticated && !hasPurchased && !hasUserReviewed && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <ShoppingBag className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-amber-800">
            Bạn cần mua sản phẩm này trước khi có thể đánh giá.
          </p>
        </div>
      )}

      {/* Already reviewed message */}
      {isAuthenticated && hasUserReviewed && userReview && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            Bạn đã đánh giá sản phẩm này. Cảm ơn bạn đã chia sẻ trải nghiệm!
          </p>
        </div>
      )}

      {/* Login prompt */}
      {!isAuthenticated && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 text-center">
          <MessageSquare className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <p className="text-neutral-600 mb-3">
            Vui lòng đăng nhập để viết đánh giá
          </p>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 mb-2">Chưa có đánh giá nào</p>
            {canReview && (
              <p className="text-neutral-400 text-sm">
                Hãy là ngườii đầu tiên đánh giá sản phẩm này!
              </p>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onDelete={review.isOwner ? handleDeleteReview : undefined}
              isDeleting={isDeleting === review.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
