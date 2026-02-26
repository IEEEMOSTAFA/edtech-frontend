// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;




// Tested: but ok 



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "https://edtech-backend-a19l.onrender.com/api/:path*",
//       },
//     ];
//   },
// };

// module.exports = nextConfig;










import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `https://edtech-backend-a19l.onrender.com/api/auth/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `https://edtech-backend-a19l.onrender.com/api/:path*`,
      },
    ];
  },
};

export default nextConfig;





