import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    KeyboardTypeOptions,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface InputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    style?: ViewStyle;
    inputStyle?: TextStyle;
    labelStyle?: TextStyle;
    required?: boolean;
    helpText?: string;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
                                         value,
                                         onChangeText,
                                         placeholder,
                                         label,
                                         error,
                                         secureTextEntry = false,
                                         keyboardType = 'default',
                                         autoCapitalize = 'none',
                                         autoCorrect = false,
                                         multiline = false,
                                         numberOfLines = 1,
                                         style,
                                         inputStyle,
                                         labelStyle,
                                         required = false,
                                         helpText,
                                         disabled = false,
                                     }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={[styles.container, style]}>
            {label && (
                <View style={styles.labelContainer}>
                    <Text style={[styles.label, labelStyle]}>
                        {label}
                        {required && <Text style={styles.required}> *</Text>}
                    </Text>
                </View>
            )}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.focused,
                    error ? styles.errorInput : {},
                    disabled ? styles.disabledInput : {}
                ]}
            >
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    multiline={multiline}
                    numberOfLines={multiline ? numberOfLines : 1}
                    style={[
                        styles.input,
                        multiline && { textAlignVertical: 'top', minHeight: 24 * numberOfLines },
                        inputStyle
                    ]}
                    editable={!disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={24}
                            color={Colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : helpText ? (
                <Text style={styles.helpText}>{helpText}</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    labelContainer: {
        marginBottom: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    required: {
        color: Colors.danger,
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        backgroundColor: Colors.card,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        color: Colors.text,
    },
    iconContainer: {
        padding: 10,
    },
    focused: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    errorInput: {
        borderColor: Colors.danger,
    },
    disabledInput: {
        backgroundColor: '#f3f4f6',
        opacity: 0.7,
    },
    errorText: {
        color: Colors.danger,
        fontSize: 12,
        marginTop: 4,
    },
    helpText: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 4,
    },
});

export default Input;