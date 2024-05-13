import oldSlugify from "slugify";

export function slugify(string) {
  return oldSlugify(string, {
    lower: true
  })
}
