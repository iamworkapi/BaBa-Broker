import { authHeaders } from './auth';

export const api = async (path, options = {}) => {
  const response = await fetch(path, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  const body = await response.text();
  const data = body ? JSON.parse(body) : {};
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
};
