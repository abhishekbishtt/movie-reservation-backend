import { useState, useEffect } from 'react';
import { Film, Ticket, DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '@components/common/Card';
import { formatCurrency } from '@utils/formatters';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalMovies: 12,
        totalBookings: 156,
        totalRevenue: 245000,
        totalUsers: 89,
    });

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome back! Here's what's happening with CineBook.</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <Card variant="glass" className="stat-card">
                    <div className="stat-icon stat-icon-primary">
                        <Film size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Movies</span>
                        <span className="stat-value">{stats.totalMovies}</span>
                    </div>
                </Card>

                <Card variant="glass" className="stat-card">
                    <div className="stat-icon stat-icon-success">
                        <Ticket size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Bookings</span>
                        <span className="stat-value">{stats.totalBookings}</span>
                    </div>
                </Card>

                <Card variant="glass" className="stat-card">
                    <div className="stat-icon stat-icon-gold">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
                    </div>
                </Card>

                <Card variant="glass" className="stat-card">
                    <div className="stat-icon stat-icon-purple">
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Users</span>
                        <span className="stat-value">{stats.totalUsers}</span>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
                <h2>Quick Actions</h2>
                <div className="quick-actions">
                    <Card variant="bordered" hover className="quick-action-card">
                        <Film size={24} />
                        <span>Add New Movie</span>
                    </Card>
                    <Card variant="bordered" hover className="quick-action-card">
                        <Calendar size={24} />
                        <span>Schedule Showtime</span>
                    </Card>
                    <Card variant="bordered" hover className="quick-action-card">
                        <TrendingUp size={24} />
                        <span>View Analytics</span>
                    </Card>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="dashboard-section">
                <h2>Recent Activity</h2>
                <Card variant="default" className="activity-card">
                    <p className="activity-placeholder">
                        Recent bookings and activity will appear here.
                    </p>
                </Card>
            </div>
        </div>
    );
}
