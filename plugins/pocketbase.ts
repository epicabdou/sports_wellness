// plugins/pocketbase.ts
import PocketBase from 'pocketbase';

export default defineNuxtPlugin({
    name: 'pocketbase',
    enforce: 'pre', // Run this plugin before others
    async setup(nuxtApp) {
        // Obtenez la configuration runtime
        const runtimeConfig = useRuntimeConfig()
        const pocketbaseUrl = runtimeConfig.public.pocketbaseUrl || 'http://127.0.0.1:8090'

        // Créez une instance PocketBase
        const pb = new PocketBase(pocketbaseUrl)

        // Attendez que Pinia soit initialisé
        nuxtApp.hook('app:created', () => {
            // Attendez que l'application soit montée pour accéder aux stores
            nuxtApp.hook('app:mounted', async () => {
                try {
                    // Importez dynamiquement le store pour éviter l'erreur
                    const { useAuthStore } = await import('~/stores/auth')
                    const authStore = useAuthStore()

                    // Initialisez le store
                    authStore.pb = pb

                    // Chargez les données d'authentification depuis le localStorage
                    if (pb.authStore.isValid) {
                        authStore.user = pb.authStore.model

                        // Écoutez les changements dans authStore
                        pb.authStore.onChange(() => {
                            authStore.user = pb.authStore.model
                        })

                        // Mise à jour de la date de dernière connexion
                        if (authStore.isLoggedIn) {
                            try {
                                // Mettre à jour le champ lastConnected
                                await pb.collection('users').update(authStore.user.id, {
                                    lastConnected: new Date().toISOString()
                                })
                            } catch (error) {
                                console.error('Failed to update last connected date:', error)
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error initializing PocketBase:', error)
                }
            })
        })

        // Exposez PocketBase à l'application
        return {
            provide: {
                pb
            }
        }
    }
})