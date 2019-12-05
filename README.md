# react-use-queries
[![Version](https://img.shields.io/npm/v/react-use-queries.svg)](https://www.npmjs.com/package/react-use-queries)
[![NPM-Size](https://flat.badgen.net/bundlephobia/minzip/react-use-queries)](https://www.npmjs.com/package/react-use-queries)

This React hook makes it easy for you to match with your media queries. Be it window or **any container element**!

**Get it**: `npm install react-use-queries --save`

## What?

Given things you want to do with your media queries you can ask for a list of things that match!

```jsx
const queries = {
    '(max-width: 299px)': { thing: 'A' },
    '(min-width: 300px) and (max-width: 599px)': { thing: 'B' },
    '(min-width: 600px)': { thing: 'C' }
}

function ResponsiveComponent() {
    const [things] = useQueries(queries, global)
    // server side: = []
    // client side: = [{ thing: 'A' }]
    //          or: = [{ thing: 'B' }]
    //          or: = [{ thing: 'C' }]
    return (
        <div>
            Things that match:
            <pre>{JSON.stringify(things, null, 4)}</pre>
        </div>
    )
}
```

### Global?

The `global` there is actually `window`, but Babel handles `global` so that both server and client side code can work!
You can use `window` if you're dealing with client-only codebase (and don't have anything to fix `global` for you).

### What about elements?

So you want to use matchMedia on any element?

```jsx
import React, { useMemo } from 'react'
import useQueries from 'react-use-queries'

// define this outside component to keep the same reference
// or if you need this to be dynamic: useMemo
const queries = {
    '(max-width: 299px)': 'small',
    '(min-width: 300px) and (max-width: 599px)': 'medium',
    '(min-width: 600px)': 'large'
}

const positionRelative = { position: relative }

function ResponsiveComponent() {
    const [[size = 'default'], mediaQueryListener] = useElementQuery(queries)

    // for demo purposes set a width that is smaller than the viewport width
    const style = useMemo(() => ({ width: '50%', positionRelative }), [positionRelative])

    return (
        <div style={positionRelative}>
            {mediaQueryListener}
            <h2>Size is <code>{size}</code></h2>
        </div>
    )
}
```

### Caveats

For the media queries (or container queries) to work on elements you must give a containing element a style that is not
`static` (or `initial`). Most commonly this means applying `position: relative;`. This is required, because a
[trick originating from 2013 used for element resize detection](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/) is used here in a modern
flavor, but instead of detecting resize we use `matchMedia` instead. The `mediaQueryListener` element is an `<iframe />`
with url set to `about:blank`. Then this iframe element is sized to full size of it's parent by absolute positioning,
hence requirement for `position` other than `static`.

### Motivation

You know how annoying it is to control element sizes via media queries in CSS? Well, I hadn't found out about container
queries until just recently (around November 2019) and ended up reading and researching **a lot** on the topic. Also, I
think I got a pretty unique idea using `matchMedia` of the `about:blank` page instead of resize events. Another idea was
to output array of matches, which I think is both clever and simple way to create a powerful hook for all sorts of media
and container query needs.

#### Inspiration and thanks

I used the excellent [`react-resize-aware`](https://github.com/FezVrasta/react-resize-aware) as an inspiration for the
minimal bundle size. Thanks to the author of that hook! Previusly I did some work creating
[`use-element-query`](https://github.com/Merri/use-element-query), but it uses DOM mutations outside React and also has
a bit sloppier API. I ended up putting more effort into polishing this hook and even choosing a much better name.

## Alternatives

- [CSS Element Queries](http://marcj.github.io/css-element-queries/): type `[min-width~="size"]` to CSS
- [CQ Prolyfill](https://github.com/ausi/cq-prolyfill): write `:container` pseudo-selectors to your CSS
- [EQCSS](https://elementqueries.com/): use `@element` queries in your CSS
- [`container-query`](https://github.com/ZeeCoder/container-query): lets you have `@container` queries
- [`react-measure`](https://www.npmjs.com/package/react-measure): get all sorts of measurements of an element
- [`styled-container-query`](https://www.npmjs.com/package/styled-container-query): write `:container` with Styled
  Components

And finally, I recommend [`react-resize-aware`](https://github.com/FezVrasta/react-resize-aware) if you need to know
about element resizing and don't want to use `ResizeObserver` due to current state of browser support!
