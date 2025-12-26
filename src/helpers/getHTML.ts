import errorinCuy from "./errorinCuy.js";
import sanitizeHtml from "sanitize-html";

export const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36";

export default async function getHTML(
  baseUrl: string,
  pathname: string,
  ref?: string,
  sanitize = false
): Promise<string> {
  const url = new URL(pathname, baseUrl);

  const headers: Record<string, string> = {
    "User-Agent": userAgent,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
    "Cache-Control": "no-cache",
    "Referer": ref ? (ref.startsWith("http") ? ref : new URL(ref, baseUrl).toString()) : baseUrl,
    "Origin": baseUrl
  };

  const response = await fetch(url, {
    headers,
    redirect: "follow" // <── WAJIB kalau tidak mau kena forbidden
  });

  if (!response.ok) {
    throw errorinCuy(response.status > 399 ? response.status : 404);
  }

  const html = await response.text();

  if (!html.trim()) throw errorinCuy(404);

  // Optional sanitize
  if (sanitize) {
    return sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      allowedAttributes: {
        a: ["href", "name", "target"],
        img: ["src"],
        "*": ["class", "id"],
      }
    });
  }

  return html;
}
