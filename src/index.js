import uploader from './Uploader.vue';

const Plugin = {
    install(Vue, options = {}){
        if(Object.keys(options).length){
            if(typeof options.language === 'string') uploader.props.language.default = options.language;
            if(typeof options.preview === 'boolean') uploader.props.preview.default = options.preview;
            if(typeof options.buttonText === 'string') uploader.props.buttonText.default = options.buttonText;
            if(typeof options.buttonIcon === 'boolean') uploader.props.buttonIcon.default = options.buttonIcon;
            if(typeof options.previewWidth === 'number') uploader.props.previewWidth.default = options.previewWidth;
            if(typeof options.previewHeight === 'number') uploader.props.previewHeight.default = options.previewHeight;
            if(typeof options.multiple === 'boolean') uploader.props.multiple.default = options.multiple;
            if(typeof options.uploadFileObjName === 'string') uploader.props.uploadFileObjName.default = options.uploadFileObjName;
            if(typeof options.itemLimit === 'number') uploader.props.itemLimit.default = options.itemLimit;
            if(typeof options.fileSizeLimit === 'string') uploader.props.fileSizeLimit.default = options.fileSizeLimit;
            if(typeof options.fileTypeExts === 'string') uploader.props.fileTypeExts.default = options.fileTypeExts;
            if(typeof options.imageMaxHeight === 'number') uploader.props.imageMaxHeight.default = options.imageMaxHeight;
            if(typeof options.imageMaxWidth === 'number') uploader.props.imageMaxWidth.default = options.imageMaxWidth;
            if(typeof options.imageMinHeight === 'number') uploader.props.imageMinHeight.default = options.imageMinHeight;
            if(typeof options.imageMinWidth === 'number') uploader.props.imageMinWidth.default = options.imageMinWidth;

            if(typeof options.uploadFileUrl === 'string') uploader.props.uploadFileUrl.default = options.uploadFileUrl;
            if(typeof options.deleteFileUrl === 'string') uploader.props.deleteFileUrl.default = options.deleteFileUrl;
            if(typeof options.showMessage === 'function') uploader.props.showMessage.default = options.showMessage;
        }
        Vue.component(uploader.name, uploader);
    }
};

export default Plugin;