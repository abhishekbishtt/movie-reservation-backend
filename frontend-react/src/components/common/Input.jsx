import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

export const Input = forwardRef(({
    label,
    type = 'text',
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    fullWidth = true,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className={`input-wrapper ${fullWidth ? 'input-full' : ''} ${className}`}>
            {label && (
                <label className="input-label" htmlFor={props.id || props.name}>
                    {label}
                </label>
            )}

            <div className={`input-container ${error ? 'input-error' : ''}`}>
                {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}

                <input
                    ref={ref}
                    type={inputType}
                    className={`input ${leftIcon ? 'has-left-icon' : ''} ${rightIcon || isPassword ? 'has-right-icon' : ''}`}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="input-icon input-icon-right input-toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}

                {!isPassword && rightIcon && (
                    <span className="input-icon input-icon-right">{rightIcon}</span>
                )}
            </div>

            {(error || helperText) && (
                <span className={`input-helper ${error ? 'input-helper-error' : ''}`}>
                    {error || helperText}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';
