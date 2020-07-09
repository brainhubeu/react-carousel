## Slides per scroll
You can change how far the carousel should move when you click arrow, using slidesPerScroll prop. The default value is 1.
```jsx render
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
