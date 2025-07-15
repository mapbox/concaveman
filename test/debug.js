

const fs = require('fs');
const concaveman = require('../');

const points = require('../tmp/test.json');

const colors = ['#006837', '#1a9850', '#66bd63', '#a6d96a', '#d9ef8b', '#fee08b', '#fdae61', '#f46d43', '#d73027', '#a50026'];
const distStep = 100000;
const numClasses = 10;

let dist = distStep;
let start = 0;
let end = 0;
const hulls = [];

console.time('total');
for (let i = 0, last = []; i < numClasses; i++) {
    start = end;
    while (points[end][2] < dist) end++;

    const part = points.slice(start, end);

    const now = Date.now();
    const hull = concaveman(part.concat(last), 1.5, 0.005);
    console.log(`concave hull on ${  part.length + last.length  } points in ${
        Date.now() - now  }ms, size: ${  hull.length}`);

    hulls.push({
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: last.length ? [hull, last] : [hull]
        },
        properties: {
            stroke: 'black',
            'stroke-opacity': 0.8,
            fill: colors[i],
            'fill-opacity': 0.5
        }
    });

    last = hull;
    dist += distStep;
}
console.timeEnd('total');

const collection = {
    type: 'FeatureCollection',
    features: hulls.reverse()
};

fs.writeFileSync('./tmp/output.json', JSON.stringify(collection));
