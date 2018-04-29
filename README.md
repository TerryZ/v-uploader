<h3 align="center">v-uploader</h3>

<br><br>

<p align="center"><img src="https://terryz.gitee.io/image/v-uploader/v-uploader-single.png" alt="v-uploader"></p>

<p align="center">
A <strong>Vue2</strong> plugin to make files upload easier, you can drag files or select file in dialog to upload
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/v-uploader"><img src="https://img.shields.io/npm/v/v-uploader.svg"></a>
  <a href="https://mit-license.org/"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg"></a>
  <a href="https://www.npmjs.com/package/v-uploader"><img src="https://img.shields.io/npm/dy/v-uploader.svg"></a>
</p>
<br><br><br><br><br>

## Demo、Document、Changelog
Explorer on

- [English site](https://terryz.github.io/vue/#/upload)
- [国内站点](https://terryz.gitee.io/vue/#/upload)

## Install

``` bash
npm i v-uploader --save
```

Include plugin in your `main.js` file.

```js
import Vue from 'vue'
import vUploader from 'v-uploader';

/**
 * v-uploader plugin global config
 */
const uploaderConfig = () => {
    return {
        uploadFileUrl: 'http://xxx/upload',
        deleteFileUrl: 'http://xxx/delete',
        showMessage: (vue, message) => {
            //using v-dialogs to show message
            vue.$vDialog.alert(message, null, {messageType: 'error'});
        }
    }
};

//install plugin with params
Vue.use(vUploader, uploaderConfig);
```

there is using [v-dialogs](https://github.com/TerryZ/v-dialogs) to show message in example

## Plugin preview

single file upload mode

<p align="center"><img src="https://terryz.github.io/image/v-uploader/v-uploader-single.png" alt="v-uploader-single" ></p>

multiple files upload mode

<p align="center"><img src="https://terryz.github.io/image/v-uploader/v-uploader-multiple.png" alt="v-uploader-multiple" ></p>
