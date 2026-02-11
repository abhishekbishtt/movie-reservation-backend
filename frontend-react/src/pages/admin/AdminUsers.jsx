import { Card } from '@components/common/Card';
import { Users } from 'lucide-react';

export default function AdminUsers() {
    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1>Users</h1>
                    <p>Manage registered users</p>
                </div>
            </div>

            <Card variant="default" className="admin-content-card">
                <div className="admin-placeholder">
                    <Users size={48} />
                    <h3>User Management</h3>
                    <p>Users table with details will be displayed here.</p>
                </div>
            </Card>
        </div>
    );
}
