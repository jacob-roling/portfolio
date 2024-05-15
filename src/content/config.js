import { defineCollection, z } from "astro:content";

const article = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      draft: z.boolean().optional(),
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      image: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
      datePublished: z.date(),
    }),
});

export const collections = {
  article,
};
