export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    sitemap: `${process.env.BASE_URL}/sitemap.xml`,
  };
}
