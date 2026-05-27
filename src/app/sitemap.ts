import type { MetadataRoute } from "next";

const siteUrl = "https://laporitdel.ifs25026.fun";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/laporan", "/tracking", "/developer"];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8
  }));
}