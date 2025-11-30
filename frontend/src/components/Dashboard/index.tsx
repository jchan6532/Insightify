import { Box, Toolbar, Typography, useTheme } from '@mui/material';
import Header from '../Header';
import { tokens } from '@/contexts/theme/theme';
import QueryBox from '../QueryBox';

const BORDER_RADIUS = 8;

export default function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box margin='20px'>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Header
          title={'INSIGHTIFY'}
          subtitle={'PersonalAL AI Query Chat Bot'}
        />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        gridTemplateRows='repeat(10, 1fr)'
        gap='25px'
        p='0px 20px'
      >
        {/* ROW 1 */}
        <Box
          gridColumn='span 12'
          gridRow='span 4'
          bgcolor={colors.primary[400]}
          borderRadius={BORDER_RADIUS}
        >
          <Box mt='25px' p='0 30px'>
            <Typography
              variant='h3'
              fontWeight='bold'
              color={colors.greenAccent[500]}
              textAlign='left'
            >
              What's On Your Mind?
            </Typography>

            <Box display='flex' justifyContent='center' mt={8}>
              <QueryBox />
            </Box>
          </Box>
          <Box height='250px' overflow={'auto'}></Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn='span 6'
          gridRow='span 4'
          bgcolor={colors.primary[400]}
          p='30px'
          borderRadius={BORDER_RADIUS}
        >
          <Typography variant='h3' fontWeight='600'>
            Chat History
          </Typography>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            mt='25px'
          ></Box>
        </Box>
        <Box
          gridColumn='span 6'
          gridRow='span 4'
          bgcolor={colors.primary[400]}
          overflow={'auto'}
          borderRadius={BORDER_RADIUS}
        >
          <Box
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Typography
              variant='h3'
              fontWeight='600'
              sx={{ padding: '30px 30px 0 30px' }}
            >
              Stored Documents
            </Typography>
          </Box>
          <Box height='250px' mt={'20px'} marginBottom={'100px'}>
            <Toolbar />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
