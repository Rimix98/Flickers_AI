import { useState } from 'react';
import './Auth.css';

export default function Auth({ onLogin, translations }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Ошибка');
      }

      // Сохраняем токен
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);

      onLogin(data.token, data.username);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M30 50 L45 65 L70 35" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1>Flickers AI</h1>
        <p className="auth-subtitle">
          {isLogin ? translations.loginSubtitle : translations.registerSubtitle}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>{translations.username}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={translations.usernamePlaceholder}
              required
              minLength={3}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>{translations.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={translations.passwordPlaceholder}
              required
              minLength={4}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? translations.loading : (isLogin ? translations.login : translations.register)}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? translations.noAccount : translations.haveAccount}
          {' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="auth-switch-button"
          >
            {isLogin ? translations.register : translations.login}
          </button>
        </div>
      </div>
    </div>
  );
}
