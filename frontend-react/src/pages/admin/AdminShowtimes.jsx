import { Card } from '@components/common/Card';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@components/common/Button';

export default function AdminShowtimes() {
    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1>Showtimes</h1>
                    <p>Schedule and manage showtimes</p>
                </div>
                <Button variant="primary" leftIcon={<Plus size={18} />}>
                    Add Showtime
                </Button>
            </div>

            <Card variant="default" className="admin-content-card">
                <div className="admin-placeholder">
                    <Calendar size={48} />
                    <h3>Showtime Management</h3>
                    <p>Showtimes calendar and scheduling will be displayed here.</p>
                </div>
            </Card>
        </div>
    );
}
