import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor } from '../lib/actorTypes';

export function useSuggestedSubjects() {
  const { actor, isFetching } = useActor();

  const query = useQuery<string[]>({
    queryKey: ['suggestedSubjects'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as unknown as ExtendedActor).getSuggestedSubjects();
      } catch (err) {
        console.warn('useSuggestedSubjects: could not fetch suggested subjects', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    suggestedSubjects: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
