import tcBase from './src/index.vue';

tcBase.install = function(Vue) {
    Vue.component(tcBase.name, tcBase)
}

export default tcBase
