import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Chapter, ExtendedActor } from '../lib/actorTypes';

export function useChapters(subjectName?: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Chapter[]>({
    queryKey: ['chapters'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const extActor = actor as unknown as ExtendedActor;
        return await extActor.getChapters();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    select: subjectName ? (data) => data.filter((c) => c.subjectName === subjectName) : undefined,
  });
}

export function useInvalidateChapters() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['chapters'] });
}
