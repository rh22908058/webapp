'use strict'
require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')
var axios = require('axios')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
var apiRoutes = express.Router()
const compiler = webpack(webpackConfig)
//同城事件，参数loc=108288定位北京
//https://api.douban.com/v2/event/list?loc=108288&start=20&count=10
//热门读物
//https://api.douban.com/v2/book/search?tag=热门&count=10&start=10
//热门音乐
//https://api.douban.com/v2/music/search?tag=热门&count=10&start=10
//热门电影
//https://api.douban.com/v2/movie/search?tag=热门&count=10&start=10
//start的偏移量用当前记录数组长度表示，如
//`https://api.douban.com/v2/book/search?tag=热门&count=10&start=${this.books.length}`
/*
apiRoutes.get('/getBooks', function (req, res) {
  var url = 'https://book.douban.com/j/home/ebooks?user_id='
  console.log('getbooks')
  axios.get(url, {
    headers: {
      host: 'api.douban.com',
      referer:'https://book.douban.com/'
    },
    params: req.query
  }).then((response) => {
    cosnole.log(res)
    //res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
*/
/*
apiRoutes.get('/getBooks', function (req, res) {
  var url = 'https://api.douban.com/v2/book/1220562'
  axios.get(url, {
    headers: {
      host: 'api.douban.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getTest', function (req, res) {
  var url = 'https://api.douban.com/v2/movie/search?q=我&count=10&start=10'
  axios.get(url, {
    headers: {
      host: 'api.douban.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
*/
//http://m.kugou.com/?json=true
apiRoutes.get('/getNewList', function (req, res) {
  var url = 'http://m.kugou.com'
  axios.get(url, {
    headers: {
      host: 'm.kugou.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
apiRoutes.get('/getHash', function (req, res) {
  var url = 'http://mobilecdn.kugou.com/api/v3/search/song'
  axios.get(url, {
    headers: {
      host: 'mobilecdn.kugou.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
apiRoutes.get('/getSong', function (req, res) {
  var url = 'http://www.kugou.com/yy/index.php'
  axios.get(url, {
    params: req.query
  }).then((response) => {
    var ret = response.data
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
app.use('/api', apiRoutes)
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
