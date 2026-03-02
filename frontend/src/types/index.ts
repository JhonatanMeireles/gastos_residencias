// ──────────────────────────────────────────────
//  Enumerações (espelham os enums do backend C#)
// ──────────────────────────────────────────────

/** Finalidade da categoria: restringe quais tipos de transação podem utilizá-la */
export type FinalidadeCategoria = 'Despesa' | 'Receita' | 'Ambas';

/** Tipo da transação: define se é uma entrada ou saída de dinheiro */
export type TipoTransacao = 'Despesa' | 'Receita';

// ──────────────────────────────────────────────
//  Entidades retornadas pela API
// ──────────────────────────────────────────────

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export interface Categoria {
  id: number;
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: Categoria;
  pessoa: Pessoa;
}

// ──────────────────────────────────────────────
//  DTOs de criação (enviados ao backend)
// ──────────────────────────────────────────────

export interface CriarPessoaDto {
  nome: string;
  idade: number;
}

export interface EditarPessoaDto {
  nome: string;
  idade: number;
}

export interface CriarCategoriaDto {
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface CriarTransacaoDto {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: number;
  pessoaId: number;
}

// ──────────────────────────────────────────────
//  DTOs de relatórios
// ──────────────────────────────────────────────

export interface TotalPorPessoa {
  pessoaId: number;
  nomePessoa: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisPorPessoaResponse {
  pessoas: TotalPorPessoa[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}

export interface TotalPorCategoria {
  categoriaId: number;
  descricaoCategoria: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisPorCategoriaResponse {
  categorias: TotalPorCategoria[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}
