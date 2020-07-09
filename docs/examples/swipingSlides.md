## Swiping slides
You can change the swiping behaviour with fastSwipe plugin, and you can disable swiping by setting props draggable={false}
```jsx render
<Carousel
  plugins={[
    'infinite',
    'fastSwipe',
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
