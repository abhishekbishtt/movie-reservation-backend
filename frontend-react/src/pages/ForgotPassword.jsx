import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, CheckCircle } from 'lucide-react';
import { ForgotPasswordForm } from '@components/auth/ForgotPasswordForm';
import { authService } from '@services/authService';
import { getErrorMessage } from '@utils/helpers';
import toast from 'react-hot-toast';
import '@components/auth/AuthForms.css';

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        setIsLoading(true);
        try {
            await authService.forgotPassword(data.email);
            setIsSuccess(true);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <Film size={32} />
                        </div>
                        <h1 className="auth-title">Forgot Password?</h1>
                        <p className="auth-subtitle">
                            {isSuccess
                                ? 'Check your email for reset instructions'
                                : "No worries, we'll send you reset instructions"}
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="auth-success">
                            <div className="auth-success-icon">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="auth-success-title">Email Sent!</h3>
                            <p className="auth-success-message">
                                We've sent a password reset link to your email address.
                                Please check your inbox and follow the instructions.
                            </p>
                        </div>
                    ) : (
                        <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
                    )}

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Remember your password?{' '}
                            <Link to="/login" className="auth-footer-link">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
