using GastosResidenciais.API.DTOs;
using GastosResidenciais.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.API.Controllers;

/// <summary>
/// Controller responsável pelo cadastro de transações financeiras.
/// Expõe endpoints de criação e listagem.
/// As validações de negócio são delegadas ao TransacaoService.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly TransacaoService _service;

    public TransacoesController(TransacaoService service)
    {
        _service = service;
    }

    /// <summary>Lista todas as transações com informações de pessoa e categoria.</summary>
    [HttpGet]
    public async Task<IActionResult> Listar() =>
        Ok(await _service.ListarAsync());

    /// <summary>
    /// Cria uma nova transação aplicando as seguintes regras:
    /// - Menor de idade só pode ter despesas;
    /// - Categoria deve ser compatível com o tipo da transação;
    /// - Valor deve ser positivo.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarTransacaoDto dto)
    {
        var (transacao, erro) = await _service.CriarAsync(dto);
        if (erro is not null) return BadRequest(erro);
        return Created($"/api/transacoes/{transacao!.Id}", transacao);
    }
}
