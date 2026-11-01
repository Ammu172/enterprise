import { useState } from 'react'

import './Dashboard.css'

function Dashboard() {
const handleReviewTransfer = () => {
  const amount = Number(transferAmount)

  if (!transferAmount || amount <= 0) {
    setTransferMessage('Please enter a valid amount greater than zero.')
    setIsTransferReviewed(false)
    return
  }

  if (fromAccount === toAccount) {
    setTransferMessage('From and To accounts cannot be the same.')
    setIsTransferReviewed(false)
    return
  }

  setTransferMessage(
    `Transfer review successful: ₹${amount.toLocaleString('en-IN')} from ${fromAccount} to ${toAccount}. Demo only — no money transferred.`
  )

  setIsTransferReviewed(true)
}
  const [selectedPage, setSelectedPage] = useState('Dashboard')
  const [fromAccount, setFromAccount] = useState('Savings Account')
const [toAccount, setToAccount] = useState('Current Account')
const [transferAmount, setTransferAmount] = useState('')
const [transferDescription, setTransferDescription] = useState('')
const [transferMessage, setTransferMessage] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

const [customerName, setCustomerName] = useState('Sample Customer')
const [customerEmail, setCustomerEmail] = useState('customer@finbank.demo')
const [customerPhone, setCustomerPhone] = useState('+91 98765 43210')

const [editName, setEditName] = useState(customerName)
const [editEmail, setEditEmail] = useState(customerEmail)
const [editPhone, setEditPhone] = useState(customerPhone)
const [isTransferReviewed, setIsTransferReviewed] = useState(false)
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
          <a href="#transfers" className={selectedPage === 'Transfers' ? 'active' : ''} onClick={() => setSelectedPage('Transfers')}> ⇄ Transfers</a>
          <a href="#beneficiaries" className={selectedPage === 'Beneficiaries' ? 'active' : ''} onClick={() => setSelectedPage('Beneficiaries')}> ♧ Beneficiaries</a>
          <a href="#transactions" className={selectedPage === 'Transactions' ? 'active' : ''} onClick={() => setSelectedPage('Transactions')}> ▤ Transactions</a>
         <a
  href="#profile"
  className={selectedPage === 'Profile' ? 'active' : ''}
  onClick={(event) => {
    event.preventDefault()
    setSelectedPage('Profile')
    setIsProfileOpen(true)
  }}
>
  ⚙ Profile
</a>
       
      </nav>

        <button className="logout-button" onClick={() => window.location.reload()}>
          ↪ Sign out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
<h1>{selectedPage}</h1>
<p>
  {selectedPage === 'Dashboard'
    ? "Welcome back! Here's your financial overview."
    : "View and manage your FinBank accounts."}
</p>
           
          </div>
          <div className="customer-profile">
           
            <div className="avatar">
  {customerName.charAt(0).toUpperCase()}
</div>
            <div>
              <strong>{customerName}</strong>
             
              <small>Personal Banking</small>
            </div>
          </div>
        </header>
{selectedPage === 'Transfers' && (
  <section className="transfer-section">
    <h2>Transfer Money</h2>
    <p>Move funds between your demo accounts.</p>
    <div className="transfer-card">
      <label>From Account</label>
      <select
        value={fromAccount}
        onChange={(e) => {
          setFromAccount(e.target.value)
          setTransferMessage('')
        }}
      >
        <option value="Savings Account">Savings Account •••• 4521</option>
        <option value="Current Account">Current Account •••• 8910</option>
      </select>

      <label>To Account</label>
      <select
        value={toAccount}
        onChange={(e) => {
          setToAccount(e.target.value)
          setTransferMessage('')
        }}
      >
        <option value="Current Account">Current Account •••• 8910</option>
        <option value="Savings Account">Savings Account •••• 4521</option>
      </select>

      <label>Amount (₹)</label>
      <input
        type="number"
        value={transferAmount}
        onChange={(e) => {
          setTransferAmount(e.target.value)
          setTransferMessage('')
        }}
        placeholder="Enter amount"
      />

      <label>Description</label>
      <input
        type="text"
        value={transferDescription}
        onChange={(e) => {
          setTransferDescription(e.target.value)
          setTransferMessage('')
        }}
        placeholder="Enter transfer description"
      />


     
      <button type="button" onClick={handleReviewTransfer}>
  Review Transfer
</button>
{transferMessage && (
  <p className="transfer-message">{transferMessage}</p>
)}

{isTransferReviewed && (
  <div className="transfer-confirmation">
    <h3>Transfer Review Summary</h3>

    <p><strong>From Account:</strong> {fromAccount}</p>
    <p><strong>To Account:</strong> {toAccount}</p>
    <p>
      <strong>Amount:</strong> ₹{Number(transferAmount).toLocaleString('en-IN')}
    </p>
    <p>
      <strong>Description:</strong> {transferDescription || 'Not provided'}
    </p>
    <p><strong>Reference:</strong> FB-DEMO-REVIEW</p>

    <p className="demo-notice">
      Demo only — no money has been transferred.
    </p>
 </div>
  )}
      </div>

  </section>
)}

       {selectedPage === 'Dashboard' && (
  <section className="balance-section">
      
          <div>
            <p className="section-label">TOTAL ACCOUNT BALANCE</p>
            <h2>₹2,45,850.00</h2>
            <p className="balance-note">Across your FinBank accounts</p>
          </div>
          <div className="balance-icon">₹</div>
        </section>
)}
       {(selectedPage === 'Dashboard' || selectedPage === 'My Accounts') && (
  <section id="accounts" className="account-section">
          <h2>My Accounts</h2>
          <div className="account-grid">
          <article className="account-card savings">
  <span>SAVINGS ACCOUNT</span>
  <h3>₹1,85,850.00</h3>
  <p>Account ending •••• 4521</p>
  <div className="account-extra">
    <p>Account Type: Savings</p>
    <p>Account Status: <strong>Active</strong></p>
    <p>Currency: INR (₹)</p>
  </div>
</article>
         

<article className="account-card current">
  <span>CURRENT ACCOUNT</span>
  <h3>₹60,000.00</h3>
  <p>Account ending •••• 8910</p>
  <div className="account-extra">
    <p>Account Type: Current</p>
    <p>Account Status: <strong>Active</strong></p>
    <p>Currency: INR (₹)</p>
  </div>
</article>
</div>
          </section>

)}
        {selectedPage === 'Dashboard' && (

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
)}
        {selectedPage === 'Dashboard' && (
  <section id="transactions" className="transactions-section">
       
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
)}
        <footer className="dashboard-footer">
          FinBank Digital Banking Demo © 2026
        </footer>
      </main>

      {isProfileOpen && (
        <div
          className="profile-overlay"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="profile-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="profile-modal-header">
              <h2>Customer Profile</h2>
              <button
                className="profile-close"
                onClick={() => setIsProfileOpen(false)}
              >
                ×
              </button>
            </div>
<div className="profile-avatar">
  {customerName.charAt(0).toUpperCase()}
</div>

{isEditingProfile ? (
  <div className="profile-details">
    <div className="profile-detail">
      <small>Full Name</small>
      <input
        value={editName}
        onChange={(event) => setEditName(event.target.value)}
        placeholder="Enter your name"
      />
    </div>

    <div className="profile-detail">
      <small>Email Address</small>
      <input
        type="email"
        value={editEmail}
        onChange={(event) => setEditEmail(event.target.value)}
        placeholder="Enter your email"
      />
    </div>

    <div className="profile-detail">
      <small>Phone Number</small>
      <input
        value={editPhone}
        onChange={(event) => setEditPhone(event.target.value)}
        placeholder="Enter your phone number"
      />
    </div>

    <div className="profile-actions">
      <button
        onClick={() => {
          setEditName(customerName)
          setEditEmail(customerEmail)
          setEditPhone(customerPhone)
          setIsEditingProfile(false)
        }}
      >
        Cancel
      </button>

      <button
        onClick={() => {
          if (!editName.trim() || !editEmail.trim() || !editPhone.trim()) {
            alert('Please fill in all fields.')
            return
          }

          setCustomerName(editName.trim())
          setCustomerEmail(editEmail.trim())
          setCustomerPhone(editPhone.trim())
          setIsEditingProfile(false)
        }}
      >
        Save Changes
      </button>
    </div>
  </div>
) : (
  <div className="profile-details">
    <div className="profile-detail">
      <small>Full Name</small>
      <strong>{customerName}</strong>
    </div>

    <div className="profile-detail">
      <small>Email Address</small>
      <strong>{customerEmail}</strong>
    </div>

    <div className="profile-detail">
      <small>Phone Number</small>
      <strong>{customerPhone}</strong>
    </div>

    <div className="profile-detail">
      <small>Account Type</small>
      <strong>Personal Banking</strong>
    </div>

    <div className="profile-detail">
      <small>Customer ID</small>
      <strong>FB-CUST-1001</strong>
    </div>

    <button
      className="edit-profile-button"
      onClick={() => {
        setEditName(customerName)
        setEditEmail(customerEmail)
        setEditPhone(customerPhone)
        setIsEditingProfile(true)
      }}
    >
      Edit Profile
    </button>
  </div>
)}

           
                         </div>
            </div>
          )}
      </div>
    )
  }

export default Dashboard
 
