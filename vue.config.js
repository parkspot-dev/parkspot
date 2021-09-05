const zlib = require('zlib');
module.exports = {
    pluginOptions: {
        sitemap: {
            urls: [
                'https://www.parkspot.in/',
                'https://www.parkspot.in/faq',
                'https://www.parkspot.in/thanks',
                'https://www.parkspot.in/srp',
                'https://www.parkspot.in/blog/eliminating-reason-for-traffic-jam',
                'https://www.parkspot.in/parkspot-near-you',
                'https://www.parkspot.in/parkspot-near-you/Jayanagar',
                'https://www.parkspot.in/parkspot-near-you/Vijaynagar',
                'https://www.parkspot.in/parkspot-near-you/Banashankari',
                'https://www.parkspot.in/parkspot-near-you/Marathahalli',
                'https://www.parkspot.in/parkspot-near-you/BTM%20Layout',

            ]
        }
    },
    productionSourceMap: false, //Setting this to false can speed up production builds if you don't need source maps for production.
    configureWebpack: {
        devtool: 'source-map'
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
