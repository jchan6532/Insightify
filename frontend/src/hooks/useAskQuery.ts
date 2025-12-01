import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { queriesApi } from '@/apis/queries';
import { useNotification } from '@/contexts/notification';
import { type QueryResponse } from '@/types/query/QueryResponse.type';
import { type QueryRequest } from '@/types/query/QueryRequest.type';
import { useNavigate } from 'react-router-dom';

const askQueryFn = async ({
  question,
  top_k,
}: QueryRequest): Promise<QueryResponse> => {
  const res = await queriesApi.post('/', { question, top_k });
  return res.data as QueryResponse;
};

export function useAskQuery() {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<QueryResponse, unknown, QueryRequest>({
    mutationFn: askQueryFn,
    onSuccess: (data: QueryResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['queries'],
      });

      navigate(`/queries/${data.query_id}`);
    },
    onError: (error) => {
      let message = 'Failed to get an answer. Please try again.';

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const detail = (error.response?.data as any)?.detail;

        if (status === 502) {
          message =
            detail ??
            'AI service is temporarily unavailable. Please try again later.';
        } else if (status === 500) {
          message = 'Server error while answering your question.';
        }
      }

      notify({ message, severity: 'error' });
    },
  });
}
