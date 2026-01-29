import * as React from 'react';
import { Suspense } from 'react';
import ShopContent from './ShopContent';

// Loading fallback
function ShopLoading() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8">
          <div className="h-4 w-32 bg-neutral-200 animate-pulse" />
        </div>
      </section>
      <section className="py-12 lg:py-16">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center">
          <div className="h-12 w-64 bg-neutral-200 animate-pulse mx-auto" />
        </div>
      </section>
      <section className="pb-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="aspect-[3/4] bg-neutral-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-neutral-200 animate-pulse" />
                  <div className="h-4 w-full max-w-[200px] bg-neutral-200 animate-pulse" />
                  <div className="h-4 w-20 bg-neutral-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent />
    </Suspense>
  );
}
