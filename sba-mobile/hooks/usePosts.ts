import { useQuery, useMutation, useQueryClient } from 'react-query';
import pb from '@/lib/pocketbase';
import { Post } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Hook to get multiple posts with optional pagination and filtering
export const usePosts = (page = 1, perPage = 10, categoryId?: string) => {
    const queryKey = categoryId
        ? ['posts', page, perPage, categoryId]
        : ['posts', page, perPage];

    return useQuery(queryKey, async () => {
        try {
            let filter = 'isPublished=true';

            if (categoryId) {
                filter += ` && category="${categoryId}"`;
            }

            const resultList = await pb.collection('posts').getList(page, perPage, {
                sort: '-created',
                filter,
                expand: 'category,author',
            });

            return {
                items: resultList.items as Post[],
                totalItems: resultList.totalItems,
                totalPages: resultList.totalPages,
            };
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    });
};

// Hook to get a single post by slug
export const usePost = (slug: string) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useQuery(['post', slug], async () => {
        try {
            const post = await pb.collection('posts').getFirstListItem(`slug="${slug}" && isPublished=true`, {
                expand: 'category,author',
            });

            // Get comments for this post
            const comments = await pb.collection('comments').getFullList({
                filter: `post="${post.id}"`,
                expand: 'user',
                sort: 'created',
            });

            // Get likes count for this post
            const likesCount = await pb.collection('likes').getFullList({
                filter: `post="${post.id}"`,
            });

            // Check if current user has liked this post
            let userHasLiked = false;
            if (user) {
                try {
                    const userLike = await pb.collection('likes').getFirstListItem(
                        `post="${post.id}" && user="${user.id}"`
                    );
                    userHasLiked = !!userLike;
                } catch (error) {
                    // User hasn't liked the post
                    userHasLiked = false;
                }
            }

            // Record view activity if user is logged in
            if (user) {
                try {
                    await pb.collection('userActivity').create({
                        user: user.id,
                        activity: {
                            type: 'post_view',
                            data: {
                                postId: post.id,
                                postTitle: post.title,
                            },
                            timestamp: new Date().toISOString(),
                        },
                    });
                } catch (error) {
                    console.error('Error recording post view activity:', error);
                }
            }

            return {
                ...post,
                comments,
                likesCount: likesCount.length,
                userHasLiked,
            } as Post;
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    });
};

// Hook to toggle like on a post
export const useToggleLike = (postId: string, postTitle: string) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(
        async () => {
            if (!user) {
                throw new Error('You must be logged in to like a post');
            }

            // Check if user already liked the post
            let existingLike;
            try {
                existingLike = await pb.collection('likes').getFirstListItem(
                    `post="${postId}" && user="${user.id}"`
                );
            } catch (error) {
                // User hasn't liked the post yet
            }

            if (existingLike) {
                // User already liked the post, so remove the like
                await pb.collection('likes').delete(existingLike.id);

                // Record unlike activity
                await pb.collection('userActivity').create({
                    user: user.id,
                    activity: {
                        type: 'post_unlike',
                        data: {
                            postId,
                            postTitle,
                        },
                        timestamp: new Date().toISOString(),
                    },
                });

                return { liked: false };
            } else {
                // User hasn't liked the post, so add a like
                await pb.collection('likes').create({
                    post: postId,
                    user: user.id,
                });

                // Record like activity
                await pb.collection('userActivity').create({
                    user: user.id,
                    activity: {
                        type: 'post_like',
                        data: {
                            postId,
                            postTitle,
                        },
                        timestamp: new Date().toISOString(),
                    },
                });

                return { liked: true };
            }
        },
        {
            onSuccess: () => {
                // Invalidate queries that depend on this post's data
                queryClient.invalidateQueries(['post']);
            },
        }
    );
};

// Hook to search posts
export const useSearchPosts = (query: string) => {
    return useQuery(['search', query], async () => {
        if (!query || query.trim() === '') {
            return { items: [] };
        }

        try {
            const searchQuery = query.trim();
            const filter = `isPublished=true && (title~"${searchQuery}" || content~"${searchQuery}" || excerpt~"${searchQuery}" || tags~"${searchQuery}")`;

            const resultList = await pb.collection('posts').getList(1, 20, {
                filter,
                sort: '-created',
                expand: 'category,author',
            });

            return {
                items: resultList.items as Post[],
                totalItems: resultList.totalItems,
            };
        } catch (error) {
            console.error('Error searching posts:', error);
            throw error;
        }
    }, {
        // Only run this query if there's a search query
        enabled: !!query && query.trim() !== '',
        // Keep the previous results until the new ones arrive
        keepPreviousData: true,
    });
};