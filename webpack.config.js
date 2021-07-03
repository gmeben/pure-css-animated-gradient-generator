const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const rules = [
    {
        test: /\.js$/,
        exclude: /node_module/,
        use: {
            loader: 'babel-loader'
        }
    },
    {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
            'style-loader', 'css-loader'
        ]
    }
]

module.exports = {
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './build')
    },
    module: {rules},
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
}