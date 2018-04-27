<template>
    <div :class="[uploaderClass]">
        <div class="single-upload" v-if="!config || !config.multiple">
            <div class="image-box">
                <img :src="singleUploadImg" alt="" ref="simpleImg">
            </div>
            <div class="btn singleFileUpload" ref="upload" ><i class="iconfont icon-uploader-open"></i> {{ui.choseFileButton}}</div>
        </div>

        <div v-if="config && config.multiple" ref="multipleUpload" class="upload-list">

        </div>

        <div v-if="config && config.multiple" v-show="false" ref="uploadArea">
            <div class="qq-uploader-selector qq-uploader qq-gallery" :qq-drop-area-text="ui.dropHere" style="height:100%;">
                <ul class="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite" aria-relevant="additions removals">
                    <li>
                        <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>
                        <div class="qq-progress-bar-container-selector qq-progress-bar-container">
                            <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>
                        </div>
                        <span class="qq-upload-spinner-selector qq-upload-spinner"></span>
                        <div class="qq-thumbnail-wrapper">
                            <img class="qq-thumbnail-selector" qq-max-size="120" qq-server-scale>
                        </div>
                        <button type="button" class="qq-upload-cancel-selector qq-upload-cancel">X</button>
                        <button type="button" class="qq-upload-retry-selector qq-upload-retry">
                            <span class="qq-btn qq-retry-icon" aria-label="Retry"></span> Retry
                        </button>

                        <div class="qq-file-info">
                            <div class="qq-file-name">
                                <span class="qq-upload-file-selector qq-upload-file"></span>
                                <span class="qq-edit-filename-icon-selector qq-edit-filename-icon" aria-label="Edit filename"></span>
                            </div>
                            <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">
                            <span class="qq-upload-size-selector qq-upload-size"></span>
                            <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">
                                <span class="qq-btn qq-delete-icon" aria-label="Delete"></span>
                            </button>
                            <button type="button" class="qq-btn qq-upload-pause-selector qq-upload-pause">
                                <span class="qq-btn qq-pause-icon" aria-label="Pause"></span>
                            </button>
                            <button type="button" class="qq-btn qq-upload-continue-selector qq-upload-continue">
                                <span class="qq-btn qq-continue-icon" aria-label="Continue"></span>
                            </button>
                        </div>
                    </li>
                </ul>


                <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>
                    <span class="qq-upload-drop-area-text-selector"></span>
                </div>


                <div class="qq-upload-button-selector qq-upload-button">
                    <div><i class="iconfont icon-uploader-open"></i> {{ui.choseFileButton}}</div>
                </div>
                <div class="info-show">
                    <div>{{ui.fileSizeLimit}}：<span v-text="fileSizeLimit"></span><br/>{{ui.fileTypes}}：<span v-text="fileTypeExts"></span></div>
                </div>

                <!--<div class="qq-upload-button-selector qq-upload-button file-upload-finish" style="float:right;">
                    <div><i class="iconfont icon-uploader-done"></i> {{ui.done}}</div>
                </div>-->

                <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
                    <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import fu from 'fine-uploader';
    import 'fine-uploader/fine-uploader/fine-uploader-gallery.min.css';
    import holder from 'holderjs';

    import {defaults, simpleDefaults, margeOptions, getI18n} from './constants';

    let p;
    export default {
        name: "v-uploader",
        props:['setting'],
        data(){
            let config = this.setting;
            if(!config) config = { multiple: false };
            return {
                uploadedFiles: [],
                deleteIndexs: [],
                config: config,
                singleUploadImg: '',
                ui: {},
                fileSizeLimit: 0,
                fileTypeExts: '',

                hookSet : null,
                uploaderClass: {
                    'v-uploader': true,
                    'single-mode': false,
                    'multiple-mode': false
                }
            };
        },
        methods:{
            /**
             * plugin global options set
             * required init in plugin install
             *
             * receive 2 params
             * uploadFileUrl - file uploader server url
             * showMessage - the way to show error message
             */
            initConfig: false
        },
        beforeMount(){
            let that = this;
            if(this.config && this.config.multiple) this.uploaderClass['multiple-mode'] = true;
            else this.uploaderClass['single-mode'] = true;

            if(this.initConfig && typeof(this.initConfig) === 'function')
                this.hookSet = this.initConfig();


            this.ui = getI18n(this.config.language);
            this.singleUploadImg = `holder.js/200x150?text=${this.ui.thumbnail}&size=16`;
            this.choseFileButton = this.ui.choseFileButton;

            let params = JSON.parse(JSON.stringify(this.config));
            if(!this.config.multiple) {
                params.callback = data => {
                    if(data && typeof(data.success) != 'undefined' && data.success){
                        that.singleUploadImg = data.url;
                        that.$emit('done', [data]);
                    }
                };
                p = margeOptions(simpleDefaults, params);
            }else{
                params.callback = data => {
                    if(data && typeof(data.success) != 'undefined' && data.success) {
                        that.uploadedFiles.push(data);
                    }
                };
                p = margeOptions(defaults, params);

                this.fileSizeLimit = p.validation.sizeLimitStr;
                this.fileTypeExts = p.validation.allowedExtensions.join(',')
            }
        },
        mounted(){
            let that = this;

            p.request.endpoint = this.hookSet.uploadFileUrl;


            if(!this.config.multiple) {
                holder.run({ images: this.$refs.simpleImg });
                p.button = that.$refs.upload;
                //upload error callback
                //basic mode work only
                p.callbacks.onError = (id,name,errorReason,xhr) => {
                    that.hookSet.showMessage(that, errorReason);
                };
                new fu.FineUploaderBasic(p);
            }else{
                p.deleteFile.endpoint = this.hookSet.deleteFileUrl;
                p.template = this.$refs.uploadArea;
                p.element = this.$refs.multipleUpload;
                p.callbacks.showMessage = message => {
                    that.hookSet.showMessage(that, message);
                }
                p.callbacks.onDelete = id => {
                    that.deleteIndexs.push(id);
                    that.$emit('done', that.uploadedFiles.filter((val,index)=>{
                        return !that.deleteIndexs.includes(index);
                    }));
                };
                p.callbacks.onAllComplete = (succeeded, failed) => {
                    that.$emit('done', that.uploadedFiles);
                };
                new fu.FineUploader(p);
            }
        }
    }
