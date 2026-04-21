import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

function getPublicOrigin(request: NextRequest): string {
  const configured = process.env.NEXTAUTH_URL;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // Fall through to forwarded headers/request URL.
    }
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}

function getPublicRequestUrl(request: NextRequest): string {
  const origin = getPublicOrigin(request);
  return `${origin}${request.nextUrl.pathname}${request.nextUrl.search}`;
}

function withRealmCookies(response: NextResponse, request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const tenantId = search.get("tenant_id");
  const orgId = search.get("org_id");
  const serviceId = search.get("service_id");
  const embed = search.get("embed");

  if (tenantId) {
    response.cookies.set("sg_tenant_id", tenantId, { path: "/", sameSite: "lax" });
  }
  if (orgId) {
    response.cookies.set("sg_org_id", orgId, { path: "/", sameSite: "lax" });
  }
  if (serviceId) {
    response.cookies.set("sg_service_id", serviceId, { path: "/", sameSite: "lax" });
  }
  if (embed === "1" || embed === "true") {
    response.cookies.set("sg_embed_mode", "1", { path: "/", sameSite: "lax" });
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicOrigin = getPublicOrigin(request);
  const isLocaleRoot = /^\/(en|fr)\/?$/.test(pathname);
  const isPublicLocalePage =
    /^\/(en|fr)\/(resources|events|media|give)(\/thanks)?\/?$/.test(pathname);
  const isPublicRoute =
    pathname === "/" ||
    isLocaleRoot ||
    isPublicLocalePage ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/ping");

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  if (pathname.startsWith("/api/auth")) {
    return withRealmCookies(NextResponse.next(), request);
  }

  if (isPublicRoute) {
    return withRealmCookies(NextResponse.next(), request);
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  if (!token) {
    const redirectUrl = encodeURIComponent(getPublicRequestUrl(request));

    return withRealmCookies(
      NextResponse.redirect(
        new URL(`/api/auth/guest?redirectUrl=${redirectUrl}`, publicOrigin)
      ),
      request
    );
  }

  const isGuest = guestRegex.test(token?.email ?? "");

  if (token && !isGuest && ["/login", "/register"].includes(pathname)) {
    return withRealmCookies(
      NextResponse.redirect(new URL("/", publicOrigin)),
      request
    );
  }

  return withRealmCookies(NextResponse.next(), request);
}

export const config = {
  matcher: [
    "/",
    "/chat/:id",
    "/api/:path*",
    "/login",
    "/register",

    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
