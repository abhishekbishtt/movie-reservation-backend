import { Card } from '@components/common/Card';
import { CreditCard } from 'lucide-react';

export default function AdminPayments() {
    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1>Payments</h1>
                    <p>View payment history and transactions</p>
                </div>
            </div>

            <Card variant="default" className="admin-content-card">
                <div className="admin-placeholder">
                    <CreditCard size={48} />
                    <h3>Payment Management</h3>
                    <p>Payments table with transaction details will be displayed here.</p>
                </div>
            </Card>
        </div>
    );
}
