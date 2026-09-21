import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/client';

export default function Orders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page container">
      <h1>{t('orders.title')}</h1>
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : orders.length === 0 ? (
        <p>{t('orders.no_orders')}</p>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
          {orders.map((order) => (
            <div className="card" key={order.id}>
              <div className="toolbar" style={{ marginBottom: '0.6rem' }}>
                <strong>{t('orders.order_number')}{order.id}</strong>
                <span className={`badge ${order.status}`}>{t(`status.${order.status}`)}</span>
              </div>
              <p style={{ color: 'var(--muted)', margin: '0 0 0.5rem' }}>
                {new Date(order.created_at).toLocaleString()}
              </p>
              <ul style={{ margin: 0, paddingInlineStart: '1.2rem' }}>
                {order.items.map((line) => (
                  <li key={line.id}>
                    {line.name} × {line.quantity} — {t('common.currency')}{(line.price * line.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <div className="mt-2">
                <strong>{t('orders.total')}: {t('common.currency')}{Number(order.total).toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
