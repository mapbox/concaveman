'use strict';

var fs = require('fs');
var concaveHull = require('./');

var points = require('./tmp/test.json');

var colors = ['#006837', '#1a9850', '#66bd63', '#a6d96a', '#d9ef8b', '#fee08b', '#fdae61', '#f46d43', '#d73027', '#a50026'];
var dist = 100000;
var end = 0;
var hulls = [];

for (var i = 0, last; i < 3; i++) {
    while (points[end][2] < dist) end++;

    var id = 'concave hull on ' + end + ' points';
    console.time(id);
    var hull = concaveHull(points.slice(0, end), 1.7, 0.005);
    console.timeEnd(id);

    console.log('concave hull size: ' + hull.length + '\n');

    hulls.push({
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: last ? [hull, last] : [hull]
        },
        properties: {
            stroke: 'black',
            'stroke-opacity': 0.8,
            fill: colors[i],
            'fill-opacity': 0.5
        }
    });

    last = hull;
    dist += 100000;
}

var collection = {
    type: 'FeatureCollection',
    features: hulls.reverse()
};

fs.writeFileSync('./tmp/output.json', JSON.stringify(collection));
