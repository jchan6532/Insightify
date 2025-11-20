import { Box } from '@mui/material';

type ProgressCircleProps = {
  progress: number;
  size: string;
};

const ProgressCircle = ({
  progress = 0.75,
  size = '40',
}: ProgressCircleProps) => {
  const angle = Number(progress) * 360;
  const color = '#121212';
  return (
    <Box
      sx={{
        background: `radial-gradient(${color} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${color} ${angle}deg 360deg),
            ${color}`,
        borderRadius: '50%',
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;
