## Responsive
You can set all props and plugins to different values on different screen resolutions. The props set will override the existing prop (if already set).

```jsx render
// import Carousel, { slidesToShowPlugin } from '@brainhubeu/react-carousel';
// import '@brainhubeu/react-carousel/lib/style.css';

<Carousel
  plugins={[
    'arrows',
    {
      resolve: slidesToShowPlugin,
      options: {
       numberOfSlides: 3
      }
    },
  ]}
  breakpoints={{
    640: {
      plugins: [
       {
         resolve: slidesToShowPlugin,
         options: {
          numberOfSlides: 1
         }
       },
     ]
    },
    900: {
      plugins: [
       {
         resolve: slidesToShowPlugin,
         options: {
          numberOfSlides: 2
         }
       },
     ]
    }
  }}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
