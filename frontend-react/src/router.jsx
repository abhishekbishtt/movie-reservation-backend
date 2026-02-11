import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@components/layout/Layout';
import { AdminLayout } from '@components/layout/AdminLayout';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';

// Pages
import Home from '@pages/Home';
import Movies from '@pages/Movies';
import MovieDetail from '@pages/MovieDetail';
import Booking from '@pages/Booking';
import Theaters from '@pages/Theaters';
import Login from '@pages/Login';
import Register from '@pages/Register';
import ForgotPassword from '@pages/ForgotPassword';
import ResetPassword from '@pages/ResetPassword';
import MyBookings from '@pages/MyBookings';
import Profile from '@pages/Profile';
import VerifyEmail from '@pages/VerifyEmail';
import NotFound from '@pages/NotFound';

// Admin Pages
import AdminDashboard from '@pages/admin/AdminDashboard';
import AdminMovies from '@pages/admin/AdminMovies';
import AdminShowtimes from '@pages/admin/AdminShowtimes';
import AdminBookings from '@pages/admin/AdminBookings';
import AdminPayments from '@pages/admin/AdminPayments';
import AdminUsers from '@pages/admin/AdminUsers';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'movies', element: <Movies /> },
            { path: 'movies/:movieId', element: <MovieDetail /> },
            { path: 'theaters', element: <Theaters /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'reset-password/:token', element: <ResetPassword /> },
            { path: 'verify-email', element: <VerifyEmail /> },
            {
                path: 'booking/:movieId',
                element: (
                    <ProtectedRoute>
                        <Booking />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'my-bookings',
                element: (
                    <ProtectedRoute>
                        <MyBookings />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute adminOnly>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: 'movies', element: <AdminMovies /> },
            { path: 'showtimes', element: <AdminShowtimes /> },
            { path: 'bookings', element: <AdminBookings /> },
            { path: 'payments', element: <AdminPayments /> },
            { path: 'users', element: <AdminUsers /> },
        ],
    },
    { path: '*', element: <NotFound /> },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
