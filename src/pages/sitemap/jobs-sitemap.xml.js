import { SITE_URL } from "@/services/constants";
// pages/sitemap/jobs-sitemap.xml.js
import { getSectionSitemap } from "@/api/sitemap";
export default function JobsSitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Fetch jobs data from your API
    const jobsData = await getSectionSitemap("jobs");
    // jobsData structure: { url_count, section, last_updated }
    // or it could be an array of such objects
    let jobEntries = "";
    // Check if jobsData is an array or single object
    if (Array.isArray(jobsData)) {
      jobEntries = jobsData
        .map((job) => {
          return `  <url>
    <loc><![CDATA[${SITE_URL}/sitemap/jobs/${job.slug}-sitemap.xml]]></loc>
    <lastmod>${job.last_updated}</lastmod>
    <urlCount>${job.url_count}</urlCount>
  </url>`;
        })
        .join("\n");
    } else if (jobsData && jobsData.section) {
      // Single object
      jobEntries = ` <url>
    <loc>${SITE_URL}/jobs/${jobsData.section}</loc>
    <lastmod>${jobsData.last_updated}</lastmod>
  </url>`;
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${SITE_URL}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${jobEntries}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate",
    );
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error("Error generating jobs sitemap:", error);
    res.statusCode = 500;
    res.end();
  }

  return {
    props: {},
  };
}
