import { Loader2 } from 'lucide-react';
import './Loader.css';

export function Loader({
    size = 'md',
    text,
    fullScreen = false,
    variant = 'default'
}) {
    const sizeMap = {
        sm: 20,
        md: 32,
        lg: 48,
        xl: 64,
    };

    if (fullScreen) {
        return (
            <div className="loader-fullscreen">
                <div className="loader-content">
                    <div className="loader-spinner-container">
                        <Loader2 className="loader-spinner" size={sizeMap[size]} />
                    </div>
                    {text && <p className="loader-text">{text}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className={`loader loader-${variant}`}>
            <Loader2 className="loader-spinner" size={sizeMap[size]} />
            {text && <span className="loader-text">{text}</span>}
        </div>
    );
}

export function PageLoader({ text = 'Loading...' }) {
    return (
        <div className="page-loader">
            <div className="page-loader-content">
                <div className="page-loader-cinema">
                    <div className="page-loader-film">
                        <div className="film-strip">
                            <div className="film-frame"></div>
                            <div className="film-frame"></div>
                            <div className="film-frame"></div>
                        </div>
                    </div>
                </div>
                <h3 className="page-loader-text">{text}</h3>
            </div>
        </div>
    );
}
