const Koa = require('koa')
const fs = require('fs')
const app = new Koa()

// 原生koa2实现路由
// /**
//  * 用Promise封装异步读取文件方法
//  * @param  {string} page html文件名称
//  * @return {promise}      
//  */
// const render = (page) => new Promise((resolve, reject) => {
//   let viewUrl = `./view/${page}`
//   fs.readFile(viewUrl, "binary", (err, data) => {
//     if (err) {
//       reject(err)
//     } else {
//       resolve(data)
//     }
//   })
// })

// /**
//  * 根据URL获取HTML内容
//  * @param  {string} url koa2上下文的url，ctx.url
//  * @return {string}     获取HTML文件内容
//  */
// async function route(url) {
//   let related = [
//     { view: "404.html", url: '/404' },
//     { view: "index.html", url: '/index' },
//     { view: 'index.html', url: '/' },
//     { view: 'todo.html', url: '/todo' }
//   ]
//   const getViewByUrl = (url, related) => {
//     let temp = related.find(item => item.url === url)
//     return temp? temp.view: '404.html'
//   }
//   let view = getViewByUrl(url, related)
//   let html = await render(view)
//   return html
// }

// app.use( async ( ctx ) => {
//   let url = ctx.request.url
//   let html = await route(url)
//   ctx.body = html
// })

// app.listen(3000)
// console.log('[demo] route-simple is starting at port 3000')


// koa-router中间件
const Router = require('koa-router')

let home = new Router()

// 子路由1
home.get('/', async (ctx) => {
  let html = `
    <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
    </ul>
  `
  ctx.body = html
})

// 子路由2
let page = new Router()

page.get('/404', async (ctx) => {
  ctx.body = '404.page'
}).get('/helloworld', async (ctx) => {
  ctx.body = 'helloworld page!'
})

// 装置所有子路由
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/page', page.routes(), page.allowedMethods())


// 加载路由中间件
app.use(router.routes(), router.allowedMethods())

app.listen(3000, () => {
  console.log('[demo] route-use-middleware is starting at port 3000')
})