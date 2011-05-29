var Vector2D = function (x, y) {
    if (isNaN(x) || isNaN(y)) {
        throw new Error("invalid coordinates");
    }

    this.x = x;
    this.y = y;
};

Vector2D.from = function (a) {
    if (arguments.length == 2) {
        return Vector2D.from(arguments);
    }

    return a instanceof Vector2D ? a
        :  new Vector2D(a[0], a[1]);
};

Vector2D.add = function () {
    return Vector2D.sum(arguments);
};

Vector2D.sum = function (ls) {
    var i = ls.length,
        total = Vector2D.zero;

    while (i--) {
        total = total.plus( ls[i] );
    }

    return total;
};

Vector2D.midpoint = function () {
    return Vector2D.sum(arguments).scale(1 / arguments.length);
};

Vector2D.random = function (x, y) {
    return new Vector2D(Math.random() * x | 0,
                        Math.random() * y | 0);
};

Vector2D.prototype = {
    plus: function (vec) {
        vec = Vector2D.from(vec);
        return new Vector2D(this.x + vec.x, this.y + vec.y); 
    },

    minus: function (vec) {
        vec = Vector2D.from(vec);
        return new Vector2D(this.x - vec.x, this.y - vec.y);
    },

    distanceTo: function (vec) {
        return this.minus(vec).length();
    },

    distanceSq: function (vec) {
        var x = this.x - vec.x,
            y = this.y - vec.y;

        return x * x + y * y;
    }, 

    length: function (vec) {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    },

    scale: function (scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    },

    midpoint: function (vec) {
        return new Vector2D((this.x + vec.x) * 0.5,
                            (this.y + vec.y) * 0.5);
    },

    limit: function (rect) {
        return rect.limitPoint(this);
    }
};

Vector2D.prototype.diff = Vector2D.prototype.minus;

Vector2D.zero = new Vector2D(0, 0);

var Rect = function (a, b, c, d) {
    switch (arguments.length) {
        // new Rect(Vector2D a, Vector2D b);
        case 2:
            if (! (a instanceof Vector2D && b instanceof Vector2D )) {
                throw new TypeError("a and b must be Vector2D instances");
            } 
            this.origin = new Vector2D( Math.min(a.x, b.x), Math.min(a.y, b.y) );
            this.width = Math.abs(a.x - b.x);
            this.height = Math.abs(a.y - b.y);
        break;

        // new Rect(Vector2D origin, Number width, Number height)
        case 3:
            if (! a instanceof Vector2D ) {
                throw new TypeError("origin must be a Vector2D");
            }
            this.origin = a;
            this.width = b;
            this.height = c;
        break;

        // new Rect(Number top, Number left, Number width, Number height)
        case 4:
            this.origin = new Vector2D(a, b);
            this.width = c;
            this.height = d;
        break;

        default:
            throw new TypeError();
    }
};

Rect.prototype.limitPoint = function (p) {
    // return a point close to p but that is 
    // contained within `this`
    function limit(top, bottom, n) {
        return Math.min(top, Math.max(bottom, n));
    }  

    return new Vector2D(limit(this.topLeft.x, this.x + this.width,  p.x),
                        limit(this.topLeft.y, this.y + this.height, p.y));
};

Rect.prototype.containsPoint = function (p) {
    var x_diff = p.x - this.origin.x,
        y_diff = p.y - this.origin.y;

    return x_diff > 0 && x_diff < this.width &&
           y_diff > 0 && y_diff < this.height;
};

Rect.prototype.containsRect = function (r) {
    var a = r.origin,
        b = a.plus(new Vector2D(r.width, r.height)); 

    return this.containsPoint(a) && this.containsPoint(b);
};

Rect.prototype.doesOverlap = function (r) {
    var x_diff = r.origin.x - this.origin.x,
        y_diff = r.origin.y - this.origin.y;

    return x_diff > (-r.width)  && x_diff < this.width &&
           y_diff > (-r.height) && y_diff < this.height;
};
