import { SITE_URL } from "@/services/constants";
import { getSectionTypeSitemap } from "@/api/sitemap";

function normalizeSitemapParam(param) {
  return param?.replace(/\.xml$/, "");
}

export default function CategorySitemap() {
  return null;
}

const section = "listing";

export async function getServerSideProps({ res, params }) {
  // Remove .xml from category
  const category = normalizeSitemapParam(params.category);

  const cities = await getSectionTypeSitemap(section, category, params.city);

  const items = cities
    .map(
      (city) => `
  <sitemap>
    <loc>${SITE_URL}/sitemap/listing/${category}/${city.slug}.xml</loc>
    <lastmod>${city.last_updated}</lastmod>
    <urlCount>${city.url_count}</urlCount>
  </sitemap>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.write(xml);
  res.end();

  return { props: {} };
}
