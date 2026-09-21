import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import { useCart } from '../context/CartContext';

export default function Menu() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const { addItem } = useCart();

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const handleAddToCart = (item) => {
    addItem(item);
    setToast(t('menu.added_to_cart', { name: isAr ? item.name_ar : item.name_en }));
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/menu-items', { params: categoryId ? { category_id: categoryId } : {} })
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const filtered = items.filter((item) => {
    const name = isAr ? item.name_ar : item.name_en;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="page container">
      <h1>{t('menu.title')}</h1>
      <div className="toolbar">
        <input
          placeholder={t('menu.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.6rem 0.8rem', border: '1px solid var(--border)', borderRadius: 8, minWidth: 220 }}
        />
        <div className="filters">
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">{t('menu.all_categories')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{isAr ? c.name_ar : c.name_en}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : filtered.length === 0 ? (
        <p>{t('menu.no_items')}</p>
      ) : (
        <div className="grid grid-menu">
          {filtered.map((item) => (
            <div key={item.id} className="card menu-card">
              {item.image_url && <img src={item.image_url} alt="" />}
              <h3>{isAr ? item.name_ar : item.name_en}</h3>
              <p>{isAr ? item.description_ar : item.description_en}</p>
              <div className="toolbar" style={{ marginBottom: 0 }}>
                <span className="price">{t('common.currency')}{Number(item.price).toFixed(2)}</span>
                <button className="btn" onClick={() => handleAddToCart(item)}>
                  {t('menu.add_to_cart')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
