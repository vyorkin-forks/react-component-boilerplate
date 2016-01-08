import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default (paths) => ({
  env: (target) => ({
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(target)
      })
    ]
  }),
  eslint: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        include: paths.jsx
      }
    ]
  },
  hmr: {
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      host: process.env.HOST,
      port: process.env.PORT,
      stats: 'errors-only'
    }
  },
  extractCSS: (name) => ({
    plugins: [
      new ExtractTextPlugin(name + '.[chunkhash].css')
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: paths.css
        }
      ]
    }
  }),
  generateCommonsChunk: (name) => ({
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: [name, 'manifest']
      }),
      new webpack.optimize.DedupePlugin()
    ]
  }),
  minify: {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  }
});
