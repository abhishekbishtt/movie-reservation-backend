import { Card } from '@components/common/Card';
import { Film, Plus } from 'lucide-react';
import { Button } from '@components/common/Button';

export default function AdminMovies() {
    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1>Movies</h1>
                    <p>Manage your movie catalog</p>
                </div>
                <Button variant="primary" leftIcon={<Plus size={18} />}>
                    Add Movie
                </Button>
            </div>

            <Card variant="default" className="admin-content-card">
                <div className="admin-placeholder">
                    <Film size={48} />
                    <h3>Movie Management</h3>
                    <p>Movies table with CRUD operations will be displayed here.</p>
                </div>
            </Card>
        </div>
    );
}
