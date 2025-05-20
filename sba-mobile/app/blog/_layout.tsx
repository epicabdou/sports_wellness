
import { Stack, useLocalSearchParams } from 'expo-router';

export default function BlogLayout() {
    const params = useLocalSearchParams();

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
                name="[slug]"
                options={{
                    title: 'Article',
                    // Use dynamic title based on post title if available
                    headerTitle: params.title as string || 'Article'
                }}
            />
            <Stack.Screen
                name="category/[slug]"
                options={{
                    title: 'Catégorie',
                    // Use dynamic title based on category name if available
                    headerTitle: params.title as string || 'Catégorie'
                }}
            />
        </Stack>
    );
}