import {
  getAccountsByCustomerId,
  getCustomerById,
  getTransactionsByAccountId,
  createTransaction,
} from './services/api'
import { useEffect, useState } from 'react'

import './Dashboard.css'

function Dashboard() {
const [transactionSearch, setTransactionSearch] = useState('')
const [transactionTypeFilter, setTransactionTypeFilter] = useState('All')
const [transactionDateFilter, setTransactionDateFilter] = useState('All')
const [customerLoading, setCustomerLoading] = useState(true)
const [customerError, setCustomerError] = useState('')
const [accounts, setAccounts] = useState<any[]>([])
const [accountLoading, setAccountLoading] = useState(true)
const [accountError, setAccountError] = useState('')
const [transactions, setTransactions] = useState<any[]>([])
const [transactionLoading, setTransactionLoading] = useState(true)
const [transactionError, setTransactionError] = useState('')
const totalAccountBalance = accounts.reduce(
  (total, account) => total + Number(account.balance),
  0
)

useEffect(() => {
  async function loadCustomer() {
    try {
      const customer = await getCustomerById(3)

      const fullName = `${customer.firstName} ${customer.lastName}`

      setCustomerName(fullName)
      setCustomerEmail(customer.email)
      setCustomerPhone(customer.phone)

      setEditName(fullName)
      setEditEmail(customer.email)
      setEditPhone(customer.phone)

      setCustomerError('')
    } catch (error) {
      setCustomerError(
        error instanceof Error
          ? error.message
          : 'Unable to load customer details'
      )
    } finally {
      setCustomerLoading(false)
    }
  }

  loadCustomer()
}, [])
useEffect(() => {
  async function loadAccounts() {
    try {
      const data = await getAccountsByCustomerId(3)
      setAccounts(data)
      setAccountError('')
    } catch (error) {
      setAccountError(
        error instanceof Error
          ? error.message
          : 'Unable to load accounts'
      )
    } finally {
      setAccountLoading(false)
    }
  }

  loadAccounts()
}, [])
useEffect(() => {
  if (accountLoading) return

  async function loadTransactions() {
    try {
      if (accounts.length === 0) {
        setTransactions([])
        return
      }

      const results = await Promise.all(
        accounts.map((account) =>
          getTransactionsByAccountId(account.id)
        )
      )

      setTransactions(results.flat())
      setTransactionError('')
    } catch (error) {
      setTransactionError(
        error instanceof Error
          ? error.message
          : 'Unable to load transactions'
      )
    } finally {
      setTransactionLoading(false)
    }
  }

  loadTransactions()
}, [accounts, accountLoading])

const handleReviewTransfer = () => {
  const amount = Number(transferAmount)

  if (!transferAmount || !Number.isFinite(amount) || amount <= 0) {
    setTransferMessage('Please enter a valid amount greater than zero.')
    setIsTransferReviewed(false)
    return
  }
const sourceAccount = accounts.find(
  (account) => String(account.id) === fromAccount
)

const destinationAccount = accounts.find(
  (account) => String(account.id) === toAccount
)
  if (!sourceAccount || !destinationAccount) {
    setTransferMessage('Unable to identify the selected accounts.')
    setIsTransferReviewed(false)
    return
  }

  if (sourceAccount.id === destinationAccount.id) {
    setTransferMessage('From and To accounts cannot be the same.')
    setIsTransferReviewed(false)
    return
  }

  if (Number(sourceAccount.balance) < amount) {
    setTransferMessage('Insufficient account balance.')
    setIsTransferReviewed(false)
    return
  }

  setTransferMessage(
    `Transfer review successful: ₹${amount.toLocaleString('en-IN')}. Please confirm below.`
  )

  setIsTransferReviewed(true)
}
const handleConfirmTransfer = async () => {
  if (isTransferSubmitting) return

  const amount = Number(transferAmount)

  const sourceAccount = accounts.find(
    (account) => String(account.id) === fromAccount
  )

  const destinationAccount = accounts.find(
    (account) => String(account.id) === toAccount
  )

  if (!sourceAccount || !destinationAccount || sourceAccount.id === destinationAccount.id) {
    setTransferMessage('Please select two different valid accounts.')
    return
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    setTransferMessage('Please enter a valid transfer amount.')
    return
  }

  if (Number(sourceAccount.balance) < amount) {
    setTransferMessage('Insufficient account balance.')
    return
  }

  setIsTransferSubmitting(true)

  try {
    await createTransaction({
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destinationAccount.id,
      transactionType: 'TRANSFER',
      amount,
      description: transferDescription.trim() || 'FinBank account transfer',
    })

    setTransferMessage('Transfer completed successfully!')
    setIsTransferReviewed(false)
    setTransferAmount('')
    setTransferDescription('')

    try {
      const updatedAccounts = await getAccountsByCustomerId(3)
      setAccounts(updatedAccounts)

      const results = await Promise.all(
        updatedAccounts.map((account) =>
          getTransactionsByAccountId(account.id)
        )
      )

      setTransactions(results.flat())
      setTransactionError('')
    } catch {
      setTransferMessage(
        'Transfer completed, but refreshing the account display failed. Please reload the page.'
      )
    }
  } catch (error) {
    setTransferMessage(
      error instanceof Error ? error.message : 'Transfer failed.'
    )
  } finally {
    setIsTransferSubmitting(false)
  }
}
const handleMoneyTransaction = async () => {
  if (isMoneySubmitting) return

  const amount = Number(moneyAmount)

  const selectedAccount = accounts.find(
    (account) => String(account.id) === moneyAccount
  )

  if (!selectedAccount) {
    setMoneyMessage('Please select a valid account.')
    return
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    setMoneyMessage('Please enter a valid amount greater than zero.')
    return
  }

  if (
    moneyAction === 'WITHDRAWAL' &&
    Number(selectedAccount.balance) < amount
  ) {
    setMoneyMessage('Insufficient account balance.')
    return
  }

  setIsMoneySubmitting(true)

  try {
    await createTransaction({
      sourceAccountId: selectedAccount.id,
      transactionType: moneyAction,
      amount,
      description:
        moneyDescription.trim() ||
        (moneyAction === 'DEPOSIT' ? 'Account deposit' : 'Account withdrawal'),
    })

    setMoneyMessage(
      `${moneyAction === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} completed successfully!`
    )

    setMoneyAmount('')
    setMoneyDescription('')

    const updatedAccounts = await getAccountsByCustomerId(3)
    setAccounts(updatedAccounts)

    const results = await Promise.all(
      updatedAccounts.map((account) =>
        getTransactionsByAccountId(account.id)
      )
    )

    setTransactions(results.flat())
    setTransactionError('')
  } catch (error) {
    setMoneyMessage(
      error instanceof Error ? error.message : 'Transaction failed.'
    )
  } finally {
    setIsMoneySubmitting(false)
  }
}

const [selectedPage, setSelectedPage] = useState('Dashboard')

const [fromAccount, setFromAccount] = useState('1')
const [toAccount, setToAccount] = useState('3')

const [transferAmount, setTransferAmount] = useState('')
const [transferDescription, setTransferDescription] = useState('')
const [transferMessage, setTransferMessage] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
const [isTransferSubmitting, setIsTransferSubmitting] = useState(false)
const [moneyAction, setMoneyAction] = useState<'DEPOSIT' | 'WITHDRAWAL'>('DEPOSIT')
const [moneyAccount, setMoneyAccount] = useState('1')
const [moneyAmount, setMoneyAmount] = useState('')
const [moneyDescription, setMoneyDescription] = useState('')
const [moneyMessage, setMoneyMessage] = useState('')
const [isMoneySubmitting, setIsMoneySubmitting] = useState(false)



const [customerName, setCustomerName] = useState(
  () => localStorage.getItem('finbank-customer-name') || 'Sample Customer'
)

const [customerEmail, setCustomerEmail] = useState(
  () => localStorage.getItem('finbank-customer-email') || 'customer@finbank.demo'
)

const [customerPhone, setCustomerPhone] = useState(
  () => localStorage.getItem('finbank-customer-phone') || '+91 98765 43210'
)
const [editName, setEditName] = useState(customerName)
const [editEmail, setEditEmail] = useState(customerEmail)
const [editPhone, setEditPhone] = useState(customerPhone)
useEffect(() => {
  localStorage.setItem('finbank-customer-name', customerName)
  localStorage.setItem('finbank-customer-email', customerEmail)
  localStorage.setItem('finbank-customer-phone', customerPhone)
}, [customerName, customerEmail, customerPhone])
const [isTransferReviewed, setIsTransferReviewed] = useState(false)
const [beneficiaries, setBeneficiaries] = useState(() => {
  const savedBeneficiaries = localStorage.getItem('finbank-beneficiaries')

  if (savedBeneficiaries) {
    try {
      return JSON.parse(savedBeneficiaries)
    } catch {
      localStorage.removeItem('finbank-beneficiaries')
    }
  }

  return [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      account: '2345',
    },
    {
      id: 2,
      name: 'Priya Reddy',
      email: 'priya@example.com',
      account: '6789',
    },
  ]
})

