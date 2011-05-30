/*globals Vector2D: false, Rect: false */
if (! Object.create) {
    Object.create = function (o) {
        var F = function (){};
        F.prototype = o;
        return new F();
    };
}

var World,
    GameEntity,
    Bullet,
    Dude,
    Baddy,
    Bonus;

(function () {

World = {
    canvas: document.getElementById('Display'),
    context: document.getElementById('Display').getContext('2d'),
    screen_area: new Rect(new Vector2D(0, 0), 320, 460),
    entities: [],
    bullets: [],
    MAX_BULLETS: 200
};

var remove = function (object, array) {
    array.splice(array.indexOf(object), 1);
};

GameEntity = function (world, position, bounding_box, drawing_box) {
    this.position = position || this.position;
    this.bounding_box = bounding_box || this.bounding_box;
    this.__drawing_box = drawing_box || this.__drawing_box;

    if (world) {
        this.world = world;
        this.world.entities.push( this );
    }
};
GameEntity.instances = [];
GameEntity.prototype = { 
    kill: function (world) {
        remove(this, world.entities);
    }, 

    update: function (world) {
        //
    },

    drawingBox: function () {
        var box, position, x, y;
        box = this.__drawing_box;
        position = this.position;
        x = box.x + position.x | 0;
        y = box.y + position.y | 0;
        return new Rect(new Vector2D(x, y), box.width, box.height);
    }
};

Bullet = function (world, position) {
    GameEntity.call(this, world, position); 
    world.bullets.push(this);  
};
Bullet.prototype = Object.create( GameEntity.prototype );

Bullet.prototype.image = document.createElement('img');
Bullet.prototype.image.src = "img/bullet.png"; 
Bullet.prototype.kill = function (world) {
    remove(this, world.bullets);
    GameEntity.prototype.kill.call(this, world);
};
Bullet.prototype.update = function (world) {
    this.position = this.position.plus( this.velocity );

    if (! world.screen_area.containsPoint(this.position)) {
        this.kill(world);
    }
};
Bullet.prototype.__drawing_box = new Rect(new Vector2D(-4, -4), 8, 8);
Bullet.prototype.clear = function (ctx) {
    var box = this.drawing_box.moveBy( this.position );
    ctx.clearRect(box.x, box.y, box.width, box.height);
};
Bullet.prototype.draw = function (ctx) {
    var box;
    if (this.imageData) { 
        box = this.drawingBox();
        ctx.putImageData(this.imageData, box.x, box.y);
    }
};

(function () {
    var img = document.createElement('img'); 
    img.src = "img/bullet.png";       
    img.onload = function () { 
        var ctx = World.context;

        ctx.clearRect(0, 0, 8, 8);
        ctx.drawImage(img, 0, 0);
        Bullet.prototype.imageData = ctx.getImageData(0, 0, 8, 8);
    };
}.call(this));

Baddy = function () { };

Baddy.prototype = Object.create( GameEntity.prototype );

Dude = function () { };

Dude.prototype = Object.create( GameEntity.prototype );

}.call(null));
