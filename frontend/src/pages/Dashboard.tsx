import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { api } from '../services/api';
import { InventoryItem } from '../types/inventory';

interface DashboardStats {
  totalItems: number;
  lowStock: number;
  categories: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({ totalItems: 0, lowStock: 0, categories: 0 });
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsResponse, inventoryResponse] = await Promise.all([
          api.get<DashboardStats>('/dashboard/stats'),
          api.get<InventoryItem[]>('/inventory')
        ]);
        setStats(statsResponse.data);
        const grouped = inventoryResponse.data.reduce<Record<string, number>>((acc, item) => {
          acc[item.category] = (acc[item.category] ?? 0) + item.quantity;
          return acc;
        }, {});
        setChartData(
          Object.entries(grouped).map(([label, value]) => ({
            label,
            value
          }))
        );
      } catch (error) {
        setStats({ totalItems: 0, lowStock: 0, categories: 0 });
        setChartData([]);
      }
    };

    fetchStats();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Productos en inventario
            </Typography>
            <Typography variant="h4">{stats.totalItems}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Productos en nivel crítico
            </Typography>
            <Typography variant="h4">{stats.lowStock}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Categorías
            </Typography>
            <Typography variant="h4">{stats.categories}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <SimpleBarChart title="Stock por categoría" data={chartData} />
      </Grid>
    </Grid>
  );
};
