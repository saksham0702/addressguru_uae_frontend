import { API_URL, SITE_URL } from "@/services/constants";
import { getCityListings } from "@/api/sitemap";

export default function CitySitemap() {
  return null;
}

export async function getServerSideProps({ res, params }) {
  try {
    const { section, type, city } = params;
    const categorySlug = type;
    const citySlug = city.replace(".xml", "");

    const listingsData = await getCityListings(section, categorySlug, citySlug);

    let listingEntries = "";

    if (Array.isArray(listingsData)) {
      listingEntries = listingsData
        .map((listing) => {
          return `  <url>
    <loc><![CDATA[${SITE_URL}/${listing.slug}]]></loc>
    <lastmod>${listing.last_updated || new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    ${listing.image
              ? `<image:image>
      <image:loc>${API_URL}/${listing.image}</image:loc>
    </image:image>`
              : ""
            }
    <adx:urlCount>1</adx:urlCount>
  </url>`;
        })
        .join("\n");
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:adx="https://www.addressguru.ae/schemas/sitemap/1.0">
${listingEntries}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate");
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Error generating city sitemap:", error);
    res.statusCode = 500;
    res.end();
  }

  return { props: {} };
}
