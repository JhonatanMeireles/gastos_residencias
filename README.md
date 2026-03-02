# 🏠 Gastos Residenciais

Sistema de controle de gastos residenciais com Web API em C# .NET 8 e front-end em React + TypeScript.

---

## 📁 Estrutura do Projeto

```
GastosResidenciais/
├── backend/
│   └── GastosResidenciais.API/
│       ├── Controllers/       # Endpoints HTTP (entrada de dados)
│       ├── Services/          # Lógica de negócio
│       ├── Models/            # Entidades do domínio
│       ├── DTOs/              # Objetos de transferência de dados
│       ├── Data/              # DbContext (Entity Framework Core)
│       ├── Program.cs         # Configuração da aplicação e DI
│       └── appsettings.json   # Configurações (conexão com banco)
│
└── frontend/
    └── src/
        ├── pages/             # Páginas da aplicação
        ├── components/        # Componentes reutilizáveis (Layout)
        ├── services/          # Camada de comunicação com a API
        ├── types/             # Tipagem TypeScript
        ├── hooks/             # Hooks customizados
        └── utils/             # Utilitários (formatação de moeda etc.)
```

---

## 🚀 Como executar

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)

---

### 1. Backend (Web API)

```bash
cd backend/GastosResidenciais.API

# Restaurar pacotes e executar
dotnet run
```

A API estará disponível em `http://localhost:5001`.  
A documentação Swagger estará em `http://localhost:5001/swagger`.

> O banco de dados SQLite (`gastos.db`) é criado automaticamente na primeira execução.

---

### 2. Frontend (React)

```bash
cd frontend

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

O front-end estará disponível em `http://localhost:5173`.

> O Vite está configurado com proxy para redirecionar chamadas `/api` ao backend em `http://localhost:5001`.

---

## 📋 Funcionalidades

### Pessoas
- Cadastrar, editar, listar e excluir pessoas
- Ao excluir uma pessoa, **todas as suas transações são removidas automaticamente** (cascade delete)
- Nome: máximo 200 caracteres
- Menores de 18 anos são sinalizados na interface

### Categorias
- Cadastrar e listar categorias
- Cada categoria possui uma **finalidade**: `Despesa`, `Receita` ou `Ambas`
- A finalidade restringe quais transações podem usar a categoria
- Descrição: máximo 400 caracteres

### Transações
- Cadastrar e listar transações
- **Regras de negócio:**
  - Menores de 18 anos **só podem ter transações do tipo Despesa**
  - A categoria escolhida deve ser **compatível com o tipo da transação**:
    - Tipo `Despesa` → não aceita categorias com finalidade `Receita`
    - Tipo `Receita` → não aceita categorias com finalidade `Despesa`
    - Categorias com finalidade `Ambas` → aceitas em qualquer tipo
  - Valor deve ser **positivo**
- Descrição: máximo 400 caracteres

### Relatórios
- **Totais por Pessoa**: receitas, despesas e saldo de cada pessoa + total geral consolidado
- **Totais por Categoria**: receitas, despesas e saldo de cada categoria + total geral consolidado
- Fórmula do saldo: `Receitas - Despesas`

---

## 🛠️ Tecnologias utilizadas

| Camada       | Tecnologia                          |
|-------------|-------------------------------------|
| Back-end     | C# 12 / .NET 8 / ASP.NET Core       |
| ORM          | Entity Framework Core 8             |
| Banco        | SQLite (persistente entre execuções)|
| Documentação | Swagger / Swashbuckle               |
| Front-end    | React 18 + TypeScript               |
| Build        | Vite 5                              |
| Estilo       | Tailwind CSS 3                      |
| HTTP Client  | Axios                               |
| Roteamento   | React Router v6                     |

---

## 🗂️ Endpoints da API

### Pessoas
| Método | Rota                | Descrição                        |
|--------|---------------------|----------------------------------|
| GET    | /api/pessoas        | Lista todas as pessoas           |
| GET    | /api/pessoas/{id}   | Retorna uma pessoa pelo ID       |
| POST   | /api/pessoas        | Cria uma nova pessoa             |
| PUT    | /api/pessoas/{id}   | Edita uma pessoa existente       |
| DELETE | /api/pessoas/{id}   | Remove pessoa e suas transações  |

### Categorias
| Método | Rota               | Descrição                    |
|--------|--------------------|------------------------------|
| GET    | /api/categorias    | Lista todas as categorias    |
| POST   | /api/categorias    | Cria uma nova categoria      |

### Transações
| Método | Rota               | Descrição                    |
|--------|--------------------|------------------------------|
| GET    | /api/transacoes    | Lista todas as transações    |
| POST   | /api/transacoes    | Cria uma nova transação      |

### Relatórios
| Método | Rota                               | Descrição                        |
|--------|------------------------------------|----------------------------------|
| GET    | /api/relatorios/totais-por-pessoa  | Totais agrupados por pessoa      |
| GET    | /api/relatorios/totais-por-categoria | Totais agrupados por categoria |

---

## 🏗️ Decisões de arquitetura

- **Separação por camadas**: Controllers apenas recebem e respondem requisições HTTP. A lógica de negócio fica nos Services, mantendo o código coeso e testável.
- **DTOs**: Evitam exposição direta das entidades do banco, garantindo controle sobre o que entra e sai da API.
- **SQLite**: Escolhido por ser serverless, portátil e suficiente para o escopo do projeto. Os dados persistem no arquivo `gastos.db`.
- **Cascade Delete**: Configurado no `AppDbContext` para garantir que ao remover uma pessoa, todas as suas transações sejam excluídas automaticamente pelo banco.
- **Enums como string**: Configurado no `Program.cs` para que os enums sejam serializados como texto (`"Despesa"`, `"Receita"`, `"Ambas"`), facilitando o consumo pelo front-end.
- **Proxy Vite**: Em desenvolvimento, o Vite redireciona chamadas `/api` para o backend, evitando problemas de CORS.
