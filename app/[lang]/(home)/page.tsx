import { Building2Icon } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Tài liệu hệ thống phần mềm
              <span className="block text-yellow-300">Đại học Lạc Hồng</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-200">
              Trung tâm tài liệu hướng dẫn toàn diện cho tất cả các hệ thống
              phần mềm của Đại học Lạc Hồng. Tìm hiểu cách sử dụng, cấu hình và
              tùy chỉnh các hệ thống một cách hiệu quả.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/docs"
                className="rounded-md bg-yellow-500 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
              >
                Khám phá tài liệu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* University Info & Documentation */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
            <div className="lg:pr-4">
              <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 pb-9 pt-64 shadow-2xl sm:px-12 lg:px-8 lg:pb-8 xl:px-10 xl:pb-10">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-90"></div>
                <div className="relative">
                  <Building2Icon className="h-12 w-12 text-white" />
                  <blockquote className="mt-6 text-xl font-semibold leading-8 text-white">
                    <p>
                      "Đại học Lạc Hồng - Nơi hội tụ tri thức và công nghệ hiện
                      đại để phục vụ giáo dục và đào tạo chất lượng cao."
                    </p>
                  </blockquote>
                  <figcaption className="mt-6 text-sm leading-6 text-gray-300">
                    <strong className="font-semibold text-white">
                      Đại học Lạc Hồng
                    </strong>{" "}
                    – Trung tâm đào tạo hàng đầu khu vực
                  </figcaption>
                </div>
              </div>
            </div>
            <div>
              <div className="text-base leading-7 text-gray-700 lg:max-w-lg">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Về hệ thống tài liệu
                </h2>
                <div className="max-w-xl">
                  <p className="mt-6">
                    Hệ thống tài liệu phần mềm của Đại học Lạc Hồng được thiết
                    kế để cung cấp thông tin hướng dẫn chi tiết, dễ hiểu cho tất
                    cả các hệ thống phần mềm được sử dụng trong trường đại học.
                  </p>
                  <p className="mt-8">
                    Từ hệ thống quản lý học tập LMS, quản lý sinh viên, tài
                    chính, nhân sự đến thư viện - tất cả đều có tài liệu hướng
                    dẫn đầy đủ và cập nhật thường xuyên.
                  </p>
                  <p className="mt-8">
                    Mục tiêu của chúng tôi là giúp giảng viên, sinh viên và nhân
                    viên có thể sử dụng các hệ thống một cách hiệu quả và tối ưu
                    nhất.
                  </p>
                </div>
              </div>
              <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-gray-900/10 pt-10 sm:grid-cols-4">
                <div>
                  <dt className="text-sm font-semibold leading-6 text-gray-600">
                    Hệ thống
                  </dt>
                  <dd className="mt-2 text-3xl font-bold leading-10 tracking-tight text-gray-900">
                    6+
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold leading-6 text-gray-600">
                    Tài liệu
                  </dt>
                  <dd className="mt-2 text-3xl font-bold leading-10 tracking-tight text-gray-900">
                    100+
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold leading-6 text-gray-600">
                    Cập nhật
                  </dt>
                  <dd className="mt-2 text-3xl font-bold leading-10 tracking-tight text-gray-900">
                    Hàng tuần
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold leading-6 text-gray-600">
                    Hỗ trợ
                  </dt>
                  <dd className="mt-2 text-3xl font-bold leading-10 tracking-tight text-gray-900">
                    24/7
                  </dd>
                </div>
              </dl>
              <div className="mt-10">
                <Link
                  href="/docs"
                  className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Xem toàn bộ tài liệu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
