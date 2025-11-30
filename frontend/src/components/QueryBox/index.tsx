import { useState, type FormEvent } from 'react';
import { useAskQuery } from '@/hooks/useAskQuery';
import { IconButton, Paper, TextField } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { type QueryResponse } from '@/types/query/QueryResponse.type';

export default function QueryBox() {
  const [question, setQuestion] = useState<string>('');
  const { mutate: ask, isPending } = useAskQuery();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() || isPending) return;

    ask(
      { question, top_k: 20 },
      {
        onSuccess: (data: QueryResponse) => {
          console.log(data);
          setQuestion('');
        },
      }
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 600,
        borderRadius: 4,
        px: 2,
        py: 1,
        bgcolor: 'background.paper',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <TextField
          fullWidth
          placeholder='Ask a question...'
          variant='standard'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isPending}
          slotProps={{
            input: {
              disableUnderline: true,
              sx: { fontSize: '1.1rem' },
            },
          }}
        />

        <IconButton
          type='submit'
          color='primary'
          disabled={isPending || !question.trim()}
        >
          <SendRoundedIcon />
        </IconButton>
      </form>
    </Paper>
  );
}
