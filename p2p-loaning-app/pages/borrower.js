import BorrowerPage from './BorrowerPage';
import { AuthProvider, useAuth } from './AuthContext';

function Borrower() {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Unauthorized</div>;
    return <BorrowerPage />;
}

export default function BorrowerRoute() {
    return (
        <AuthProvider>
            <Borrower />
        </AuthProvider>
    );
}
