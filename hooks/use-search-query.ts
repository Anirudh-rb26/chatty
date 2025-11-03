import { useQuery } from "@tanstack/react-query";

interface SearchResult {
  id: string;
  name?: string;
  label?: string;
  displayName?: string;
  email?: string;
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ["suggestions", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      return data.results || [];
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSearchPeople(query: string) {
  return useQuery({
    queryKey: ["people", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await fetch(`/api/search/people?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      return data.results || [];
    },
    enabled: query.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
