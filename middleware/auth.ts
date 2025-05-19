// middleware/auth.js
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    // If not logged in and route requires auth
    if (!authStore.isLoggedIn && to.meta.requiresAuth) {
        return navigateTo('/auth/login')
    }

    // If not admin and route requires admin
    if (!authStore.isAdmin && to.meta.requiresAdmin) {
        return navigateTo('/')
    }

    // If user is suspended, log them out
    if (authStore.user?.isSuspended) {
        authStore.logout()
        return navigateTo('/auth/login')
    }
})