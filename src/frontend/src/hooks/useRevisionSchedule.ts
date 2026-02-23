import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type RevisionTopic } from '../backend';

export function useRevisionSchedule() {
  const { actor, isFetching } = useActor();

  const query = useQuery<RevisionTopic[]>({
    queryKey: ['revisionSchedule'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRevisionSchedule();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    revisions: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
