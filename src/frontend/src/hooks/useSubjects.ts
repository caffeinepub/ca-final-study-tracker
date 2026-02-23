import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Subject } from '../backend';

export function useSubjects() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSubjects();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    subjects: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
