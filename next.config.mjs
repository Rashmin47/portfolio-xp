/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Renamed routes
      { source: "/ventures",  destination: "/experience", permanent: true },
      // Removed routes → redirect to homepage panel
      { source: "/home",      destination: "/",           permanent: true },
      { source: "/workshop",  destination: "/",           permanent: true },
    ];
  },
};

export default nextConfig;
