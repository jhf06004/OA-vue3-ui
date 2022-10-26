import Cookies from "js-cookie";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    sidebar: {
      collapseStatus: Cookies.set('sidebarStatus') === 'true',
      hidden: false
    },
    device: 'desktop'
  }),
  getters:{
    getCollapseStatus(state){
      return state.sidebar.collapseStatus
    },
    getSidebarHidden(state){
      return state.sidebar.hidden
    }
  },
  actions: {
    toggleSideBarHide(opened) {
      this.sidebar.collapseStatus = opened
      if (this.sidebar.collapseStatus) {
        Cookies.set('sidebarStatus', true)
      } else {
        Cookies.set('sidebarStatus', false)
      }
    },
    setSidebarHidden(status){
      this.sidebar.hidden = status
    }
  }
})
