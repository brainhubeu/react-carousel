## Carousel component props

* ```value: Number```: Current slide's index (zero based, depends on the elements order).

* ```onChange: Function```: Handler triggered when current slide is about to change (e.g. on arrow click or on swipe).

* ```slides: Array``` Alternative way to pass slides. This prop expects an array of JSX \<img\> elements.

* ```slidesPerPage: Number```: Number of slides visible at once.

* ```slidesPerScroll: Number```: Number by which value will change on scroll (autoPlay, arrow click, drag).

* ```stickyEdges: Boolean```: Indicating if the carousel should stick the first and last slides to the edges or not.

* ```itemWidth: Number```: Determines custom width for every slide in the carousel.

* ```offset: Number```: Padding between items.

* ```arrows: Boolean```: Renders default arrows.

* ```arrowLeft: React element```, ```arrowRight: React element```: React elements to be used instead of default arrows (if you provide these custom arrows, you don't have to use ```arrows``` prop).

* ```addArrowClickHandler: Boolean``` Has to be added for arrowLeft and arrowRight to work.

* ```autoPlay: Number```: Slide change interval in milliseconds.

* ```stopAutoPlayOnHover: Boolean```: Determines if autoPlay should stop when mouse hover over carousel.

* ```clickToChange: Boolean``` Clicking on a slide changes current slide to the clicked one.

* ```centered: Boolean``` Alignes active slide to the center of the carousel.

* ```infinite: Boolean``` Creates an infinite carousel width.

* ```draggable: Boolean``` Makes it possible to drag to the next slide with mouse cursor.

* ```keepDirectionWhenDragging: Boolean``` While dragging, it doesn't matter which slide is the nearest one, but in what direction you dragged.

* ```animationSpeed: Number``` Determines transition duration in milliseconds.

* ```dots: Boolean``` Renders default dots under the carousel.

* ```minDraggableOffset: Number``` Defines the minimum offset to consider the drag gesture

* ```lazyLoad: Boolean``` Initially, it loads only the closest next / previous slide to the current one based on the value of the slidesPerPage variable. Other slides are loaded as needed.

* ```lazyLoader: React node``` To be used instead of the default loader

* ```onInit: Function``` Callback thrown after the carousel is loaded

## Default Properties:

- ```offset: 0```
- ```slidesPerPage: 1```
- ```slidesPerScroll: 1```
- ```stickyEdges: false```
- ```animationSpeed: 500```
- ```draggable: true```
- ```minDraggableOffset: 10```
