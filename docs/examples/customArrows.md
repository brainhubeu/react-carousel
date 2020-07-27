## Custom arrows
You can set custom arrows, using `arrowLeft` and arrowRight options in the `arrows` plugin. You can set custom arrows for the disabled state of `arrowLeft` and `arrowRight`, using `arrrowLeftDisabled` and `arrowRightDisabled` options. You can handle an arrow click event by yourself, or you can tell Carousel to do that for you (using `addArrowClickHandler` option).
```jsx render
// import Carousel, { arrowsPlugin } from '@brainhubeu/react-carousel';
// import Icon from 'react-fa';

// import '@brainhubeu/react-carousel/lib/style.css';

<Carousel
    plugins={[
      {
        resolve: arrowsPlugin,
        options: {
          arrowLeft: <button><Icon name="angle-double-left" /></button>,
          arrowLeftDisabled:<button><Icon name="angle-left" /></button>,
          arrowRight: <button><Icon name="angle-double-right" /></button>,
          arrowRightDisabled: <button><Icon name="angle-right" /></button>,
          addArrowClickHandler: true,
        }
      }
    ]}
    
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
