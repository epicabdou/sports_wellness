import { useEffect } from 'react';
import { Slot, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a React Query client
const queryClient = new QueryClient()

// Auth protection wrapper component
function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Skip during initial load
        if (isLoading) return;

        // Get the first segment to check if it's protected
        const inAuthGroup = segments[0] === '(auth)';
        const inProtectedGroup = segments[0] === '(protected)';

        if (!isLoggedIn && inProtectedGroup) {
            // Redirect to login if trying to access protected routes while not logged in
            router.replace('/login');
        } else if (isLoggedIn && inAuthGroup) {
            // Redirect to home if trying to access auth routes while logged in
            router.replace('/');
        }
    }, [isLoggedIn, segments, isLoading]);

    return <>{children}</>;
}

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AuthGuard>
                    <StatusBar style="auto" />
                    <Slot />
                </AuthGuard>
            </AuthProvider>
        </QueryClientProvider>
    );
}