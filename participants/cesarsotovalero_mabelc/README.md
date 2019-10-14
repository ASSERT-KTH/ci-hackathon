# DeepTravis

Neural style transfer is a technique used to produce artistic pictures with Convolutional Neural Networks (CNN).  It takes two images: a style reference image (such as an artwork by a famous painter), and the input image you want to style, and blend them together such that the input image is transformed to look like the content image, but "painted" in the style of the style image.

We use [Neural Style Transfer](https://en.wikipedia.org/wiki/Neural_Style_Transfer) to create a representation of the travis logo based on an image. We trained a VGG-16 convolutional neural network on more than a million images from the ImageNet database. The network is 16 layers deep and trained on millions of images. Because of which it is able to detect high-level features in an image.

This is the result after 1000 iterations: 

![Alt Text](/participants/cesarsotovalero_mabelc/DeepTravis/img/travis.jpg ) | + | ![Alt Text](/participants/cesarsotovalero_mabelc/DeepTravis/img/style.jpg) | = | ![Alt Text](/participants/cesarsotovalero_mabelc/DeepTravis/img/result.gif)

This work is inspired by the [Google Deep Dream project](https://en.wikipedia.org/wiki/DeepDream). 
 

