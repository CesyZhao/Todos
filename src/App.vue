<script setup lang="ts">
import Menu from './component/Menu.vue';
import Content from './component/Content.vue';
</script>

<template>
  <a-layout class="layout-demo">
    <a-layout-sider
      breakpoint="lg"
      :width="132"
      :collapsed-width="64"
      collapsible
      :collapsed="collapsed"
      @collapse="onCollapse"
    >
      <div class="logo" />
      <Menu></Menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header>
        <div class="dragger"></div>
      </a-layout-header>
      <a-layout>
        <Content />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style lang="less">
@import './theme/override.less';
@import './theme/vars.less';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: @theme-background;
  display: flex;
}
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  color: var(--color-text-2);
  line-height: 1 !important;
}
.dragger{
  height: 24px;
  -webkit-app-region: drag;
  user-select: none;
  position: absolute;
  top: 0;
  left: 132px;
  right: 0;
}
.logo{
  height: 72px;
}
::-webkit-scrollbar{
  display: none;
}
</style>
