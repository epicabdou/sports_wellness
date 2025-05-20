import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#6366f1',
                },
                headerTintColor: '#fff',
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen
                name="login"
                options={{
                    title: 'Connexion',
                    presentation: 'card'
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    title: 'Inscription',
                    presentation: 'card'
                }}
            />
            <Stack.Screen
                name="forgot-password"
                options={{
                    title: 'Mot de passe oublié',
                    presentation: 'modal'
                }}
            />
        </Stack>
    );
}