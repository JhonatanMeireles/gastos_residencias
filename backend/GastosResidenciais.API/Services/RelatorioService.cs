using GastosResidenciais.API.Data;
using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Serviço responsável pelos relatórios consolidados de totais financeiros.
/// Calcula receitas, despesas e saldo por pessoa e por categoria.
/// </summary>
public class RelatorioService
{
    private readonly AppDbContext _db;

    public RelatorioService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Retorna o total de receitas, despesas e saldo de cada pessoa,
    /// além do consolidado geral de todas as pessoas.
    /// </summary>
    public async Task<TotaisPorPessoaResponseDto> TotaisPorPessoaAsync()
    {
        // Carrega todas as pessoas com suas transações
        var pessoas = await _db.Pessoas
            .Include(p => p.Transacoes)
            .ToListAsync();

        var totais = pessoas.Select(p => new TotalPorPessoaDto(
            p.Id,
            p.Nome,
            TotalReceitas: p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
            TotalDespesas: p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
            Saldo: p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor)
                 - p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
        )).ToList();

        // Consolida o total geral somando os valores de todas as pessoas
        var totalGeralReceitas = totais.Sum(t => t.TotalReceitas);
        var totalGeralDespesas = totais.Sum(t => t.TotalDespesas);

        return new TotaisPorPessoaResponseDto(
            totais,
            totalGeralReceitas,
            totalGeralDespesas,
            SaldoLiquido: totalGeralReceitas - totalGeralDespesas
        );
    }

    /// <summary>
    /// Retorna o total de receitas, despesas e saldo de cada categoria,
    /// além do consolidado geral de todas as categorias.
    /// </summary>
    public async Task<TotaisPorCategoriaResponseDto> TotaisPorCategoriaAsync()
    {
        // Carrega todas as categorias com suas transações
        var categorias = await _db.Categorias
            .Include(c => c.Transacoes)
            .ToListAsync();

        var totais = categorias.Select(c => new TotalPorCategoriaDto(
            c.Id,
            c.Descricao,
            TotalReceitas: c.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
            TotalDespesas: c.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
            Saldo: c.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor)
                 - c.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
        )).ToList();

        var totalGeralReceitas = totais.Sum(t => t.TotalReceitas);
        var totalGeralDespesas = totais.Sum(t => t.TotalDespesas);

        return new TotaisPorCategoriaResponseDto(
            totais,
            totalGeralReceitas,
            totalGeralDespesas,
            SaldoLiquido: totalGeralReceitas - totalGeralDespesas
        );
    }
}
