import Head from "next/head";

export default function SEO({ title, description, image, url, schema }) {
  return (
    <Head>
      {/* Meta Title */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* OG Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Structured Data Schema */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
}
