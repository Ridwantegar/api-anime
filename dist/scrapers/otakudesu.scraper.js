import otakudesuConfig from "../configs/otakudesu.config.js";
import getHTML from "../helpers/getHTML.js";
import { parse } from "node-html-parser";
const { baseUrl } = otakudesuConfig;
const otakudesuScraper = {
    async scrapeDOM(pathname, ref, sanitize = false) {
        const html = await getHTML(baseUrl, pathname, ref, sanitize);
        return parse(html, { parseNoneClosedTags: true });
    },
    async scrapeNonce(body, referer) {
        const res = await fetch(new URL("/wp-admin/admin-ajax.php", baseUrl), {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Referer": referer,
                "Origin": baseUrl
            }
        });
        const json = (await res.json());
        return json;
    },
    async scrapeServer(body, referer) {
        const res = await fetch(new URL("/wp-admin/admin-ajax.php", baseUrl), {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": baseUrl,
                "Referer": referer
            }
        });
        const json = (await res.json());
        return json;
    }
};
export default otakudesuScraper;
