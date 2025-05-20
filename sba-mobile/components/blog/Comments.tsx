import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useAddComment, useDeleteComment } from '@/hooks/useComments';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';

// Get the PocketBase URL from your environment or config
const POCKETBASE_URL = 'http://your-pocketbase-url.com';

interface CommentsProps {
    postId: string;
    postTitle: string;
    comments: Comment[];
    isLoading?: boolean;
}

const Comments: React.FC<CommentsProps> = ({
                                               postId,
                                               postTitle,
                                               comments,
                                               isLoading = false
                                           }) => {
    const { user, isLoggedIn } = useAuth();
    const [newComment, setNewComment] = useState('');

    const addComment = useAddComment(postId, postTitle);
    const deleteComment = useDeleteComment(postId);

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        // Format: "May 15, 2024 at 14:30"
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get author avatar or placeholder
    const getAuthorAvatar = (comment: Comment) => {
        if (comment.expand?.user?.avatar) {
            return `${POCKETBASE_URL}/api/files/users/${comment.expand.user.id}/${comment.expand.user.avatar}`;
        }
        return null;
    };

    // Get author name or email
    const getAuthorName = (comment: Comment) => {
        return comment.expand?.user?.name || comment.expand?.user?.email || 'Anonymous';
    };

    // Get author initial for avatar placeholder
    const getAuthorInitial = (comment: Comment) => {
        const authorName = getAuthorName(comment);
        return authorName.charAt(0).toUpperCase();
    };

    // Check if comment belongs to current user
    const isUserComment = (comment: Comment) => {
        return user && comment.user === user.id;
    };

    // Handle submit new comment
    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        try {
            await addComment.mutateAsync(newComment);
            setNewComment('');
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Erreur lors de l\'ajout du commentaire');
        }
    };

    // Handle delete comment
    const handleDeleteComment = (commentId: string) => {
        Alert.alert(
            'Supprimer le commentaire',
            'Êtes-vous sûr de vouloir supprimer ce commentaire ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteComment.mutateAsync(commentId);
                        } catch (error: any) {
                            Alert.alert('Erreur', error.message || 'Erreur lors de la suppression du commentaire');
                        }
                    }
                },
            ]
        );
    };

    // Render item for FlatList
    const renderItem = ({ item }: { item: Comment }) => (
        <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
                <View style={styles.authorContainer}>
                    {getAuthorAvatar(item) ? (
                        <Image
                            source={{ uri: getAuthorAvatar(item) as string }}
                            style={styles.authorAvatar}
                        />
                    ) : (
                        <View style={styles.authorInitial}>
                            <Text style={styles.initialText}>{getAuthorInitial(item)}</Text>
                        </View>
                    )}
                    <View style={styles.authorInfo}>
                        <Text style={styles.authorName}>
                            {getAuthorName(item)}
                        </Text>
                        <Text style={styles.dateText}>
                            {formatDate(item.created)}
                        </Text>
                    </View>
                </View>

                {isUserComment(item) && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteComment(item.id)}
                    >
                        <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.commentContent}>{item.content}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Commentaires ({comments.length})</Text>

            {/* Comment form for logged in users */}
            {isLoggedIn ? (
                <View style={styles.formContainer}>
                    <Input
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder="Ajouter un commentaire..."
                        multiline
                        numberOfLines={3}
                    />
                    <View style={styles.submitContainer}>
                        <Button
                            title="Commenter"
                            onPress={handleSubmitComment}
                            disabled={!newComment.trim() || addComment.isLoading}
                            loading={addComment.isLoading}
                            size="small"
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.loginPrompt}>
                    <Text style={styles.loginText}>
                        Vous devez être connecté pour commenter.
                    </Text>
                    <Button
                        title="Se connecter"
                        onPress={() => {
                            // Navigate to login screen
                        }}
                        variant="outline"
                        size="small"
                    />
                </View>
            )}

            {/* Comments list */}
            {isLoading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
            ) : comments.length > 0 ? (
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.commentsList}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Aucun commentaire pour l'instant. Soyez le premier à commenter !
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 16,
    },
    formContainer: {
        marginBottom: 24,
    },
    submitContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    loginPrompt: {
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
    },
    loginText: {
        color: Colors.textSecondary,
        marginBottom: 12,
    },
    loader: {
        marginVertical: 20,
    },
    commentsList: {
        paddingBottom: 16,
    },
    commentItem: {
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    authorInitial: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    authorInfo: {
        marginLeft: 8,
    },
    authorName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    dateText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    deleteButton: {
        padding: 4,
    },
    commentContent: {
        fontSize: 14,
        lineHeight: 20,
        color: Colors.text,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: Colors.textSecondary,
        textAlign: 'center',
    },
});

export default Comments;