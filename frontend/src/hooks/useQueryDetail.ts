import { type Query } from '@/types/query/Query.type';
import { queriesApi } from '@/apis/queries';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type QueryList } from '@/types/query/QueryList.type';

const fetchQueryDetail = async (id: string): Promise<Query> => {
  const res = await queriesApi.get(`/${id}`);
  return res.data as Query;
};

export function useQueryDetail(queryId?: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['queries', queryId],
    enabled: !!queryId,
    initialData: () => {
      const list = queryClient.getQueryData<QueryList>(['queries']);
      return list?.queries.find((query) => query.id === queryId) ?? undefined;
    },
    queryFn: () => fetchQueryDetail(queryId as string),
  });
}
