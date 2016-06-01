module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    folders: {
      webapp: {
        root: 'app/',
        build: 'dist/'
      }
    },

    banner: '/*!\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
		' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
		' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n*/\n',

    ngtemplates: {
      sharedApp: {
        cwd: '<%= folders.webapp.root %>',
        src: ['**/*.html'],
        dest: '<%= folders.webapp.build %>/js/templates.js',
        options: {
					htmlmin: {
						collapseBooleanAttributes: true,
						collapseWhitespace: true,
						removeAttributeQuotes: true,
						removeComments: true,
						removeEmptyAttributes: true,
						removeRedundantAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true
					},
					// Return only file name
					url: function (url) {
						var path = url.split('/');
						return path[path.length - 1];
					}
        }
      }
    },

    bower_concat: {
      all: {
        dest: '<%= folders.webapp.build %>/js/lib.js',
        dependencies: {
          'jquery-ui': 'jquery',
        },
        mainFiles: {
          'jquery-ui': ['ui/core.js', 'ui/widget.js', 'ui/mouse.js', 'ui/sortable.js']
        }
      }
    },

    concat: {
      // sharedApp module files + shared AJS services
      jsShared: {
        src: [
					'<%= folders.webapp.root %>/shared/helpers/**/*.js',
					'<%= folders.webapp.root %>/shared/entities/**/*.js',
					'<%= folders.webapp.root %>/shared/sharedApp.js',
					'<%= folders.webapp.root %>/shared/controllers/*.js',
					'<%= folders.webapp.root %>/shared/directives/*.js',
					'<%= folders.webapp.root %>/shared/filters/*.js',
					'<%= folders.webapp.root %>/services/**/*.js',
					'<%= ngtemplates.sharedApp.dest %>'
				],
        dest: '<%= folders.webapp.build %>/js/sharedApp.js'
      },
      // AJS configuration files, separated so that they can be excluded in JS testing
      jsConfig: {
        src: [
					'<%= folders.webapp.root %>/shared/exceptionHandler.js',
					'<%= folders.webapp.root %>/shared/sharedConstants.js',
					'<%= folders.webapp.root %>/shared/sharedInterceptors.js'
				],
        dest: '<%= folders.webapp.build %>/js/sharedConfig.js'
      },
      // coursesApp module files
      jsCourses: {
        src: [
					'<%= folders.webapp.root %>/courses/*.js',
					'<%= folders.webapp.root %>/courses/**/*.js'
				],
        dest: '<%= folders.webapp.build %>/js/coursesApp.js'
      },
      // adminApp module files
      jsAdmin: {
				src: [
					'<%= folders.webapp.root %>/admin/*.js',
					'<%= folders.webapp.root %>/admin/**/*.js'
				],
				dest: '<%= folders.webapp.build %>/js/adminApp.js'
      },
      // workgroupApp module files
      jsWorkgroup: {
				src: [
					'<%= folders.webapp.root %>/workgroup/*.js',
					'<%= folders.webapp.root %>/workgroup/**/*.js'
				],
				dest: '<%= folders.webapp.build %>/js/workgroupApp.js'
      },
      // summaryApp module files
      jsSummary: {
				src: [
					'<%= folders.webapp.root %>/summary/*.js',
					'<%= folders.webapp.root %>/summary/**/*.js'
				],
				dest: '<%= folders.webapp.build %>/js/summaryApp.js'
      },
      // assignmentsApp module files
      jsAssignments: {
				src: [
					'<%= folders.webapp.root %>/assignments/*.js',
					'<%= folders.webapp.root %>/assignments/**/*.js'
				],
				dest: '<%= folders.webapp.build %>/js/assignmentsApp.js'
      },
      // teachingCallApp module files
      jsTeachingcall: {
				src: [
					'<%= folders.webapp.root %>/teachingCall/*.js',
					'<%= folders.webapp.root %>/teachingCall/**/*.js'
				],
				dest: '<%= folders.webapp.build %>/js/teachingCallApp.js'
      },
      // schedulingApp module files
      jsScheduling: {
				src: [
					'<%= folders.webapp.root %>/scheduling/*.js',
					'<%= folders.webapp.root %>/scheduling/**/*.js'
				],
				dest: '<%= folders.webapp.build %>/js/schedulingApp.js'
      },
      // Vendor CSS files
      cssLib: {
				src: [
					'bower_components/bootstrap/dist/css/bootstrap.css',
					'bower_components/fullcalendar/dist/fullcalendar.css',
					'bower_components/ng-notify/dist/ng-notify.min.css'
				],
				dest: '<%= folders.webapp.build %>/css/lib.css'
      }
    },

    copy: {
      img: {
        expand: true,
        cwd: '<%= folders.webapp.root %>/images/',
        src: ['**/**/*'],
        dest: '<%= folders.webapp.build %>images/'
      },
      fonts: {
        expand: true,
        flatten: true,
        cwd: 'bower_components/bootstrap/dist/fonts/',
        src: ['**/**/*'],
        dest: '<%= folders.webapp.build %>/fonts/'
      },
      css: {
        expand: true,
        flatten: true,
        cwd: '<%= folders.webapp.root %>',
        src: ['**/*.css'],
        dest: '<%= folders.webapp.build %>/css/'
      },
      map: {
        src: 'bower_components/bootstrap/dist/css/bootstrap.css.map',
        dest: '<%= folders.webapp.build %>/css/bootstrap.css.map',
      }
    },

    uglify: {
			dev: {
				options: {
					mangle: false,
					beautify: true
				},
				files: [{
					expand: true,
					cwd: '<%= folders.webapp.build %>/js/',
					src: ['*.js'],
					dest: '<%= folders.webapp.build %>/js/',
					ext: '.js'
				}]
			},
			dist: {
				options: {
					banner: '<%= banner %>',
					compress: true,
					mangle: false,
					preserveComments: false,
					report: 'min'
				},
				files: [{
					expand: true,
					cwd: '<%= folders.webapp.build %>/js/',
					src: ['*.js'],
					dest: '<%= folders.webapp.build %>/js/',
					ext: '.js'
				}]
			}
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
				files: [{
					expand: true,
					cwd: '<%= folders.webapp.build %>/css/',
					src: ['*.css'],
					dest: '<%= folders.webapp.build %>/css/',
					ext: '.css'
				}]
      }
    },

    watch: {
      js: {
        files: ['Gruntfile.js', '<%= folders.webapp.root %>/**/*.js'],
        tasks: ['concat']
      },
      templates: {
        files: ['<%= folders.webapp.root %>/**/*.html'],
        tasks: ['ngtemplates', 'concat']
      },
      css: {
        files: '<%= folders.webapp.root %>/**/*.css',
        tasks: ['concat:cssShared', 'copy:css']
      }

    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('build', ['copy', 'ngtemplates', 'bower_concat', 'concat', 'uglify:dist', 'cssmin']);
  grunt.registerTask('serve', ['copy', 'ngtemplates', 'bower_concat', 'concat']);
  grunt.registerTask('default', ['build']);

};
