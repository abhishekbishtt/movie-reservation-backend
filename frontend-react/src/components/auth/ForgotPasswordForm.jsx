import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { forgotPasswordSchema } from '@utils/validators';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import './AuthForms.css';

export function ForgotPasswordForm({ onSubmit, isLoading }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <Input
                label="Email"
                type="email"
                placeholder="Enter your registered email"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                helperText="We'll send you a link to reset your password"
                {...register('email')}
            />

            <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
                className="auth-submit-btn"
            >
                Send Reset Link
            </Button>
        </form>
    );
}