useEffect(() => {
  localStorage.setItem(
    'finbank-beneficiaries',
    JSON.stringify(beneficiaries)
  )
}, [beneficiaries])


useEffect(() => {
  async function loadAccounts() {
    try {
      const data = await getAccountsByCustomerId(3)
      setAccounts(data)
      setAccountError('')
    } catch (error) {
      setAccountError(
        error instanceof Error
          ? error.message
          : 'Unable to load accounts'
      )
    } finally {
      setAccountLoading(false)
    }
  }

  loadAccounts()
}, [])
const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false)
const [newBeneficiaryName, setNewBeneficiaryName] = useState('')
const [newBeneficiaryEmail, setNewBeneficiaryEmail] = useState('')
const [newBeneficiaryAccount, setNewBeneficiaryAccount] = useState('')


const formatAmount = (amount: number, type: string) => {
  const sign = type === 'Credit' ? '+' : '-'
  return `${sign}₹${amount.toLocaleString('en-IN')}`
}

const formatDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}    



const getTransactionType = (transaction: any) =>
  String(transaction.transactionType || '').toLowerCase()

const getTransactionDescription = (transaction: any) =>
  transaction.description || `Transaction ${transaction.id}`

const filteredTransactions = transactions.filter((transaction) => {
  const matchesSearch = getTransactionDescription(transaction)
    .toLowerCase()
    .includes(transactionSearch.toLowerCase())

  const matchesType =
    transactionTypeFilter === 'All' ||
    getTransactionType(transaction) === transactionTypeFilter.toLowerCase()

  const transactionDate = new Date(
    `${String(transaction.createdAt).slice(0, 10)}T00:00:00`
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysAgo = Math.floor(
    (today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const matchesDate =
    transactionDateFilter === 'All' ||
    (transactionDateFilter === '7' && daysAgo >= 0 && daysAgo <= 6) ||
    (transactionDateFilter === '30' && daysAgo >= 0 && daysAgo <= 29)

  return matchesSearch && matchesType && matchesDate
})
const totalCredits = filteredTransactions
  .filter((transaction) =>
    ['credit', 'deposit'].includes(getTransactionType(transaction))
  )
  .reduce((total, transaction) => total + Number(transaction.amount), 0)

const totalDebits = filteredTransactions
  .filter((transaction) =>
    ['debit', 'withdrawal', 'transfer'].includes(getTransactionType(transaction))
  )
  .reduce((total, transaction) => total + Number(transaction.amount), 0)
const totalTransactions = filteredTransactions.length
  return (
    <div className="dashboard">
{customerLoading && <p>Loading customer details...</p>}

{customerError && (
  <p style={{ color: 'red' }}>{customerError}</p>
)}
      <aside className="sidebar">
        <div className="dashboard-brand">
          <div className="brand-icon">F</div>
          <span>FinBank</span>
        </div>

        <p className="nav-heading">MENU</p>
        <nav className="dashboard-nav">
          <a href="#dashboard" className={selectedPage === 'Dashboard' ? 'active' : ''} onClick={() => setSelectedPage('Dashboard')}> ▦ Dashboard</a>
          <a href="#accounts" className={selectedPage === 'My Accounts' ? 'active' : ''} onClick={() => setSelectedPage('My Accounts')}>▣ My Accounts</a>
         <a href="#deposit-withdrawal" className={selectedPage === 'Deposit & Withdrawal' ? 'active' : ''} onClick={() => setSelectedPage('Deposit & Withdrawal')}> ⇅ Deposit & Withdrawal</a>
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
    setIsTransferReviewed(false)
  }}
>
  {accounts.map((account) => (
    <option key={account.id} value={String(account.id)}>
      {account.accountNumber} - {account.accountType}
    </option>
  ))}
</select>
      <label>To Account</label>
<select
  value={toAccount}
  onChange={(e) => {
    setToAccount(e.target.value)
    setTransferMessage('')
    setIsTransferReviewed(false)
  }}
>
  {accounts.map((account) => (
    <option key={account.id} value={String(account.id)}>
      {account.accountNumber} - {account.accountType}
    </option>
  ))}
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

    <button
  type="button"
  onClick={handleConfirmTransfer}
  disabled={isTransferSubmitting}
>
  {isTransferSubmitting ? 'Processing...' : 'Confirm Transfer'}
</button>
 </div>
  )}
      </div>

  </section>
)}

