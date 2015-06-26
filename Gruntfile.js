var src = ['./ng-rollbar.js'];
var dst = './ng-rollbar.js';

var lodash = require('lodash');

module.exports = function(grunt) {

  grunt.initConfig({
    bwr: grunt.file.readJSON('bower.json'),
    jshint: {
      files: src
    },
    release: {
      options: {
        npm: false,
        npmtag: false,
        commit: false,
        file: 'bower.json',
        beforeBump: ['fail', 'jshint'],
        afterBump: [
          'ngAnnotate',
          'uglify',
          'gitcommit'
        ],
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
        mangle: true,
        sourceMap: true,
        banner: '/**\n' +
        ' * @license <%= bwr.name %> <%= bwr.version %> (<%= grunt.template.today("dd-mm-yyyy") %>)\n' +
        ' * (c) 2015 IdentPro GmbH\n' +
        ' * License: MIT\n' +
        ' */'
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
          src: [dst, 'bower.json', 'ng-rollbar.min.js', 'ng-rollbar.min.js.map']
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
}
