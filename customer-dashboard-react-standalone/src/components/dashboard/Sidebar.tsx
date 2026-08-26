import React from 'react';
import '../../css/dashboard-sidebar.css';
interface SidebarProps { user: { id: string; email: string; name?: string }; open: boolean; onToggle: () => void; }
export default function Sidebar({ user, open, onToggle }: SidebarProps) {
  return <aside className={`dashboard-sidebar ${open ? 'open' : 'closed'}`}>
    <div className="sidebar-header"><div className="brand"><span className="brand-icon">◈</span><span className="brand-name">PooriTel</span></div></div>
    <nav className="sidebar-nav">
      <div className="nav-section"><span className="nav-title">Workspace</span><a href="#dashboard" className="nav-link active">📊 Dashboard</a><a href="#orders" className="nav-link">📦 Orders</a><a href="#wallets" className="nav-link">💳 Wallets</a></div>
      <div className="nav-section"><span className="nav-title">Account</span><a href="#profile" className="nav-link">👤 Profile</a><a href="#security" className="nav-link">🔒 Security</a><a href="#verify" className="nav-link">📋 Verification</a></div>
    </nav>
    <div className="sidebar-footer"><div className="user-card"><div className="avatar">{user.name?.[0] || user.email[0]}</div><div className="user-info"><p className="user-name">{user.name || 'Customer'}</p><p className="user-email">{user.email}</p></div></div><button className="logout-btn">🚪 Logout</button><button className="collapse-btn" onClick={onToggle}>Collapse</button></div>
  </aside>;
}
