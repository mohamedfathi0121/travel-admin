import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Adjust the import path as necessary

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
