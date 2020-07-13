### How to create react-carousel custom plugin

```js
// recoil is a lib for state management.
// More details here: https://recoiljs.org/
import { useRecoilState } from 'recoil';
import { 
  trackStylesState, 
  CAROUSEL_STRATEGIES,
} from '@brainhubeu/react-carousel';

/**
 * This is custom plugin function which allow you to modify carousel look & behavior
 *
 * @param { object } options defined by the carousel user
 * @param { object } carouselProps props defined for the react-carousel component
 * @param { node } ref.trackContainerRef track container red
 * @param { node } ref.carouselRef slide ref
 */
const myGreatPlugin = ({ options , carouselProps, ref }) => ({

  // Here you can apply hooks which can affect carousel behavior
  plugin: () => {
      const [trackStyles, setTrackStyles] = useRecoilState(trackStylesState);


      // modify trackStyle marginleft value when slide value has changed 
      // you can find more info regarding modifying carousel state here:
      // https://beghp.github.io/gh-pages-rc-15/docs/plugins/accessingManagingState
      useEffect(() => {
        setTrackStyles({
          ...trackStyles,
          marginLeft: myCustomFuncToModifyMargin(),
        });
      }, [carouselProps.value]);
  },

  //  Here you can define what element will show up before and after 
  //  carousel items
  beforeCarouselItems: () => <div>humble navigation item</div>,
  afterCarouselItems: () => <div>humble navigation item</div>,

  // Define props which will be attached to .BrainhubCarousel__track
  carouselCustomProps: () => ({
    onMouseEnter: myCustomOnMouseEnterHandler,
    onMouseLeave: myCustomOnMouseLeaveHandler,
  }),

  // Modify react carousel events
  strategies: () => ({
      /**
       * Modify changing slide behavior
       * 
       * @param {number} original carousel value not modified by other plugins
       * @param {number} previous carousel value modified by other plugins
      **/
      [CAROUSEL_STRATEGIES.CHANGE_SLIDE]: (originalValue, previousValue) => {

        // modifies the value returned by the previous plugin by 
        // adding the value defined in the plugin options
        return previousValue + options.slidesToAdvance
      },
      [CAROUSEL_STRATEGIES.GET_TRANSFORM_OFFSET]: (originalValue, previousValue) => {
        return previousValue + doSomeCalc();
      },
      [CAROUSEL_STRATEGIES.GET_NEAREST_SLIDE]: (originalValue, previousValue) => {
        return previousValue + doSomeCalc();
      },
      [CAROUSEL_STRATEGIES.GET_CURRENT_VALUE]: (originalValue, previousValue) => {
        return originalValue + doSomeCalc();
      }
  }),

  // An array of classnames which will be attached to .BrainhubCarouselItem
  itemClassNames: () => ['BrainhubCarouselItem--clickable'],

  // An array of classnames which will be attached to .BrainhubCarousel
  carouselClassNames: () => ['BrainhubCarousel--isRTL']
})
```
