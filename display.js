var Display;
(function (){
    var defaults, merge, type, keys, hasOwn, undef;
   
    Display = function (options) {
        this.options = options = merge(defaults, options || {});

        this.canvas = document.createElement('canvas'); 
        this.width = this.canvas.width = options.width;
        this.height = this.canvas.height = options.height;
        this.canvas.id = options.id;

        this.context = this.canvas.getContext('2d');
        this.workingBuffer = this.context.createImageData(this.width, this.height);
        this.loadImages();
    };

    defaults = {
        width: 320,
        height: 440,
        id: "Display",
        images: {},
        onProgress: function () {},
        onLoad: function () {}
    };

    Display.prototype.clear = function (x, y, width, height) {
        this.workingBuffer = this.context.createImageData(this.width, this.height);
    };

    Display.prototype.data_cache = {};

    Display.prototype.workingBuffer = null;

    Display.prototype.draw = function (key, _x, _y) {
        var source = this.data_cache[key],
            _width = this.width,
            point_source, point_dest, isTransparent, copyPixel,
            i, j, workingBuffer;

        workingBuffer = this.workingBuffer;

        point_source = function (x, y) {
            return y * source.width + x;
        };

        point_dest = function (x, y) {
            return (y + _y) * _width + x + _x; 
        };

        isTransparent = function (x, y) {
            return source.data[ point_source(x, y) * 4 + 3] === 0; 
        };

        copyPixel = function (x, y) {
            var i = point_source(x, y) * 4,
                j = point_dest(x, y)   * 4;

            workingBuffer.data[j++] = source.data[i++];
            workingBuffer.data[j++] = source.data[i++];
            workingBuffer.data[j++] = source.data[i++];
            workingBuffer.data[j] = 255;
        };

        for (i = 0; i < source.width; i++) {
            for (j = 0; j < source.height; j++) {
                if (!isTransparent(i, j)) {
                    copyPixel(i, j);
                }
            }
        }
    };

    Display.prototype.update = function () {
        this.context.putImageData(this.workingBuffer, 0, 0);
    };

    Display.prototype.loadImages = function () {
        var key, v, display, images, loadImage, waiting, onProgress;

        images = this.options.images;
        waiting = keys(images).length;
        display = this;

        loadImage = function (key, url, x, y, width, height) { 
            var image;
            x = x || 0;
            y = y || 0;

            image = document.createElement('img'); 
            image.src = url;
            image.onload = function () {
                var ctx = display.context;
                ctx.clearRect(0, 0, this.width, this.height);
                ctx.drawImage(this, 0, 0);        
                onProgress(key, ctx.getImageData(x, y, width || this.width, height || this.height));
            };
        };

        onProgress = function (key, data) {
            waiting--;    

            display.data_cache[key] = data; 
            display.options.onProgress(key, data);
            
            if (waiting === 0) {
                display.options.onLoad.call(display, display);
            }
        };

        for (key in images) {
            v = images[key];

            switch (type( v )) {
                case "string":
                    loadImage(key, v);
                    break;
                case "array":  
                    loadImage(key, v[0], v[1], v[2], v[3], v[4]);
                    break;
            }
        } 
    };

    hasOwn = {}.hasOwnProperty;

    merge = function () {
        var i = 0,
            len = arguments.length,
            result = {},
            key, source;

        for (; i < len; i++) {
           source = arguments[i];
           for (key in source) {
               if (hasOwn.call(source, key)) {
                   result[key] = source[key];
               }
           }
        }

        return result;
    };

    keys = Object.keys || function (o) {
        var key, result = [];
        for (key in o) {
            if (hasOwn.call(o, key)) {
                result.push(key);
            }
        }
    };

    type = function (o) {
        return o == undef ? String(o)
            :  {}.toString.call(o).slice(8, -1).toLowerCase();
    };
}.call(null));
