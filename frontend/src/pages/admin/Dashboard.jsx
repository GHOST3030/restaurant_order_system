import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <p>{t('common.loading')}</p>;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="value">{stats.total_orders}</div>
          <div className="label">{t('admin.total_orders')}</div>
        </div>
        <div className="stat-card">
          <div className="value">{stats.total_users}</div>
          <div className="label">{t('admin.total_users')}</div>
        </div>
        <div className="stat-card">
          <div className="value">{t('common.currency')}{stats.total_revenue.toFixed(2)}</div>
          <div className="label">{t('admin.total_revenue')}</div>
        </div>
        <div className="stat-card">
          <div className="value">{stats.total_menu_items}</div>
          <div className="label">{t('admin.total_menu_items')}</div>
        </div>
      </div>

      <h3>{t('admin.orders')}</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>{t('admin.customer')}</th>
            <th>{t('orders.total')}</th>
            <th>{t('orders.status')}</th>
          </tr>
        </thead>
        <tbody>
          {stats.recent_orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user?.name}</td>
              <td>{t('common.currency')}{Number(o.total).toFixed(2)}</td>
              <td><span className={`badge ${o.status}`}>{t(`status.${o.status}`)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
