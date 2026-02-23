import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Chapter } from '../backend';

export function useArchivedChapters() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Chapter[]>({
    queryKey: ['archivedChapters'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArchivedChapters();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    archivedChapters: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
