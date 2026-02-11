import './Skeleton.css';

export function Skeleton({
    variant = 'text', // text, circular, rectangular, card
    width,
    height,
    className = '',
    count = 1,
    ...props
}) {
    const style = {
        width: width || (variant === 'circular' ? height : '100%'),
        height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? width : '100px'),
    };

    if (count > 1) {
        return (
            <div className="skeleton-group">
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className={`skeleton skeleton-${variant} ${className}`}
                        style={style}
                        {...props}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`skeleton skeleton-${variant} ${className}`}
            style={style}
            {...props}
        />
    );
}

export function MovieCardSkeleton() {
    return (
        <div className="movie-card-skeleton">
            <Skeleton variant="rectangular" height="300px" className="skeleton-poster" />
            <div className="skeleton-info">
                <Skeleton width="80%" height="1.5rem" />
                <Skeleton width="60%" height="1rem" />
                <div className="skeleton-tags">
                    <Skeleton width="60px" height="24px" className="skeleton-tag" />
                    <Skeleton width="50px" height="24px" className="skeleton-tag" />
                </div>
                <Skeleton height="40px" className="skeleton-button" />
            </div>
        </div>
    );
}

export function MovieGridSkeleton({ count = 8 }) {
    return (
        <div className="movie-grid-skeleton">
            {Array.from({ length: count }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </div>
    );
}
