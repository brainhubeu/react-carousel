## Multiple items
You can show more than one item per page, using slidesPerPage prop.
```jsx render
<Carousel
  plugins={[
    {
      resolve: slidesPerPagePlugin,
      options: {
       numberOfSlides: 2
      }
  }]}
  arrows
  infinite
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
