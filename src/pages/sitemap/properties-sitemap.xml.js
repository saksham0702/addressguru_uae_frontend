import { API_URL, SITE_URL } from "@/services/constants";
// pages/sitemap/properties-sitemap.xml.js
import { getSectionSitemap } from "@/api/sitemap";

export default function PropertiesSitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    const marketplaceData = await getSectionSitemap("properties");

    const marketplaceEntries = marketplaceData
      .map((item) => {
        return `  <sitemap>
    <loc>${SITE_URL}/sitemap/properties/${item.slug}.xml</loc>
    <lastmod>${item.last_updated || new Date().toISOString()}</lastmod>
    <adx:urlCount>${item.url_count || 0}</adx:urlCount>
  </sitemap>`;
      })
      .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:adx="https://www.addressguru.ae/schemas/sitemap/1.0">
${marketplaceEntries}
</sitemapindex>`;

    res.setHeader("Content-Type", "text/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate",
    );
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Error generating properties sitemap:", error);
    res.statusCode = 500;
    res.end();
  }

  return {
    props: {},
  };
}
