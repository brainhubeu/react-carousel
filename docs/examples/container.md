## Container wrapper
You can surround the Carousel by a container, which can be resized
independently of the window. You should only make sure,
that the container doesn't exceed the viewport.
```jsx render
<div id="surrounding" style={{ width: '400px' }}>
  <Carousel
    centered
    infinite
    arrows
    slidesPerPage={1}>

    <img src={imageOne} />
    <img src={imageTwo} />
    <img src={imageThree} />
  </Carousel>
</div>
```
