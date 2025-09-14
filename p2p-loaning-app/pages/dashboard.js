import App from './App';
import { AuthProvider, useAuth } from './AuthContext';

function Dashboard() {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Unauthorized</div>;
    return <App />;
}

export default function DashboardPage() {
    return (
        <AuthProvider>
            <Dashboard />
        </AuthProvider>
    );
}
