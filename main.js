/*globals GameEntity: false, World: false, Bullet: false, Vector2D: false */
(function () {
var makeCluster, times, update, fpsElement, spawn_vectors, recur;

spawn_vectors = (function () {
    var TAU = 2 * Math.PI,
        min = 0.15 * TAU,
        max = 0.35 * TAU,
        step = (max - min) / 6,
        pps = 5,
        theta,
        x_ratio,
        y_ratio,
        result = [];

    for (theta = min; theta < max; theta += step ) {
            x_ratio = Math.cos( theta );
            y_ratio = Math.sin( theta );
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
times = Array(20);
   
update = function () {
    var origin, b, i, j, bullets = World.bullets;

    while (bullets.length < World.MAX_BULLETS) {
        origin = new Vector2D.random(640, 960);
        makeCluster(World, origin);
    }

    World.context.clearRect(0, 0, 320, 420);
    
    i = bullets.length;

    while (i--) {
        b = bullets[i];
        b.update(World);
        b.draw(World.context);
    }

    times.shift();
    times.push(+new Date());
    fpsElement.innerHTML = ~~(19000 / (times[19] - times[0])) + 'fps';
};

window.setInterval(update);

}.call(null));
