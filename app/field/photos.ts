export const photos = Array.from({ length: 30 }).map((_, i) => ({
  id: String(i + 1),
  src: `/photos/${i + 1}.jpg`,
}));
