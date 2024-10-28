import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { AtendentePage } from '../pages/Atendente';
import { Painel } from '../pages/Painel';
import { EmitirSenhaPage } from '../pages/EmitirSenhaPage';
import { ProtectedRouter } from '../components/ProtectedRouter';
import { Dashboard } from '../pages/admin/Dashboard';
import { AtendenteAdmin } from '../pages/admin/AtendenteAdmin';
import { AddServicePage } from '../pages/admin/AddServicePage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <ProtectedRouter element={<AtendentePage />} />
  },
  {
    path: '/dashboard',
    element: <ProtectedRouter element={<Dashboard />} />,
  },
  {
    path: '/dashboard/atendentes',
    element: <ProtectedRouter element={<AtendenteAdmin />} />
  },
  {
    path: '/dashboard/servicos',
    element: <ProtectedRouter element={<AddServicePage />} />
  },
  {
    path: '/painel',
    element: <Painel />
  },
  {
    path: '/emitir-senha',
    element: <EmitirSenhaPage />
  },
]);
