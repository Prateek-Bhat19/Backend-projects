import axios from "axios";
import * as cheerio from "cheerio";

export interface LinkMetadata {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export async function extractMetadata(url: string): Promise<LinkMetadata> {
  const response = await axios.get(url, {
    timeout: 10000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; SmartLinkBot/1.0; +https://example.com)",
      Accept: "text/html"
    },
    responseType: "text",
    transformResponse: (res) => res // prevent axios from touching it
  });

  const html = response.data;

  let $: cheerio.CheerioAPI;

  try {
    $ = cheerio.load(html, {
      xmlMode: false,
    //   decodeEntities: true
    });
  } catch (err) {
    // 🔴 DO NOT crash worker
    console.warn("HTML parse failed, returning minimal metadata");

    return { url };
  }

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").first().text() ||
    undefined;

  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    undefined;

  const image =
    $('meta[property="og:image"]').attr("content") ||
    undefined;

  return {
    url,
    title,
    description,
    image
  };
}
