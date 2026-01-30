'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, MessageSquare } from 'lucide-react';
import { StarInput } from './star-input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Vui lòng chọn số sao').max(5),
  content: z.string().min(5, 'Nội dung đánh giá phải có ít nhất 5 ký tự').max(2000, 'Nội dung không được vượt quá 2000 ký tự'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: number;
  onSubmit: (data: { productId: number; rating: number; content: string }) => Promise<void>;
  isSubmitting?: boolean;
}

export function ReviewForm({ productId, onSubmit, isSubmitting = false }: ReviewFormProps) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      content: '',
    },
  });

  const handleSubmit = async (values: ReviewFormValues) => {
    await onSubmit({
      productId,
      rating: values.rating,
      content: values.content,
    });
    form.reset();
  };

  return (
    <div className="bg-neutral-50 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-neutral-600" />
        <h3 className="text-lg font-bold uppercase tracking-wider">Viết đánh giá</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Star Rating Input */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-neutral-600">Đánh giá của bạn</FormLabel>
                <FormControl>
                  <StarInput
                    value={field.value}
                    onChange={field.onChange}
                    size="lg"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Review Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-neutral-600">Nội dung đánh giá</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    rows={4}
                    disabled={isSubmitting}
                    className="resize-none bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-wider"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              'Gửi đánh giá'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
