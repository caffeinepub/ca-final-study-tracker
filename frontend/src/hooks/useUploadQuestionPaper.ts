import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor } from '../lib/actorTypes';

interface UploadPaperInput {
  name: string;
  pdfBlob: Uint8Array;
}

export function useUploadQuestionPaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, pdfBlob }: UploadPaperInput) => {
      if (!actor) throw new Error('Actor not available');
      const extActor = actor as unknown as ExtendedActor;
      await extActor.uploadQuestionPaper({
        name,
        pdfBlob,
        uploadDate: BigInt(Date.now()) * 1_000_000n,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionPapers'] });
    },
  });
}
