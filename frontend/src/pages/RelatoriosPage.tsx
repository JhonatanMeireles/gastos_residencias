import { useState, useEffect, useCallback } from 'react';
import { totaisPorPessoa, totaisPorCategoria } from '../services/api';
import type { TotaisPorPessoaResponse, TotaisPorCategoriaResponse } from '../types';
import { formatarMoeda, corSaldo } from '../utils/formatadores';

/**
 * Página de relatórios consolidados.
 * Exibe duas tabelas:
 *   1. Totais por pessoa (receitas, despesas e saldo individual + total geral)
 *   2. Totais por categoria (receitas, despesas e saldo individual + total geral)
 *
 * O saldo é calculado como: receitas - despesas.
 */
export default function RelatoriosPage() {
  const [dadosPessoa, setDadosPessoa] = useState<TotaisPorPessoaResponse | null>(null);
  const [dadosCategoria, setDadosCategoria] = useState<TotaisPorCategoriaResponse | null>(null);
  const [carregando, setCarregando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const [p, c] = await Promise.all([totaisPorPessoa(), totaisPorCategoria()]);
      setDadosPessoa(p);
      setDadosCategoria(c);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  if (carregando) return <p className="text-gray-400 text-sm">Carregando relatórios...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>

      {/* ── Totais por Pessoa ── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Totais por Pessoa</h2>

        {!dadosPessoa || dadosPessoa.pessoas.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum dado disponível.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">Pessoa</th>
                  <th className="px-5 py-3 font-medium text-green-600">Receitas</th>
                  <th className="px-5 py-3 font-medium text-red-600">Despesas</th>
                  <th className="px-5 py-3 font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dadosPessoa.pessoas.map(p => (
                  <tr key={p.pessoaId} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{p.nomePessoa}</td>
                    <td className="px-5 py-3 text-green-600">{formatarMoeda(p.totalReceitas)}</td>
                    <td className="px-5 py-3 text-red-600">{formatarMoeda(p.totalDespesas)}</td>
                    <td className={`px-5 py-3 font-semibold ${corSaldo(p.saldo)}`}>
                      {formatarMoeda(p.saldo)}
                    </td>
                  </tr>
                ))}

                {/* Linha de total geral */}
                <tr className="bg-gray-50 font-semibold text-gray-700 border-t-2 border-gray-200">
                  <td className="px-5 py-3">Total Geral</td>
                  <td className="px-5 py-3 text-green-700">{formatarMoeda(dadosPessoa.totalGeralReceitas)}</td>
                  <td className="px-5 py-3 text-red-700">{formatarMoeda(dadosPessoa.totalGeralDespesas)}</td>
                  <td className={`px-5 py-3 ${corSaldo(dadosPessoa.saldoLiquido)}`}>
                    {formatarMoeda(dadosPessoa.saldoLiquido)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Totais por Categoria ── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Totais por Categoria</h2>

        {!dadosCategoria || dadosCategoria.categorias.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum dado disponível.</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">Categoria</th>
                  <th className="px-5 py-3 font-medium text-green-600">Receitas</th>
                  <th className="px-5 py-3 font-medium text-red-600">Despesas</th>
                  <th className="px-5 py-3 font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dadosCategoria.categorias.map(c => (
                  <tr key={c.categoriaId} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{c.descricaoCategoria}</td>
                    <td className="px-5 py-3 text-green-600">{formatarMoeda(c.totalReceitas)}</td>
                    <td className="px-5 py-3 text-red-600">{formatarMoeda(c.totalDespesas)}</td>
                    <td className={`px-5 py-3 font-semibold ${corSaldo(c.saldo)}`}>
                      {formatarMoeda(c.saldo)}
                    </td>
                  </tr>
                ))}

                {/* Linha de total geral */}
                <tr className="bg-gray-50 font-semibold text-gray-700 border-t-2 border-gray-200">
                  <td className="px-5 py-3">Total Geral</td>
                  <td className="px-5 py-3 text-green-700">{formatarMoeda(dadosCategoria.totalGeralReceitas)}</td>
                  <td className="px-5 py-3 text-red-700">{formatarMoeda(dadosCategoria.totalGeralDespesas)}</td>
                  <td className={`px-5 py-3 ${corSaldo(dadosCategoria.saldoLiquido)}`}>
                    {formatarMoeda(dadosCategoria.saldoLiquido)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      <button
        onClick={carregar}
        className="text-sm text-blue-600 hover:underline"
      >
        ↻ Atualizar relatórios
      </button>
    </div>
  );
}
