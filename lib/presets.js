import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default (config) => ({
  eslint: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: [
          config.paths.demo,
          config.paths.src
        ]
      }
    ]
  },
  images: {
    resolve: {
      extensions: ['.png', '.jpg']
    },
    module: {
      loaders: [
        {
          test: /\.png$/,
          loader: 'url?limit=100000&mimetype=image/png',
          include: config.paths.demo
        },
        {
          test: /\.jpg$/,
          loader: 'file',
          include: config.paths.demo
        }
      ]
    }
  },
  json: {
    module: {
      loaders: [
        {
          test: /\.json$/,
          loader: 'json',
          include: config.paths.json
        }
      ]
    }
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
  react: {
    resolve: {
      extensions: ['.js', '.jsx']
    },
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
    resolve: {
      extensions: ['.css']
    },
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
    resolve: {
      extensions: ['.css']
    },
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
  'production:vendor': {
    entry: {
      app: config.paths.demo,
      vendors: [
        'react'
      ]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendors', 'manifest']
      }),
      new webpack.optimize.DedupePlugin()
    ]
  },
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
