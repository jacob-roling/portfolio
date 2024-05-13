import oldSlugify from "slugify";

export function slugify(string) {
  return oldSlugify(string, {
    lower: true
  })
}

export const monthFormatter = new Intl.DateTimeFormat('en-AU', {
  year: 'numeric',
  month: 'short'
});

export const dayFormatter = new Intl.DateTimeFormat('en-AU', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});