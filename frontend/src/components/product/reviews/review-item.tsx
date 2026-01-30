'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Trash2, User } from 'lucide-react';
import { Review } from '@/types/review';
import { StarRating } from './star-rating';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ReviewItemProps {
  review: Review;
  onDelete?: (reviewId: number) => void;
  isDeleting?: boolean;
}

export function ReviewItem({ review, onDelete, isDeleting }: ReviewItemProps) {
  const formattedDate = format(new Date(review.createdAt), 'dd/MM/yyyy', { locale: vi });

  // Get initials from user name
  const initials = review.userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex gap-4 pb-6 border-b border-neutral-200 last:border-0">
      {/* Avatar */}
      <Avatar className="w-12 h-12 flex-shrink-0">
        <AvatarFallback className="bg-neutral-200 text-neutral-600 text-sm font-medium">
          {initials || <User className="w-5 h-5" />}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="font-medium text-neutral-900">{review.userName}</span>
          <span className="text-xs text-neutral-500">{formattedDate}</span>
          {review.isOwner && (
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
              Bạn
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="mb-2">
          <StarRating rating={review.rating} size="sm" />
        </div>

        {/* Content */}
        <p className="text-neutral-700 text-base leading-relaxed">{review.content}</p>

        {/* Delete button (only for owner) */}
        {review.isOwner && onDelete && (
          <div className="mt-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Xóa
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa đánh giá?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(review.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
