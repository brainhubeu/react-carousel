## Multiple items
Carousel is draggable by default. You can disable this option by setting draggable={false} and change it's behaviour with option keepDirectionWhenDragging.
```jsx render
<Carousel
  slidesPerPage={2}
  infinite
  keepDirectionWhenDragging
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
