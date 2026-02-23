import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function usePdfBlobs(chapterName: string) {
  const { actor, isFetching } = useActor();

  const query = useQuery<Uint8Array | null>({
    queryKey: ['pdfBlobs', chapterName],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPdfBlobs(chapterName);
    },
    enabled: !!actor && !isFetching && !!chapterName,
  });

  return {
    pdfBlob: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
