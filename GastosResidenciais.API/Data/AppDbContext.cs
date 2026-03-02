using GastosResidenciais.API.Models;
using Microsoft.EntityFrameworkCore;

namespace GastosResidenciais.API.Data;

/// <summary>
/// Contexto principal do Entity Framework Core.
/// Gerencia a conexão com o banco SQLite e define as entidades mapeadas.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    /// <summary>Tabela de pessoas cadastradas.</summary>
    public DbSet<Pessoa> Pessoas { get; set; }

    /// <summary>Tabela de categorias de transações.</summary>
    public DbSet<Categoria> Categorias { get; set; }

    /// <summary>Tabela de transações financeiras.</summary>
    public DbSet<Transacao> Transacoes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuração da entidade Pessoa
        modelBuilder.Entity<Pessoa>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Nome).IsRequired().HasMaxLength(200);
            e.Property(p => p.Idade).IsRequired();

            // Ao deletar uma pessoa, todas as suas transações são removidas (cascade delete)
            e.HasMany(p => p.Transacoes)
             .WithOne(t => t.Pessoa)
             .HasForeignKey(t => t.PessoaId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuração da entidade Categoria
        modelBuilder.Entity<Categoria>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Descricao).IsRequired().HasMaxLength(400);
            e.Property(c => c.Finalidade).IsRequired();
        });

        // Configuração da entidade Transacao
        modelBuilder.Entity<Transacao>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Descricao).IsRequired().HasMaxLength(400);
            e.Property(t => t.Valor).IsRequired().HasColumnType("decimal(18,2)");
            e.Property(t => t.Tipo).IsRequired();

            // Relacionamento com Categoria (sem cascade para evitar múltiplos caminhos)
            e.HasOne(t => t.Categoria)
             .WithMany(c => c.Transacoes)
             .HasForeignKey(t => t.CategoriaId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        base.OnModelCreating(modelBuilder);
    }
}
