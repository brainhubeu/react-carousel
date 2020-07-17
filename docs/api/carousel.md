## Carousel component props

* ```plugins: Func[]|String[]```: An array of plugins which will modify and extend carousel behavior. More details [**here**](https://brainhubeu.github.io/react-carousel/docs/plugins/plugins)

* ```value: Number```: Current slide's index (zero based, depends on the elements order).

* ```onChange: Function```: Handler triggered when current slide is about to change (e.g. on arrow click or on swipe).

* ```slides: Array``` Alternative way to pass slides. This prop expects an array of JSX \<img\> elements.

* ```itemWidth: Number```: Determines custom width for every slide in the carousel.

* ```offset: Number```: Padding between items.

* ```animationSpeed: Number``` Determines transition duration in milliseconds.

* ```draggable: Boolean``` Makes it possible to drag to the next slide with mouse cursor.

* ```breakpoints: Object``` All props can be set to different values on different screen resolutions

* ```lazyLoad: Boolean``` Initially, it loads only the closest next / previous slide to the current one based on the value of the slidesPerPage variable. Other slides are loaded as needed.

* ```lazyLoader: React node``` To be used instead of the default loader

* ```onInit: Function``` Callback thrown after the carousel is loaded

## Default Properties:
 
- ```offset: 0```
- ```animationSpeed: 500```
- ```draggable: true```
