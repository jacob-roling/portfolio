import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
// import tailwindcss from '@tailwindcss/vite';
import netlify from "@astrojs/netlify";
import partytown from "@astrojs/partytown";
import playformCompress from "@playform/compress";
import playformInline from "@playform/inline";
// import node from "@astrojs/node";
import pagefind from "./src/plugins/pagefind";
// import rehypeWrap from "rehype-wrap";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import remarkEmoji from "remark-emoji";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  site: "https://jacobroling.dev",
  trailingSlash: "never",
  devToolbar: {
    enabled: false,
  },
  markdown: {
    remarkPlugins: [remarkEmoji, remarkMath],
    rehypePlugins: [rehypeAccessibleEmojis, rehypeKatex],
  },
  vite: {
    // plugins: [tailwindcss()]
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
      },
    },
  },
  integrations: [
    icon(),
    pagefind(),
    partytown({
      config: { debug: import.meta.env.DEV },
    }),
    sitemap(),
    playformInline(),
    playformCompress({
      CSS: false,
    }),
  ],
  redirects: {
    "/blog": "/blog/page/1",
    "/blog/page": "/blog/page/1",
    "/blog/tag": "/blog/page/1",
    "/blog/tag/[tag]": "/blog/tag/[tag]/page/1",
    "/blog/tag/[tag]/page": "/blog/tag/[tag]/page/1",
  },
  adapter: netlify(),
});
