var path = require('path');

var gutil = require('gulp-util');
var through2 = require('through2');

var JSONExplodeError = gutil.PluginError.bind(null, 'gulp-json-explode');


var jsonExplode = function jsonExplode () { 'use strict';
    return through2.obj(function jsonExplodeStream (file, encoding, done) {
        var source, key;
        var base = file.base;

        if (file.isBuffer()) {
            try { source = JSON.parse(file.contents.toString()); }
            catch (e) {
                if (e instanceof SyntaxError) return done(new JSONExplodeError
                    ( "This isn't a valid JSON file. File: " + file.relative + '.'
                    ));
                else throw e;
                }

            if (typeof source != 'object') return done(new JSONExplodeError
                ( 'The JSON file must contain an object. File: ' + file.relative + '.'
                ));

            for (key in source) if (source.hasOwnProperty(key)) {
                this.push(new gutil.File(
                    { base: base
                    , path: path.join(base, key + '.json')
                    , cwd: file.cwd
                    , contents: new Buffer(JSON.stringify(source[key]))
                    }));
                }
            }

        else if (file.isStream()) return done(new JSONExplodeError
            ( 'Streams not supported'
            ));

        else {
            this.push(file);
            return done();
            }
        });
    };


module.exports = jsonExplode;
