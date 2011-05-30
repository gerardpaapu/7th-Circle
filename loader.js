var loader = function (opt) {
    var urls = opt.urls || [],
        onComplete = opt.onLoad || function (){},
        onProgress = opt.onProgress || function (){},
        maxWidth = opt.maxWidth || 600,
        maxHeight = opt.maxHeight || 600,
        count = urls.length,
        result = {},
        progress, canvas, ctx;

    canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    ctx = canvas.getContext('2d');

    progress = function (url, data) {
        result[url] = data;

        onProgress(url, data);

        count--;

        if (count < 1) {
            onComplete(result);
        }
    };

    urls.forEach(function (url) {
        var img = document.createElement('img');

        img.src = url;
        img.onload = function () {
            ctx.clearRect(0, 0, img.width, img.height);
            ctx.drawImage(img, 0, 0);
            progress(url, ctx.getImageData(0, 0, img.width, img.height)); 
        };
    });

    if (count === 0) {
        onComplete(result);
    }
};
