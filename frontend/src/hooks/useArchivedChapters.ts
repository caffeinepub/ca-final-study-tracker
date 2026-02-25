import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Chapter, ExtendedActor } from '../lib/actorTypes';

export function useArchivedChapters() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Chapter[]>({
    queryKey: ['archivedChapters'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as unknown as ExtendedActor).getArchivedChapters();
      } catch (err) {
        console.warn('useArchivedChapters: could not fetch archived chapters', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    archivedChapters: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
