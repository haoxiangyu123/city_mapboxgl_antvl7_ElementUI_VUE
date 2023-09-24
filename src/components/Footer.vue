<template>
  <div class="footer">
    <slot/>
  </div>
</template>

<script setup>

</script>
<style scoped>
    .footer{
        width: 100%;
        height: 8vh;
        position: fixed;
        left: 0;
        bottom: 0;
        background: url('../assets/xzd-header.png') no-repeat;
        background-size: cover;
        transform: rotate(180deg);
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>