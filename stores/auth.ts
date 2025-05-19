// stores/auth.ts (avec méthode loginWithGoogle corrigée)
import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'
import { useRuntimeConfig, useNuxtApp } from 'nuxt/app'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        pb: null,
        isLoading: false,
        error: null
    }),

    getters: {
        isLoggedIn: (state) => !!state.user,
        isAdmin: (state) => state.user?.isAdmin || false,
        userAvatar: (state) => {
            if (!state.user || !state.user.avatar) return null

            try {
                const runtimeConfig = useRuntimeConfig()
                return `${runtimeConfig.public.pocketbaseUrl}/api/files/users/${state.user.id}/${state.user.avatar}`
            } catch (error) {
                console.error('Error getting user avatar:', error)
                return null
            }
        }
    },

    actions: {
        initPocketBase() {
            // Si pb est déjà initialisé, on retourne
            if (this.pb) return

            try {
                const runtimeConfig = useRuntimeConfig()
                this.pb = new PocketBase(runtimeConfig.public.pocketbaseUrl)

                // Chargez les données d'authentification depuis le localStorage
                if (this.pb.authStore.isValid) {
                    this.user = this.pb.authStore.model
                }

                // Écoutez les changements dans authStore
                this.pb.authStore.onChange(() => {
                    this.user = this.pb.authStore.model
                })
            } catch (error) {
                console.error('Error initializing PocketBase in store:', error)
            }
        },

        // Méthode utilitaire pour obtenir l'instance PocketBase
        getPocketBaseInstance() {
            if (this.pb) return this.pb

            try {
                const { $pb } = useNuxtApp()
                if ($pb) return $pb

                // Fallback - créer une nouvelle instance
                const runtimeConfig = useRuntimeConfig()
                return new PocketBase(runtimeConfig.public.pocketbaseUrl)
            } catch (error) {
                console.error('Error getting PocketBase instance:', error)
                return null
            }
        },

        async login(email, password) {
            this.isLoading = true
            this.error = null

            try {
                // Assurez-vous que pb est initialisé
                const pb = this.getPocketBaseInstance()
                if (!pb) {
                    throw new Error('PocketBase not initialized')
                }

                const authData = await pb.collection('users').authWithPassword(email, password)
                this.user = authData.record

                // Vérifier si l'utilisateur est suspendu
                if (this.user.isSuspended) {
                    this.logout()
                    throw new Error('Votre compte a été suspendu. Veuillez contacter l\'administrateur.')
                }

                // Vérifier si l'utilisateur est vérifié
                if (!this.user.verified) {
                    this.logout()
                    throw new Error('Votre compte n\'a pas été vérifié. Veuillez vérifier votre email.')
                }

                // Enregistrer l'activité de l'utilisateur
                await this.recordActivity('login', {message: 'Connexion réussie'})

                return authData
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async loginWithGoogle() {
            this.isLoading = true
            this.error = null

            try {
                const pb = this.getPocketBaseInstance()
                if (!pb) {
                    throw new Error('PocketBase not initialized')
                }

                // Redirection pour l'authentification OAuth2 avec Google
                const authData = await pb.collection('users').authWithOAuth2({
                    provider: 'google'
                })

                this.user = authData.record

                // Vérifier si l'utilisateur est suspendu
                if (this.user.isSuspended) {
                    this.logout()
                    throw new Error('Votre compte a été suspendu. Veuillez contacter l\'administrateur.')
                }

                // Enregistrer l'activité de l'utilisateur
                await this.recordActivity('login', {message: 'Connexion avec Google réussie'})

                return authData
            } catch (error) {
                this.error = error.message || 'Erreur lors de la connexion avec Google'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async register(userData) {
            this.isLoading = true
            this.error = null

            try {
                const pb = this.getPocketBaseInstance()
                if (!pb) {
                    throw new Error('PocketBase not initialized')
                }

                const newUser = await pb.collection('users').create(userData)
                await pb.collection('users').requestVerification(userData.email)

                return newUser
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async requestPasswordReset(email) {
            this.isLoading = true
            this.error = null

            try {
                const pb = this.getPocketBaseInstance()
                if (!pb) {
                    throw new Error('PocketBase not initialized')
                }

                await pb.collection('users').requestPasswordReset(email)
                return true
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async confirmVerification(token) {
            this.isLoading = true
            this.error = null

            try {
                const pb = this.getPocketBaseInstance()
                if (!pb) {
                    throw new Error('PocketBase not initialized')
                }

                await pb.collection('users').confirmVerification(token)
                return true
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async confirmPasswordReset(token, password, passwordConfirm) {
            this.isLoading = true
            this.error = null

            try {
                const pb = this.getPocketBaseInstance()
                if (!pb) {
                    throw new Error('PocketBase not initialized')
                }

                await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm)
                return true
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async updateUser(userData) {
            this.isLoading = true
            this.error = null

            try {
                const pb = this.getPocketBaseInstance()
                if (!pb) {
                    throw new Error('PocketBase not initialized')
                }

                const updatedUser = await pb.collection('users').update(this.user.id, userData)
                this.user = updatedUser

                // Enregistrer l'activité de l'utilisateur
                await this.recordActivity('profile_update', {message: 'Profil mis à jour'})

                return updatedUser
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async recordActivity(type, data) {
            if (!this.user) return

            try {
                const pb = this.getPocketBaseInstance()
                if (!pb) return

                const activityData = {
                    user: this.user.id,
                    activity: {
                        type,
                        data,
                        timestamp: new Date().toISOString()
                    }
                }

                await pb.collection('userActivity').create(activityData)
            } catch (error) {
                console.error('Failed to record activity:', error)
            }
        },

        logout() {
            if (this.user) {
                this.recordActivity('logout', {message: 'Déconnexion'})
            }

            const pb = this.getPocketBaseInstance()
            if (pb) {
                pb.authStore.clear()
            }

            this.user = null

            // Rediriger vers la page d'accueil
            navigateTo('/')
        }
    }
})