import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Recycle, Menu, LogOut, UserRound, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';
export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/'); setMenu(false); };
  const navClass = ({ isActive }) => `rounded-full px-3 py-2 text-sm font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'text-slate-600 hover:bg-slate-100'}`;
  return <div className="min-h-screen">
    <header className="sticky top-0 z-20 border-b border-green-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-forest"><span className="rounded-xl bg-green-100 p-2"><Recycle size={22}/></span>ReLoop<span className="hidden text-xs font-medium text-slate-400 sm:inline">E-WASTE RECYCLING</span></Link>
        <button className="rounded-lg p-2 md:hidden" onClick={() => setMenu(!menu)} aria-label="Toggle navigation"><Menu/></button>
        <nav className={`${menu ? 'absolute left-0 right-0 top-full flex flex-col border-b bg-white p-4 shadow-lg' : 'hidden'} gap-2 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <NavLink to="/" className={navClass} onClick={() => setMenu(false)}>Home</NavLink>
          <NavLink to="/centers" className={navClass} onClick={() => setMenu(false)}>Centers</NavLink>
          {user && <NavLink to={user.role === 'admin' ? '/admin' : '/dashboard'} className={navClass} onClick={() => setMenu(false)}><span className="inline-flex items-center gap-1"><LayoutDashboard size={15}/>{user.role === 'admin' ? 'Admin' : 'Dashboard'}</span></NavLink>}
          {!user ? <><Link to="/login" className="rounded-full px-4 py-2 text-sm font-bold text-forest" onClick={() => setMenu(false)}>Log in</Link><Link to="/register" className="rounded-full bg-forest px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-green-800" onClick={() => setMenu(false)}>Get started</Link></> :
            <><span className="px-3 text-sm text-slate-500"><UserRound size={14} className="mr-1 inline"/>{user.name}</span><button onClick={signOut} className="flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-slate-50"><LogOut size={15}/> Log out</button></>}
        </nav>
      </div>
    </header>
    <main>{children}</main>
    <footer className="mt-20 border-t border-green-100 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6"><p className="font-bold text-forest"><Recycle size={16} className="mr-2 inline"/>ReLoop · Give electronics a second life.</p><p>Recycle responsibly. Protect tomorrow.</p></div></footer>
  </div>;
}
