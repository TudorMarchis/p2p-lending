import React, { useContext, useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import LandingPage from './LandingPage';
import LenderPage from './LenderPage';
import BorrowerPage from './BorrowerPage';

const PLATFORM_FEE_RATE = 0.01;
const MONTHLY_INTEREST_RATE = 0.05;
const MAX_LOAN = 1000;

function App() {
  const {
    user = null,
    isAuthenticated = true,
    loading = false,
    logout = () => console.warn('logout not implemented')
  } = useContext(AuthContext) || {};

  const [role, setRole] = useState('lender');
  const [borrowRequests, setBorrowRequests] = useState([]);

  // Load requests from localStorage when component mounts
  useEffect(() => {
    const savedRequests = localStorage.getItem('borrowRequests');
    if (savedRequests) {
      setBorrowRequests(JSON.parse(savedRequests));
    }
  }, []);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('borrowRequests', JSON.stringify(borrowRequests));
  }, [borrowRequests]);

  // Function to add a new request (passed to BorrowerPage)
  const addBorrowRequest = (newRequest) => {
    setBorrowRequests(prev => [...prev, {
      ...newRequest,
      id: Date.now(),
      borrowerId: user?.uid || 'anonymous',
      borrowerName: user?.displayName || 'Anonymous Borrower',
      status: 'pending',
      fundedAmount: 0
    }]);
  };

  // Function to update request status (passed to LenderPage)
  const updateRequestStatus = (requestId, updates) => {
    setBorrowRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, ...updates } : req
      )
    );
  };

  if (loading) {
    return <div style={styles.loading}>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <h1 style={styles.title}>P2P Lending Platform</h1>
        <button onClick={() => logout()} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.roleSwitch}>
        <button
          onClick={() => setRole('lender')}
          style={{ ...styles.tabBtn, ...(role === 'lender' ? styles.tabBtnActive : {}) }}
        >
          I'm a Lender
        </button>
        <button
          onClick={() => setRole('borrower')}
          style={{ ...styles.tabBtn, ...(role === 'borrower' ? styles.tabBtnActive : {}) }}
        >
          I'm a Borrower
        </button>
      </div>

      {role === 'lender' ? (
        <LenderPage
          platformFeeRate={PLATFORM_FEE_RATE}
          requests={borrowRequests.filter(req => req.status === 'pending')}
          updateRequestStatus={updateRequestStatus}
          currentUser={user}
        />
      ) : (
        <BorrowerPage
          monthlyInterestRate={MONTHLY_INTEREST_RATE}
          maxLoan={MAX_LOAN}
          platformFeeRate={PLATFORM_FEE_RATE}
          addBorrowRequest={addBorrowRequest}
          currentUser={user}
        />
      )}
    </div>
  );
}

const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    background: '#f5f7fb',
    minHeight: '100vh',
    padding: '32px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    color: '#222',
    textAlign: 'center'
  },
  rules: {
    color: '#555',
    maxWidth: 800,
    textAlign: 'center',
    marginTop: 8
  },
  roleSwitch: {
    marginTop: 16,
    display: 'flex',
    gap: 8
  },
  tabBtn: {
    padding: '10px 16px',
    borderRadius: 10,
    border: '1px solid #cfd7e3',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabBtnActive: {
    borderColor: '#0070ba',
    background: '#0070ba',
    color: 'white',
    boxShadow: '0 0 0 2px rgba(0,112,186,0.15)',
  },
  card: {
    marginTop: 24,
    width: '100%',
    maxWidth: 900,
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    padding: 20,
  },
  sectionTitle: {
    margin: 0,
    marginBottom: 8,
    color: '#222'
  },
  panel: {
    background: '#f9fbff',
    border: '1px solid #e3eaf5',
    borderRadius: 12,
    padding: 16,
  },
  panelTitle: {
    marginTop: 0,
    marginBottom: 12
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  },
  col: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #cfd7e3',
    outline: 'none',
    fontSize: '16px',
  },
  readonlyBox: {
    padding: 10,
    borderRadius: 8,
    border: '1px dashed #cfd7e3',
    background: '#fff',
    color: '#444',
    minHeight: '40px',
  },
  primaryBtn: {
    marginTop: 12,
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    background: '#0070ba',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  smallBtn: {
    padding: '6px 10px',
    borderRadius: 8,
    border: '1px solid #cfd7e3',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eef2f9'
  },
  summaryBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    background: '#eef6ff',
    border: '1px solid #d6e7ff',
    fontSize: '15px',
  },
  totalLine: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    background: '#fff7e6',
    border: '1px solid #ffe6b3',
    color: '#7a5a00',
    fontSize: '15px',
  },
  muted: {
    color: '#6b7280',
    fontSize: '15px',
  },
  mutedSmall: {
    color: '#6b7280',
    fontSize: 12
  },
  // New styles for the auth layout
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '900px',
    marginBottom: '20px',
  },
  logoutBtn: {
    padding: '8px 16px',
    background: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#cc0000',
    }
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#555',
  }
};

export default App;