import { SITE_URL } from "@/services/constants";
import { getSitemap } from "@/api/sitemap";
export default function SitemapIndex() {
  return null;
}

export async function getServerSideProps({ res }) {
  const result = await getSitemap();

  const sitemapItems = result
    .map(
      (item) => `
      <sitemap>
        <loc><![CDATA[${SITE_URL}/sitemap/${item.section}-sitemap.xml]]></loc>
        <lastmod>${item.last_updated}</lastmod>
        <urlCount>${item.url_count}</urlCount>
      </sitemap>
    `,
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${SITE_URL}/sitemap.xsl?sitemap=root"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapItems}
</sitemapindex>`;

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=3600");
  res.write(sitemap);
  res.end();

  return { props: {} };
}
