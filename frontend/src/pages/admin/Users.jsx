import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const ROLES = ['admin', 'manager', 'user'];

export default function Users() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);

  const load = () => api.get('/admin/users').then(({ data }) => setUsers(data));

  useEffect(() => { load(); }, []);

  const updateRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm(t('admin.confirm_delete'))) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div>
      <h2>{t('admin.users')}</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t('auth.name')}</th>
              <th>{t('auth.email')}</th>
              <th>{t('admin.role')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role || 'user'} onChange={(e) => updateRole(u.id, e.target.value)}>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td>
                  {u.id !== currentUser.id && (
                    <button className="btn danger" onClick={() => remove(u.id)}>{t('admin.delete')}</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
