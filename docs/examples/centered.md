## Centered
By default, the current slide is aligned to the left. You can change that behaviour with centered plugin.
```jsx render
// import { slidesToShowPlugin } from '@brainhubeu/react-carousel';

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
  ]}   
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
