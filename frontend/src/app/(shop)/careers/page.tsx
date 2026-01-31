import Link from 'next/link';
import { Briefcase, MapPin, Clock, DollarSign, Mail, Users, Sparkles } from 'lucide-react';

const benefits = [
  'Môi trường làm việc năng động và sáng tạo',
  'Cơ hộI phát triển và thăng tiến rõ ràng',
  'Chế độ đãi ngộ cạnh tranh',
  'Bảo hiểm đầy đủ theo quy định',
  'Các chương trình team building thường niên',
  'Giảm giá nhân viên khi mua sản phẩm',
];

const positions = [
  {
    title: 'Frontend Developer',
    department: 'Công nghệ',
    location: 'Hà Nội',
    type: 'Toàn thờI gian',
    salary: 'Thỏa thuận',
    description: 'Phát triển và tối ưu hóa giao diện ngườI dùng cho website thương mại điện tử.',
    requirements: ['Thành thạo React/Next.js', 'Có kinh nghiệm với TypeScript', 'Hiểu biết về UI/UX'],
  },
  {
    title: 'Fashion Designer',
    department: 'Thiết kế',
    location: 'Hà Nội',
    type: 'Toàn thờI gian',
    salary: 'Thỏa thuận',
    description: 'Thiết kế và phát triển các bộ sưu tập thờI trang mới theo xu hướng.',
    requirements: ['Tốt nghiệp chuyên ngành thiết kế thờI trang', 'Sáng tạo và có gu thẩm mỹ tốt', 'Kỹ năng sử dụng phần mềm thiết kế'],
  },
];

export default function CareersPage() {
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
            <span className="text-neutral-900 font-medium">Tuyển dụng</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl font-bold flex items-center gap-3 text-neutral-900">
            <Briefcase className="w-8 h-8" />
            Tuyển dụng
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-8 md:p-12 mb-12">
          <div className="flex items-start gap-4">
            <Sparkles className="w-10 h-10 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Chúng tôi đang tìm kiếm tài năng</h2>
              <p className="text-neutral-300 leading-relaxed">
                Fash.On luôn chào đón những con ngườI nhiệt huyết, sáng tạo và muốn 
                đóng góp vào sứ mệnh "ThờI trang cho mọi ngườI". Nếu bạn muốn cùng 
                chúng tôi xây dựng một thương hiệu thờI trang được yêu mến, hãy gia nhập đội ngũ Fash.On.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-6 h-6 text-neutral-700" />
            <h2 className="text-2xl font-bold text-neutral-900">Quyền lợI nhân viên</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 bg-neutral-50 p-4 border border-neutral-200">
                <span className="text-neutral-900 font-bold">•</span>
                <span className="text-neutral-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Vị trí đang tuyển</h2>
          
          {positions.length > 0 ? (
            <div className="space-y-6">
              {positions.map((position, index) => (
                <div
                  key={index}
                  className="bg-white border border-neutral-200 p-6 md:p-8 hover:border-neutral-400 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900">{position.title}</h3>
                      <p className="text-neutral-500 text-sm mt-1">{position.department}</p>
                    </div>
                    <span className="inline-flex px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Đang tuyển
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {position.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {position.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {position.salary}
                    </div>
                  </div>

                  <p className="text-neutral-700 mb-4">{position.description}</p>

                  <div className="mb-6">
                    <h4 className="font-bold text-neutral-900 text-sm mb-2">Yêu cầu:</h4>
                    <ul className="space-y-1">
                      {position.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-neutral-600 flex items-start gap-2">
                          <span className="text-neutral-400">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`mailto:careers@fashon.vn?subject=Ứng tuyển vị trí ${position.title}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Ứng tuyển ngay
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 border border-neutral-200 p-12 text-center">
              <Briefcase className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Hiện chưa có vị trí phù hợp</h3>
              <p className="text-neutral-600 mb-6">
                Hiện tại chúng tôi không có vị trí tuyển dụng nào. Hãy quay lại sau hoặc 
                gửi CV của bạn để chúng tôi liên hệ khi có cơ hộI phù hợp.
              </p>
              <a
                href="mailto:careers@fashon.vn?subject=Ứng tuyển vị trí (Chưa có trên website)"
                className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-900 text-neutral-900 font-bold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                Gửi CV của bạn
              </a>
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="mt-16 bg-amber-50 border border-amber-200 p-6 md:p-8">
          <h3 className="font-bold text-amber-900 mb-2">Bạn có câu hỏi?</h3>
          <p className="text-amber-800 text-sm mb-4">
            Nếu bạn có bất kỳ thắc mắc nào về quy trình tuyển dụng, vui lòng liên hệ:
          </p>
          <a
            href="mailto:careers@fashon.vn"
            className="text-amber-900 font-bold hover:underline"
          >
            careers@fashon.vn
          </a>
        </div>
      </main>
    </div>
  );
}
