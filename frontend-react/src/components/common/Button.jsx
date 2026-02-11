import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

export const Button = forwardRef(({
    children,
    variant = 'primary', // primary, secondary, ghost, danger, outline
    size = 'md',         // sm, md, lg
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    type = 'button',
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            type={type}
            className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="btn-spinner" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
            ) : leftIcon}
            {children && <span className="btn-text">{children}</span>}
            {!loading && rightIcon}
        </button>
    );
});

Button.displayName = 'Button';
