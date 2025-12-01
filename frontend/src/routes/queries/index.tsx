import { useUserQueries } from '@/hooks/useUserQueries';
import {
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

export default function Queries() {
  const { data, isLoading, error } = useUserQueries();

  if (isLoading) return <CircularProgress />;

  if (error)
    return <Typography color='error'>Failed to load queries</Typography>;

  if (!data || data.queries.length === 0) {
    return (
      <Typography>No queries yet, Ask something on the dashboard!</Typography>
    );
  }

  return (
    <Box p={2}>
      <Typography variant='h4' mb={2}>
        Your Queries ({data.total})
      </Typography>
      <List>
        {data.queries.map((query) => (
          <ListItemButton
            key={query.id}
            component={Link}
            to={`/queries/${query.id}`}
          >
            <ListItemText
              primary={query.question}
              secondary={new Date(query.created_at).toLocaleString()}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
