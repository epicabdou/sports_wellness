// stores/blog.js
// Manages blog posts, categories, comments, and likes
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useBlogStore = defineStore('blog', {
    state: () => ({
        posts: [],
        categories: [],
        currentPost: null,
        currentCategory: null,
        isLoading: false,
        error: null,
        totalPosts: 0,
        currentPage: 1,
        pageSize: 10
    }),

    getters: {
        getPostBySlug: (state) => (slug) => {
            return state.posts.find(post => post.slug === slug)
        },

        getCategoryBySlug: (state) => (slug) => {
            return state.categories.find(category => category.slug === slug)
        },

        getPostsByCategory: (state) => (categoryId) => {
            return state.posts.filter(post => post.category === categoryId)
        },

        totalPages: (state) => {
            return Math.ceil(state.totalPosts / state.pageSize)
        }
    },

    actions: {
        async fetchPosts(page = 1, categorySlug = null) {
            this.isLoading = true
            this.error = null
            this.currentPage = page

            try {
                const authStore = useAuthStore()

                let filter = 'isPublished=true'

                // If category slug is provided, fetch category first
                if (categorySlug) {
                    const category = await authStore.pb.collection('categories').getFirstListItem(`slug="${categorySlug}"`)
                    this.currentCategory = category
                    filter += ` && category="${category.id}"`
                } else {
                    this.currentCategory = null
                }

                const options = {
                    sort: '-created',
                    filter,
                    expand: 'category,author',
                    page,
                    perPage: this.pageSize
                }

                const response = await authStore.pb.collection('posts').getList(page, this.pageSize, options)

                this.posts = response.items
                this.totalPosts = response.totalItems

                return response
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async fetchAllCategories() {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                const response = await authStore.pb.collection('categories').getFullList({
                    sort: 'name'
                })

                this.categories = response
                return response
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async fetchPostBySlug(slug) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                const post = await authStore.pb.collection('posts').getFirstListItem(`slug="${slug}" && isPublished=true`, {
                    expand: 'category,author'
                })

                // Get comments for this post
                const comments = await authStore.pb.collection('comments').getFullList({
                    filter: `post="${post.id}"`,
                    expand: 'user',
                    sort: 'created'
                })

                // Get likes count for this post
                const likesCount = await authStore.pb.collection('likes').getFullList({
                    filter: `post="${post.id}"`,
                    $cancelKey: 'likes'
                })

                // Check if current user has liked this post
                let userHasLiked = false
                if (authStore.user) {
                    const userLike = await authStore.pb.collection('likes').getFirstListItem(`post="${post.id}" && user="${authStore.user.id}"`, {
                        $cancelKey: 'userLike'
                    }).catch(() => null)

                    userHasLiked = !!userLike
                }

                this.currentPost = {
                    ...post,
                    comments,
                    likesCount: likesCount.length,
                    userHasLiked
                }

                // Record view activity if user is logged in
                if (authStore.user) {
                    await authStore.recordActivity('post_view', {
                        postId: post.id,
                        postTitle: post.title
                    })
                }

                return this.currentPost
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async createComment(content) {
            this.isLoading = true
            this.error = null

            try {
                if (!this.currentPost) {
                    throw new Error('Aucun article sélectionné')
                }

                const authStore = useAuthStore()

                if (!authStore.isLoggedIn) {
                    throw new Error('Vous devez être connecté pour poster un commentaire')
                }

                const newComment = await authStore.pb.collection('comments').create({
                    content,
                    post: this.currentPost.id,
                    user: authStore.user.id
                })

                // Refetch the post to get updated comments
                await this.fetchPostBySlug(this.currentPost.slug)

                // Record comment activity
                await authStore.recordActivity('post_comment', {
                    postId: this.currentPost.id,
                    postTitle: this.currentPost.title,
                    commentId: newComment.id
                })

                return newComment
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async toggleLike() {
            this.isLoading = true
            this.error = null

            try {
                if (!this.currentPost) {
                    throw new Error('Aucun article sélectionné')
                }

                const authStore = useAuthStore()

                if (!authStore.isLoggedIn) {
                    throw new Error('Vous devez être connecté pour aimer un article')
                }

                if (this.currentPost.userHasLiked) {
                    // User already liked the post, so remove the like
                    const like = await authStore.pb.collection('likes').getFirstListItem(`post="${this.currentPost.id}" && user="${authStore.user.id}"`)
                    await authStore.pb.collection('likes').delete(like.id)

                    // Record unlike activity
                    await authStore.recordActivity('post_unlike', {
                        postId: this.currentPost.id,
                        postTitle: this.currentPost.title
                    })
                } else {
                    // User hasn't liked the post, so add a like
                    await authStore.pb.collection('likes').create({
                        post: this.currentPost.id,
                        user: authStore.user.id
                    })

                    // Record like activity
                    await authStore.recordActivity('post_like', {
                        postId: this.currentPost.id,
                        postTitle: this.currentPost.title
                    })
                }

                // Refetch the post to get updated likes
                await this.fetchPostBySlug(this.currentPost.slug)

                return this.currentPost
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async searchPosts(query) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                const filter = `isPublished=true && (title ~ "${query}" || content ~ "${query}" || excerpt ~ "${query}" || tags ~ "${query}")`

                const response = await authStore.pb.collection('posts').getList(1, 20, {
                    filter,
                    sort: '-created',
                    expand: 'category,author'
                })

                return response.items
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        }
    }
})