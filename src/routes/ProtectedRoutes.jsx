import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect will run when the loading or user state changes.
    if (!loading && !user) {
      // If loading is complete and there is still no authenticated user,
      // perform the redirect.
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]); // The effect depends on these values

  // While the auth state is being determined, show a loading indicator.
  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  // If a user is authenticated, render the nested routes.
  // Otherwise, render nothing while the useEffect redirects.
  return user ? <Outlet /> : null;
};

export default ProtectedRoute;
