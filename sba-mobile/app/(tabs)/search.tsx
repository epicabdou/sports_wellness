import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import { useSearchPosts } from '@/hooks/usePosts';
import { Ionicons } from '@expo/vector-icons';
import PostCard from '@/components/blog/PostCard';
import {Colors} from '@/constants/Colors';

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchText, setSearchText] = useState('');

    // Get search results
    const {
        data: searchResults,
        isLoading,
        error
    } = useSearchPosts(searchQuery);

    // Submit search
    const handleSearch = () => {
        setSearchQuery(searchText.trim());
        Keyboard.dismiss();
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchText('');
        setSearchQuery('');
    };

    return (
        <View style={styles.container}>
            {/* Search Header */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher des articles..."
                        value={searchText}
                        onChangeText={setSearchText}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <Text style={styles.searchButtonText}>Rechercher</Text>
                </TouchableOpacity>
            </View>

            {/* Search Results */}
            <View style={styles.resultsContainer}>
                {searchQuery ? (
                    <>
                        {isLoading ? (
                            <ActivityIndicator color={Colors.primary} style={styles.loader} />
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
                                <Text style={styles.errorText}>Une erreur est survenue</Text>
                                <TouchableOpacity
                                    style={styles.retryButton}
                                    onPress={handleSearch}
                                >
                                    <Text style={styles.retryButtonText}>Réessayer</Text>
                                </TouchableOpacity>
                            </View>
                        ) : searchResults?.items?.length ? (
                            <>
                                <Text style={styles.resultsTitle}>
                                    {searchResults.items.length} résultat{searchResults.items.length > 1 ? 's' : ''} pour "{searchQuery}"
                                </Text>
                                <FlatList
                                    data={searchResults.items}
                                    renderItem={({ item }) => <PostCard post={item} />}
                                    keyExtractor={(item) => item.id}
                                    contentContainerStyle={styles.resultsList}
                                    showsVerticalScrollIndicator={false}
                                />
                            </>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="search-outline" size={48} color={Colors.textSecondary} />
                                <Text style={styles.emptyTitle}>Aucun résultat trouvé</Text>
                                <Text style={styles.emptyText}>
                                    Nous n'avons pas trouvé d'article correspondant à votre recherche.
                                </Text>
                                <Text style={styles.emptySuggestion}>
                                    Essayez avec d'autres mots-clés ou explorez nos catégories.
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <View style={styles.initialContainer}>
                        <Ionicons name="search" size={64} color={Colors.primaryLight} />
                        <Text style={styles.initialTitle}>Recherchez des articles</Text>
                        <Text style={styles.initialText}>
                            Utilisez la barre de recherche pour trouver des articles par titre, contenu ou mots-clés.
                        </Text>
                        <View style={styles.searchSuggestions}>
                            <Text style={styles.suggestionsTitle}>Suggestions :</Text>
                            <View style={styles.tagContainer}>
                                {['sport', 'nutrition', 'bien-être', 'santé', 'fitness', 'méditation'].map((tag, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.tagButton}
                                        onPress={() => {
                                            setSearchText(tag);
                                            setSearchQuery(tag);
                                        }}
                                    >
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: Colors.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: Colors.text,
    },
    clearButton: {
        padding: 4,
    },
    searchButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    resultsContainer: {
        flex: 1,
        padding: 16,
    },
    resultsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
    },
    resultsList: {
        paddingBottom: 16,
    },
    loader: {
        marginTop: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginTop: 12,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 4,
    },
    emptySuggestion: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: Colors.danger,
        textAlign: 'center',
        marginVertical: 12,
    },
    retryButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    initialContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    initialTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    initialText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    searchSuggestions: {
        width: '100%',
    },
    suggestionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagButton: {
        backgroundColor: Colors.primaryLight,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        margin: 4,
    },
    tagText: {
        color: '#fff',
        fontWeight: '500',
    },
});