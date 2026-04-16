import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL;

const buildTargetUrl = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  const baseUrl = API_BASE_URL?.replace(/\/$/, "") ?? "";
  const targetPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `${baseUrl}${targetPath}${search}`;
};

const forwardHeaders = (request: NextRequest) => {
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");
  return headers;
};

const proxy = async (request: NextRequest) => {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "MAGNUM_API_BASE_URL is not configured." },
      { status: 500 },
    );
  }

  const targetUrl = buildTargetUrl(request);
  const headers = forwardHeaders(request);
  const method = request.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const response = await fetch(targetUrl, {
    method,
    headers,
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("transfer-encoding");

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
};

export async function GET(request: NextRequest) {
  return proxy(request);
}

export async function POST(request: NextRequest) {
  return proxy(request);
}

export async function PATCH(request: NextRequest) {
  return proxy(request);
}

export async function PUT(request: NextRequest) {
  return proxy(request);
}

export async function DELETE(request: NextRequest) {
  return proxy(request);
}
