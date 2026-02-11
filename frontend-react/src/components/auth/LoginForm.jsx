import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { loginSchema } from '@utils/validators';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import './AuthForms.css';

export function LoginForm({ onSubmit, isLoading }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                {...register('email')}
            />

            <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                leftIcon={<Lock size={18} />}
                error={errors.password?.message}
                {...register('password')}
            />

            <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
                className="auth-submit-btn"
            >
                Sign In
            </Button>
        </form>
    );
}
