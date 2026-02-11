import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Film, Lock, CheckCircle } from 'lucide-react';
import { resetPasswordSchema } from '@utils/validators';
import { authService } from '@services/authService';
import { getErrorMessage } from '@utils/helpers';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import toast from 'react-hot-toast';
import '@components/auth/AuthForms.css';

export default function ResetPassword() {
    const { token } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await authService.resetPassword(token, data.newPassword);
            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
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
                        <h1 className="auth-title">Reset Password</h1>
                        <p className="auth-subtitle">
                            {isSuccess ? 'Your password has been reset' : 'Create a new password'}
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="auth-success">
                            <div className="auth-success-icon">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="auth-success-title">Password Reset!</h3>
                            <p className="auth-success-message">
                                Your password has been successfully reset.
                                Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="Enter new password"
                                leftIcon={<Lock size={18} />}
                                error={errors.newPassword?.message}
                                {...register('newPassword')}
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm new password"
                                leftIcon={<Lock size={18} />}
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword')}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                loading={isLoading}
                                className="auth-submit-btn"
                            >
                                Reset Password
                            </Button>
                        </form>
                    )}

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            <Link to="/login" className="auth-footer-link">
                                Back to Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
