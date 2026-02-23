import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type StudySession } from '../backend';

export function useStudySessions() {
  const { actor, isFetching } = useActor();

  const query = useQuery<StudySession[]>({
    queryKey: ['studySessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudySessions();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    sessions: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
