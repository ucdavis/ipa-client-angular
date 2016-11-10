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
			},
			adminApp: {
				cwd: '<%= folders.webapp.root %>',
				src: ['admin/**/*.html'],
				dest: '<%= folders.webapp.build %>/js/adminTemplates.js'
			},
			assignmentApp: {
				cwd: '<%= folders.webapp.root %>',
				src: ['assignment/**/*.html'],
				dest: '<%= folders.webapp.build %>/js/assignmentTemplates.js'
			},
			courseApp: {
				cwd: '<%= folders.webapp.root %>',
				src: ['course/**/*.html'],
				dest: '<%= folders.webapp.build %>/js/courseTemplates.js'
			},
			schedulingApp: {
				cwd: '<%= folders.webapp.root %>',
				src: ['scheduling/**/*.html'],
				dest: '<%= folders.webapp.build %>/js/schedulingTemplates.js'
			},
			sharedApp: {
				cwd: '<%= folders.webapp.root %>',
				src: ['shared/**/*.html'],
				dest: '<%= folders.webapp.build %>/js/sharedTemplates.js'
			},
			summaryApp: {
				cwd: '<%= folders.webapp.root %>',
				src: ['summary/**/*.html'],
				dest: '<%= folders.webapp.build %>/js/summaryTemplates.js'
			},
			workgroupApp: {
				cwd: '<%= folders.webapp.root %>',
				src: ['workgroup/**/*.html'],
				dest: '<%= folders.webapp.build %>/js/workgroupTemplates.js'
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
					'<%= folders.webapp.root %>/shared/sharedInterceptors.js'
				],
				dest: '<%= folders.webapp.build %>/js/sharedConfig.js'
			},
			// Production Snippets from various 3rd party services
			jsProdSnippets: {
				src: [
					'vendor/js/userEcho.js',
					'vendor/js/googleAnalytics.js',
					'vendor/js/konami.js'
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
					'<%= folders.webapp.root %>/course/**/*.js',
					'<%= ngtemplates.courseApp.dest %>'
				],
				dest: '<%= folders.webapp.build %>/js/courseApp.js'
			},
			// adminApp module files
			jsAdmin: {
				src: [
					'<%= folders.webapp.root %>/admin/*.js',
					'<%= folders.webapp.root %>/admin/**/*.js',
					'<%= ngtemplates.adminApp.dest %>'
				],
				dest: '<%= folders.webapp.build %>/js/adminApp.js'
			},
			// workgroupApp module files
			jsWorkgroup: {
				src: [
					'<%= folders.webapp.root %>/workgroup/*.js',
					'<%= folders.webapp.root %>/workgroup/**/*.js',
					'<%= ngtemplates.workgroupApp.dest %>'
				],
				dest: '<%= folders.webapp.build %>/js/workgroupApp.js'
			},
			// summaryApp module files
			jsSummary: {
				src: [
					'<%= folders.webapp.root %>/summary/*.js',
					'<%= folders.webapp.root %>/summary/**/*.js',
					'<%= ngtemplates.summaryApp.dest %>'
				],
				dest: '<%= folders.webapp.build %>/js/summaryApp.js'
			},
			// assignmentApp module files
			jsAssignment: {
				src: [
					'<%= folders.webapp.root %>/assignment/*.js',
					'<%= folders.webapp.root %>/assignment/**/*.js',
					'<%= ngtemplates.assignmentApp.dest %>'
				],
				dest: '<%= folders.webapp.build %>/js/assignmentApp.js'
			},
			// schedulingApp module files
			jsScheduling: {
				src: [
					'<%= folders.webapp.root %>/scheduling/*.js',
					'<%= folders.webapp.root %>/scheduling/**/*.js',
					'<%= ngtemplates.schedulingApp.dest %>'
				],
				dest: '<%= folders.webapp.build %>/js/schedulingApp.js'
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
				src: ['**/*.html', '**/*.json'],
				dest: '<%= folders.webapp.build %>'
			},
			assets: {
				expand: true,
				cwd: '<%= folders.webapp.root %>/assets/',
				src: ['**/**/*'],
				dest: '<%= folders.webapp.build %>'
			},
			vendor_font: {
				expand: true,
				flatten: true,
				cwd: '',
				src: [
					'vendor/font/*'
				],
				dest: '<%= folders.webapp.build %>/font/'
			},
			vendor_fonts: {
				expand: true,
				flatten: true,
				src: [
					'bower_components/bootstrap/dist/fonts/*',
					'vendor/fonts/*'
				],
				dest: '<%= folders.webapp.build %>/fonts/'
			},
			vendor_css: {
				expand: true,
				flatten: true,
				src: [
					'bower_components/bootstrap/dist/css/*',
					'vendor/css/*'
				],
				dest: '<%= folders.webapp.build %>/css/'
			},
			vendor_js: {
				expand: true,
				flatten: true,
				src: [
					'bower_components/bootstrap/dist/js/*',
					'vendor/js/*'
				],
				dest: '<%= folders.webapp.build %>/js/'
			},
			css: {
				expand: true,
				flatten: true,
				cwd: '<%= folders.webapp.root %>',
				src: ['**/*.css'],
				dest: '<%= folders.webapp.build %>/css/'
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
				files: ['Gruntfile.js', 'bower.json', 'clientConfig.js', '<%= folders.webapp.root %>/**/*.js', '.eslintrc'],
				tasks: ['eslint', 'concat']
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

		eslint: {
			src: [
				'<%= folders.webapp.root %>/**/*.js',
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
	grunt.loadNpmTasks("gruntify-eslint");

	grunt.registerTask('build', ['clean', 'copy', 'ngtemplates', 'bower_concat', 'concat:jsShared', 'concat:jsConfig', 'concat:jsProdSnippets',
		'concat:jsCourse', 'concat:jsAdmin', 'concat:jsWorkgroup', 'concat:jsSummary', 'concat:jsAssignment', 'concat:jsScheduling', 'concat:cssLib', 'uglify:dist', 'cssmin']);

	grunt.registerTask('serve', ['clean', 'eslint', 'copy', 'ngtemplates', 'bower_concat', 'concat:jsShared', 'concat:jsConfig', 'concat:jsDevSnippets',
		'concat:jsCourse', 'concat:jsAdmin', 'concat:jsWorkgroup', 'concat:jsSummary', 'concat:jsAssignment', 'concat:jsScheduling', 'concat:cssLib', 'connect', 'watch']);

	grunt.registerTask('default', ['serve']);

};
