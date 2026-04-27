import { SITE_URL } from "@/services/constants";
// pages/sitemap/listings-sitemap.xml.js
import { getSectionSitemap } from "@/api/sitemap";

export default function ListingsSitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Fetch listings sitemap data
    const listingsData = await getSectionSitemap("listing");
    console.log("listingsData", listingsData);
    // Expected structure:
    // [{ section, last_updated, url_count }] OR single object

    let listingEntries = "";

    if (Array.isArray(listingsData)) {
      listingEntries = listingsData
        .map((listing) => {
          return `  <sitemap>
    <loc><![CDATA[${SITE_URL}/sitemap/listing/${listing.slug}.xml]]></loc>
    <lastmod>${listing.last_updated}</lastmod>
  </sitemap>`;
        })
        .join("\n");
    } else if (listingsData && listingsData.section) {
      listingEntries = `  <sitemap>
    <loc><![CDATA[${SITE_URL}/listing/${listingsData.section}]]></loc>
    <lastmod>${listingsData.last_updated}</lastmod>
  </sitemap>`;
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${listingEntries}
</sitemapindex>`;

    res.setHeader("Content-Type", "text/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate",
    );
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Error generating listings sitemap:", error);
    res.statusCode = 500;
    res.end();
  }

  return {
    props: {},
  };
}
