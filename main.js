/*globals GameEntity */
(function () {
    var entities, canvas, ctx, game_over,
        i, j, k; 

    canvas    = document.getElementById('canvas');
    ctx       = canvas.getContext('2d');
    game_over = false;

    while (!game_over){
        entities  = GameEntity.instances;
        i = j = k = entities.length;

        while (i--) {
            entities[i].clear(ctx);
        }

        while (j--) {
            entities[j].update();
        }

        while (k--) {
            entities[k].draw(ctx);
        }
    }
}.call(null));
