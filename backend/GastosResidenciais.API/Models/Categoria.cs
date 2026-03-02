namespace GastosResidenciais.API.Models;

/// <summary>
/// Define para qual finalidade uma categoria pode ser utilizada nas transações.
/// </summary>
public enum FinalidadeCategoria
{
    /// <summary>Categoria exclusiva para despesas.</summary>
    Despesa = 1,

    /// <summary>Categoria exclusiva para receitas.</summary>
    Receita = 2,

    /// <summary>Categoria que pode ser usada tanto para despesas quanto para receitas.</summary>
    Ambas = 3
}

/// <summary>
/// Representa uma categoria de transação financeira.
/// </summary>
public class Categoria
{
    /// <summary>Identificador único gerado automaticamente.</summary>
    public int Id { get; set; }

    /// <summary>Descrição da categoria (máximo 400 caracteres).</summary>
    public string Descricao { get; set; } = string.Empty;

    /// <summary>
    /// Finalidade da categoria: Despesa, Receita ou Ambas.
    /// Restringe quais tipos de transação podem usar esta categoria.
    /// </summary>
    public FinalidadeCategoria Finalidade { get; set; }

    /// <summary>Transações vinculadas a esta categoria.</summary>
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}
