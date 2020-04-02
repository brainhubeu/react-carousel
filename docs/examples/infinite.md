## Infinite
```jsx render
<Carousel
  plugins={[
    {
      resolve: infinitePlugin,
      options: {
        numberOfInfiniteClones: 3,
      },
  }]}  arrows
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
