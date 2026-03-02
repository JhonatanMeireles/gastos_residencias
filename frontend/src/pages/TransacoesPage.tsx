import { useState, useEffect, useCallback } from 'react';
import {
  listarTransacoes, criarTransacao,
  listarPessoas, listarCategorias,
} from '../services/api';
import type {
  Transacao, CriarTransacaoDto, TipoTransacao,
  Pessoa, Categoria,
} from '../types';
import { formatarMoeda } from '../utils/formatadores';

/**
 * Página de gerenciamento de transações financeiras.
 *
 * Regras de negócio aplicadas no formulário (validação antecipada no front):
 *   1. Ao selecionar uma pessoa menor de 18 anos, o campo "Tipo" é fixado em Despesa.
 *   2. Ao selecionar o tipo da transação, apenas categorias compatíveis são exibidas.
 *      (Categorias com finalidade "Receita" não aparecem para transações do tipo "Despesa" e vice-versa.)
 *
 * Nota: O backend também valida essas regras; o front apenas melhora a experiência do usuário.
 */
export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Campos do formulário
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<TipoTransacao>('Despesa');
  const [categoriaId, setCategoriaId] = useState('');
  const [pessoaId, setPessoaId] = useState('');

  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  /** Carrega dados iniciais necessários para o formulário */
  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const [t, p, c] = await Promise.all([listarTransacoes(), listarPessoas(), listarCategorias()]);
      setTransacoes(t);
      setPessoas(p);
      setCategorias(c);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  /** Pessoa selecionada no formulário (usada para verificar menor de idade) */
  const pessoaSelecionada = pessoas.find(p => p.id === Number(pessoaId));

  /** Se a pessoa selecionada for menor de 18 anos, força o tipo para Despesa */
  const tipoEfetivo: TipoTransacao =
    pessoaSelecionada && pessoaSelecionada.idade < 18 ? 'Despesa' : tipo;

  /**
   * Filtra as categorias disponíveis conforme o tipo da transação.
   * - Transação "Despesa": exibe categorias com finalidade "Despesa" ou "Ambas"
   * - Transação "Receita": exibe categorias com finalidade "Receita" ou "Ambas"
   */
  const categoriasFiltradas = categorias.filter(c =>
    c.finalidade === 'Ambas' || c.finalidade === tipoEfetivo
  );

  /** Ao trocar pessoa, limpa a categoria selecionada para evitar seleção inválida */
  function handlePessoaChange(id: string) {
    setPessoaId(id);
    setCategoriaId('');
  }

  /** Ao trocar o tipo, limpa a categoria selecionada para evitar seleção inválida */
  function handleTipoChange(t: TipoTransacao) {
    setTipo(t);
    setCategoriaId('');
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const dto: CriarTransacaoDto = {
      descricao: descricao.trim(),
      valor: Number(valor),
      tipo: tipoEfetivo,
      categoriaId: Number(categoriaId),
      pessoaId: Number(pessoaId),
    };

    try {
      await criarTransacao(dto);
      setDescricao('');
      setValor('');
      setTipo('Despesa');
      setCategoriaId('');
      setPessoaId('');
      await carregar();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      setErro(msg || 'Erro ao salvar transação.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Transações</h1>

      {/* Formulário de cadastro */}
      <form onSubmit={salvar} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Nova Transação</h2>

        {erro && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded px-4 py-2 text-sm">
            {erro}
          </div>
        )}

        {/* Pessoa */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Pessoa</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={pessoaId}
              onChange={e => handlePessoaChange(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {pessoas.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} ({p.idade} anos){p.idade < 18 ? ' — menor de idade' : ''}
                </option>
              ))}
            </select>
            {pessoaSelecionada && pessoaSelecionada.idade < 18 && (
              <p className="text-xs text-yellow-600 mt-1">
                ⚠️ Menor de idade — apenas transações de despesa são permitidas.
              </p>
            )}
          </div>

          {/* Tipo da transação */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={tipoEfetivo}
              onChange={e => handleTipoChange(e.target.value as TipoTransacao)}
              disabled={pessoaSelecionada?.idade !== undefined && pessoaSelecionada.idade < 18}
            >
              <option value="Despesa">📤 Despesa</option>
              <option value="Receita">📥 Receita</option>
            </select>
          </div>
        </div>

        {/* Descrição e Valor */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              maxLength={400}
              placeholder="Ex: Supermercado, Salário..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={valor}
              onChange={e => setValor(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>
        </div>

        {/* Categoria — filtrada conforme o tipo selecionado */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
          <p className="text-xs text-gray-400 mb-1">
            Apenas categorias compatíveis com o tipo "{tipoEfetivo}" são exibidas.
          </p>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={categoriaId}
            onChange={e => setCategoriaId(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {categoriasFiltradas.map(c => (
              <option key={c.id} value={c.id}>
                {c.descricao} — {c.finalidade}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
        >
          Registrar transação
        </button>
      </form>

      {/* Lista de transações */}
      {carregando ? (
        <p className="text-gray-400 text-sm">Carregando...</p>
      ) : transacoes.length === 0 ? (
        <p className="text-gray-400 text-sm">Nenhuma transação registrada ainda.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Pessoa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transacoes.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{t.descricao}</td>
                  <td className={`px-4 py-3 font-semibold ${t.tipo === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.tipo === 'Receita' ? '+' : '-'} {formatarMoeda(t.valor)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      t.tipo === 'Receita'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {t.tipo === 'Receita' ? '📥' : '📤'} {t.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t.categoria.descricao}</td>
                  <td className="px-4 py-3 text-gray-600">{t.pessoa.nome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
