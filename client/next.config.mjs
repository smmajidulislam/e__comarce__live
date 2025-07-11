/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "img.daisyui.com",
      "res.cloudinary.com",
      "via.placeholder.com",
      "images.unsplash.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Add this line to ignore ESLint during build
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
