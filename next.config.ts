import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: "/chatherine",
  assetPrefix: "/chatherine/",
  images: { unoptimized: true },
};

export default nextConfig;
