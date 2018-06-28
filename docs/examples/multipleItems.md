## Multiple items
You can show more than one item per page using slidesPerPage prop.
```jsx render
<div>
  <Carousel
    slidesPerPage={2}
    arrows
    infinite
  >
    <img src={imageOne} />
    <img src={imageTwo} />
    <img src={imageThree} />
  </Carousel>
</div>
```
