import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { InventoryItem } from '../types/inventory';

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<InventoryItem[]>('/inventory');
      setItems(response.data);
    } catch (err) {
      setError('No se pudo cargar el inventario');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateItem = useCallback(async (id: string, payload: Partial<InventoryItem>) => {
    await api.put(`/inventory/${id}`, payload);
    await fetchItems();
  }, [fetchItems]);

  return { items, loading, error, fetchItems, updateItem };
};
