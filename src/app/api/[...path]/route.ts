// // frontend/app/api/[...path]/route.ts

// import { NextRequest, NextResponse } from "next/server";

// const BACKEND_URL = "https://edtech-backend-a19l.onrender.com";

// async function handler(req: NextRequest, params: string[]) {
//   const url = `${BACKEND_URL}/api/${params.join("/")}`;

//   const res = await fetch(url, {
//     method: req.method,
//     headers: {
//       "Content-Type": "application/json",
//       cookie: req.headers.get("cookie") || "",
//     },
//     body:
//       req.method === "GET"
//         ? undefined
//         : await req.text(),
//     credentials: "include",
//   });

//   const data = await res.text();

//   return new NextResponse(data, {
//     status: res.status,
//     headers: {
//       "Content-Type":
//         res.headers.get("content-type") || "application/json",
//     },
//   });
// }

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { path: string[] } }
// ) {
//   return handler(req, params.path);
// }

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { path: string[] } }
// ) {
//   return handler(req, params.path);
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { path: string[] } }
// ) {
//   return handler(req, params.path);
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { path: string[] } }
// ) {
//   return handler(req, params.path);
// }









































//test:
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://edtech-backend-a19l.onrender.com";

async function handler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  const url = `${BACKEND_URL}/api/${path.join("/")}`;

  const body =
    req.method === "GET" || req.method === "HEAD"
      ? undefined
      : await req.text();

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") || "",
    },
    body,
    credentials: "include",
  });

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handler(req, ctx);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handler(req, ctx);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handler(req, ctx);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handler(req, ctx);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handler(req, ctx);
}











// // import { NextRequest, NextResponse } from "next/server";

// // const BACKEND_URL = "https://edtech-backend-a19l.onrender.com";

// // async function handler(
// //   req: NextRequest,
// //   { params }: { params: Promise<{ path: string[] }> }
// // ) {
// //   const { path } = await params;
// //   const url = `${BACKEND_URL}/api/${path.join("/")}`;

// //   const body =
// //     req.method === "GET" || req.method === "HEAD"
// //       ? undefined
// //       : await req.text();

// //   const res = await fetch(url, {
// //     method: req.method,
// //     headers: {
// //       "Content-Type": "application/json",
// //       cookie: req.headers.get("cookie") || "",
// //     },
// //     body,
// //     credentials: "include",
// //   });

// //   const data = await res.text();

// //   return new NextResponse(data, {
// //     status: res.status,
// //     headers: {
// //       "Content-Type": res.headers.get("content-type") || "application/json",
// //     },
// //   });
// // }

// // export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
// //   return handler(req, ctx);
// // }
// // export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
// //   return handler(req, ctx);
// // }
// // export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
// //   return handler(req, ctx);
// // }
// // export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
// //   return handler(req, ctx);
// // }
// // export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
// //   return handler(req, ctx);
// // }