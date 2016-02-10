'use strict';

var rbush = require('rbush');
var convexHull = require('monotone-convex-hull-2d');
var Queue = require('tinyqueue');
var pointInPolygon = require('point-in-polygon');
var orient = require('robust-orientation')[3];

module.exports = concaveHull;

function concaveHull(points, maxConcavity, minSegLength) {
    maxConcavity = maxConcavity || 2;
    minSegLength = minSegLength || 0;

    console.time('convex hull');
    var hull = fastConvexHull(points);
    console.timeEnd('convex hull');

    console.time('rbush load');
    var tree = rbush(16, ['[0]', '[1]', '[0]', '[1]']).load(points);
    console.timeEnd('rbush load');

    var queue = [];
    for (var i = 0, last; i < hull.length; i++) {
        var p = hull[i];
        last = insertNode(p, last);
        tree.remove(p);
        queue.push(last);
    }

    var maxSqConcavity = maxConcavity * maxConcavity;
    var minSqSegLength = minSegLength * minSegLength;

    console.time('concave');
    while (queue.length) {
        var node = queue.shift();
        var a = node.p;
        var b = node.next.p;

        var sqDist = getSqDist(a, b);
        if (sqDist < minSqSegLength) continue;

        var maxSqDist = sqDist / maxSqConcavity;

        // find the nearest point to current edge that's not closer to adjacent edges
        var c = findCandidate(tree, node.prev.p, a, b, node.next.next.p, maxSqDist, queue);

        if (c && Math.min(getSqDist(c, a), getSqDist(c, b)) <= maxSqDist) {
            queue.push(node);
            queue.push(insertNode(c, node));
            tree.remove(c);
        }
    }
    console.timeEnd('concave');

    node = last;
    var concave = [];
    do {
        concave.push(node.p);
        node = node.next;
    } while (node !== last);

    concave.push(node.p);

    return concave;
}

function insertNode(p, prev) {
    var node = {
        p: p,
        prev: null,
        next: null
    };

    if (!prev) {
        node.prev = node;
        node.next = node;

    } else {
        node.next = prev.next;
        node.prev = prev;
        prev.next.prev = node;
        prev.next = node;
    }
    return node;
}

// square distance between 2 points
function getSqDist(p1, p2) {

    var dx = p1[0] - p2[0],
        dy = p1[1] - p2[1];

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function sqSegDist(p, p1, p2) {

    var x = p1[0],
        y = p1[1],
        dx = p2[0] - x,
        dy = p2[1] - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2[0];
            y = p2[1];

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p[0] - x;
    dy = p[1] - y;

    return dx * dx + dy * dy;
}

function findCandidate(tree, a, b, c, d, maxDist, edges) {
    var node = tree.data,
        queue = new Queue(null, compareDist);

    while (node) {
        for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i];

            var dist = node.leaf ? sqSegDist(child, b, c) : sqSegBoxDist(b, c, child.bbox);
            if (dist > maxDist) continue;

            queue.push({
                node: child,
                isItem: node.leaf,
                dist: dist
            });
        }

        while (queue.length && queue.peek().isItem) {
            var item = queue.pop();
            var p = item.node;
            var d0 = sqSegDist(p, a, b);
            var d1 = sqSegDist(p, c, d);
            if (item.dist < d0 && item.dist < d1 && noIntersections(b, c, p, edges)) return p;
        }

        node = queue.pop();
        if (node) node = node.node;
    }

    return null;
}

function noIntersections(a, b, p, edges) {
    for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        if (intersects(a, p, e.p, e.next.p) || intersects(b, p, e.p, e.next.p)) return false;
    }
    return true;
}

function compareDist(a, b) {
    return a.dist - b.dist;
}

function sqSegBoxDist(a, b, bbox) {
    var dx = Math.max(bbox[0] - Math.max(a[0], b[0]), Math.min(a[0], b[0]) - bbox[2], 0);
    var dy = Math.max(bbox[1] - Math.max(a[1], b[1]), Math.min(a[1], b[1]) - bbox[3], 0);
    return dx * dx + dy * dy;
}

// speeds up convex hull by filtering out points inside quadrilateral formed by 4 extreme points
function fastConvexHull(points) {
    var left = points[0];
    var top = points[0];
    var right = points[0];
    var bottom = points[0];

    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        if (p[0] < left[0]) left = p;
        if (p[0] > right[0]) right = p;
        if (p[1] < top[1]) top = p;
        if (p[1] > bottom[1]) bottom = p;
    }

    var cull = [left, top, right, bottom];
    var filtered = cull.slice();
    for (i = 0; i < points.length; i++) {
        if (!pointInPolygon(points[i], cull)) filtered.push(points[i]);
    }

    var indices = convexHull(filtered);
    var hull = [];
    for (i = 0; i < indices.length; i++) hull.push(filtered[indices[i]]);
    return hull;
}

function intersects(p1, q1, p2, q2) {
    return p1 !== q2 && q1 !== p2 &&
        orient(p1, q1, p2) > 0 !== orient(p1, q1, q2) > 0 &&
        orient(p2, q2, p1) > 0 !== orient(p2, q2, q1) > 0;
}
