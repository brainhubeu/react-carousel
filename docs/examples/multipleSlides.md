## Multiple slides
You can show more than one slide per page, using slidesToShow plugin.
```jsx render
// import { slidesToShowPlugin } from '@brainhubeu/react-carousel';

<Carousel
  plugins={[
    'infinite',
    'arrows',
    {
      resolve: slidesToShowPlugin,
      options: {
       numberOfSlides: 2
      }
    },
  ]}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
