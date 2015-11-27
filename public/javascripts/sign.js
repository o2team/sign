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
				call :'',
				mobile : ''
			}
		},
		cropper: null,
		flag: {
			imgHasLoad : false,
			cropperHasInit : false,
			previewHasCreate : false
		},
		helper: {
			support: !!(window.FileReader && window.CanvasRenderingContext2D && ( window.URL || window.webkitURL )),
			isImage : function(type) {
			    var filter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
			    return !!(filter.test(type));
			},
			each : function(arr, callback) {
				    var length = arr.length;
				    var i;
				for (i = 0; i < length; i++) {
				       callback.call(arr, arr[i], i, arr);
				    }
				    return arr;    
				}
		}
	  },
	  ready : function(){
	  	this.bindLoadImgEvent();
	  },
	  methods: {
	  	loadCropper : function() {
	  		var thisObj = this;
	  		var image = document.querySelector('#cropperBox > img');
	  		var preview = document.getElementById('cropperRes');
			var previewImage = preview.getElementsByTagName('img').item(0);
	  		var option = {
	  			aspectRatio: 1/1,
	  		    build: function () {
		  			previewImage.src = image.src;
	  		    },
	  		    crop: function (data) {
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
	  	bindLoadImgEvent: function() {
	  		var thisObj = this;
	  		if(!thisObj.helper.support) return;
	  		var uploadPreview = document.getElementById('uploadPreview');
	  		var uploadImage = document.getElementById('uploadImage');
	  		var reader = new FileReader();
			var URL = window.URL || window.webkitURL;
			var blobURL;
	  		uploadImage.addEventListener('change',function(){
	  			var files = this.files;
	  			if(files.length === 0) return;
	  			var file = files[0];
	  			if (!thisObj.helper.isImage(file.type)) { alert('you have to select an image file!'); return; }
	  			reader.readAsDataURL(file);
	  			blobURL = URL.createObjectURL(file);
	  			if (thisObj.cropper) { thisObj.cropper.reset();}
	  			thisObj.flag.imgHasLoad = true;
	  			uploadImage.value = null;
	  		});
	  		reader.onload = function(e) {
	  			uploadPreview.src = e.target.result;
	  			if(!thisObj.flag.cropperHasInit) { thisObj.loadCropper();return; }
	  			thisObj.cropper.replace(blobURL);
	  		}
	  	},
	  	downloadRes: function() {
	  		var sign = document.getElementById('sign');
	  		var imgName = this.info.e_name;
	  	    domtoimage.toBlob(sign)
	  	    .then(function (blob) {
	  	        window.saveAs(blob, imgName + '.png');
	  	    });
	  	},
	  	finishCropImage: function(){
	  		var thisObj = this;
	  		var croppedCanvas = thisObj.cropper.getCroppedCanvas({width: 200,height: 200});
	  		var imgDataUrl = croppedCanvas.toDataURL();
	  		document.querySelector('.o2_sign .img img').src = imgDataUrl;
	  		thisObj.flag.imgHasLoad = false;
	  	}
	  }
	})

	
	// filter
	Vue.filter('formatTelNo',function(value){

		if (value) {
			if(value.indexOf('-') !== -1) return value;
			var arr = value.split('');
			var resArr = [];
			var len = arr.length;
			for(var i = 0; i < len; i++ ){
				resArr.push(arr[i]);
				if((i===2||((i-2)%4===0)) && i!==(len-1)) { resArr.push('-');}
			}
			return resArr.join('');
		}
	});
	Vue.filter('formatOfficeNo',function(value){
		if (value) {
			if(value.indexOf('-') !== -1) return value;
			var num = value ? value : '1234';
			return '0755-3299-'+num;
		}
	});