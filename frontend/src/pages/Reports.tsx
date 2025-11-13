import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { api } from '../services/api';

interface ConsumptionReport {
  month: string;
  total: number;
}

interface ExpirationReport {
  name: string;
  expiresAt: string;
}

export const Reports = () => {
  const [consumption, setConsumption] = useState<ConsumptionReport[]>([]);
  const [expirations, setExpirations] = useState<ExpirationReport[]>([]);

  const fetchReports = async () => {
    const [consumptionResponse, expirationResponse] = await Promise.all([
      api.get<ConsumptionReport[]>('/reports/consumption'),
      api.get<ExpirationReport[]>('/reports/expirations')
    ]);
    setConsumption(consumptionResponse.data);
    setExpirations(expirationResponse.data);
  };

  useEffect(() => {
    fetchReports().catch(() => {
      setConsumption([]);
      setExpirations([]);
    });
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Reportes</Typography>
        <Button variant="contained" onClick={fetchReports}>
          Actualizar
        </Button>
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SimpleBarChart
            title="Consumo mensual"
            data={consumption.map((item) => ({ label: item.month, value: item.total }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Próximas caducidades
              </Typography>
              {expirations.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay productos próximos a caducar
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {expirations.map((item) => (
                    <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>{item.name}</Typography>
                      <Typography color="text.secondary">
                        {new Date(item.expiresAt).toLocaleDateString('es-ES')}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
