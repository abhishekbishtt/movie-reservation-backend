import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Clock, Play } from 'lucide-react';
import { formatDuration } from '@utils/formatters';
import { Button } from '@components/common/Button';
import './HeroCarousel.css';

export function HeroCarousel({ movies = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const intervalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAutoPlaying && movies.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % movies.length);
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isAutoPlaying, movies.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToPrev = () => {
        goToSlide((currentIndex - 1 + movies.length) % movies.length);
    };

    const goToNext = () => {
        goToSlide((currentIndex + 1) % movies.length);
    };

    if (!movies || movies.length === 0) {
        return null;
    }

    const currentMovie = movies[currentIndex];

    return (
        <div className="hero-carousel">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    className="hero-slide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Background Image */}
                    <div
                        className="hero-backdrop"
                        style={{
                            backgroundImage: `url(${currentMovie.backdrop_url || currentMovie.poster_url || 'https://via.placeholder.com/1920x1080?text=Featured+Movie'})`
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div className="hero-gradient" />

                    {/* Content */}
                    <div className="hero-content container">
                        <motion.div
                            className="hero-info"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="hero-badges">
                                <span className="hero-badge hero-badge-rating">
                                    <Star size={14} fill="currentColor" />
                                    {currentMovie.rating ? Number(currentMovie.rating).toFixed(1) : 'N/A'}
                                </span>
                                <span className="hero-badge">{currentMovie.age_rating || 'UA'}</span>
                                {currentMovie.language && (
                                    <span className="hero-badge">{currentMovie.language}</span>
                                )}
                            </div>

                            <h1 className="hero-title">{currentMovie.title}</h1>

                            <div className="hero-meta">
                                {currentMovie.duration && (
                                    <span>
                                        <Clock size={16} /> {formatDuration(currentMovie.duration)}
                                    </span>
                                )}
                                {currentMovie.genre && (
                                    <span>
                                        {Array.isArray(currentMovie.genre)
                                            ? currentMovie.genre.slice(0, 3).join(' • ')
                                            : currentMovie.genre}
                                    </span>
                                )}
                            </div>

                            <p className="hero-description">
                                {currentMovie.description?.slice(0, 200)}
                                {currentMovie.description?.length > 200 ? '...' : ''}
                            </p>

                            <div className="hero-actions">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={() => navigate(`/booking/${currentMovie.id}`)}
                                >
                                    Book Tickets
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    leftIcon={<Play size={18} />}
                                    onClick={() => navigate(`/movies/${currentMovie.id}`)}
                                >
                                    View Details
                                </Button>
                            </div>
                        </motion.div>

                        {/* Poster */}
                        <motion.div
                            className="hero-poster"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <img
                                src={currentMovie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
                                alt={currentMovie.title}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {movies.length > 1 && (
                <>
                    <button className="hero-nav hero-nav-prev" onClick={goToPrev}>
                        <ChevronLeft size={24} />
                    </button>
                    <button className="hero-nav hero-nav-next" onClick={goToNext}>
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots */}
            {movies.length > 1 && (
                <div className="hero-dots">
                    {movies.map((_, index) => (
                        <button
                            key={index}
                            className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
