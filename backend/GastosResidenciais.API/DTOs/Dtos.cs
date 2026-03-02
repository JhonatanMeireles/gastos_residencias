using GastosResidenciais.API.Models;

namespace GastosResidenciais.API.DTOs;

// ──────────────────────────────────────────────
//  PESSOA
// ──────────────────────────────────────────────

/// <summary>Dados necessários para criar uma nova pessoa.</summary>
public record CriarPessoaDto(string Nome, int Idade);

/// <summary>Dados necessários para editar uma pessoa existente.</summary>
public record EditarPessoaDto(string Nome, int Idade);

/// <summary>Representação de saída de uma pessoa.</summary>
public record PessoaDto(int Id, string Nome, int Idade);

// ──────────────────────────────────────────────
//  CATEGORIA
// ──────────────────────────────────────────────

/// <summary>Dados necessários para criar uma nova categoria.</summary>
public record CriarCategoriaDto(string Descricao, FinalidadeCategoria Finalidade);

/// <summary>Representação de saída de uma categoria.</summary>
public record CategoriaDto(int Id, string Descricao, FinalidadeCategoria Finalidade);

// ──────────────────────────────────────────────
//  TRANSACAO
// ──────────────────────────────────────────────

/// <summary>Dados necessários para criar uma nova transação.</summary>
public record CriarTransacaoDto(
    string Descricao,
    decimal Valor,
    TipoTransacao Tipo,
    int CategoriaId,
    int PessoaId
);

/// <summary>Representação de saída de uma transação.</summary>
public record TransacaoDto(
    int Id,
    string Descricao,
    decimal Valor,
    TipoTransacao Tipo,
    CategoriaDto Categoria,
    PessoaDto Pessoa
);

// ──────────────────────────────────────────────
//  TOTAIS
// ──────────────────────────────────────────────

/// <summary>Totais financeiros de uma pessoa (receitas, despesas e saldo).</summary>
public record TotalPorPessoaDto(
    int PessoaId,
    string NomePessoa,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo
);

/// <summary>Resposta da consulta de totais por pessoa, incluindo o total geral.</summary>
public record TotaisPorPessoaResponseDto(
    IEnumerable<TotalPorPessoaDto> Pessoas,
    decimal TotalGeralReceitas,
    decimal TotalGeralDespesas,
    decimal SaldoLiquido
);

/// <summary>Totais financeiros de uma categoria (receitas, despesas e saldo).</summary>
public record TotalPorCategoriaDto(
    int CategoriaId,
    string DescricaoCategoria,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo
);

/// <summary>Resposta da consulta de totais por categoria, incluindo o total geral.</summary>
public record TotaisPorCategoriaResponseDto(
    IEnumerable<TotalPorCategoriaDto> Categorias,
    decimal TotalGeralReceitas,
    decimal TotalGeralDespesas,
    decimal SaldoLiquido
);
