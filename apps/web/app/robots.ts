import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchr.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/history", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/account", "/history", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/account", "/history", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
