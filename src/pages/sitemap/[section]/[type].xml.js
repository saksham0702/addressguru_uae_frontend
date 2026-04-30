// pages/sitemap/[section]/[type].xml.js
import { SITE_URL, API_URL } from "@/services/constants";
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
        .map(
          (item) =>
            // image and urlCount stored as comment — Google-safe, XSL-parseable
            `  <sitemap>
    <loc>${SITE_URL}/sitemap/${section}/${categorySlug}/${item.slug}.xml</loc>
    <lastmod>${item.last_updated || new Date().toISOString()}</lastmod>
    <!-- urlCount:${item.url_count || 1} image:${item.image ? `${API_URL}/${item.image}` : ""} -->
  </sitemap>`,
        )
        .join("\n");
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cityEntries}
</sitemapindex>`;

    res.setHeader("Content-Type", "text/xml; charset=utf-8");
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