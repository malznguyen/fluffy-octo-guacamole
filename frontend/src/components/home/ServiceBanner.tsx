import Image from 'next/image';
import { Truck, BadgeCheck, Headphones } from 'lucide-react';

const services = [
    {
        icon: Truck,
        title: 'Giao Hàng Nhanh',
        description: 'Miễn phí giao hàng cho đơn từ 500.000₫',
        image: 'https://placehold.co/600x400/1f2937/ffffff?text=Giao+Hang+Nhanh',
    },
    {
        icon: BadgeCheck,
        title: 'Chính Hãng 100%',
        description: 'Cam kết sản phẩm chính hãng, nguồn gốc rõ ràng',
        image: 'https://placehold.co/600x400/1f2937/ffffff?text=Chinh+Hang+100%25',
    },
    {
        icon: Headphones,
        title: 'Hỗ Trợ 24/7',
        description: 'Đội ngũ tư vấn sẵn sàng hỗ trợ mọi lúc',
        image: 'https://placehold.co/600x400/1f2937/ffffff?text=Ho+Tro+24/7',
    },
];

export function ServiceBanner() {
    return (
        <section className="py-16 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={index}
                                className="relative overflow-hidden rounded-2xl group"
                            >
                                {/* Background Image */}
                                <div className="relative h-48">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50" />
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-white/80 text-sm">{service.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
