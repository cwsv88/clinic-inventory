import { Box, Typography } from '@mui/material';
import { FC } from 'react';

type Datum = {
  label: string;
  value: number;
};

type SimpleBarChartProps = {
  title?: string;
  data: Datum[];
  height?: number;
};

export const SimpleBarChart: FC<SimpleBarChartProps> = ({ title, data, height = 240 }) => {
  const maxValue = Math.max(...data.map((datum) => datum.value), 1);

  return (
    <Box component="section" sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
      {title ? (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      ) : null}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height }}>
        {data.map((datum) => (
          <Box key={datum.label} sx={{ flex: 1, textAlign: 'center' }}>
            <Box
              sx={{
                height: `${(datum.value / maxValue) * 100}%`,
                background: 'linear-gradient(135deg, #1976d2 0%, #63a4ff 100%)',
                borderRadius: 1,
                transition: 'opacity 0.2s ease',
                ':hover': { opacity: 0.85 }
              }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {datum.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {datum.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
