import { SITE_URL } from "@/services/constants";
// pages/sitemap/marketplace-sitemap.xml.js
import { getSectionSitemap } from "@/api/sitemap";

export default function MarketplaceSitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Fetch marketplace data from your API
    const marketplaceData = await getSectionSitemap("marketplace");

    // Generate XML entries for each marketplace item
    const marketplaceEntries = marketplaceData?.map((item) => {
        return `  <url>
    <loc>${SITE_URL}/marketplace/${item}</loc>
    <lastmod>${item.updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      })
      .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${SITE_URL}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${marketplaceEntries}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate",
    );
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Error generating marketplace sitemap:", error);
    res.statusCode = 500;
    res.end();
  }

  return {
    props: {},
  };
}
