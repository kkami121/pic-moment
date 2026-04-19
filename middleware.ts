import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["ko", "en", "ja", "zh", "id", "es", "ar", "fr", "ru", "pt", "de"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: Locale = "ko";
const COOKIE_NAME = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30일

function detectFromAcceptLanguage(header: string): Locale | null {
  for (const part of header.split(",")) {
    const lang = part.trim().split(";")[0].trim().toLowerCase();
    if (lang.startsWith("ko")) return "ko";
    if (lang.startsWith("ja")) return "ja";
    if (lang.startsWith("zh")) return "zh";
    if (lang.startsWith("id")) return "id";
    if (lang.startsWith("es")) return "es";
    if (lang.startsWith("ar")) return "ar";
    if (lang.startsWith("fr")) return "fr";
    if (lang.startsWith("ru")) return "ru";
    if (lang.startsWith("pt")) return "pt";
    if (lang.startsWith("de")) return "de";
    if (lang.startsWith("en")) return "en";
  }
  return null;
}

const COUNTRY_TO_LOCALE: Partial<Record<string, Locale>> = {
  KR: "ko",
  JP: "ja",
  CN: "zh", TW: "zh", HK: "zh", MO: "zh", SG: "zh",
  ID: "id",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es",
  PE: "es", VE: "es", EC: "es", GT: "es", CU: "es",
  BO: "es", DO: "es", HN: "es", PY: "es", SV: "es",
  NI: "es", CR: "es", PA: "es", UY: "es",
  SA: "ar", EG: "ar", DZ: "ar", IQ: "ar", MA: "ar",
  YE: "ar", SY: "ar", TN: "ar", JO: "ar", LY: "ar",
  AE: "ar", LB: "ar", OM: "ar", KW: "ar", QA: "ar",
  BH: "ar", SD: "ar", PS: "ar",
  FR: "fr", MC: "fr", BE: "fr", LU: "fr",
  CI: "fr", SN: "fr", ML: "fr", BF: "fr", NE: "fr",
  TD: "fr", GN: "fr", RW: "fr", BI: "fr", TG: "fr",
  BJ: "fr", CD: "fr", CG: "fr", CF: "fr", GA: "fr",
  CM: "fr", MG: "fr", DJ: "fr",
  RU: "ru", BY: "ru", KZ: "ru", KG: "ru",
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt",
  CV: "pt", ST: "pt", GW: "pt", TL: "pt",
  DE: "de", AT: "de", LI: "de",
};

async function detectFromIP(ip: string): Promise<Locale | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 500);
    const res = await fetch(`https://api.country.is/${ip}`, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = (await res.json()) as { country?: string };
      if (data.country) {
        return COUNTRY_TO_LOCALE[data.country] ?? "en";
      }
    }
  } catch {
    // 타임아웃 또는 네트워크 오류 → 무시하고 폴백
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && (SUPPORTED_LOCALES as readonly string[]).includes(cookieLocale)) {
    return NextResponse.next();
  }

  const acceptLang = request.headers.get("accept-language") ?? "";
  let locale = detectFromAcceptLanguage(acceptLang);

  if (!locale) {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "";
    if (ip && ip !== "127.0.0.1" && ip !== "::1") {
      locale = await detectFromIP(ip);
    }
  }

  const finalLocale: Locale = locale ?? DEFAULT_LOCALE;

  const response = NextResponse.next();
  response.cookies.set(COOKIE_NAME, finalLocale, {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    httpOnly: false,
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
