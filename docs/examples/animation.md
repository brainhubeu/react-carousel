## Autoplay & Animation speed
You can set how often slides will change automatically using autoPlay prop (in ms). Animation speed can also be changed, using animationSpeed prop (which is actually animation duration in ms).
```jsx render
<Carousel
    plugins={[
    {
      resolve: autoplayPlugin,
      options: {
        autoplay: 2000,
      }
    },
    {
      resolve: infinitePlugin,
      options: {
        numberOfInfiniteClones: 3,
      },
    }
  ]}   
  animationSpeed={1000}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
