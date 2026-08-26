import React, { useEffect, useState } from 'react';
import BalanceHero from '../components/dashboard/BalanceHero';
import QuickActions from '../components/dashboard/QuickActions';
import RecentOrders from '../components/dashboard/RecentOrders';
import AccountStatus from '../components/dashboard/AccountStatus';
import ActivityLog from '../components/dashboard/ActivityLog';
import Sidebar from '../components/dashboard/Sidebar';
import '../css/dashboard.css';

interface DashboardData {
  user: { id: string; email: string; name?: string; emailVerified: boolean };
  wallets: { id: string; currency: 'USD' | 'IRT'; balance: number }[];
  orders: { id: string; product: string; amount: number; status: 'pending' | 'processing' | 'completed' | 'cancelled'; date: string }[];
  activity: { id: string; type: 'login' | 'charge' | 'order' | 'payment' | 'withdrawal'; description: string; timestamp: string }[];
  accountStatus: { emailVerified: boolean; accountActive: boolean; secureStatus: boolean; kycStatus?: boolean };
}

const mockData: DashboardData = {
  user: { id: 'preview-user', email: 'customer@example.com', name: 'Customer', emailVerified: true },
  wallets: [{ id: 'usd', currency: 'USD', balance: 124.5 }, { id: 'irt', currency: 'IRT', balance: 0 }],
  orders: [
    { id: 'PT-10492', product: 'Telegram Premium · 12 months', amount: 21.9, status: 'pending', date: new Date().toISOString() },
    { id: 'PT-10471', product: 'Steam Wallet 20 USD', amount: 20.45, status: 'completed', date: new Date(Date.now() - 86400000).toISOString() },
    { id: 'PT-10466', product: 'Dota 2 Item Bundle', amount: 15, status: 'completed', date: new Date(Date.now() - 172800000).toISOString() },
  ],
  activity: [
    { id: '1', type: 'login', description: 'New browser session', timestamp: new Date().toISOString() },
    { id: '2', type: 'order', description: 'Order PT-10492 created', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ],
  accountStatus: { emailVerified: true, accountActive: true, secureStatus: true, kycStatus: false },
};

export default function CustomerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'IRT'>('USD');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/customer/dashboard', { credentials: 'include' });
        if (!response.ok) throw new Error('API unavailable in standalone preview');
        setDashboardData(await response.json());
      } catch {
        setDashboardData(mockData);
        setError(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !dashboardData) return <div className="dashboard-loading"><div className="spinner">Loading...</div></div>;

  return (
    <div className="customer-dashboard">
      <Sidebar user={dashboardData.user} open={sidebarOpen} onToggle={() => setSidebarOpen(v => !v)} />
      <main className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="dashboard-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">☰</button>
          <h1>Dashboard</h1>
          <div className="header-actions"><button className="icon-btn">🔔</button><button className="icon-btn">⚙️</button></div>
        </div>
        <div className="dashboard-content">
          <BalanceHero wallets={dashboardData.wallets} selectedCurrency={selectedCurrency} onCurrencyChange={setSelectedCurrency} />
          <QuickActions />
          <div className="dashboard-grid">
            <div className="grid-col-left"><RecentOrders orders={dashboardData.orders.slice(0, 3)} /></div>
            <div className="grid-col-right"><AccountStatus status={dashboardData.accountStatus} /></div>
          </div>
          <ActivityLog activities={dashboardData.activity} />
        </div>
      </main>
    </div>
  );
}
