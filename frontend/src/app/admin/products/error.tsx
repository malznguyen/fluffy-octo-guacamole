'use client';

import { useEffect } from 'react';
import { Package, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Products Error:', error);
  }, [error]);

  return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <Package className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Đã có lỗi xảy ra
        </h2>
        <p className="text-red-600 mb-6 max-w-md mx-auto">
          {error.message ||
            'Không thể tải trang quản lý sản phẩm. Vui lòng thử lại sau.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="outline">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
          <Button onClick={() => (window.location.href = '/admin')}>
            Về trang tổng quan
          </Button>
        </div>
      </div>
    </div>
  );
}
