import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor } from '../lib/actorTypes';

export function usePdfBlobs(chapterId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Uint8Array | null>({
    queryKey: ['pdfBlobs', chapterId],
    queryFn: async () => {
      if (!actor || !chapterId) return null;
      try {
        const extActor = actor as unknown as ExtendedActor;
        const chapters = await extActor.getChapters();
        const chapter = chapters.find((c) => c.chapterId === chapterId);
        return chapter?.notesPdf ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!chapterId,
  });
}
