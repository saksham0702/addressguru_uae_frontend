import { SITE_URL } from "@/services/constants";
import { getSectionSitemap } from "@/api/sitemap";

export default function BlogsSitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    const blogsData = await getSectionSitemap("blogs");
    let blogEntries = "";

    if (Array.isArray(blogsData)) {
      blogEntries = blogsData
        .map((blog) => {
          return `  <url>
    <loc>${SITE_URL}/blogs/${blog.slug}</loc>
    <lastmod>${blog.last_updated || new Date().toISOString()}</lastmod>
  </url>`;
        })
        .join("\n");
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogEntries}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate");
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Error generating blogs sitemap:", error);
    res.statusCode = 500;
    res.end();
  }

  return { props: {} };
}
