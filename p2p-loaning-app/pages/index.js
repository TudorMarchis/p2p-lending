//import { Geist, Geist_Mono } from "next/font/google";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, useAuth } from './AuthContext';
import LandingPage from './LandingPage';

function Main() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return <LandingPage />;
}

export default function Root() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}