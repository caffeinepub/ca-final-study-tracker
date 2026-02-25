import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { StudySession } from '../lib/actorTypes';
import type { ExtendedActor } from '../lib/actorTypes';

export function useStudySessions() {
  const { actor, isFetching } = useActor();

  const query = useQuery<StudySession[]>({
    queryKey: ['studySessions'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as unknown as ExtendedActor).getStudySessions();
      } catch (err) {
        console.warn('useStudySessions: could not fetch sessions', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    sessions: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
