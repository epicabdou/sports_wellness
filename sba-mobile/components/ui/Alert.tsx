import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    title?: string;
    message: string;
    type?: AlertType;
    onDismiss?: () => void;
    dismissible?: boolean;
    style?: ViewStyle;
}

const Alert: React.FC<AlertProps> = ({
                                         title,
                                         message,
                                         type = 'info',
                                         onDismiss,
                                         dismissible = false,
                                         style
                                     }) => {
    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return '#ecfdf5';
            case 'error':
                return '#fef2f2';
            case 'warning':
                return '#fffbeb';
            case 'info':
            default:
                return '#eff6ff';
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return Colors.success;
            case 'error':
                return Colors.danger;
            case 'warning':
                return Colors.warning;
            case 'info':
            default:
                return Colors.info;
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'success':
                return '#064e3b';
            case 'error':
                return '#7f1d1d';
            case 'warning':
                return '#78350f';
            case 'info':
            default:
                return '#1e3a8a';
        }
    };

    const getIconName = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'alert-circle';
            case 'warning':
                return 'warning';
            case 'info':
            default:
                return 'information-circle';
        }
    };

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor()
                },
                style
            ]}
        >
            <View style={styles.content}>
                <Ionicons
                    name={getIconName()}
                    size={24}
                    color={getBorderColor()}
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    {title && (
                        <Text style={[styles.title, { color: getTextColor() }]}>
                            {title}
                        </Text>
                    )}
                    <Text style={[styles.message, { color: getTextColor() }]}>
                        {message}
                    </Text>
                </View>
            </View>

            {dismissible && onDismiss && (
                <TouchableOpacity
                    onPress={onDismiss}
                    style={styles.closeButton}
                >
                    <Ionicons
                        name="close"
                        size={20}
                        color={getTextColor()}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    icon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
    },
    closeButton: {
        padding: 4,
    },
});

export default Alert;