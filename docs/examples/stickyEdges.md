## Sticky Edges
You can choose to place your start and end slides at the edges without showing any empty space (the gap between the start/end slide and the arrow) in the slider. This prop places the slides towards the edge irrespective of whether the centered prop is present or not.

```jsx render
<div>
    <h4> Without Sticky Edges</h4>
    <div>
        <h5> Centered by default </h5>
        <Carousel arrows addArrowClickHandler slidesPerPage={4} slidesPerScroll={4}
        centered
        >
            {['lightcoral', 'khaki', 'lavender', 'wheat', 'azure', 'lightcoral', 'khaki', 'lavender', 'wheat', 'azure'].map(c => (
                <div key={c} style={{ backgroundColor: c }}>{c}</div>
            ))}
        </Carousel>
    </div>
    <div>
        <h5> Not Centered by default  </h5>
        <Carousel arrows addArrowClickHandler slidesPerPage={4} slidesPerScroll={4}
        
        >
            {['lightcoral', 'khaki', 'lavender', 'wheat', 'azure', 'lightcoral', 'khaki', 'lavender', 'wheat', 'azure'].map(c => (
                <div key={c} style={{ backgroundColor: c }}>{c}</div>
            ))}
        </Carousel>
    </div>

<br />
<h4> With Sticky Edges</h4>
    <div>
        <h5> Centered by default (Overridden using Sticky Edges) </h5>
        <Carousel arrows addArrowClickHandler slidesPerPage={4} slidesPerScroll={4}
        stickyEdges
        >
            {['lightcoral', 'khaki', 'lavender', 'wheat', 'azure', 'lightcoral', 'khaki', 'lavender', 'wheat', 'azure'].map(c => (
                <div key={c} style={{ backgroundColor: c }}>{c}</div>
            ))}
        </Carousel>
    </div>
    <div>
        <h5> Not Centered by default  </h5>
        <Carousel arrows addArrowClickHandler slidesPerPage={4} slidesPerScroll={4}
        centered stickyEdges
        >
            {['lightcoral', 'khaki', 'lavender', 'wheat', 'azure', 'lightcoral', 'khaki', 'lavender', 'wheat', 'azure'].map(c => (
                <div key={c} style={{ backgroundColor: c }}>{c}</div>
            ))}
        </Carousel>
    </div>
</div>
```
