"use client";

import { Truck, ShieldCheck, Headphones } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Giao Hàng Nhanh",
    description: "Miễn phí vận chuyển cho đơn hàng từ 500.000đ. Giao hàng toàn quốc trong 2-5 ngày.",
  },
  {
    icon: ShieldCheck,
    title: "Chính Hãng 100%",
    description: "Cam kết sản phẩm chính hãng với chính sách đổi trả linh hoạt trong 30 ngày.",
  },
  {
    icon: Headphones,
    title: "Hỗ Trợ 24/7",
    description: "Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.",
  },
];

export function ServiceBanner() {
  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex items-start gap-4 group"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-white/10 text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                <service.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">
                  {service.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
