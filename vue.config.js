const {defineConfig} = require('@vue/cli-service')
const webpack = require('webpack');
module.exports = defineConfig({
    transpileDependencies: true,

    //更改服务器默认端口(这里就是把默认端口8080改成了8082,这个项目我就不更改了)
       devServer: {
           open: false,//编译完成时打开网页
           port: 8082
       },

    configureWebpack: {
        plugins: [
            // Work around for Buffer is undefined:
            // https://github.com/webpack/changelog-v5/issues/10
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            })
        ],
        resolve: {
            fallback: {
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer")
            }
        }
    }
})
