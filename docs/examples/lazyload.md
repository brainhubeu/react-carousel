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
        lazyLoad
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
          (<img src={'http://rndimg.com/ImageStore/OilPaintingBlue/400x300_OilPaintingBlue_e5da36b84b744f0cb34d9a2af0f16eb9.jpg'} />),
          (<img src={'http://rndimg.com/ImageStore/OilPaintingGreen/400x300_OilPaintingGreen_a8faa36968fd4281a5fa9fe25838a419.jpg'} />),
          (<img src={'http://rndimg.com/ImageStore/OilPaintingOrange/400x300_OilPaintingOrange_343378d437ff4249bd921f8d13a6e570.jpg'} />),
          (<img src={'http://rndimg.com/ImageStore/OilPaintingRed/400x300_OilPaintingRed_711f45d1c05f44c3b40c591a09ce90b4.jpg'} />),
          (<img src={'http://rndimg.com/ImageStore/OilPaintingBlueReal/400x300_OilPaintingBlueReal_59c8f5b4112947b1942dbb8f171cd668.jpg'} />),
          (<img src={'http://rndimg.com/ImageStore/OilPaintingGreenReal/400x300_OilPaintingGreenReal_733e1f2644584c4fbb8b0592b6d6da2e.jpg'} />),
          (<img src={'http://rndimg.com/ImageStore/OilPaintingOrangeReal/400x300_OilPaintingOrangeReal_6b9780c693cb44ef835df60a67b4c2b7.jpg'} />),
          (<img src={'http://rndimg.com/ImageStore/OilPaintingRedReal/400x300_OilPaintingRedReal_7bba436bea9247e8b0196061dd776c7c.jpg'} />),
        ]}
      />
    </div>
    );
  }
}
```
