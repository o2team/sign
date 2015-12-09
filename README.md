#o2 Mail Sign
This is a generator for our team's email signature.

# Installation
First, `git clone` it  . <br>
Then, `npm install` with the command lines.

# Usage
```
# first, Use the follow command to set up the project.
> npm start
# then, visit localhost:3000
```
Besides, you can modify it for your own usage.

## In `sign.scss`, change its style.

> The following part is for the  mail sign's style.
> IMPORTANT: Limited to the [dom-to-image](https://github.com/tsayen/dom-to-image),only base64 dataurl can be used as an logo image.

```scss
/* o2_sign
---------------------------------------- */
$sign_logo: 'data:image/png;base64....';
$sign_logo_bgColor: $c_o2_blue;
$sign_dividingline_bgColor: $c_o2_blue_dark;

.o2_sign {
	display: inline-block;
	position: relative;
	@extend %border_box;
	width: 600px;
	height: 100px;
	padding-left: 200px;
	background-color: $c2;
	...
	
```

## In `sign.js`, improve its function.

>Learning [Vue.js](http://cn.vuejs.org/) make it easy for you to understand how it works.And here's some simple explain.


###loadCroper()

>Initialize the cropper to crop the head picture which is  depends on 
[cropperjs](https://github.com/fengyuanchen/cropperjs)

### bindLoadImgEvent()

> Use the HTML5 File API  to upload the image file.After finish loading the file , it invokes the loadCropper() function.

### finishCropImage()

> When finishing cropped the image, it output the result(base64 dataurl) as the head picture's src.

### downloadRes()

> It depends on [dom-to-image](https://github.com/tsayen/dom-to-image) & [FileSaver](https://github.com/eligrey/FileSaver.js).Use Canvas to output the mail signature and save as an image file.

# Dependencies
- [Vue](http://cn.vuejs.org/)
- [dom-to-image](https://github.com/tsayen/dom-to-image)
- [Filesaver](https://github.com/eligrey/FileSaver.js)
- [cropper](https://github.com/fengyuanchen/cropperjs)

THANKS to the authors.

# License
MIT