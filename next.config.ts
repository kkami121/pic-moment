import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["192.168.219.110", "pic-moment.duckdns.org"]
};

export default nextConfig;
