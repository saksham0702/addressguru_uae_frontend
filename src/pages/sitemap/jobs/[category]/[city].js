import { SITE_URL } from "@/services/constants";
import { getSectionTypeSitemap } from "@/api/sitemap";

export default function CategorySitemap() {
  return null;
}

export async function getServerSideProps({ res, params }) {
  const { category } = params;
  const cities = await getSectionTypeSitemap("jobs", category);

  const items = cities
    .map(
      (city) => `
  <sitemap>
    <loc>${SITE_URL}/sitemap/jobs/${category}/${city.slug}.xml</loc>
    <lastmod>${city.last_updated}</lastmod>
  </sitemap>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.write(xml);
  res.end();

  return { props: {} };
}
