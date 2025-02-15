import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dxlpglyxudzmrehnkvxg.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
    ],
  },
};

export default nextConfig;
