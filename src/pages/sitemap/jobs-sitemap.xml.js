import { API_URL, SITE_URL } from "@/services/constants";
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
          return `  <sitemap>
    <loc>${SITE_URL}/sitemap/jobs/${job.slug}.xml</loc>
    <lastmod>${job.last_updated}</lastmod>
    <adx:urlCount>${job.url_count}</adx:urlCount>
  </sitemap>`;
        })
        .join("\n");
    } else if (jobsData && jobsData.section) {
      // Single object
      jobEntries = ` <sitemap>
    <loc>${SITE_URL}/jobs/${jobsData.section}</loc>
    <lastmod>${jobsData.last_updated}</lastmod>
  </sitemap>`;
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:adx="https://www.addressguru.ae/schemas/sitemap/1.0">
${jobEntries}
</sitemapindex>`;

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
