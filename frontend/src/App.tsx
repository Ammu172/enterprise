import Dashboard from './Dashboard'
import { useState, type FormEvent } from 'react'
import { loginCustomer, registerCustomer } from './services/api'
import './App.css'

function App() {
  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [isDashboard, setIsDashboard] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  setMessage('')

  try {
    const result = await loginCustomer({ email, password })

    sessionStorage.setItem('finbank-token', result.token)
    sessionStorage.setItem('finbank-customer-id', String(result.customerId))
    sessionStorage.setItem('finbank-customer-name', result.fullName)
    sessionStorage.setItem('finbank-customer-email', result.email)

    setIsDashboard(true)
  } catch (error) {
    setMessage(
      error instanceof Error ? error.message : 'Login failed. Please try again.'
    )
  }
}

const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  setMessage('')

  if (password.length < 12) {
    setMessage('Password must contain at least 12 characters.')
    return
  }

  if (password !== confirmPassword) {
    setMessage('Passwords do not match.')
    return
  }

  if (!/^[0-9]{10}$/.test(phone.trim())) {
    setMessage('Please enter a valid 10-digit phone number.')
    return
  }

  const nameParts = name.trim().split(/\s+/)

  if (nameParts.length < 2) {
    setMessage('Please enter your first name and last name.')
    return
  }

  try {
    const result = await registerCustomer({
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
      email: email.trim(),
      phone: phone.trim(),
      password,
    })

    sessionStorage.setItem('finbank-token', result.token)
    sessionStorage.setItem('finbank-customer-id', String(result.customerId))
    sessionStorage.setItem('finbank-customer-name', result.fullName)
    sessionStorage.setItem('finbank-customer-email', result.email)

    setIsDashboard(true)
  } catch (error) {
    setMessage(
      error instanceof Error ? error.message : 'Registration failed. Please try again.'
    )
  }
}
  const switchPage = (signup: boolean) => {
    setIsSignup(signup)
    setMessage('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }
 if (isDashboard) {
    return <Dashboard />
  }


  return (
    <main className="login-page">
      <section className="welcome-panel">
        <div className="brand">
          <div className="brand-icon">F</div>
          <span>FinBank</span>
        </div>

        <div className="welcome-content">
          <span className="eyebrow">YOUR MONEY. YOUR FUTURE.</span>
          <h1>Banking made<br />simple and secure.</h1>
          <p>
            Take control of your finances with a smarter digital
            banking experience.
          </p>

          <div className="feature"><span>✓</span>Secure digital banking</div>
          <div className="feature"><span>✓</span>Simple money management</div>
          <div className="feature"><span>✓</span>Transactions in one place</div>
        </div>

        <p className="panel-footer">© 2026 FinBank. Digital banking demo.</p>
      </section>

      <section className="form-panel">
        <div className="mobile-brand">
          <div className="brand-icon">F</div>
          <span>FinBank</span>
        </div>

        <div className="login-card">
          <span className="eyebrow">
            {isSignup ? 'JOIN FINBANK' : 'WELCOME BACK'}
          </span>

          <h2>{isSignup ? 'Create your account' : 'Sign in to FinBank'}</h2>

          <p className="subtitle">
            {isSignup
              ? 'Enter your details to get started.'
              : 'Enter your details to access your account.'}
          </p>

          {!isSignup ? (
            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <div className="password-label">
                <label htmlFor="password">Password</label>
                <a href="#forgot-password">Forgot password?</a>
              </div>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <button className="login-button" type="submit">
                Sign in <span>→</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <label htmlFor="signup-email">Email address</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <label htmlFor="phone">Phone number</label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />

              <label htmlFor="signup-password">Password</label>
              <div className="password-wrapper">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 12 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={12}
                  required
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <label htmlFor="confirm-password">Confirm password</label>
              <div className="password-wrapper">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <button className="login-button" type="submit">
                Create account <span>→</span>
              </button>
            </form>
          )}

          {message && <p className="message" role="status">{message}</p>}

          <p className="signup-text">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <a
              href={isSignup ? '#login' : '#signup'}
              onClick={(event) => {
                event.preventDefault()
                switchPage(!isSignup)
              }}
            >
              {isSignup ? 'Sign in' : 'Create an account'}
            </a>
          </p>

          <div className="security-note">
            <span>●</span>
            Secure FinBank demo environment
          </div>
        </div>
      </section>
    </main>
  )
}

export default App

