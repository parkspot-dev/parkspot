const zlib = require('zlib');
const path = require('path');
module.exports = {
    devServer: {
        host: 'parkspot.localhost',
    },
    productionSourceMap: false, //  Setting this to false can speed up production builds if you don't need source maps for production.
    configureWebpack: (config) => {
        if (import.meta.env.NODE_ENV === 'production') {
            return {
                devtool: 'source-map',
            };
        }
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
            },
        },
    },
};
