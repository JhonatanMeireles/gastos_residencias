import axios from 'axios';
import type {
  Pessoa, CriarPessoaDto, EditarPessoaDto,
  Categoria, CriarCategoriaDto,
  Transacao, CriarTransacaoDto,
  TotaisPorPessoaResponse, TotaisPorCategoriaResponse,
} from '../types';

/**
 * Instância do Axios configurada para comunicar com a Web API.
 * A URL base aponta para o proxy do Vite em desenvolvimento,
 * que redireciona as chamadas /api para http://localhost:5000.
 */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ──────────────────────────────────────────────
//  Pessoas
// ──────────────────────────────────────────────

/** Retorna todas as pessoas cadastradas */
export const listarPessoas = () =>
  api.get<Pessoa[]>('/pessoas').then(r => r.data);

/** Cria uma nova pessoa */
export const criarPessoa = (dto: CriarPessoaDto) =>
  api.post<Pessoa>('/pessoas', dto).then(r => r.data);

/** Edita os dados de uma pessoa existente */
export const editarPessoa = (id: number, dto: EditarPessoaDto) =>
  api.put<Pessoa>(`/pessoas/${id}`, dto).then(r => r.data);

/** Remove uma pessoa e todas as suas transações */
export const deletarPessoa = (id: number) =>
  api.delete(`/pessoas/${id}`);

// ──────────────────────────────────────────────
//  Categorias
// ──────────────────────────────────────────────

/** Retorna todas as categorias cadastradas */
export const listarCategorias = () =>
  api.get<Categoria[]>('/categorias').then(r => r.data);

/** Cria uma nova categoria */
export const criarCategoria = (dto: CriarCategoriaDto) =>
  api.post<Categoria>('/categorias', dto).then(r => r.data);

// ──────────────────────────────────────────────
//  Transações
// ──────────────────────────────────────────────

/** Retorna todas as transações com dados de pessoa e categoria */
export const listarTransacoes = () =>
  api.get<Transacao[]>('/transacoes').then(r => r.data);

/** Cria uma nova transação (com validações de negócio no backend) */
export const criarTransacao = (dto: CriarTransacaoDto) =>
  api.post<Transacao>('/transacoes', dto).then(r => r.data);

// ──────────────────────────────────────────────
//  Relatórios
// ──────────────────────────────────────────────

/** Busca totais de receitas, despesas e saldo agrupados por pessoa */
export const totaisPorPessoa = () =>
  api.get<TotaisPorPessoaResponse>('/relatorios/totais-por-pessoa').then(r => r.data);

/** Busca totais de receitas, despesas e saldo agrupados por categoria */
export const totaisPorCategoria = () =>
  api.get<TotaisPorCategoriaResponse>('/relatorios/totais-por-categoria').then(r => r.data);

export default api;
