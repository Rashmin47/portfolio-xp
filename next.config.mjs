/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/ventures",
        destination: "/experience",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
