import { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CA_FINAL_SUBJECTS } from '../utils/caFinalData';

const SEED_TIMEOUT_MS = 60_000; // 60 seconds max

export interface SeedDataState {
  isSeeding: boolean;
  seedError: string | null;
  retry: () => void;
}

/**
 * Idempotent seeding hook: seeds CA Final subjects and chapters into the backend
 * only if no subjects exist yet. Exposes isSeeding and seedError for UI feedback.
 */
export function useSeedData(): SeedDataState {
  const { actor, isFetching } = useActor();
  const seededRef = useRef(false);
  const queryClient = useQueryClient();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);
  const retryCountRef = useRef(0);

  const runSeed = useCallback(async () => {
    if (!actor) return;

    setIsSeeding(true);
    setSeedError(null);

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Seeding timed out after 60 seconds')), SEED_TIMEOUT_MS)
    );

    try {
      await Promise.race([
        (async () => {
          // Check if subjects already exist — if so, skip seeding
          const existing = await actor.getSubjects();
          if (existing && existing.length > 0) {
            seededRef.current = true;
            return;
          }

          // Target date: May 1, 2028 in nanoseconds
          const targetDate = BigInt(new Date('2028-05-01').getTime()) * BigInt(1_000_000);

          // Seed all subjects in parallel
          await Promise.all(
            CA_FINAL_SUBJECTS.map(async (subjectData) => {
              const subject = {
                name: subjectData.name,
                totalTopics: BigInt(subjectData.chapters.length),
                completedTopics: BigInt(0),
                targetCompletionDate: targetDate,
              };

              await actor.addSubject(subject);

              // Add chapters for this subject in parallel (Paper 4 has no chapters)
              if (subjectData.chapters.length > 0) {
                await Promise.all(
                  subjectData.chapters.map((chapterName) =>
                    actor.addChapter({
                      name: chapterName,
                      subjectName: subjectData.name,
                      totalTopics: BigInt(10),
                      completedTopics: BigInt(0),
                      notesPdf: undefined,
                    })
                  )
                );
              }
            })
          );

          // Invalidate queries so UI refreshes with new data
          await queryClient.invalidateQueries({ queryKey: ['subjects'] });
          await queryClient.invalidateQueries({ queryKey: ['chapters'] });
          await queryClient.refetchQueries({ queryKey: ['subjects'] });

          seededRef.current = true;
        })(),
        timeoutPromise,
      ]);

      setIsSeeding(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to set up subjects. Please try again.';

      // If it's an authorization error, silently skip (user not logged in yet)
      if (
        message.toLowerCase().includes('unauthorized') ||
        message.toLowerCase().includes('anonymous')
      ) {
        setIsSeeding(false);
        return;
      }

      console.warn('useSeedData: seeding failed:', err);
      setSeedError(message);
      setIsSeeding(false);
    }
  }, [actor, queryClient]);

  useEffect(() => {
    if (!actor || isFetching || seededRef.current || isSeeding) return;
    runSeed();
  }, [actor, isFetching, isSeeding, runSeed]);

  const retry = useCallback(() => {
    seededRef.current = false;
    retryCountRef.current += 1;
    setSeedError(null);
    runSeed();
  }, [runSeed]);

  return { isSeeding, seedError, retry };
}
