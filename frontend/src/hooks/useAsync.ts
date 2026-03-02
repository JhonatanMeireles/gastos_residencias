import { useState, useCallback } from 'react';

/**
 * Hook genérico para encapsular chamadas assíncronas.
 * Gerencia os estados de carregamento, erro e dados retornados,
 * evitando repetição de boilerplate em cada componente.
 */
export function useAsync<T, A extends unknown[]>(
  fn: (...args: A) => Promise<T>
) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  /** Executa a função assíncrona e atualiza os estados correspondentes */
  const executar = useCallback(
    async (...args: A): Promise<T | null> => {
      setCarregando(true);
      setErro(null);
      try {
        const resultado = await fn(...args);
        return resultado;
      } catch (e: unknown) {
        // Extrai a mensagem de erro retornada pela API ou usa mensagem genérica
        const mensagem =
          (e as { response?: { data?: string } })?.response?.data ||
          'Ocorreu um erro inesperado.';
        setErro(mensagem);
        return null;
      } finally {
        setCarregando(false);
      }
    },
    [fn]
  );

  return { executar, carregando, erro, limparErro: () => setErro(null) };
}
