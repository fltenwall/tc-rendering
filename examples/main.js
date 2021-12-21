import Vue from "vue";
import App from "./App.vue";
import demo from "../packages/index";
import router from "./router/index";
import Vant from "vant";
import "vant/lib/index.css";

Vue.use(demo);
Vue.use(Vant);

Vue.config.productionTip = false;

if (process.env.VUE_APP_PLATFORM === "web") {
  new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");
} else {
  document.addEventListener("deviceready", () => {
    new Vue({
      router,
      render: (h) => h(App),
    }).$mount("#app");
  });
}
