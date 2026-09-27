import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TODO: remove once all placeholder photos are replaced with Lokaria photography
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
  },
};

export default nextConfig;
