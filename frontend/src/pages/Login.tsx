import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FormContainer } from '../components/forms/FormContainer';
import { FormTextField } from '../components/forms/FormTextField';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

interface LoginFormValues {
  email: string;
  password: string;
}

export const Login = () => {
  const methods = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.email, values.password);
    } catch (err) {
      setError('Credenciales inválidas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', backgroundColor: '#e3f2fd' }}>
      <FormContainer title="Iniciar sesión" description="Accede al panel de inventario de la clínica">
        <FormProvider {...methods}>
          <Stack component="form" spacing={3} onSubmit={methods.handleSubmit(onSubmit)}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <FormTextField
              name="email"
              label="Correo electrónico"
              type="email"
              placeholder="usuario@clinica.com"
              rules={{ required: 'El correo es obligatorio' }}
            />
            <FormTextField
              name="password"
              label="Contraseña"
              type="password"
              rules={{ required: 'La contraseña es obligatoria' }}
            />
            <Button type="submit" variant="contained" disabled={loading} size="large">
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
            </Button>
          </Stack>
        </FormProvider>
      </FormContainer>
    </Box>
  );
};
