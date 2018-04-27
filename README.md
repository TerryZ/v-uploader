# v-uploader

A simple and easier to use file uploader, you can drag files or select file in dialog to upload, based on Vue2.x

<p align="center">
  <a href="https://www.npmjs.com/package/v-uploader"><img src="https://img.shields.io/npm/v/v-uploader.svg"></a>
  <a href="https://mit-license.org/"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg"></a>
  <a href="https://www.npmjs.com/package/v-uploader"><img src="https://img.shields.io/npm/dy/v-uploader.svg"></a>
</p>
<br><br><br><br><br>

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
const uploaderConfig = vue => {
    return {
        /**
         * file uploader server url
         *
         * return result
         * {
         *      success: true,//boolean, required
         *      error: 'error message to display',//error message, required when upload fail
         *
         *      fileId: '123'//your custom file info
         *      ...
         * }
         *
         * for example
         * success:
         * {success: true, fileId: '123', fileName: '2018-04-26-1023.jpg'}
         * fail:
         * {success: false, error: 'file upload fail, out of space.'}
         *
         * for detail, visit fine-uploader site
         * https://docs.fineuploader.com/branch/master/endpoint_handlers/traditional.html
         */
        uploadFileUrl: config.baseUrl + '/upload/publicFileUpload',
        /**
         * file delete server url
         * the server just response 200 status, no need to return data
         *
         * for detail, visit fine-uploader site
         * https://docs.fineuploader.com/branch/master/endpoint_handlers/traditional.html
         */
        deleteFileUrl: config.baseUrl + '/upload/deleteUploadFile',
        /**
         * set the way to show upload message(upload fail message)
         *
         * @param vue - the Vue instance
         * @param message - upload file message
         */
        showMessage: (vue, message) => {
            vue.$vDialog.alert(message, null, {messageType: 'error'});
        }
    }
};

Vue.use(vUploader, uploaderConfig);
```



