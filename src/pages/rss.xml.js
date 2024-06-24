import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { sortedAndFilteredArticles } from "#utils";

const parser = new MarkdownIt();

export async function GET(context) {
  const articles = await sortedAndFilteredArticles();

  return rss({
    title: "Jacob's Blog",
    description:
      "Software engineer focused on building products with simplicity and accessibility in mind.",
    site: context.site,
    trailingSlash: false,
    items: articles.map(
      ({ slug, body, data: { title, description, datePublished } }) => ({
        title,
        description,
        pubDate: datePublished,
        link: `/blog/${slug}`,
        content: sanitizeHtml(parser.render(body), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
      }),
    ),
    customData: `<language>en-au</language>`,
  });
}
