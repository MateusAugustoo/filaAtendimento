import { Navigate } from "react-router-dom";

interface ProtectedRouterProps {
  element: JSX.Element;
  requiredRole?: "admin" | "attendant"; // Adicione a propriedade opcional de papel
}

export function ProtectedRouter({ element, requiredRole }: ProtectedRouterProps) {
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Obtenha o usuário do localStorage
  const isAuthenticated = !!localStorage.getItem('authToken');
  
  const hasRequiredRole = requiredRole ? user.role === requiredRole : true;

  if (!isAuthenticated) {
    return <Navigate to={'/login'} />;
  }

  if (requiredRole && !hasRequiredRole) {
    return <Navigate to={'/'} />;
  }

  return element;
}
