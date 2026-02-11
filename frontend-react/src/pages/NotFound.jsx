import { Link } from 'react-router-dom';
import { Home, Film } from 'lucide-react';
import { Button } from '@components/common/Button';
import './NotFound.css';

export default function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-icon">
                    <Film size={64} />
                </div>
                <h1>404</h1>
                <p>Oops! The page you're looking for doesn't exist.</p>
                <p className="not-found-hint">
                    It might have been moved or deleted, or maybe you mistyped the URL.
                </p>
                <div className="not-found-actions">
                    <Link to="/">
                        <Button variant="primary" leftIcon={<Home size={18} />}>
                            Go Home
                        </Button>
                    </Link>
                    <Link to="/movies">
                        <Button variant="secondary" leftIcon={<Film size={18} />}>
                            Browse Movies
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
