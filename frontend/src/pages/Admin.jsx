import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Dashboard from './admin/Dashboard';
import Categories from './admin/Categories';
import MenuItems from './admin/MenuItems';
import AdminOrders from './admin/AdminOrders';
import Users from './admin/Users';

export default function Admin() {
  const { t } = useTranslation();
  const { hasRole } = useAuth();
  const [tab, setTab] = useState('dashboard');

  const tabs = [
    { key: 'dashboard', label: t('admin.dashboard') },
    { key: 'menu_items', label: t('admin.menu_items') },
    { key: 'categories', label: t('admin.categories') },
    { key: 'orders', label: t('admin.orders') },
    ...(hasRole('admin') ? [{ key: 'users', label: t('admin.users') }] : []),
  ];

  return (
    <div className="page container">
      <h1>{t('nav.admin')}</h1>
      <div className="tabs">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            className={tab === tb.key ? 'active' : ''}
            onClick={() => setTab(tb.key)}
          >
            {tb.label}
          </button>
        ))}
      </div>
      {tab === 'dashboard' && <Dashboard />}
      {tab === 'menu_items' && <MenuItems />}
      {tab === 'categories' && <Categories />}
      {tab === 'orders' && <AdminOrders />}
      {tab === 'users' && hasRole('admin') && <Users />}
    </div>
  );
}
