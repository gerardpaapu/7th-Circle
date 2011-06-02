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
    Display.prototype.__compiled = {};

    Display.prototype.workingBuffer = null;

    Display.prototype.draw = function (key, _x, _y) {
        var fn; 
        if ((fn = this.__compiled[key])) {
            fn(_x, _y, this.workingBuffer.data);
        }
    };

    Display.prototype.compileSprite = function (key) {
        var source = this.data_cache[key],
            width = source.width,
            height = source.height,
            code = "",
            x, y, i, j;

        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                // i is the index to start reading from
                // j is the index to start writing from
                i = 4 * (y * width + x);  

                if (source.data[ i + 3 ] !== 0) {
                    // if the alpha byte of the source isn't 0
                    code += [
                        "j = 4 * ((" + x + " + _y) * " + this.width + " + " + x + " + _x);",
                        "buff[j++] = " + source.data[i++] + "; // copy red",
                        "buff[j++] = " + source.data[i++] + "; // copy green",
                        "buff[j++] = " + source.data[i++] + "; // copy blue",
                        "buff[j] = 255; // set alpha to 100%\n"
                    ].join('\n');
                }
            }
        }

        code =  [
            "(function (_x, _y, buff) {",
            "var j;",
            code,
            "})"
        ].join('\n');
        console.log(code);
        this.__compiled[key] = eval(code);
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
