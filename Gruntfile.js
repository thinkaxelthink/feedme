/* globals require:false, module:false */
(function(){
  "use strict";

  var _ = require("underscore");

  module.exports = function(grunt) {

    var jshintrc = grunt.file.readJSON('.jshintrc');

    // Project configuration.
    grunt.initConfig({
      // Metadata.
      pkg: grunt.file.readJSON('package.json'),
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
      // Task configuration.
      useminPrepare: {
        options: {
          banner: '<%= banner %>',
          stripBanners: true,
          dest: "dist"
        },
        html: ['.tmp/index.html']
      },
      usemin: {
        html: ['dist/index.html'],
        css: ['dist/**/*.css']
      },
/*      concat: {
        options: {
          banner: '<%= banner %>',
          stripBanners: true
        },
        dist: {
          src: ['lib/<%= pkg.name %>.js'],
          dest: 'dist/<%= pkg.name %>.js'
        }
      },
      uglify: {
        options: {
          banner: '<%= banner %>'
        },
        dist: {
          src: '<%= concat.dist.dest %>',
          dest: 'dist/<%= pkg.name %>.min.js'
        }
      },
*/
      connect: {
        dev: {
          options: {
            base: '_site',
            port: 4000,
            open: true,
            hostname: '*',
            livereload: true
          }
        }
      },
      less: {
        dist: {
          files: {
            '_site/stylesheets/app.css': 'less/app.less'
          }
        }
      },
      jekyll: {
        dev: {
          doctor: true
        }
      },
      jshint: {
        options: jshintrc,
        configuration: {
          files: {
            src: ['Gruntfile.js']
          }
        }
      },
      watch: {
        /*configs: {
          files: '<%= jshint.gruntfile.src %>',
          tasks: ['jshint:configuration']
        },*/
        js: {
          files: 'js/**',
          tasks: ['jekyll:dev', 'less']
        },
        css: {
          files: 'less/**',
          tasks: ['less']
        },
        html: {
          files: ['_includes/**', '_layouts/**', '_posts/**'],
          tasks: ['jekyll:dev', 'less']
        }
      }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-jekyll');

    // Default task.
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

    grunt.registerTask('dev', 'Set up a development environment', function() {
      grunt.option('force', true);
      grunt.task.run([
        'jekyll',
        'less',
        'connect:dev',
        'watch'
      ]);
    });

  };
})();
