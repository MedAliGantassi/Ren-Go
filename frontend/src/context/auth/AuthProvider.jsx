import { useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';

const getStoredUser = () => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('connexion');

  const openAuthModal = (tab = 'connexion') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = (nextUser, token) => {
    setUser(nextUser);
    localStorage.setItem('user', JSON.stringify(nextUser));
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const switchRole = async (targetRole) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/switch-role', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: targetRole })
      });
      
      const data = await response.json();
      if (data.success) {
        login(data.user, data.token); // update the context and local storage
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error switching role:", err);
      return false;
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      switchRole,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal
    }),
    [user, isAuthModalOpen, authModalTab]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
