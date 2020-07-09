## Custom arrows
You can set custom arrows, using arrowLeft and arrowRight options in arrows plugin. You can set custom arrows for the disabled state of arrowLeft and arrowRight, using arrrowLeftDisabled and arrowRightDisabled options. You can handle arrow click event by yourself, or you can tell Carousel to do that for you (using addArrowClickHandler option).
```jsx render
// import Icon from 'react-fa';
<Carousel
    plugins={[
      {
        resolve: arrowsPlugin,
        options: {
          arrowLeft: <Icon name="angle-double-left" />,
          arrowLeftDisabled: <Icon name="angle-left" />,
          arrowRight: <Icon name="angle-double-right" />,
          arrowRightDisabled: <Icon name="angle-right" />,
          addArrowClickHandler: true,
        }
      }
    ]}
    
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```
