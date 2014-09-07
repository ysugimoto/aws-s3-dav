module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            js: {
                src: [
                      'app/js/head.js',
                      'app/js/setting.js',
                      'app/js/sidemenu.js',
                      'app/js/breadcrumb.js',
                      'app/js/layer.js',
                      'app/js/awsbucket.js',
                      'app/js/awsitemlist.js',
                      'app/js/awsitem.js',
                      'app/js/filelist.js',
                      'app/js/filedetail.js',
                      'app/js/dragdrop.js',
                      'app/js/modal.js',
                      'app/js/main.js'
                ],
                dest: 'asset/js/app.min.js'
            },
            css: {
                src: ['app/css/bootstrap.css', 'app/css/app.css'],
                dest: 'asset/css/app.min.css'
            }
        },
        
        uglify: {
            dist: {
                files: {
                    'asset/js/app.min.js': ['asset/js/app.min.js']
                }
            }
        },

        cssmin: {
            files: {
                'asset/css/app.min.css': ['asset/css/app.min.css']
            }
        },
        
        nodewebkit: {
            src: ['node_modules', 'index.html', 'package.json', 'asset'],
            name: 'aws-s3-dav'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-node-webkit-builder');

    grunt.registerTask('default', ['concat', 'nodewebkit']);
    grunt.registerTask('deploy', ['concat', 'uglify', 'cssmin', 'nodewebkit']);

};
