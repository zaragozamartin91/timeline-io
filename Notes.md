# Notes

## Dev server

Using VITE as the dev server and packager https://vite.dev/guide/

Run `npm run dev`


## Multi page apps with vite

https://vite.dev/guide/build#multi-page-app

For dev server, link /nested often fall back to root. Use trailing slash /nested/ or explicit /nested/index.html to force directory lookup.

multi page app structure

```sh
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```


## Css sizes

https://www.w3schools.com/cssref/css_units.php

### Absolute 

cm	centimeters
mm	millimeters
in	inches (1in = 96px = 2.54cm)
px*	pixels (1px = 1/96th of 1in)
pt	points (1pt = 1/72 of 1in)
pc	picas (1pc = 12 pt)

### Relative

em	    Relative to the font-size of the element (2em means 2 times the size of the current font)	
ex	    Relative to the x-height of the current font (rarely used)	
ch	    Relative to the width of the "0" (zero)	
rem	    Relative to font-size of the root element	
vw	    Relative to 1% of the width of the viewport*	
vh	    Relative to 1% of the height of the viewport*	
vmin	  Relative to 1% of viewport's* smaller dimension	
vmax	  Relative to 1% of viewport's* larger dimension	
%	      Relative to the parent element

## Draw SVG

SVG INTRODUCTION VIDEO tutorials: 
* https://www.youtube.com/watch?v=hZYaSGUbMds
* https://youtu.be/kBT90nwUb_o?si=OxVTSj9OkZsnZQOw


Multiple examples on drawing shapes with svg: https://codepen.io/HunorMarton/pen/PoGbgqj

Example tree using polygons & rect:

```html
<svg width="200" height="400" viewBox="-100 -200 200 400">
  <polygon points="0,0 80,120 -80,120" fill="#234236" />
  <polygon points="0,-40 60,60 -60,60" fill="#0C5C4C" />
  <polygon points="0,-80 40,0 -40,0" fill="#38755B" />
  <rect x="-20" y="120" width="40" height="30" fill="brown" />
</svg>
```
![svg-tree](svg-tree.png)

The viewBox specifies the size of the coordinate system.
- The first 2 numbers indicate the start coordinate of the top left corner using `x y` coordinates.
- The last 2 numbers indicate the end coordinate of the bottom right corner using `x y` coordinates.

## DSL draft

Sample dsl:

```sh
# this is a comment
| # this extends the timeline
|->Something # timeline event on the right
<-|Something # timeline event on the left
|-->Something # longer timeline event line
|@2026-06-30@-> # timeline event happening on june 30th 2026
```

---