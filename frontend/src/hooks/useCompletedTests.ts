import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Test, ExtendedActor } from '../lib/actorTypes';

export function useCompletedTests() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Test[]>({
    queryKey: ['completedTests'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as unknown as ExtendedActor).getCompletedTests();
      } catch (err) {
        console.warn('useCompletedTests: could not fetch completed tests', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    completedTests: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
