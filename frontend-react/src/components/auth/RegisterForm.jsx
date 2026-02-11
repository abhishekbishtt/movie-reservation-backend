import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User } from 'lucide-react';
import { registerSchema } from '@utils/validators';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import './AuthForms.css';

export function RegisterForm({ onSubmit, isLoading }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-form-row">
                <Input
                    label="First Name"
                    placeholder="John"
                    leftIcon={<User size={18} />}
                    error={errors.firstName?.message}
                    {...register('firstName')}
                />

                <Input
                    label="Last Name"
                    placeholder="Doe"
                    leftIcon={<User size={18} />}
                    error={errors.lastName?.message}
                    {...register('lastName')}
                />
            </div>

            <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                {...register('email')}
            />

            <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                leftIcon={<Lock size={18} />}
                error={errors.password?.message}
                {...register('password')}
            />

            <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
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
                Create Account
            </Button>
        </form>
    );
}
