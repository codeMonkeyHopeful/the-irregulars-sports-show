const photoCount = 25;

export const photos = Array.from({ length: photoCount }, (_, i) => ({
  id: `${i + 1}.jpg`,
  src: `/photos/${i + 1}.jpg`,
}));
