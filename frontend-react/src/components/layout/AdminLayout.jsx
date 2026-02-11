import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Film,
    Calendar,
    Ticket,
    CreditCard,
    Users,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';
import { Navbar } from './Navbar';
import './AdminLayout.css';

const sidebarLinks = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/movies', icon: Film, label: 'Movies' },
    { path: '/admin/showtimes', icon: Calendar, label: 'Showtimes' },
    { path: '/admin/bookings', icon: Ticket, label: 'Bookings' },
    { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { path: '/admin/users', icon: Users, label: 'Users' },
];

export function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="admin-layout">
            <Navbar />

            {/* Mobile Sidebar Toggle */}
            <button
                className="admin-sidebar-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <h2>Admin Panel</h2>
                </div>

                <nav className="admin-sidebar-nav">
                    {sidebarLinks.map(({ path, icon: Icon, label, exact }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`admin-sidebar-link ${isActive(path, exact) ? 'active' : ''}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <Icon size={20} />
                            <span>{label}</span>
                            <ChevronRight size={16} className="admin-sidebar-arrow" />
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
