import test from 'node:test';
import assert from 'node:assert/strict';
import concaveman from '../index.js';

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
