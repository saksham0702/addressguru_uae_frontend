import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UTMTracker() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { utm_source, utm_medium, utm_campaign, utm_term, utm_content } =
      router.query;

    if (utm_source) {
      const utmData = {
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
      };

      document.cookie = `utm_data=${encodeURIComponent(
        JSON.stringify(utmData),
      )}; path=/; max-age=2592000`;
    }
  }, [router.isReady, router?.query]);

  return null;
}
