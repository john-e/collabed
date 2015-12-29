module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            public: {
              src: [ 'public/**/*' ],
              filter: 'isFile'
            },
            compiledJS: {
                src: [ 'assets/js/compiled.js' ],
                filter: 'isFile'
            }
        },
        browserify: {
            options: {
                transform:  [
                    [ "babelify", { presets: [ "es2015", "react" ] } ]
               ]
            },
            app: {
                src: [ 'assets/**/*.js','assets/**/*.jsx' ],
                dest: 'assets/js/compiled.js'
            }
        },
        uglify: {
            app: {
                files: {
                    'public/js/main.js': [ 'assets/js/compiled.js' ]
                }
            }
        },
        watch: {
            files: [ 'assets/**/*.js', 'assets/**/*.jsx', '!assets/js/compiled.js' ],
            tasks: [ 'browserify', 'uglify', 'clean:compiledJS' ]
        }
    });

    //load Tasks
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    grunt.registerTask('default', ['clean', 'browserify', 'uglify', 'clean:compiledJS', 'watch']);
};