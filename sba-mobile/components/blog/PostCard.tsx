import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ViewStyle
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '@/types';
import Colors from '@/constants/Colors';

// Get the PocketBase URL from your environment or config
const POCKETBASE_URL = 'http://your-pocketbase-url.com';

interface PostCardProps {
    post: Post;
    style?: ViewStyle;
    horizontal?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
                                               post,
                                               style,
                                               horizontal = false
                                           }) => {
    const router = useRouter();
    const windowWidth = Dimensions.get('window').width;

    const handlePress = () => {
        router.push({
            pathname: `/blog/${post.slug}`,
            params: { title: post.title }
        });
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        // Format: "May 15, 2024"
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Get image URL or placeholder
    const getImageUrl = () => {
        if (post.image) {
            return `${POCKETBASE_URL}/api/files/posts/${post.id}/${post.image}`;
        }
        return null;
    };

    // Get first letter of author name or email
    const getAuthorInitial = () => {
        const authorName = post.expand?.author?.name || post.expand?.author?.email || 'A';
        return authorName.charAt(0).toUpperCase();
    };

    // Get author avatar or placeholder
    const getAuthorAvatar = () => {
        if (post.expand?.author?.avatar) {
            return `${POCKETBASE_URL}/api/files/users/${post.expand.author.id}/${post.expand.author.avatar}`;
        }
        return null;
    };

    // Get author name or email
    const getAuthorName = () => {
        return post.expand?.author?.name || post.expand?.author?.email || 'Anonymous';
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                horizontal ? styles.horizontalContainer : {},
                style
            ]}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            {/* Featured Image */}
            <View style={[
                styles.imageContainer,
                horizontal ? styles.horizontalImageContainer : {},
            ]}>
                {getImageUrl() ? (
                    <Image
                        source={{ uri: getImageUrl() as string }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="image-outline" size={32} color={Colors.textSecondary} />
                    </View>
                )}

                {/* Category Badge (if category exists) */}
                {post.expand?.category && (
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                            {post.expand.category.name}
                        </Text>
                    </View>
                )}
            </View>

            {/* Content Container */}
            <View style={[
                styles.contentContainer,
                horizontal ? styles.horizontalContentContainer : {},
            ]}>
                {/* Post Title */}
                <Text style={styles.title} numberOfLines={2}>
                    {post.title}
                </Text>

                {/* Post Excerpt */}
                <Text style={styles.excerpt} numberOfLines={3}>
                    {post.excerpt}
                </Text>

                {/* Tags */}
                {post.tags && (
                    <View style={styles.tagsContainer}>
                        {post.tags.split(',').slice(0, 3).map((tag, index) => (
                            <View key={index} style={styles.tagBadge}>
                                <Text style={styles.tagText}>
                                    {tag.trim()}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Author and Date */}
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
                            <Text style={styles.authorName} numberOfLines={1}>
                                {getAuthorName()}
                            </Text>
                            <Text style={styles.dateText}>
                                {formatDate(post.created)}
                            </Text>
                        </View>
                    </View>

                    {/* Read More Icon */}
                    <View style={styles.readMoreContainer}>
                        <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 16,
    },
    horizontalContainer: {
        flexDirection: 'row',
        height: 140,
    },
    imageContainer: {
        height: 180,
        width: '100%',
        backgroundColor: Colors.background,
    },
    horizontalImageContainer: {
        width: 130,
        height: '100%',
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
    categoryBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    contentContainer: {
        padding: 12,
    },
    horizontalContentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
    },
    excerpt: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    tagBadge: {
        backgroundColor: '#eff6ff', // Light blue
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
    },
    tagText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: '500',
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    authorInitial: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    authorInfo: {
        marginLeft: 8,
    },
    authorName: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.text,
    },
    dateText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    readMoreContainer: {
        backgroundColor: '#f3f4f6',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PostCard;