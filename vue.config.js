const path = require('path')
const axios = require('axios')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    before(app) {
      app.get('/api/getDiscList', function (req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        'assets' : '@/assets',
        'common' : '@/common',
        'components': '@/components',
        'views': '@/views',
        'api': '@/api',
        'base': '@/base'
      }
    }
  },
  publicPath: './'
}
