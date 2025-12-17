const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            // Правило для SVG файлов
            {
                test: /\.svg$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name][ext]',
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name][ext]',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'assets',
                    to: 'assets',
                    noErrorOnMissing: true,
                },
            ],
        }),
    ],
    devServer: {
        static: [
            {
                directory: path.join(__dirname, 'dist'),
                publicPath: '/',
            },
            {
                directory: path.join(__dirname, 'assets'),
                publicPath: '/assets',
                staticOptions: {
                    index: false,
                },
            },
        ],
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: {
            disableDotRule: true,
        },
        setupMiddlewares: (middlewares, devServer) => {
            devServer.app.get('*.svg', (req, res, next) => {
                res.set('Content-Type', 'image/svg+xml')
                next()
            })
            return middlewares
        },
        devMiddleware: {
            publicPath: '/',
            writeToDisk: true,
        },
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devtool: 'eval-source-map',
}
