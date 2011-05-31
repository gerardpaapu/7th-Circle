/*globals GameEntity: false, World: false, Bullet: false, Vector2D: false, Display: false */
(function () {
var makeCluster, update, updateFps, angles, recur;

angles = (function () {
    var min = 0 ,
        max = 2 * Math.PI,
        step = (max - min) / 100,
        theta,
        x,
        y,
        result = [];

    for (theta = min; theta < max; theta += step ) {
        x = Math.cos( theta );
        y = Math.sin( theta );
        result.push( new Vector2D(x, y) );
    }

    return result;
}());

makeCluster = function (world, origin) {
    var bullet, i, min = 15, max = 35;
    for (i = min; i < max; i++) {
        if ((bullet = new Bullet(world, origin))) {
            bullet.velocity = angles[i].scale(5);
        } else {
            break;
        }
    }
};

updateFps = (function () {
    var fpsElement, times;

    fpsElement = document.getElementById("FPS");

    times = [ 0,0,0,0,0,
              0,0,0,0,0,
              0,0,0,0,0,
              0,0,0,0,0 ];

    return function () {
        times.shift();
        times.push(+new Date());
        fpsElement.innerHTML = Math.round(19000 / (times[19] - times[0])) + 'fps';
    };
}());

update = function (display, world) {
    var origin, b, i, bullets = world.bullets;

    while (bullets.length < world.MAX_BULLETS) {
        origin = new Vector2D.random(display.width, display.height);
        makeCluster(World, origin);
    }

    display.clear();
    
    i = bullets.length;

    while (i--) {
        b = bullets[i];
        b.update(world);
        b.draw(display);
    }

    updateFps();
};

new Display({
    images: {
        'bullet': "img/bullet.png"
    },

    onLoad: function (display) {
        // start updating
        document.getElementById('DisplayWrapper').appendChild(display.canvas);
        window.setInterval(function () {
            update(display, World);
        }, 1000 / 60);
    }
});

}.call(null));
