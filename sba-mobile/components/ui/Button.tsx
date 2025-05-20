import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle
} from 'react-native';
import Colors from '@/constants/Colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
                                           title,
                                           onPress,
                                           variant = 'primary',
                                           size = 'medium',
                                           disabled = false,
                                           loading = false,
                                           style,
                                           textStyle,
                                           fullWidth = false,
                                       }) => {
    // Determine background color based on variant
    const getBackgroundColor = () => {
        if (disabled) return '#d1d5db';

        switch (variant) {
            case 'primary':
                return Colors.primary;
            case 'secondary':
                return Colors.secondary;
            case 'outline':
                return 'transparent';
            case 'danger':
                return Colors.danger;
            default:
                return Colors.primary;
        }
    };

    // Determine text color based on variant
    const getTextColor = () => {
        if (disabled) return '#9ca3af';

        switch (variant) {
            case 'outline':
                return Colors.primary;
            case 'primary':
            case 'secondary':
            case 'danger':
                return '#ffffff';
            default:
                return '#ffffff';
        }
    };

    // Determine padding based on size
    const getPadding = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: 6, paddingHorizontal: 12 };
            case 'large':
                return { paddingVertical: 14, paddingHorizontal: 24 };
            default:
                return { paddingVertical: 10, paddingHorizontal: 16 };
        }
    };

    // Determine border based on variant
    const getBorder = () => {
        if (variant === 'outline') {
            return {
                borderWidth: 1,
                borderColor: disabled ? '#d1d5db' : Colors.primary,
            };
        }
        return {};
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                getPadding(),
                getBorder(),
                { backgroundColor: getBackgroundColor() },
                fullWidth ? styles.fullWidth : {},
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' ? Colors.primary : '#ffffff'}
                />
            ) : (
                <Text
                    style={[
                        styles.text,
                        { color: getTextColor() },
                        size === 'small' ? { fontSize: 14 } : {},
                        size === 'large' ? { fontSize: 18 } : {},
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
    fullWidth: {
        width: '100%',
    },
});

export default Button;