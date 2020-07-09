## Container wrapper
You can surround the Carousel by a container, which can be resized
independently of the window. You should only make sure,
that the container doesn't exceed the viewport.
```jsx render
class MyCarousel extends React.Component {

  resizeSurrounding() {
    const width = document.querySelector('#width').value;
    document.querySelector('#surrounding').style.width = `${width}px`;
  }

  render() {
    return (
    <div>
      <label for="width">Width (px) </label>
      <input type="number" id="width" onChange={this.resizeSurrounding}/>
      <div id="surrounding">
        <Carousel
          plugins={[
            'centered',
            'infinite',
            'arrows'
          ]}
        >
          <img src={imageOne} />
          <img src={imageTwo} />
          <img src={imageThree} />
        </Carousel>
      </div>
    </div>
    );
  }

}
```
