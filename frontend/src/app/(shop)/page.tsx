import { fetchNewestProducts, fetchTopSellingProducts, fetchCategories } from '@/lib/api/server-api';
import ProductCard from '@/components/product/ProductCard';
import HeroSlider from '@/components/home/HeroSlider';
import CategoryCard from '@/components/home/category-card';
import Link from 'next/link';
import { ArrowRight, Mail, Users, CheckCircle, ShieldCheck } from 'lucide-react';

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          {/* Season Badge */}
          <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-6 text-white/80 font-medium">
            Bộ sưu tập Xuân Hè 2026
          </p>
          
          {/* Main Heading with text shadow */}
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight mb-6 leading-[0.9]"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
          >
            Phong cách
            <br />
            <span className="text-rose-500">của bạn</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Khám phá những thiết kế thờI trang mới nhất với chất liệu cao cấp và phong cách hiện đại
          </p>
          
          {/* CTA Buttons - Glassmorphism style */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary CTA */}
            <Link
              href="/products"
              className="group relative bg-white/10 backdrop-blur-md border border-white/30 text-white 
                hover:bg-white/20 hover:border-white/50 hover:shadow-lg hover:shadow-rose-500/20
                transition-all duration-300 ease-out
                rounded-xl h-14 px-8 text-base font-semibold
                flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Khám phá ngay</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            {/* Secondary CTA */}
            <Link
              href="/products?sort=newest"
              className="bg-transparent backdrop-blur-sm border-2 border-white/40 text-white
                hover:bg-white/10 hover:border-white hover:shadow-lg hover:shadow-white/10
                transition-all duration-300 ease-out
                rounded-xl h-14 px-8 text-base font-semibold
                flex items-center gap-2"
            >
              Bộ sưu tập mới
            </Link>
          </div>
          
          {/* Stats or Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-white/70">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">1000+</p>
              <p className="text-sm">Sản phẩm</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">50K+</p>
              <p className="text-sm">Khách hàng</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">4.9</p>
              <p className="text-sm">Đánh giá</p>
            </div>
          </div>
        </div>
      </HeroSlider>

      {/* Section 2: NEW ARRIVALS */}
      <section id="new-arrivals" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-sm text-rose-600 font-semibold mb-2">Mới nhất</p>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Hàng mới về
              </h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="flex items-center text-sm font-medium text-neutral-600 hover:text-rose-600 transition-colors group"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
          <div className="text-center mb-12">
            <p className="text-sm text-rose-600 font-semibold mb-2">Danh mục</p>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Danh mục nổi bật
            </h2>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  href={`/products?categoryId=${category.id}`}
                />
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
            <div>
              <p className="text-sm text-rose-600 font-semibold mb-2">Phổ biến</p>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Bán chạy nhất
              </h2>
            </div>
            <Link
              href="/products?sort=top-selling"
              className="flex items-center text-sm font-medium text-neutral-600 hover:text-rose-600 transition-colors group"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-20 md:py-28 bg-rose-50 relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg shadow-rose-500/10 mb-6">
            <Mail className="h-7 w-7 text-rose-600" />
          </div>
          
          {/* Label */}
          <p className="text-sm text-rose-600 font-semibold mb-3">
            Newsletter
          </p>
          
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-900 mb-4">
            Nhận thông tin ưu đãi
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg text-neutral-600 mb-10 max-w-lg mx-auto leading-relaxed">
            Đăng ký để nhận ngay mã giảm giá <span className="text-rose-600 font-bold">10%</span> cho đơn hàng đầu tiên và cập nhật xu hướng thờI trang mới nhất
          </p>
          
          {/* Pill-shaped Input Group */}
          <form className="relative max-w-xl mx-auto">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none z-10" />
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full h-16 pl-14 pr-40 rounded-full border-2 border-neutral-200 bg-white text-base shadow-sm focus:outline-none focus:border-rose-500 transition-all duration-200"
              required
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-8 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/30 transition-all duration-200"
            >
              Đăng ký
            </button>
          </form>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-neutral-400" />
              <span>10,000+ thành viên</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Miễn phí vĩnh viễn</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-neutral-400" />
              <span>Bảo mật thông tin</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
