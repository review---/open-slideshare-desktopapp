module.exports = function(grunt){
    grunt.initConfig({
        clean: ["OpenSlideshare-darwin-x64", "OpenSlideshare-win32-x64", "OpenSlideshare.dmg"],
        shell: {
            build_mac: {
                command: 'electron-packager . OpenSlideshare --platform=darwin --arch=x64 --version=0.30.0 --icon=OpenSlideshare.icns --overwrite'
            },
            build: {
                command: 'electron-packager . OpenSlideshare --platform=darwin,win32 --arch=x64 --version=0.30.0 --icon=OpenSlideshare.icns --overwrite'
            },
            mac: {
                command: 'hdiutil create -ov -srcfolder ./OpenSlideshare-darwin-x64 -fs HFS+ -format UDZO -imagekey zlib-level=9 -volname "OpenSlideshare" OpenSlideshare.dmg'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('default', ['watch']);
};
