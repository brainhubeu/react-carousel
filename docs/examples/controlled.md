## Thumbnails
You can use Carousel as controlled component. Provided value will be clamped depending on the number of slides. E.g. if there are 3 slides all values bigger than 2 (index of the last element) will evaluate to 2.
```jsx render
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
      <input value={this.state.value} onChange={e => this.onChange(parseInt(e.target.value || 0))}/>
      <Carousel
        value={this.state.value}
        onChange={this.onChange}
        slides={[
          (<img src={imageOne} />),
          (<img src={imageTwo} />),
          (<img src={imageThree} />),
        ]}
        arrows
        clickToChange
      />
    </div>
    );
  }
}
```
