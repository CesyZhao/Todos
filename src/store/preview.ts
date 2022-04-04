import { defineStore } from 'pinia';


export default defineStore({
  id: 'previewStore',

  state: () => {
    return {
      activeItem: '',
      showConfigDialog: false,
    }
  },

  actions: {
    changeActiveId(item: string) {
      this.activeItem = item;
    },
    toggleConfigDialog(status: boolean) {
      this.showConfigDialog = status;
    }
  },
})