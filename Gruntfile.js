var src = ['./ng-rollbar.js'];
var dst = './ng-rollbar.js';

var lodash = require('lodash');
var https = require('https');
var fs = require('fs'),
byline = require('byline');

module.exports = function(grunt) {

  grunt.initConfig({
    bwr: grunt.file.readJSON('bower.json'),
    jshint: {
      files: src
    },
    release: {
      options: {
        npm: true,
        npmtag: false,
        commit: false,
        file: 'package.json',
        additionalFiles: ['bower.json'],
        beforeBump: ['fail', 'jshint'],
        afterBump: [
          'ngAnnotate',
          'uglify',
          'gitcommit:for-release'
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
          src: [dst, 'bower.json', 'package.json', 'ng-rollbar.min.js', 'ng-rollbar.min.js.map']
        }
      },
      'lib-update': {
        options: {
          message: 'integrated rollar snippet in version <here-to-be-specific-version>'
        },
        files: {
          src: [dst]
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

  grunt.registerTask('update-lib', 'integrate a new rollbar client lib version', function(version) {
    // Tell grunt this task is asynchronous.
    var done = this.async();

    grunt.log.writeln("starting update-lib with version: " + version);
    var url = "https://raw.githubusercontent.com/rollbar/rollbar.js/v" + version + "/dist/rollbar.snippet.js";
    grunt.log.writeln("requesting '" + url + "' ...");
    var lib = "";
    https.get(url, function(res) {
      grunt.log.writeln("Got response: " + res.statusCode);
      res.on('data', function(snippet) {

        var stream = byline(fs.createReadStream(dst, { encoding: 'utf8' }), { keepEmptyLines: true });
        var newFileContent = "";

        var waiting = false;
        stream.on('data', function(line) {
          if(line.indexOf("/* rollbar client lib end */") > -1) {
            grunt.log.writeln("found /* rollbar client lib end */")
            waiting = false;
          }

          if(!waiting) { newFileContent += line + "\n" }

          if(line.indexOf("/* rollbar client lib start */") > -1) {
            grunt.log.writeln("found /* rollbar client lib start */")
            grunt.log.writeln("inserting new lib snippet")
            waiting = true;
            newFileContent += '        // ' + url + "\n"
            newFileContent += '        ' + snippet + "\n"
          }
        });

        stream.on('end', function() {
          grunt.log.writeln("overwriting ng-rollbar.js with new lib");
          fs.writeFile(dst, newFileContent.trim() + "\n");

          // commit changes
          grunt.config('gitcommit.lib-update.options.message', "integrated rollbar snippet in version " + version);
          grunt.task.run('gitcommit:lib-update');

          done();
        });
      });
    }).on('error', function(e) {
      grunt.log.writeln("Got error: " + e.message);
    });
  });

  grunt.registerTask('help', 'display help message', function() {
    grunt.log.writeln("How to release a new version");
    grunt.log.writeln("----------------------------");
    grunt.log.writeln();
    grunt.log.writeln("1. upgrade the lib by doing");
    grunt.log.writeln("  $> grunt update-lib:1.x.y");
    grunt.log.writeln();
    grunt.log.writeln("2. release");
    grunt.log.writeln("  $> grunt release (major/minor/patch)");
  });
}
