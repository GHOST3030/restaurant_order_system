import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';

const STATUSES = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

export default function AdminOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);

  const load = () => api.get('/orders').then(({ data }) => setOrders(data));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h2>{t('admin.orders')}</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>{t('admin.customer')}</th>
              <th>{t('orders.items')}</th>
              <th>{t('orders.total')}</th>
              <th>{t('orders.status')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.user?.name || '-'}</td>
                <td>{o.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}</td>
                <td>{t('common.currency')}{Number(o.total).toFixed(2)}</td>
                <td>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
