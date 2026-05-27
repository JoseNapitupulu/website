import type { MetadataRoute } from "next";

const siteUrl = "https://laporitdel.ifs25026.fun";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/laporan", "/tracking", "/developer"];

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8
  }));
}