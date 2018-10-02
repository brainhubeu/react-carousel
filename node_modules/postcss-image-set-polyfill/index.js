var postcss = require('postcss');
var mediaParser = require('postcss-media-query-parser').default;

var DPI_RATIO = 96;

// get the list of images
var extractList = function(value) {
    var stripped = value.replace(/(\r\n|\n)/g, '');
    var inside = stripped.match(/image-set\(([\s\S]+)\)/)[1];
    return postcss.list.comma(inside);
};

// get the size of image
var extractSize = function(image) {
    var l = postcss.list.space(image);
    if(l.length === 1) {
        return DPI_RATIO;
    }
    var m = l[1].match(/^([0-9|\.]+)(dpi|x)$/);
    if (m) {
        return Math.floor(m[1] * (m[2] !== 'x' || DPI_RATIO));
    }
    throw 'Incorrect size value';
};

// get the url of an image
var extractUrl = function(image) {
    var url = postcss.list.space(image)[0];
    return url.match(/url\(/) || url.match(/image\(/) ?
        url :
        'url(' + url + ')';
};

// split url and size
var split = function(image) {
    return {
        size: extractSize(image),
        url:  extractUrl(image)
    }
};

var getSuffix = function(value) {
    var beautifiedlVal = value.replace(/(\n|\r)\s+/g, ' ');
    return  /.*\)(.*)/.exec(beautifiedlVal)[1];
};

module.exports = postcss.plugin('postcss-image-set-polyfill', function() {
    return function(css) {
        css.walkDecls(/^(background-image|background)$/, function(decl) {

            // ignore nodes we already visited
            if (decl.__visited) {
                return;
            }

            // make sure we have image-set
            if (!decl.value || decl.value.indexOf('image-set') === -1) {
                return;
            }

            var commaSeparatedValues = postcss.list.comma(decl.value);
            var mediaQueryList = [];

            var parsedValues = commaSeparatedValues.map(function(value) {
                var result = {};

                if (value.indexOf('image-set') === -1) {
                    result.default = value;
                    return result;
                }

                var images = extractList(value).map(split);

                // remember other part of property if it's 'background' property
                var suffix = decl.prop === 'background' ? getSuffix(value) : '';

                result.default = images[0].url + suffix;

                // for each image add a media query
                if (images.length > 1) {
                    images.forEach(function(img) {
                        if (img.size !== DPI_RATIO) {
                            if (mediaQueryList.indexOf(img.size) === -1) {
                                mediaQueryList.push(img.size);
                            }
                            result[img.size] = img.url + suffix;
                        }
                        else {
                            result.default = img.url + suffix;
                        }
                    });
                }

                return result;
            });

            // add the default image to the decl
            decl.value = parsedValues.map(function(val) { return val.default; }).join(',');

            // check for the media queries
            var media = decl.parent.parent.params;
            var parsedMedia = media && mediaParser(media);

            mediaQueryList
                .sort()
                .forEach(function(size) {
                    var minResQuery = '(min-resolution: ' + size + 'dpi)';

                    var paramStr = parsedMedia ?
                        parsedMedia.nodes.map(function(queryNode) { return queryNode.value + ' and ' + minResQuery; }).join(',') :
                        minResQuery;

                    var atrule = postcss.atRule({
                        name: 'media',
                        params: paramStr
                    });

                    // clone empty parent with only relevant decls
                    var parent = decl.parent.clone({
                        nodes: []
                    });

                    var d = decl.clone({
                        value: parsedValues.map(function(val) { return val[size] || val.default; }).join(',')
                    });

                    // mark nodes as visited by us
                    d.__visited = true;

                    parent.append(d);
                    atrule.append(parent);

                    decl.root().append(atrule);
                });
        });
    }
});
