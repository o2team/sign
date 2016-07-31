// filter
Vue.filter('formatTelNo', function(val) {
    if (val) {
        if (val.indexOf('-') !== -1) return val;
        var arr = val.split('');
        var resArr = [];
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            resArr.push(arr[i]);
            if ((i === 2 || ((i - 2) % 4 === 0)) && i !== (len - 1)) {
                resArr.push('-');
            }
        }
        return resArr.join('');
    }
});
Vue.filter('formatOfficeNo', function(val) {
    if (val) {
        if (val.indexOf('-') !== -1) return val;
        var num = val ? val : '1234';
        return '0755-32995555-' + num;
    }
});

Vue.filter('formatColor',{ // 格式化颜色值，允许#RRGGBB、#RGB形式
    read: function(value){
        return value.toUpperCase();
    },
    write: function(value,OldVal){
        if(/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value)){
           var len = value.length;
           var newValue = '';
           if(len == 4) {
              var tmp = value.split('').splice(1);
              newValue = tmp.map(function(item){
                return item + item; 
              });
              return '#' + newValue.join('').toUpperCase();
           }
           return value.toUpperCase();
        }else {
            return value;
        }
    }
});

// directive
Vue.directive('validate', {
    update: function(value){
        if(value.hasOwnProperty('color')){ //检测颜色值是否有效
            var thisEl = this.el;
            if(!/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value.color)){
                thisEl.classList.add('error');
            }else {
                if(thisEl.classList.contains('error')){
                    thisEl.classList.remove('error');
                }
            }
        }
    }
})

// instance
var sign = new Vue({
    el: '#app',
    data: {
        info: {
            e_name: '',
            c_name: '',
            group: '',
            contact: {
                qq: '',
                wechat: '',
                call: '',
                mobile: ''
            }
        },
        style: {
            logo: '',
            co_title: '#000000',
            co_item: '#999999',
            co_icon: '#648fe7',
            co_bg:'#eeeeee',
            co_line: '#000050'
        },
        cropper: null,
        flag: {
            isPC: false,
            showBowserUnsupport: false,
            needLoadSign: false,
            showColorSetting: false,
            imgHasLoad: false,
            cropperHasInit: false,
            previewHasCreate: false
        },
        img: null,
        helper: {
            support: !!(window.FileReader && window.CanvasRenderingContext2D && (window.URL || window.webkitURL)),
            isImage: function(type) {
                var filter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
                return !!(filter.test(type));
            }
        }
    },
    ready: function() {
        this.checkIfPC();
        this.checkIfChrome();
        this.bindLoadImgEvent();
    },
    methods: {
        checkIfPC: function(){
            var thisObj = this;
            var t = null;
            var func = function(){
                thisObj.flag.isPC = screen.width<=600?true:false;
                return;
            };
            func();
            window.addEventListener('resize',function(){
                if(t) { clearTimeout(t);}
                t = setTimeout(func,300);
            });
        },
        resetColors: function(){ // 重置配色
            var thisObj = this;
             thisObj.style = {
                co_title: '#000000',
                co_item: '#999999',
                co_icon: '#648fe7',
                co_bg:'#eeeeee',
                co_line: '#000050'
             }
        },
        checkIfChrome: function(){// 检测是否为chrome浏览器，如果不是，则不支持配色设置
            var thisObj = this;
            var reg_Chrome = /chrome\/[\d.]+/gi;
            var bowser = navigator.userAgent.match(reg_Chrome);
            if(bowser){
                var ver = (bowser+'').replace(/[^0-9.]/ig,'').split('.')[0];
                if(parseInt(ver,10) >= 49) {
                    thisObj.flag.showBowserUnsupport = false;
                    return ;
                }
            }
            thisObj.flag.showBowserUnsupport = true;
        },
        bindLoadImgEvent: function() { //绑定监听事件
            var thisObj = this;
            if (!thisObj.helper.support) return;
            var uploadPreview = document.getElementById('uploadPreview');
            var uploadImages = document.querySelectorAll('.J_uploadImage');
            var reader = new FileReader();
            var URL = window.URL || window.webkitURL;
            var blobURL;
            var len = uploadImages.length;
            for(var i =0;i<len;i++) {
                uploadImages[i].addEventListener('change', function() {
                    var files = this.files;
                    if (files.length === 0) return;
                    var file = files[0];
                    if (!thisObj.helper.isImage(file.type)) {
                        alert('you have to select an image file!');
                        return;
                    }
                    reader.readAsDataURL(file);
                    blobURL = URL.createObjectURL(file);
                    if (thisObj.cropper) {
                        thisObj.cropper.reset();
                    }
                    thisObj.flag.imgHasLoad = true;
                    thisObj.img = this.dataset.dest;
                });
            }
            
            reader.onload = function(e) {
                uploadPreview.src = e.target.result;
                if (!thisObj.flag.cropperHasInit) {
                    thisObj.loadCropper();
                    return;
                }
                thisObj.cropper.replace(blobURL);
            }
        },
        loadCropper: function() { //加载裁剪工具
            var thisObj = this;
            var image = document.querySelector('#cropperBox > img');
            var preview = document.getElementById('cropperRes');
            var previewImage = preview.getElementsByTagName('img').item(0);
            var option = {
                aspectRatio: 1 / 1,
                build: function() {
                    previewImage.src = image.src;
                },
                crop: function(data) {
                    var cropper = this.cropper;
                    var imageData = cropper.getImageData();
                    var previewAspectRatio = data.width / data.height;

                    var previewWidth = preview.offsetWidth;
                    var previewHeight = previewWidth / previewAspectRatio;
                    var imageScaledRatio = data.width / previewWidth;

                    preview.style.height = previewHeight + 'px';
                    previewImage.style.width = imageData.naturalWidth / imageScaledRatio + 'px';
                    previewImage.style.height = imageData.naturalHeight / imageScaledRatio + 'px';
                    previewImage.style.marginLeft = -data.x / imageScaledRatio + 'px';
                    previewImage.style.marginTop = -data.y / imageScaledRatio + 'px';
                }
            };
            thisObj.cropper = new Cropper(image, option);
            thisObj.flag.cropperHasInit = true;
        },
        finishCropImage: function() {//完成裁剪，并输出裁剪结果
            var thisObj = this;
            var croppedCanvas = thisObj.cropper.getCroppedCanvas({
                width: 200,
                height: 200
            });
            var imgDataUrl = croppedCanvas.toDataURL();
            var where = '.o2_sign .' + thisObj.img + ' img';
            document.querySelector(where).src = imgDataUrl;
            thisObj.flag.imgHasLoad = false;
        },
        downloadRes: function() {// 利用DomToImage库输出签名图
            var thisObj = this;
            var sign = document.getElementById('sign');
            var imgName = this.info.e_name; 
            domtoimage.toBlob(sign).then(function(blob){ 
                window.saveAs(blob,imgName + '.png');
            });
        }
    }
})


