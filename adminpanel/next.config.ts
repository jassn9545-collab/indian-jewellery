import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/admin-api/:path*",
        destination: `${process.env.ADMIN_API_ORIGIN || "http://127.0.0.1:5000"}/admin-api/:path*`,
      },
    ];
  },
};

export default nextConfig;
