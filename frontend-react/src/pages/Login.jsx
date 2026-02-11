import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { authService } from '@services/authService';
import { LoginForm } from '@components/auth/LoginForm';
import { Button } from '@components/common/Button';
import { getErrorMessage } from '@utils/helpers';
import toast from 'react-hot-toast';
import '@components/auth/AuthForms.css';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [verificationRequired, setVerificationRequired] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setVerificationRequired(false);
        try {
            await login(data);
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } catch (error) {
            // Check if the error is about unverified email
            const errorData = error.response?.data;
            if (errorData?.requiresVerification) {
                setVerificationRequired(true);
                setUnverifiedEmail(errorData.email || data.email);
            } else {
                toast.error(getErrorMessage(error));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            await authService.resendVerification(unverifiedEmail);
            toast.success('Verification email sent! Check your inbox.');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsResending(false);
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
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Sign in to continue to CineBook</p>
                    </div>

                    {/* Verification Required Alert */}
                    {verificationRequired && (
                        <div className="verification-alert">
                            <div className="verification-alert-icon">
                                <AlertCircle size={20} />
                            </div>
                            <div className="verification-alert-content">
                                <p><strong>Email not verified</strong></p>
                                <p>Please check your inbox for the verification email sent to <strong>{unverifiedEmail}</strong></p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResend}
                                    loading={isResending}
                                    style={{ marginTop: '0.5rem' }}
                                >
                                    Resend Verification Email
                                </Button>
                            </div>
                        </div>
                    )}

                    <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />

                    <Link to="/forgot-password" className="auth-forgot-link">
                        Forgot password?
                    </Link>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-footer-link">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .verification-alert {
                    display: flex;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    border-radius: var(--radius-lg);
                    margin-bottom: 1.5rem;
                }
                
                .verification-alert-icon {
                    flex-shrink: 0;
                    color: var(--warning);
                }
                
                .verification-alert-content {
                    flex: 1;
                }
                
                .verification-alert-content p {
                    margin: 0;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }
                
                .verification-alert-content p:first-child {
                    margin-bottom: 0.25rem;
                }
            `}</style>
        </div>
    );
}
