const ALLOWED_REFERERS = [
  "/api/",
  "localhost",
  "http://192.168.1.6:3000/",
  "https://www.zxcprime.site/",
  "https://zxcprime.site/",
];

export const ALLOWED_ORIGINS = ["https://zxcprime.site"];
export function isValidReferer(referer: string): boolean {
  return ALLOWED_REFERERS.some((allowed) => referer.includes(allowed));
}
