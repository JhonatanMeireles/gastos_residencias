import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PessoasPage from './pages/PessoasPage';
import CategoriasPage from './pages/CategoriasPage';
import TransacoesPage from './pages/TransacoesPage';
import RelatoriosPage from './pages/RelatoriosPage';

/**
 * Componente raiz da aplicação.
 * Configura o roteamento principal com React Router v6.
 * A rota "/" redireciona automaticamente para "/pessoas".
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/pessoas" replace />} />
          <Route path="pessoas" element={<PessoasPage />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="transacoes" element={<TransacoesPage />} />
          <Route path="relatorios" element={<RelatoriosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
