// stores/user.js
// Manages user profile and activities
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', {
    state: () => ({
        userActivities: [],
        userPosts: [],
        userComments: [],
        userLikes: [],
        isLoading: false,
        error: null
    }),

    actions: {
        async fetchUserActivities() {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isLoggedIn) {
                    throw new Error('Vous devez être connecté pour accéder à vos activités.')
                }

                const response = await authStore.pb.collection('userActivity').getFullList({
                    filter: `user="${authStore.user.id}"`,
                    sort: '-created'
                })

                this.userActivities = response
                return response
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async fetchUserComments() {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isLoggedIn) {
                    throw new Error('Vous devez être connecté pour accéder à vos commentaires.')
                }

                const response = await authStore.pb.collection('comments').getFullList({
                    filter: `user="${authStore.user.id}"`,
                    expand: 'post',
                    sort: '-created'
                })

                this.userComments = response
                return response
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async fetchUserLikes() {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isLoggedIn) {
                    throw new Error('Vous devez être connecté pour accéder à vos likes.')
                }

                const response = await authStore.pb.collection('likes').getFullList({
                    filter: `user="${authStore.user.id}"`,
                    expand: 'post',
                    sort: '-created'
                })

                this.userLikes = response
                return response
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async updateUserProfile(userData) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isLoggedIn) {
                    throw new Error('Vous devez être connecté pour mettre à jour votre profil.')
                }

                const formData = new FormData()

                // Add all user data to FormData
                for (const [key, value] of Object.entries(userData)) {
                    if (key === 'avatar' && value instanceof File) {
                        formData.append('avatar', value)
                    } else if (value !== null && value !== undefined) {
                        formData.append(key, value)
                    }
                }

                const updatedUser = await authStore.pb.collection('users').update(authStore.user.id, formData)

                // Update auth store user data
                authStore.user = updatedUser

                // Record activity
                await authStore.recordActivity('profile_update', {
                    message: 'Profil mis à jour'
                })

                return updatedUser
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async changePassword(oldPassword, newPassword, passwordConfirm) {
            this.isLoading = true
            this.error = null

            try {
                const authStore = useAuthStore()

                if (!authStore.isLoggedIn) {
                    throw new Error('Vous devez être connecté pour changer votre mot de passe.')
                }

                if (newPassword !== passwordConfirm) {
                    throw new Error('Les mots de passe ne correspondent pas.')
                }

                // First verify the old password
                await authStore.pb.collection('users').authWithPassword(
                    authStore.user.email,
                    oldPassword
                )

                const updatedUser = await authStore.pb.collection('users').update(authStore.user.id, {
                    password: newPassword,
                    passwordConfirm: passwordConfirm
                })

                // Record activity
                await authStore.recordActivity('password_change', {
                    message: 'Mot de passe changé'
                })

                return updatedUser
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        }
    }
})