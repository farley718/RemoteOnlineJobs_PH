
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Role } from '../types';
import { storage } from '../services/storage';
import { User as UserIcon, Mail, Lock, Building, UserCircle } from 'lucide-react';

interface AuthPageProps {
  setUser: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ setUser }) => {
  const { mode } = useParams<{ mode: string }>();
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(Role.FREELANCER);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = storage.getUsers();

    if (isLogin) {
      const user = users.find(u => u.email === email);
      if (user) {
        setUser(user);
        localStorage.setItem('pinoywork_current_user', JSON.stringify(user));
        navigate(user.role === Role.FREELANCER ? '/freelancer' : '/employer');
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (users.some(u => u.email === email)) {
        setError('User already exists');
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
        skills: [],
        bio: '',
        companyName: role === Role.EMPLOYER ? name : undefined
      };
      users.push(newUser);
      storage.setUsers(users);
      setUser(newUser);
      localStorage.setItem('pinoywork_current_user', JSON.stringify(newUser));
      navigate(role === Role.FREELANCER ? '/freelancer' : '/employer');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-500 mt-2">
            {isLogin ? 'Enter your details to access your dashboard' : 'Join thousands of Filipino workers and global employers'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                <button 
                  type="button"
                  onClick={() => setRole(Role.FREELANCER)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === Role.FREELANCER ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                  Worker
                </button>
                <button 
                  type="button"
                  onClick={() => setRole(Role.EMPLOYER)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === Role.EMPLOYER ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                  Employer
                </button>
              </div>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder={role === Role.EMPLOYER ? "Company Name" : "Full Name"} 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 mt-4 active:scale-95"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Link to={isLogin ? '/auth/signup' : '/auth/login'} className="text-blue-600 font-bold ml-1 hover:underline">
              {isLogin ? 'Sign Up' : 'Log In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
