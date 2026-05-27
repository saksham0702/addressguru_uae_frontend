import { useRouter } from "next/router";
import { resolveSearch } from "@/api/search";

export const useSearchHandler = () => {
  const router = useRouter();
  const handleSearch = async (query, city) => {
    if (!query?.trim()) return;
    const trimmedQuery = query.trim();
    try {
      // First attempt to resolve the intent using the specialized API
      const res = await resolveSearch(trimmedQuery);
      if (res && res.redirectUrl) {
        // Log the success or perform any analytics tracking here if needed
        router.push(res.redirectUrl);
        return true;
      }
      // Fallback: If no specialized intent is found, go to the generic search results page
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      return true;
    } catch (error) {
      console.error("Search resolution failed:", error);
      // Resilience: even if the API fails, still provide results via the search page
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      return false;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion && suggestion.redirectUrl) {
      router.push(suggestion.redirectUrl);
      return true;
    }
    return false;
  };

  return {
    handleSearch,
    handleSuggestionClick,
  };
};
