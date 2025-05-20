import { useQuery } from 'react-query';
import pb from '@/lib/pocketbase';
import { Category } from '@/types';

// Hook to get all categories
export const useCategories = () => {
    return useQuery(['categories'], async () => {
        try {
            const records = await pb.collection('categories').getFullList({
                sort: 'name',
            });
            return records as Category[];
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    });
};

// Hook to get a single category by slug
export const useCategory = (slug: string) => {
    return useQuery(['category', slug], async () => {
        try {
            const category = await pb.collection('categories').getFirstListItem(`slug="${slug}"`);
            return category as Category;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    });
};

// Hook to get posts by category slug
export const usePostsByCategory = (categorySlug: string, page = 1, perPage = 10) => {
    return useQuery(['postsByCategory', categorySlug, page], async () => {
        try {
            // First get the category by slug
            const category = await pb.collection('categories').getFirstListItem(`slug="${categorySlug}"`);

            // Then get the posts for this category
            const filter = `isPublished=true && category="${category.id}"`;
            const resultList = await pb.collection('posts').getList(page, perPage, {
                filter,
                sort: '-created',
                expand: 'category,author',
            });

            return {
                category,
                posts: resultList.items,
                totalItems: resultList.totalItems,
                totalPages: resultList.totalPages,
            };
        } catch (error) {
            console.error('Error fetching posts by category:', error);
            throw error;
        }
    });
};