## Multiple items
Carousel is draggable by default. You can disable this option by setting draggable={false} and change its behaviour with option keepDirectionWhenDragging.
```jsx render
<Carousel
  plugins={[
    'infinite',
    'keepDirectionWhenDragging',
    {
      resolve: slidesPerPagePlugin,
      options: {
       numberOfSlides: 2
      }
    },
  ]}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
