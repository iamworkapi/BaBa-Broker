import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useApi(path, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api(path, options);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [path, JSON.stringify(options)]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, loading, refetch: load };
}
