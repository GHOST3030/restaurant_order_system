import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout, hasRole } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language.startsWith('ar') ? 'en' : 'ar');
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/login');
  };

  const closeMenu = () => setOpen(false);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand" onClick={closeMenu}>{t('app_name')}</NavLink>
        <div className="navbar-actions">
          <NavLink to="/cart" className="cart-icon-link" aria-label={t('nav.cart')} onClick={closeMenu}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
          <button
            className="nav-toggle"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            ☰
          </button>
        </div>
        <nav className={`nav-links${open ? ' open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>{t('nav.home')}</NavLink>
          <NavLink to="/cart" className="cart-text-link" onClick={closeMenu}>{t('nav.cart')} {cartCount > 0 ? `(${cartCount})` : ''}</NavLink>
          {user && <NavLink to="/orders" onClick={closeMenu}>{t('nav.orders')}</NavLink>}
          {user && <NavLink to="/profile" onClick={closeMenu}>{t('nav.profile')}</NavLink>}
          {hasRole('admin', 'manager') && <NavLink to="/admin" onClick={closeMenu}>{t('nav.admin')}</NavLink>}
          {!user && <NavLink to="/login" onClick={closeMenu}>{t('nav.login')}</NavLink>}
          {!user && <NavLink to="/register" onClick={closeMenu}>{t('nav.register')}</NavLink>}
          {user && <button onClick={handleLogout}>{t('nav.logout')}</button>}
          <button className="lang-switch" onClick={toggleLang}>
            {i18n.language.startsWith('ar') ? 'English' : 'العربية'}
          </button>
        </nav>
      </div>
    </header>
  );
}
