<br><br>

<p align="center"><img src="https://terryz.gitee.io/image/v-uploader/v-uploader-single.png" alt="v-uploader"></p>

<h3 align="center">v-uploader</h3>

<p align="center">
  A <strong>Vue2</strong> plugin make files upload simple and easier, <br>
  single file upload with image preview, multiple upload with drag and drop
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/v-uploader"><img src="https://img.shields.io/npm/v/v-uploader.svg"></a>
  <a href="https://mit-license.org/"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg"></a>
<a href="https://app.fossa.io/projects/git%2Bgithub.com%2FTerryZ%2Fv-uploader?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2FTerryZ%2Fv-uploader.svg?type=shield"/></a>
  <a href="https://www.npmjs.com/package/v-uploader"><img src="https://img.shields.io/npm/dy/v-uploader.svg"></a>
</p>

<br><br><br><br><br>

## Examples and Documentation

Explorer on

- [English site](https://terryz.github.io/vue/#/upload)
- [国内站点](https://terryz.gitee.io/vue/#/upload)

## Plugin preview

Single file upload with image preview

<p align="center"><img src="https://terryz.github.io/image/v-uploader/v-uploader-single.png" alt="v-uploader-single" ></p>

Multiple files upload with drag and drop

<p align="center"><img src="https://terryz.github.io/image/v-uploader/v-uploader-multiple.png" alt="v-uploader-multiple" ></p>

## Installation

```
npm i v-uploader -S
```

Include and install plugin in your `main.js` file.

```js
import Vue from 'vue'
import Uploader from 'v-uploader'

/**
 * v-uploader plugin global config
 */
const uploaderConfig = {
  uploadFileUrl: 'https://some-site/upload',
  deleteFileUrl: 'https://some-site/delete',
  showMessage: (vue, message) => {
    // using v-dialogs to show message
    vue.$dlg.alert(message, null, { messageType: 'error' })
  }
}

// install plugin with options
Vue.use(Uploader, uploaderConfig)
```

There is using **[v-dialogs](https://github.com/TerryZ/v-dialogs)** to show message in example

## Dependencies

- [fine-uploader](https://github.com/FineUploader/fine-uploader)
- [holderjs](https://github.com/imsky/holder)

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FTerryZ%2Fv-uploader.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FTerryZ%2Fv-uploader?ref=badge_large)
