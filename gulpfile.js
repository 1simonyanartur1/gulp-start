const {
	src,
	dest,
	series,
	parallel,
	watch
} = require('gulp');
// pug - html
const pug = require('gulp-pug');
const formatHtml = require('gulp-format-html');
// sass - css
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
// system
const del = require('del');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
// js
const uglify = require('gulp-uglify-es').default;
const webpackStream = require('webpack-stream');
// images
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const merge = require('merge-stream');
// svg
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

const path = {
	markup: {
		whatch: './src/layout/**/*.pug',
		compile: './src/layout/pages/*.pug',
		result: './app/'
	},
	styles: {
		whatch: './src/layout/**/*.{scss,sass}', 
		compile: './src/layout/common/*.{scss,sass}',
		result: './app/css/',
		libs: [
			'./src/assets/libs/swiper/swiper-bundle.min.css', // slider
			'./src/assets/libs/tingle-master/tingle.min.css', // modal windows
			'./src/assets/libs/spotlight/spotlight.min.css', // gallery like fancybox
			'./src/assets/libs/beerslider/BeerSlider.css' // before-after slider
		]
	},
	scripts: {
		watch: './src/layout/**/*.js',
		compile: './src/layout/common/*.js',
		result: './app/js/',
		libs: [
			'./src/assets/libs/Inputmask/inputmask.min.js', // telephone mask
			'./src/assets/libs/swiper/swiper-bundle.min.js', // slider
			'./src/assets/libs/tingle-master/tingle.min.js', // modal windows
			'./src/assets/libs/spotlight/spotlight.min.js', // gallery like fancybox
			'./src/assets/libs/beerslider/BeerSlider.js' // before-after slider
		]
	},
	images: {
		source: ['./src/layout/components/sprite/svg/*.svg', './src/layout/**/*.{jpg,jpeg,png,gif}', '!./src/layout/common/img/icons/**/*.{jpg,jpeg,png,gif}', './src/layout/common/img/*.{jpg,jpeg,png,gif,svg}'],
		svgSource: './src/layout/common/img/icons/svg/*.svg',
		pngSource: './src/layout/common/img/icons/png/*.png',
		pngSource2x: './src/layout/common/img/icons/png/*-2x.png',
		result: './app/',
	},
	fonts: {
		source: './src/assets/fonts/**/*',
		result: './app/fonts/',
		css: './app/fonts/'
	},
	files: {
		source: './src/assets/files/*',
		result: './app/files/',
	},
	favicon: {
		source: './src/assets/favicon/*',
		result: './app/favicon/',
	},
	dirs: {
		src: './src/',
		app: './app/',
		prod: './prod/'
	}
}

// tasks options
var cleanCSSOptions = {
	// compatibility: 'ie10',
	format: 'beautify',
	level: {
		0: {
			specialComments: 0
		}
	}
}
var gulpSassOptions = {
	outputStyle: 'expanded',
	sourceComments: true
}
var autoprefixerOptions = {
	overrideBrowserslist: ['last 2 versions'],
	grid: "autoplace",
}
var pngSpriteOptions = {
	imgName: 'sprite.png',
	imgPath: '../img/sprite.png',
	cssName: 'sprite.css',
	retinaSrcFilter: path.images.pngSource2x,
	retinaImgName: 'sprite-2x.png',
	retinaImgPath: '../img/sprite-2x.png',
	padding: 5
}
var imageminOptions = [
	imagemin.svgo({
		plugins: [
			{ optimizationLevel: 3 },
			{ progessive: true },
			{ interlaced: true },
			{ removeViewBox: false },
			{ removeUselessStrokeAndFill: false },
			{ cleanupIDs: false }
		]
	}),
	imagemin.gifsicle({ interlaced: true }),
	imagemin.mozjpeg({ quality: 75, progressive: true }),
	imagemin.optipng({ optimizationLevel: 5 }),
]

// Clear app directory
const clearApp = () => {
	return del(path.dirs.app)
}
exports.clearapp = clearApp;

