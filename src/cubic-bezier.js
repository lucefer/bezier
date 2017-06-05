function CubicBezier(p1x, p1y, p2x, p2y) {
    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx - this.bx;

    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;
}
var p = CubicBezier.prototype;
p.sampleCurveX = function(t) {
    return ((this.ax * t + this.bx) * t + this.cx) * t;
}
p.sampleCurveY = function(t) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
}
p.sampleCurveDerivativeX = function(t) {
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
}
// Given an x value, find a parametric value it came from.
p.solveCurveX = function(x) {
    var abs = Math.abs;
    var ZERO_LIMIT = 1e-6;
    var t2 = x,
        derivative,
        x2;

    // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation
    // First try a few iterations of Newton's method -- normally very fast.
    // http://en.wikipedia.org/wiki/Newton's_method
    for (var i = 0; i < 8; i++) {
        // f(t)-x=0
        x2 = this.sampleCurveX(t2) - x;
        if (abs(x2) < ZERO_LIMIT) {
            return t2;
        }
        derivative = this.sampleCurveDerivativeX(t2);
        // == 0, failure
        if (abs(derivative) < ZERO_LIMIT) {
            break;
        }
        t2 -= x2 / derivative;
    }

    // Fall back to the bisection method for reliability.
    // bisection
    // http://en.wikipedia.org/wiki/Bisection_method
    var t1 = 1,
        t0 = 0;
    t2 = x;
    while (t1 > t0) {
        x2 = this.sampleCurveX(t2) - x;
        if (abs(x2) < ZERO_LIMIT) {
            return t2;
        }
        if (x2 > 0) {
            t1 = t2;
        } else {
            t0 = t2;
        }
        t2 = (t1 + t0) / 2;
    }

    // Failure
    return t2;
}

p.solve = function(x) {
    return this.sampleCurveY(this.solveCurveX(x));
}
CubicBezier.linear=new CubicBezier(0,0,1,1);
CubicBezier.ease=new CubicBezier(.25,.1,.25,1);
CubicBezier.easeIn=new CubicBezier(.42,0,1,1);
CubicBezier.easeOut=new CubicBezier(0,0,.58,1);
CubicBezier.easeInOut=new CubicBezier(.42,0,.58,1);
module.exports = CubicBezier;
