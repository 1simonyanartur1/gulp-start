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
		result: './default/'
	},
	styles: {
		whatch: './src/layout/**/*.{scss,sass}',
		compile: './src/layout/common/*.{scss,sass}',
		result: './default/css/',
		libs: [
			'./src/files/libs/swiper/swiper-bundle.min.css', // slider
			'./src/files/libs/tingle-master/tingle.min.css', // modal windows
			'./src/files/libs/scrollbars/OverlayScrollbars.min.css', // suctom scrollbar
		]
	},
	scripts: {
		watch: './src/layout/**/*.js',
		compile: './src/layout/common/*.js',
		result: './default/js/',
		libs: [
			'./src/files/libs/Inputmask/inputmask.min.js', // telephone mask
			'./src/files/libs/swiper/swiper-bundle.min.js', // slider
			'./src/files/libs/tingle-master/tingle.min.js', // modal windows
			'./src/files/libs/scrollbars/OverlayScrollbars.min.js', // suctom scrollbar
			'./src/files/libs/anime.js', // suctom scrollbar
		]
	},
	images: {
		source: ['./src/layout/components/sprite/svg/*.svg', './src/layout/**/*.{jpg,jpeg,png,gif}', '!./src/layout/common/img/icons/**/*.{jpg,jpeg,png,gif}', './src/layout/common/img/*.{jpg,jpeg,png,gif,svg}', './src/layout/blocks/**/img/*.{jpg,jpeg,png,gif,svg}'],
		svgSource: './src/layout/common/img/icons/svg/*.svg',
		pngSource: './src/layout/common/img/icons/png/*.png',
		pngSource2x: './src/layout/common/img/icons/png/*-2x.png',
		result: './default/',
	},
	video: {
		source: './src/layout/blocks/**/*.{mp4,ogv,webm}',
		result: './default/'
	},
	fonts: {
		source: './src/files/fonts/**/*',
		result: './default/fonts/',
		css: './default/fonts/'
	},
	files: {
		source: './src/files/files/*',
		result: './default/files/',
	},
	favicon: {
		source: './src/files/favicon/*',
		result: './default/favicon/',
	},
	dirs: {
		src: './src/',
		default: './default/'
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
		plugins: [{
			optimizationLevel: 3
		},
		{
			progessive: true
		},
		{
			interlaced: true
		},
		{
			removeViewBox: false
		},
		{
			removeUselessStrokeAndFill: false
		},
		{
			cleanupIDs: false
		}
		]
	}),
	imagemin.gifsicle({
		interlaced: true
	}),
	imagemin.mozjpeg({
		quality: 75,
		progressive: true
	}),
	imagemin.optipng({
		optimizationLevel: 5
	}),
]

// Clear default directory
const clear = () => {
	return del(path.dirs.default)
}
exports.clear = clear;

// Clear prod directory
// const clearProd = () => {
// 	return del(path.dirs.prod)
// }
// exports.clearprod = clearProd;

// Clear cache of images etc.
const clearCache = () => {
	return cache.clearAll();
}
exports.clearcache = clearCache;

// Compile pug to html to default directory
const markupCompiller = () => {
	return src(path.markup.compile) // find pug
		.pipe(pug({
			pretty: true
		})) // compile to html
		.pipe(formatHtml()) // make html beautiful
		.on('error', notify.onError({
			message: "<%= error.message %>",
			title: "PUG Error!"
		}))
		.pipe(dest(path.markup.result)) // paste html
		.pipe(browserSync.stream()); // reload browser
}
exports.markupcompiller = markupCompiller; // start task

// Compile scss/sass to css to default directory
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

// Concat css libs to default directory
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

// Compile js to default directory
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

// Concat js libs to default directory
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

// Transfer images to default directory
const transferImg = () => {
	return src(path.images.source) // get images
		// .pipe(cache(imagemin(imageminOptions))) // generate images cache and minify them
		.pipe(rename(function (path) { // change path
			var pathDir = path.dirname.replace('img', '').replace('blocks', '');
			path.dirname = "/img/" + pathDir;
		}))
		.pipe(dest(path.images.result)) // paste images
}
exports.transferimg = transferImg;

// Transfer video to default directory
const transferVideo = () => {
	return src(path.video.source)
		.pipe(rename(function (path) {
			var pathDir = path.dirname.replace('video', '').replace('blocks', '');
			path.dirname = "/video/" + pathDir;
		}))
		.pipe(dest(path.video.result))
}
exports.transfervideo = transferVideo;

// Generate webp to default directory
const generateWebp = () => {
	return src(path.images.source) // get images
		.pipe(webp()) // generate webp format
		// .pipe(cache(imagemin(imageminOptions))) // generate images cache and minify them
		.pipe(rename(function (path) { // change path
			var pathDir = path.dirname.replace('img', '').replace('blocks', '');
			path.dirname = "/img/" + pathDir + "/webp/";
		}))
		.pipe(dest(path.images.result)) // paste images
}
exports.generatewebp = generateWebp;

// Generate png sprite to default directory
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

// Generate svg sprite to default directory
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

// Transfer fonts to default directory
const transferFonts = () => {
	return src(path.fonts.source)
		.pipe(dest(path.fonts.result))
}
exports.transferfonts = transferFonts;

// Transfer favicon to default directory
const transferFavicon = () => {
	return src(path.favicon.source)
		.pipe(dest(path.favicon.result))
}
exports.transferfavicon = transferFavicon;

// Transfer files to default directory
const transferFiles = () => {
	return src(path.files.source)
		.pipe(dest(path.files.result))
}
exports.transferfiles = transferFiles;

// Whatching task for default directory
const watchFiles = () => {
	browserSync.init({
		server: {
			baseDir: "../../assets/theme/default/"
		}
	});
	watch(path.markup.whatch, markupCompiller);
	watch(path.styles.whatch, styleCompiller);
	watch(path.styles.libs, cssLibs);
	watch(path.images.source, transferImg);
	watch(path.images.source, generateWebp);
	watch(path.video.source, transferVideo);
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
	clear,
	clearCache,
	parallel(markupCompiller, styleCompiller, jsCompiller, cssLibs, jsLibs, transferImg, generateWebp, transferVideo, transferFavicon, transferFiles, generateSvgSprite, generatePngSprite, transferFonts),
	watchFiles
);


// TASKS FOR PRODUCTION DIRECTORY


// Transfer css files to build
const prodStyles = () => {
	return src(path.styles.compile) // find styles
		// .pipe(sourcemaps.init()) // start making styles map
		.pipe(sass(gulpSassOptions).on('error', notify.onError({
			message: "<%= error.message %>",
			title: "Sass Error!"
		}))) // compile to css and show errors
		.pipe(autoprefixer(autoprefixerOptions)) // add prefixes
		.pipe(cleanCSS()) // remove garbage from css
		// .pipe(sourcemaps.write('.')) // finish making styles map
		.pipe(rename(function (path) { // change path
			path.extname = ".min.css";
		}))
		.pipe(dest(path.styles.result)) // output css
		.pipe(browserSync.stream()) // reload browser
}

exports.prodstyles = prodStyles;

// Transfer js files to build
const prodScripts = () => {
	return src(path.scripts.compile)
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
		.pipe(dest(path.scripts.result))
}
exports.prodscripts = prodScripts;

// Generate production directory
exports.build = series(
	clear,
	parallel(markupCompiller, prodStyles, prodScripts, cssLibs, jsLibs, transferImg, generateWebp, transferVideo, transferFavicon, transferFiles, generateSvgSprite, generatePngSprite, transferFonts),
);