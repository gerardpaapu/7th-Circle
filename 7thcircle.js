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

GameEntity = function (position, bounding_box, drawing_box) {
    this.position = position || this.position;
    this.bounding_box = bounding_box || this.bounding_box;
    this.drawing_box = drawing_box || this.drawing_box;

    GameEntity.instances.push( this );
};
GameEntity.instances = [];
GameEntity.prototype = { 
    kill: function () {
        remove(this, GameEntity.instances);
    }, 

    update: function () {

    }
};

Bullet = function (position) {
    GameEntity.call(this, position); 
    Bullet.instances.push( this );  
};
Bullet.instances = [];
Bullet.prototype = Object.create( GameEntity );
Bullet.prototype.kill = function () {
    remove(this, Bullet.instances);
    GameEntity.prototype.kill.call(this);
};
Bullet.prototype.update = function () {
    this.position = this.position.plus( this.velocity );
    if (! screen_area.overlaps( this.drawing_box )) {
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
