## plugins

### slidesToShow plugin

options:
* ```numberOfSlides: Number```: Number of slides visible at once.

usage:
```jsx
<Carousel
  plugins={[
    {
      resolve: slidesToShowPlugin,
      options: {
       numberOfSlides: 2
      }
    },
  ]}
>
  {/ *carousel items... */}
</Carousel>
```

<br/><br/>

### slidesToScroll plugin

options:
* ```numberOfSlides: Number```: Number by which value will change on scroll (autoPlay, arrow click, drag).

usage:
```jsx
<Carousel
  plugins={[
    {
      resolve: slidesToScrollPlugin,
      options: {
       numberOfSlides: 2
      }
    },
  ]}
>
  {/ *carousel items... */}
</Carousel>
```

<br/><br/>

### arrows plugin

options:
* ```arrowLeft: React element```, ```arrowLeftDisabled: React element```, ```arrowRightDisabled: React element```, ```arrowRight: React element```: React elements to be used instead of default arrows.

* ```addArrowClickHandler: Boolean``` Has to be added for arrowLeft and arrowRight to work.

simple usage:
```jsx
<Carousel
  plugins={['arrows']}
>
  {/ *carousel items... */}
</Carousel>
```

advanced usage:
```jsx
<Carousel
  plugins={[
    {
      resolve: arrowsPlugin,
      options: {
        arrowLeft: <button><Icon name="angle-double-left" /></button>,
        arrowLeftDisabled:<button><Icon name="angle-left" /></button>,
        arrowRight: <button><Icon name="angle-double-right" /></button>,
        arrowRightDisabled: <button><Icon name="angle-right" /></button>,
        addArrowClickHandler: true,
      }
    }
  ]}
>
  {/ *carousel items... */}
</Carousel>
```

<br/><br/>

### autoplay plugin

options:
* ```interval: Number```: Slide change interval in milliseconds. Defaults to 2000

* ```stopAutoPlayOnHover: Boolean```: Determines if autoPlay should stop when mouse hover over carousel, defaults to `true`

* ```direction: 'right' | 'left'```: Determines direction of changing slides, defaults to `right`

simple usage:
```jsx
<Carousel
  plugins={['autoplay']}   
>
  {/ *carousel items... */}
</Carousel>
```

advanced usage:
```jsx
<Carousel
    plugins={[
    {
      resolve: autoplayPlugin,
      options: {
        interval: 2000,
      }
    },
  ]}   
  animationSpeed={1000}
>
  {/ *carousel items... */}
</Carousel>
```

<br/><br/>

### clickToChange plugin
Clicking on a slide changes current slide to the clicked one.

usage:
```jsx
<Carousel
  plugins={['clickToChange']}   
>
  {/ *carousel items... */}
</Carousel>
```

<br/><br/>

### centered plugin
Alignes active slide to the center of the carousel.

usage:
```jsx
<Carousel
  plugins={['centered']}   
>
  {/ *carousel items... */}
</Carousel>
```

<br/><br/>

### infinite plugin
Creates an infinite carousel width.

options:
* ```numberOfInfiniteClones: Number```: Number of clones created before and after original carousel slides. Defaults to 1

usage:
```jsx
<Carousel
  plugins={['infinite']}   
>
  {/ *carousel items... */}
</Carousel>
```

advanced usage:
```jsx
<Carousel
  plugins={[
    {
      resolve: infinitePlugin,
      options: {
        numberOfInfiniteClones: 3,
      },
    },
  ]}
>
  {/ *carousel items... */}
</Carousel>
```

<br/><br/>

### fastSwipe plugin
While dragging, it doesn't matter which slide is the nearest one, but in what direction you drag.

usage:
```jsx
<Carousel
  plugins={['fastSwipe']}   
>
  {/ *carousel items... */}
</Carousel>
```
