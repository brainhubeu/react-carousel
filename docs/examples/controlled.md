## Thumbnails
You can use Carousel as controlled component
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
      <Carousel
        value={this.state.value}
        onChange={this.onChange}
        slides={[
          (<img src={imageOne} />),
          (<img src={imageTwo} />),
          (<img src={imageThree} />),
        ]}
        arrow
        clickToChange
      />
    </div>
    );
  }
}
```
