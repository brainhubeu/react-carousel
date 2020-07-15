## Migration guide
In the carousel v2 in order to make carousel more maintainable, many props have been replaced with the plugins. In the following section, you can find out how to migrate the carousel v1 props into plugins.

### slidesPerPage

####v1 
```jsx
<Carousel
  slidesPerPage={2}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

####v2
```jsx
import { slidesToShowPlugin } from '@brainhubeu/react-carousel';

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
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

### clickToChange

####v1 
```jsx
<Carousel
  clickToChange
>
 <img src={imageOne} />
 <img src={imageTwo} />
 <img src={imageThree} />
</Carousel>
```

####v2
```jsx
<Carousel
  plugins={[
    'clickToChange',
]}
>
 <img src={imageOne} />
 <img src={imageTwo} />
 <img src={imageThree} />
</Carousel>
```

### arrows

####v1 
```jsx
<Carousel
  arrows
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

####v2
```jsx
<Carousel
  plugins={['arrows']}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

### infinite

####v1 
```jsx
<Carousel
  infinite
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

####v2
```jsx
<Carousel
  plugins={[
    'infinite'
  ]}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```


### rtl

####v1 
```jsx
<Carousel rtl >
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

####v2
```jsx
<Carousel
  plugins={[
    'rtl'
  ]}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

### centered

####v1 
```jsx
<Carousel centered >
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

####v2
```jsx
<Carousel
  plugins={[
    'centered'
  ]}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

### slidesPerScroll

####v1 
```jsx
<Carousel
  slidesPerScroll={2}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

####v2
```jsx
import { slidesToScrollPlugin } from '@brainhubeu/react-carousel';

<Carousel
  plugins={[
    {
      resolve: slidesToScrollPlugin,
      options: {
       numberOfSlides: 2,
      },
    },
  ]}   
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

### keepDirectionWhenDragging

####v1 
```jsx
<Carousel
  keepDirectionWhenDragging
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

####v2
```jsx
<Carousel
  plugins={[
    'fastSwipe',
  ]}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

### autoplay

####v1 
```jsx
<Carousel
  autoPlay={2000}
  animationSpeed={1000}
>
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

####v2
```jsx
import { autoplayPlugin } from '@brainhubeu/react-carousel';

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
  <img src={imageOne} />
  <img src={imageTwo} />
  <img src={imageThree} />
</Carousel>
```

### dots

In v2, the dots property has been removed. Please use [**dots component**](https://brainhubeu.github.io/react-carousel/docs/examples/dots) instead.

### lazyLoad

We are working on implementing this feature in the carousel v2. Stay tuned...
