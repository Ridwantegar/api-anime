import otakudesuConfig from "@configs/otakudesu.config.js";
import getHTML from "@helpers/getHTML.js";
import { parse, type HTMLElement } from "node-html-parser";

const { baseUrl } = otakudesuConfig;

interface AjaxResponse {
  data?: string;
}

const otakudesuScraper = {
  async scrapeDOM(pathname: string, ref?: string, sanitize: boolean = false): Promise<HTMLElement> {
    const html = await getHTML(baseUrl, pathname, ref, sanitize);
    return parse(html, { parseNoneClosedTags: true });
  },

  async scrapeNonce(body: string, referer: string): Promise<AjaxResponse> {
    const res = await fetch(new URL("/wp-admin/admin-ajax.php", baseUrl), {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Referer": referer,
        "Origin": baseUrl
      }
    });

    const json = (await res.json()) as AjaxResponse;
    return json;
  },

  async scrapeServer(body: string, referer: string): Promise<AjaxResponse> {
    const res = await fetch(new URL("/wp-admin/admin-ajax.php", baseUrl), {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": baseUrl,
        "Referer": referer
      }
    });

    const json = (await res.json()) as AjaxResponse;
    return json;
  }
};

export default otakudesuScraper;
