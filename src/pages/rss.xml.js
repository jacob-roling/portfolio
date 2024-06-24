import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { sortedAndFilteredArticles } from "#utils";

const parser = new MarkdownIt();

export async function GET(context) {
  const articles = await sortedAndFilteredArticles();

  return rss({
    title: "Jacob's Blog",
<<<<<<< HEAD
    description: "A humble Astronaut's guide to the stars",
=======
    description:
      "Software engineer focused on building products with simplicity and accessibility in mind.",
>>>>>>> 40dd981 (chore: savepoint)
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
<<<<<<< HEAD
      })
=======
      }),
>>>>>>> 40dd981 (chore: savepoint)
    ),
    customData: `<language>en-au</language>`,
  });
}
