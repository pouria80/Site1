import React from 'react';
import '../../css/dashboard-status.css';

interface Props {
  status: { emailVerified: boolean; accountActive: boolean; secureStatus: boolean; kycStatus?: boolean };
}

export default function AccountStatus({ status }: Props) {
  const checks = [
    { label: 'Email Verified', ok: status.emailVerified, icon: '✓' },
    { label: 'Account Active', ok: status.accountActive, icon: '●' },
    { label: 'Security Status', ok: status.secureStatus, icon: '🔒' },
    ...(status.kycStatus !== undefined ? [{ label: 'Identity Verified', ok: status.kycStatus, icon: '📋' }] : []),
  ];

  return <section className="account-status glass">
    <div className="section-header"><h3>Account Health</h3></div>
    <div className="status-checks">
      {checks.map(check => <div key={check.label} className={`status-item ${check.ok ? 'verified' : 'pending'}`}>
        <span className="status-icon">{check.icon}</span><span className="status-label">{check.label}</span>
      </div>)}
    </div>
    {!status.emailVerified && <div className="status-action"><button className="btn-outline">Verify Email</button></div>}
  </section>;
}