{selectedPage === 'Deposit & Withdrawal' && (
  <section className="transfer-section">
    <h2>Deposit & Withdrawal</h2>
    <p>Manage transactions in your demo accounts.</p>

    <div className="transfer-card">
      <label>Transaction Type</label>
      <select
        value={moneyAction}
        onChange={(e) => {
          setMoneyAction(e.target.value as 'DEPOSIT' | 'WITHDRAWAL')
          setMoneyMessage('')
        }}
      >
        <option value="DEPOSIT">Deposit</option>
        <option value="WITHDRAWAL">Withdrawal</option>
      </select>

      <label>Select Account</label>
      <select
        value={moneyAccount}
        onChange={(e) => {
          setMoneyAccount(e.target.value)
          setMoneyMessage('')
        }}
      >
        {accounts.map((account) => (
          <option key={account.id} value={String(account.id)}>
            {account.accountNumber} - {account.accountType}
          </option>
        ))}
      </select>

      <label>Amount (₹)</label>
      <input
        type="number"
        min="0.01"
        value={moneyAmount}
        onChange={(e) => {
          setMoneyAmount(e.target.value)
          setMoneyMessage('')
        }}
        placeholder="Enter amount"
      />

      <label>Description</label>
      <input
        type="text"
        value={moneyDescription}
        onChange={(e) => {
          setMoneyDescription(e.target.value)
          setMoneyMessage('')
        }}
        placeholder="Enter description"
      />

      <button
        type="button"
        onClick={handleMoneyTransaction}
        disabled={isMoneySubmitting}
      >
        {isMoneySubmitting ? 'Processing...' : `Confirm ${moneyAction === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}`}
      </button>

      {moneyMessage && (
        <p className="transfer-message">{moneyMessage}</p>
      )}
    </div>
  </section>
)}

