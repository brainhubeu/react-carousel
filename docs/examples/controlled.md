## Controlled component
You can use Carousel as a controlled component. Provided value will be clamped depending on the number of slides. E.g. if there are 3 slides, all values greater than 2 (index of the last element) will evaluate to 2.
```jsx render
// import Carousel from '@brainhubeu/react-carousel';
// import '@brainhubeu/react-carousel/lib/style.css';

class MyCarousel extends React.Component {
  constructor() {
    super()
    this.state = { value: 0 };
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({ value });
  }

  render() {
    return (
    <div>
      <input
        type="number"
        value={this.state.value}
        onChange={e => this.onChange(parseInt(e.target.value || 0))}
      />
      <Carousel
        value={this.state.value}
        onChange={this.onChange}
        slides={[
          (<img src={imageOne} />),
          (<img src={imageTwo} />),
          (<img src={imageThree} />),
        ]}
        plugins={[
          'arrows',
          'clickToChange'
        ]}
      />
    </div>
    );
  }
}
```
