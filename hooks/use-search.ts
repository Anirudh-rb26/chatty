"use client";

import { useState, useCallback, useRef } from "react";

interface SearchResult {
  id: string;
  name?: string;
  label?: string;
  displayName?: string;
  email?: string;
}

interface UseSearchOptions {
  debounceMs?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 300 } = options;
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout>(null);

  const search = useCallback(
    async (query: string, endpoint: string) => {
      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (!query.trim()) {
        setResults([]);
        return;
      }

      debounceTimer.current = setTimeout(async () => {
        try {
          setIsLoading(true);
          setError(null);

          const response = await fetch(`/api/search/${endpoint}?q=${encodeURIComponent(query)}`);
          if (!response.ok) throw new Error("Search failed");

          const data = await response.json();
          setResults(data.results || []);
        } catch (err) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, debounceMs);
    },
    [debounceMs]
  );

  return { results, isLoading, error, search };
}
