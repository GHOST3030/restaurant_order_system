import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/client';

const empty = { name_en: '', name_ar: '' };

export default function Categories() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () => api.get('/categories').then(({ data }) => setCategories(data));

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(empty); setEditing('new'); };
  const openEdit = (c) => { setForm({ name_en: c.name_en, name_ar: c.name_ar }); setEditing(c.id); };
  const close = () => setEditing(null);

  const save = async (e) => {
    e.preventDefault();
    if (editing === 'new') {
      await api.post('/categories', form);
    } else {
      await api.put(`/categories/${editing}`, form);
    }
    close();
    load();
  };

  const remove = async (id) => {
    if (!window.confirm(t('admin.confirm_delete'))) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h2 style={{ margin: 0 }}>{t('admin.categories')}</h2>
        <button className="btn" onClick={openNew}>{t('admin.add_item')}</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>EN</th>
              <th>AR</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name_en}</td>
                <td>{c.name_ar}</td>
                <td>
                  <button className="btn secondary" onClick={() => openEdit(c)}>{t('admin.edit')}</button>{' '}
                  <button className="btn danger" onClick={() => remove(c.id)}>{t('admin.delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <div className="modal-backdrop" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing === 'new' ? t('admin.add_item') : t('admin.edit')}</h3>
            <form className="form" onSubmit={save}>
              <div className="form-group">
                <label>Name (EN)</label>
                <input required value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
              </div>
              <div className="form-group">
                <label>الاسم (AR)</label>
                <input required value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} />
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
