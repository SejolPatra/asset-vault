import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // If no token exists, redirect the user to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child component (e.g., Dashboard)
  return children;
}