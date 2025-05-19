// stores/admin.js
// Manages admin functionality for posts, categories, and user management
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useAdminStore = defineStore('admin', {
    state: () => ({
        users: [],
        activities: [],
        isLoading: false,
        error: null
    }),

    actions: {
        async fetchUsers() {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin) {
                    throw new Error('Permission refusée. Vous devez être administrateur.')
                }

                const response = await authStore.pb.collection('users').getFullList({
                    sort: '-created'
                })

                this.users = response
                return response
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async updateUserStatus(userId, isSuspended) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin) {
                    throw new Error('Permission refusée. Vous devez être administrateur.')
                }

                const updatedUser = await authStore.pb.collection('users').update(userId, {
                    isSuspended
                })

                // Update users list
                this.users = this.users.map(user =>
                    user.id === userId ? updatedUser : user
                )

                return updatedUser
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async toggleAdminRole(userId, isAdmin) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin) {
                    throw new Error('Permission refusée. Vous devez être administrateur.')
                }

                const updatedUser = await authStore.pb.collection('users').update(userId, {
                    isAdmin
                })

                // Update users list
                this.users = this.users.map(user =>
                    user.id === userId ? updatedUser : user
                )

                return updatedUser
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async fetchUserActivities(userId = null) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin && !authStore.isLoggedIn) {
                    throw new Error('Vous devez être connecté.')
                }

                // If userId is not provided and user is not admin, use current user id
                if (!userId && !authStore.isAdmin) {
                    userId = authStore.user.id
                }

                let filter = ''

                if (userId) {
                    filter = `user="${userId}"`
                }

                // Only admins can see all activities
                if (!authStore.isAdmin && userId !== authStore.user.id) {
                    throw new Error('Permission refusée.')
                }

                const response = await authStore.pb.collection('userActivity').getFullList({
                    filter,
                    sort: '-created',
                    expand: 'user'
                })

                this.activities = response
                return response
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        // === Post Management ===

        async createPost(postData) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin) {
                    throw new Error('Permission refusée. Vous devez être administrateur.')
                }

                // Add author id
                postData.author = authStore.user.id

                const newPost = await authStore.pb.collection('posts').create(postData)

                return newPost
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async updatePost(postId, postData) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin) {
                    throw new Error('Permission refusée. Vous devez être administrateur.')
                }

                const updatedPost = await authStore.pb.collection('posts').update(postId, postData)

                return updatedPost
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async deletePost(postId) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin) {
                    throw new Error('Permission refusée. Vous devez être administrateur.')
                }

                await authStore.pb.collection('posts').delete(postId)

                return true
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async fetchAdminPosts() {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin) {
                    throw new Error('Permission refusée. Vous devez être administrateur.')
                }

                const response = await authStore.pb.collection('posts').getFullList({
                    sort: '-created',
                    expand: 'category,author'
                })

                return response
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        // === Category Management ===

        async createCategory(categoryData) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin) {
                    throw new Error('Permission refusée. Vous devez être administrateur.')
                }

                const newCategory = await authStore.pb.collection('categories').create(categoryData)

                return newCategory
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async updateCategory(categoryId, categoryData) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin) {
                    throw new Error('Permission refusée. Vous devez être administrateur.')
                }

                const updatedCategory = await authStore.pb.collection('categories').update(categoryId, categoryData)

                return updatedCategory
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async deleteCategory(categoryId) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin) {
                    throw new Error('Permission refusée. Vous devez être administrateur.')
                }

                // Check if there are posts using this category
                const posts = await authStore.pb.collection('posts').getList(1, 1, {
                    filter: `category="${categoryId}"`
                })

                if (posts.items.length > 0) {
                    throw new Error('Impossible de supprimer cette catégorie car elle est utilisée par des articles.')
                }

                await authStore.pb.collection('categories').delete(categoryId)

                return true
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async fetchAdminCategories() {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isAdmin) {
                    throw new Error('Permission refusée. Vous devez être administrateur.')
                }

                const response = await authStore.pb.collection('categories').getFullList({
                    sort: 'name'
                })

                return response
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        }
    }
})