/*globals Vector2D: false, Rect: false */
var GameEntity,
    Bullet,
    Dude,
    Baddy,
    Bonus;

(function () {
var remove, create, floor;

remove = function (object, array) {
    array.splice(array.indexOf(object), 1);
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

    drawingBox: function () {
        var box, position, x, y;
        box = this.drawing_box;
        position = this.position;
        x = floor(box.x + position.x);
        y = floor(box.y + position.y);
        return new Rect(new Vector2D(x, y), box.width, box.height);
    },

    boundingBox: function () {
        var box, position, x, y;
        box = this.bounding_box;
        position = this.position;
        x = box.x + position.x;
        y = box.y + position.y;
        return new Rect(new Vector2D(x, y), box.width, box.height);
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

Baddy = function () { };

Baddy.prototype = create( GameEntity.prototype );

Dude = function () { };

Dude.prototype = create( GameEntity.prototype );

}.call(null));
