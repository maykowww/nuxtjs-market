const protectedRoutes = ["/checkout", "/orders", "/shoppingcart"];

export default defineNuxtRouteMiddleware((from, to) => {
    const user = useSupabaseUser();
    if (
        !user.value &&
        protectedRoutes.filter((route) => route === to.fullPath)
    ) {
        return navigateTo("/auth");
    }
});
