import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor } from '../lib/actorTypes';

export function usePdfBlobs(chapterName: string | null) {
  const { actor, isFetching } = useActor();

  const query = useQuery<Uint8Array | null>({
    queryKey: ['pdfBlobs', chapterName],
    queryFn: async () => {
      if (!actor || !chapterName) return null;
      try {
        return await (actor as unknown as ExtendedActor).getPdfBlobs(chapterName);
      } catch (err) {
        console.warn('usePdfBlobs: could not fetch PDF', err);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!chapterName,
    retry: false,
  });

  return {
    pdfData: query.data ?? null,
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
