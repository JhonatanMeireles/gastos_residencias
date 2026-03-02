namespace GastosResidenciais.API.Models;

/// <summary>
/// Representa uma pessoa no sistema de controle de gastos.
/// </summary>
public class Pessoa
{
    /// <summary>Identificador único gerado automaticamente.</summary>
    public int Id { get; set; }

    /// <summary>Nome da pessoa (máximo 200 caracteres).</summary>
    public string Nome { get; set; } = string.Empty;

    /// <summary>Idade da pessoa. Menores de 18 anos só podem ter despesas.</summary>
    public int Idade { get; set; }

    /// <summary>Lista de transações vinculadas à pessoa (cascade delete).</summary>
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}
