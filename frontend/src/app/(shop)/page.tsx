import { fetchNewestProducts, fetchTopSellingProducts, fetchCategories } from '@/lib/api/server-api';
import ProductCard from '@/components/product/ProductCard';
import HeroSlider from '@/components/home/HeroSlider';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

async function getHomepageData() {
  try {
    const [newestProducts, topSellingProducts, categories] = await Promise.all([
      fetchNewestProducts(4),
      fetchTopSellingProducts(4),
      fetchCategories(),
    ]);

    return {
      newestProducts: newestProducts || [],
      topSellingProducts: topSellingProducts || [],
      categories: (categories || []).slice(0, 3), // Take first 3 categories
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      newestProducts: [],
      topSellingProducts: [],
      categories: [],
    };
  }
}

export default async function HomePage() {
  const { newestProducts, topSellingProducts, categories } = await getHomepageData();

  return (
    <div className="bg-white">
      {/* Section 1: HERO */}
      <HeroSlider>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p className="text-sm tracking-widest uppercase mb-4">
            Bộ sưu tập Xuân Hè 2026
          </p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
            Phong cách của bạn
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Khám phá những thiết kế mới nhất với chất liệu cao cấp và phong cách hiện đại
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-neutral-900 px-8 py-4 font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors"
            >
              Khám phá ngay
            </Link>
            <Link
              href="/products?sort=newest"
              className="border-2 border-white text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-neutral-900 transition-colors"
            >
              Bộ sưu tập mới
            </Link>
          </div>
        </div>
      </HeroSlider>

      {/* Section 2: NEW ARRIVALS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900">
              Hàng mới về
            </h2>
            <Link
              href="/products?sort=newest"
              className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {newestProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newestProducts.map((product) => (
                <ProductCard key={product.id} product={product} showNewBadge={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <p>Không có sản phẩm mới nào</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: CATEGORY SHOWCASE */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900 mb-12 text-center">
            Danh mục nổi bật
          </h2>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?categoryId=${category.id}`}
                  className="group relative overflow-hidden bg-neutral-200 aspect-[4/3] flex items-center justify-center"
                >
                  {/* Placeholder gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-300 to-neutral-400 group-hover:scale-105 transition-transform duration-300" />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Khám phá
                    </span>
                  </div>

                  {/* Category Name */}
                  <h3 className="relative text-2xl uppercase font-bold text-neutral-900 group-hover:text-white transition-colors z-10">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <p>Không có danh mục nào</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 4: BEST SELLERS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900">
              Bán chạy nhất
            </h2>
            <Link
              href="/products?sort=top-selling"
              className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {topSellingProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {topSellingProducts.map((product) => (
                <ProductCard key={product.id} product={product} showHotBadge={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <p>Không có sản phẩm bán chạy nào</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 5: NEWSLETTER */}
      <section className="py-20 bg-neutral-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900 mb-4">
            Nhận thông tin mới nhất
          </h2>
          <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
            Đăng ký để nhận ưu đãi 10% cho đơn hàng đầu tiên
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-6 py-4 border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="bg-neutral-900 text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors whitespace-nowrap"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
