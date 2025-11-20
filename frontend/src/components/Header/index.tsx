import { Typography, Box } from '@mui/material';

type HeaderProps = {
  title: string;
  subtitle: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <Box mb='30px'>
      <Typography
        variant='h2'
        // color={colors.grey[100]}
        fontWeight='bold'
        sx={{
          mb: '5px',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant='h5'
        // color={colors.greenAccent[400]}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}
