import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Mail, CheckCircle } from 'lucide-react';
import { authService } from '@services/authService';
import { RegisterForm } from '@components/auth/RegisterForm';
import { Button } from '@components/common/Button';
import { getErrorMessage } from '@utils/helpers';
import toast from 'react-hot-toast';
import '@components/auth/AuthForms.css';

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await authService.register(data);

            // Check if verification is required
            if (response.requiresVerification) {
                setRegisteredEmail(data.email);
                setRegistrationSuccess(true);
            } else {
                toast.success('Account created successfully!');
                navigate('/login');
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            await authService.resendVerification(registeredEmail);
            toast.success('Verification email sent!');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsResending(false);
        }
    };

    // Show success message after registration
    if (registrationSuccess) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-success">
                            <div className="auth-success-icon">
                                <Mail size={48} />
                            </div>
                            <h3 className="auth-success-title">Verify Your Email</h3>
                            <p className="auth-success-message">
                                We've sent a verification link to <strong>{registeredEmail}</strong>.
                                Please check your inbox and click the link to activate your account.
                            </p>

                            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <Button
                                    variant="secondary"
                                    onClick={handleResend}
                                    loading={isResending}
                                    fullWidth
                                >
                                    Resend Verification Email
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/login')}
                                    fullWidth
                                >
                                    Go to Login
                                </Button>
                            </div>
                        </div>

                        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
                            <p className="auth-footer-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Didn't receive the email? Check your spam folder or request a new one.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <Film size={32} />
                        </div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join CineBook to book your favorite movies</p>
                    </div>

                    <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Already have an account?{' '}
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
