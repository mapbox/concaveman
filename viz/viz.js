'use strict';

var concaveman = require('../');
var convexHull = require('monotone-convex-hull-2d');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var points = require('../test/fixtures/points-1k.json');

// console.time('subsample');
// points = subsample(points, 4);
// console.timeEnd('subsample');

var minX = Infinity;
var maxX = -Infinity;
var minY = Infinity;
var maxY = -Infinity;

for (var i = 0; i < points.length; i++) {
    minX = Math.min(minX, points[i][0]);
    maxX = Math.max(maxX, points[i][0]);
    minY = Math.min(minY, points[i][1]);
    maxY = Math.max(maxY, points[i][1]);
}

var width = maxX - minX;
var height = maxY - minY;

canvas.width = window.innerWidth - 30;
canvas.height = canvas.width * height / width;

var ratio = canvas.width / width;

if (devicePixelRatio > 1) {
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.width *= 2;
    canvas.height *= 2;
    ctx.scale(2, 2);
}

console.log('number of points: %d', points.length);

console.time('hull');
var hull = concaveman(points, 0);
console.timeEnd('hull');

var hull2 = convexHull(points);

ctx.lineJoin = 'round';
ctx.lineCap = 'round';

ctx.strokeStyle = 'rgba(0,255,0,0.2)';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(coord(points[hull2[0]][0], minX), coord(points[hull2[0]][1], minY));
for (i = 1; i < hull2.length; i++) {
    ctx.lineTo(coord(points[hull2[i]][0], minX), coord(points[hull2[i]][1], minY));
}
ctx.closePath();
ctx.stroke();

ctx.strokeStyle = 'rgba(255,0,0,0.3)';
ctx.fillStyle = 'rgba(255,0,0,0.05)';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(coord(hull[0][0], minX), coord(hull[0][1], minY));
for (i = 1; i < hull.length; i++) {
    ctx.lineTo(coord(hull[i][0], minX), coord(hull[i][1], minY));
}
ctx.closePath();
ctx.fill();
ctx.stroke();

ctx.fillStyle = 'black';
ctx.beginPath();
for (i = 0; i < points.length; i++) {
    var p = points[i];
    ctx.rect(coord(p[0], minX) - 1, coord(p[1], minY) - 1, 2, 2);
}
ctx.fill();

function coord(k, min) {
    return Math.floor((k - min) * ratio);
}

// function subsample(points, precision) {
//     var e = Math.pow(10, precision);
//
//     for (var i = 0; i < points.length; i++) {
//         var p = points[i];
//         p[0] = Math.round(p[0] * e) / e;
//         p[1] = Math.round(p[1] * e) / e;
//     }
//
//     points.sort(compare);
//
//     var result = [], prev;
//     for (i = 0; i < points.length; i++) {
//         if (!prev || compare(prev, points[i]) !== 0) result.push(points[i]);
//         prev = points[i];
//     }
//
//     return result;
//
//     function compare(a, b) {
//         return (a[0] - b[0]) || (a[1] - b[1]);
//     }
// }
