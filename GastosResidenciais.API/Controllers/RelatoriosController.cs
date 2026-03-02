using GastosResidenciais.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GastosResidenciais.API.Controllers;

/// <summary>
/// Controller responsável pelas consultas de totais financeiros.
/// Fornece relatórios consolidados por pessoa e por categoria.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RelatoriosController : ControllerBase
{
    private readonly RelatorioService _service;

    public RelatoriosController(RelatorioService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retorna o total de receitas, despesas e saldo de cada pessoa,
    /// mais o total geral consolidado.
    /// </summary>
    [HttpGet("totais-por-pessoa")]
    public async Task<IActionResult> TotaisPorPessoa() =>
        Ok(await _service.TotaisPorPessoaAsync());

    /// <summary>
    /// Retorna o total de receitas, despesas e saldo de cada categoria,
    /// mais o total geral consolidado.
    /// </summary>
    [HttpGet("totais-por-categoria")]
    public async Task<IActionResult> TotaisPorCategoria() =>
        Ok(await _service.TotaisPorCategoriaAsync());
}
