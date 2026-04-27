import { SITE_URL } from "@/services/constants";
import { getCityListings } from "@/api/sitemap";

export default function CategorySitemap() {
  return null;
}

export async function getServerSideProps({ res, params }) {
  const { category, city } = params;
  const citySlug = city.replace('.xml', '');
  
  const listings = await getCityListings("jobs", category, citySlug);

  const items = listings
    .map(
      (listing) => `
  <url>
    <loc>${SITE_URL}/jobs/${listing.slug}</loc>
    <lastmod>${listing.last_updated}</lastmod>
  </url>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.write(xml);
  res.end();

  return { props: {} };
}