{selectedPage === 'Beneficiaries' && (
  <section className="beneficiary-section">
    <div className="beneficiary-header">
      <div>
        <h2>My Beneficiaries</h2>
        <p>Manage your saved demo beneficiaries.</p>
      </div>

<button
  type="button"
  onClick={() => setIsAddingBeneficiary(!isAddingBeneficiary)}
>
  {isAddingBeneficiary ? 'Cancel' : '+ Add Beneficiary'}
</button>
    </div>
{isAddingBeneficiary && (
  <div className="beneficiary-form">
    <h3>Add New Beneficiary</h3>

    <div className="beneficiary-form-grid">
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          value={newBeneficiaryName}
          onChange={(e) => setNewBeneficiaryName(e.target.value)}
          placeholder="Enter full name"
        />
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={newBeneficiaryEmail}
          onChange={(e) => setNewBeneficiaryEmail(e.target.value)}
          placeholder="Enter email address"
        />
      </div>

      <div className="form-group full-width">
        <label>Account Number</label>
        <input
          type="text"
          value={newBeneficiaryAccount}
          onChange={(e) => setNewBeneficiaryAccount(e.target.value)}
          placeholder="Enter demo account number"
        />
      </div>
    </div>

    <div className="beneficiary-form-actions">
      <button type="button" onClick={() => {
        if (
          !newBeneficiaryName.trim() ||
          !newBeneficiaryEmail.trim() ||
          !newBeneficiaryAccount.trim()
        ) {
          alert('Please fill in all beneficiary details.')
          return
        }

        setBeneficiaries([
          ...beneficiaries,
          {
            id: Date.now(),
            name: newBeneficiaryName.trim(),
            email: newBeneficiaryEmail.trim(),
            account: newBeneficiaryAccount.trim(),
          },
        ])

        setNewBeneficiaryName('')
        setNewBeneficiaryEmail('')
        setNewBeneficiaryAccount('')
        setIsAddingBeneficiary(false)
      }}>
        Save Beneficiary
      </button>

      <button
        type="button"
        className="cancel-beneficiary-btn"
        onClick={() => setIsAddingBeneficiary(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}  
 
<div className="beneficiary-grid">
  {beneficiaries.map((beneficiary) => (
    <article className="beneficiary-card" key={beneficiary.id}>
      <div className="beneficiary-avatar">
        {beneficiary.name.charAt(0).toUpperCase()}
      </div>

      <h3>{beneficiary.name}</h3>
      <p>{beneficiary.email}</p>
      <p>Account ending •••• {beneficiary.account.slice(-4)}</p>
      <span className="beneficiary-status">Active</span>
<button
  type="button"
  className="delete-beneficiary-btn"
  onClick={() => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${beneficiary.name}?`
    )

    if (confirmed) {
      setBeneficiaries(
        beneficiaries.filter((item) => item.id !== beneficiary.id)
      )
    }
  }}
>
  Delete
</button>
    </article>
  ))}
</div>

    <p className="beneficiary-demo-notice">
      Demo only — these are sample beneficiary details.
    </p>
  </section>
)} 


{selectedPage === 'Transactions' && (
  <section className="transactions-page">
    <div className="transactions-page-header">
      <div>
        <h2>Transaction History</h2>
        <p>View all your recent demo transactions.</p>
      </div>
      <span className="transaction-demo-label">Demo Data</span>
    </div>

<div className="transactions-summary">
  <div className="transaction-summary-card">
    <p>Total Credits</p>
    <h3 className="credit">
      ₹{totalCredits.toLocaleString('en-IN')}
    </h3>
  </div>

  <div className="transaction-summary-card">
    <p>Total Debits</p>
    <h3 className="debit">
      ₹{totalDebits.toLocaleString('en-IN')}
    </h3>
  </div>

  <div className="transaction-summary-card">
    <p>Total Transactions</p>
    <h3>{totalTransactions}</h3>
  </div>
</div>

    <div className="transactions-table-card">
      <h3>All Transactions</h3>
<div className="transaction-filters">
  <input
    type="text"
    placeholder="Search transactions..."
    value={transactionSearch}
    onChange={(e) => setTransactionSearch(e.target.value)}
  />

  <select
    value={transactionTypeFilter}
    onChange={(e) => setTransactionTypeFilter(e.target.value)}
  >
    <option value="All">All Transactions</option>
    <option value="Credit">Credit</option>
    <option value="Debit">Debit</option>
  </select>

  <select
    value={transactionDateFilter}
    onChange={(e) => setTransactionDateFilter(e.target.value)}
  >
    <option value="All">All Dates</option>
    <option value="7">Last 7 Days</option>
    <option value="30">Last 30 Days</option>
  </select>
</div>

      <div className="transactions-table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

{filteredTransactions.map((transaction) => (
  <tr key={transaction.id}>
    <td>{getTransactionDescription(transaction)}</td>

    <td>{formatDate(String(transaction.createdAt).slice(0, 10))}</td>

    <td>
      <span
        className={
          getTransactionType(transaction) === 'credit' ? 'credit' : 'debit'
        }
      >
        {getTransactionType(transaction) === 'withdrawal'
  ? 'Withdrawal'
  : getTransactionType(transaction) === 'credit'
    ? 'Credit'
    : getTransactionType(transaction) === 'transfer'
      ? 'Transfer'
      : 'Debit'}
      </span>
    </td>

    <td
      className={
        getTransactionType(transaction) === 'credit' ? 'credit' : 'debit'
      }
    >
      {formatAmount(
        Number(transaction.amount),
        getTransactionType(transaction) === 'credit' ? 'Credit' : 'Debit'
      )}
    </td>

    <td>
      <span className="transaction-completed">
        {transaction.status}
      </span>
    </td>
  </tr>
))}

          </tbody>
        </table>
      </div>
    </div>

    <p className="beneficiary-demo-notice">
      Demo only — these transactions are sample records, not actual banking activity.
    </p>
  </section>
)}     


 {selectedPage === 'Dashboard' && (
  <section className="balance-section">
      
          <div>
            <p className="section-label">TOTAL ACCOUNT BALANCE</p>
            <h2>  ₹{totalAccountBalance.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}</h2>
            <p className="balance-note">Across your FinBank accounts</p>
          </div>
          <div className="balance-icon">₹</div>
        </section>
)}

{(selectedPage === 'Dashboard' || selectedPage === 'My Accounts') && (
  <section id="accounts" className="account-section">
    <h2>My Accounts</h2>

    {accountLoading && <p>Loading accounts...</p>}

    {accountError && <p>{accountError}</p>}

    {!accountLoading && !accountError && accounts.length === 0 && (
      <p>No accounts found.</p>
    )}

    {!accountLoading && !accountError && accounts.length > 0 && (
      <div className="account-grid">
        {accounts.map((account) => (
          <article
            key={account.id}
            className={`account-card ${
              String(account.accountType).toLowerCase() === 'savings'
                ? 'savings'
                : 'current'
            }`}
          >
            <span>{account.accountType} ACCOUNT</span>

            <h3>
              ₹
              {Number(account.balance).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>

            <p>
              Account ending •••• {String(account.accountNumber).slice(-4)}
            </p>

            <div className="account-extra">
              <p>Account Type: {account.accountType}</p>
              <p>
                Account Status: <strong>{account.status}</strong>
              </p>
              <p>Currency: INR (₹)</p>
            </div>
          </article>
        ))}
      </div>
    )}
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
           
<span>Live Transactions</span>
          </div>
{transactionLoading && <p>Loading transactions...</p>}

{transactionError && (
  <p style={{ color: 'red' }}>{transactionError}</p>
)}

                    <div className="transaction-list">
            {transactions.slice(0, 5).map((transaction) => (
  <div className="transaction-row" key={transaction.id}>
    <div className="transaction-icon">
      {getTransactionType(transaction) === 'credit' ? '↓' : '↑'}
    </div>

    <div className="transaction-info">
      <strong>{getTransactionDescription(transaction)}</strong>
      <small>
        {formatDate(String(transaction.createdAt).slice(0, 10))}
      </small>
    </div>

    <strong
      className={
        getTransactionType(transaction) === 'credit' ? 'credit' : 'debit'
      }
    >
      {formatAmount(
        Number(transaction.amount),
        
       ['credit', 'deposit'].includes(getTransactionType(transaction))
  ? 'Credit'
  : 'Debit'
      )}
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
 
