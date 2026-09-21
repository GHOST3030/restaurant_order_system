import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) {
        payload.current_password = form.current_password;
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      await updateProfile(payload);
      setSuccess(true);
      setForm({ ...form, current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(' ') : t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container">
      <h1 className="center">{t('profile.title')}</h1>
      <form className="form card mt-2" onSubmit={handleSubmit}>
        {success && <div className="alert success">{t('profile.success')}</div>}
        {error && <div className="alert error">{error}</div>}
        <div className="form-group">
          <label>{t('profile.role')}</label>
          <input value={user?.role || ''} disabled />
        </div>
        <div className="form-group">
          <label>{t('auth.name')}</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t('auth.email')}</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t('profile.current_password')}</label>
          <input type="password" value={form.current_password} onChange={(e) => setForm({ ...form, current_password: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t('profile.new_password')}</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="form-group">
          <label>{t('auth.password_confirmation')}</label>
          <input type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />
        </div>
        <button className="btn" disabled={loading} type="submit">{t('profile.update')}</button>
      </form>
    </div>
  );
}
