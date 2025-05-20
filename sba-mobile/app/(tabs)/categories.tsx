import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { useCategories } from '@/hooks/useCategories';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CategoryCard from '@/components/blog/CategoryCard';
import Colors from '@/constants/Colors';

export default function CategoriesScreen() {
    const [refreshing, setRefreshing] = useState(false);

    // Fetch all categories
    const {
        data: categories,
        isLoading,
        refetch
    } = useCategories();

    // Handle refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Handle category press
    const handleCategoryPress = (slug: string, name: string) => {
        router.push({
            pathname: `/blog/category/${slug}`,
            params: { title: name }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Catégories</Text>
                <Text style={styles.headerSubtitle}>
                    Explorez les différentes catégories d'articles
                </Text>
            </View>

            {isLoading ? (
                <ActivityIndicator color={Colors.primary} style={styles.loader} />
            ) : categories && categories.length > 0 ? (
                <FlatList
                    data={categories}
                    renderItem={({ item }) => (
                        <CategoryCard
                            category={item}
                            style={styles.card}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Colors.primary]}
                            tintColor={Colors.primary}
                        />
                    }
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="folder-open-outline" size={48} color={Colors.textSecondary} />
                    <Text style={styles.emptyText}>Aucune catégorie disponible</Text>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={onRefresh}
                    >
                        <Text style={styles.refreshButtonText}>Rafraîchir</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: 16,
        backgroundColor: Colors.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 8,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        margin: 8,
        maxWidth: '47%', // Adjust for optimal spacing
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginVertical: 16,
    },
    refreshButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    refreshButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});