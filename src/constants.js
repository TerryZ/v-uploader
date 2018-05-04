/**
 * 文件容量转换具体的bytes数值
 * @param fileSize 参数类型（String），例：2MB，230KB，1TB等
 * @param thousand 参数类型（boolean），是否以1000为计算单位，否则以默认的1024为计算单位
 */
let fileSize2Bytes = (fileSize,thousand)=>{
    if(!fileSize) return null;
    let baseUnit = thousand ? 1000 : 1024;
    let kb = baseUnit, mb = kb * baseUnit, gb = mb * baseUnit;
    let tmpCode = fileSize.substring(fileSize.length - 2).toUpperCase();
    let sizeNumber = fileSize.substring(0, fileSize.length - 2);
    let num = Number.parseInt(sizeNumber);
    let result = 0;
    switch (tmpCode) {
        case 'KB':
            result = num * kb;
            break;
        case 'MB':
            result = num * mb;
            break;
        case 'GB':
            result = num * gb;
            break;
    }
    return result;
};

const i18n = {
    cn: {
        messages: {
            'typeError' : "{file} 文件格式不正确。有效格式： {extensions}",
            'sizeError' : "{file} 文件容量超过限制, 文件最大容量为： {sizeLimit}",
            'minSizeError' : "{file} 文件容量低于限制, 上传的文件最小容量为： {minSizeLimit}.",
            'emptyError' : "{file} 文件为空，请选择其他文件进行上传。",
            'noFilesError' : "未选择任何文件进行上传",
            'tooManyItemsError' : "太多文件 ({netItems}) 需要被上传，上传文件数量限制为： {itemLimit}个",
            'maxHeightImageError' : "图片高度超过限制",
            'maxWidthImageError' : "图片宽度超过限制",
            'minHeightImageError' : "图片高度不足",
            'minWidthImageError' : "图片宽度不足",
            'retryFailTooManyItems' : "重试失败 - 您已达到文件数量上限。",
            'onLeave' : "文件正在上传，若离开该页面，正在上传的文件将被取消"
        },
        text: {
            'failUpload' : '上传失败',
            'fileInputTitle' : '选择文件进行上传'
        },
        ui: {
            thumbnail: '图片预览',
            choseFileButton: '选择文件',
            dropHere: '将文件拖到这里进行上传……',
            done: '完成',
            fileTypes: '文件类型',
            fileSizeLimit: '文件容易限制'
        }

    },
    en: {
        ui: {
            thumbnail: 'thumbnail',
            choseFileButton: 'select file',
            dropHere: 'drop files here',
            done: 'done',
            fileTypes: 'file extensions',
            fileSizeLimit: 'file size limit'
        }
    }
};


//let path = process.cwd() + 'node_modules/fine-uploader/fine-uploader'

const defaults = {
    //'template' : 'eUploadTemplate',
    'multiple' : true,
    'request' : {
        //'endpoint' : $webroot + 'upload/publicFileUpload',
        'inputName' : 'uploadFileObj'
    },
    /*
    'thumbnails' : {
        'placeholders' : {
            'waitingPath' : path + 'placeholders/waiting-generic.png',
            'notAvailablePath' : path + 'placeholders/not_available-generic.png'
        }
    },
    */
    'validation' : {
        'allowedExtensions' : ['jpeg', 'jpg', 'gif', 'png'],
        'sizeLimit' : fileSize2Bytes('5MB',true),
        'sizeLimitStr' : '5MB',
        'image': {}
    },
    /**
     * 删除文件，目前服务端为空请求
     */
    'deleteFile' : {
        'enabled' : true,
        'method' : "POST"//,
        //'endpoint' : $webroot + 'upload/deleteUploadFile'
    },
    /**
     * 调试模式，在浏览器的console控制台中打印日志
     */
    'debug' : true,
    /**
     * 消息提示统一调用方法
     * UI mode use only, in basic mode will not call this function, 模式使用，在Basic模式下不执行该事件处理
     * Basic模式需要处理onError中获得errorReason进行错误信息展示
     */
    /*
    'showMessage' : function(message) {
        //eAlert.alert(message,$.noop,'error');
        console.log(message);
    },
    */
    'callbacks' : {
        //单个文件上传成功后的回调处理
        'onComplete' : function(id,name,json,xhr){},
        //删除上传文件前的回调，可以阻止删除(return false)
        'onSubmitDelete' : function(id){}
    }
};

