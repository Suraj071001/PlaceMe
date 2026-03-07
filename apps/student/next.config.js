/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.nita.ac.in", pathname: "/images/**" },
    ],
  },
};

export default nextConfig;
