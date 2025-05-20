import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import {Colors} from '@/constants/Colors';

export default function LoginScreen() {
    const { login, loginWithGoogle, isLoading } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleLogin = async () => {
        // Basic validation
        if (!email.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setError('');

        try {
            await login(email, password);
            // Redirect to home on successful login
            router.replace('/');
        } catch (err: any) {
            setError(err.message || 'Erreur de connexion. Veuillez réessayer.');
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');

        try {
            await loginWithGoogle();
            // Redirect on successful login
            router.replace('/');
        } catch (err: any) {
            setError(err.message || 'Erreur de connexion avec Google. Veuillez réessayer.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const navigateToRegister = () => {
        router.push('/register');
    };

    const navigateToForgotPassword = () => {
        router.push('/forgot-password');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.appName}>Sport & Bien-être</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Connexion</Text>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={20} color={Colors.danger} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <Input
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Adresse email"
                        label="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        required
                    />

                    <Input
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Mot de passe"
                        label="Mot de passe"
                        secureTextEntry
                        required
                    />

                    <TouchableOpacity
                        style={styles.forgotPasswordLink}
                        onPress={navigateToForgotPassword}
                    >
                        <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Se connecter"
                        onPress={handleLogin}
                        loading={isLoading}
                        disabled={isLoading || !email.trim() || !password.trim()}
                        fullWidth
                        style={styles.loginButton}
                    />

                    <View style={styles.orContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.orText}>ou</Text>
                        <View style={styles.divider} />
                    </View>

                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleGoogleLogin}
                        disabled={googleLoading || isLoading}
                    >
                        {googleLoading ? (
                            <ActivityIndicator size="small" color={Colors.text} />
                        ) : (
                            <>
                                <Image
                                    source={require('@/assets/google-logo.png')}
                                    style={styles.googleIcon}
                                />
                                <Text style={styles.googleButtonText}>Continuer avec Google</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Vous n'avez pas de compte ?</Text>
                    <TouchableOpacity onPress={navigateToRegister}>
                        <Text style={styles.signupLink}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    appName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primary,
    },
    formContainer: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 24,
        textAlign: 'center',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fee2e2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        marginLeft: 8,
        flex: 1,
        color: Colors.danger,
        fontSize: 14,
    },
    forgotPasswordLink: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        height: 48,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    orText: {
        color: Colors.textSecondary,
        paddingHorizontal: 16,
        fontSize: 14,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        height: 48,
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 12,
    },
    googleButtonText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '500',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
    },
    signupText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    signupLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
});