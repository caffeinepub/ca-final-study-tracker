import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Test } from '../backend';

export function useCompletedTests() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Test[]>({
    queryKey: ['completedTests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCompletedTests();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    completedTests: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
