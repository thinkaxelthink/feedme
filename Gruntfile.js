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
        html: ['views/_layouts/*.html']
      },

      usemin: {
        html: ['_layouts/default.html']
        //css: ['_site/css/*.css']
      },

      clean: {
        tmp: '.tmp', 
        build: [
          '_site',
          '_posts',
          '_layouts',
          '_includes',
          'css',
          'dist'
        ]
      },

      copy: {
        tmp: {
        },
        dist: {
          files: [{
            expand: true,
            cwd: 'dist',
            dest: '.',
            src: [
              'assets/**'
            ]
          },
          {
            expand: true,
            cwd: 'views',
            dest: '.',
            src: [
              '_layouts/**',
              '_posts/**',
              '_includes/**',
              'index.html'
            ]
          },
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist',
            dest: 'assets',
            src: ['fonts/**']
          }]
        }
      },

      cdn: {
        options: {
          cdn: '{{ site.url }}',
          flatten: true
        },
        dist: {
          cwd: '_layouts',
          dest: '_layouts',
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
            'css/app.css': 'less/app.less'
          }
        }
      },

      jekyll: {
        dev: {
          options: {
            config: '_config.dev.yml'
          }
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
          tasks: ['build']
        },
        css: {
          files: 'less/**',
          tasks: ['build']
        },
        html: {
          files: ['views/**'],
          tasks: ['build']
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
      'less',
      'useminPrepare',
      'concat',
      'cssmin',
      'uglify',
      'copy:dist',
      'usemin',
      'cdn:dist'
    ]);

    grunt.registerTask('dev', 'Set up a development environment', function() {
      grunt.option('force', true);
      grunt.task.run([
        'build',
        'jekyll',
        'connect:dev',
        'watch'
      ]);
    });

  };
})();
