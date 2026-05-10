const baseUrl = 'https://irregulas.ryan-jasinski.com';

export default function sitemap() {
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/episodes`, lastModified: new Date() },
    { url: `${baseUrl}/episodes/latest`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
  ];
}
