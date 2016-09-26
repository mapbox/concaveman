## concaveman

A very fast **2D concave hull** algorithm in JavaScript (generates a general outline of a point set).

[![Build Status](https://travis-ci.org/mapbox/concaveman.svg?branch=master)](https://travis-ci.org/mapbox/concaveman)
[![Coverage Status](https://coveralls.io/repos/github/mapbox/concaveman/badge.svg?branch=master)](https://coveralls.io/github/mapbox/concaveman?branch=master)
[![](https://img.shields.io/badge/simply-awesome-brightgreen.svg)](https://github.com/mourner/projects)

<img width="570" alt="sample concave hull" src="https://cloud.githubusercontent.com/assets/25395/12975726/ada2ad10-d0c6-11e5-96c8-6e42c995e0e2.png">

### Usage

```js
var points = [[10, 20], [30, 12.5], ...];
var polygon = concaveman(points);
```

Signature: `concaveman(points[, concavity = 2, lengthThreshold = 0])`

- `points` is an array of `[x, y]` points.
- `concavity` is a relative measure of concavity. `1` results in a relatively detailed shape, `Infinity` results in a convex hull.
You can use values lower than `1`, but they can produce pretty crazy shapes.
- `lengthThreshold`: when a segment length is under this threshold, it stops being considered for further detalization.
Higher values result in simpler shapes.

### Algorithm

The algorithm is based on ideas from the paper [A New Concave Hull Algorithm and Concaveness Measure
for n-dimensional Datasets, 2012](http://www.iis.sinica.edu.tw/page/jise/2012/201205_10.pdf)
by Jin-Seo Park and Se-Jong Oh.

This implementation dramatically improves performance over the one stated in the paper
(`O(rn)`, where `r` is a number of output points, to `O(n log n)`)
by introducing a fast _k nearest points to a segment_ algorithm,
a modification of a depth-first kNN R-tree search using a priority queue.

### TypeScript

[TypeScript type definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/concaveman)
are available trough `npm install --save @types/concaveman`.

### Dependencies

- [monotone-convex-hull-2d](https://github.com/mikolalysenko/monotone-convex-hull-2d) for the convex hull algorithm
- [rbush](https://github.com/mourner/rbush) for point indexing
- [tinyqueue](https://github.com/mourner/tinyqueue) as a priority queue
- [point-in-polygon](https://github.com/substack/point-in-polygon) for point in polygon queries
- [robust-orientation](https://github.com/mikolalysenko/robust-orientation) for 3-point orientation tests
