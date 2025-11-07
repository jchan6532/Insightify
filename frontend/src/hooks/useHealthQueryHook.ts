import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/apiClient';

type Health = { status: string };

export function useHealthQuery() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<Health> => {
      const { data } = await api.get<Health>('/health');
      return data;
    },
  });
}
