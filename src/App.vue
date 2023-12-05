<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Album</RouterLink>
      <RouterLink to="/camera">Camera</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  background-color: #666;
  padding: 0.5rem 2rem;
}

nav {
  display: flex;
  gap: 1rem;
  font-size: 1.25rem;
}

nav a {
  color: #FFF;
  text-decoration: none;
}
</style>
