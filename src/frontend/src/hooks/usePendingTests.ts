import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Test } from '../backend';

export function usePendingTests() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Test[]>({
    queryKey: ['pendingTests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingTests();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    pendingTests: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
