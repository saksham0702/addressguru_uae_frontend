/**
 * SEOHead — Reusable SEO <Head> component for AddressGuru UAE
 *
 * Usage:
 *   <SEOHead
 *     title="Page Title | AddressGuru UAE"
 *     description="Page description (max 160 chars)"
 *     canonical="https://addressguru.ae/some-page"
 *     ogImage="https://addressguru.ae/seo/some-image.jpg"
 *     schema={{ "@context": "https://schema.org", ... }}
 *   />
 */

import Head from "next/head";

const SITE_NAME = "AddressGuru UAE";
const SITE_URL = "https://addressguru.ae";
const DEFAULT_OG_IMAGE = `${SITE_URL}/home-og.jpg`;
const TWITTER_HANDLE = "@AddressGuruUAE"; // TODO: update with real handle

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  schema = null,
  noIndex = false,
}) {
  const fullTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : SITE_NAME;

  const safeDescription = description
    ? description.substring(0, 160)
    : `Find top local businesses, services, jobs, properties and marketplace listings in UAE. Discover verified listings with AddressGuru.`;

  const canonicalUrl = canonical || SITE_URL;
  const ogImageUrl = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Head>
      {/* ── Primary Meta ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={safeDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* ── Robots ── */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* ── Canonical ── */}
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Open Graph ── */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_AE" />

      {/* ── Twitter Cards ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* ── JSON-LD Structured Data ── */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
}
