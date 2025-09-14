import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LenderPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fundingLoanId, setFundingLoanId] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/loans')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch loans'))
      .then(data => setLoans(data.loans || []))
      .catch(() => setLoans([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFund = async (loanId, amount) => {
    setError(null);
    setFundingLoanId(loanId);
    const token = localStorage.getItem('token');
    try {
      // Create Stripe checkout session
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, loanId }),
      });
      if (!res.ok) throw new Error('Stripe session failed');
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
    } finally {
      setFundingLoanId(null);
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in as a lender.</div>;

  return (
    <div>
      <h2>Lender Dashboard</h2>
      <h3>Available Loans</h3>
      {loading ? (
        <div>Loading loans...</div>
      ) : (
        <ul>
          {loans.map(loan => (
            <li key={loan.id}>
              ${loan.amount} for {loan.purpose} - {loan.status}
              {loan.status === 'pending' && (
                <button
                  onClick={() => handleFund(loan.id, loan.amount)}
                  disabled={fundingLoanId === loan.id}
                >
                  Fund with Stripe
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default LenderPage;