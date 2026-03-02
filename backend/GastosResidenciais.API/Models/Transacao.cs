namespace GastosResidenciais.API.Models;

/// <summary>
/// Define o tipo de uma transação financeira.
/// </summary>
public enum TipoTransacao
{
    /// <summary>Saída de dinheiro (gasto).</summary>
    Despesa = 1,

    /// <summary>Entrada de dinheiro (ganho).</summary>
    Receita = 2
}

/// <summary>
/// Representa uma transação financeira (despesa ou receita) de uma pessoa.
/// </summary>
public class Transacao
{
    /// <summary>Identificador único gerado automaticamente.</summary>
    public int Id { get; set; }

    /// <summary>Descrição da transação (máximo 400 caracteres).</summary>
    public string Descricao { get; set; } = string.Empty;

    /// <summary>Valor da transação. Deve ser um número positivo.</summary>
    public decimal Valor { get; set; }

    /// <summary>Tipo da transação: Despesa ou Receita.</summary>
    public TipoTransacao Tipo { get; set; }

    /// <summary>Chave estrangeira para a categoria.</summary>
    public int CategoriaId { get; set; }

    /// <summary>Categoria associada à transação.</summary>
    public Categoria Categoria { get; set; } = null!;

    /// <summary>Chave estrangeira para a pessoa.</summary>
    public int PessoaId { get; set; }

    /// <summary>Pessoa a qual a transação pertence.</summary>
    public Pessoa Pessoa { get; set; } = null!;
}
