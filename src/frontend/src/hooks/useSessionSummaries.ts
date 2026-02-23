import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useSessionSummaries() {
  const { actor, isFetching } = useActor();

  const query = useQuery<string[]>({
    queryKey: ['sessionSummaries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSessionSummaries();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    summaries: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
