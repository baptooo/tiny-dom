module.exports = function(grunt) {
    grunt.initConfig({
        connect: {
            local: {
                options: {
                    hostname: '*',
                    port: 1990,
                    keepalive: true
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/tiny-dom.min.js': ['src/tiny-dom.js'],
                    'dist/tiny-dom-tpl.min.js': ['src/tiny-dom-tpl.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('serve', ['connect']);

    grunt.registerTask('dist', ['uglify']);
}