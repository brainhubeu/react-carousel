## Custom arrows
You can set custom arrows using arrowLeft and arrowRight props.
```jsx render
// import Icon from 'react-fa';

<div>
  <Carousel
      arrowLeft={<Icon name="angle-double-left" />}
      arrowRight={<Icon name="angle-double-right" />}
      addArrowClickHandler
  >
    <img src={imageOne} />
    <img src={imageTwo} />
    <img src={imageThree} />
  </Carousel>
</div>
```
