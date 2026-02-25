import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor } from '../lib/actorTypes';

export function useRevisionSuggestions() {
  const { actor, isFetching } = useActor();

  const query = useQuery<string[]>({
    queryKey: ['revisionSuggestions'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as unknown as ExtendedActor).getRevisionSuggestions();
      } catch (err) {
        console.warn('useRevisionSuggestions: could not fetch suggestions', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    suggestions: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
