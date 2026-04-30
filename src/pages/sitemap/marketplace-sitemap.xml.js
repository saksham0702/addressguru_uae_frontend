// pages/sitemap/marketplace-sitemap.xml.js
import { SITE_URL } from "@/services/constants";
import { getSectionSitemap } from "@/api/sitemap";

export default function MarketplaceSitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    const marketplaceData = await getSectionSitemap("marketplace");

    const marketplaceEntries = marketplaceData
      ?.map(
        (item) =>
          `  <sitemap>
    <loc>${SITE_URL}/sitemap/marketplace/${item.slug}.xml</loc>
    <lastmod>${item.last_updated || new Date().toISOString()}</lastmod>
    <!-- urlCount:${item.url_count} -->
  </sitemap>`,
      )
      .join("\n") ?? "";

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${marketplaceEntries}
</sitemapindex>`;

    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate");
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Error generating marketplace sitemap:", error);
    res.statusCode = 500;
    res.end();
  }

  return { props: {} };
}