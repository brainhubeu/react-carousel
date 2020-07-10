## Thumbnails
You can use Dots component to show thumbnails.
```jsx render
// import Carousel from '@brainhubeu/react-carousel';
// import '@brainhubeu/react-carousel/lib/style.css';

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
      thumbnails: [
        (<img src={thumbnailOne} />),
        (<img src={thumbnailTwo} />),
        (<img src={thumbnailThree} />),
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
      />
      <Dots number={this.state.thumbnails.length} thumbnails={this.state.thumbnails} value={this.state.value} onChange={this.onchange} number={this.state.slides.length} />
    </div>
    );
  }
}
```
