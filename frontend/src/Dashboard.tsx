import { useState } from 'react'

import './Dashboard.css'

function Dashboard() {
  const [selectedPage, setSelectedPage] = useState('Dashboard')
  const transactions = [
    { name: 'Salary Credit', date: '28 Oct 2026', type: 'Credit', amount: '+₹45,000' },
    { name: 'Amazon Purchase', date: '26 Oct 2026', type: 'Debit', amount: '-₹2,499' },
    { name: 'Electricity Bill', date: '24 Oct 2026', type: 'Debit', amount: '-₹1,250' },
    { name: 'Refund Received', date: '22 Oct 2026', type: 'Credit', amount: '+₹850' },
  ]

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="dashboard-brand">
          <div className="brand-icon">F</div>
          <span>FinBank</span>
        </div>

        <p className="nav-heading">MENU</p>
        <nav className="dashboard-nav">
          <a href="#dashboard" className={selectedPage === 'Dashboard' ? 'active' : ''} onClick={() => setSelectedPage('Dashboard')}> ▦ Dashboard</a>
          <a href="#accounts" className={selectedPage === 'My Accounts' ? 'active' : ''} onClick={() => setSelectedPage('My Accounts')}>▣ My Accounts</a>
          <a href="#transfers">⇄ Transfers</a>
          <a href="#beneficiaries">♧ Beneficiaries</a>
          <a href="#transactions">▤ Transactions</a>
          <a href="#profile">⚙ Profile</a>
        </nav>

        <button className="logout-button" onClick={() => window.location.reload()}>
          ↪ Sign out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your financial overview.</p>
          </div>
          <div className="customer-profile">
            <div className="avatar">S</div>
            <div>
              <strong>Sample Customer</strong>
              <small>Personal Banking</small>
            </div>
          </div>
        </header>

        <section className="balance-section">
          <div>
            <p className="section-label">TOTAL ACCOUNT BALANCE</p>
            <h2>₹2,45,850.00</h2>
            <p className="balance-note">Across your FinBank accounts</p>
          </div>
          <div className="balance-icon">₹</div>
        </section>

       
        <section id="accounts" className="account-section">
          <h2>My Accounts</h2>
          <div className="account-grid">
            <article className="account-card savings">
              <span>SAVINGS ACCOUNT</span>
              <h3>₹1,85,850.00</h3>
              <p>Account ending •••• 4521</p>
            </article>

            <article className="account-card current">
              <span>CURRENT ACCOUNT</span>
              <h3>₹60,000.00</h3>
              <p>Account ending •••• 8910</p>
            </article>
          </div>
        </section>

        <section className="quick-section">
          <h2>Quick Actions</h2>
          <div className="quick-grid">
            <button onClick={() => alert('Money transfer will be implemented later.')}>
              <span>⇄</span> Transfer Money
            </button>
            <button onClick={() => alert('Beneficiary management will be implemented later.')}>
              <span>＋</span> Add Beneficiary
            </button>
            <button onClick={() => alert('Account details will be implemented later.')}>
              <span>▣</span> Account Details
            </button>
          </div>
        </section>

        <section className="transactions-section">
          <div className="section-heading">
            <h2>Recent Transactions</h2>
            <span>Sample data</span>
          </div>

          <div className="transaction-list">
            {transactions.map((transaction, index) => (
              <div className="transaction-row" key={index}>
                <div className="transaction-icon">
                  {transaction.type === 'Credit' ? '↓' : '↑'}
                </div>
                <div className="transaction-info">
                  <strong>{transaction.name}</strong>
                  <small>{transaction.date}</small>
                </div>
                <strong className={transaction.type === 'Credit' ? 'credit' : 'debit'}>
                  {transaction.amount}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <footer className="dashboard-footer">
          FinBank Digital Banking Demo © 2026
        </footer>
      </main>
    </div>
  )
}

export default Dashboard
