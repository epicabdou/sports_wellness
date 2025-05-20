import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import pb from '@/lib/pocketbase';
import { User } from '@/types';
import { router } from 'expo-router';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    requestPasswordReset: (email: string) => Promise<void>;
    updateUserProfile: (userData: UpdateUserData) => Promise<void>;
    recordActivity: (type: string, data?: any) => Promise<void>;
}

interface RegisterData {
    email: string;
    password: string;
    passwordConfirm: string;
    name?: string;
    phoneNumber?: string;
    emailVisibility?: boolean;
}

interface UpdateUserData {
    name?: string;
    phoneNumber?: string;
    avatar?: File;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Check if user is already logged in when the app loads
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (pb.authStore.isValid) {
                    setUser(pb.authStore.model);
                }
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);

            // Check if user is suspended
            if (authData.record.isSuspended) {
                logout();
                throw new Error('Your account has been suspended. Please contact an administrator.');
            }

            // Check if user is verified
            if (!authData.record.verified) {
                logout();
                throw new Error('Your account has not been verified. Please check your email.');
            }

            setUser(authData.record);

            // Record login activity
            await recordActivity('login', { message: 'Login successful' });
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            // Redirect for OAuth2 authentication with Google
            // Note: This will need special handling in a mobile app
            alert('Google authentication requires specific native integration. This is a placeholder.');

            // For actual implementation, you'll need to use expo-auth-session or similar
            // and handle the OAuth flow properly for mobile
        } catch (error: any) {
            console.error('Google login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: RegisterData) => {
        setIsLoading(true);
        try {
            const newUser = await pb.collection('users').create(userData);
            await pb.collection('users').requestVerification(userData.email);
            return newUser;
        } catch (error: any) {
            console.error('Register error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        if (user) {
            recordActivity('logout', { message: 'Logout' });
        }

        pb.authStore.clear();
        setUser(null);
        router.replace('/');
    };

    const requestPasswordReset = async (email: string) => {
        setIsLoading(true);
        try {
            await pb.collection('users').requestPasswordReset(email);
            return true;
        } catch (error: any) {
            console.error('Password reset error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateUserProfile = async (userData: UpdateUserData) => {
        setIsLoading(true);
        try {
            if (!user) {
                throw new Error('You must be logged in to update your profile.');
            }

            const formData = new FormData();

            // Add all user data to FormData
            for (const [key, value] of Object.entries(userData)) {
                if (key === 'avatar' && value instanceof File) {
                    formData.append('avatar', value);
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value as string);
                }
            }

            const updatedUser = await pb.collection('users').update(user.id, formData);
            setUser(updatedUser);

            // Record activity
            await recordActivity('profile_update', { message: 'Profile updated' });

            return updatedUser;
        } catch (error: any) {
            console.error('Profile update error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const recordActivity = async (type: string, data: any = {}) => {
        if (!user) return;

        try {
            const activityData = {
                user: user.id,
                activity: {
                    type,
                    data,
                    timestamp: new Date().toISOString()
                }
            };

            await pb.collection('userActivity').create(activityData);
        } catch (error) {
            console.error('Failed to record activity:', error);
        }
    };

    const isLoggedIn = !!user;
    const isAdmin = !!user?.isAdmin;

    return (
        <AuthContext.Provider
            value={{
        user,
            isLoading,
            isLoggedIn,
            isAdmin,
            login,
            loginWithGoogle,
            register,
            logout,
            requestPasswordReset,
            updateUserProfile,
            recordActivity
    }}
>
    {children}
    </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);