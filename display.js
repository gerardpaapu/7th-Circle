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
        this.loadImages();
    };

    defaults = {
        width: 320,
        height: 440,
        id: "Display",
        images: {},
        onProgress: function () {},
        onLoad: function () { }
    };

    Display.prototype.clear = function (x, y, width, height) {
        x = x || 0;
        y = y || 0;
        width = width || this.canvas.width;
        height = height || this.canvas.height;

        this.context.clearRect(x, y, width, height);
    };

    Display.prototype.image_data = {};

    Display.prototype.draw = function (key, x, y) {
        var data = this.image_data[key];

        if (data) {
            this.context.putImageData(data, x, y);
        }
    };

    Display.prototype.loadImages = function () {
        var key, value, display, images, loadImage, waiting, onProgress, onComplete;

        waiting = keys(images).length;
        images = this.options.images;
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

            display.image_data[key] = data; 
            display.options.onProgress(key, data);
            
            if (waiting === 0) {
                display.options.onLoad.call(display, display);
            }
        };

        for (key in images) {
            value = images[key];

            switch (type( value )) {
                case "string":
                    loadImage(key, value);
                    break;
                case "array":  
                    loadImage.apply(undef, [key].concat(value));
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

    return Display;
}.call(null));
