## Flex Container

You can use a Carousel within a flex container
```jsx render

<div style={{ display: 'flex', justifyContent: 'center', flexFlow: 'column', alignContent: 'center', textAlign: 'center' }}>
    <Carousel>
        <img src={imageOne} />
        <img src={imageTwo} />
        <img src={imageThree} />
    </Carousel>
    <div>
        Lorem Ipsum
    </div>
</div>
```
