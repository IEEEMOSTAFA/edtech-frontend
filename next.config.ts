import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ← এটা MUST লাগবে Docker এর জন্য

  async rewrites() {
    // Docker এ BACKEND_URL = http://backend:5000
    // Local dev এ BACKEND_URL = http://localhost:5000
    const backendUrl =
      process.env.BACKEND_URL || "http://localhost:5000";

    return [
      {
        source: "/api/auth/:path*",
        destination: `${backendUrl}/api/auth/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;





















// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
  
//   async rewrites() {
//     return [
//       {
//         source: "/api/auth/:path*",
//         destination: `https://edtech-backend-a19l.onrender.com/api/auth/:path*`,
//       },
//       {
//         source: "/api/:path*",
//         destination: `https://edtech-backend-a19l.onrender.com/api/:path*`,
//       },
//     ];
//   },
// };

// export default nextConfig;





