// composables/usePocketBase.ts
import PocketBase from 'pocketbase';

export const usePocketBase = () => {
    const runtimeConfig = useRuntimeConfig();
    const pb = new PocketBase(runtimeConfig.public.pocketbaseUrl);

    // Add auth store to maintain authentication state across pages
    const authStore = useState('auth', () => {
        return {
            isAuthenticated: pb.authStore.isValid,
            user: pb.authStore.model,
            token: pb.authStore.token
        };
    });

    // Update auth store when auth changes
    pb.authStore.onChange(() => {
        authStore.value = {
            isAuthenticated: pb.authStore.isValid,
            user: pb.authStore.model,
            token: pb.authStore.token
        };
    });

    // Auth methods
    const login = async (email: string, password: string) => {
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);
            return authData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        pb.authStore.clear();
    };

    const register = async (userData: { email: string; password: string; passwordConfirm: string; name: string; }) => {
        try {
            const record = await pb.collection('users').create(userData);
            // Automatically log in after registration
            if (record) {
                await login(userData.email, userData.password);
            }
            return record;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    // CRUD operations for posts
    const getPosts = async (filter = '', sort = '-published_date', expand = 'category,author') => {
        try {
            const posts = await pb.collection('posts').getList(1, 50, {
                filter,
                sort,
                expand
            });
            return posts;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    };

    const getPost = async (slug: string) => {
        try {
            const post = await pb.collection('posts').getFirstListItem(`slug="${slug}"`, {
                expand: 'category,author'
            });
            return post;
        } catch (error) {
            console.error(`Error fetching post with slug ${slug}:`, error);
            throw error;
        }
    };

    const getCategories = async () => {
        try {
            const categories = await pb.collection('categories').getFullList({
                sort: 'name'
            });
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    };

    const createPost = async (postData: any) => {
        try {
            const record = await pb.collection('posts').create(postData);
            return record;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    };

    const updatePost = async (id: string, postData: any) => {
        try {
            const record = await pb.collection('posts').update(id, postData);
            return record;
        } catch (error) {
            console.error(`Error updating post ${id}:`, error);
            throw error;
        }
    };

    const deletePost = async (id: string) => {
        try {
            await pb.collection('posts').delete(id);
            return true;
        } catch (error) {
            console.error(`Error deleting post ${id}:`, error);
            throw error;
        }
    };

    const getPostsByCategory = async (categorySlug: string) => {
        try {
            // First, get the category ID from the slug
            const category = await pb.collection('categories').getFirstListItem(`slug="${categorySlug}"`);

            // Then, get all posts in that category
            const posts = await pb.collection('posts').getList(1, 50, {
                filter: `category="${category.id}" && published=true`,
                sort: '-published_date',
                expand: 'category,author'
            });

            return posts;
        } catch (error) {
            console.error(`Error fetching posts for category ${categorySlug}:`, error);
            throw error;
        }
    };

    return {
        pb,
        authStore,
        login,
        logout,
        register,
        getPosts,
        getPost,
        getCategories,
        createPost,
        updatePost,
        deletePost,
        getPostsByCategory
    };
};