import React, { useState } from 'react';
import { useI18n } from '../../i18n';
import '../../css/sidebar.css';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  user?: {
    name?: string;
    email?: string;
  };
}

export default function Sidebar({ open, onToggle, user }: SidebarProps) {
  const { lang, dir } = useI18n();
  const isRTL = dir === 'rtl';

  const menuItems = [
    {
      label: lang === 'fa' ? 'داشبورد' : 'Dashboard',
      icon: '📊',
      href: '#dashboard',
      active: true,
    },
    {
      label: lang === 'fa' ? 'سفارش‌ها' : 'Orders',
      icon: '📦',
      href: '#orders',
    },
    {
      label: lang === 'fa' ? 'کیف‌پول' : 'Wallets',
      icon: '💳',
      href: '#wallets',
    },
  ];

  const accountItems = [
    {
      label: lang === 'fa' ? 'پروفایل' : 'Profile',
      icon: '👤',
      href: '#profile',
    },
    {
      label: lang === 'fa' ? 'امنیت' : 'Security',
      icon: '🔒',
      href: '#security',
    },
    {
      label: lang === 'fa' ? 'تأیید هویت' : 'Verification',
      icon: '📋',
      href: '#verify',
    },
  ];

  return (
    <aside className={`sidebar ${open ? 'open' : 'collapsed'}`} style={{ [isRTL ? 'right' : 'left']: 0 }}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-icon">◈</span>
          {open && <span className="brand-text">PooriTel</span>}
        </div>
        <button
          className="sidebar-toggle-btn"
          onClick={onToggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
          title={open ? 'Close' : 'Open'}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Workspace Section */}
        <div className="nav-section">
          {open && <h3 className="nav-title">{lang === 'fa' ? 'فضای کاری' : 'Workspace'}</h3>}
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`nav-link ${item.active ? 'active' : ''}`}
                  title={!open ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {open && <span className="nav-label">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Account Section */}
        <div className="nav-section">
          {open && <h3 className="nav-title">{lang === 'fa' ? 'حساب' : 'Account'}</h3>}
          <ul className="nav-list">
            {accountItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="nav-link"
                  title={!open ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {open && <span className="nav-label">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {open && (
          <div className="user-profile">
            <div className="user-avatar">
              {user?.name ? user.name[0].toUpperCase() : 'C'}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || 'Customer'}</p>
              <p className="user-email">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        )}
        <button className="logout-btn" title="Logout">
          {open ? (lang === 'fa' ? '🚪 خروج' : '🚪 Logout') : '🚪'}
        </button>
      </div>
    </aside>
  );
}
