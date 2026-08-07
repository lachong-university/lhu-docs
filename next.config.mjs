import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// Next suy workspace root bằng cách dò ngược lên tìm lockfile. Repo này có package.json ở
// thư mục cha (giữ @fui-org/fui-mcp làm nguồn tài liệu), nên nếu không ghim thì Next có thể
// chọn nhầm thư mục cha — hoặc tệ hơn là $HOME — làm root. Với output: "standalone" điều đó
// khiến bước trace file gom nhầm cây thư mục.
const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
  output: "standalone",
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  serverExternalPackages: ['@takumi-rs/image-response'],
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/docs/:path*',
      },
    ];
  },
  images: {

    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.gitbook.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.gitbook.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withMDX(config);
