using GastosResidenciais.API.Data;
using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Services;

/// <summary>
/// Serviço responsável pela lógica de negócio do cadastro de categorias.
/// </summary>
public class CategoriaService
{
    private readonly AppDbContext _db;

    public CategoriaService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>Retorna todas as categorias cadastradas.</summary>
    public async Task<IEnumerable<CategoriaDto>> ListarAsync()
    {
        return await _db.Categorias
            .Select(c => new CategoriaDto(c.Id, c.Descricao, c.Finalidade))
            .ToListAsync();
    }

    /// <summary>
    /// Cria uma nova categoria após validar descrição e finalidade.
    /// </summary>
    public async Task<(CategoriaDto? Categoria, string? Erro)> CriarAsync(CriarCategoriaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Descricao))
            return (null, "Descrição é obrigatória.");

        if (dto.Descricao.Length > 400)
            return (null, "Descrição deve ter no máximo 400 caracteres.");

        if (!Enum.IsDefined(typeof(FinalidadeCategoria), dto.Finalidade))
            return (null, "Finalidade inválida.");

        var categoria = new Categoria { Descricao = dto.Descricao.Trim(), Finalidade = dto.Finalidade };
        _db.Categorias.Add(categoria);
        await _db.SaveChangesAsync();

        return (new CategoriaDto(categoria.Id, categoria.Descricao, categoria.Finalidade), null);
    }
}
