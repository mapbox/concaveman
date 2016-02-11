## concaveman

A very fast **2D concave hull** algorithm (generates a general outline of a point set).

Based on ideas from the paper
[A New Concave Hull Algorithm and Concaveness Measure
for n-dimensional Datasets, 2012](http://www.iis.sinica.edu.tw/page/jise/2012/201205_10.pdf)
by Jin-Seo Park and Se-Jong Oh.
Additionally improved from `O(rn)` (where `r` is a number of output points) to `O(n log n)`
by implementing a fast _k nearest points to a segment_ algorithm,
a modification of a depth-first kNN R-tree search using a priority queue.

### Usage

```js
var points = [[10, 20], [30, 12.5], ...];
var polygon = concaveman(points);
```

Signature: `concaveman(points[, concavity = 2, lengthThreshold = 0])`

- `points` is an array of `[x, y]` points.
- `concavity` is a relative measure of concavity. `1` results in the most detailed shape, `Infinity` results in a convex hull.
- `lengthThreshold`: when a segment length is under this threshold, it stops being considered for further detalization.
Higher values result in simpler shapes.

### Dependencies

- [monotone-convex-hull-2d](https://github.com/mikolalysenko/monotone-convex-hull-2d) for the convex hull algorithm.
- [rbush](https://github.com/mourner/rbush) for point indexing.
- [tinyqueue](https://github.com/mourner/tinyqueue) as a priority queue.
- [point-in-polygon](https://github.com/substack/point-in-polygon) for point in polygon queries.
- [robust-orientation](https://github.com/mikolalysenko/robust-orientation) for 3-point orientation tests.
