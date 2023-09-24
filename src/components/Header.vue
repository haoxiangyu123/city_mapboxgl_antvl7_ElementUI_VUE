<template>
  <header class="header">
    <div class="timer">
      <p>2023-05-07</p>
      <p>09:20</p>
    </div>
    <span>智慧城市-武汉</span>
  </header>
</template>
<script setup>
</script>
<style scoped>
  .header{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 10vh;
    background-image: url('../assets/header.png');
    background-size: cover;
    z-index: 3;
    display: flex;
    align-items: center;
    font-size: 30px;
    color: #fff;
  }

  .timer{
    font-size: 24px;
    margin-left: 20px;
    text-align: center;
  }

  .header>span{
    position: absolute;
    left: 50%;
    top: 39%;
    transform: translate(-50%,-50%);
  }

</style>