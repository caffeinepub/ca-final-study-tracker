import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Test, ExtendedActor } from '../lib/actorTypes';

export function useTests() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Test[]>({
    queryKey: ['tests'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as unknown as ExtendedActor).getTests();
      } catch (err) {
        console.warn('useTests: could not fetch tests', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    tests: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
