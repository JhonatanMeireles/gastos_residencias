import { useState, useEffect, useCallback } from 'react';
import { listarPessoas, criarPessoa, editarPessoa, deletarPessoa } from '../services/api';
import type { Pessoa, CriarPessoaDto } from '../types';
import { useAsync } from '../hooks/useAsync';

/**
 * Página de gerenciamento de pessoas.
 * Permite criar, editar, listar e excluir pessoas.
 * Ao excluir uma pessoa, todas as suas transações são removidas automaticamente (via cascade no backend).
 */
export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [editando, setEditando] = useState<Pessoa | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  /** Carrega a lista de pessoas ao montar o componente */
  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setPessoas(await listarPessoas());
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  /** Preenche o formulário com os dados da pessoa selecionada para edição */
  function iniciarEdicao(p: Pessoa) {
    setEditando(p);
    setNome(p.nome);
    setIdade(String(p.idade));
    setErro(null);
  }

  /** Cancela a edição e limpa o formulário */
  function cancelarEdicao() {
    setEditando(null);
    setNome('');
    setIdade('');
    setErro(null);
  }

  /** Submete o formulário: cria ou atualiza uma pessoa conforme o estado de edição */
  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const dto: CriarPessoaDto = { nome: nome.trim(), idade: Number(idade) };

    try {
      if (editando) {
        await editarPessoa(editando.id, dto);
      } else {
        await criarPessoa(dto);
      }
      cancelarEdicao();
      await carregar();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      setErro(msg || 'Erro ao salvar pessoa.');
    }
  }

  /** Solicita confirmação antes de excluir uma pessoa */
  async function excluir(p: Pessoa) {
    if (!confirm(`Excluir "${p.nome}"? Todas as transações desta pessoa também serão removidas.`)) return;
    try {
      await deletarPessoa(p.id);
      await carregar();
    } catch {
      setErro('Erro ao excluir pessoa.');
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pessoas</h1>

      {/* Formulário de cadastro / edição */}
      <form onSubmit={salvar} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          {editando ? `Editando: ${editando.nome}` : 'Nova Pessoa'}
        </h2>

        {erro && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded px-4 py-2 text-sm">
            {erro}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={nome}
              onChange={e => setNome(e.target.value)}
              maxLength={200}
              placeholder="Nome completo"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Idade</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={idade}
              onChange={e => setIdade(e.target.value)}
              min={0}
              placeholder="Ex: 30"
              required
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
          >
            {editando ? 'Salvar alterações' : 'Cadastrar'}
          </button>
          {editando && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de pessoas */}
      {carregando ? (
        <p className="text-gray-400 text-sm">Carregando...</p>
      ) : pessoas.length === 0 ? (
        <p className="text-gray-400 text-sm">Nenhuma pessoa cadastrada ainda.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Nome</th>
                <th className="px-5 py-3 font-medium">Idade</th>
                <th className="px-5 py-3 font-medium">Observação</th>
                <th className="px-5 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pessoas.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{p.nome}</td>
                  <td className="px-5 py-3 text-gray-600">{p.idade} anos</td>
                  <td className="px-5 py-3">
                    {p.idade < 18 && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-0.5 rounded-full">
                        Menor de idade — só despesas
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    <button
                      onClick={() => iniciarEdicao(p)}
                      className="text-blue-600 hover:underline text-xs font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluir(p)}
                      className="text-red-500 hover:underline text-xs font-medium"
                    >
                      Excluir
                    </button>
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
