## Container wrapper
You can surround the Carousel by a container, which can be resized
independently of the window. You should only make sure,
that the container doesn't exceed the viewport.
```jsx render
class MyCarousel extends React.Component {

  resizeSurrounding() {
    const width = document.querySelector('#width').value;
    document.querySelector('#surrounding').style.width = width;
  }

  render() {
    return (
    <div id="surrounding">
      <input type="text" id="width"/>
      <button onClick={this.resizeSurrounding}>Set width</button>
      <Carousel
        centered
        infinite
        arrows
        slidesPerPage={1}>

        <img src={imageOne} />
        <img src={imageTwo} />
        <img src={imageThree} />
      </Carousel>
    </div>
    );
  }

}
```
