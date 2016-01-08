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
  images: {
    resolve: {
      extensions: ['.png', '.jpg']
    },
    module: {
      loaders: [
        {
          test: /\.png$/,
          loader: 'url?limit=100000&mimetype=image/png',
          include: paths.png
        },
        {
          test: /\.jpg$/,
          loader: 'file',
          include: paths.jpg
        }
      ]
    }
  },
  json: {
    resolve: {
      extensions: ['.json']
    },
    module: {
      loaders: [
        {
          test: /\.json$/,
          loader: 'json',
          include: paths.json
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
          loader: 'babel?cacheDirectory',
          include: paths.jsx
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
          include: paths.css
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
          include: paths.css
        }
      ]
    }
  },
  commonsChunk: (name) => ({
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
