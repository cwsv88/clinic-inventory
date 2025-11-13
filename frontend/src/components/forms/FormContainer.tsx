import { Box, Paper, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface FormContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const FormContainer: React.FC<FormContainerProps> = ({ title, description, children }) => (
  <Paper elevation={2} sx={{ maxWidth: 480, mx: 'auto', p: 4 }}>
    <Typography variant="h5" component="h1" gutterBottom>
      {title}
    </Typography>
    {description ? (
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {description}
      </Typography>
    ) : null}
    <Box component="div" sx={{ mt: 3 }}>
      {children}
    </Box>
  </Paper>
);
