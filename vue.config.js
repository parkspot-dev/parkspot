const zlib = require('zlib');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require("path");
module.exports = {
    productionSourceMap: false, //Setting this to false can speed up production builds if you don't need source maps for production.
    configureWebpack: {
        devtool: 'source-map',
        // ! pre-render code
        plugins: [
            new PrerenderSPAPlugin({
                // Absolute path to compiled SPA
                staticDir: path.resolve(__dirname, './dist'),
                // List of routes to prerender
                routes: ['/about', '/contact', '/features', '/faq', '/blog', '/blog/1', '/blog/2', '/blog/3'],

                // * If some thing goes wrong then
                // todo: In the Vue.config.js file, make headless to false. By default, 
                // todo: it comes false, but in case you have turned it to true then make it false.
            })
        ],
    },
    // compression code
    pluginOptions: {
        compression: {
            brotli: {
                filename: '[file].br[query]',
                algorithm: 'brotliCompress',
                include: /\.(js|css|html|svg|json)(\?.*)?$/i,
                compressionOptions: {
                    params: {
                        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                    },
                },
                minRatio: 0.8,
            },
            gzip: {
                filename: '[file].gz[query]',
                algorithm: 'gzip',
                include: /\.(js|css|html|svg|json)(\?.*)?$/i,
                minRatio: 0.8,
            }
        }
    }
}
