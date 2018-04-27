import uploader from './Uploader.vue';

const Plugin = {
    install(Vue, config){
        if(config && typeof(config) === 'function')
            uploader.methods.initConfig = config;
        if(!uploader.methods.initConfig){
            let msg = `v-uploader plugin "initConfig" function has not initialization, the file uploader need to specify server side upload url and the way to show error message.
    for detail, please visit: https://terryz.github.io/vue`;
            console.error(msg);
        }
        Vue.component(uploader.name, uploader);
    }
};

export default Plugin;