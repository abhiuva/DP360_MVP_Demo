const isProd = process.env.NODE_ENV === "production";

const normalizeCookieDomain = (value) => {
  if (!value) return undefined;

  try {
    return new URL(value).hostname;
  } catch {
    return value;
  }
};

const COOKIE_DOMAIN = isProd && process.env.COOKIE_DOMAIN
  ? normalizeCookieDomain(process.env.COOKIE_DOMAIN)
  : undefined;

exports.authCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  path: "/",
  ...(maxAge ? { maxAge } : {}),
  ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
});

exports.authCookieClearOptions = () => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  path: "/",
  ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
});

exports.readableAuthCookieOptions = (maxAge) => ({
  ...exports.authCookieOptions(maxAge),
  httpOnly: false,
});
