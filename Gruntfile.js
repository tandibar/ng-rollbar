var src = ['./ng-rollbar.js'];
var dst = './ng-rollbar.js';

var lodash = require('lodash');

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: src
    },
    releaseToBower: {
      options: {
        npm: false,
        npmtag: false,
        file: 'bower.json'
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      app: {
        files: {
          'ng-rollbar.min.js': src
        },
      },
    },
    uglify: {
      options: {
        mangle: true
      },
      my_target: {
        files: {
          'ng-rollbar.min.js': ['ng-rollbar.min.js']
        }
      }
    },
    gitcommit: {
      'for-release': {
        options: {
          message: 'adding generated files for release preparation'
        },
        files: {
          src: [dst, 'ng-rollbar.min.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('default', ['jshint']);

  grunt.renameTask('release', 'releaseToBower');
  grunt.registerTask('release', function(major_minor_patch){
    major_minor_patch = major_minor_patch || 'patch';
    grunt.task.run([
      'jshint',
      'ngAnnotate',
      'uglify',
      'gitcommit',
      'releaseToBower:' + major_minor_patch
    ]);
  });
}
