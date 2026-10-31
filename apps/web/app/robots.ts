import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://switchrx.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og"],
        disallow: ["/account", "/history"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/api/og"],
        disallow: ["/account", "/history"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/api/og"],
        disallow: ["/account", "/history"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
