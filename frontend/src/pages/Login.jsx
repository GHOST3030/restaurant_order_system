import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('auth.invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container">
      <h1 className="center">{t('auth.login_title')}</h1>
      <form className="form card mt-2" onSubmit={handleSubmit}>
        {error && <div className="alert error">{error}</div>}
        <div className="form-group">
          <label>{t('auth.email')}</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>{t('auth.password')}</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="btn" disabled={loading} type="submit">
          {t('auth.login')}
        </button>
        <p className="center">
          {t('auth.no_account')} <Link to="/register">{t('auth.register')}</Link>
        </p>
      </form>
    </div>
  );
}
