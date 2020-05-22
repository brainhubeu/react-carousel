## Click to change
By default, clicking the slides does nothing. You can change that behavior with clickToChange prop. 
```jsx render
<Carousel
  plugins={[
    {
      resolve: slidesPerPagePlugin,
      options: {
       numberOfSlides: 2
      }
    },
    {
      resolve: clickToChangePlugin,
    }
]}
  centered
>
 <img src={imageOne} />
 <img src={imageTwo} />
 <img src={imageThree} />
</Carousel>
```
