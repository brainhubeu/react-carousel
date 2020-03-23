## Infinite
```jsx render
<Carousel
  plugins={[
    'arrows',
    {
      resolve: infinitePlugin,
      options: {
        numberOfInfiniteClones: 3,
      },
    },
  ]}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
