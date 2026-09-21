import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function Cart() {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/orders', {
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        notes,
      });
      clearCart();
      setSuccess(true);
      setTimeout(() => navigate('/orders'), 1200);
    } catch {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container">
      <h1>{t('cart.title')}</h1>
      {success && <div className="alert success mb-2">{t('cart.order_placed')}</div>}
      {error && <div className="alert error mb-2">{error}</div>}
      {items.length === 0 ? (
        <p>{t('cart.empty')}</p>
      ) : (
        <div className="card">
          {items.map((item) => (
            <div className="cart-line" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <div className="price">{t('common.currency')}{item.price}</div>
              </div>
              <div className="qty-control">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button className="btn secondary" onClick={() => removeItem(item.id)}>
                {t('cart.remove')}
              </button>
            </div>
          ))}
          <div className="form-group mt-2">
            <label>{t('cart.notes')}</label>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="toolbar mt-2">
            <strong>{t('cart.total')}: {t('common.currency')}{total.toFixed(2)}</strong>
            <button className="btn" disabled={loading} onClick={handleCheckout}>
              {t('cart.checkout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
