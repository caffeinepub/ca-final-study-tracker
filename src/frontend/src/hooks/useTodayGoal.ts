import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Goal } from '../backend';

export function useTodayGoal() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Goal>({
    queryKey: ['todayGoal'],
    queryFn: async () => {
      if (!actor) return { dailyGoal: BigInt(0), actual: BigInt(0) };
      return actor.getTodayGoal();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    goal: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
