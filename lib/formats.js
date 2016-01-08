export default (paths) => ({
  png: {
    resolve: {
      extensions: ['.png']
    },
    module: {
      loaders: [
        {
          test: /\.png$/,
          loader: 'url?limit=100000&mimetype=image/png',
          include: paths.png
        }
      ]
    }
  },
  jpg: {
    resolve: {
      extensions: ['.jpg']
    },
    module: {
      loaders: [
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
  babel: (format) => ({
    resolve: {
      extensions: ['.' + format]
    },
    module: {
      loaders: [
        {
          test: new RegExp('\.' + format + '$'),
          loader: 'babel?cacheDirectory',
          include: paths.babel
        }
      ]
    }
  }),
  css: {
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
  }
});
