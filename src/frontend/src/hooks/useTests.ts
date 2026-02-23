import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Test } from '../backend';

export function useTests() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Test[]>({
    queryKey: ['tests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTests();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    tests: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
