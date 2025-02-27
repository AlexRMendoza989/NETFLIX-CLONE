/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["bcrypt"], // Permite usar bcryptjs en Server Components
  },
  output: "standalone", // Genera una compilación independiente para despliegues en contenedores
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
  // Configuración adicional para evitar problemas con módulos nativos
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