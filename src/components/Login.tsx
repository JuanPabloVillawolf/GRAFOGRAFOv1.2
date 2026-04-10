import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, LogIn, Coffee } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function Login({ onLogin, isLoading, error }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-parchment overflow-hidden"
      >
        <div className="bg-espresso p-8 text-cream text-center space-y-4">
          <div className="w-16 h-16 bg-cream/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
            <Coffee size={32} className="text-gold" />
          </div>
          <div>
            <h1 className="font-serif text-2xl">Grafógrafo</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-dust uppercase tracking-wider ml-1">Usuario</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dust" />
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-parchment/30 border border-mist rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-bark transition-colors"
                  placeholder="Ingresa tu usuario"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-dust uppercase tracking-wider ml-1">Contraseña</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dust" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-parchment/30 border border-mist rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-bark transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-espresso text-cream rounded-xl py-3.5 font-bold text-sm uppercase tracking-widest hover:bg-bark transition-all shadow-lg shadow-espresso/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
