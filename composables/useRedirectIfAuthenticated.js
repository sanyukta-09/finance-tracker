export const useRedirectIfAuthenticated = (url = '/') => {
    // Check if the user is authenticated already
const user = useSupabaseUser()

watch(user, (user) => {
    if(user){
        return navigateTo(url)
    }
}, {immediate: true})

return {user}
}