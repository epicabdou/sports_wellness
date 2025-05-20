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

export default function RegisterScreen() {
    const { register, loginWithGoogle } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        passwordConfirm: '',
        emailVisibility: true
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);

    // Update form field
    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Basic validation
    const validateForm = () => {
        if (!formData.email.trim() || !formData.password.trim() || !formData.passwordConfirm.trim()) {
            setError('Veuillez remplir tous les champs obligatoires');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Veuillez entrer une adresse email valide');
            return false;
        }

        // Password validation
        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return false;
        }

        // Password confirmation
        if (formData.password !== formData.passwordConfirm) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }

        // Terms agreement
        if (!agreeToTerms) {
            setError('Vous devez accepter les conditions d\'utilisation');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setError('');
        setIsLoading(true);

        try {
            await register(formData);

            setSuccess('Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.');
            setRegistrationComplete(true);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');

        try {
            await loginWithGoogle();
            router.replace('/');
        } catch (err: any) {
            setError(err.message || 'Erreur de connexion avec Google. Veuillez réessayer.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const navigateToLogin = () => {
        router.push('/login');
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

                {registrationComplete ? (
                    <View style={styles.successContainer}>
                        <View style={styles.successIconContainer}>
                            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
                        </View>
                        <Text style={styles.successTitle}>Inscription réussie !</Text>
                        <Text style={styles.successText}>
                            Un email de vérification a été envoyé à {formData.email}. Veuillez vérifier votre email pour activer votre compte.
                        </Text>
                        <Button
                            title="Aller à la page de connexion"
                            onPress={navigateToLogin}
                            style={styles.successButton}
                        />
                    </View>
                ) : (
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Créer un compte</Text>

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={20} color={Colors.danger} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : success ? (
                            <View style={styles.successMessageContainer}>
                                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                                <Text style={styles.successMessageText}>{success}</Text>
                            </View>
                        ) : null}

                        <Input
                            value={formData.name}
                            onChangeText={(value) => updateField('name', value)}
                            placeholder="Votre nom"
                            label="Nom complet"
                        />

                        <Input
                            value={formData.email}
                            onChangeText={(value) => updateField('email', value)}
                            placeholder="votre@email.com"
                            label="Adresse email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            required
                        />

                        <Input
                            value={formData.phoneNumber}
                            onChangeText={(value) => updateField('phoneNumber', value)}
                            placeholder="Votre numéro de téléphone"
                            label="Numéro de téléphone"
                            keyboardType="phone-pad"
                        />

                        <Input
                            value={formData.password}
                            onChangeText={(value) => updateField('password', value)}
                            placeholder="Créer un mot de passe"
                            label="Mot de passe"
                            secureTextEntry
                            required
                            helpText="Le mot de passe doit contenir au moins 8 caractères"
                        />

                        <Input
                            value={formData.passwordConfirm}
                            onChangeText={(value) => updateField('passwordConfirm', value)}
                            placeholder="Confirmer le mot de passe"
                            label="Confirmer le mot de passe"
                            secureTextEntry
                            required
                        />

                        <TouchableOpacity
                            style={styles.termsContainer}
                            onPress={() => setAgreeToTerms(!agreeToTerms)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.checkbox}>
                                {agreeToTerms && (
                                    <Ionicons name="checkmark" size={16} color={Colors.primary} />
                                )}
                            </View>
                            <Text style={styles.termsText}>
                                J'accepte les{' '}
                                <Text style={styles.termsLink}>conditions d'utilisation</Text> et la{' '}
                                <Text style={styles.termsLink}>politique de confidentialité</Text>
                            </Text>
                        </TouchableOpacity>

                        <Button
                            title="S'inscrire"
                            onPress={handleRegister}
                            loading={isLoading}
                            disabled={isLoading}
                            fullWidth
                            style={styles.registerButton}
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
                )}

                {!registrationComplete && (
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
                        <TouchableOpacity onPress={navigateToLogin}>
                            <Text style={styles.loginLink}>Se connecter</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        marginBottom: 24,
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 12,
    },
    appName: {
        fontSize: 20,
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
        alignItems: 'flex-start',
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
    successMessageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#d1fae5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    successMessageText: {
        marginLeft: 8,
        flex: 1,
        color: Colors.success,
        fontSize: 14,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    termsText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: Colors.textSecondary,
    },
    termsLink: {
        color: Colors.primary,
        fontWeight: '500',
    },
    registerButton: {
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    loginText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    // Success view
    successContainer: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    successIconContainer: {
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
    },
    successText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    successButton: {
        minWidth: 200,
    },
});