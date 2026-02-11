import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Film, CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { authService } from '@services/authService';
import { getErrorMessage } from '@utils/helpers';
import { Button } from '@components/common/Button';
import toast from 'react-hot-toast';
import '@components/auth/AuthForms.css';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');
    const [resendEmail, setResendEmail] = useState('');
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (token) {
            verifyEmail();
        } else {
            setStatus('error');
            setMessage('No verification token provided.');
        }
    }, [token]);

    const verifyEmail = async () => {
        try {
            setStatus('verifying');
            const response = await authService.verifyEmail(token);
            setStatus('success');
            setMessage(response.message || 'Email verified successfully!');
        } catch (error) {
            setStatus('error');
            setMessage(getErrorMessage(error));
        }
    };

    const handleResend = async () => {
        if (!resendEmail) {
            toast.error('Please enter your email address');
            return;
        }

        setIsResending(true);
        try {
            await authService.resendVerification(resendEmail);
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
                        <h1 className="auth-title">Email Verification</h1>
                    </div>

                    {status === 'verifying' && (
                        <div className="verify-status">
                            <Loader2 size={48} className="animate-spin verify-icon verify-icon-loading" />
                            <h3>Verifying your email...</h3>
                            <p>Please wait while we verify your email address.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="verify-status">
                            <div className="verify-icon-wrapper verify-icon-success">
                                <CheckCircle size={48} />
                            </div>
                            <h3>Email Verified!</h3>
                            <p>{message}</p>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/login')}
                                fullWidth
                                className="mt-lg"
                            >
                                Continue to Login
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="verify-status">
                            <div className="verify-icon-wrapper verify-icon-error">
                                <XCircle size={48} />
                            </div>
                            <h3>Verification Failed</h3>
                            <p>{message}</p>

                            <div className="resend-section">
                                <p className="resend-label">Request a new verification email:</p>
                                <div className="resend-form">
                                    <div className="resend-input-wrapper">
                                        <Mail size={18} />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={resendEmail}
                                            onChange={(e) => setResendEmail(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={handleResend}
                                        loading={isResending}
                                    >
                                        Resend
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            <Link to="/login" className="auth-footer-link">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        .verify-status {
          text-align: center;
          padding: var(--space-lg) 0;
        }
        
        .verify-icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto var(--space-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
        }
        
        .verify-icon-loading {
          color: var(--primary-400);
          margin: 0 auto var(--space-lg);
          display: block;
        }
        
        .verify-icon-success {
          background: rgba(34, 197, 94, 0.1);
          color: var(--success);
        }
        
        .verify-icon-error {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }
        
        .verify-status h3 {
          font-size: 1.25rem;
          margin-bottom: var(--space-sm);
        }
        
        .verify-status p {
          color: var(--text-muted);
          margin-bottom: 0;
        }
        
        .resend-section {
          margin-top: var(--space-xl);
          padding-top: var(--space-xl);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .resend-label {
          margin-bottom: var(--space-md) !important;
          color: var(--text-secondary) !important;
        }
        
        .resend-form {
          display: flex;
          gap: var(--space-sm);
        }
        
        .resend-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0.75rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
        }
        
        .resend-input-wrapper svg {
          color: var(--text-muted);
          flex-shrink: 0;
        }
        
        .resend-input-wrapper input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--text-primary);
        }
        
        .mt-lg {
          margin-top: var(--space-lg);
        }
      `}</style>
        </div>
    );
}
