import { useQueryDetail } from '@/hooks/useQueryDetail';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

type ParamProp = {
  queryId: string;
};

export default function QueryDetail() {
  const { queryId } = useParams<ParamProp>();
  const { data, isLoading, error } = useQueryDetail(queryId);

  if (!queryId) return <Typography color='error'>Invalid query id</Typography>;

  if (isLoading) return <CircularProgress />;

  if (error) return <Typography color='error'>Failed to load query</Typography>;

  if (!data) return <Typography>Query not found</Typography>;

  return (
    <Box p={2}>
      <Typography variant='h4' mb={1}>
        {data.question}
      </Typography>
      <Typography variant='body1' color='text.secondary' mb={2}>
        Asked: {new Date(data.created_at).toLocaleString()}
      </Typography>

      <Typography variant='h6' mb={1}>
        Answer
      </Typography>
      <Typography whiteSpace='pre-wrap'>{data.answer}</Typography>
    </Box>
  );
}
