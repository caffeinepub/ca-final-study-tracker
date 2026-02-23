import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useRevisionSuggestions() {
  const { actor, isFetching } = useActor();

  const query = useQuery<string[]>({
    queryKey: ['revisionSuggestions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRevisionSuggestions();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    suggestions: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
