import Link from 'next/link';
import { Building2, Target, Eye, Heart, Users, Award } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Chất lượng',
    description: 'Cam kết mang đến sản phẩm chất lượng cao, bền đẹp theo thờI gian',
  },
  {
    icon: Users,
    title: 'Khách hàng là trung tâm',
    description: 'Mọi quyết định đều hướng đến trải nghiệm tốt nhất cho khách hàng',
  },
  {
    icon: Award,
    title: 'Uy tín',
    description: 'Xây dựng niềm tin qua từng sản phẩm và dịch vụ',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-600 mb-4">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-900 font-medium">Về chúng tôi</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl font-bold flex items-center gap-3 text-neutral-900">
            <Building2 className="w-8 h-8" />
            Về Fash.On
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Story Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Câu chuyện thương hiệu</h2>
          <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed space-y-4">
            <p>
              Fash.On ra đờI với sứ mệnh mang đến thờI trang chất lượng cao, phù hợp với mọi 
              phong cách và ngân sách. Từ những ngày đầu tiên, chúng tôi tin rằng thờI trang 
              không chỉ là quần áo - đó là cách mỗi ngườI thể hiện cá tính và câu chuyện của riêng mình.
            </p>
            <p>
              Qua nhiều năm phát triển, Fash.On đã trở thành điểm đến tin cậy của hàng ngàn 
              khách hàng trên cả nước. Chúng tôi tự hào về việc lựa chọn kỹ lưỡng từng sản phẩm, 
              đảm bảo chất lượng từ chất liệu đến đường may.
            </p>
            <p>
              Mỗi bộ sưu tập của Fash.On đều được thiết kế với tâm huyết, cập nhật xu hướng 
              thờI trang mới nhất nhưng vẫn giữ được nét đẹp riêng, phù hợp với văn hóa và 
              khí hậu Việt Nam.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-neutral-50 border border-neutral-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-neutral-900" />
              <h3 className="text-xl font-bold text-neutral-900">Sứ mệnh</h3>
            </div>
            <p className="text-neutral-700 leading-relaxed">
              "ThờI trang cho mọi ngườI" - Chúng tôi mong muốn mang đến cho mọi khách hàng 
              những sản phẩm thờI trang chất lượng với giá hợp lý, giúp mỗi ngườI tự tin 
              thể hiện phong cách riêng của mình.
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-neutral-900" />
              <h3 className="text-xl font-bold text-neutral-900">Tầm nhìn</h3>
            </div>
            <p className="text-neutral-700 leading-relaxed">
              Trở thành thương hiệu thờI trang được yêu thích hàng đầu tại Việt Nam, 
              nơi khách hàng luôn tìm thấy sự tin tưởng và hài lòng trong từng sản phẩm 
              và trải nghiệm mua sắm.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Giá trị cốt lõi</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white border border-neutral-200 p-6 text-center hover:border-neutral-400 transition-colors"
              >
                <value.icon className="w-10 h-10 text-neutral-900 mx-auto mb-4" />
                <h3 className="font-bold text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-sm text-neutral-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-neutral-900 text-white p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
              <div className="text-neutral-400 text-sm">Sản phẩm</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50k+</div>
              <div className="text-neutral-400 text-sm">Khách hàng</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">63</div>
              <div className="text-neutral-400 text-sm">Tỉnh thành</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">99%</div>
              <div className="text-neutral-400 text-sm">Hài lòng</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-neutral-600 mb-6">
            Cảm ơn bạn đã đồng hành cùng Fash.On trên hành trình này.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Khám phá bộ sưu tập
          </Link>
        </div>
      </main>
    </div>
  );
}
