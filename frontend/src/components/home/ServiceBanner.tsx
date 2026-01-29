import { Truck, BadgeCheck, Headphones } from 'lucide-react';

const services = [
    {
        icon: Truck,
        title: 'Giao Hàng Nhanh',
        description: 'Miễn phí giao hàng cho đơn từ 500.000₫',
    },
    {
        icon: BadgeCheck,
        title: 'Chính Hãng 100%',
        description: 'Cam kết sản phẩm chính hãng, nguồn gốc rõ ràng',
    },
    {
        icon: Headphones,
        title: 'Hỗ Trợ 24/7',
        description: 'Đội ngũ tư vấn sẵn sàng hỗ trợ mọi lúc',
    },
];

export function ServiceBanner() {
    return (
        <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-300"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-white/80">{service.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
