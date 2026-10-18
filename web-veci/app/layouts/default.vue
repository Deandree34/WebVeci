<template>
  <div class="flex min-h-screen flex-col bg-canvas">
    <BTopNav />
    <main class="flex-1">
      <slot />
    </main>
    <BFooter />
  </div>
</template>
