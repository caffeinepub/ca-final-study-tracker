import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useSuggestedSubjects() {
  const { actor, isFetching } = useActor();

  const query = useQuery<string[]>({
    queryKey: ['suggestedSubjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSuggestedSubjects();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    suggestedSubjects: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
