## Autoplay & Animation speed
You can set how often slides will change automatically using autoPlay prop (in ms). Animation speed can also be changed, using animationSpeed prop (which is actually animation duration in ms).
```jsx render
<Carousel
  autoPlay={2000}
  animationSpeed={1000}
  infinite
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
