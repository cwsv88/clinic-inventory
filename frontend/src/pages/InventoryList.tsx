import { Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { DataTable } from '../components/tables/DataTable';
import { useInventory } from '../hooks/useInventory';
import { InventoryItem } from '../types/inventory';
import { formatDate } from '../utils/format';

export const InventoryList = () => {
  const { items, loading, error, fetchItems } = useInventory();

  const columns = [
    { header: 'Nombre', accessor: 'name' as const },
    { header: 'SKU', accessor: 'sku' as const },
    { header: 'Categoría', accessor: 'category' as const },
    {
      header: 'Cantidad',
      accessor: 'quantity' as const,
      render: (item: InventoryItem) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>{item.quantity}</Typography>
          {item.quantity <= item.minStock ? <Chip label="Crítico" color="error" size="small" /> : null}
        </Stack>
      )
    },
    {
      header: 'Actualizado',
      accessor: 'lastUpdated' as const,
      render: (item: InventoryItem) => formatDate(item.lastUpdated)
    },
    {
      header: 'Acciones',
      accessor: 'id' as const,
      render: (item: InventoryItem) => (
        <Button component={RouterLink} to={`/inventory/${item.id}`} variant="outlined" size="small">
          Ver detalle
        </Button>
      )
    }
  ];

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Inventario</Typography>
        <Button variant="contained" onClick={fetchItems} disabled={loading}>
          Actualizar
        </Button>
      </Stack>
      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : null}
      {error ? (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      ) : null}
      <DataTable title="Listado de productos" columns={columns} data={items} />
    </Stack>
  );
};
