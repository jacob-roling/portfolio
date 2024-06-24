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
  const { getCollection } = await import("astro:content");

  return (
<<<<<<< HEAD
    await getCollection("articles", ({ data }) => data.draft !== true)
  ).sort(
    (a, b) => b.data.datePublished.getTime() - a.data.datePublished.getTime()
=======
    await getCollection(
      "articles",
      ({ data }) => data.draft !== import.meta.env.PROD,
    )
  ).sort(
    (a, b) => b.data.datePublished.getTime() - a.data.datePublished.getTime(),
>>>>>>> 40dd981 (chore: savepoint)
  );
}

export async function trycatch(promise) {
  try {
    return [await promise, null];
  } catch (error) {
    return [null, error];
  }
}

export async function importStatic(modulePath) {
  if (import.meta.env.DEV) {
    return import(/* @vite-ignore */ `${modulePath}`);
  } else {
    return import(/* @vite-ignore */ modulePath);
  }
}

export function calculateHeaderSpacing() {
  const height = document
    .getElementById("header")
    .getBoundingClientRect().height;
  document.documentElement.style.setProperty(
    "--spacing-header",
<<<<<<< HEAD
    `${Math.floor(height)}px`
=======
    `${Math.floor(height)}px`,
>>>>>>> 40dd981 (chore: savepoint)
  );
  return height;
}
