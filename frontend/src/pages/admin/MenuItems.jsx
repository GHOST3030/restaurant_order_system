import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';

const empty = {
  category_id: '', name_en: '', name_ar: '', description_en: '', description_ar: '',
  price: '', image_url: '', available: true,
};

export default function MenuItems() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => {
    api.get('/menu-items', { params: { all: 1 } }).then(({ data }) => setItems(data));
    api.get('/categories').then(({ data }) => setCategories(data));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ ...empty, category_id: categories[0]?.id || '' }); setEditing('new'); };
  const openEdit = (item) => {
    setForm({
      category_id: item.category_id,
      name_en: item.name_en,
      name_ar: item.name_ar,
      description_en: item.description_en || '',
      description_ar: item.description_ar || '',
      price: item.price,
      image_url: item.image_url || '',
      available: item.available,
    });
    setEditing(item.id);
  };
  const close = () => setEditing(null);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (editing === 'new') {
      await api.post('/menu-items', payload);
    } else {
      await api.put(`/menu-items/${editing}`, payload);
    }
    close();
    load();
  };

  const remove = async (id) => {
    if (!window.confirm(t('admin.confirm_delete'))) return;
    await api.delete(`/menu-items/${id}`);
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h2 style={{ margin: 0 }}>{t('admin.menu_items')}</h2>
        <button className="btn" onClick={openNew}>{t('admin.add_item')}</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>{t('admin.name')}</th>
            <th>{t('admin.category')}</th>
            <th>{t('admin.price')}</th>
            <th>{t('admin.available')}</th>
            <th>{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name_en}</td>
              <td>{item.category?.name_en}</td>
              <td>{t('common.currency')}{Number(item.price).toFixed(2)}</td>
              <td>{item.available ? t('common.yes') : t('common.no')}</td>
              <td>
                <button className="btn secondary" onClick={() => openEdit(item)}>{t('admin.edit')}</button>{' '}
                <button className="btn danger" onClick={() => remove(item.id)}>{t('admin.delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing !== null && (
        <div className="modal-backdrop" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing === 'new' ? t('admin.add_item') : t('admin.edit')}</h3>
            <form className="form" onSubmit={save}>
              <div className="form-group">
                <label>{t('admin.category')}</label>
                <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Name (EN)</label>
                <input required value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
              </div>
              <div className="form-group">
                <label>الاسم (AR)</label>
                <input required value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description (EN)</label>
                <textarea rows={2} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
              </div>
              <div className="form-group">
                <label>الوصف (AR)</label>
                <textarea rows={2} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
              </div>
              <div className="form-group">
                <label>{t('admin.price')}</label>
                <input type="number" step="0.01" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label>{t('admin.image_url')}</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    style={{ width: 'auto', marginInlineEnd: '0.4rem' }}
                  />
                  {t('admin.available')}
                </label>
              </div>
              <div className="toolbar">
                <button type="button" className="btn secondary" onClick={close}>{t('admin.cancel')}</button>
                <button type="submit" className="btn">{t('admin.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
