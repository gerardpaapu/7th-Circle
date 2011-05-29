/*globals GameEntity: false, World: false, Bullet: false, Vector2D: false */
(function () {
var makeCluster, start, frames, update, fpsElement, spawn_vectors;
    

spawn_vectors = (function () {
    var TAU = 2 * Math.PI,
        min = 0.15,
        max = 0.35,
        step = (max - min) / 6,
        pps = 5,
        theta,
        x_ratio,
        y_ratio,
        result = [];

    for (theta = min; theta < max; theta += step ) {
            x_ratio = Math.cos( theta * TAU );
            y_ratio = Math.sin( theta * TAU );
            result.push( new Vector2D(x_ratio * pps, y_ratio * pps) );
    }

    return result;
}.call(this));


makeCluster = function (world, origin) {
    var bullet, i = 6;
    while (i--) {
        if ((bullet = new Bullet(world, origin))) {
            bullet.velocity = spawn_vectors[i];
        } else {
            break;
        }
    }
};

fpsElement = document.getElementById("FPS");
start = +new Date();
frames = 0;
   
update = function () {
    var origin;

    while (World.bullets.length < World.MAX_BULLETS) {
        origin = new Vector2D.random(640, 960);
        makeCluster(World, origin);
    }

    World.bullets.forEach(function (b) {
        b.update(World);
    });

    World.bullets.forEach(function (b) {
        b.draw();
    });

    frames++;
    fpsElement.innerHTML = Math.floor(1000 * frames/ ((+ new Date()) - start)) +  "fps";
};
window.setInterval(update, 1000 / 60);
}.call(null));
