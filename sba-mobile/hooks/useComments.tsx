import { useQuery, useMutation, useQueryClient } from 'react-query';
import pb from '@/lib/pocketbase';
import { Comment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Hook to get comments for a specific post
export const useComments = (postId: string) => {
    return useQuery(['comments', postId], async () => {
        try {
            const comments = await pb.collection('comments').getFullList({
                filter: `post="${postId}"`,
                expand: 'user',
                sort: 'created',
            });
            return comments as Comment[];
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    });
};

// Hook to add a comment to a post
export const useAddComment = (postId: string, postTitle: string) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(
        async (content: string) => {
            if (!user) {
                throw new Error('You must be logged in to comment');
            }

            const newComment = await pb.collection('comments').create({
                content,
                post: postId,
                user: user.id,
            });

            // Record comment activity
            await pb.collection('userActivity').create({
                user: user.id,
                activity: {
                    type: 'post_comment',
                    data: {
                        postId,
                        postTitle,
                        commentId: newComment.id,
                    },
                    timestamp: new Date().toISOString(),
                },
            });

            return newComment;
        },
        {
            onSuccess: () => {
                // Invalidate queries that depend on these comments
                queryClient.invalidateQueries(['comments', postId]);
                queryClient.invalidateQueries(['post']);
            },
        }
    );
};

// Hook to delete a comment
export const useDeleteComment = (postId: string) => {
    const queryClient = useQueryClient();

    return useMutation(
        async (commentId: string) => {
            await pb.collection('comments').delete(commentId);
            return commentId;
        },
        {
            onSuccess: () => {
                // Invalidate queries that depend on these comments
                queryClient.invalidateQueries(['comments', postId]);
                queryClient.invalidateQueries(['post']);
            },
        }
    );
};