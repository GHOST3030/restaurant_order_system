import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout, hasRole } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language.startsWith('ar') ? 'en' : 'ar');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">{t('app_name')}</NavLink>
        <nav className="nav-links">
          <NavLink to="/" end>{t('nav.home')}</NavLink>
          <NavLink to="/cart">{t('nav.cart')} {cartCount > 0 ? `(${cartCount})` : ''}</NavLink>
          {user && <NavLink to="/orders">{t('nav.orders')}</NavLink>}
          {user && <NavLink to="/profile">{t('nav.profile')}</NavLink>}
          {hasRole('admin', 'manager') && <NavLink to="/admin">{t('nav.admin')}</NavLink>}
          {!user && <NavLink to="/login">{t('nav.login')}</NavLink>}
          {!user && <NavLink to="/register">{t('nav.register')}</NavLink>}
          {user && <button onClick={handleLogout}>{t('nav.logout')}</button>}
          <button className="lang-switch" onClick={toggleLang}>
            {i18n.language.startsWith('ar') ? 'English' : 'العربية'}
          </button>
        </nav>
      </div>
    </header>
  );
}
