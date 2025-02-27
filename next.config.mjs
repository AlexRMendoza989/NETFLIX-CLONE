/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs"], // Excluye bcryptjs del Edge Runtime
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**", // Permite cargar imágenes desde GitHub
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Evita que Webpack intente emular módulos de Node.js en el cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;