## Click to change
By default, clicking the slides does nothing. You can change that behavior with clickToChange plugin. 
```jsx render
// import { slidesToShowPlugin } from '@brainhubeu/react-carousel';

<Carousel
  plugins={[
    'clickToChange',
    'centered',
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
