// pages/[slug]/[city].jsx
// NO "use client" here — that's App Router only. Pages Router doesn't use it.

import axios from "axios";
import { get_seo_data } from "@/api/seoApi";
import SearchResults from "@/components/SeeDetails/SearchResult";

export async function getServerSideProps(context) {
  const { slug, city } = context.params;

  let ssrListings = [];
  let ssrPageData = null;
  let ssrSeoContent = null;
  let ssrFilters = null;

  try {
    const res = await axios.get(
      `https://addressguru.ae/api/business-listing/get-listing-by-category-and-city/${slug}/${city}?page=1&limit=10`,
    );
    // const res = [];
    const data = res?.data?.data;
    ssrListings = data?.listings || [];
    ssrPageData = data?.pagination || null;
  } catch (err) {
    console.error("SSR listings fetch failed:", err.message);
  }

  try {
    ssrSeoContent = await get_seo_data(slug, city);
  } catch (err) {
    console.error("SSR seo fetch failed:", err.message);
  }

  // ✅ ADD THIS BLOCK (filters API)
  try {
    const res = await axios.get(
      `https://addressguru.ae/api/business-listing/features/${slug}`,
    );

    const data = res?.data?.data;

    ssrFilters = {
      facilities: data?.features?.facilities || [],
      services: data?.features?.services || [],
      courses: data?.features?.courses || [],
      paymentModes: data?.payment_modes || [],
    };
  } catch (err) {
    console.error("SSR filters fetch failed:", err.message);
  }

  return {
    props: {
      ssrListings,
      ssrPageData,
      ssrSeoContent,
      ssrFilters,
      ssrSlug: slug,
      ssrCity: city,
    },
  };
}

export default function Page(props) {
  return <SearchResults {...props} />;
}
