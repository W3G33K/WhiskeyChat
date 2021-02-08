const mix = require('laravel-mix');
const env = process.env;

const productionSourceMaps = false;
const publicPath = './public';

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

mix.js('./resources/js/app.js', 'js')
	.js('./resources/js/pages/chat.js', 'js/pages')
	.js('./resources/js/pages/user.js', 'js/pages')
	.css('./resources/css/app.css', 'css')
	.setPublicPath(publicPath)
	.sourceMaps(productionSourceMaps, 'source-map');
// console.log(typeof env.APP_DEBUG, env.APP_DEBUG, typeof env.APP_ENV, env.APP_ENV);
if ((env.APP_DEBUG !== "true") ||
	(['staging', 'production'].includes(env.APP_ENV) === true)) {
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
