import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MovieGrid } from '@components/movies/MovieGrid';
import { movieService } from '@services/movieService';
import { GENRES, LANGUAGES, AGE_RATINGS } from '@utils/constants';
import { Filter, X } from 'lucide-react';
import { Button } from '@components/common/Button';
import './Movies.css';

export default function Movies() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        genre: searchParams.get('genre') || '',
        language: searchParams.get('language') || '',
        ageRating: searchParams.get('ageRating') || '',
    });

    useEffect(() => {
        fetchMovies();
    }, [filters]);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v)
            );
            const response = await movieService.getMovies(activeFilters);
            setMovies(response.movies || response || []);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        // Update URL params
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({ genre: '', language: '', ageRating: '' });
        setSearchParams({});
    };

    const hasActiveFilters = Object.values(filters).some(Boolean);

    return (
        <div className="movies-page">
            <div className="container">
                {/* Header */}
                <div className="movies-header">
                    <div>
                        <h1>Movies</h1>
                        <p>Explore and book tickets for all movies</p>
                    </div>
                    <Button
                        variant="secondary"
                        leftIcon={<Filter size={18} />}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Filters
                        {hasActiveFilters && <span className="filter-badge">!</span>}
                    </Button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="movies-filters">
                        <div className="filter-group">
                            <label>Genre</label>
                            <select
                                value={filters.genre}
                                onChange={(e) => handleFilterChange('genre', e.target.value)}
                            >
                                <option value="">All Genres</option>
                                {GENRES.map((genre) => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Language</label>
                            <select
                                value={filters.language}
                                onChange={(e) => handleFilterChange('language', e.target.value)}
                            >
                                <option value="">All Languages</option>
                                {LANGUAGES.map((lang) => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Age Rating</label>
                            <select
                                value={filters.ageRating}
                                onChange={(e) => handleFilterChange('ageRating', e.target.value)}
                            >
                                <option value="">All Ratings</option>
                                {AGE_RATINGS.map((rating) => (
                                    <option key={rating} value={rating}>{rating}</option>
                                ))}
                            </select>
                        </div>

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<X size={16} />}
                                onClick={clearFilters}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                )}

                {/* Movie Grid */}
                <MovieGrid
                    movies={movies}
                    loading={loading}
                    emptyMessage="No movies match your filters"
                />
            </div>
        </div>
    );
}
