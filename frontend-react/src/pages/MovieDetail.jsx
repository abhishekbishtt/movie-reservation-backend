import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, Globe, Film, ArrowLeft } from 'lucide-react';
import { movieService } from '@services/movieService';
import { showtimeService } from '@services/showtimeService';
import { formatDuration, formatDate } from '@utils/formatters';
import { formatDateForAPI } from '@utils/formatters';
import { Button } from '@components/common/Button';
import { PageLoader } from '@components/common/Loader';
import { DateSelector } from '@components/booking/DateSelector';
import { ShowtimeSelector } from '@components/booking/ShowtimeSelector';
import './MovieDetail.css';

export default function MovieDetail() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(formatDateForAPI(new Date()));
    const [loadingMovie, setLoadingMovie] = useState(true);
    const [loadingShowtimes, setLoadingShowtimes] = useState(false);

    useEffect(() => {
        if (movieId) {
            fetchMovie();
        }
    }, [movieId]);

    useEffect(() => {
        if (movie && selectedDate) {
            fetchShowtimes();
        }
    }, [movie, selectedDate]);

    const fetchMovie = async () => {
        try {
            setLoadingMovie(true);
            const response = await movieService.getMovieById(movieId);
            setMovie(response.movie || response);
        } catch (error) {
            console.error('Error fetching movie:', error);
            navigate('/movies');
        } finally {
            setLoadingMovie(false);
        }
    };

    const fetchShowtimes = async () => {
        try {
            setLoadingShowtimes(true);
            const response = await showtimeService.getShowtimesByMovie(movieId, selectedDate);
            setShowtimes(response.showtimes || response || []);
        } catch (error) {
            console.error('Error fetching showtimes:', error);
            setShowtimes([]);
        } finally {
            setLoadingShowtimes(false);
        }
    };

    const handleShowtimeSelect = (showtime) => {
        navigate(`/booking/${movieId}`, {
            state: { showtime, movie, selectedDate }
        });
    };

    if (loadingMovie) {
        return <PageLoader text="Loading movie details..." />;
    }

    if (!movie) {
        return (
            <div className="movie-detail-error">
                <h2>Movie not found</h2>
                <Button onClick={() => navigate('/movies')}>Browse Movies</Button>
            </div>
        );
    }

    const genres = Array.isArray(movie.genre)
        ? movie.genre
        : movie.genre?.split(',').map(g => g.trim()) || [];

    return (
        <div className="movie-detail-page">
            {/* Backdrop */}
            <div
                className="movie-detail-backdrop"
                style={{
                    backgroundImage: `url(${movie.backdrop_url || movie.poster_url})`
                }}
            />
            <div className="movie-detail-backdrop-overlay" />

            <div className="container">
                {/* Back Button */}
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                {/* Movie Info */}
                <motion.div
                    className="movie-detail-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="movie-detail-poster">
                        <img
                            src={movie.poster_url || 'https://via.placeholder.com/300x450'}
                            alt={movie.title}
                        />
                    </div>

                    <div className="movie-detail-info">
                        <div className="movie-detail-badges">
                            {movie.rating && (
                                <span className="badge badge-rating">
                                    <Star size={14} fill="currentColor" />
                                    {Number(movie.rating).toFixed(1)}
                                </span>
                            )}
                            <span className="badge">{movie.age_rating || 'UA'}</span>
                            <span className="badge">{movie.language}</span>
                        </div>

                        <h1>{movie.title}</h1>

                        <div className="movie-detail-meta">
                            {movie.duration && (
                                <span>
                                    <Clock size={16} /> {formatDuration(movie.duration)}
                                </span>
                            )}
                            {movie.release_date && (
                                <span>
                                    <Calendar size={16} /> {formatDate(movie.release_date, 'd MMM yyyy')}
                                </span>
                            )}
                            {movie.language && (
                                <span>
                                    <Globe size={16} /> {movie.language}
                                </span>
                            )}
                        </div>

                        {genres.length > 0 && (
                            <div className="movie-detail-genres">
                                {genres.map((genre) => (
                                    <span key={genre} className="genre-tag">{genre}</span>
                                ))}
                            </div>
                        )}

                        {movie.description && (
                            <div className="movie-detail-description">
                                <h3>Synopsis</h3>
                                <p>{movie.description}</p>
                            </div>
                        )}

                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate(`/booking/${movieId}`)}
                            leftIcon={<Film size={20} />}
                        >
                            Book Tickets
                        </Button>
                    </div>
                </motion.div>

                {/* Showtimes Section */}
                <div className="movie-detail-showtimes">
                    <h2>Select Showtime</h2>

                    <DateSelector
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                    />

                    <ShowtimeSelector
                        showtimes={showtimes}
                        selectedShowtime={null}
                        onShowtimeSelect={handleShowtimeSelect}
                        loading={loadingShowtimes}
                    />
                </div>
            </div>
        </div>
    );
}
