import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Share,
    useWindowDimensions,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import { usePost, useToggleLike } from '@/hooks/usePosts';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/contexts/AuthContext';
import Comments from '@/components/blog/Comments';
import LikeButton from '@/components/blog/LikeButton';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';

// Get the PocketBase URL from your environment or config
const POCKETBASE_URL = 'http://your-pocketbase-url.com';

export default function PostDetailScreen() {
    const { slug, title } = useLocalSearchParams();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { isLoggedIn } = useAuth();
    const scrollViewRef = useRef<ScrollView>(null);

    const [isSharing, setIsSharing] = useState(false);

    // Fetch post data
    const {
        data: post,
        isLoading,
        error,
        refetch
    } = usePost(slug as string);

    // Like functionality
    const toggleLike = useToggleLike(
        post?.id || '',
        post?.title || ''
    );

    // Handle like toggle
    const handleToggleLike = async () => {
        if (!isLoggedIn) {
            Alert.alert(
                'Connexion requise',
                'Vous devez être connecté pour aimer cet article.',
                [
                    { text: 'Annuler', style: 'cancel' },
                    {
                        text: 'Se connecter',
                        onPress: () => router.push('/login')
                    }
                ]
            );
            return;
        }

        try {
            await toggleLike.mutateAsync();
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Erreur lors de l\'action "J\'aime". Veuillez réessayer.');
        }
    };

    // Handle share
    const handleShare = async () => {
        if (!post) return;

        setIsSharing(true);

        try {
            const result = await Share.share({
                title: post.title,
                message: `${post.title} | Sport & Bien-être\n\n${post.excerpt}\n\nLire l'article complet: https://sportbienetre.com/blog/${post.slug}`,
            });

            if (result.action === Share.sharedAction) {
                console.log('Shared successfully');
            }
        } catch (error) {
            console.error('Error sharing post:', error);
        } finally {
            setIsSharing(false);
        }
    };

    // Get category link
    const handleCategoryPress = () => {
        if (!post?.expand?.category) return;

        router.push({
            pathname: `/blog/category/${post.expand.category.slug}`,
            params: { title: post.expand.category.name }
        });
    };

    // Scroll to comments
    const scrollToComments = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Get image url
    const getImageUrl = () => {
        if (post?.image) {
            return `${POCKETBASE_URL}/api/files/posts/${post.id}/${post.image}`;
        }
        return null;
    };

    // Get author avatar or placeholder
    const getAuthorAvatar = () => {
        if (post?.expand?.author?.avatar) {
            return `${POCKETBASE_URL}/api/files/users/${post.expand.author.id}/${post.expand.author.avatar}`;
        }
        return null;
    };

    // Get author initial for avatar placeholder
    const getAuthorInitial = () => {
        if (!post?.expand?.author) return 'A';

        const authorName = post.expand.author.name || post.expand.author.email || 'A';
        return authorName.charAt(0).toUpperCase();
    };

    // Get tags array
    const getTags = () => {
        if (!post?.tags) return [];
        return post.tags.split(',').map(tag => tag.trim());
    };

    // Render HTML content
    const renderHtmlContent = () => {
        if (!post?.content) return null;

        const tagsStyles = {
            body: {
                fontFamily: 'System',
                color: Colors.text,
                fontSize: 16,
                lineHeight: 24,
            },
            h1: {
                fontSize: 24,
                fontWeight: 'bold',
                color: Colors.text,
                marginVertical: 12,
            },
            h2: {
                fontSize: 22,
                fontWeight: 'bold',
                color: Colors.text,
                marginVertical: 10,
            },
            h3: {
                fontSize: 20,
                fontWeight: 'bold',
                color: Colors.text,
                marginVertical: 8,
            },
            p: {
                marginVertical: 8,
            },
            a: {
                color: Colors.primary,
                textDecorationLine: 'underline',
            },
            ul: {
                marginLeft: 16,
                marginVertical: 8,
            },
            ol: {
                marginLeft: 16,
                marginVertical: 8,
            },
            li: {
                marginBottom: 4,
            },
            blockquote: {
                borderLeftWidth: 4,
                borderLeftColor: Colors.primaryLight,
                paddingLeft: 12,
                marginLeft: 0,
                fontStyle: 'italic',
                marginVertical: 12,
            },
            img: {
                borderRadius: 8,
                marginVertical: 16,
            },
        };

        return (
            <RenderHtml
                contentWidth={width - 32}
                source={{ html: post.content }}
                tagsStyles={tagsStyles}
            />
        );
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (error || !post) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="alert-circle-outline" size={64} color={Colors.danger} />
                <Text style={styles.errorTitle}>Erreur de chargement</Text>
                <Text style={styles.errorText}>
                    Impossible de charger l'article. Veuillez réessayer.
                </Text>
                <Button
                    title="Réessayer"
                    onPress={() => refetch()}
                    style={styles.retryButton}
                />
                <Button
                    title="Retour aux articles"
                    onPress={() => router.back()}
                    variant="outline"
                    style={styles.backButton}
                />
            </View>
        );
    }

    return (
        <ScrollView
            ref={scrollViewRef}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Featured Image */}
            <View style={styles.imageContainer}>
                {getImageUrl() ? (
                    <Image
                        source={{ uri: getImageUrl() as string }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="image-outline" size={48} color={Colors.textSecondary} />
                    </View>
                )}
            </View>

            {/* Article Header */}
            <View style={styles.header}>
                {post.expand?.category && (
                    <TouchableOpacity
                        style={styles.categoryButton}
                        onPress={handleCategoryPress}
                    >
                        <Text style={styles.categoryText}>{post.expand.category.name}</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.title}>{post.title}</Text>

                <Text style={styles.excerpt}>{post.excerpt}</Text>

                <View style={styles.metaContainer}>
                    <View style={styles.authorContainer}>
                        {getAuthorAvatar() ? (
                            <Image
                                source={{ uri: getAuthorAvatar() as string }}
                                style={styles.authorAvatar}
                            />
                        ) : (
                            <View style={styles.authorInitial}>
                                <Text style={styles.initialText}>{getAuthorInitial()}</Text>
                            </View>
                        )}
                        <View style={styles.authorInfo}>
                            <Text style={styles.authorName}>
                                {post.expand?.author?.name || post.expand?.author?.email || 'Anonyme'}
                            </Text>
                            <Text style={styles.dateText}>{formatDate(post.created)}</Text>
                        </View>
                    </View>

                    <View style={styles.actionsContainer}>
                        <LikeButton
                            postId={post.id}
                            postTitle={post.title}
                            isLiked={post.userHasLiked || false}
                            likesCount={post.likesCount || 0}
                            onToggleLike={handleToggleLike}
                            isLoading={toggleLike.isLoading}
                            size="medium"
                            style={styles.likeButton}
                        />

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleShare}
                            disabled={isSharing}
                        >
                            {isSharing ? (
                                <ActivityIndicator size="small" color={Colors.primary} />
                            ) : (
                                <Ionicons name="share-social-outline" size={22} color={Colors.primary} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Article Content */}
            <View style={styles.content}>
                {renderHtmlContent()}
            </View>

            {/* Tags */}
            {post.tags && (
                <View style={styles.tagsContainer}>
                    <Text style={styles.tagsTitle}>Tags:</Text>
                    <View style={styles.tagsList}>
                        {getTags().map((tag, index) => (
                            <View key={index} style={styles.tagBadge}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Comments Section */}
            <View style={styles.commentsSection}>
                <Comments
                    postId={post.id}
                    postTitle={post.title}
                    comments={post.comments || []}
                />
            </View>
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        minWidth: 150,
        marginBottom: 12,
    },
    backButton: {
        minWidth: 150,
    },
    imageContainer: {
        width: '100%',
        height: 250,
        backgroundColor: Colors.background,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        backgroundColor: Colors.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    categoryButton: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },
    categoryText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
    },
    excerpt: {
        fontSize: 16,
        fontStyle: 'italic',
        color: Colors.textSecondary,
        marginBottom: 16,
        lineHeight: 24,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    authorInitial: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    authorInfo: {
        marginLeft: 12,
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
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeButton: {
        marginRight: 12,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    content: {
        padding: 16,
        backgroundColor: Colors.card,
    },
    tagsContainer: {
        backgroundColor: Colors.card,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    tagsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    tagsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagBadge: {
        backgroundColor: Colors.primaryLight,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    commentsSection: {
        backgroundColor: Colors.card,
        padding: 16,
        marginTop: 16,
    },
});