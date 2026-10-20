<script setup lang="ts">
await useShellPrefetch()
</script>

<template>
  <div class="min-h-screen bg-canvas pb-14 md:pb-0">
    <SocialTopBar />

    <div class="mx-auto w-full max-w-app px-md">
      <div
        class="grid grid-cols-1 gap-lg
               md:grid-cols-[72px_minmax(0,1fr)]
               lg:grid-cols-[260px_minmax(0,1fr)]
               xl:grid-cols-[260px_minmax(0,1fr)_320px]"
      >
        <SocialSideNav />

        <main class="mx-auto w-full max-w-[680px] py-lg">
          <slot />
        </main>

        <SocialRightRail />
      </div>
    </div>

    <SocialBottomNav />
  </div>
</template>
