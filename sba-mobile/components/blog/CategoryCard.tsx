import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ViewStyle
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '@/types';
import Colors from '@/constants/Colors';

// Get the PocketBase URL from your environment or config
const POCKETBASE_URL = 'http://your-pocketbase-url.com';

interface CategoryCardProps {
    category: Category;
    style?: ViewStyle;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, style }) => {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: `/blog/category/${category.slug}`,
            params: { title: category.name }
        });
    };

    // Get image URL or placeholder
    const getImageUrl = () => {
        if (category.image) {
            return `${POCKETBASE_URL}/api/files/categories/${category.id}/${category.image}`;
        }
        return null;
    };

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            {/* Category Image */}
            <View style={styles.imageContainer}>
                {getImageUrl() ? (
                    <Image
                        source={{ uri: getImageUrl() as string }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="folder" size={32} color={Colors.primaryLight} />
                    </View>
                )}

                {/* Gradient Overlay */}
                <View style={styles.overlay}>
                    {/* Category Name */}
                    <Text style={styles.name}>{category.name}</Text>

                    {/* Category Description (if exists) */}
                    {category.description && (
                        <Text style={styles.description} numberOfLines={2}>
                            {category.description}
                        </Text>
                    )}
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
    imageContainer: {
        height: 160,
        width: '100%',
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
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 20,
    },
});

export default CategoryCard;