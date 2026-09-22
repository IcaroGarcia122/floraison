import React, { useState } from 'react';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

export const AuthPage: React.FC = () => {
  const { signIn, signUp, signInWithGoogle } = useApp();
  const toast = useToast();

  const [tab, setTab] = useState<'entrar' | 'criar'>('entrar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === 'entrar') {
        const res = await signIn(email, password);
        if (!res.success) {
          throw new Error(res.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
        }
        toast.success('Acesso autorizado! Bem-vindo de volta.');
      } else {
        const res = await signUp(email, password);
        if (!res.success) {
          throw new Error(res.error || 'Não foi possível criar sua conta');
        }
        toast.success('Conta criada. Verifique seu e-mail para confirmar o acesso.');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível entrar');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        toast.error('Não foi possível entrar com o Google');
        return;
      }
      toast.success('Login com Google realizado com sucesso!');
    } catch {
      toast.error('Não foi possível entrar com o Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('floraison123');
    setTab('entrar');
  };

  return (
    <main id="auth-page" className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="glass w-full max-w-md rounded-[34px] p-7 transition-all">
        {/* Logo Floraison */}
        <img
          src="/assets/floraison-logo.png"
          alt="Floraison"
          className="mx-auto h-9 w-auto opacity-95"
          draggable={false}
        />

        {/* Title & Subtitle */}
        <h1 className="mt-6 text-center text-lg font-semibold tracking-tight text-foreground">
          Acesso da equipe
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          Painel interno de clientes da Floraison.
        </p>

        {/* Segmented Switcher */}
        <div className="glass-soft mt-6 flex items-center gap-1 rounded-full p-1.5">
          {(['entrar', 'criar'] as const).map((key) => (
            <button
              key={key}
              type="button"
              id={`tab-${key}`}
              onClick={() => setTab(key)}
              className={`press flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${
                tab === key ? 'glass-tint text-primary' : 'text-muted-foreground'
              }`}
            >
              {key === 'entrar' ? 'Entrar' : 'Criar conta'}
            </button>
          ))}
        </div>

        {/* Auth Form */}
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-[13px] font-semibold text-foreground/80">
              E-mail
            </label>
            <input
              id="auth-email-input"
              className="glass-field w-full rounded-2xl px-4 py-3.5 text-[15px] text-foreground transition-all"
              type="email"
              required
              placeholder="voce@floraison.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold text-foreground/80">
              Senha
            </label>
            <input
              id="auth-password-input"
              className="glass-field w-full rounded-2xl px-4 py-3.5 text-[15px] text-foreground transition-all"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="glass-ink press mt-1 flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-semibold text-primary-foreground disabled:opacity-70"
          >
            {loading ? (
              <LoaderCircle className="size-[18px] animate-spin" />
            ) : null}
            {tab === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        {/* Google OAuth Button */}
        <button
          id="auth-google-btn"
          type="button"
          disabled={googleLoading}
          onClick={handleGoogleAuth}
          className="glass press mt-3 flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 text-sm font-semibold text-foreground hover:bg-white/40"
        >
          {googleLoading ? (
            <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          Continuar com Google
        </button>

        {/* Quick Demo Access Bar */}
        <div className="mt-6 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="size-3 text-leaf" />
              Acesso rápido da equipe:
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('icaroeeitaloce@gmail.com')}
              className="glass-soft press rounded-full px-3 py-1.5 text-xs font-semibold text-primary hover:bg-white/50"
            >
              Icaro (icaroeeitaloce@gmail.com)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('raysson@floraison.com')}
              className="glass-soft press rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Raysson
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
