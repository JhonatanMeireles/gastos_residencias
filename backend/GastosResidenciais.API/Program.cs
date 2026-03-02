using GastosResidenciais.API.Data;
using GastosResidenciais.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ─── Banco de dados ───────────────────────────────────────────────────────────
// Utilizamos SQLite para persistência simples sem necessidade de servidor externo.
// O arquivo gastos.db será criado na raiz do projeto.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")
        ?? "Data Source=gastos.db"));

// ─── Injeção de dependência dos serviços ─────────────────────────────────────
builder.Services.AddScoped<PessoaService>();
builder.Services.AddScoped<CategoriaService>();
builder.Services.AddScoped<TransacaoService>();
builder.Services.AddScoped<RelatorioService>();

// ─── Controllers e Swagger ───────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        // Serializa enums como strings para facilitar leitura no front-end
        opts.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Gastos Residenciais API", Version = "v1" });
});

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Permite requisições do front-end React em desenvolvimento
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// ─── Migrações automáticas ────────────────────────────────────────────────────
// Aplica migrações pendentes ao iniciar a aplicação, garantindo que o banco
// esteja sempre atualizado sem intervenção manual.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); // Para SQLite, EnsureCreated é suficiente sem migrations
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();
