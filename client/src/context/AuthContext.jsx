import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem('ewaste_token')) { setLoading(false); return; }
    api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => localStorage.removeItem('ewaste_token')).finally(() => setLoading(false));
  }, []);
  const authenticate = (data) => { localStorage.setItem('ewaste_token', data.token); setUser(data.user); };
  const logout = () => { localStorage.removeItem('ewaste_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, authenticate, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
