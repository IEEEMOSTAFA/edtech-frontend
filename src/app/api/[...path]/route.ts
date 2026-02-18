// frontend/app/api/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:5000";

async function handler(req: NextRequest, params: string[]) {
  const url = `${BACKEND_URL}/api/${params.join("/")}`;

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") || "",
    },
    body:
      req.method === "GET"
        ? undefined
        : await req.text(),
    credentials: "include",
  });

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type":
        res.headers.get("content-type") || "application/json",
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handler(req, params.path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handler(req, params.path);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handler(req, params.path);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handler(req, params.path);
}
