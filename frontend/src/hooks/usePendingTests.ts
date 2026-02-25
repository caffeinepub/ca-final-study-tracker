import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Test, ExtendedActor } from '../lib/actorTypes';

export function usePendingTests() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Test[]>({
    queryKey: ['pendingTests'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as unknown as ExtendedActor).getPendingTests();
      } catch (err) {
        console.warn('usePendingTests: could not fetch pending tests', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    pendingTests: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
