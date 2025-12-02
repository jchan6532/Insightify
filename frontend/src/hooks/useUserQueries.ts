import { queriesApi } from '@/apis/queries';
import { useQuery } from '@tanstack/react-query';
import { type QueryList } from '@/types/query/QueryList.type';

const fetchUserQueries = async (): Promise<QueryList> => {
  const res = await queriesApi.get('/');
  return res.data as QueryList;
};

export function useUserQueries() {
  return useQuery({
    queryKey: ['queries'],
    queryFn: fetchUserQueries,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}
