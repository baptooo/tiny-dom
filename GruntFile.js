/**
 * Created by PRO11_6 on 24/06/2014.
 */
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('serve', ['connect']);
}