/* globals require:false, module:false */
(function(){
  "use strict";

  var _ = require("underscore");

  module.exports = function(grunt) {

    var jshintrc = grunt.file.readJSON('.jshintrc'),
        pkg = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
      // Metadata.
      pkg: pkg,
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
        html: ['_site/*.html']
      },

      usemin: {
        html: ['_site/*.html'],
        css: ['_site/css/*.css']
      },

      clean: {
        tmp: '.tmp', 
        build: ['dist']
      },

      copy: {
        dist: {
          files: [{
            expand: true,
            cwd: 'dist',
            dest: '_site',
            src: [
              'js/**',
              'css/**'
            ]
          }]
        }
      },

      cdn: {
        options: {
          cdn: '<%= pkg.homepage %>',
          flatten: true
        },
        dist: {
          cwd: '_site',
          dest: '_site',
          src: ['*.html']
        }
      },
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
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-cdn');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-jekyll');

    // Default task.
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

    grunt.registerTask('build', [
      'clean',
      'jekyll',
      'less',
      'useminPrepare',
      'concat',
      'cssmin',
      'uglify',
      'usemin',
      'cdn:dist',
      'copy:dist'
    ]);

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
