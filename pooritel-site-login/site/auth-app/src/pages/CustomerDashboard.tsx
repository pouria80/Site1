import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import BalanceHero from '../components/dashboard/BalanceHero';
import QuickActions from '../components/dashboard/QuickActions';
import RecentOrders from '../components/dashboard/RecentOrders';
import AccountStatus from '../components/dashboard/AccountStatus';
import ActivityLog from '../components/dashboard/ActivityLog';
import Sidebar from '../components/dashboard/Sidebar';
import '../css/dashboard.css';

interface DashboardData {
  user: {
    id: string;
    email: string;
    name?: string;
    emailVerified: boolean;
  };
  wallets: {
    id: string;
    currency: 'USD' | 'IRT';
    balance: number;
  }[];
  orders: {
    id: string;
    product: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    date: string;
  }[];
  activity: {
    id: string;
    type: 'login' | 'charge' | 'order' | 'payment' | 'withdrawal';
    description: string;
    timestamp: string;
  }[];
  accountStatus: {
    emailVerified: boolean;
    accountActive: boolean;
    secureStatus: boolean;
    kycStatus?: boolean;
  };
}

export default function CustomerDashboard() {
  const { t } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'IRT'>('USD');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customer/dashboard', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="dashboard-error">
        <p>{error || 'Unable to load dashboard'}</p>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      <Sidebar
        user={dashboardData.user}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="dashboard-header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <h1>Dashboard</h1>
          <div className="header-actions">
            <button className="icon-btn" aria-label="Notifications">🔔</button>
            <button className="icon-btn" aria-label="Settings">⚙️</button>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Balance Hero Section */}
          <BalanceHero
            wallets={dashboardData.wallets}
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
          />

          {/* Quick Actions */}
          <QuickActions />

          {/* Account Status & Recent Orders Grid */}
          <div className="dashboard-grid">
            <div className="grid-col-left">
              {/* Recent Orders */}
              <RecentOrders orders={dashboardData.orders.slice(0, 3)} />
            </div>
            <div className="grid-col-right">
              {/* Account Status */}
              <AccountStatus status={dashboardData.accountStatus} />
            </div>
          </div>

          {/* Activity Log */}
          <ActivityLog activities={dashboardData.activity} />
        </div>
      </main>
    </div>
  );
}
