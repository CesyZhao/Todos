import { defineStore } from 'pinia';


export default defineStore({
  id: 'toolbarStore',

  state: () => {
    return {
      open: true,
    }
  },

  actions: {
    toggleToolbar() {
      this.open = !this.open;
    }
  },
})