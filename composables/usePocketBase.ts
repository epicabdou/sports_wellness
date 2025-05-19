// composables/usePocketBase.ts
export function usePocketBase() {
    const nuxtApp = useNuxtApp()

    if (!nuxtApp.$pb) {
        throw new Error('PocketBase n\'est pas initialisé. Vérifiez que le plugin est correctement configuré.')
    }

    return nuxtApp.$pb
}