"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug?: string;
  image?: string;
  href?: string;
  isActive?: boolean;
}

// Mapping tên danh mục (tiếng Việt) → Ảnh Unsplash phù hợp
const CATEGORY_IMAGES: Record<string, string> = {
  // ThờI trang Nam
  "thờI trang nam": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=750&fit=crop",
  "nam": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=750&fit=crop",
  "men": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=750&fit=crop",
  "men's fashion": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=750&fit=crop",
  
  // ThờI trang Nữ
  "thờI trang nữ": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=750&fit=crop",
  "nữ": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=750&fit=crop",
  "women": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=750&fit=crop",
  "women's fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=750&fit=crop",
  
  // ThờI trang Trẻ em
  "thờI trang trẻ em": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=750&fit=crop",
  "trẻ em": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=750&fit=crop",
  "kids": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=750&fit=crop",
  "children": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=750&fit=crop",
  
  // Phụ kiện
  "phụ kiện": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=750&fit=crop",
  "accessories": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=750&fit=crop",
  
  // Giày dép
  "giày dép": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop",
  "shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop",
  "footwear": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop",
  
  // Túi xách
  "túi xách": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=750&fit=crop",
  "bags": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=750&fit=crop",
  "handbags": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=750&fit=crop",
  
  // Đồng hồ
  "đồng hồ": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=750&fit=crop",
  "watches": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=750&fit=crop",
  
  // Trang sức
  "trang sức": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=750&fit=crop",
  "jewelry": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=750&fit=crop",
  
  // Kính mắt
  "kính mắt": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=750&fit=crop",
  "sunglasses": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=750&fit=crop",
  "eyewear": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=750&fit=crop",
  
  // Áo khoác
  "áo khoác": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop",
  "jackets": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop",
  "coats": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop",
  
  // Đồ thể thao
  "đồ thể thao": "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&h=750&fit=crop",
  "sportswear": "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&h=750&fit=crop",
  "activewear": "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&h=750&fit=crop",
  
  // Đồ ngủ
  "đồ ngủ": "https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=600&h=750&fit=crop",
  "sleepwear": "https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=600&h=750&fit=crop",
  
  // Đồ bơi
  "đồ bơi": "https://images.unsplash.com/photo-1575425186775-b8de9a427e67?w=600&h=750&fit=crop",
  "swimwear": "https://images.unsplash.com/photo-1575425186775-b8de9a427e67?w=600&h=750&fit=crop",
};

// Hàm lấy ảnh dựa trên tên danh mục
function getCategoryImage(name: string): string | undefined {
  const normalizedName = name.toLowerCase().trim();
  
  // Tìm chính xác
  if (CATEGORY_IMAGES[normalizedName]) {
    return CATEGORY_IMAGES[normalizedName];
  }
  
  // Tìm partial match
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return url;
    }
  }
  
  // Default theo danh mục đầu tiên trong list (fashion generic)
  return "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=750&fit=crop";
}

export function CategoryCard({
  name,
  slug,
  image,
  href,
}: CategoryCardProps) {
  const linkHref = href || (slug ? `/products?category=${slug}` : "#");
  const backgroundImage = image || getCategoryImage(name);

  return (
    <Link
      href={linkHref}
      className="group relative block overflow-hidden rounded-xl aspect-[4/5]"
    >
      {/* Image Layer with zoom effect */}
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-neutral-300" />
        )}
      </div>

      {/* Gradient Overlay - Bottom to top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/80 group-hover:via-black/40" />

      {/* Content Layer */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        {/* Category Name - Always visible with drop shadow for readability */}
        <h3 className="text-white font-black text-xl md:text-2xl uppercase tracking-wider drop-shadow-lg transition-transform duration-500 group-hover:-translate-y-2">
          {name}
        </h3>

        {/* "Khám phá →" - Hidden by default, slide up on hover */}
        <div className="mt-3 flex items-center gap-2 text-white/90 font-medium opacity-0 translate-y-4 transition-all duration-300 delay-100 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <span className="text-sm md:text-base">Khám phá</span>
          <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;
