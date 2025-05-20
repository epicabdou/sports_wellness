
import PocketBase from 'pocketbase';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// URL of your PocketBase backend
const POCKETBASE_URL = 'http://127.0.0.1:8090';

// For web/non-secure environments, use localStorage as fallback
const saveToStorage = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
    }
    await SecureStore.setItemAsync(key, value);
};

const getFromStorage = async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
};

const deleteFromStorage = async (key: string) => {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
    }
    await SecureStore.deleteItemAsync(key);
};

// Initialize PocketBase with a custom auth store that uses secure storage
class SecureAuthStore {
    private token: string | null = null;
    private model: any = null;

    constructor() {
        // Load token on initialization (async but we'll have to handle this later)
        this.loadFromStorage();
    }

    private async loadFromStorage() {
        try {
            const savedToken = await getFromStorage('pb_auth');
            if (savedToken) {
                const parsed = JSON.parse(savedToken);
                this.token = parsed.token;
                this.model = parsed.model;
            }
        } catch (error) {
            console.error('Failed to load auth from storage:', error);
        }
    }

    get isValid(): boolean {
        return !!this.token;
    }

    get authModel(): any {
        return this.model;
    }

    save(token: string, model: any) {
        this.token = token;
        this.model = model;

        // Save to storage
        const data = JSON.stringify({ token, model });
        saveToStorage('pb_auth', data);
    }

    clear() {
        this.token = null;
        this.model = null;
        deleteFromStorage('pb_auth');
    }

    // For PocketBase's internal usage
    loadFromCookie() {
        // Mobile doesn't use cookies, so this is intentionally empty
        return;
    }

    exportToCookie() {
        // Mobile doesn't use cookies, so this is intentionally empty
        return;
    }
}

// Create and export the PocketBase instance
export const pb = new PocketBase(POCKETBASE_URL);

// Initialize with the custom auth store
pb.authStore = new SecureAuthStore();

export default pb;