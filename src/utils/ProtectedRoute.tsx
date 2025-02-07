import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface ProtectedRouteProps {
  isAdmin?: boolean; // Optionnel : définir si la route nécessite un rôle admin
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAdmin }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Vous pouvez afficher un loader ici pendant que vous vérifiez l'authentification
    return <div>Loading...</div>;
  }

  if (!user) {
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de login
    return <Navigate to="/login" />;
  }

  if (isAdmin && !user.isAdmin) {
    // Si l'utilisateur n'est pas un admin et que la page nécessite un admin, rediriger vers une page d'erreur ou la page d'accueil
    return <Navigate to="/" />;
  }

  return <Outlet />; // Si tout est OK, afficher les enfants de la route protégée
};

export default ProtectedRoute;
