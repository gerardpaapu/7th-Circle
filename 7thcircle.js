/*globals Vector2D: false, Rect: false */
var GameEntity,
    Bullet,
    dude,
    cursor;

(function () {
var remove, create, floor;

remove = function (object, array) {
    var index = array.indexOf(object);
    if (index != -1) {
        array.splice(index, 1);
    } else {
        throw new Error("object doesn't exist in array");
    }
};

create = Object.create || function (o) {
    var F = function (){};
    F.prototype = o;
    return new F();
};

floor = Math.floor;

GameEntity = function (world, position, bounding_box, drawing_box) {
    this.position = position || this.position;
    this.bounding_box = bounding_box || this.bounding_box;
    this.drawing_box = drawing_box || this.drawing_box;

    if (world) {
        world.entities.push( this );
    }
};
GameEntity.instances = [];
GameEntity.prototype = { 
    kill: function (world) {
        remove(this, world.entities);
    }, 

    update: function (world) { },
    position: Vector2D.zero,
    bounding_box: new Rect(0, 0, 1, 1),
    drawing_box: new Rect(0, 0, 1, 1),

    drawingBox: function () {
        var box, position, x, y;

        box = this.drawing_box;
        position = this.position;
        x = floor(box.x + position.x);
        y = floor(box.y + position.y);

        return new Rect(x, y, box.width, box.height);
    },

    boundingBox: function () {
        var box, position, x, y;

        box = this.bounding_box;
        position = this.position;
        x = box.x + position.x;
        y = box.y + position.y;

        return new Rect(x, y, box.width, box.height);
    },

    draw: function (display) {
        var box = this.drawingBox();
        display.draw(this.image, box.x, box.y);
    },

    clear: function (display) {
        var box = this.drawingBox();
        display.clear(box.x, box.y, box.width, box.height);
    }
};

Bullet = function (world, position) {
    GameEntity.call(this, world, position); 
};
Bullet.prototype = create( GameEntity.prototype );

Bullet.prototype.image = "bullet";
Bullet.prototype.velocity = new Vector2D(0, 0);
Bullet.prototype.drawing_box = new Rect(new Vector2D(-4, -4), 8, 8);
Bullet.prototype.update = function (world) {
    this.position = this.position.plus( this.velocity );

    if (! world.bounds.containsPoint(this.position)) {
        this.kill(world);
    }
};
/*
cursor = new GameEntity();
cursor.image = "cursor";
cursor.drawing_box = new Rect(new Vector2D(-10, -10), 20, 20);
cursor.update = function () {
    // be where the cursor is
};

dude = new GameEntity();
dude.image = "dude";
dude.drawing_box = new Rect(-16, -16, 32, 32);
dude.update = function () {
    var diff = this.position.minus( cursor.position ),
        angle = Math.atan(diff.y / diff.x) * 50 / Math.PI,
        heading = angles[angle];

    this.position = this.position.plus( 
};
*/


}.call(null));
