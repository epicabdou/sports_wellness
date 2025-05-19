// middleware/guest.js
// Ce middleware redirige les utilisateurs connectés vers la page d'accueil
// s'ils essaient d'accéder aux pages réservées aux invités (login/register)

import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
    const authStore = useAuthStore()

    // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
    if (authStore.isLoggedIn) {
        return navigateTo('/')
    }
})