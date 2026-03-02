using GastosResidenciais.API.Data;
using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Serviço responsável pela lógica de negócio do cadastro de transações.
/// Aplica as regras de negócio:
///   1. Menores de idade só podem ter despesas.
///   2. A categoria deve ser compatível com o tipo da transação.
///   3. Valor deve ser positivo.
/// </summary>
public class TransacaoService
{
    private readonly AppDbContext _db;

    public TransacaoService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Retorna todas as transações com dados de categoria e pessoa incluídos.
    /// </summary>
    public async Task<IEnumerable<TransacaoDto>> ListarAsync()
    {
        return await _db.Transacoes
            .Include(t => t.Categoria)
            .Include(t => t.Pessoa)
            .Select(t => MapToDto(t))
            .ToListAsync();
    }

    /// <summary>
    /// Cria uma nova transação, aplicando todas as validações de negócio.
    /// </summary>
    public async Task<(TransacaoDto? Transacao, string? Erro)> CriarAsync(CriarTransacaoDto dto)
    {
        // Validação básica do valor
        if (dto.Valor <= 0)
            return (null, "O valor da transação deve ser positivo.");

        if (string.IsNullOrWhiteSpace(dto.Descricao))
            return (null, "Descrição é obrigatória.");

        if (dto.Descricao.Length > 400)
            return (null, "Descrição deve ter no máximo 400 caracteres.");

        // Busca a pessoa para verificar idade
        var pessoa = await _db.Pessoas.FindAsync(dto.PessoaId);
        if (pessoa is null)
            return (null, "Pessoa não encontrada.");

        // Regra de negócio: menor de 18 anos só pode ter despesas
        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
            return (null, "Menores de idade só podem ter transações do tipo despesa.");

        // Busca a categoria para verificar compatibilidade
        var categoria = await _db.Categorias.FindAsync(dto.CategoriaId);
        if (categoria is null)
            return (null, "Categoria não encontrada.");

        // Regra de negócio: verifica compatibilidade entre tipo da transação e finalidade da categoria
        var erroCategoria = ValidarCompatibilidadeCategoria(dto.Tipo, categoria.Finalidade);
        if (erroCategoria is not null)
            return (null, erroCategoria);

        var transacao = new Transacao
        {
            Descricao = dto.Descricao.Trim(),
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            CategoriaId = dto.CategoriaId,
            PessoaId = dto.PessoaId
        };

        _db.Transacoes.Add(transacao);
        await _db.SaveChangesAsync();

        // Recarrega com includes para retornar o DTO completo
        await _db.Entry(transacao).Reference(t => t.Categoria).LoadAsync();
        await _db.Entry(transacao).Reference(t => t.Pessoa).LoadAsync();

        return (MapToDto(transacao), null);
    }

    /// <summary>
    /// Verifica se o tipo da transação é compatível com a finalidade da categoria.
    /// Retorna mensagem de erro ou null se compatível.
    /// </summary>
    private static string? ValidarCompatibilidadeCategoria(TipoTransacao tipo, FinalidadeCategoria finalidade)
    {
        // Categoria "Ambas" é sempre compatível
        if (finalidade == FinalidadeCategoria.Ambas) return null;

        // Transação Despesa não pode usar categoria de Receita
        if (tipo == TipoTransacao.Despesa && finalidade == FinalidadeCategoria.Receita)
            return "Transação do tipo 'Despesa' não pode usar uma categoria de finalidade 'Receita'.";

        // Transação Receita não pode usar categoria de Despesa
        if (tipo == TipoTransacao.Receita && finalidade == FinalidadeCategoria.Despesa)
            return "Transação do tipo 'Receita' não pode usar uma categoria de finalidade 'Despesa'.";

        return null;
    }

    /// <summary>Mapeia a entidade Transacao para o DTO de saída.</summary>
    private static TransacaoDto MapToDto(Transacao t) => new(
        t.Id,
        t.Descricao,
        t.Valor,
        t.Tipo,
        new CategoriaDto(t.Categoria.Id, t.Categoria.Descricao, t.Categoria.Finalidade),
        new PessoaDto(t.Pessoa.Id, t.Pessoa.Nome, t.Pessoa.Idade)
    );
}
