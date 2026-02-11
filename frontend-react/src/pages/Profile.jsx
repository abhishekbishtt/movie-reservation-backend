import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Save } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { profileService } from '@services/profileService';
import { profileUpdateSchema } from '@utils/validators';
import { getErrorMessage } from '@utils/helpers';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            firstName: user?.firstName || user?.first_name || '',
            lastName: user?.lastName || user?.last_name || '',
            phone: user?.phone || '',
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await profileService.updateProfile(data);
            updateUser(response.user);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="container container-sm">
                <div className="profile-header">
                    <h1>Profile</h1>
                    <p>Manage your account settings</p>
                </div>

                {/* Profile Avatar */}
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        {user?.firstName?.[0] || user?.first_name?.[0] || 'U'}
                    </div>
                    <div className="profile-avatar-info">
                        <h2>{user?.firstName || user?.first_name} {user?.lastName || user?.last_name}</h2>
                        <p>{user?.email}</p>
                    </div>
                </div>

                {/* Profile Form */}
                <Card variant="default" className="profile-card">
                    <h3>Personal Information</h3>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-row">
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
                            value={user?.email || ''}
                            leftIcon={<Mail size={18} />}
                            disabled
                            helperText="Email cannot be changed"
                        />

                        <Input
                            label="Phone Number"
                            placeholder="10-digit phone number"
                            leftIcon={<Phone size={18} />}
                            error={errors.phone?.message}
                            {...register('phone')}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            loading={isLoading}
                            disabled={!isDirty}
                            leftIcon={<Save size={18} />}
                        >
                            Save Changes
                        </Button>
                    </form>
                </Card>

                {/* Account Info */}
                <Card variant="default" className="profile-card">
                    <h3>Account Information</h3>

                    <div className="account-info">
                        <div className="info-item">
                            <span className="info-label">Account Type</span>
                            <span className="info-value">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Member Since</span>
                            <span className="info-value">
                                {new Date(user?.createdAt || user?.created_at || Date.now()).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
