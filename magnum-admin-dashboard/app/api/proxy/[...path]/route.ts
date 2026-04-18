import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth/options";

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL;
const SKIP_AUTH_HEADER = "x-skip-auth";
const PROXY_PREFIX = "/api/proxy";

const buildTargetUrl = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  const baseUrl = API_BASE_URL?.replace(/\/$/, "") ?? "";
  const backendPath = pathname.startsWith(PROXY_PREFIX)
    ? pathname.slice(PROXY_PREFIX.length)
    : pathname;
  const targetPath = backendPath.endsWith("/")
    ? backendPath
    : `${backendPath}/`;

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

type SessionProbe = {
  accessToken?: string | null;
  error?: string;
};

type SessionCallbackParams = Parameters<
  NonNullable<NonNullable<typeof authOptions.callbacks>["session"]>
>[0];

const sessionCallback = authOptions.callbacks?.session;

const sessionProbeOptions = {
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    session: async (params: SessionCallbackParams) => {
      const baseSession = sessionCallback
        ? await sessionCallback(params)
        : params.session;

      return {
        ...baseSession,
        accessToken: params.token?.accessToken ?? null,
        error: params.token?.error,
      } as SessionProbe;
    },
  },
};

const resolveSessionProbe = async (request: NextRequest) => {
  const requestCookies = Object.fromEntries(
    request.cookies.getAll().map(({ name, value }) => [name, value]),
  );
  const requestHeaders = Object.fromEntries(request.headers.entries());

  if (!requestHeaders.host) {
    requestHeaders.host = request.nextUrl.host;
  }

  if (!requestHeaders["x-forwarded-proto"]) {
    requestHeaders["x-forwarded-proto"] = request.nextUrl.protocol.replace(
      ":",
      "",
    );
  }

  const responseHeaders = new Map<string, string | string[]>();
  const fakeResponse = {
    getHeader(name: string) {
      return responseHeaders.get(name);
    },
    setHeader(name: string, value: string | string[]) {
      responseHeaders.set(name, value);
    },
  };

  const session = (await getServerSession(
    { cookies: requestCookies, headers: requestHeaders } as never,
    fakeResponse as never,
    sessionProbeOptions,
  )) as SessionProbe | null;

  const setCookieHeader = responseHeaders.get("Set-Cookie");
  const setCookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : setCookieHeader
      ? [setCookieHeader]
      : [];

  return { session, setCookies };
};

const proxy = async (request: NextRequest) => {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "MAGNUM_API_BASE_URL is not configured." },
      { status: 500 },
    );
  }

  const skipAuth = request.headers.get(SKIP_AUTH_HEADER) === "true";
  const sessionProbe = skipAuth ? null : await resolveSessionProbe(request);
  const accessToken = skipAuth
    ? null
    : (sessionProbe?.session?.accessToken ?? null);

  if (!skipAuth) {
    const isSessionExpired =
      !sessionProbe?.session ||
      sessionProbe.session.error === "RefreshAccessTokenError" ||
      !accessToken;

    if (isSessionExpired) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

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

  const proxyResponse = new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });

  if (!skipAuth && sessionProbe?.setCookies.length) {
    sessionProbe.setCookies.forEach((cookie) => {
      proxyResponse.headers.append("Set-Cookie", cookie);
    });
  }

  return proxyResponse;
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