import { Card } from '@components/common/Card';
import { Ticket } from 'lucide-react';

export default function AdminBookings() {
    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1>Bookings</h1>
                    <p>View and manage all bookings</p>
                </div>
            </div>

            <Card variant="default" className="admin-content-card">
                <div className="admin-placeholder">
                    <Ticket size={48} />
                    <h3>Booking Management</h3>
                    <p>Bookings table with filters will be displayed here.</p>
                </div>
            </Card>
        </div>
    );
}
