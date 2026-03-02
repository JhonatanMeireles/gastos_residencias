using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.API.Controllers;

/// <summary>
/// Controller responsável pelo cadastro de pessoas.
/// Expõe endpoints CRUD: listar, obter por ID, criar, editar e deletar.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly PessoaService _service;

    public PessoasController(PessoaService service)
    {
        _service = service;
    }

    /// <summary>Lista todas as pessoas cadastradas.</summary>
    [HttpGet]
    public async Task<IActionResult> Listar() =>
        Ok(await _service.ListarAsync());

    /// <summary>Obtém uma pessoa pelo seu identificador.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var pessoa = await _service.ObterPorIdAsync(id);
        return pessoa is null ? NotFound("Pessoa não encontrada.") : Ok(pessoa);
    }

    /// <summary>Cria uma nova pessoa.</summary>
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarPessoaDto dto)
    {
        var (pessoa, erro) = await _service.CriarAsync(dto);
        if (erro is not null) return BadRequest(erro);
        return CreatedAtAction(nameof(ObterPorId), new { id = pessoa!.Id }, pessoa);
    }

    /// <summary>Edita os dados de uma pessoa existente.</summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Editar(int id, [FromBody] EditarPessoaDto dto)
    {
        var (pessoa, erro) = await _service.EditarAsync(id, dto);
        if (erro == "Pessoa não encontrada.") return NotFound(erro);
        if (erro is not null) return BadRequest(erro);
        return Ok(pessoa);
    }

    /// <summary>
    /// Remove uma pessoa e todas as suas transações (cascade delete).
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var erro = await _service.DeletarAsync(id);
        if (erro is not null) return NotFound(erro);
        return NoContent();
    }
}
