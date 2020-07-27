## Autoplay & Animation speed
You can set how often slides will change automatically using the `autoPlay` plugin and interval option. Animation speed can also be changed, using animationSpeed prop (which is actually animation duration in ms).
```jsx render
// import Carousel, { autoplayPlugin } from '@brainhubeu/react-carousel';
// import '@brainhubeu/react-carousel/lib/style.css';

<Carousel
    plugins={[
     'infinite',
    {
      resolve: autoplayPlugin,
      options: {
        interval: 2000,
      }
    },
  ]}   
  animationSpeed={1000}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
