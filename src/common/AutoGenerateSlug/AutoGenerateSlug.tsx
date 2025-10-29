  export const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // replace spaces with -
      .replace(/-+/g, "-"); // collapse multiple -
