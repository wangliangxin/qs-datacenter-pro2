/**
 * Override convention configuration
 * https://cli.vuejs.org/config/
 */

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/edu-boss-fed/' : '/',

    indexPath: 'template/index.html',
    assetsDir: 'assets',
    lintOnSave: process.env.NODE_ENV !== 'production',
    productionSourceMap: false,
    devServer: {
        // proxy: {
        //     '^/boss': {
        //         target: 'http://192.168.11.28:9001',
        //         pathRewrite: { '^/boss': '/boss' },
        //         changeOrigin: true
        //     },
        //     '^/front': {
        //         target: 'http://192.168.11.28:9001',
        //         pathRewrite: { '^/front': '/front' },
        //         changeOrigin: true
        //     }
        // }
        open: true
    }
}