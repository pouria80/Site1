import React from 'react';
import { useI18n } from '../../i18n';
import '../../css/dashboard-actions.css';

export default function QuickActions() {
  const { t } = useI18n();

  return (
    <section className="quick-actions">
      <div className="action-card charge">
        <div className="action-icon">💳</div>
        <h3>Charge Wallet</h3>
        <p>Add funds to your account</p>
        <button className="action-btn">Go →</button>
      </div>

      <div className="action-card withdraw">
        <div className="action-icon">💸</div>
        <h3>Withdraw</h3>
        <p>Request a withdrawal</p>
        <button className="action-btn">Go →</button>
      </div>

      <div className="action-card orders">
        <div className="action-icon">📦</div>
        <h3>View Orders</h3>
        <p>Check all your orders</p>
        <button className="action-btn">Go →</button>
      </div>
    </section>
  );
}
