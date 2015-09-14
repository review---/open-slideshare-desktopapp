module.exports = function(grunt){
    grunt.initConfig({
        clean: ["OpenSlideshare-darwin-x64", "OpenSlideshare-win32-x64", "OpenSlideshare.dmg"],
        shell: {
            build_mac: {
                command: './node_modules/.bin/electron-packager . OpenSlideshare --platform=darwin --arch=x64 --version=0.30.0 --icon=OpenSlideshare.icns --overwrite'
            },
            build: {
                command: './node_modules/.bin/electron-packager . OpenSlideshare --platform=darwin,win32 --arch=x64 --version=0.30.0 --icon=OpenSlideshare.icns --overwrite'
            },
            mac: {
                command: 'hdiutil create -ov -srcfolder ./OpenSlideshare-darwin-x64 -fs HFS+ -format UDZO -imagekey zlib-level=9 -volname "OpenSlideshare" OpenSlideshare.dmg'
            }
        },
        'http-server': {
            'dev': {
                root: "./",
                port: 8282,
                host: "127.0.0.1",
                cache: 1,
                showDir : true,
                autoIndex: true,
                ext: "html",
                runInBackground: false,
                logFn: function(req, res, error) { },
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.registerTask('default', ['watch']);
};
