import type { ReactNode } from 'react';
import { useApiResource } from '../api/useApiResource.js';

type Props<T> = {
  path: string;
  isEmpty: (data: T) => boolean;
  emptyText: string;
  children: (data: T) => ReactNode;
};

export function ApiResourceContent<T>({ path, isEmpty, emptyText, children }: Props<T>) {
  const state = useApiResource<T>(path);

  if (state.status === 'loading') return <p role="status">Carregando...</p>;
  if (state.status === 'error') return <p role="alert" className="alert alert-danger mb-0">Não foi possível carregar os dados. Tente novamente em instantes.</p>;
  if (isEmpty(state.data)) return <p className="text-body-secondary mb-0">{emptyText}</p>;
  return <>{children(state.data)}</>;
}
