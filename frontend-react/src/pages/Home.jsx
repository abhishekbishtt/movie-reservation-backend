import { useState, useEffect } from 'react';
import { HeroCarousel } from '@components/movies/HeroCarousel';
import { MovieGrid } from '@components/movies/MovieGrid';
import { movieService } from '@services/movieService';
import './Home.css';

export default function Home() {
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [nowShowing, setNowShowing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            setLoading(true);

            // Fetch featured and all movies in parallel
            const [featuredRes, moviesRes] = await Promise.all([
                movieService.getFeaturedMovies().catch(() => ({ movies: [] })),
                movieService.getMovies().catch(() => ({ movies: [] })),
            ]);

            setFeaturedMovies(featuredRes.movies || featuredRes || []);
            setNowShowing(moviesRes.movies || moviesRes || []);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <HeroCarousel movies={featuredMovies.length > 0 ? featuredMovies : nowShowing.slice(0, 5)} />

            {/* Now Showing Section */}
            <section className="home-section container">
                <MovieGrid
                    movies={nowShowing}
                    loading={loading}
                    title="Now Showing"
                    subtitle="Book your tickets for the latest movies"
                    emptyMessage="No movies currently showing"
                />
            </section>

            {/* Coming Soon - Placeholder */}
            <section className="home-section container">
                <div className="coming-soon-banner">
                    <h2>Coming Soon</h2>
                    <p>Stay tuned for upcoming blockbusters!</p>
                </div>
            </section>
        </div>
    );
}