</script>

<style lang="scss" scoped>
    $borderRadius: 2px;
    div.v-uploader{
        &.single-mode {
            display: inline-block;
        }
        &.multiple-mode {
            display: block;
        }

        div.single-upload {
            display: inline-block;
            margin-right: 5px;
            margin-bottom: 5px;
            text-align: center;
            div.image-box {
                -webkit-border-radius: $borderRadius;
                -moz-border-radius: $borderRadius;
                border-radius: $borderRadius;
                -webkit-box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
                -moz-box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
                box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid #DDDDDD;
                padding: 5px;
                margin-bottom: 10px;
            }
        }
        div.upload-list {
            width: 100%;
            .qq-gallery {
                &.qq-uploader {
                    padding: 10px;
                }
                .qq-upload-list {
                    height: 205px;
                    padding: 1px 0 10px 1px;
                    overflow-x: hidden;
                    margin-bottom: 10px;
                    li{
                        margin: 0 10px 10px 0;
                        height: 180px;
                        &.qq-upload-success {
                            background-color: #DFF0D8;
                        }
                    }
                }
                .qq-upload-button {
                    -webkit-border-radius: 2px;
                    -moz-border-radius: 2px;
                    border-radius: 2px;
                    -webkit-box-shadow: 0 0 2px rgba(0,0,0,.12), 0 2px 2px rgba(0,0,0,.2);
                    box-shadow: 0 0 2px rgba(0,0,0,.12), 0 2px 2px rgba(0,0,0,.2);
                    -webkit-transition: all .2s ease-in-out;
                    -moz-transition: all .2s ease-in-out;
                    transition: all .2s ease-in-out;
                    color: #212121;
                    background: #fff;
                    border-color: #fff;
                    outline: 0;
                    &:active {
                        -webkit-box-shadow: 0 10px 20px rgba(0,0,0,.2), 0 6px 6px rgba(0,0,0,.23);
                        box-shadow: 0 10px 20px rgba(0,0,0,.2), 0 6px 6px rgba(0,0,0,.23);
                    }
                }
                .file-upload-finish {
                    cursor: pointer;
                    color: #fff;
                    background: #2196F3;
                    border-color: #2196F3;
                }
                .info-show {
                    float: left;
                    line-height: 18px;
                    white-space:nowrap;
                    padding: 0 5px;
                    color: #333333;
                    span {
                        color: #999999;
                        margin-right: 10px;
                        font-family: 'Consolas';
                    }
                }
            }
        }
    }
    @font-face {font-family: "iconfont";
        src: url('data:image/eot;base64,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'); /* IE9*/
        src: url('data:image/eot;base64,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?t=1524818269295#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAAWkAAsAAAAACBgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADMAAABCsP6z7U9TLzIAAAE8AAAAQwAAAFZW7kiCY21hcAAAAYAAAABmAAABnM+SbChnbHlmAAAB6AAAAbEAAAHYVwg4OmhlYWQAAAOcAAAALwAAADYRdEjPaGhlYQAAA8wAAAAeAAAAJAghA85obXR4AAAD7AAAABAAAAAQEDIAAGxvY2EAAAP8AAAACgAAAAoBYgDabWF4cAAABAgAAAAfAAAAIAETAF1uYW1lAAAEKAAAAUUAAAJtPlT+fXBvc3QAAAVwAAAAMQAAAELmlhu2eJxjYGRgYOBikGPQYWB0cfMJYeBgYGGAAJAMY05meiJQDMoDyrGAaQ4gZoOIAgCKIwNPAHicY2Bk4WWcwMDKwMHUyXSGgYGhH0IzvmYwYuRgYGBiYGVmwAoC0lxTGBwYKp41Mzf8b2CIYW5gaAAKM4LkAOEpDAUAeJzFkLENwCAMBN+YRCjKKCmjDEOZKiPQs6vXILahYQIenbFfLxkBYAPAyqVEgD4QTK+65D7jcD/i0TnpCXoXyVJbmzoTeSJ5x5akHctE61bPOr3eY7L/LgN9ouSO+VI7CD9X5RLnAAB4nCWRu27UQBSG54xj7yVeG48vY89efMOeoMBKOOPdgmS3AAqIi4hUSKFIlYakQkpDsQ0SBQVa3gAhEWqQtskrIPIKCHp6xBrG5OjoP9IvHen/zkEqQn+/K5eKj2y0he6iB+gAIdC2ITHwEGIuxngb3Fh1qWMoPOVxK03Gyh7QRHO8YiJyqrU0EwwYwU5cTPgYcyjFDN+DwhsCBH12SLIBUd5C1+ejV/Vj/B7cMB2Yszv1o9tzp4js9rlOSEDIm7amqm2MN0wDTqnXUTtdrf6gmsy9DG/hEPSAs+ppL+qT49fibJjRDsBiAXY/Mj7OLWbJfsk8mwStG722z3rpTQfOf276tj7MfyBZSiMb95UpshBHDyWnSONEptdcpwk/h0kWlyKXZr4HIpdH0FxrOgPVaQgbu7TE5BotbmSn8Kin/A7X76gwL7ojfEaFcbG5fgGriNYrGkVUypI9wX/Yp+AwXy/L/f1yJSqYiuo0FHoHnjuBddXrOsy60k+OPLmRNWu1/yXkz9Lk22irEjgTVSVIJY4GjMjY/2EWeInk9zLeosBh8Xn3F0a7X68H+gf3elGXAAAAeJxjYGRgYADiuGdCavH8Nl8ZuFkYQOA6J1Msgv7/kMWZ2RzI5WBgAokCAOhECBYAeJxjYGRgYG7438AQw+LJAAQszgyMDKiABQBTJAL5AAAEAAAAA+kAAARJAAAEAAAAAAAAAAB2ANoA7AAAeJxjYGRgYGBhCGRgZQABJiDmAkIGhv9gPgMAERIBcQB4nGWPTU7DMBCFX/oHpBKqqGCH5AViASj9EatuWFRq911036ZOmyqJI8et1ANwHo7ACTgC3IA78EgnmzaWx9+8eWNPANzgBx6O3y33kT1cMjtyDRe4F65TfxBukF+Em2jjVbhF/U3YxzOmwm10YXmD17hi9oR3YQ8dfAjXcI1P4Tr1L+EG+Vu4iTv8CrfQ8erCPuZeV7iNRy/2x1YvnF6p5UHFockikzm/gple75KFrdLqnGtbxCZTg6BfSVOdaVvdU+zXQ+ciFVmTqgmrOkmMyq3Z6tAFG+fyUa8XiR6EJuVYY/62xgKOcQWFJQ6MMUIYZIjK6Og7VWb0r7FDwl57Vj3N53RbFNT/c4UBAvTPXFO6stJ5Ok+BPV8bUnV0K27LnpQ0kV7NSRKyQl7WtlRC6gE2ZVeOEXpc0Yk/KGdI/wAJWm7IAAAAeJxjYGKAAC4G7ICFkYmRmZGFkZWBsYI3LT8nJbVIN78gNU83nyUlPy+VgQEAXuoHSgAAAA==') format('woff'),
        url('data:image/ttf;base64,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?t=1524818269295') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
        url('data:image/svg;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiID4KPCEtLQoyMDEzLTktMzA6IENyZWF0ZWQuCi0tPgo8c3ZnPgo8bWV0YWRhdGE+CkNyZWF0ZWQgYnkgaWNvbmZvbnQKPC9tZXRhZGF0YT4KPGRlZnM+Cgo8Zm9udCBpZD0iaWNvbmZvbnQiIGhvcml6LWFkdi14PSIxMDI0IiA+CiAgPGZvbnQtZmFjZQogICAgZm9udC1mYW1pbHk9Imljb25mb250IgogICAgZm9udC13ZWlnaHQ9IjUwMCIKICAgIGZvbnQtc3RyZXRjaD0ibm9ybWFsIgogICAgdW5pdHMtcGVyLWVtPSIxMDI0IgogICAgYXNjZW50PSI4OTYiCiAgICBkZXNjZW50PSItMTI4IgogIC8+CiAgICA8bWlzc2luZy1nbHlwaCAvPgogICAgCiAgICA8Z2x5cGggZ2x5cGgtbmFtZT0ieCIgdW5pY29kZT0ieCIgaG9yaXotYWR2LXg9IjEwMDEiCmQ9Ik0yODEgNTQzcS0yNyAtMSAtNTMgLTFoLTgzcS0xOCAwIC0zNi41IC02dC0zMi41IC0xOC41dC0yMyAtMzJ0LTkgLTQ1LjV2LTc2aDkxMnY0MXEwIDE2IC0wLjUgMzB0LTAuNSAxOHEwIDEzIC01IDI5dC0xNyAyOS41dC0zMS41IDIyLjV0LTQ5LjUgOWgtMTMzdi05N2gtNDM4djk3ek05NTUgMzEwdi01MnEwIC0yMyAwLjUgLTUydDAuNSAtNTh0LTEwLjUgLTQ3LjV0LTI2IC0zMHQtMzMgLTE2dC0zMS41IC00LjVxLTE0IC0xIC0yOS41IC0wLjUKdC0yOS41IDAuNWgtMzJsLTQ1IDEyOGgtNDM5bC00NCAtMTI4aC0yOWgtMzRxLTIwIDAgLTQ1IDFxLTI1IDAgLTQxIDkuNXQtMjUuNSAyM3QtMTMuNSAyOS41dC00IDMwdjE2N2g5MTF6TTE2MyAyNDdxLTEyIDAgLTIxIC04LjV0LTkgLTIxLjV0OSAtMjEuNXQyMSAtOC41cTEzIDAgMjIgOC41dDkgMjEuNXQtOSAyMS41dC0yMiA4LjV6TTMxNiAxMjNxLTggLTI2IC0xNCAtNDhxLTUgLTE5IC0xMC41IC0zN3QtNy41IC0yNXQtMyAtMTV0MSAtMTQuNQp0OS41IC0xMC41dDIxLjUgLTRoMzdoNjdoODFoODBoNjRoMzZxMjMgMCAzNCAxMnQyIDM4cS01IDEzIC05LjUgMzAuNXQtOS41IDM0LjVxLTUgMTkgLTExIDM5aC0zNjh6TTMzNiA0OTh2MjI4cTAgMTEgMi41IDIzdDEwIDIxLjV0MjAuNSAxNS41dDM0IDZoMTg4cTMxIDAgNTEuNSAtMTQuNXQyMC41IC01Mi41di0yMjdoLTMyN3oiIC8+CiAgICAKCiAgICAKICAgIDxnbHlwaCBnbHlwaC1uYW1lPSJmb2xkZXItb3Blbi1vIiB1bmljb2RlPSImIzU5MDExOyIgZD0iTTEwMTcuNzE0Mjg2IDM2NHEwIDIwLTMwLjI4NTcxNSAyMEgzNjUuNzE0Mjg2cS0yMi44NTcxNDMgMC00OC44NTcxNDMtMTIuMjg1NzE0VDI3NiAzNDEuNzE0Mjg2bC0xNjgtMjA3LjQyODU3MnEtMTAuMjg1NzE0LTEzLjcxNDI4Ni0xMC4yODU3MTQtMjIuODU3MTQzIDAtMjAgMzAuMjg1NzE0LTIwaDYyMS43MTQyODZxMjIuODU3MTQzIDAgNDkuMTQyODU3IDEyLjU3MTQyOXQ0MC41NzE0MjggMzAuMjg1NzE0bDE2OCAyMDcuNDI4NTcycTEwLjI4NTcxNCAxMi41NzE0MjkgMTAuMjg1NzE1IDIyLjI4NTcxNHpNMzY1LjcxNDI4NiA0NTcuMTQyODU3aDQzOC44NTcxNDNWNTQ4LjU3MTQyOXEwIDIyLjg1NzE0My0xNiAzOC44NTcxNDJ0LTM4Ljg1NzE0MyAxNkg0MjAuNTcxNDI5cS0yMi44NTcxNDMgMC0zOC44NTcxNDMgMTZ0LTE2IDM4Ljg1NzE0M3YzNi41NzE0MjlxMCAyMi44NTcxNDMtMTYgMzguODU3MTQzdC0zOC44NTcxNDMgMTZIMTI4cS0yMi44NTcxNDMgMC0zOC44NTcxNDMtMTZ0LTE2LTM4Ljg1NzE0M3YtNDg3LjQyODU3MmwxNDYuMjg1NzE0IDE4MHEyNS4xNDI4NTcgMzAuMjg1NzE0IDY2LjI4NTcxNSA1MFQzNjUuNzE0Mjg2IDQ1Ny4xNDI4NTd6IG03MjUuMTQyODU3LTkzLjE0Mjg1N3EwLTM1LjQyODU3MS0yNi4yODU3MTQtNjguNTcxNDI5bC0xNjguNTcxNDI5LTIwNy40Mjg1NzFxLTI0LjU3MTQyOS0zMC4yODU3MTQtNjYuMjg1NzE0LTUwdC04MC0xOS43MTQyODZIMTI4cS01Mi41NzE0MjkgMC05MC4yODU3MTQgMzcuNzE0Mjg2VDAgMTQ2LjI4NTcxNFY2OTQuODU3MTQzcTAgNTIuNTcxNDI5IDM3LjcxNDI4NiA5MC4yODU3MTR0OTAuMjg1NzE0IDM3LjcxNDI4NmgxODIuODU3MTQzcTUyLjU3MTQyOSAwIDkwLjI4NTcxNC0zNy43MTQyODZ0MzcuNzE0Mjg2LTkwLjI4NTcxNHYtMTguMjg1NzE0aDMxMC44NTcxNDNxNTIuNTcxNDI5IDAgOTAuMjg1NzE0LTM3LjcxNDI4NnQzNy43MTQyODYtOTAuMjg1NzE0di05MS40Mjg1NzJoMTA5LjcxNDI4NXEzMC44NTcxNDMgMCA1Ni41NzE0MjktMTR0MzguMjg1NzE0LTQwLjI4NTcxNHE4LjU3MTQyOS0xOC4yODU3MTQgOC41NzE0MjktMzguODU3MTQzeiIgIGhvcml6LWFkdi14PSIxMDk3IiAvPgoKICAgIAogICAgPGdseXBoIGdseXBoLW5hbWU9ImRvbmUiIHVuaWNvZGU9IiYjNTg5NzA7IiBkPSJNMzg0IDIwNC44TDIwNC44IDM4NGwtNTkuNzMzMzMzLTU5LjczMzMzM0wzODQgODUuMzMzMzMzIDg5NiA1OTcuMzMzMzMzbC01OS43MzMzMzMgNTkuNzMzMzM0eiIgIGhvcml6LWFkdi14PSIxMDI0IiAvPgoKICAgIAoKCiAgPC9mb250Pgo8L2RlZnM+PC9zdmc+Cg==?t=1524818269295#iconfont') format('svg'); /* iOS 4.1- */
    }

    .iconfont {
        font-family:"iconfont" !important;
        font-size:16px;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-uploader-open:before { content: "\e683"; }
    .icon-uploader-done:before { content: "\e65a"; }
</style>