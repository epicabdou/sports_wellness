import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    RefreshControl,
    Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import {Colors} from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';

// Get the PocketBase URL from your environment or config
const POCKETBASE_URL = 'http://127.0.0.1:8090';

export default function ProfileScreen() {
    const { user, isLoggedIn, isLoading: authLoading, logout, updateUserProfile } = useAuth();
    const router = useRouter();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Refresh user data
        setIsRefreshing(false);
    };

    // Navigate to login
    const handleLogin = () => {
        router.push('/login');
    };

    // Navigate to register
    const handleRegister = () => {
        router.push('/register');
    };

    // Navigate to account settings
    const handleAccountSettings = () => {
        router.push('/account/settings');
    };

    // Navigate to activities
    const handleViewActivities = () => {
        router.push('/account/activities');
    };

    // Navigate to saved articles
    const handleSavedArticles = () => {
        router.push('/account/saved');
    };

    // Navigate to comments
    const handleViewComments = () => {
        router.push('/account/comments');
    };

    // Handle logout
    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Déconnecter', style: 'destructive', onPress: logout }
            ]
        );
    };

    // Handle profile picture
    const handleUpdateProfilePicture = async () => {
        try {
            // Ask for permissions first
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission refusée',
                    'Nous avons besoin de votre autorisation pour accéder à la galerie.'
                );
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                // Convert image to file object
                const imageUri = result.assets[0].uri;

                setIsUpdating(true);

                // Create formData for the image
                const formData = new FormData();
                formData.append('avatar', {
                    uri: imageUri,
                    name: 'avatar.jpg',
                    type: 'image/jpeg'
                } as any);

                try {
                    await updateUserProfile({ avatar: formData.get('avatar') as any });
                    Alert.alert('Succès', 'Photo de profil mise à jour avec succès');
                } catch (error: any) {
                    Alert.alert('Erreur', error.message || 'Échec de la mise à jour de la photo de profil');
                } finally {
                    setIsUpdating(false);
                }
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image');
        }
    };

    // Get user avatar or placeholder
    const getUserAvatar = () => {
        if (user?.avatar) {
            return `${POCKETBASE_URL}/api/files/users/${user.id}/${user.avatar}`;
        }
        return null;
    };

    // Get user initial for avatar placeholder
    const getUserInitial = () => {
        if (!user) return 'U';
        return (user.name || user.email || 'U').charAt(0).toUpperCase();
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    colors={[Colors.primary]}
                    tintColor={Colors.primary}
                />
            }
        >
            {authLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : isLoggedIn && user ? (
                <>
                    {/* User Profile Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            {isUpdating ? (
                                <ActivityIndicator size="small" color={Colors.primary} style={styles.avatarLoader} />
                            ) : (
                                <TouchableOpacity onPress={handleUpdateProfilePicture}>
                                    {getUserAvatar() ? (
                                        <Image
                                            source={{ uri: getUserAvatar() as string }}
                                            style={styles.avatar}
                                        />
                                    ) : (
                                        <View style={styles.avatarPlaceholder}>
                                            <Text style={styles.initialText}>{getUserInitial()}</Text>
                                        </View>
                                    )}
                                    <View style={styles.editAvatarButton}>
                                        <Ionicons name="camera" size={16} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Text style={styles.userName}>{user.name || 'Utilisateur'}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>

                        {user.isAdmin && (
                            <View style={styles.adminBadge}>
                                <Text style={styles.adminBadgeText}>Admin</Text>
                            </View>
                        )}

                        <Button
                            title="Modifier le profil"
                            onPress={handleAccountSettings}
                            variant="outline"
                            size="small"
                            style={styles.editProfileButton}
                        />
                    </View>

                    {/* Activity Links */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Activités</Text>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleViewActivities}
                        >
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="time-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuItemText}>Historique des activités</Text>
                                <Text style={styles.menuItemDescription}>Consultez vos actions récentes</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleSavedArticles}
                        >
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="heart-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuItemText}>Articles aimés</Text>
                                <Text style={styles.menuItemDescription}>Articles que vous avez aimés</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleViewComments}
                        >
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="chatbubble-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuItemText}>Mes commentaires</Text>
                                <Text style={styles.menuItemDescription}>Vos commentaires sur les articles</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Preferences */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Préférences</Text>

                        <View style={styles.menuItem}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuItemText}>Notifications</Text>
                                <Text style={styles.menuItemDescription}>Activez les notifications push</Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: '#d1d5db', true: Colors.primaryLight }}
                                thumbColor={notificationsEnabled ? Colors.primary : '#f3f4f6'}
                            />
                        </View>

                        <View style={styles.menuItem}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="moon-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuItemText}>Mode sombre</Text>
                                <Text style={styles.menuItemDescription}>Changer l'apparence de l'application</Text>
                            </View>
                            <Switch
                                value={darkModeEnabled}
                                onValueChange={setDarkModeEnabled}
                                trackColor={{ false: '#d1d5db', true: Colors.primaryLight }}
                                thumbColor={darkModeEnabled ? Colors.primary : '#f3f4f6'}
                            />
                        </View>
                    </View>

                    {/* Other Options */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Autres</Text>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {}}
                        >
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="help-buoy-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuItemText}>Aide & Support</Text>
                                <Text style={styles.menuItemDescription}>Obtenez de l'aide ou contactez-nous</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {}}
                        >
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="document-text-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuItemText}>Conditions d'utilisation</Text>
                                <Text style={styles.menuItemDescription}>Lire nos conditions</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {}}
                        >
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="shield-checkmark-outline" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuItemText}>Politique de confidentialité</Text>
                                <Text style={styles.menuItemDescription}>Comment nous utilisons vos données</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Logout Button */}
                    <Button
                        title="Déconnexion"
                        onPress={handleLogout}
                        variant="danger"
                        fullWidth
                        style={styles.logoutButton}
                    />
                </>
            ) : (
                /* Not logged in view */
                <View style={styles.authContainer}>
                    <Ionicons name="person-circle-outline" size={100} color={Colors.primaryLight} />
                    <Text style={styles.authTitle}>Connectez-vous pour accéder à votre profil</Text>
                    <Text style={styles.authDescription}>
                        Connectez-vous pour voir votre profil, gérer vos activités et accéder à toutes les fonctionnalités.
                    </Text>
                    <View style={styles.authButtons}>
                        <Button
                            title="Se connecter"
                            onPress={handleLogin}
                            style={styles.loginButton}
                        />
                        <Button
                            title="S'inscrire"
                            onPress={handleRegister}
                            variant="outline"
                            style={styles.registerButton}
                        />
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    contentContainer: {
        paddingBottom: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    // Logged in user profile
    profileSection: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: Colors.card,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#fff',
    },
    avatarLoader: {
        width: 100,
        height: 100,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 12,
    },
    adminBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 16,
    },
    adminBadgeText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    editProfileButton: {
        minWidth: 150,
    },
    // Sections
    section: {
        backgroundColor: Colors.card,
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginVertical: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
    },
    menuItemDescription: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    logoutButton: {
        marginTop: 24,
        marginHorizontal: 16,
    },
    // Auth container (not logged in)
    authContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop: 40,
    },
    authTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    authDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    authButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginButton: {
        flex: 1,
        marginRight: 8,
    },
    registerButton: {
        flex: 1,
        marginLeft: 8,
    },
});