/**
 * simple upload mode(single file upload)
 */
let buildSimpleParams = () => {
    let p = JSON.parse(JSON.stringify(defaults));

    p.multiple = true;
    //params.button = $(this)[0];//document.getElementById('uploadDivButton');

    return p;
};
const simpleDefaults = buildSimpleParams();

/**
 * user config options default
 */
const userParamsDefaults = {
    /**
     * language
     * @type string
     * @default 'cn'
     */
    language: 'cn',
    /**
     * show preview box in single upload mode
     * @type boolean
     * @default true
     */
    preview: true,
    /**
     * file upload type
     * true: multiple file upload(default)
     * false: single file upload
     */
    multiple: false,
    button: undefined,             //the upload 'button' dom object
    uploadUrl : undefined,         //receive file server side url
    uploadFileObjName : undefined,//upload file object name
    fileSizeLimit : undefined,    //upload file size limit - default 10MB
    fileTypeExts : undefined,     //cannot upload file types
    imageMaxHeight : 0,
    imageMaxWidth : 0,
    imageMinHeight : 0,
    imageMinWidth : 0,
    /**
     * upload success callback
     * @param id - file id
     * @param name - file name
     * @param json - uploaded file detail info
     */
    callback : undefined
};

/**
 * marge default options and user options
 * @param p1 - default options(defaults or simpleUploaderDefaults)
 * @param p2 - user pass options
 */
const margeOptions = (p1, p2) => {
    //let p2 = Object.assign({}, userParamsDefaults, p2);
    let p = JSON.parse(JSON.stringify(p1));

    if(typeof(p2.button) !== 'undefined') p.button = p2.button;
    if(typeof(p2.uploadUrl) !== 'undefined') p.request.endpoint = p2.uploadUrl;
    if(typeof(p2.uploadFileObjName) !== 'undefined') p.request.inputName = p2.uploadFileObjName;
    if(typeof(p2.fileTypeExts) !== 'undefined') p.validation.allowedExtensions = p2.fileTypeExts;
    if(typeof(p2.fileSizeLimit) !== 'undefined') {
        p.validation.sizeLimit = fileSize2Bytes(p2.fileSizeLimit, true);
        p.validation.sizeLimitStr = p2.fileSizeLimit;
    }
    if(typeof(p2.imageMaxHeight) !== 'undefined') p.validation.image.maxHeight = p2.imageMaxHeight;
    if(typeof(p2.imageMaxWidth) !== 'undefined') p.validation.image.maxWidth = p2.imageMaxWidth;
    if(typeof(p2.imageMinHeight) !== 'undefined') p.validation.image.minHeight = p2.imageMinHeight;
    if(typeof(p2.imageMinWidth) !== 'undefined') p.validation.image.minWidth = p2.imageMinWidth;

    if(p2.language && p2.language === 'cn'){
        p.messages = i18n.cn.messages;
        p.text = i18n.cn.text;
    }
    //server side validate file info
    p.request.params = {
        'fileSizeLimit' : p.validation.sizeLimitStr,
        'fileTypeExts' : p.validation.allowedExtensions.join(',')
    };

    if(p2.callback && typeof(p2.callback) === 'function'){
        p.callbacks.onComplete = function(id,name,json,xhr){
            if(json) p2.callback(json);
        };
    }
    return p;
};

const getI18n = language => (!language || language !== 'en') ? i18n.cn.ui : i18n.en.ui ;



export {defaults};
export {simpleDefaults};
export {userParamsDefaults};
export {margeOptions};
export {getI18n};