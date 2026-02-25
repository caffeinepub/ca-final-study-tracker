import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { StudySession, ExtendedActor } from '../lib/actorTypes';

export function useErrorLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<StudySession[]>({
    queryKey: ['errorLogs'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const extActor = actor as unknown as ExtendedActor;
        return await extActor.getSessionsWithErrors();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
