import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { searchService } from '@services/searchService';
import { debounce } from '@utils/helpers';
import './SearchBar.css';

export function SearchBar({ placeholder = 'Search movies...', className = '' }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    // Debounced search
    const debouncedSearch = useCallback(
        debounce(async (searchQuery) => {
            if (searchQuery.trim().length < 2) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            try {
                const data = await searchService.getSuggestions(searchQuery);
                setResults(data.movies || data || []);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (query.trim()) {
            setIsLoading(true);
            debouncedSearch(query);
        } else {
            setResults([]);
        }
    }, [query, debouncedSearch]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSelect(results[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    const handleSelect = (movie) => {
        setQuery('');
        setIsOpen(false);
        navigate(`/movies/${movie.id}`);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        inputRef.current?.focus();
    };

    return (
        <div className={`search-bar-container ${className}`} ref={containerRef}>
            <div className="search-bar">
                <Search className="search-bar-icon" size={18} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="search-bar-input"
                />
                {isLoading && <Loader2 className="search-bar-loader animate-spin" size={16} />}
                {query && !isLoading && (
                    <button className="search-bar-clear" onClick={handleClear}>
                        <X size={16} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        className="search-results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        {results.map((movie, index) => (
                            <button
                                key={movie.id}
                                className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                                onClick={() => handleSelect(movie)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <img
                                    src={movie.poster_url || 'https://via.placeholder.com/50x75?text=No+Poster'}
                                    alt={movie.title}
                                    className="search-result-poster"
                                />
                                <div className="search-result-info">
                                    <span className="search-result-title">{movie.title}</span>
                                    <span className="search-result-meta">
                                        {movie.release_date?.split('-')[0]} • {movie.language}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
