import LenderPage from './LenderPage';
import { AuthProvider, useAuth } from './AuthContext';

function Lender() {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Unauthorized</div>;
    return <LenderPage />;
}

export default function LenderRoute() {
    return (
        <AuthProvider>
            <Lender />
        </AuthProvider>
    );
}
