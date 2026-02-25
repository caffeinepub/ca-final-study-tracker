import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RevisionTopic, ExtendedActor } from '../lib/actorTypes';

export function useRevisionSchedule() {
  const { actor, isFetching } = useActor();

  const query = useQuery<RevisionTopic[]>({
    queryKey: ['revisionSchedule'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as unknown as ExtendedActor).getRevisionSchedule();
      } catch (err) {
        console.warn('useRevisionSchedule: could not fetch revisions', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    revisions: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