// Clear prod directory
const clearProd = () => {
	return del(path.dirs.prod)
}
exports.clearprod = clearProd;

// Clear cache of images etc.
const clearCache = () => {
	return cache.clearAll();
}
exports.clearcache = clearCache;

// Compile pug to html to app directory
const markupCompiller = () => {
	return src(path.markup.compile) // find pug
		.pipe(pug({ pretty: true })) // compile to html
		.pipe(formatHtml()) // make html beautiful
		.on('error', notify.onError({
			message: "<%= error.message %>",
			title: "PUG Error!"
		}))
		.pipe(dest(path.markup.result)) // paste html
		.pipe(browserSync.stream()); // reload browser
}
exports.markupcompiller = markupCompiller; // start task

// Compile scss/sass to css to app directory
const styleCompiller = () => {
	return src(path.styles.compile) // find styles
		// .pipe(sourcemaps.init()) // start making styles map
		.pipe(sass(gulpSassOptions).on('error', notify.onError({
			message: "<%= error.message %>",
			title: "Sass Error!"
		}))) // compile to css and show errors
		.pipe(autoprefixer(autoprefixerOptions)) // add prefixes
		.pipe(cleanCSS(cleanCSSOptions)) // remove garbage from css
		// .pipe(sourcemaps.write('.')) // finish making styles map
		.pipe(rename(function (path) { // change path
			path.extname = ".min.css";
		}))
		.pipe(dest(path.styles.result)) // output css
		.pipe(browserSync.stream()) // reload browser
}
exports.stylecompiller = styleCompiller;

// Concat css libs to app directory
const cssLibs = () => {
	return src(path.styles.libs)
		.pipe(concat('libs.min.css'), {
			allowEmpty: true
		})
		.pipe(cleanCSS())
		.pipe(dest(path.styles.result))
		.pipe(browserSync.stream())
}
exports.csslibs = cssLibs;

// Compile js to app directory
const jsCompiller = () => {
	return src(path.scripts.compile)
		.pipe(webpackStream({
			mode: 'none', // development production none
			output: {
				filename: 'common.min.js'
			},
			module: {
				rules: [{
					test: /\.m?js$/,
					exclude: /node_modules|bower_components/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								['@babel/preset-env', {
									targets: "defaults"
								}]
							]
						}
					}
				}]
			}
		}))
		// .pipe(uglify().on("error", notify.onError()))
		.pipe(dest(path.scripts.result))
		.pipe(browserSync.stream())
}
exports.jscompiller = jsCompiller;

// Concat js libs to app directory
const jsLibs = () => {
	return src(path.scripts.libs)
		.pipe(concat('libs.min.js'), {
			allowEmpty: true
		})
		.pipe(uglify())
		.pipe(dest(path.scripts.result))
		.pipe(browserSync.stream())
}
exports.jslibs = jsLibs;

// Transfer images to app directory
const transferImg = () => {
	return src(path.images.source) // get images
		.pipe(cache(imagemin(imageminOptions))) // generate images cache and minify them
		.pipe(rename(function (path) { // change path
			var pathDir = path.dirname.replace('img', '').replace('blocks', '');
			path.dirname = "/img/" + pathDir;
		}))
		.pipe(dest(path.images.result)) // paste images
}
exports.transferimg = transferImg;

// Generate webp to app directory
const generateWebp = () => {
	return src(path.images.source) // get images
	.pipe(webp()) // generate webp format
	.pipe(cache(imagemin(imageminOptions))) // generate images cache and minify them
	.pipe(rename(function (path) { // change path
		var pathDir = path.dirname.replace('img', '').replace('blocks', '');
		path.dirname = "/img/" + pathDir + "/webp/";
	}))
	// .pipe(rename(function (path) { // change path
	// 	path.dirname = "img/webp/";
	// }))
	.pipe(dest(path.images.result)) // paste images
}
exports.generatewebp = generateWebp;

