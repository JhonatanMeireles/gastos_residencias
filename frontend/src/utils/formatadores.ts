/**
 * Formata um número como moeda brasileira (R$).
 * Utilizado em toda a aplicação para exibir valores monetários.
 */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Retorna a classe CSS de cor conforme o saldo:
 * - Positivo → verde
 * - Negativo → vermelho
 * - Zero     → cinza
 */
export function corSaldo(saldo: number): string {
  if (saldo > 0) return 'text-green-600';
  if (saldo < 0) return 'text-red-600';
  return 'text-gray-500';
}
