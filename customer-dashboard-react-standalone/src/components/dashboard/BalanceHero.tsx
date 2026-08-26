import React from 'react';
import '../../css/dashboard-balance.css';
interface Wallet { id: string; currency: 'USD' | 'IRT'; balance: number }
interface Props { wallets: Wallet[]; selectedCurrency: 'USD' | 'IRT'; onCurrencyChange: (currency: 'USD' | 'IRT') => void }
export default function BalanceHero({ wallets, selectedCurrency, onCurrencyChange }: Props) {
  const selectedWallet = wallets.find(w => w.currency === selectedCurrency);
  return <section className="balance-hero glass"><div className="balance-header"><h2>Available Balance</h2><div className="currency-toggle">{wallets.map(w => <button key={w.currency} className={`currency-btn ${selectedCurrency === w.currency ? 'active' : ''}`} onClick={() => onCurrencyChange(w.currency)}>{w.currency}</button>)}</div></div><div className="balance-display"><div className="amount"><span className="currency-symbol">{selectedCurrency === 'USD' ? '$' : '﷼'}</span><span className="value">{selectedWallet?.balance.toLocaleString() || '0'}</span></div><p className="balance-label">{selectedCurrency === 'USD' ? 'United States Dollar' : 'تومان'}</p></div><div className="balance-actions"><button className="btn-primary">Charge Wallet</button><button className="btn-secondary">Withdraw</button></div><div className="balance-meta"><span className="badge">Last updated: Now</span></div></section>;
}
