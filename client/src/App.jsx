import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import Centers from './pages/Centers.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewRequest from './pages/NewRequest.jsx';
import Admin from './pages/Admin.jsx';
function NotFound(){return <div className="px-4 py-24 text-center"><h1 className="text-3xl font-black">Page not found</h1><p className="mt-3 text-slate-500">The page you are looking for does not exist.</p><a className="mt-5 inline-block font-bold text-forest" href="/">Return home</a></div>}
export default function App(){return <Layout><Routes>
 <Route path="/" element={<Home/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/centers" element={<Centers/>}/>
 <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path="/new-request" element={<ProtectedRoute><NewRequest/></ProtectedRoute>}/><Route path="/admin" element={<ProtectedRoute admin><Admin/></ProtectedRoute>}/>
 <Route path="/requests" element={<Navigate to="/dashboard" replace/>}/><Route path="*" element={<NotFound/>}/>
 </Routes></Layout>}
