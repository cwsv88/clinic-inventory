import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { vi } from 'vitest';
import { api } from '../services/api';

type ApiGet = typeof api.get;

vi.mock('../services/api', async () => {
  const actual = await vi.importActual<typeof import('../services/api')>('../services/api');
  return {
    ...actual,
    api: {
      ...actual.api,
      get: vi.fn()
    }
  };
});

const mockedApiGet = api.get as unknown as ApiGet & vi.Mock;

describe('Dashboard page', () => {
  beforeEach(() => {
    mockedApiGet.mockReset();
  });

  it('fetches and displays dashboard statistics', async () => {
    mockedApiGet
      .mockResolvedValueOnce({ data: { totalItems: 10, lowStock: 2, categories: 4 } })
      .mockResolvedValueOnce({
        data: [
          { id: '1', name: 'Guantes', sku: 'SKU1', category: 'Protección', quantity: 5, unit: 'caja', minStock: 3, lastUpdated: new Date().toISOString() },
          { id: '2', name: 'Mascarillas', sku: 'SKU2', category: 'Protección', quantity: 8, unit: 'caja', minStock: 5, lastUpdated: new Date().toISOString() }
        ]
      });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });
});
