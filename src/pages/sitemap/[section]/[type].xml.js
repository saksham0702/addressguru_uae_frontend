import { API_URL, SITE_URL } from "@/services/constants";
import { getSectionTypeSitemap } from "@/api/sitemap";

export default function CategorySitemap() {
  return null;
}

export async function getServerSideProps({ res, params }) {
  try {
    const { section, type } = params;
    const categorySlug = type.replace(".xml", "");

    const citiesData = await getSectionTypeSitemap(section, categorySlug);

    let cityEntries = "";

    if (Array.isArray(citiesData)) {
      cityEntries = citiesData
        .map((item) => {
          return `  <sitemap>
    <loc>${SITE_URL}/sitemap/${section}/${categorySlug}/${item.slug}.xml</loc>
    <lastmod>${item.last_updated || new Date().toISOString()}</lastmod>
    <adx:urlCount>${item.url_count || 1}</adx:urlCount>
    ${item.image ? `<adx:image>${API_URL}/${item.image}</adx:image>` : ""}
  </sitemap>`;
        })
        .join("\n");
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:adx="https://www.addressguru.ae/schemas/sitemap/1.0">
${cityEntries}
</sitemapindex>`;

    res.setHeader("Content-Type", "text/xml");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate");
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Error generating category sitemap:", error);
    res.statusCode = 500;
    res.end();
  }

  return { props: {} };
}
