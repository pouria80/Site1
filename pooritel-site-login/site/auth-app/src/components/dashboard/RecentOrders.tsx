import React from 'react';
import '../../css/dashboard-orders.css';

interface Order {
  id: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusColor = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  completed: '#10b981',
  cancelled: '#ef4444',
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <section className="recent-orders glass">
      <div className="section-header">
        <h3>Recent Orders</h3>
        <a href="#" className="view-all">View all →</a>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="empty-state">No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <p className="order-product">{order.product}</p>
                <p className="order-id">#{order.id}</p>
              </div>
              <div className="order-meta">
                <span className="order-amount">${order.amount.toFixed(2)}</span>
                <span
                  className="order-status"
                  style={{ borderColor: statusColor[order.status] }}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
              <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
