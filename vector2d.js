var Vector2D, Rect;
Vector2D = function (x, y) {
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

Vector2D.fromAngle = function (theta) {
    return Vector2D.__angles_lookup__[ Math.floor(theta % 100) ];
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
    return new Vector2D(Math.floor(Math.random() * x),
                        Math.floor(Math.random() * y));
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
    },

    direction: function () {
        var ratio = Math.floor(100 * this.x / this.y);
        return Vector2D.__direction_lookup__[ratio];
    },

    angle: function () {
        var ratio = Math.floor(100 * this.x / this.y);
        return Vector2D.__angle_reverse_lookup__[ratio];
    }
};

Vector2D.prototype.diff = Vector2D.prototype.minus;

Vector2D.zero = new Vector2D(0, 0);

Vector2D.__angles_lookup__ = [];
Vector2D.__angle_reverse_lookup__ = [];
Vector2D.__ratio_lookup__ = [];

(function () {
    var TAU = 2 * Math.PI,
        theta, ratio, i, x, y, direction;

    for (i = 0; i < 100; i++) {
        theta = TAU * i / 100;
        x = Math.cos(theta);
        y = Math.sin(theta);
        ratio = Math.round(100 * x / y);
        Vector2D.__angles_lookup__[ i ] = new Vector2D(x, y);
    }

    for (i = 0; i < 100; i++) {
        theta = Math.atan(i / 100);
        x = Math.cos(theta);
        y = Math.sin(theta);
        Vector2D.__ratio_lookup__[ i ] = new Vector2D(x, y);
        Vector2D.__angle_reverse_lookup__[ i ] = theta;
    }
}.call(null));

Rect = function (a, b, c, d) {
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

    this.x = this.origin.x;
    this.y = this.origin.y;
};

Rect.prototype.limitPoint = function (p) {
    // return a point close to p but that is 
    // contained within `this`
    function limit(top, bottom, n) {
        return Math.min(top, Math.max(bottom, n));
    }  

    return new Vector2D(limit(this.origin.x, this.x + this.width,  p.x),
                        limit(this.origin.y, this.y + this.height, p.y));
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

Rect.prototype.moveBy = function (vec) {
    return new Rect(this.origin.plus( vec ), this.width, this.height);
};
