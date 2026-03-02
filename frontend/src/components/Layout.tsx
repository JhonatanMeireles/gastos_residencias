import { NavLink, Outlet } from 'react-router-dom';

/**
 * Layout principal da aplicação.
 * Contém o menu de navegação lateral e a área de conteúdo (<Outlet>).
 */
export default function Layout() {
  const linkBase =
    'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors';
  const linkAtivo = 'bg-blue-600 text-white';
  const linkInativo = 'text-gray-600 hover:bg-gray-100';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Barra lateral ── */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col py-6 px-3 gap-1 fixed h-full">
        <div className="px-3 mb-6">
          <h1 className="text-base font-bold text-gray-800">🏠 Gastos</h1>
          <p className="text-xs text-gray-400">Controle residencial</p>
        </div>

        <NavLink
          to="/pessoas"
          className={({ isActive }) => `${linkBase} ${isActive ? linkAtivo : linkInativo}`}
        >
          👤 Pessoas
        </NavLink>

        <NavLink
          to="/categorias"
          className={({ isActive }) => `${linkBase} ${isActive ? linkAtivo : linkInativo}`}
        >
          🏷️ Categorias
        </NavLink>

        <NavLink
          to="/transacoes"
          className={({ isActive }) => `${linkBase} ${isActive ? linkAtivo : linkInativo}`}
        >
          💸 Transações
        </NavLink>

        <NavLink
          to="/relatorios"
          className={({ isActive }) => `${linkBase} ${isActive ? linkAtivo : linkInativo}`}
        >
          📊 Relatórios
        </NavLink>
      </aside>

      {/* ── Área de conteúdo ── */}
      <main className="ml-56 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
