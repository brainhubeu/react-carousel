## Lazy load slides
Loads only the nearest next/prev slides to the current one based on the value of the slidesPerPage variable. Check network tab, to see that images are preloaded on demand.
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
      <input
        type="number"
        value={this.state.value}
        onChange={e => this.onChange(parseInt(e.target.value || 0))}
      />
      <Carousel
        value={this.state.value}
        onChange={this.onChange}
        arrows
        slidesPerScroll={2}
        slidesPerPage={2}
        infinite
        breakpoints={{
          415: {
            slidesPerScroll: 1,
            slidesPerPage: 1,
          },
        }}
        slides={[
          (<img src={imageOne} />),
          (<img src={imageTwo} />),
          (<img src={imageThree} />),
          (<img src={'https://randomwordgenerator.com/img/picture-generator/53e2d245424faa0df7c5d57bc32f3e7b1d3ac3e45659764e742a7cdd95_640.jpg'} />),
          (<img src={'https://randomwordgenerator.com/img/picture-generator/54e3d04b4951af14f1dc8460962e33791c3ad6e04e50744172287ad29448c7_640.jpg'} />),
          (<img src={'https://randomwordgenerator.com/img/picture-generator/52e6d6454c5bac14f1dc8460962e33791c3ad6e04e5074417c2d78dc974ec4_640.jpg'} />),
          (<img src={'https://randomwordgenerator.com/img/picture-generator/53e0d74b4250ad14f1dc8460962e33791c3ad6e04e50744172277fd09549cd_640.jpg'} />),
          (<img src={'https://randomwordgenerator.com/img/picture-generator/54e1d3434a57a514f1dc8460962e33791c3ad6e04e50744172277ed79044cd_640.jpg'} />),
          (<img src={'https://randomwordgenerator.com/img/picture-generator/53e2d6414255af14f1dc8460962e33791c3ad6e04e50744075277cd39e48c3_640.jpg'} />),
          (<img src={'https://randomwordgenerator.com/img/picture-generator/55e3d14a4f5aa414f1dc8460962e33791c3ad6e04e50744172287cd09f4cc4_640.jpg'} />),
          (<img src={'https://randomwordgenerator.com/img/picture-generator/57e8d1404856ad14f1dc8460962e33791c3ad6e04e50744172297cdc924cc3_640.jpg'} />),
        ]}
      />
    </div>
    );
  }
}
```
