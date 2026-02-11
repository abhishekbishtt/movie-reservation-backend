import { MovieCard } from './MovieCard';
import { MovieGridSkeleton } from '@components/common/Skeleton';
import { Film } from 'lucide-react';
import './MovieGrid.css';

export function MovieGrid({ movies, loading, title, subtitle, emptyMessage }) {
    if (loading) {
        return (
            <div className="movie-grid-section">
                {title && (
                    <div className="movie-grid-header">
                        <h2 className="movie-grid-title">{title}</h2>
                    </div>
                )}
                <MovieGridSkeleton count={8} />
            </div>
        );
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="movie-grid-section">
                {title && (
                    <div className="movie-grid-header">
                        <h2 className="movie-grid-title">{title}</h2>
                    </div>
                )}
                <div className="movie-grid-empty">
                    <Film size={48} className="movie-grid-empty-icon" />
                    <h3>{emptyMessage || 'No movies found'}</h3>
                    <p>Check back later for new releases</p>
                </div>
            </div>
        );
    }

    return (
        <div className="movie-grid-section">
            {(title || subtitle) && (
                <div className="movie-grid-header">
                    {title && <h2 className="movie-grid-title">{title}</h2>}
                    {subtitle && <p className="movie-grid-subtitle">{subtitle}</p>}
                </div>
            )}

            <div className="movie-grid">
                {movies.map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
            </div>
        </div>
    );
}
