import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',    // sm, md, lg, xl, full
    showCloseButton = true,
    closeOnOverlay = true,
    footer,
}) {
    const overlayRef = useRef();

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Close on overlay click
    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === overlayRef.current) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={overlayRef}
                    className="modal-overlay"
                    onClick={handleOverlayClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`modal modal-${size}`}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {(title || showCloseButton) && (
                            <div className="modal-header">
                                {title && <h2 className="modal-title">{title}</h2>}
                                {showCloseButton && (
                                    <button className="modal-close" onClick={onClose}>
                                        <X size={24} />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="modal-content">{children}</div>
                        {footer && <div className="modal-footer">{footer}</div>}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
