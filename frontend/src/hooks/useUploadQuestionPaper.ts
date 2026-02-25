import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor } from '../lib/actorTypes';

export function useUploadQuestionPaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { name: string; pdfBlob: Uint8Array }>({
    mutationFn: async ({ name, pdfBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as unknown as ExtendedActor).uploadQuestionPaper(name, pdfBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionPapers'] });
    },
  });
}
