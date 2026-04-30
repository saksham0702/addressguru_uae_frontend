// pages/sitemap/jobs-sitemap.xml.js
import { SITE_URL } from "@/services/constants";
import { getSectionSitemap } from "@/api/sitemap";

export default function JobsSitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    const jobsData = await getSectionSitemap("jobs");

    let jobEntries = "";

    if (Array.isArray(jobsData)) {
      jobEntries = jobsData
        .map(
          (job) =>
            // urlCount as comment — valid XML, ignored by Google, readable by your XSL
            `  <sitemap>
    <loc>${SITE_URL}/sitemap/jobs/${job.slug}.xml</loc>
    <lastmod>${job.last_updated}</lastmod>
    <!-- urlCount:${job.url_count} -->
  </sitemap>`,
        )
        .join("\n");
    } else if (jobsData?.section) {
      jobEntries = `  <sitemap>
    <loc>${SITE_URL}/jobs/${jobsData.section}</loc>
    <lastmod>${jobsData.last_updated}</lastmod>
  </sitemap>`;
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${jobEntries}
</sitemapindex>`;

    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate");
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Error generating jobs sitemap:", error);
    res.statusCode = 500;
    res.end();
  }

  return { props: {} };
}