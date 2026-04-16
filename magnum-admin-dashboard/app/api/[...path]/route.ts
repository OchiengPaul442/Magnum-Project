import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL;
const SKIP_AUTH_HEADER = "x-skip-auth";

const buildTargetUrl = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  const baseUrl = API_BASE_URL?.replace(/\/$/, "") ?? "";
  const targetPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `${baseUrl}${targetPath}${search}`;
};

const forwardHeaders = (
  request: NextRequest,
  options: { accessToken?: string | null; skipAuth: boolean },
) => {
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");
  headers.delete("cookie");
  headers.delete(SKIP_AUTH_HEADER);

  if (!options.skipAuth && options.accessToken) {
    headers.set("Authorization", `Token ${options.accessToken}`);
  }

  return headers;
};

const resolveAccessToken = async (request: NextRequest) => {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    return typeof token?.accessToken === "string" ? token.accessToken : null;
  } catch {
    return null;
  }
};

const proxy = async (request: NextRequest) => {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "MAGNUM_API_BASE_URL is not configured." },
      { status: 500 },
    );
  }

  const skipAuth = request.headers.get(SKIP_AUTH_HEADER) === "true";
  const accessToken = skipAuth ? null : await resolveAccessToken(request);
  const targetUrl = buildTargetUrl(request);
  const headers = forwardHeaders(request, { accessToken, skipAuth });
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
  responseHeaders.delete("set-cookie");

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
