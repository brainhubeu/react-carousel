## Slides to scroll
You can change how far the carousel should move when you click arrow or swipe, using the `slidesToScroll` plugin. The default value is 3.
```jsx render
// import Carousel, { slidesToShowPlugin, slidesToScrollPlugin } from '@brainhubeu/react-carousel';
// import '@brainhubeu/react-carousel/lib/style.css';

<Carousel
  plugins={[
     'centered',
     'infinite',
     'arrows',
    {
      resolve: slidesToShowPlugin,
      options: {
       numberOfSlides: 2,
      },
    },
    {
      resolve: slidesToScrollPlugin,
      options: {
       numberOfSlides: 2,
      },
    },
  ]}   
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
