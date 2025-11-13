import { TextField, TextFieldProps } from '@mui/material';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';
import { FC } from 'react';

interface FormTextFieldProps extends TextFieldProps {
  name: string;
  rules?: RegisterOptions;
}

export const FormTextField: FC<FormTextFieldProps> = ({ name, rules, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          fullWidth
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
};
