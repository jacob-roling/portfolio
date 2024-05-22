import { getCollection } from "astro:content";
import oldSlugify from "slugify";

export function slugify(string) {
  return oldSlugify(string, {
    lower: true,
  });
}

export const monthFormatter = new Intl.DateTimeFormat("en-AU", {
  year: "numeric",
  month: "short",
});

export const dayFormatter = new Intl.DateTimeFormat("en-AU", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export async function sortedAndFilteredArticles() {
  return (
    await getCollection("articles", ({ data }) => data.draft !== true)
  ).sort(
    (a, b) => b.data.datePublished.getTime() - a.data.datePublished.getTime()
  );
}

export async function trycatch(promise) {
  try {
    return [await promise, null];
  } catch (error) {
    return [null, error];
  }
}

export function importStatic(modulePath) {
  if (import.meta.env.DEV) {
    return import(/* @vite-ignore */ `${modulePath}`);
  } else {
    return import(/* @vite-ignore */ modulePath);
  }
}

export function recalculateHeaderSpacing() {
  const height =
    Math.floor(
      document.getElementById("header").getBoundingClientRect().height
    ) + "px";
  document.documentElement.style.setProperty("--spacing-header", height);
}
