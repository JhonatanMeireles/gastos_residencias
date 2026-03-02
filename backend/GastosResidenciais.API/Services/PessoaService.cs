using GastosResidenciais.API.Data;
using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Serviço responsável pela lógica de negócio do cadastro de pessoas.
/// Encapsula operações de CRUD e protege as regras de validação.
/// </summary>
public class PessoaService
{
    private readonly AppDbContext _db;

    public PessoaService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>Retorna todas as pessoas cadastradas.</summary>
    public async Task<IEnumerable<PessoaDto>> ListarAsync()
    {
        return await _db.Pessoas
            .Select(p => new PessoaDto(p.Id, p.Nome, p.Idade))
            .ToListAsync();
    }

    /// <summary>Retorna uma pessoa pelo ID, ou null se não encontrada.</summary>
    public async Task<PessoaDto?> ObterPorIdAsync(int id)
    {
        var p = await _db.Pessoas.FindAsync(id);
        return p is null ? null : new PessoaDto(p.Id, p.Nome, p.Idade);
    }

    /// <summary>
    /// Cria uma nova pessoa após validar nome e idade.
    /// </summary>
    public async Task<(PessoaDto? Pessoa, string? Erro)> CriarAsync(CriarPessoaDto dto)
    {
        var erro = Validar(dto.Nome, dto.Idade);
        if (erro is not null) return (null, erro);

        var pessoa = new Pessoa { Nome = dto.Nome.Trim(), Idade = dto.Idade };
        _db.Pessoas.Add(pessoa);
        await _db.SaveChangesAsync();

        return (new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade), null);
    }

    /// <summary>
    /// Atualiza os dados de uma pessoa existente.
    /// </summary>
    public async Task<(PessoaDto? Pessoa, string? Erro)> EditarAsync(int id, EditarPessoaDto dto)
    {
        var pessoa = await _db.Pessoas.FindAsync(id);
        if (pessoa is null) return (null, "Pessoa não encontrada.");

        var erro = Validar(dto.Nome, dto.Idade);
        if (erro is not null) return (null, erro);

        pessoa.Nome = dto.Nome.Trim();
        pessoa.Idade = dto.Idade;
        await _db.SaveChangesAsync();

        return (new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade), null);
    }

    /// <summary>
    /// Remove uma pessoa e todas as suas transações (via cascade delete no banco).
    /// </summary>
    public async Task<string?> DeletarAsync(int id)
    {
        var pessoa = await _db.Pessoas.FindAsync(id);
        if (pessoa is null) return "Pessoa não encontrada.";

        _db.Pessoas.Remove(pessoa);
        await _db.SaveChangesAsync();
        return null;
    }

    /// <summary>Valida nome e idade, retornando mensagem de erro ou null se válido.</summary>
    private static string? Validar(string nome, int idade)
    {
        if (string.IsNullOrWhiteSpace(nome)) return "Nome é obrigatório.";
        if (nome.Length > 200) return "Nome deve ter no máximo 200 caracteres.";
        if (idade < 0) return "Idade deve ser um valor positivo.";
        return null;
    }
}