// Generate png sprite to app directory
const generatePngSprite = () => {
	var spriteData =
		src(path.images.pngSource)
		.pipe(spritesmith(pngSpriteOptions));

	var imgStream = spriteData.img
		.pipe(buffer())
		.pipe(imagemin(imageminOptions))
		.pipe(rename(function (path) { // change path
			path.dirname = "img";
		})) 
		.pipe(dest(path.images.result));

	var cssStream = spriteData.css
		.pipe(dest(path.styles.result));

	return merge(imgStream, cssStream);
}
exports.generatepngsprite = generatePngSprite;

// Generate svg sprite to app directory
const generateSvgSprite = () => {
	return src(path.images.svgSource) // get svg files for sprite
		.pipe(svgmin({ // minify svg
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {
				xmlMode: true
			}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				inline: true,
				bust: true,
				symbol: {
					dest: 'img',
					sprite: "sprite.svg",
				}
			}
		}))
		.pipe(dest(path.images.result));
}
exports.generatesvgsprite = generateSvgSprite;

// Transfer fonts to app directory
const transferFonts = () => {
	return src(path.fonts.source)
		.pipe(dest(path.fonts.result))
}
exports.transferfonts = transferFonts;

// Transfer favicon to app directory
const transferFavicon = () => {
	return src(path.favicon.source)
		.pipe(dest(path.favicon.result))
}
exports.transferfavicon = transferFavicon;

// Transfer files to app directory
const transferFiles = () => {
	return src(path.files.source)
		.pipe(dest(path.files.result))
}
exports.transferfiles = transferFiles;

// Whatching task for app directory
const watchFiles = () => {
	browserSync.init({
		server: {
			baseDir: "./app/"
		}
	});
	watch(path.markup.whatch, markupCompiller);
	watch(path.styles.whatch, styleCompiller);
	watch(path.styles.libs, cssLibs);
	watch(path.images.source, transferImg);
	watch(path.images.source, generateWebp);
	watch(path.images.pngSource, generatePngSprite);
	watch(path.images.svgSource, generateSvgSprite);
	watch(path.favicon.source, transferFavicon);
	watch(path.files.source, transferFiles);
	watch(path.scripts.libs, jsLibs);
	watch(path.scripts.watch, jsCompiller);
	watch(path.fonts.source, transferFonts);
}
exports.watchFiles = watchFiles;

// Launch gulp - "gulp"
exports.default = series(
	clearApp,
	clearCache,
	parallel(markupCompiller, styleCompiller, jsCompiller, cssLibs, jsLibs, transferImg, generateWebp, transferFavicon, transferFiles, generateSvgSprite, generatePngSprite, transferFonts),
	// parallel(markupCompiller, styleCompiller, jsCompiller, cssLibs, jsLibs, transferImg, generateWebp, transferFavicon, transferFiles, generatePngSprite, generateSvgSprite, transferFonts),
	watchFiles
);


// TASKS FOR PRODUCTION DIRECTORY


// Transfer css files to build
const prodStyles = () => {
	return src('./app/css/common.min.css')
		.pipe(cleanCSS()) // minify css
		// .pipe(rename(function (path) { // change path
		// 	path.extname = ".min.css";
		// }))
		.pipe(dest('./prod/css/'))
}
exports.prodstyles = prodStyles;

// Transfer js files to build
const prodScripts = () => {
	return src('./app/js/common.min.js')
		.pipe(webpackStream({
			mode: 'production', // development production none
			output: {
				filename: 'common.min.js'
			},
			module: {
				rules: [{
					test: /\.m?js$/,
					exclude: /node_modules|bower_components/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								['@babel/preset-env', {
									targets: "defaults"
								}]
							]
						}
					}
				}]
			}
		}))
		.pipe(uglify())
		.pipe(dest('./prod/js/'))
}
exports.prodscripts = prodScripts;

// Transfer files to build
const prod = () => {
	return src([
			'./app/**/*',
			'!./app/css/common.min.css', '!./app/css/*.map', '!./app/js/common.min.js',
		])
		.pipe(dest(path.dirs.prod))
}
exports.prod = prod;

// Generate production directory
exports.build = series(
	clearProd,
	prod,
	prodStyles,
	prodScripts
);