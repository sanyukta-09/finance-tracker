<!-- <template>
    <UCard>
        <template #header>
            Signing in ...
        </template>

        Wait a moment white we sign you in
    </UCard>
</template>
<script setup>
useRedirectIfAuthenticated()
</script> -->
<template>
    <UCard>
      <template #header>
        Signing in...
      </template>
      <p>Wait a moment while we sign you in...</p>
    </UCard>
  </template>
  
  <script setup>
  import { useRoute, useRouter } from 'vue-router';
  
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const route = useRoute();
  const router = useRouter();
  
  onMounted(async () => {
    const { code } = route.query;
    
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
  
      if (error) {
        console.error("Authentication error:", error.message);
      } else {
        console.log("Successfully authenticated");
  
        // 🚀 Force refresh user session after login
        const { data: newUser, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("Error getting user:", userError.message);
        } else {
          console.log("User:", newUser);
        }
  
        router.push("/"); // ✅ Redirect to home
      }
    } else {
      console.error("No authentication code found");
    }
  });
  </script>
  
  