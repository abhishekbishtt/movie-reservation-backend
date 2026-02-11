import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import { formatDuration } from '@utils/formatters';
import { Button } from '@components/common/Button';
import './MovieCard.css';

export function MovieCard({ movie, index = 0 }) {
    const navigate = useNavigate();
    const {
        id,
        title,
        poster_url,
        rating,
        age_rating,
        duration,
        language,
        genre,
    } = movie;

    const handleBookClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/booking/${id}`);
    };

    return (
        <motion.div
            className="movie-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link to={`/movies/${id}`} className="movie-card-poster">
                <img
                    src={poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={title}
                    loading="lazy"
                />
                <div className="movie-card-overlay">
                    <div className="movie-card-badges">
                        <span className="age-badge">{age_rating || 'UA'}</span>
                        {rating && (
                            <span className="rating-badge">
                                <Star size={12} fill="currentColor" /> {Number(rating).toFixed(1)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="movie-card-info">
                <h3 className="movie-card-title">{title}</h3>

                <div className="movie-card-meta">
                    {duration && (
                        <span className="meta-item">
                            <Clock size={14} /> {formatDuration(duration)}
                        </span>
                    )}
                    {language && <span className="meta-item">{language}</span>}
                </div>

                {genre && genre.length > 0 && (
                    <div className="movie-card-genres">
                        {(Array.isArray(genre) ? genre : genre.split(',')).slice(0, 2).map((g) => (
                            <span key={g} className="genre-tag">{g.trim()}</span>
                        ))}
                    </div>
                )}

                <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={handleBookClick}
                    className="movie-card-btn"
                >
                    Book Now
                </Button>
            </div>
        </motion.div>
    );
}
