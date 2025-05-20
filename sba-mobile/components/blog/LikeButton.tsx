import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ViewStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

interface LikeButtonProps {
    postId: string;
    postTitle: string;
    isLiked: boolean;
    likesCount: number;
    onToggleLike: () => void;
    isLoading?: boolean;
    style?: ViewStyle;
    size?: 'small' | 'medium' | 'large';
    showCount?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
                                                   isLiked,
                                                   likesCount,
                                                   onToggleLike,
                                                   isLoading = false,
                                                   style,
                                                   size = 'medium',
                                                   showCount = true
                                               }) => {
    const { isLoggedIn } = useAuth();

    // Determine icon size based on size prop
    const getIconSize = () => {
        switch (size) {
            case 'small':
                return 16;
            case 'large':
                return 28;
            default:
                return 22;
        }
    };

    // Get container size based on size prop
    const getContainerSize = () => {
        switch (size) {
            case 'small':
                return {
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                };
            case 'large':
                return {
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                };
            default:
                return {
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                };
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                getContainerSize(),
                isLiked ? styles.likedContainer : styles.unlikedContainer,
                style
            ]}
            onPress={onToggleLike}
            disabled={isLoading || !isLoggedIn}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <ActivityIndicator
                    size="small"
                    color={isLiked ? "#fff" : Colors.primary}
                />
            ) : (
                <>
                    <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={getIconSize()}
                        color={isLiked ? '#fff' : Colors.primary}
                    />
                    {showCount && likesCount > 0 && (
                        <Ionicons
                            name="add"
                            size={size === 'small' ? 8 : 10}
                            color={isLiked ? '#fff' : Colors.primary}
                            style={styles.countIndicator}
                        />
                    )}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    unlikedContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Colors.primaryLight,
    },
    likedContainer: {
        backgroundColor: Colors.danger,
        borderWidth: 0,
    },
    countIndicator: {
        position: 'absolute',
        bottom: 4,
        right: 4,
    },
});

export default LikeButton;