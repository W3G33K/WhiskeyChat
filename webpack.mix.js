let mix = require('laravel-mix'),
	env = process.env;

const PUBLIC_DIR = './public';
const USE_PRODUCTION_SRC_MAPS = false;

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

require('laravel-mix-polyfill');

mix.js('./resources/js/app.js', 'js')
	.js('./resources/js/pages/chat.js', 'js/pages')
	.js('./resources/js/pages/user.js', 'js/pages')
	.css('./resources/css/app.css', 'css')
	.setPublicPath(PUBLIC_DIR)
	.sourceMaps(USE_PRODUCTION_SRC_MAPS, 'source-map')
	.polyfill({
		enabled: true,
		useBuiltIns: "usage",
		targets: "firefox 50, IE 11"
	});

if (mix.inProduction() && env.APP_DEBUG === "false") {
	mix.version();
	mix.webpackConfig({
		module: {
			rules: [
				{
					test: /\.js$/,
					use: './whiskey-debug-stripper'
				}
			]
		}
	});
}
