using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.API.Controllers;

/// <summary>
/// Controller responsável pelo cadastro de categorias.
/// Expõe endpoints de criação e listagem.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly CategoriaService _service;

    public CategoriasController(CategoriaService service)
    {
        _service = service;
    }

    /// <summary>Lista todas as categorias cadastradas.</summary>
    [HttpGet]
    public async Task<IActionResult> Listar() =>
        Ok(await _service.ListarAsync());

    /// <summary>Cria uma nova categoria com descrição e finalidade.</summary>
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarCategoriaDto dto)
    {
        var (categoria, erro) = await _service.CriarAsync(dto);
        if (erro is not null) return BadRequest(erro);
        return Created($"/api/categorias/{categoria!.Id}", categoria);
    }
}
