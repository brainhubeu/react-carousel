## Responsive
You can set all props (except value, onChange, responsive, children) to different values on different screen resolutions. The props set will override the existing prop (if already set).

```jsx render
<Carousel
  slidesPerPage={3}
  arrows
  breakpoints={{
    640: {
      slidesPerPage: 1,
      arrows: false
    },
    768: {
      slidesPerPage: 2,
      arrows: false
    }
  }}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
