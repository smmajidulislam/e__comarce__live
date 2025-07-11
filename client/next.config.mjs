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
