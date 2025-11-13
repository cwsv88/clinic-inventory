import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { ReactNode } from 'react';

type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  title?: string;
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
};

export const DataTable = <T extends { id: string | number }>({
  title,
  columns,
  data,
  emptyMessage = 'No hay datos disponibles'
}: DataTableProps<T>) => (
  <Paper elevation={1} sx={{ width: '100%', overflowX: 'auto' }}>
    {title ? (
      <Typography variant="h6" component="div" sx={{ px: 2, py: 2 }}>
        {title}
      </Typography>
    ) : null}
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={String(column.accessor)}>{column.header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((column) => (
                  <TableCell key={String(column.accessor)}>
                    {column.render ? column.render(row) : String(row[column.accessor])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);
