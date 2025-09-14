import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/router';

const LandingPage = () => {
  const { user, login, register, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (user && shouldRedirect) {
      router.replace('/dashboard');
    }
  }, [user, shouldRedirect, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      setShouldRedirect(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>P2P Lending Platform</h1>
        {user ? (
          <div style={styles.welcomeBox}>
            <p>Welcome, {user.email}!</p>
            <button onClick={logout} style={styles.logoutButton}>Logout</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.authForm}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={styles.inputField}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={styles.inputField}
            />
            <button type="submit" style={styles.submitButton}>
              {isRegister ? 'Register' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(r => !r)}
              style={styles.toggleButton}
            >
              {isRegister ? 'Switch to Login' : 'Switch to Register'}
            </button>
            {error && <div style={styles.errorMessage}>{error}</div>}
          </form>
        )}

        <div style={styles.infoCard}>
          <h2>Peer-to-peer microloans</h2>
          <ul style={styles.featuresList}>
            <li>Borrow up to $1000 for emergencies</li>
            <li>Only 1% platform fee</li>
            <li>5% monthly interest rate</li>
            <li>Quick approval process</li>
            <li>Build credit with on-time payments</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    background: '#f5f7fb',
    padding: '20px',
    position: 'relative',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    paddingTop: '80px',
    textAlign: 'center',
  },
  title: {
    color: '#222',
    fontSize: '2.5rem',
    marginBottom: '40px',
  },
  welcomeBox: {
    marginBottom: '20px',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  inputField: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  submitButton: {
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  toggleButton: {
    backgroundColor: 'transparent',
    color: '#4285F4',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
  },
  infoCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    margin: '0 auto',
    maxWidth: '600px',
  },
  featuresList: {
    textAlign: 'left',
    listStyleType: 'none',
    padding: '0',
    fontSize: '1.1rem',
    lineHeight: '1.8',
  },
};

export default LandingPage;