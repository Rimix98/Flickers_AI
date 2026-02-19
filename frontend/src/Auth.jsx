import { useState } from 'react';
import './Auth.css';
import { getTranslation } from './translations';

export default function Auth({ onLogin, language = 'ru' }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const t = (key) => getTranslation(language, key);

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
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-content">
        <div className="auth-box">
          <div className="auth-header">
            <div className="logo-container">
              <div className="logo-circle">
                <svg viewBox="0 0 100 100" className="logo-svg">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logoGradient)" strokeWidth="3"/>
                  <path d="M30 50 L45 65 L70 35" fill="none" stroke="url(#logoGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="logo-text">Flickers AI</h1>
            </div>
            <p className="auth-subtitle">
              {isLogin ? t('loginSubtitle') : t('registerSubtitle')}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={`tab ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
            >
              {t('login')}
            </button>
            <button
              type="button"
              className={`tab ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
            >
              {t('register')}
            </button>
            <div className={`tab-indicator ${isLogin ? 'left' : 'right'}`}></div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>{t('username')}</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('usernamePlaceholder')}
                  required
                  minLength={3}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('password')}</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('passwordPlaceholder')}
                  required
                  minLength={4}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <span>{isLogin ? t('login') : t('register')}</span>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="footer-text">
              {isLogin ? t('noAccount') : t('haveAccount')}
              {' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="footer-link"
              >
                {isLogin ? t('register') : t('login')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
