import { Box, CircularProgress, Grid, Typography } from '@mui/material';

import DocumentCard from '@/components/Document/DocumentCard';
import { useDocuments } from '@/hooks/useDocs';

export default function Documents() {
  const { data, isLoading, error } = useDocuments();

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    let message = 'Something went wrong';
    let name = 'N/A';

    if (error instanceof Error) {
      name = error.name;
      message = error.message;
      console.log(error);
      console.log(error.cause);
    }

    return (
      <Typography color='error' mt={4}>
        {name}: {message}
      </Typography>
    );
  }

  const documents = data?.documents ?? [];

  if (documents.length == 0) {
    return <Typography mt={4}>You don't have any documents yet</Typography>;
  }

  return (
    <Grid container spacing={2} mt={2}>
      {documents.map((doc) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc.id}>
          <DocumentCard document={doc} />
        </Grid>
      ))}
    </Grid>
  );
}
