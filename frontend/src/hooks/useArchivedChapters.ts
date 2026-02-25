import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Chapter, ExtendedActor } from '../lib/actorTypes';

export function useArchivedChapters() {
  const { actor, isFetching } = useActor();

  return useQuery<Chapter[]>({
    queryKey: ['archivedChapters'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const extActor = actor as unknown as ExtendedActor;
        const chapters = await extActor.getChapters();
        return chapters.filter((c) => c.isCompleted);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
