<template>
  <div class="cur-nav">
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: "curNav"
};
</script>

<style stope>
.cur-nav {
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  background-color: #fff;
  color: #666;
  padding-left: 20px;
  border: 1px solid #e5e5e5;
}
.cur-nav span {
  font-size: 14px;
  line-height: 40px;
}
</style>
