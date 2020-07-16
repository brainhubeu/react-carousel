## Flex Container
You can use a Carousel within a flex container
```jsx render
// import Carousel from '@brainhubeu/react-carousel';
// import '@brainhubeu/react-carousel/lib/style.css';

<div style={{ display: 'flex', justifyContent: 'center', flexFlow: 'row', alignContent: 'center', textAlign: 'center' }}>
    <Carousel>
        <img src={imageOne} />
        <img src={imageTwo} />
        <img src={imageThree} />
    </Carousel>
    <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </div>
</div>
```
