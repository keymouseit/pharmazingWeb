/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Dynamically import browserify-fs
      config.resolve.alias.fs = path.resolve("node_modules/browserify-fs");
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1tkh0shzgk02t.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d1tkh0shzgk02t.cloudfront.netother",
        port: "",
        pathname: "/**",
      },
    ],
  },
  distDir: "_static",
};

export default nextConfig;
