import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@context/AuthContext';
import { BookingProvider } from '@context/BookingContext';
import { ErrorBoundary } from '@components/common/ErrorBoundary';
import { AppRouter } from './router';
import '@/styles/index.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BookingProvider>
          <AppRouter />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f1f1f',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </BookingProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
