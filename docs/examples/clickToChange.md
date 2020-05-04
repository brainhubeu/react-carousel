## Click to change
By default, clicking the slides does nothing. You can change that behavior with clickToChange prop. 
```jsx render
<Carousel
  clickToChange
  slidesPerPage={2}
  centered
>
 <img src={imageOne} />
 <img src={imageTwo} />
 <img src={imageThree} />
</Carousel>
```

### Apple iOS
The carousel items should not be associated with the CSS
property `justify-content: center;`. This property causes
wrong justification on iOS.
