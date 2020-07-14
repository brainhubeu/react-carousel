You can access and modify the following attributes of the carousel. To manage and access react-carousel you need to install [**recoil**](https://recoiljs.org/docs/introduction/getting-started) library

```js
import {
  trackWidthState,
  trackStylesState,
  carouselValueState,
  slideMovementState,
  transitionEnabledState,
  slideOffsetState,
  slidesState,
  slideWidthState,
  activeSlideIndexState,
  transformOffsetSelector,
  nearestSlideSelector,
  getCurrentValueSelector,
} from '@brainhubeu/react-carousel';
```

example usage
```js
import { useRecoilState } from 'recoil';

const customPlugin = () => ({
  plugin: () => {
    const [trackStyles, setTrackStyles] = useRecoilState(trackStylesState);

      useEffect(() => {
        setTrackStyles({
          ...trackStyles,
          marginLeft: myCustomFuncToModifyMargin(),
        });
      }, [carouselProps.value]);
  },
})
```

* ```trackWidthState: Number```: Width of the track container.

* ```trackStylesState: Object```: Styles applied to the track container.

* ```carouselValueState: Number```: Active carousel slide index.

* ```slideMovementState: Object```: Used to calculate active slide.

```js
  key: '@brainhubeu/react-carousel/slideMovementState',
  default: {
    clicked: null, // index of the clicked slide
    dragStart: 0, // X position of drag event start
    dragEnd: 0, // X position of drag event end
    dragOffset: 0, // Distance of the drag
  }
```

* ```transitionEnabledState: Bool```: Decides whether slide transition animation should be turned on.

* ```slideOffsetState: Number```: Distance in px between slides.

* ```slidesState: Node[]```: Carousel slides.

* ```slideWidthState: Number```: Slide width in px.

* ```activeSlideIndexState: Number```: Active carousel slide index. Used in infinite plugin.

* ```transformOffsetSelector: Number```: Calculates offset in pixels to be applied to Track element in order to show current slide correctly.

* ```nearestSlideSelector: Number```: Checks what slide index is the nearest to the current position (to calculate the result of dragging the slider).

* ```getCurrentValueSelector: Number```: Selector which uses strategies to calculate the current carousel value.



