import type { NextConfig } from "next";

const nextConfig = {

  async rewrites() {

    return [

      {
        source: "/",
        destination: "/runtime",
      },
    ];
  },
};

export default nextConfig;


