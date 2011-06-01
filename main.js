/*globals GameEntity: false, World: false, Bullet: false, Vector2D: false, Rect: false, Display: false, $: false */
(function () {

var World, makeCluster, update, updateFps, angles;

World = {
    bounds: new Rect(new Vector2D(0, 0), 320, 460),
    entities: []
};

makeCluster = function (world, origin) {
    var bullet, i, min = 15, max = 35;
    for (i = min; i < max; i += 4) {
        if ((bullet = new Bullet(world, origin))) {
            bullet.velocity = Vector2D.fromAngle(i).scale(5);
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

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
}, true);

$.gesture({
    element: $("#MainContainer"),

    bind: $("#Position"),

    start: function (e, point) {
        this.innerHTML = "started";
    },

    move: function (e, point) {
        this.innerHTML = [point.x, point.y].join(', ');
    },

    end: function (e, point) {
        this.innerHTML = "off screen";
    }
});

new Display({
    width: 320,
    height: 420,

    images: {
        'bullet': "img/bullet.png"
    },

    onLoad: function (display) {
        // start updating
        $('#DisplayWrapper').appendChild(display.canvas);

        window.setInterval(function () {
            update(display, World);
        });
    }
});

}.call(null));
