import test from 'node:test';
import assert from 'node:assert/strict';
import concaveman from '../index.js';
import pointInPolygon from 'point-in-polygon';

import points from './fixtures/points-1k.json' with {type: 'json'};
import hull from './fixtures/points-1k-hull.json' with {type: 'json'};
import hull2 from './fixtures/points-1k-hull2.json' with {type: 'json'};

test('default concave hull', () => {
    const result = concaveman(points);
    assert.deepEqual(result, hull);
});

test('tuned concave hull', () => {
    const result = concaveman(points, 3, 0.01);
    assert.deepEqual(result, hull2);
});

function assertAllInside(points, hull) {
    for (const p of points) {
        assert.ok(hull.includes(p) || pointInPolygon(p, hull), `point ${p} is outside the hull`);
    }
}

test('no points outside the hull (#31)', () => {
    const points = [[1.911, 4.157], [5.668, 0.704], [6.134, 2.879], [8.045, 2.904], [9.942, 3.167], [7.757, 3.387]];
    assertAllInside(points, concaveman(points));
});

test('no points outside the hull with single-point R-tree nodes', () => {
    const points = [
        [2, 35], [15, 88], [92, 72], [41, 39], [47, 51], [97, 52], [58, 36], [71, 1], [83, 16],
        [17, 49], [73, 37], [18, 94], [60, 55], [7, 32], [56, 8], [34, 16], [100, 74]
    ];
    assertAllInside(points, concaveman(points));
});
