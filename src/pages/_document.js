import { GOOGLE_MEASUREMENT_ID } from "@/services/constants";
import { Html, Head, Main, NextScript } from "next/document";

// ─── GA4 Measurement ID ────────────────────────────────────────────────────────
// TODO: Replace "G-XXXXXXXXXX" with your real GA4 Measurement ID from:
// Google Analytics → Admin → Data Streams → Web → Measurement ID


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ── Charset & Encoding ── */}
        <meta charSet="utf-8" />

        {/* ── Google Search Console Verification ── */}
        {/* TODO: Replace the content value below with your GSC verification code.
            Get it from: Google Search Console → Add Property → HTML tag method */}
        <meta
          name="google-site-verification"
          content="XX8J16olB1Iaur-Znsu1jeJeli8ysLKtDfbXCtW46mc"
        />

        {/* ── Google Analytics 4 (gtag.js) ── */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* ── Geo / Region Tags (UAE) ── */}
        <meta name="geo.region" content="AE" />
        <meta name="geo.placename" content="United Arab Emirates" />
        <meta name="geo.position" content="25.2048;55.2708" />
        <meta name="ICBM" content="25.2048, 55.2708" />

        {/* ── Robots default (per-page can override) ── */}
        {/* <meta name="robots" content="index, follow" /> */}

        {/* ── Google Fonts: Poppins ── */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
