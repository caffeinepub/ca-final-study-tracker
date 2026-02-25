import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RevisionTopic, ExtendedActor } from '../lib/actorTypes';

export function useRevisionSchedule() {
  const { actor, isFetching } = useActor();

  return useQuery<RevisionTopic[]>({
    queryKey: ['revisionTopics'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const extActor = actor as unknown as ExtendedActor;
        return await extActor.getRevisionTopics();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
