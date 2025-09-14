import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BorrowerPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch('/api/loans/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch loans'))
      .then(data => setLoans(data.loans || []))
      .catch(() => setLoans([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleRequestLoan = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/loans/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount), purpose }),
      });
      if (!res.ok) throw new Error('Loan request failed');
      const { loan } = await res.json();
      setLoans(loans => [...loans, loan]);
      setAmount('');
      setPurpose('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in as a borrower.</div>;

  return (
    <div>
      <h2>Borrower Dashboard</h2>
      <form onSubmit={handleRequestLoan}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Purpose"
          value={purpose}
          onChange={e => setPurpose(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Request Loan</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <h3>My Loans</h3>
      {loading ? (
        <div>Loading loans...</div>
      ) : (
        <ul>
          {loans.map(loan => (
            <li key={loan.id}>
              ${loan.amount} for {loan.purpose} - {loan.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BorrowerPage;