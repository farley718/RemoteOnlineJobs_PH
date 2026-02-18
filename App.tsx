
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { User, Role, Job } from './types';
import { storage } from './services/storage';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import FreelancerDashboard from './pages/FreelancerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import { Briefcase, User as UserIcon, LogOut, Search } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('pinoywork_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pinoywork_current_user');
    setUser(null);
    window.location.hash = '/';
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:bg-blue-700 transition-colors">
                RJ
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">remotejobs<span className="text-blue-600">.com.ph</span></span>
            </Link>

            <div className="flex items-center gap-6">
              {!user ? (
                <>
                  <Link to="/auth/login" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Login</Link>
                  <Link to="/auth/signup" className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95">Join Platform</Link>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to={user.role === Role.FREELANCER ? "/freelancer" : "/employer"} className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium">
                    <Briefcase size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-medium transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/:mode" element={<AuthPage setUser={setUser} />} />
            <Route 
              path="/freelancer/*" 
              element={user?.role === Role.FREELANCER ? <FreelancerDashboard user={user} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/employer/*" 
              element={user?.role === Role.EMPLOYER ? <EmployerDashboard user={user} /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>

        <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-white text-lg font-bold mb-4">remotejobs.com.ph</h3>
              <p className="text-sm leading-relaxed max-w-sm">
                The world's premier platform for connecting talented Filipino professionals with global opportunities. 
                Dedicated to empowering OFWs and online freelancers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Workers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/auth/signup" className="hover:text-white">Find Jobs</Link></li>
                <li><Link to="/auth/signup" className="hover:text-white">Create Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/auth/signup" className="hover:text-white">Post a Job</Link></li>
                <li><Link to="/auth/signup" className="hover:text-white">Browse Talent</Link></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-sm text-center">
            &copy; {new Date().getFullYear()} remotejobs.com.ph Platform. Proudly Filipino.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
