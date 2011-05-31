/*globals GameEntity: false, World: false, Bullet: false, Vector2D: false, Rect: false, Display: false */
(function () {

var World, makeCluster, update, updateFps, angles;

World = {
    bounds: new Rect(new Vector2D(0, 0), 320, 460),
    entities: []
};

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
    for (i = min; i < max; i += 4) {
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
    var bullets = world.entities,
        MAX_BULLETS = 200,
        origin, b, i; 

    while (bullets.length < MAX_BULLETS) {
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
        }, 1000 / 100);
    }
});

}.call(null));
