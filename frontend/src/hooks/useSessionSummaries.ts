import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor } from '../lib/actorTypes';

export interface SessionSummaryEntry {
  key: string;
  value: { content: string };
}

export function useSessionSummaries() {
  const { actor, isFetching } = useActor();

  const query = useQuery<SessionSummaryEntry[]>({
    queryKey: ['sessionSummaries'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as unknown as ExtendedActor).getSessionSummaries();
      } catch (err) {
        console.warn('useSessionSummaries: could not fetch summaries', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    summaries: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
