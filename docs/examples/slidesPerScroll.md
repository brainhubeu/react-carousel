## Slides per scroll
You can change how far the carousel should move when you click arrow using slidesPerScroll prop. Default value is 1.
```jsx render
<Carousel
  slidesPerScroll={2}
  slidesPerPage={2}
  infinite
  arrows
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
