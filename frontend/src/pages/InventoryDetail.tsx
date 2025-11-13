import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FormTextField } from '../components/forms/FormTextField';
import { InventoryItem } from '../types/inventory';
import { api } from '../services/api';

interface InventoryFormValues {
  quantity: number;
  minStock: number;
}

export const InventoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const methods = useForm<InventoryFormValues>({
    defaultValues: { quantity: 0, minStock: 0 }
  });
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get<InventoryItem>(`/inventory/${id}`);
        setItem(response.data);
        methods.reset({ quantity: response.data.quantity, minStock: response.data.minStock });
      } catch (error) {
        setStatus('error');
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id, methods]);

  const onSubmit: SubmitHandler<InventoryFormValues> = async (values) => {
    try {
      await api.put(`/inventory/${id}`, values);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  if (!item) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h6">Cargando producto...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Button variant="text" onClick={() => navigate(-1)}>
        Volver
      </Button>
      <Typography variant="h4">{item.name}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Información</Typography>
              <Typography variant="body2" color="text.secondary">
                SKU: {item.sku}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Categoría: {item.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unidad: {item.unit}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Ajustar inventario
              </Typography>
              {status === 'success' ? <Alert severity="success">Producto actualizado</Alert> : null}
              {status === 'error' ? <Alert severity="error">No se pudo guardar</Alert> : null}
              <FormProvider {...methods}>
                <Stack component="form" spacing={2} sx={{ mt: 2 }} onSubmit={methods.handleSubmit(onSubmit)}>
                  <FormTextField
                    name="quantity"
                    label="Cantidad"
                    type="number"
                    rules={{ required: 'Ingresa la cantidad', min: { value: 0, message: 'Debe ser mayor o igual a 0' } }}
                  />
                  <FormTextField
                    name="minStock"
                    label="Stock mínimo"
                    type="number"
                    rules={{ required: 'Ingresa el stock mínimo', min: { value: 0, message: 'Debe ser mayor o igual a 0' } }}
                  />
                  <Button type="submit" variant="contained">
                    Guardar cambios
                  </Button>
                </Stack>
              </FormProvider>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
