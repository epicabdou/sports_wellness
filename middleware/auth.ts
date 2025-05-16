// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
    const { pb } = usePocketBase();

    // Check if user is authenticated
    if (!pb.authStore.isValid) {
        // Redirect to login page with the intended destination
        return navigateTo({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    }
});