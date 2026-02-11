import './Card.css';

export function Card({
    children,
    variant = 'default', // default, elevated, glass, bordered
    padding = 'md',      // none, sm, md, lg
    hover = false,
    onClick,
    className = '',
    ...props
}) {
    return (
        <div
            className={`card card-${variant} card-padding-${padding} ${hover ? 'card-hover' : ''} ${onClick ? 'card-clickable' : ''} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return <div className={`card-header ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
    return <div className={`card-body ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
    return <div className={`card-footer ${className}`}>{children}</div>;
}
