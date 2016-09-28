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
		' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n*/\n',

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
				}
			}
		},

		concat: {
			// sharedApp module files + shared AJS services
			jsShared: {
				src: [
					'<%= folders.webapp.root %>/shared/helpers/**/*.js',
					'<%= folders.webapp.root %>/shared/entities/**/*.js',
					'<%= folders.webapp.root %>/shared/sharedReducers.js',
					'<%= folders.webapp.root %>/shared/sharedApp.js',
					'<%= folders.webapp.root %>/shared/controllers/*.js',
					'<%= folders.webapp.root %>/shared/directives/*.js',
					'<%= folders.webapp.root %>/shared/filters/*.js',
					'<%= folders.webapp.root %>/shared/services/**/*.js',
					'<%= ngtemplates.sharedApp.dest %>'
				],
				dest: '<%= folders.webapp.build %>/js/sharedApp.js'
			},
			// Configuration files, separated so that they can be excluded in JS testing
			jsConfig: {
				src: [
					'clientConfig.js',
					'<%= folders.webapp.root %>/shared/exceptionHandler.js',
					'<%= folders.webapp.root %>/shared/sharedInterceptors.js',
					'<%= folders.webapp.root %>/shared/konami.js'
				],
				dest: '<%= folders.webapp.build %>/js/sharedConfig.js'
			},
			// Production Snippets from various 3rd party services
			jsProdSnippets: {
				src: [
					'<%= folders.webapp.root %>/shared/userEcho.js',
					'<%= folders.webapp.root %>/shared/googleAnalytics.js'
				],
				dest: '<%= folders.webapp.build %>/js/snippets.js'
			},
			// Development Snippets from various 3rd party services
			jsDevSnippets: {
				src: [],
				dest: '<%= folders.webapp.build %>/js/snippets.js'
			},
			// courseApp module files
			jsCourse: {
				src: [
					'<%= folders.webapp.root %>/course/*.js',
					'<%= folders.webapp.root %>/course/**/*.js'
				],
				dest: '<%= folders.webapp.build %>/js/courseApp.js'
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
			// assignmentApp module files
			jsAssignment: {
				src: [
					'<%= folders.webapp.root %>/assignment/*.js',
					'<%= folders.webapp.root %>/assignment/**/*.js'
				],
				dest: '<%= folders.webapp.build %>/js/assignmentApp.js'
			},
			// schedulingApp module files
			jsScheduling: {
				src: [
					'<%= folders.webapp.root %>/scheduling/*.js',
					'<%= folders.webapp.root %>/scheduling/**/*.js'
				],
				dest: '<%= folders.webapp.build %>/js/schedulingApp.js'
			},
			// public module files
			jsPublic: {
				src: [
					'<%= folders.webapp.root %>/public/*.js',
					'<%= folders.webapp.root %>/public/**/*.js'
				],
				dest: '<%= folders.webapp.build %>/js/publicApp.js'
			},
			// Vendor CSS files
			cssLib: {
				src: [
					'bower_components/bootstrap/dist/css/bootstrap.css',
					'bower_components/fullcalendar/dist/fullcalendar.css',
					'bower_components/ng-notify/dist/ng-notify.min.css',
					'bower_components/angular-ui-select/dist/select.css',
					'bower_components/selectize/dist/css/selectize.default.css'
				],
				dest: '<%= folders.webapp.build %>/css/lib.css'
			}
		},

		copy: {
			html: {
				expand: true,
				flatten: true,
				cwd: '<%= folders.webapp.root %>',
				src: ['**/*.html'],
				dest: '<%= folders.webapp.build %>'
			},
			img: {
				expand: true,
				cwd: '<%= folders.webapp.root %>/assets/images/',
				src: ['**/**/*'],
				dest: '<%= folders.webapp.build %>images/'
			},
			font: {
				expand: true,
				flatten: true,
				cwd: '',
				src: [
					'<%= folders.webapp.root %>/assets/font/*'
				],
				dest: '<%= folders.webapp.build %>/font/'
			},
			fonts: {
				expand: true,
				flatten: true,
				cwd: '',
				src: [
					'bower_components/bootstrap/dist/fonts/*',
					'<%= folders.webapp.root %>/assets/fonts/*'
				],
				dest: '<%= folders.webapp.build %>/fonts/'
			},
			css: {
				expand: true,
				flatten: true,
				cwd: '<%= folders.webapp.root %>',
				src: ['**/*.css'],
				dest: '<%= folders.webapp.build %>/css/'
			},
			public_assets: {
				expand: true,
				flatten: false,
				cwd: '<%= folders.webapp.root %>',
				src: ['public/assets/*/**'],
				dest: '<%= folders.webapp.build %>/'
			},
			// Common Vendor JS files
			js: {
				expand: true,
				flatten: true,
				cwd: '<%= folders.webapp.root %>/assets/js',
				src: ['**/*.js'],
				dest: '<%= folders.webapp.build %>/js/'
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
				files: ['Gruntfile.js', 'bower.json', 'clientConfig.js', '<%= folders.webapp.root %>/**/*.js'],
				tasks: ['concat']
			},
			templates: {
				files: ['<%= folders.webapp.root %>/**/*.html'],
				tasks: ['ngtemplates', 'concat', 'copy']
			},
			css: {
				files: '<%= folders.webapp.root %>/**/*.css',
				tasks: ['copy:css']
			}

		},

		connect: {
			server: {
				options: {
					port: 9000,
					base: 'dist',
					middleware: function (connect, options, middlewares) {
						var modRewrite = require('connect-modrewrite');
						// enable Angular's HTML5 mode
						middlewares.unshift(modRewrite([
							'^/admin.* /admin.html [L]',
							'^/workgroups.* /workgroup.html [L]',
							'^/summary.* /summary.html [L]',
							'^/courses.* /course.html [L]',
							'^/assignments.* /assignment.html [L]',
							'^/teachingCalls.* /teachingCall.html [L]',
							'^/scheduling.* /scheduling.html [L]',
						]));

						return middlewares;
					}
				}
			}
		},

		clean: {
			src: ['dist/*']
		},

		jshint: {
			options: {
				curly: true,
				eqnull: true,
				browser: true,
			},
			src: [
				'<%= folders.webapp.root %>/admin/**/*.js',
			]
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('build', ['clean', 'copy', 'ngtemplates', 'bower_concat', 'concat:jsShared', 'concat:jsConfig', 'concat:jsProdSnippets',
		'concat:jsCourse', 'concat:jsAdmin', 'concat:jsWorkgroup', 'concat:jsSummary', 'concat:jsAssignment', 'concat:jsScheduling', 'concat:jsPublic', 'concat:cssLib', 'uglify:dist', 'cssmin']);

	grunt.registerTask('serve', ['clean', 'jshint', 'copy', 'ngtemplates', 'bower_concat', 'concat:jsShared', 'concat:jsConfig', 'concat:jsDevSnippets',
		'concat:jsCourse', 'concat:jsAdmin', 'concat:jsWorkgroup', 'concat:jsSummary', 'concat:jsAssignment', 'concat:jsScheduling', 'concat:jsPublic', 'concat:cssLib', 'connect', 'watch']);

	grunt.registerTask('default', ['serve']);

};
