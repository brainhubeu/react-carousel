## Centered
By default, the current slide is aligned to the left. You can change that behaviour with centered prop.
```jsx render
<Carousel
    plugins={[
    {
      resolve: centeredPlugin,
    },
    {
      resolve: infinitePlugin,
      options: {
        numberOfInfiniteClones: 3,
      },
    },
    {
      resolve: slidesPerPagePlugin,
      options: {
       numberOfSlides: 2,
      },
    }
  ]}   
  arrows
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
