import { useState, useEffect, useCallback } from 'react';
import { listarCategorias, criarCategoria } from '../services/api';
import type { Categoria, CriarCategoriaDto, FinalidadeCategoria } from '../types';

/** Rótulos amigáveis para os valores da enum FinalidadeCategoria */
const ROTULOS_FINALIDADE: Record<FinalidadeCategoria, string> = {
  Despesa: '📤 Despesa',
  Receita: '📥 Receita',
  Ambas: '🔄 Ambas',
};

/**
 * Página de gerenciamento de categorias.
 * Permite criar e listar categorias com suas finalidades (Despesa, Receita ou Ambas).
 * A finalidade determina quais tipos de transação podem utilizar a categoria.
 */
export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState('');
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>('Ambas');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setCategorias(await listarCategorias());
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const dto: CriarCategoriaDto = { descricao: descricao.trim(), finalidade };

    try {
      await criarCategoria(dto);
      setDescricao('');
      setFinalidade('Ambas');
      await carregar();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      setErro(msg || 'Erro ao salvar categoria.');
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Categorias</h1>

      {/* Formulário de cadastro */}
      <form onSubmit={salvar} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Nova Categoria</h2>

        {erro && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded px-4 py-2 text-sm">
            {erro}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            maxLength={400}
            placeholder="Ex: Alimentação, Salário, Aluguel..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Finalidade</label>
          <p className="text-xs text-gray-400 mb-2">
            Define quais tipos de transação podem usar esta categoria.
          </p>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={finalidade}
            onChange={e => setFinalidade(e.target.value as FinalidadeCategoria)}
          >
            <option value="Despesa">📤 Despesa — apenas transações de despesa</option>
            <option value="Receita">📥 Receita — apenas transações de receita</option>
            <option value="Ambas">🔄 Ambas — qualquer tipo de transação</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
        >
          Cadastrar
        </button>
      </form>

      {/* Lista de categorias */}
      {carregando ? (
        <p className="text-gray-400 text-sm">Carregando...</p>
      ) : categorias.length === 0 ? (
        <p className="text-gray-400 text-sm">Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">#</th>
                <th className="px-5 py-3 font-medium">Descrição</th>
                <th className="px-5 py-3 font-medium">Finalidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categorias.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-400">{c.id}</td>
                  <td className="px-5 py-3 text-gray-800">{c.descricao}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                      c.finalidade === 'Receita'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : c.finalidade === 'Despesa'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {ROTULOS_FINALIDADE[c.finalidade]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
