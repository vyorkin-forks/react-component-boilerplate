import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default (config) => ({
  preLoaders: [
    {
      test: /\.jsx?$/,
      loaders: ['eslint'],
      include: [
        config.paths.demo,
        config.paths.src
      ]
    }
  ],
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
  react: {
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['babel?cacheDirectory'],
          include: [
            config.paths.demo,
            config.paths.src
          ]
        }
      ]
    }
  },
  'dev:css': {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: config.paths.css
        }
      ]
    }
  },
  'production:css': {
    plugins: [
      new ExtractTextPlugin('styles.[chunkhash].css')
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: config.paths.css
        }
      ]
    }
  },
  "production:vendor": {
    entry: {
      app: config.paths.demo,
      vendors: [
        'react'
      ]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendors', 'manifest']
      })
    ]
  }
});
