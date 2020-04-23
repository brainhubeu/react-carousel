## Dots
Dots are a separate component which you can use with controlled carousel as well.
```jsx render
class MyCarousel extends React.Component {
  constructor() {
    super()
    this.state = {
      value: 0,
      slides: [
        (<img src={imageOne} />),
        (<img src={imageTwo} />),
        (<img src={imageThree} />),
      ],
    }
    this.onchange = this.onchange.bind(this);
  }


  onchange(value) {
    this.setState({ value });
  }

  render() {
    return (
    <div>
      <Carousel
        value={this.state.value}
        slides={this.state.slides}
        onChange={this.onchange}
        dots={
          <Dots value={this.state.value} onChange={this.onchange} number={this.state.slides.length} />
        }
      />
      </div>
    );
  }
}
```
