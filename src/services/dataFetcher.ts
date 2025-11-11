import axios, { type AxiosResponse, type AxiosRequestConfig } from "axios";

const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36";

/**
 * 🧠 Safe wrapper fetch dengan header lengkap & auto handling
 */
export async function wajikFetch<T = any>(
  url: string,
  ref: string,
  axiosConfig?: AxiosRequestConfig,
  callback?: (response: AxiosResponse<T>) => void
): Promise<T> {
  try {
    const response = await axios(url, {
      timeout: 8000,
      maxRedirects: 3,
      ...axiosConfig,
      headers: {
        "User-Agent": userAgent,
        "Referer": ref,
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        ...axiosConfig?.headers,
      },
      validateStatus: (status) => status >= 200 && status < 400,
    });

    if (callback) callback(response);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 403) {
      console.warn(
        `⚠️ 403 Forbidden - Server mungkin blokir IP vercel / header tidak cocok`
      );
    } else if (status === 404) {
      console.warn(`❌ 404 Not Found - URL: ${url}`);
    } else {
      console.error(`❌ Fetch Error (${url}):`, error.message);
    }

    throw error;
  }
}

/**
 * 🧭 Dapatkan redirect final dari URL (HEAD request)
 */
export async function getFinalUrl(
  url: string,
  ref: string,
  axiosConfig?: AxiosRequestConfig
): Promise<string> {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      maxRedirects: 0,
      ...axiosConfig,
      headers: {
        "User-Agent": userAgent,
        "Referer": ref,
        ...axiosConfig?.headers,
      },
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const location = response.headers["location"];
    return location || url;
  } catch (error: any) {
    console.error(`⚠️ Gagal resolve URL: ${url} ->`, error.message);
    return url;
  }
}

/**
 * 🔁 Ambil semua redirect URL secara paralel + retry
 */
export async function getFinalUrls(
  urls: string[],
  ref: string,
  config?: {
    axiosConfig?: AxiosRequestConfig;
    retryConfig?: {
      retries?: number;
      delay?: number;
    };
  }
): Promise<string[]> {
  const { retries = 3, delay = 1000 } = config?.retryConfig || {};

  const retryRequest = async (url: string): Promise<string> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await getFinalUrl(url, ref, config?.axiosConfig);
      } catch (error: any) {
        console.warn(
          `⚠️ [${attempt}/${retries}] Gagal fetch ${url}: ${error.message}`
        );
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, delay));
        } else {
          return "";
        }
      }
    }
    return "";
  };

  const responses = await Promise.allSettled(urls.map((u) => retryRequest(u)));

  return responses.map((res) =>
    res.status === "fulfilled" && res.value ? res.value : ""
  );
}
