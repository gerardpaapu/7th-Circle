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
    MAX_BULLETS: 70,
    bullet_sprites: [],
    free_bullet_sprites: [],
    
    getSprite: function () {
        var element;
        if (this.bullet_sprites.length < this.MAX_BULLETS) {
            element = document.createElement("img");
            element.src = "img/bullet.png";
            element.width = 8;
            element.height = 8;
            element.style.position = "absolute";
            element.style.top = "-999px";
            element.style.left = "-999px";
            this.bullet_sprites.push(element);
            this.context.appendChild(element);
            return element;
        } else if (this.free_bullet_sprites.length > 0) {
            return this.free_bullet_sprites.pop(); 
        } else {
            return null;
        }
    }
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
Bullet.prototype.image = document.createElement('img');
Bullet.prototype.image.src = "img/bullet.png"; 
Bullet.prototype = Object.create( GameEntity.prototype );
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
    var box = this.drawingBox();
    ctx.drawImage(this.image, box.x, box.y);
};

Baddy = function () { };

Baddy.prototype = Object.create( GameEntity );

Dude = function () { };

Dude.prototype = Object.create( GameEntity );

}.call(null));
