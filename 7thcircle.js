if (! Object.create) {
    Object.create = function (o) {
        var F = function (){};
        F.prototype = o;
        return new F();
    };
}

var GameEntity,
    Bullet,
    Dude,
    Baddy,
    Bonus,

    remove;

remove = function (object, array) {
    array.splice(array.indexOf(object), 1);
};

GameEntity = function (world, position, bounding_box, drawing_box) {
    this.position = position || this.position;
    this.bounding_box = bounding_box || this.bounding_box;
    this.drawing_box = drawing_box || this.drawing_box;

    if (world) {
        this.world = world;
        this.world.entitites.push( this );
    }
};
GameEntity.instances = [];
GameEntity.prototype = { 
    kill: function (world) {
        remove(this, world.entities);
    }, 

    update: function (world) {
        //
    }
};

Bullet = function (world, position) {
    GameEntity.call(this, world, position); 
    world.bullets.push(this);  
};
Bullet.prototype = Object.create( GameEntity );
Bullet.prototype.kill = function (world) {
    remove(this, world.bullets);
    GameEntity.prototype.kill.call(this);
};
Bullet.prototype.update = function (world) {
    this.position = this.position.plus( this.velocity );

    if (! world.screen_area.overlaps( this.drawing_box )) {
        this.kill();
    }
};
Bullet.prototype.draw = function () {
    
};

Baddy = function () {
      
};

Baddy.prototype = Object.create( GameEntity );

Dude = function () {

};

Dude.prototype = Object.create( GameEntity );
